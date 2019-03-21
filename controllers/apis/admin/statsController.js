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

	stats.assetsUnderManagement = generateDashbardCard('Assets Under Management', await aggrigationsHelper.assetsUnderManagement());
	stats.interestIncome = generateDashbardCard('Interest Income', await aggrigationsHelper.interestIncome());
	stats.fees = generateDashbardCard('Fees', await aggrigationsHelper.fees());
	stats.operatingIncome = generateDashbardCard('Operating Income', await aggrigationsHelper.operatingIncome());
	stats.cashDeposit = generateDashbardCard('Cash Deposit', await aggrigationsHelper.cashDeposit());
	stats.cashWithdrawals = generateDashbardCard('Cash Withdrawals', await aggrigationsHelper.cashWithdrawals());
	stats.cashAvailableToWithdrawal = generateDashbardCard('Cash Available To Withdrawal', await aggrigationsHelper.cashAvailableToWithdrawal());
	stats.cashAvailableToWithdrawalInvestor = generateDashbardCard('Cash Available To Withdrawal Investor', await aggrigationsHelper.cashAvailableToWithdrawalInvestor());
	stats.percentageOwnership = generateDashbardCard('Percentage Ownership', await aggrigationsHelper.percentageOwnership());
	res.status(200).json({
		data: stats
	})
};

