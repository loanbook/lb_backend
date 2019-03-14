const models = require('../../../models');
const aggrigationsHelper = require('../../../helpers/aggregationsHelper');
const utilsHelper = require('../../../helpers/util');

const generateDashbardCard = utilsHelper.generateDashbardCard;


exports.statsGet = async function (req, res, next) {
	let stats = {}
	stats.cashPool = generateDashbardCard('Cash Pool', await aggrigationsHelper.cashPool());
	stats.totalBorrowers = generateDashbardCard('Borrowers', await aggrigationsHelper.totalBorrowers());
	stats.totalInvestors = generateDashbardCard('Investors', await aggrigationsHelper.totalInvestors());
	stats.totalLoanAmount = generateDashbardCard('Loan Amount', await aggrigationsHelper.totalLoanAmount());
	stats.totalInvestedAmount = generateDashbardCard('Invested Amount', await aggrigationsHelper.totalInvestedAmount());
	res.status(200).json({
		data: stats
	})
};

