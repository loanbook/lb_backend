const percent = require('percent');
const models = require('../../../models');
const validator = require('../../../middlewares/apis/admin/loanInvestmentValidator');


exports.listLoanInvestmentsGet = [
	(req, res, next) => {
		models.LoanInvestment.findAll({
			include: [
				{model: models.Loan},
				{model: models.Invester}
			]
		}).then(q_res => {
			res.status(200).json({loanInvestments: q_res});
		}).catch(error => {
			res.status(500).json({message: error.message});
		})
	}
];

exports.detailLoanInvestmentGet = [

	(req, res, next) => {
		const loanInvestmentId = req.params.id;
		models.LoanInvestment.findByPk(loanInvestmentId, {
			include: [
				{model: models.Loan},
				{model: models.Invester}
			]
		}).then(q_res => {
			res.status(200).json({loanInvestment: q_res});
		}).catch(error => {
			res.status(500).json({message: error.message});
		});
		res.status(200).json({})
	}
];

exports.createLoanInvestment = [

	validator.createLoanInvestmentValidator,

	(req, res, next) => {
		const investedAmount = parseFloat(req.body.investedAmount);
		let loan = req.loan;
		let investor = req.investor;
		let currentBalance = investor.availableBalance;
		let remainingBalance = investor.availableBalance - investedAmount;

		models.Sequelize.Transaction().then(t => {
			return models.LoanInvestment.create({
				loanId: loan.id,
				investorId: investor.id,
				investedAmount: req.body.investedAmount,
				percentage: percent.calc(investedAmount, loan.amount, 0)
			}, {transaction: t}).then(loanInvestment => {
				investor.availableBalance = remainingBalance;
				investor.save({transaction: t}).then(q_investor => {
					models.Transaction.create({
						userId: investor.userId,
						loanId: loan.id,
						amount: investedAmount,
						currentBalance: currentBalance,
						closingBalance: remainingBalance,
						type: 'LOAN_INVESTMENT-DEBITED'
					}, {transaction: t}).then(debitedTran => {

					})
				})
			})
		}).catch(function (err) {
			console.log(err);
			return t.rollback();
		});

		/**
		models.LoanInvestment.create({
			loanId: loan.id,
			investorId: investor.id,
			investedAmount: req.body.investedAmount,
			percentage: percent.calc(investedAmount, loan.amount, 0)
		}).then(q_res => {
			investor.availableBalance = remainingBalance;
			investor.save().then(iq => {
				models.Transaction.create({
					userId: investor.userId,
					loanId: loan.id,
					amount: investedAmount,
					currentBalance: currentBalance,
					closingBalance: remainingBalance,
					type: 'LOAN_INVESTMENT-DEBITED'
				}).then(tq_res => {
					q_res.dataValues.Loan = loan;
					q_res.dataValues.Loan.dataValues.Transactions = tq_res;
					res.status(200).json({loanInvestment: q_res});
				})
			})
		}).catch(error=>res.status(500).json({message: error.message})); **/
	}
];

exports.updateLoanInvestment = [

	(req, res, next) => {
		res.status(200).json({})
	}
];

exports.loanInvestmentDelete = [

	(req, res, next) => {
		res.status(200).json({})
	}
];