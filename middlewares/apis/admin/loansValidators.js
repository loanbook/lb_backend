const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const moment = require('moment');
const models = require('../../../models');
const constants = require('../../../config/constants');


function loanDateValidator(value, { req }) {
	const date_str = req.body.loanDate;
	let date = moment(date_str, "YYYY-MM-DD", true);
	let currentDate = moment();

	if (!date.isValid())
		throw new Error("Invalid date(YYYY-MM-DD) is provided.");
	else if (!date.isSameOrAfter(currentDate, 'Date'))
		throw new Error("Date should not be in past.");
	return true;
}

const collectValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ 'errors': errors.array({ onlyFirstError: true }) });
	} else {
		next();
	}
};


exports.createLoanReqValidator = [
	body('borrowerId').isLength({ min: 1 }).withMessage("This field is required.")
		.isInt().withMessage("This must be an integer value.")
		.custom(async (value, { req }) => {
			const borrowerId = req.body.borrowerId;
			let borrower = await models.Borrower.findOne({
				where: { userId: borrowerId },
				include: [
					{ model: models.User }
				]
			});
			req.borrower = borrower;
			return (borrower);
		}).withMessage('Invalid borrower id is provided.'),
	body('amount').isLength({ min: 1 }).withMessage('This field is required.')
		.isFloat({ min: 1 }).withMessage('This must be an integer value and greater then 0.'),
	body('duration').isLength({ min: 1 }).withMessage('This field is required.')
		.isInt().withMessage('This must be an integer value.'),
	body('interestRate').isLength({ min: 1 }).withMessage("This field is required.")
		.isFloat().withMessage('This must be an integer value.'),
	body('loanType').isLength({ min: 1 }).withMessage('This field is required.').isIn(constants.LOAN_TYPES),
	body('loanDate').isLength({ min: 1 }).withMessage("This field is required.").custom(loanDateValidator),
	body('status').isLength({ min: 1 }).withMessage("This field is required.").isIn(constants.LOAN_INITIAL_STATUSES),
	body('companyPercentage').isLength({ min: 1 }).withMessage("This field is required.")
		.isInt().withMessage('This must be a number.'),

	sanitizeBody('amount').trim().escape(),
	sanitizeBody('duration').trim().escape(),
	sanitizeBody('interestRate').trim().escape(),
	sanitizeBody('status').trim().escape(),
	sanitizeBody('loanType').trim().escape(),
	sanitizeBody('loanDate').trim().escape(),

	collectValidationErrors,
];


exports.updateLoanReqValidator = [

	// Processing initial data
	async (req, res, next) => {
		const loanId = req.params.id;

		let q_res = await models.Loan.findOne({
			where: { id: loanId },
			include: [
				{ model: models.Borrower }
			]
		})
		// .then(q_res => {
		if (!q_res) {
			res.status(404).json({ message: 'No loan is found with provided id.' })
		} else {
			// if company does not have the loan amount.
			let companyDetail = await models.LoanBook.findOne();
			if (!companyDetail) {
				res.status(404).json({ message: 'Company does not exist.' })
			}
			else if (companyDetail.cashPool < q_res.amount) {
				res.status(404).json({ message: 'Company does not have balace to approve it.' })
			}
			else {
				req.loan = q_res;
				req.borrower = q_res.Borrower;
				next();
			}
		}
		// }).catch(error => res.status(500).json({ message: error.message }))
	},

	// Validators

	body('amount').isLength({ min: 1 }).withMessage('This field is required.')
		.isFloat({ min: 1 }).withMessage('This must be an integer value and greater then 0.'),
	body('duration').isLength({ min: 1 }).withMessage('This field is required.')
		.isInt().withMessage('This must be an integer value.'),
	body('interestRate').isLength({ min: 1 }).withMessage("This field is required.")
		.isFloat().withMessage('This must be an integer value.'),
	body('loanDate').isLength({ min: 1 }).withMessage("This field is required.").custom(loanDateValidator),
	body('companyPercentage').isLength({ min: 1 }).withMessage("This field is required.")
		.isInt().withMessage('This must be a number.'),
	body('loanType').isLength({ min: 1 }).withMessage('This field is required.').isIn(constants.LOAN_TYPES),
	body('status').isLength({ min: 1 }).withMessage("This field is required.")
		.isIn(constants.LOAN_INITIAL_STATUSES)
		.custom((value, { req }) => {
			if (req.loan.status !== 'IN_REVIEW') {
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
	collectValidationErrors,
];