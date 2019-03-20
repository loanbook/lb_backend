const models = require('../../../models');
const authHelper = require('../../../helpers/authHelper');
const investorValidators = require('../../../middlewares/apis/admin/investorsValidators');
const aggregationsHelper = require('../../../helpers/aggregationsHelper');


exports.listInvestorsGet = async (req, res, next) => {
	let investors = await models.User.findAll({
		include: [
			{
				model: models.Investor,
				where: { userId: { [models.Sequelize.Op.not]: null } }
			}
		],
	});
	res.status(200).json({ investors });
};


exports.detialInvestorGet = [
	async (req, res, next) => {
		const investorID = req.params.id;
		let investor = await models.User.findByPk(investorID, {
			include: [
				{
					model: models.Investor,
					where: { userId: { [models.Sequelize.Op.not]: null } }
				}
			]
		});
		if (investor) {
			investor.dataValues.investment = await aggregationsHelper.fetchInvestorInvestment(investor.id);
			investor.dataValues.investorPercentage = await aggregationsHelper.fetchInvestorPercentage(investor.id);
			investor.dataValues.investorPoolShare = await aggregationsHelper.fetchInvestorPoolShare(investor.id);
			res.status(200).json({ investor });
		}
		else res.status(404).json({ message: 'No investor found with provided investor id.' })
	}
];


exports.createInvestorPost = [

	investorValidators.createInvestorReqValidator,

	async (req, res, next) => {
		let initialDeposit = parseInt(req.body.initialDeposit);
		let investorProfile = null;

		let userInstance = models.User.build({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			isActive: req.isActive,
		});
		userInstance.setPassword = null;

		models.sequelize.transaction((t) => {
			return userInstance.save({ transaction: t }).then(user => {
				investorProfile = user;
				return models.Investor.create({
					userId: user.id,
					location: req.body.Investor.location,
				}, { transaction: t })
			})
		}).then(result => {
			investorProfile.dataValues.Investor = result;
			const initialDeposit = parseInt(req.body.initialBalance);
			if (initialDeposit) {
				models.Transaction.create({
					userId: result.userId, type: 'INVESTMENT_DEPOSIT', transactionFlow: 'CREDITED', amount: initialDeposit,
					comment: 'Initial deposit'
				}).then(trans => {
					res.status(200).json({ investor: investorProfile, transaction: trans })
				})
			} else {
				res.status(200).json({ investor: investorProfile })
			}
		}).catch(error => {
			res.status(500).json({ error: error.message })
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
			investor.Investor.location = req.body.Investor.location;
			investor.Investor.save().then(q_investor => {
				res.status(200).json({ investor: investor })
			})
		}).catch(error => {
			res.status(500).json({ message: error.message })
		});

	}
];


exports.investorAddDeposit = [
	investorValidators.addDepositValidator,

	async (req, res, next) => {
		models.Transaction.create({
			userId: req.investor.id, type: 'INVESTMENT_DEPOSIT', transactionFlow: 'CREDITED', amount: parseInt(req.body.amount),
			comment: 'Deposit'
		}).then(trans => {
			res.status(200).json({ transaction: trans, investor: req.investor })
		}).catch(error => res.status(500).json({ message: error.message }))
	}
];

exports.investorDelete = async (req, res, next) => {
	const investorId = req.params.id;
	let investor = await models.User.findByPk(investorId, {
		include: [
			{
				model: models.Investor,
				where: { userId: { [models.Sequelize.Op.not]: null } }
			}
		]
	});

	if (!investor) { res.status(404).json({ message: 'No investor found with provided investor id.' }); }
	else {
		investor.destroy().then((q_data) => {
			res.status(200).json({ 'message': 'Investor has been deleted successfully.' })
		}).catch((error) => {
			res.status(500).json({ 'message': "Unable to delete investor" })
		})
	}
};