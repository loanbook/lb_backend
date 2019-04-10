const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const models = require('../../../models');


exports.createInvestorReqValidator = [
	body('Investor.location').isLength({min: 1}).withMessage('This field is required.'),
	body('firstName').isLength({min: 1}).withMessage('This field is required.'),
	body('lastName').isLength({min: 1}).withMessage('This field is required.'),
	body('email').isLength({min: 1}).withMessage("This field is required.")
		           .isEmail().withMessage('Invalid email is provided.').custom(async (value, {req}) => {
		const models = require('../../../models');
		console.log(value);
		let user = await models.User.findOne({
			where: {email: value}
		});
		return !user;
	}).withMessage("Email is already registered."),
	body('isActive').isLength({min: 1}).withMessage('This field is required').isBoolean(),
	// body('location').isLength({min: 1}).withMessage('This field is required.'),
	body('initialBalance').optional().isInt({min: 0}).withMessage('This must be a number.'),

	sanitizeBody('firstName').escape().trim(),
	sanitizeBody('lastName').escape().trim(),
	sanitizeBody('email').escape().trim(),
	sanitizeBody('isActive').escape().trim(),
	sanitizeBody('Investor.location').escape().trim(),

	async (req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}else{
			next();
		}
	}
];

exports.updateInvestorReqValidator = [
	body('Investor.location').isLength({min: 1}).withMessage('This field is required.'),
	body('firstName').isLength({min: 1}).withMessage('This field is required.'),
	body('lastName').isLength({min: 1}).withMessage('This field is required.'),
	body('email').isLength({min: 1}).withMessage("This field is required.")
		.isEmail().withMessage('Invalid email is provided.').custom(async (value, {req}) => {
		const models = require('../../../models');
		const userId = req.params.id;
		let user = await models.User.findOne({
			where: {email: value, id: {[models.Sequelize.Op.not]: userId}}
		});
		return !user;
	}).withMessage("Email is already registered."),
	body('isActive').isLength({min: 1}).withMessage('This field is required').isBoolean(),
	// body('location').isLength({min: 1}).withMessage('This field is required.'),

	sanitizeBody('firstName').escape().trim(),
	sanitizeBody('lastName').escape().trim(),
	sanitizeBody('email').escape().trim(),
	sanitizeBody('isActive').escape().trim(),
	sanitizeBody('Investor.location').escape().trim(),

	async (req, res, next) => {
		const errors = validationResult(req);
		const investorId = req.params.id;
		let investor = await models.User.findByPk(investorId, {
			include: [
				{
					model: models.Investor,
					where: {userId: {[models.Sequelize.Op.not]: null}}
				}
			]
		});
		req.investor = investor;
		if(!investor){
			res.status(404).json({'message': 'No investor found with provided id.'})
		}
		else if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}else {
			next();
		}
	}
];


exports.addDepositValidator = [

	(req, res, next) => {
		const investorId = parseInt(req.body.investorId);

		models.User.findByPk(investorId, {
			include: [
				{
					model: models.Investor,
					where: {userId: {[models.Sequelize.Op.not]: null}}
				}
			]
		}).then(investor => {
			req.investor = investor;
			next();
		}).catch(error => {
			console.log(error);
			res.status(500).json({message: error.message})
		})
	},

	body('amount').isLength({min: 1}).withMessage('This field is required.')
		.isInt().withMessage('This must be a number.')
		.isInt({min: 1}).withMessage('This must be greater then 0.'),
	body('investorId').isLength({min: 1}).withMessage('This field is required.')
		.custom((value, {req}) => {
			let investor = req.investor;
			if(!investor)
				throw new Error('No investor found with provided id.');
			return true;
		}),

	async (req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}else{
			next();
		}
	}
];


exports.withdrawValidator = [

	(req, res, next) => {
		const investorId = parseInt(req.body.investorId);

		models.User.findByPk(investorId, {
			include: [
				{
					model: models.Investor,
					where: {userId: {[models.Sequelize.Op.not]: null}}
				}
			]
		}).then(investor => {
			req.investor = investor;
			next();
		}).catch(error => {
			console.log(error);
			res.status(500).json({message: error.message})
		})
	},

	body('amount').isLength({min: 1}).withMessage('This field is required.')
		.isInt().withMessage('This must be a number.')
		.isInt({min: 1}).withMessage('This must be greater then 0.'),
	body('investorId').isLength({min: 1}).withMessage('This field is required.')
		.custom((value, {req}) => {
			let investor = req.investor;
			if(!investor)
				throw new Error('No investor found with provided id.');
			return true;
		}),

	async (req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(422).json({'errors': errors.array({onlyFirstError: true})});
		}else{
			next();
		}
	}
];