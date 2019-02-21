const models = require('../../models');


module.exports = {

	fetchInvestorInvestment: async (investorId) => {
		let credited = this.totalInvestorInvested(investorId);
		let debited = this.totalInvestorDebited(investorId);
		return credited - debited;
	},
	totalInvestorInvested: async (investorId) => {
		try{
			return await models.Transactions.sum('amount', {where: {userId: investorId, transactionFlow: 'CREDITED'}});
		}catch (e) {
			return 0;
		}
	},
	totalInvestorDebited: async (investorId) => {
		try{
			return await models.Transactions.sum('amount', {where: {userId: investorId, transactionFlow: 'DEBITED'}});
		}catch (e) {
			return e;
		}
	},

	cashPool: async () => {
		let credited = this.totalInvestmentsTillNow();
		let debited = this.totalDebitedTilNow();
		return credited - debited;
	},

	totalInvestmentsTillNow: async () => {
		try {
			return  await models.Transaction.sum('amount', {where: {transactionFlow: 'CREDITED', type: 'INVESTMENT_DEPOSIT'}})
		}catch (e) {
			return 0;
		}
	},

	totalDebitedTilNow: async () => {
		try {
			return  await models.Transaction.sum('amount', {where: {transactionFlow: 'DEBITED', type: 'INVESTMENT_WITHDRAW'}})
		}catch (e) {
			return 0;
		}
	}

};