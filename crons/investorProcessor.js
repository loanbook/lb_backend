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
			investor.operatingIncome = investor.operatingIncome + investorShare;
			investor.save()
			// No need to update percentage as by this loan profit will not effect
			// todo-- all logs to portfolio
		}
		return Promise.resolve({ success: true });
	}).catch(error => {
		return Promise.reject({ message: error.message });
	})
}

addInvestmentAmount = async (investmentAmount, investorId) => {
	// add investment to company portfolio
	let companyDetail = await models.LoonBook.findOne();
	companyDetail.cashPool = companyDetail.cashPool + investmentAmount;
	companyDetail.cashDeposit = companyDetail.cashDeposit + investmentAmount;
	companyDetail.save()
	// add investment to Investor portfolio
	let inestorDetail = await models.Investor.findByPk(investorId);
	inestorDetail.totalInvested = inestorDetail.totalInvested + investmentAmount;
	inestorDetail.save()

	// re evaluate the ownership for all user
	
}

exports.calculateAcuredInterestUpdatePercentage = function (job) {
	console.log('--------- Calculate Acured InterestUpdate Percentage Process ---------');
	console.log('investmentAmount: ', job.data.investmentAmount);
	const investmentAmount = job.data.investmentAmount;
	const investorId = job.data.investorId;
	// const currentDate = moment().format('YYYY-MM-DD');
	// aggrigationsHelper.acuredAllLoansInterest().then(
	aggrigationsHelper.outstandingCapitalFromLoans().then(
		(acuredInterestTillToday) => {
			console.log(acuredInterestTillToday);
			// No need to update percentage as it loan profit will not effect 
			return Promise.resolve({ success: true });
		}).catch(error => {
			return Promise.reject({ message: error.message });
		})
}

