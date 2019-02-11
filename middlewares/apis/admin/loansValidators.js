const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const models = require('../../../models');


exports.createLoanReqValidator = [
	body('amount').isLength({min: 1}).withMessage('This field is required.')
		.isFloat({min: 1}).withMessage('This must be an integer value and greater then 0.'),
	body('duration').isLength({min: 0}).withMessage('This field is required.')
		.isInt().withMessage('This must be an integer value.'),
	body('interestRate').isLength({min: 0}).withMessage("This field is required.")
		.isFloat().withMessage('This must be an integer value.'),

	sanitizeBody('amount').trim().escape(),
	sanitizeBody('duration').trim().escape(),
	sanitizeBody('interestRate').trim().escape(),

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

	sanitizeBody('amount').trim().escape(),
	sanitizeBody('duration').trim().escape(),
	sanitizeBody('interestRate').trim().escape(),

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