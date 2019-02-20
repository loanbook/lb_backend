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

		let initialDeposit = parseInt(req.body.initialDeposit);

		models.sequelize.transaction((t) => {
			return models.User.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				isActive: req.isActive,
				password: authHelper.getPasswordHash(uuidv1())
			}, {transaction});
		}).then(result => {

		}).catch(errro => {

		});

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
		});

		if(initialDeposit && initialDeposit > 0){
			let transaction = await  models.Transaction.create({
				type: 'Deposit',
				transactionType: 'CREDITED',
				amount: req.body.availableBalance,
				userId: user.id,
				comment: "Initial deposit on investor signup."
			});
		}

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

		investor.firstName = req.body.firstName;
		investor.lastName = req.body.lastName;
		investor.email = req.body.email;
		investor.isActive = req.body.isActive;
		investor.save();

		investor.Investor.location = req.body.location;
		investor.Investor.save();
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