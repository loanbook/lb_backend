const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
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
	body('status').isLength({min: 1}).withMessage("This field is required.").isIn(constants.LOAN_STATUSES),

	sanitizeBody('amount').trim().escape(),
	sanitizeBody('duration').trim().escape(),
	sanitizeBody('interestRate').trim().escape(),
	sanitizeBody('status').trim().escape(),
	sanitizeBody('loanType').trim().escape(),

	async (req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}
		next();
	}
];


exports.updateLoanReqValidator = [
	body('amount').isLength({min: 1}).withMessage('This field is required.')
		.isFloat({min: 1}).withMessage('This must be an integer value and greater then 0.'),
	body('duration').isLength({min: 0}).withMessage('This field is required.')
		.isInt().withMessage('This must be an integer value.'),
	body('interestRate').isLength({min: 0}).withMessage("This field is required.")
		.isFloat().withMessage('This must be an integer value.'),

	body('borrowerId').isLength({min: 1}).withMessage("This field is required.")
		.isInt().withMessage("This must be an integer value.")
		.custom(async (value, {req}) => {
			const borrowerId = req.body.borrowerId;
			let borrower = await models.Borrower.findOne({
				where:{userId: borrowerId},
				include: [
					{model: models.User}
				]
			});
			req.borrower = borrower;
			return (borrower);
		}),
	body('loanType').isLength({min: 1}).withMessage('This field is required.'),
	body('status').isLength({min: 1}).withMessage("This field is required."),

	sanitizeBody('amount').trim().escape(),
	sanitizeBody('duration').trim().escape(),
	sanitizeBody('interestRate').trim().escape(),
	sanitizeBody('status').trim().escape(),
	sanitizeBody('loanType').trim().escape(),


	async (req, res, next) => {
		const errors = validationResult(req);
		const loanId = req.params.id;
		models.Loan.findOne({where: {id: loanId}}).then(q_res => {
			if(!q_res){
				res.status(404).json({message: 'No loan is found with provided id.'})
			}else{
				if(!errors.isEmpty()) {
					res.status(422).json({'errors': errors.array({onlyFirstError: true})});
				}else{
					req.loan = q_res;
					next();
				}
			}
		}).catch(error => {
			res.status(500).json({message: error.message})
		});
	}
];