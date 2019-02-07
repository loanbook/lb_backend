const models = require('../../../models');


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


exports.createInvestorPost = async (req, res, next) => {
	res.status(200).json({})
};