const models = require('../models');
const aggrigationsHelper = require('../helpers/aggregationsHelper');
const moment = require('moment');

exports.distributeShare = function (job) {
	console.log('--------- Distribute Share Process ---------');
	console.log('recoveryAmount: ', job.data.recoveryAmount);
	const recoveryAmount = job.data.recoveryAmount;
	models.Investor.findAll({}).then(investors => {
		for (key in investors) {
			let investor = investors[key];
			investorShare = recoveryAmount * (investor.ownershipPercentage / 100);
			investor.currentWeitage = investor.currentWeitage + investorShare;
			investor.operatingIncome = investor.operatingIncome + investorShare;
			// investor.save()
			// No need to update percentage as by this loan profit will not effect 
		}
		return Promise.resolve({ success: true });
	}).catch(error => {
		return Promise.reject({ message: error.message });
	})
}

exports.calculateAcuredInterestUpdatePercentage = function (job) {
	console.log('--------- Calculate Acured InterestUpdate Percentage Process ---------');
	console.log('investmentAmount: ', job.data.investmentAmount);
	const InvestmentAmount = job.data.investmentAmount;
	// const currentDate = moment().format('YYYY-MM-DD');
	aggrigationsHelper.acuredAllLoansInterest().then(
		(acuredInterestTillToday) => {
			console.log(acuredInterestTillToday);
			// No need to update percentage as it loan profit will not effect 
			return Promise.resolve({ success: true });
		}).catch(error => {
			return Promise.reject({ message: error.message });
		})
}

