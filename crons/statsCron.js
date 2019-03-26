const models = require('../models');
const aggrigationsHelper = require('../helpers/aggregationsHelper');
const moment = require('moment');

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
		console.log('cron updated successfully',moment().format('YYYY-MM-DD HH:MM:ss'));
	}).catch(error => {
		// res.status(500).json({ message: error.message });
		// log for error execution
		console.log(error.message);
	})
}

