const models = require('../../models');


totalInvestorInvested = async (investorId) => {
	try{
		let sum = await models.Transaction.sum('amount', {where: {userId: investorId, transactionFlow: 'CREDITED'}});
		return sum;
	}catch (e) {
		return 0;
	}
};

totalInvestorDebited = async (investorId) => {
	try{
		let sum = await models.Transaction.sum('amount', {where: {userId: investorId, transactionFlow: 'DEBITED'}});
		return sum;
	}catch (e) {
		return e;
	}
};

fetchInvestorInvestment = async (investorId) => {
	let credited = await totalInvestorInvested(investorId);
	let debited = await totalInvestorDebited(investorId);

	credited = (parseInt(credited)) ? credited : 0;
	debited = (parseInt(debited)) ? debited : 0;
	return credited - debited;
};

totalInvestmentsTillNow = async () => {
	try {
		return  await models.Transaction.sum('amount', {where: {transactionFlow: 'CREDITED', type: 'INVESTMENT_DEPOSIT'}})
	}catch (e) {
		return 0;
	}
};

totalDebitedTilNow = async () => {
	try {
		return  await models.Transaction.sum('amount', {where: {transactionFlow: 'DEBITED', type: 'INVESTMENT_WITHDRAW'}})
	}catch (e) {
		return 0;
	}
};

cashPool = async () => {
	let credited = totalInvestmentsTillNow();
	let debited = totalDebitedTilNow();
	return credited - debited;
};

module.exports = {
	totalInvestorInvested: totalInvestorInvested,
	totalInvestorDebited: totalInvestorDebited,
	fetchInvestorInvestment: fetchInvestorInvestment,
	cashPool: cashPool,
	totalInvestmentsTillNow: totalInvestmentsTillNow,
	totalDebitedTilNow: totalDebitedTilNow
};