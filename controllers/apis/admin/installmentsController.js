const moment = require('moment');
const models = require('../../../models');
const validator = require('../../../middlewares/apis/admin/installmentsValidator');
const untilHelper = require('../../../helpers/util');
const {investorQueue} = require('../../../crons/backendQueue');
const aggrigationsHelper = require('../../../helpers/aggregationsHelper');

const amountRound = untilHelper.roundAmount;
const getPercentage = untilHelper.getPercentage;

exports.installmentsListGet = (req, res, next) => {
    models.Installment.findAll({
        order: ['dueDate'],
    }).then(installments => {
        res.status(200).json({installments: installments});
    }).catch(error => {
        res.status(500).json({message: error.message});
    })
};


exports.installmentDetailGet = async (req, res, next) => {
    const installmentId = req.params.id;
    let installment = await models.Installment.findByPk(installmentId, {
        include: [
            {
                model: models.Loan, include: [
                    {model: models.Borrower}
                ]
            }
        ]
    });
    if (installment) {
        //check for late installment
        let installmentLateFee = await aggrigationsHelper.calculateInstallmentLateFee(installment.dueDate, installment.payableAmount);
        installment.dataValues.payableAmount = amountRound(installment.dataValues.payableAmount + installmentLateFee);
        installment.dataValues.installmentLateFee = amountRound(installmentLateFee);
        res.status(200).json({installment: installment});
    } else {
        res.status(400).json({message: 'Not installment found with provided id.'})
    }

};


exports.payInstallmentPost = [
    validator.payInstallmentValidator,

    async (req, res, next) => {
        let installment = req.installment;
        let amountToPay = parseFloat(req.body.amount);
        let aggregation = req.installmentAggre;

        let interestAmount = 0;
        let principleAmount = 0;
        let companyPercentage = 0;
        let loanPercentage = 0;

        let paidAmount = aggregation.dataValues.paidAmount;
        let paidInterest = aggregation.dataValues.paidInterestAmount;
        let paidPrinciple = aggregation.dataValues.paidPrincipalAmount;
        let paidInstallmentLateFee = aggregation.dataValues.paidInstallmentLateFee;

        paidAmount = (paidAmount) ? parseFloat(paidAmount) : 0;
        paidInterest = (paidInterest) ? parseFloat(paidInterest) : 0;
        paidPrinciple = (paidPrinciple) ? parseFloat(paidPrinciple) : 0;
        paidInstallmentLateFee = (paidInstallmentLateFee) ? parseFloat(paidInstallmentLateFee) : 0;

        //check for late installment
        let installmentLateFee = await aggrigationsHelper.calculateInstallmentLateFee(installment.dueDate, installment.payableAmount);


        let remainingAmount = installment.payableAmount + installmentLateFee - paidAmount;
        let remainingInterest = installment.interestAmount - paidInterest;
        let remainingPrinciple = installment.principalAmount - paidPrinciple;
        let remainingInstallmentLateFee = installmentLateFee - paidInstallmentLateFee;

        if (amountToPay >= amountRound(remainingAmount)) {
            installment.status = 'PAID';
            installment.paidAt = moment().format('YYYY-MM-DD');
            interestAmount = remainingInterest;
            principleAmount = remainingPrinciple;
        } else if (amountToPay >= amountRound(remainingInterest)) {
            interestAmount = remainingInterest;
            principleAmount = amountToPay - interestAmount - remainingInstallmentLateFee;
        } else {
            interestAmount = amountToPay - remainingInstallmentLateFee;
            principleAmount = 0;
        }

        interestAmount = amountRound(interestAmount);
        principleAmount = amountRound(principleAmount);
        companyPercentage = getPercentage(interestAmount, req.loan.companyPercentage);
        companyPercentage = (!companyPercentage) ? 0 : companyPercentage;
        loanPercentage = interestAmount - companyPercentage;
        loanPercentage = amountRound(loanPercentage);

        models.sequelize.transaction((t) => {
            return installment.save({transaction: t}).then(installment_q => {
                installment = installment_q;
                return models.Transaction.bulkCreate([
                    {
                        loanId: req.loan.id,
                        userId: req.loan.Borrower.userId,
                        installmentId: installment.id,
                        amount: amountToPay,
                        principalAmount: principleAmount,
                        interestAmount: interestAmount,
                        loanInterestAmount: loanPercentage,
                        installmentLateFee: remainingInstallmentLateFee,
                        companyInterestAmount: companyPercentage,
                        transactionFlow: 'DEBITED',
                        type: 'LOAN_RETURN',
                        comment: 'Borrower returned loan amount.'
                    }, {
                        loanId: req.loan.id,
                        installmentId: installment.id,
                        amount: amountToPay,
                        principalAmount: principleAmount,
                        interestAmount: interestAmount,
                        installmentLateFee: remainingInstallmentLateFee,
                        loanInterestAmount: loanPercentage,
                        companyInterestAmount: companyPercentage,
                        transactionFlow: 'CREDITED',
                        type: 'LOAN_RETURN',
                        comment: 'Borrower returned loan amount.'
                    }
                ], {transaction: t}).then((gs_result) => {
                    return models.LoanBook.findOne().then((companyDetail) => {
                        companyDetail.cashPool = companyDetail.cashPool + interestAmount + remainingInstallmentLateFee;
                        companyDetail.interestIncome = companyDetail.interestIncome + interestAmount;
                        companyDetail.fees = companyDetail.fees + companyPercentage + remainingInstallmentLateFee;
                        return companyDetail.save({transactions: t})
                    }, {transactions: t})
                }, {transaction: t});
            })

        }).then(last_result => {

            // loanPercentage
            investorQueue.add('distributeShare', {recoveryAmount: loanPercentage})
            models.Transaction.findAll({where: {installmentId: installment.id}, order: [['id', 'DESC']], limit: 2})
                .then(tran => {
                    models.Installment.findAndCountAll({
                        where: {loanId: req.loan.id, status: 'PAYMENT_DUE'}
                    }).then(result => {
                        if (!result.count) {
                            req.loan.status = 'TERMINATED';
                            req.loan.save().then(loan => {
                                res.status(200).json({installment: installment, transaction: tran, loan: loan})
                            })
                        } else {
                            res.status(200).json({installment: installment, transaction: tran})
                        }
                    });
                })
        }).catch(error => {
            res.status(500).json({message: error})
        });
    }
];