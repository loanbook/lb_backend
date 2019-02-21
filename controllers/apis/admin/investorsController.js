const uuidv1 = require('uuid/v1');
const models = require('../../../models');
const authHelper = require('../../helpers/authHelper');
const investorValidators = require('../../../middlewares/apis/admin/investorsValidators');
const aggregationsHelper = require('../../helpers/aggregations');


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
		investor.dataValues.investment = aggregationsHelper.fetchInvestorInvestment(investor.userid);
		if(investor) res.status(200).json({investor});
		else res.status(404).json({message: 'No investor found with provided investor id.'})
	}
];


exports.createInvestorPost = [

	investorValidators.createInvestorReqValidator,

	async (req, res, next) => {
		let initialDeposit = parseInt(req.body.initialDeposit);
		let investorProfile = null;

		models.sequelize.transaction((t) => {
			return models.User.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				isActive: req.isActive,
				password: authHelper.getPasswordHash(uuidv1())
			}, {transaction: t}).then(user => {
				investorProfile = user;
				return models.Investor.create({
					userId: user.id,
					location: req.body.location,
				}, {transaction: t})
			})
		}).then(result => {
			investorProfile.dataValues.Investor = result;
			const initialDeposit = parseInt(req.body.initialBalance);
			if(initialDeposit){
				models.Transaction.create({
					userId: result.userId, type: 'INVESTMENT_DEPOSIT', transactionFlow: 'CREDITED', amount: initialDeposit,
					comment: 'Initial deposit'
				}).then(trans => {
					res.status(200).json({investor: investorProfile, transaction: trans})
				})
			}else{
				res.status(200).json({investor: investorProfile})
			}
		}).catch(error => {
			res.status(500).json({error: error.message})
		});
	}
];

exports.updateInvestorPut = [

	investorValidators.updateInvestorReqValidator,

	async (req, res, next) => {
		const investorId = req.params.id;
		let investor = req.investor;

		investor.firstName = req.body.firstName;
		investor.lastName = req.body.lastName;
		investor.email = req.body.email;
		investor.isActive = req.body.isActive;
		investor.save().then(user => {
			investor.Investor.location = req.body.location;
			investor.Investor.save().then(q_investor => {
				res.status(200).json({investor: investor})
			})
		}).catch(error => {
			res.status(500).json({message: error.message})
		});

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
			res.status(500).json({'message': "Unable to delete investor"})
		})
	}
};