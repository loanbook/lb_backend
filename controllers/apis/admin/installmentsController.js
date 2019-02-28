const moment = require('moment');
const models = require('../../../models');
const validator = require('../../../middlewares/apis/admin/installmentsValidator');
const untilHelper = require('../../../helpers/util');

const amountRound = untilHelper.roundAmount;


exports.installmentsListGet = (req, res, next) => {
	models.Installment.findAll({
		order: ['dueDate'],
	}).then(installments => {
		res.status(200).json({installments: installments});
	}).catch(error => {
		res.status(500).json({message: error.message});
	})
};


exports.installmentDetailGet = (req, res, next) => {
	const installmentId = req.params.id;
	models.Installment.findByPk(installmentId, {
		include: [
			{model: models.Loan, include:[
					{model: models.Borrower}
				]}
		]
	}).then(installment => {
		if(installment)
			res.status(200).json({installment: installment});
		else
			res.status(400).json({message: 'Not installment found with provided id.'})
	}).catch(error => {
		res.status(500).json({message: error.message});
	})
};


exports.payInstallmentPost = [
	validator.payInstallmentValidator,

	async (req, res, next) => {
		let installment = req.installment;
		let amountToPay = parseFloat(req.body.amount);
		let aggregation = req.installmentAggre;

		let interestAmount = 0;
		let principleAmount = 0;

		let paidAmount = aggregation.dataValues.paidPrincipalAmount;
		let paidInterest = aggregation.dataValues.paidInterestAmount;
		let paidPrinciple = aggregation.dataValues.paidPrincipalAmount;

		paidAmount = (paidAmount) ? parseFloat(aggregation.dataValues.paidPrincipalAmount) : 0;
		paidInterest = (paidInterest) ? parseFloat(paidInterest) : 0;
		paidPrinciple = (paidPrinciple) ? parseFloat(paidPrinciple) : 0;

		let remainingAmount = installment.payableAmount - paidAmount;
		let remainingInterest = installment.interestAmount - paidInterest;
		let remainingPrinciple = installment.principalAmount - principleAmount;


		if(amountToPay >= remainingAmount){
			installment.status = 'PAID';
			installment.paidAt = moment().format('YYYY-MM-DD');
			interestAmount = remainingInterest;
			principleAmount = remainingPrinciple;
		}
		else if(amountToPay >= remainingInterest ){
			interestAmount = amountToPay - remainingInterest;
			principleAmount = amountToPay - interestAmount;
		}
		else{
			interestAmount = remainingInterest - amountToPay;
			principleAmount = 0;
		}

		interestAmount = amountRound(interestAmount);
		principleAmount = amountRound(principleAmount);

		models.sequelize.transaction((t) => {
			return installment.save({transaction: t}).then(installment_q => {
				installment = installment_q;
				return models.Transaction.bulkCreate([
					{
						loanId: req.loan.id,
						userId: req.loan.Borrower.userId,
						installmentId: installment.id,
						amount: amountToPay,
						interestAmount: interestAmount,
						principalAmount: principleAmount,
						transactionFlow: 'DEBITED',
						type: 'LOAN_RETURN',
						comment: 'Borrower returned loan amount.'
					},{
						loanId: req.loan.id,
						installmentId: installment.id,
						amount: amountToPay,
						interestAmount: interestAmount,
						principalAmount: principleAmount,
						transactionFlow: 'CREDITED',
						type: 'LOAN_RETURN',
						comment: 'Borrower returned loan amount.'
					}
				], {transaction: t})
			})

		}).then(last_result => {

			models.Transaction.findAll({where: {installmentId: installment.id}, order: [['id', 'DESC']], limit: 2})
				.then(tran => {
					res.status(200).json({installment: installment, transaction: tran})
				})
		}).catch(error => {
			res.status(500).json({message: error})
		});
	}
];