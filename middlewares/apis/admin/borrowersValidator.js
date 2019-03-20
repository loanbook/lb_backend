const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const models = require('../../../models');

exports.createBorrowerReqValidator = [
	body('firstName').isLength({ min: 1 }).withMessage('This field is required.'),
	body('lastName').isLength({ min: 1 }).withMessage('This field is required.'),
	body('Borrower.businessName').isLength({ min: 1 }).withMessage('This field is required.'),
	body('Borrower.description').isLength({ min: 1 }).withMessage('This field is required.'),
	body('email').isLength({ min: 1 }).withMessage("This field is required.")
		.isEmail().withMessage('Invalid email is provided.').custom(async (value, { req }) => {
			const models = require('../../../models');
			let user = await models.User.findOne({
				where: { email: value }
			});
			return !user;
		}).withMessage("Email is already registered."),
	body('isActive').isLength({ min: 1 }).withMessage('This field is required').isBoolean(),

	sanitizeBody('firstName').escape().trim(),
	sanitizeBody('lastName').escape().trim(),
	sanitizeBody('email').escape().trim(),
	sanitizeBody('isActive').escape().trim(),
	sanitizeBody('Borrower.businessName').escape().trim(),
	sanitizeBody('Borrower.description').escape().trim(),

	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).json({ 'errors': errors.array({ onlyFirstError: true }) });
		} else {
			next();
		}

	}
];


exports.updateBorrowerReqValidator = [
	body('firstName').isLength({ min: 1 }).withMessage('This field is required.'),
	body('lastName').isLength({ min: 1 }).withMessage('This field is required.'),
	body('Borrower.businessName').isLength({ min: 1 }).withMessage('This field is required.'),
	body('Borrower.description').isLength({ min: 1 }).withMessage('This field is required.'),
	body('email').isLength({ min: 1 }).withMessage("This field is required.")
		.isEmail().withMessage('Invalid email is provided.').custom(async (value, { req }) => {
			const models = require('../../../models');
			const userId = req.params.id;
			let user = await models.User.findOne({
				where: { email: value, id: { [models.Sequelize.Op.not]: userId } }
			});
			return !user;
		}).withMessage("Email is already registered."),
	body('isActive').isLength({ min: 1 }).withMessage('This field is required').isBoolean(),

	sanitizeBody('firstName').escape().trim(),
	sanitizeBody('lastName').escape().trim(),
	sanitizeBody('email').escape().trim(),
	sanitizeBody('isActive').escape().trim(),
	sanitizeBody('Borrower.businessName').escape().trim(),
	sanitizeBody('Borrower.description').escape().trim(),

	async (req, res, next) => {
		const errors = validationResult(req);
		const borrowerId = req.params.id;
		models.User.findByPk(borrowerId, {
			include: [
				{
					model: models.Borrower,
					where: { userId: { [models.Sequelize.Op.not]: null } }
				}
			]
		}).then(q_res => {

			if (!q_res) {
				res.status(404).json({ 'message': 'No borrower found with provided id.' })
			}
			else if (!errors.isEmpty()) {
				res.status(422).json({ 'message': 'Forms field errors.', 'errors': errors.array({ onlyFirstError: true }) });
			} else {
				req.borrower = q_res;
				next();
			}
		}).catch(error => {
			res.status(500).json({ message: error.message })
		});
	}
];