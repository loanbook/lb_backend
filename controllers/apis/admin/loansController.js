const moment = require('moment');
const models = require('../../../models');
const loanValidators = require('../../../middlewares/apis/admin/loansValidators');
const installmentHelper = require('../../../helpers/installmentsHelper');
const utilHelper = require('../../../helpers/util');
const aggrigationsHelper = require('../../../helpers/aggregationsHelper');

const roundAmount = utilHelper.roundAmount;

/*
	@param: loan (Loan Model object)
*/

addLoanInstallments = async (loan) => {
	let installments = [];
	if (loan.loanType === 'FIXED_INTEREST') {
		installments = installmentHelper.finalAmortSchedule(loan.duration, loan.loanDate, loan.interestRate, loan.amount);
	} else if (loan.loanType === 'REGULAR_INTEREST') {
		installments = installmentHelper.noAmortSchedule(loan.duration, loan.loanDate, loan.interestRate, loan.amount);
	}

	let instData = [];
	for (let index in installments) {
		let installment = installments[index];
		instData.push({
			loanId: loan.id,
			payableAmount: roundAmount(installment.payment),
			principalAmount: roundAmount(installment.principal),
			interestAmount: roundAmount(installment.interest),
			dueAmount: roundAmount(installment.balance),
			dueDate: installment.due_date,
			status: installment.tracking,
		})
	}
	let q_installments = await models.Installment.bulkCreate(instData);
	return await models.Installment.findAll({ where: { loanId: loan.id } });
};


exports.listLoansGet = [
	async (req, res, next) => {
		models.Loan.findAll({
			include: [
				{ model: models.Borrower }
			]
		}).then(q_res => {
			res.status(200).json({ loans: q_res });
		}).catch(error => {
			res.status(500).json({ message: error.message });
		})
	}
];

exports.detailLoanGet = [
	async (req, res, next) => {
		const loanId = req.params.id;
		let loanDetail = await models.Loan.findOne({
			where: { id: loanId },
			include: [
				{ model: models.Borrower },
				{ model: models.Installment },
			],
		});
		if (loanDetail) {
			let laon_aggregation_res = await aggrigationsHelper.updateLoanAggregations(loanId)
			if (laon_aggregation_res) {
				loanDetail.dataValues.total_paid_amount = laon_aggregation_res.dataValues.paid_amount;
				loanDetail.dataValues.total_paid_installments = laon_aggregation_res.dataValues.total_paid_installments;
				loanDetail.dataValues.late_installment_fee = await aggrigationsHelper.fetchLateInstallmentFee(loanId);
				loanDetail.dataValues.installment_interest_till_today = await aggrigationsHelper.fetchInstallmentInterestTillToday(loanId);
				res.status(200).json({ loan: loanDetail });
			}
			else res.status(200).json({ loan: loanDetail });

		}
		else res.status(404).json({ message: 'No loan is found against provided loan id.' })
	}
];

exports.createLoanPost = [

	loanValidators.createLoanReqValidator,

	async (req, res, next) => {

		let date = moment(req.body.loanDate, "YYYY-MM-DD", true);
		let currentDate = moment();
		let status = 'IN_REVIEW';
		let transactions = [];

		if (date.isSame(currentDate, 'Date')) {
			status = 'OPEN'
		} else {
			status = req.body.status;
		}

		models.Loan.create({
			amount: req.body.amount,
			duration: req.body.duration,
			interestRate: req.body.interestRate,
			borrowerId: req.borrower.userId,
			status: status,
			loanType: req.body.loanType,
			loanDate: req.body.loanDate,
			companyPercentage: req.body.companyPercentage
		}).then(q_res => {
			q_res.dataValues.Borrower = req.borrower;
			if (q_res.status === 'APPROVED' || q_res.status === 'OPEN') {
				addLoanInstallments(q_res).then(installments => {
					q_res.dataValues.Installment = installments;
					if (status === 'OPEN') {
						models.sequelize.transaction(((t) => {
							return models.Transaction.create({
								loanId: q_res.id,
								type: 'LOAN',
								transactionFlow: 'DEBITED',
								amount: q_res.amount,
								principalAmount: q_res.amount,
								interestAmount: 0,
								comment: 'Loan Transaction.'
							}, { transaction: t }).then(t1 => {
								transactions.push(t1);
								return models.Transaction.create({
									userId: req.borrower.userId,
									loanId: q_res.id,
									type: 'LOAN',
									transactionFlow: 'CREDITED',
									amount: q_res.amount,
									principalAmount: q_res.amount,
									interestAmount: 0,
									comment: 'Loan Transaction.'
								}, { transactions: t })
							})
						})).then(t2 => {
							transactions.push(t2);
							res.status(200).json({ loan: q_res, transactions: transactions })
						})
					} else {
						res.status(200).json({ loan: q_res });
					}

				});
			} else {
				res.status(200).json({ loan: q_res });
			}
		}).catch(error => {
			res.status(500).json({ message: error.message });
		});
	}
];


exports.updateLoanPut = [

	loanValidators.updateLoanReqValidator,

	async (req, res, next) => {

		const loan = req.loan;
		let date = moment(req.body.loanDate, "YYYY-MM-DD", true);
		let currentDate = moment();
		let status = 'IN_REVIEW';
		let transactions = [];

		if (date.isSame(currentDate, 'Date')) {
			status = 'OPEN'
		} else {
			status = req.body.status;
		}

		loan.amount = req.body.amount;
		loan.duration = req.body.duration;
		loan.interestRate = req.body.interestRate;
		loan.status = status;
		loan.type = req.body.type;
		loan.loanDate = req.body.loanDate;
		loan.loanType = req.body.loanType;
		loan.companyPercentage = req.body.companyPercentage;

		loan.save().then(q_res => {
			q_res.dataValues.Borrower = req.borrower;
			if (q_res.status === 'APPROVED' || q_res.status === 'OPEN') {
				addLoanInstallments(q_res).then(installments => {
					q_res.dataValues.Installment = installments;
					if (status === 'OPEN') {
						models.sequelize.transaction(((t) => {
							return models.Transaction.create({
								loanId: q_res.id,
								type: 'LOAN',
								transactionFlow: 'DEBITED',
								amount: q_res.amount,
								principalAmount: q_res.amount,
								interestAmount: 0,
								comment: 'Loan Transaction.'
							}, { transaction: t }).then(t1 => {
								transactions.push(t1);
								return models.Transaction.create({
									userId: req.borrower.userId,
									loanId: q_res.id,
									type: 'LOAN',
									transactionFlow: 'CREDITED',
									amount: q_res.amount,
									principalAmount: q_res.amount,
									interestAmount: 0,
									comment: 'Loan Transaction.'
								}, { transactions: t }).then(t2 => {
									transactions.push(t2);
									return models.LoanBook.findOne().then((companyDetail) => {
										if (companyDetail.cashPool >= q_res.amount) {
											companyDetail.cashPool = companyDetail.cashPool - q_res.amount;
											companyDetail.loanApprovedAmount = companyDetail.loanApprovedAmount + q_res.amount;
											return companyDetail.save({ transactions: t })
										} else {
											throw new Error();
										}
									}, { transactions: t })
								})
							})
						})).then(t2 => {
							res.status(200).json({ loan: q_res, transactions: transactions })
						})
					} else {
						res.status(200).json({ loan: q_res });
					}

				});
			} else {
				res.status(200).json({ loan: q_res });
			}
		}).catch(error => {
			res.status(500).json({ message: error.message })
		})
	}
];


exports.loanDelete = [
	async (req, res, next) => {
		const loanId = req.params.id;
		models.Loan.findOne({ where: { id: loanId } }).then(q_res => {
			if (!q_res) {
				res.status(400).json({ message: 'No loan is found against provided loan id.' })
			} else {
				q_res.destroy().then(dq_res => {
					res.status(200).json({ message: 'Loan has been deleted successfully.', loan: q_res })
				})
			}
		}).catch(error => {
			res.status(500).json({ message: error.message });
		});
	}
];