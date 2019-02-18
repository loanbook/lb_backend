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
		let lInvestment;
		let transactions = [];

		models.sequelize.transaction((t) => {
			return models.LoanInvestment.create({
				loanId: loan.id,
				investorId: investor.id,
				investedAmount: req.body.investedAmount,
				percentage: percent.calc(investedAmount, loan.amount, 0)
			}, {transaction: t}).then(loanInvestment => {
				lInvestment = loanInvestment;
				investor.availableBalance = remainingBalance;
				return investor.save({transaction: t}).then(investor => {
					return models.Transaction.create({
						userId: investor.userId,
						loanId: loan.id,
						amount: investedAmount,
						currentBalance: currentBalance,
						closingBalance: remainingBalance,
						type: 'LOAN_INVESTMENT',
						transactionFlow: 'DEBITED'
					}, {transaction: t}).then(investorTrans => {
						transactions.push(investorTrans);
						return models.Transaction.create({
							userId: loan.borrowerId,
							loanId: loan.id,
							amount: investedAmount,
							currentBalance: 0,
							closingBalance: 0,
							type: 'LOAN_INVESTMENT',
							transactionFlow: 'CREDITED'
						}, {transaction: t});
					})
				})
			})

		}).then(result => {
			// Result will be the last query result.
			transactions.push(result);
			models.LoanInvestment.findByPk(lInvestment.id, {
				include: [
					{model: models.Investor},
					{model: models.Loan},
				]
			}).then(loanInvestment => {
				loanInvestment.dataValues.Transactions = transactions;
				res.status(200).json({loanInvestment});
			})
		}).catch(error=>res.status(500).json({message: error.message}));
	}
];

exports.updateLoanInvestment = [

	validator.updateLoanInvestment,

	(req, res, next) => {
		const newAmount = parseInt(req.body.investedAmount);
		let investment = req.loanInvestment;
		let currentBalance = investor.availableBalance;
		let transaction = [];

		if(newAmount > investment.investedAmount){
			let transAmount = newAmount - investment.investedAmount;
			let remainingBalance = investment.Investor.availableBalance - transAmount;
			investment.investedAmount = newAmount;
			models.sequelize.transaction((t) => {
				return investment.save({transaction: t}).then(q_investment => {
					return models.Transaction.create({
						userId: investment.investerId,
						loanId: loan.id,
						amount: transAmount,
						currentBalance: currentBalance,
						closingBalance: remainingBalance,
						type: 'LOAN_INVESTMENT',
						transactionFlow: 'DEBITED'
					}, {transaction: t}).then(debited_tans => {
						transaction.push(debited_tans);
						return models.Transaction.create({
							userId: investment.Loan.borrowerId,
							loanId: investment.Loan.loan.id,
							amount: transAmount,
							currentBalance: 0,
							closingBalance: 0,
							type: 'LOAN_INVESTMENT',
							transactionFlow: 'CREDITED'
						}, {transaction: t})
					})
				})
			}).then(result => {
				transaction.push(result);

				models.LoanInvestment.findByPk(lInvestment.id, {
					include: [
						{model: models.Investor},
						{model: models.Loan},
					]
				}).then(loanInvestment => {
					loanInvestment.dataValues.Transactions = transactions;
					res.status(200).json({loanInvestment});
				})
			}).catch(error=>res.status(500).json({message: error.message}))
		}else{
			let currentBalance = investment.Investor.availableBalance;
			let newCurrentBalance = currentBalance + investment.investedAmount;
			let transAmount = newAmount - investment.investedAmount;
			let closingBalance = newCurrentBalance + newAmount;

			models.sequelize.transaction((t) => {
				investment.investedAmount = newAmount;
				return investment.save({transaction: t}).then(q_investment => {
					return models.Transaction.create({
						userId: investment.investerId,
						loanId: investment.Loan.loan.id,
						amount: transAmount,
						currentBalance: currentBalance,
						closingBalance: closingBalance,
						type: 'LOAN_INVESTMENT',
						transactionFlow: 'CREDITED'
					}, {transaction: t}).then(credited_tans => {
						transaction.push(credited_tans);
						return models.Transaction.create({
							userId: investment.Loan.borrowerId,
							loanId: loan.id,
							amount: transAmount,
							currentBalance: 0,
							closingBalance: 0,
							type: 'LOAN_INVESTMENT',
							transactionFlow: 'DEBITED'
						}, {transaction: t})
					})
				})
			}).then(result => {
				transaction.push(result);
				models.LoanInvestment.findByPk(lInvestment.id, {
					include: [
						{model: models.Investor},
						{model: models.Loan},
					]
				}).then(loanInvestment => {
					loanInvestment.dataValues.Transactions = transactions;
					res.status(200).json({loanInvestment});
				})
			}).catch(error=>res.status(500).json({message: error.message}))
		}
	}
];

exports.loanInvestmentDelete = [

	(req, res, next) => {
		res.status(200).json({})
	}
];