const uuidv1 = require('uuid/v1');
const models = require('../../../models');
const authHelper = require('../../helpers/authHelper');
const investorValidators = require('../../../middlewares/apis/admin/investorsValidators');


exports.listInvestorsGet = async (req, res, next) => {
	let investors = await models.User.findAll({
		include: [
			{
				model: models.Investor,
				where: {userId: {[models.Sequelize.Op.not]: null}}
			}
		],
	});
	res.status(200).json({investors});
};


exports.detialInvestorGet = [
	async (req, res, next) => {
		const investorID = req.params.id;
		let investor = await models.User.findByPk(investorID, {
			include: [
				{
					model: models.Investor,
					where: {userId: {[models.Sequelize.Op.not]: null}}
				}
			]
		});
		if(investor) res.status(200).json({investor});
		else res.status(404).json({message: 'No investor found with provided investor id.'})
	}
];


exports.createInvestorPost = [

	investorValidators.createInvestorReqValidator,

	async (req, res, next) => {

		let user = await models.User.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			isActive: req.isActive,
			password: authHelper.getPasswordHash(uuidv1())
		});

		let investor = await models.Investor.create({
			userId: user.id,
			location: req.body.location,
			availableBalance: req.body.availableBalance
		});

		let transaction = await  models.Transaction.create({
			type: 'Deposit',
			amount: req.body.availableBalance,
			currentBalance: 0,
			closingBalance: req.body.availableBalance,
			userId: user.id,
			comment: "Initial deposit on investor signup."
		});

		user.dataValues.Investor = investor;
		user.dataValues.Investor.dataValues.Transaction = transaction;

		res.status(200).json({investor: user})
	}
];

exports.updateInvestorPut = [

	investorValidators.updateInvestorReqValidator,

	async (req, res, next) => {
		const investorId = req.params.id;
		let investor = req.investor;
		let amount = req.body.availableBalance;

		investor.firstName = req.body.firstName;
		investor.lastName = req.body.lastName;
		investor.email = req.body.email;
		investor.isActive = req.body.isActive;
		investor.save();

		let old_balance = investor.Investor.availableBalance;

		investor.Investor.availableBalance = req.body.availableBalance;
		investor.Investor.location = req.body.location;
		investor.Investor.save();

		if(old_balance !== parseFloat(amount)) {
			let transaction = await  models.Transaction.create({
				type: 'BalanceUpdate',
				amount: amount,
				currentBalance: old_balance,
				closingBalance: req.body.availableBalance,
				userId: investor.id,
				comment: "Initial deposit on investor signup."
			});
			investor.dataValues.Investor.dataValues.Transaction = transaction;
		}
		res.status(200).json({investor: investor})
	}
];

exports.investorDelete = async (req, res, next) => {
	const investorId = req.params.id;
	let investor = await models.User.findByPk(investorId, {
		include: [
			{
				model: models.Investor,
				where: {userId: {[models.Sequelize.Op.not]: null}}
			}
		]
	});

	if(!investor){ res.status(404).json({message: 'No investor found with provided investor id.'});}
	else {
		investor.destroy().then((q_data) => {
			res.status(200).json({'message': 'Investor has been deleted successfully.'})
		}).catch((error) => {
			console.log(error);
			res.status(500).json({'message': "Unable to delete investor"})
		})
	}
};