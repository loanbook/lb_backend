const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

const models = require('../../../models');


exports.createLoanInvestmentValidator = [

	body('loanId').isLength({min: 1}).withMessage('This field is required.')
		.isInt().withMessage('This must be an integer value.')
		.custom(async (value, {req}) => {
			const loanId = req.body.loanId;
			let loan = await models.Loan.findByPk(loanId);
			req.loan = loan;
			if(!loan)
				throw new Error('Invalid loan id is provided.');
			if(loan && loan.status !== 'APPROVED')
				throw new Error('Loan must be in approved state.');
			return (loan);
		}),
	body('investorId').withMessage('Invalid loan id is provided'),body('loanId').isLength({min: 1}).withMessage('This field is required.')
		.isInt().withMessage('This must be an integer value.')
		.custom(async (value, {req}) => {
			const investorId = req.body.investorId;
			const investedAmount = parseFloat(req.body.investedAmount);

			let investor = await models.Investor.findByPk(investorId, {include: [
					{model: models.User}
				]});
			req.investor = investor;
			if(!investor)
				throw new Error('Invalid investor id is provided');
			else if(investor.dataValues.availableBalance < investedAmount)
				throw new Error('Investor has insufficient balance.')
		}),

	body('investedAmount').isLength({min: 1}).withMessage('This field is required.')
		.isFloat().withMessage('This must be a number value')
		.custom(async (value, {req}) => {
			const investedAmount = parseFloat(req.body.investedAmount);
			let totalAmount = req.loan.dataValues.amount;
			let remainingAmount = 0;
			let assignedAmount = await models.LoanInvestment.sum('investedAmount', {
				where: {loanId: req.loan.id}
			});
			assignedAmount = (isNaN(assignedAmount)) ? 0 : assignedAmount;
			remainingAmount = totalAmount - assignedAmount;

			if(investedAmount >= totalAmount){
				throw new Error('Amount should be less then loan amount('+totalAmount+').');
			}
			else if(remainingAmount < investedAmount){
				throw new Error('Amount should be less the remaining amount('+remainingAmount+')');
			}
		}),

	sanitizeBody('investerId').trim().escape(),
	sanitizeBody('loanId').trim().escape(),
	sanitizeBody('investorAmount').trim().escape(),

	async (req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}else{
			next();
		}

	}
];


exports.updateLoanInvestment = [

	// Collect information about loan investment
	async (req, res, next) => {
		const investmentId = req.params.id;
		const newAmount = parseInt(req.body.investedAmount);

		let investment = await models.LoanInvestment.findByPk(investmentId, {
			include: [{model: models.Loan}, {model: models.Investor}]
		});
		req.loanInvestment = investment;

			if(!investment){
				res.status(404).json({message: 'No loan investment found with provided id.'})
			}else{
				if(newAmount > investment.investedAmount){
					let assignedAmount = await models.LoanInvestment.sum('investedAmount', {
						where: {loanId: investment.Loan.id}
					});
					assignedAmount = (isNaN(assignedAmount)) ? 0 : assignedAmount;
					let newAssignedAmount = assignedAmount - investment.investedAmount;

					req.assignedAmount = newAssignedAmount;
					req.totalAmount = newAssignedAmount + newAmount;
					req.remainingAmount = investment.Loan.amount - newAssignedAmount;
				}
			}
		next();
	},

	// Request validation
	body('investedAmount').isLength({min: 1}).withMessage('This field is required.')
		.isFloat({min: 0}).withMessage("This must be an integer value.")
		.custom((value, {req}) => {
			const investmentId = req.params.id;
			const newAmount = parseInt(req.body.investedAmount);
			if(newAmount > req.loanInvestment.investedAmount){
				if(req.totalAmount > req.loanInvestment.Loan.amount){
					throw new Error('Amount should be less then remaining amount('+req.remainingAmount+')');
				}
			}
			return true;
		}),

	// Collections of validation errors.
	async (req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}else{
			next();
		}
	}
];