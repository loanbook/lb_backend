const models = require('../../../models');
const aggrigationsHelper = require('../../../helpers/aggregationsHelper');
const utilsHelper = require('../../../helpers/util');

const generateDashbardCard = utilsHelper.generateDashbardCard;


exports.statsGet = async function (req, res, next) {
	let companyDetail = await models.LoanBook.findOne({
		order: [ [ 'createdAt', 'DESC' ]],
	});
	models.Stats.findOne({
		order: [['createdAt', 'DESC']],
	}).then(q_res => {
		const stats = {}
		stats.cashPool = generateDashbardCard('Cash Pool', companyDetail.cashPool);
		stats.totalBorrowers = generateDashbardCard('Borrowers', q_res.totalBorrowers);
		stats.totalInvestors = generateDashbardCard('Investors', q_res.totalInvestors);
		stats.totalLoanAmount = generateDashbardCard('Loan Amount', companyDetail.loanApprovedAmount);
		stats.totalInvestedAmount = generateDashbardCard('Invested Amount', q_res.totalInvestedAmount);
		stats.assetsUnderManagement = generateDashbardCard('Assets Under Management', q_res.assetsUnderManagement);
		stats.interestIncome = generateDashbardCard('Interest Income', q_res.interestIncome);
		stats.fees = generateDashbardCard('Fees', companyDetail.fees);
		stats.operatingIncome = generateDashbardCard('Operating Income', companyDetail.interestIncome - companyDetail.fees);
		stats.cashDeposit = generateDashbardCard('Cash Deposit', companyDetail.cashDeposit);
		stats.cashWithdrawals = generateDashbardCard('Cash Withdrawals', companyDetail.cashWithdrawal);
		stats.cashAvailableToWithdrawal = generateDashbardCard('Cash Available To Withdrawal', q_res.cashAvailableToWithdrawal);
		// stats.cashAvailableToWithdrawalInvestor = generateDashbardCard('Cash Available To Withdrawal Investor', await aggrigationsHelper.cashAvailableToWithdrawalInvestor());
		// stats.percentageOwnership = generateDashbardCard('Percentage Ownership', await aggrigationsHelper.percentageOwnership());
		res.status(200).json({ data: stats });
	}).catch(error => {
		res.status(500).json({ message: error.message });
	})

};


exports.calculateAndSaveStats = async function () {

	stats = models.Stats.build({})
	stats.cashPool = await aggrigationsHelper.cashPool();
	stats.totalBorrowers = await aggrigationsHelper.totalBorrowers();
	stats.totalInvestors = await aggrigationsHelper.totalInvestors();
	stats.totalLoanAmount = await aggrigationsHelper.totalLoanAmount();
	stats.totalInvestedAmount = await aggrigationsHelper.totalInvestedAmount();
	stats.assetsUnderManagement = await aggrigationsHelper.assetsUnderManagement();
	stats.interestIncome = await aggrigationsHelper.interestIncome();
	stats.fees = await aggrigationsHelper.fees();
	stats.operatingIncome = await aggrigationsHelper.operatingIncome();
	stats.cashDeposit = await aggrigationsHelper.cashDeposit();
	stats.cashWithdrawals = await aggrigationsHelper.cashWithdrawals();
	stats.cashAvailableToWithdrawal = await aggrigationsHelper.cashAvailableToWithdrawal();
	stats.save().then(q_res => {
		// res.status(200).json({ data: q_res });
		// log for successfull execution
	}).catch(error => {
		// res.status(500).json({ message: error.message });
		// log for error execution
	})
}

