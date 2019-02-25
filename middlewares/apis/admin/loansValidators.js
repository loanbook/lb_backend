const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const moment = require('moment');
const models = require('../../../models');
const constants = require('../../../config/constants');


exports.createLoanReqValidator = [
	body('borrowerId').isLength({min: 1}).withMessage("This field is required.")
		.isInt().withMessage("This must be an integer value.")
		.custom( async (value, {req}) => {
			const borrowerId = req.body.borrowerId;
			let borrower = await models.Borrower.findOne({
				where:{userId: borrowerId},
				include: [
					{model: models.User}
				]
			});
			req.borrower = borrower;
			return (borrower);
		}).withMessage('Invalid borrower id is provided.'),
	body('amount').isLength({min: 1}).withMessage('This field is required.')
		.isFloat({min: 1}).withMessage('This must be an integer value and greater then 0.'),
	body('duration').isLength({min: 1}).withMessage('This field is required.')
		.isInt().withMessage('This must be an integer value.'),
	body('interestRate').isLength({min: 1}).withMessage("This field is required.")
		.isFloat().withMessage('This must be an integer value.'),
	body('loanType').isLength({min: 1}).withMessage('This field is required.').isIn(constants.LOAN_TYPES),
	body('loanDate').isLength({min: 1}).withMessage("This field is required.")
		.custom((value, {req}) => {
			const date_str = req.body.loanDate;
			const now = moment();
			let date = moment(date_str, "YYYY-MM-DD", true);
			if(!date.isValid())
				throw new Error("Invalid date(YYYY-MM-DD) is provided.");
			else if (date < now)
				throw new Error("Date should not be in past.");
			return true;
		}),
	body('status').isLength({min: 1}).withMessage("This field is required.").isIn(constants.LOAN_INITIAL_STATUSES),

	sanitizeBody('amount').trim().escape(),
	sanitizeBody('duration').trim().escape(),
	sanitizeBody('interestRate').trim().escape(),
	sanitizeBody('status').trim().escape(),
	sanitizeBody('loanType').trim().escape(),
	sanitizeBody('loanDate').trim().escape(),

	async (req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}
		next();
	}
];


exports.updateLoanReqValidator = [

	// Processing initial data
	(req, res, next) => {
		const loanId = req.params.id;

		models.Loan.findOne({where: {id: loanId}}).then(q_res => {
			if(!q_res){
				res.status(404).json({message: 'No loan is found with provided id.'})
			}else {
				req.loan = q_res;
				next();
			}
		}).catch(error =>res.status(500).json({message: error.message}))
	},

	// Validators

	body('amount').isLength({min: 1}).withMessage('This field is required.')
		.isFloat({min: 1}).withMessage('This must be an integer value and greater then 0.'),
	body('duration').isLength({min: 1}).withMessage('This field is required.')
		.isInt().withMessage('This must be an integer value.'),
	body('interestRate').isLength({min: 1}).withMessage("This field is required.")
		.isFloat().withMessage('This must be an integer value.'),
	body('loanDate').isLength({min: 1}).withMessage("This field is required.")
		.custom((value, {req}) => {
			const date_str = req.body.loanDate;
			let date = moment(date_str, "YYYY-MM-DD", true);
			if(!date.isValid())
				throw new Error("Invalid date(YYYY-MM-DD) is provided.");
			return true;
		}),
	body('status').isLength({min: 1}).withMessage("This field is required.")
		.isIn(constants.LOAN_INITIAL_STATUSES)
		.custom((value, {req}) => {
		if(req.loan.status !== 'IN_REVIEW'){
			throw new Error('Loan can only be modified when it is in Review state.');
		}
		return true;
	}),

	sanitizeBody('amount').trim().escape(),
	sanitizeBody('duration').trim().escape(),
	sanitizeBody('interestRate').trim().escape(),
	sanitizeBody('status').trim().escape(),
	sanitizeBody('loanType').trim().escape(),
	sanitizeBody('loanDate').trim().escape(),

	// Errors collection
	(req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}else{
			next();
		}
	}
];