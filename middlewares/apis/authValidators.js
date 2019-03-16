const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.signupReqValidator = [

	body('email').isEmail().withMessage('Invalid email is provided.').custom(async (value, { req }) => {
		const models = require('../../models');
		let user = await models.User.findOne({
			where: { email: value }
		});
		return !user;
	}).withMessage("Email is already registered."),

	body('firstName').isLength({ min: 1 }).withMessage('First name is required.'),
	body('lastName').isLength({ min: 1 }).withMessage('Last name is required.'),
	body('password').isLength({ min: 1 }).withMessage('Password is required.'),
	body('password2').exists().withMessage('Please confirm your password.').custom((value, { req }) => {
		return req.body.password === req.body.password2;

	}).withMessage('Password does not match'),

	sanitizeBody('email').trim().escape(),
	sanitizeBody('firstName').trim().escape(),
	sanitizeBody('lastName').trim().escape(),
	sanitizeBody('password').escape(),
	sanitizeBody('password2').escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		else {
			next();
		}
	}
];

exports.loginReqValidator = [
	body('email').isLength({ min: 1 }).withMessage('Email is required.'),
	body('password').isLength({ min: 1 }).withMessage('Password is required.'),
	sanitizeBody('email').escape(),
	sanitizeBody('password').escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ 'errors': errors.array() });
		}
		else {
			next();
		}
	}
];