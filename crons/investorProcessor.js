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
			// No need to update percentage as it loan profit will not effect 
		}
		return Promise.resolve({ success: true });
	}).catch(error => {
		return Promise.reject({ message: error.message });
	})
}

exports.calculateAcuredInterestUpdatePercentage = function (job) {
	console.log('--------- Calculate Acured InterestUpdate Percentage Process ---------');
	console.log('InvestmentAmount: ', job.data.InvestmentAmount);
	const InvestmentAmount = job.data.InvestmentAmount;
	// loop through due installments for open loans
	const currentDate = moment().format('YYYY-MM-DD');
	models.Loan.findAll({
		where: { status:'OPEN' },
		include: [
			{ model: models.Borrower },
			{ model: models.Installment },
		],
	}).then(installments => { });
	// models.Investor.findAll({}).then(investors => {
	// 	for (key in investors) {
	// 		let investor = investors[key];
	// 		investorShare = recoveryAmount * (investor.ownershipPercentage / 100);
	// 		investor.currentWeitage = investor.currentWeitage + investorShare;
	// 		investor.operatingIncome = investor.operatingIncome + investorShare;
	// 		// investor.save()
	// 		// No need to update percentage as it loan profit will not effect 
	// 	}
	// 	return Promise.resolve({ success: true });
	// }).catch(error => {
	// 	return Promise.reject({ message: error.message });
	// })
}

