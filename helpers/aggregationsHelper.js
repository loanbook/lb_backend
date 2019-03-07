const models = require('../models/index');
const moment = require('moment');

const utilHelper = require('./util');

const amountRound = utilHelper.roundAmount;
const calculatePercentage = utilHelper.getPercentage;


totalInvestorInvested = async (investorId) => {
	try {
		let sum = await models.Transaction.sum('amount', { where: { userId: investorId, transactionFlow: 'CREDITED' } });
		return sum;
	} catch (e) {
		return 0;
	}
};

totalInvestorDebited = async (investorId) => {
	try {
		let sum = await models.Transaction.sum('amount', { where: { userId: investorId, transactionFlow: 'DEBITED' } });
		return sum;
	} catch (e) {
		return e;
	}
};

totalBorrowTillNow = async (borrowerId) => {
	try {
		let borrowed_amount = await models.Transaction.sum('amount', { where: { userId: borrowerId, transactionFlow: 'CREDITED' } });
		return borrowed_amount ? borrowed_amount : 0;
	} catch (e) {
		return 0;
	}
};

totalBorrowerCredited = async (borrowerId) => {
	try {
		let credited = await models.Transaction.sum('amount', { where: { userId: borrowerId, transactionFlow: 'CREDITED' } });
		return credited ? credited : 0;
	} catch (e) {
		return 0;
	}
};

totalBorrowerDebited = async (borrowerId) => {
	try {
		let debited = await models.Transaction.sum('amount', { where: { userId: borrowerId, transactionFlow: 'DEBITED' } });
		return debited ? debited : 0;
	} catch (e) {
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

fetchInvestorPercentage = async (investorId) => {
	let investedAmount = await totalInvestorInvested(investorId);
	let poolTotalInvestment = await fetchPoolTotalInvestment();
	return investorPercentage = (investedAmount / poolTotalInvestment) * 100
};
fetchInvestorPoolShare = async (investorId) => {
	let investorPercentage = await fetchInvestorPercentage(investorId);
	let poolCurrentAmount = await cashPool();
	return investorPoolShare = amountRound(poolCurrentAmount * (investorPercentage / 100))
};

totalInvestmentsTillNow = async () => {
	try {
		return await models.Transaction.sum('amount', { where: { transactionFlow: 'CREDITED', type: 'INVESTMENT_DEPOSIT' } })
			.then(
				tITN_res => {
					return tITN_res ? tITN_res : 0;
				})
	} catch (e) {
		return 0;
	}
};

totalDebitedTilNow = async () => {
	try {
		return await models.Transaction.sum('amount', { where: { transactionFlow: 'DEBITED', type: 'INVESTMENT_WITHDRAW' } })
			.then(
				tDTN_res => {
					return tDTN_res ? tDTN_res : 0;
				})
	} catch (e) {
		return 0;
	}
};

fetchPoolTotalInvestment = async () => {
	let credited = await totalInvestmentsTillNow();
	return credited;
};

cashPool = async () => {
	let installmentsCredited = await totalInvestmentsTillNow();
	let debited = await totalDebitedTilNow();
	return installmentsCredited - debited;
};

updateLoanAggregations = async (loanId) => {
	return await models.Transaction.findOne({
		where: { loanId: loanId, userId: null },
		attributes: [
			[models.sequelize.fn('SUM', models.sequelize.col('interestAmount')), 'paid_amount'],
			[models.sequelize.fn('COUNT', models.sequelize.col('amount')), 'total_paid_installments'],
		]
	})
}


updateBorrowerAggregations = async (userId) => {
	let total_borrowed = await totalBorrowTillNow(userId);
	// let borrow_credited = await totalBorrowerCredited(userId);
	let borrow_debited = await totalBorrowerDebited(userId);
	let remaining_borrowed_amount = total_borrowed - borrow_debited;

	return {
		total_borrowed_amount: total_borrowed,
		remaining_borrowed_amount: remaining_borrowed_amount,
		total_amount_return: borrow_debited
	}
}

fetchLateInstallmentFee = async (loanId) => {
	let loanDetail = await models.Loan.findOne({
		where: { id: loanId },
	});
	return loanDetail.amount ? calculatePercentage(loanDetail.amount, 1) : 0; // --todo: include late fee
};
fetchInstallmentInterestTillToday = async (loanId) => {
	let installmentDetail = await models.Installment.findOne({
		where: { loanId: loanId, status: 'PAYMENT_DUE' },
	});
	let installmentInterestPerDay = 0;
	let numberOfdays = 0;
	if (installmentDetail) {
		installmentInterestPerDay = installmentDetail.interestAmount / 30; // --todo: change according to month and payment
		let installmentDueDate = moment(installmentDetail.dueDate);
		let currentDate = moment();
		if (currentDate > installmentDueDate)
			numberOfdays = currentDate.diff(installmentDueDate, 'days');
	}
	return installmentInterestPerDay * numberOfdays;
};

module.exports = {
	totalInvestorInvested: totalInvestorInvested,
	totalInvestorDebited: totalInvestorDebited,
	fetchInvestorInvestment: fetchInvestorInvestment,
	fetchInvestorPercentage: fetchInvestorPercentage,
	fetchInvestorPoolShare: fetchInvestorPoolShare,
	cashPool: cashPool,
	totalInvestmentsTillNow: totalInvestmentsTillNow,
	totalDebitedTilNow: totalDebitedTilNow,
	fetchLateInstallmentFee: fetchLateInstallmentFee,
	fetchInstallmentInterestTillToday: fetchInstallmentInterestTillToday,
	updateLoanAggregations: updateLoanAggregations,
	updateBorrowerAggregations: updateBorrowerAggregations,
};