const models = require('../models/index');
const moment = require('moment');

const utilHelper = require('./util');

const amountRound = utilHelper.roundAmount;
const calculatePercentage = utilHelper.getPercentage;
const Op = models.Sequelize.Op;


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
		order: [
			['createdAt', 'DESC']
		],
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

acuredInstallmentInterest = async (loanId) => {
	let currentDate = moment();
	let nextDueInstallmentDetail = await models.Installment.findOne({
		where: {
			loanId: loanId, status: 'PAYMENT_DUE', dueDate: {
				[Op.gt]: currentDate,
			}
		},
		order: [
			['id', 'ASC']
		],
	});
	let installmentInterestPerDay = 0;
	let numberOfdays = 0;
	if (nextDueInstallmentDetail) {
		installmentInterestPerDay = nextDueInstallmentDetail.interestAmount / 30; // --todo: change according to month and payment
		let installmentDueDate = moment(nextDueInstallmentDetail.dueDate);
		numberOfdays = Math.abs(currentDate.diff(installmentDueDate, 'days'));
	}
	return installmentInterestPerDay * numberOfdays;
};

acuredAllLoansInterest = async () => {
	const openLoans = await models.Loan.findAll({
		where: { status: 'OPEN' },
	});
	let sumLoansAcuredInterest = 0;
	if (openLoans) {
		for (key in openLoans) {
			let openLoan = openLoans[key];
			const installmentInterestTillToday = await acuredInstallmentInterest(openLoan.id);
			console.log(installmentInterestTillToday);
			sumLoansAcuredInterest = sumLoansAcuredInterest + installmentInterestTillToday;
		}
	}
	return sumLoansAcuredInterest;
}

totalBorrowers = async () => {
	try {
		let borrowers = await models.Borrower.count();
		return borrowers ? borrowers : 0;
	} catch (e) {
		return 0;
	}
}
totalInvestors = async () => {
	try {
		let investors = await models.Investor.count();
		return investors ? investors : 0;
	} catch (e) {
		return 0;
	}
}
totalLoanAmount = async () => {
	try {
		let borrowedAmount = await models.Loan.sum('amount', { where: { status: 'APPROVED' } });
		return borrowedAmount ? borrowedAmount : 0;
	} catch (e) {
		return 0;
	}
}
totalInvestedAmount = async () => {
	try {
		let investedAmount = await models.Transaction.sum('amount', { where: { type: 'INVESTMENT_DEPOSIT', transactionFlow: 'CREDITED' } });
		return investedAmount ? investedAmount : 0;
	} catch (e) {
		return 0;
	}
}

remainingLoanCapital = async (loanId) => {
	try {
		let interestPlusAmount = await models.Installment.sum('payableAmount', { where: { loanId: loanId, status: 'PAYMENT_DUE' } });
		return interestPlusAmount ? interestPlusAmount : 0;
	} catch (e) {
		return 0;
	}
}

/** 
1. Timely paid loans are valued at a 100%
2. Loans on grace periods ( 1 - 5 days ) are valued at 100%
3. Late payment loans ( stage 1: 6 - 30 days ) are valued at 95%
4. Late payment loans ( stage 2: 31 - 60 days ) are valued at 90%
5. Late payment loans ( stage 3: 61 - 90 days ) are valued at 50%
6. Collection (91+ days) are valued at 0%
 * **/

outstandingLoanValuedPercentage = async (loanId) => {
	let currentDate = moment();
	let firstDueInstallmentDetail = await models.Installment.findOne({
		where: {
			loanId: loanId, status: 'PAYMENT_DUE', dueDate: {
				[Op.lt]: currentDate,
			}
		},
		order: [
			['id', 'ASC']
		],
	});
	let loanPercentageValuation = 100;
	if (firstDueInstallmentDetail) {
		let installmentDueDate = moment(firstDueInstallmentDetail.dueDate);
		numberOfdays = Math.abs(currentDate.diff(installmentDueDate, 'days'));
		if (6 <= numberOfdays <= 30) {
			loanPercentageValuation = 95;
		}
		else if (31 <= numberOfdays <= 60) {
			loanPercentageValuation = 90;
		}
		else if (61 <= numberOfdays <= 90) {
			loanPercentageValuation = 50;
		}
		else if (91 <= numberOfdays) {
			loanPercentageValuation = 0;
		}
	}
	return loanPercentageValuation;
}
outstandingCapitalFromLoans = async () => {
	try {
		const openLoans = await models.Loan.findAll({
			where: { status: 'OPEN' },
		});
		let sumLoansAcuredValuation = 0;
		if (openLoans) {
			for (key in openLoans) {
				let openLoan = openLoans[key];
				const outstandingLoanPercentage = await outstandingLoanValuedPercentage(openLoan.id);
				const remainingCapital = await remainingLoanCapital(openLoan.id);
				const accruedInterest = await acuredInstallmentInterest(openLoan.id);
				console.log(outstandingLoanPercentage);
				// outstandingLoanPercentage * (accrued interest + remaining capital)
				openLoanValuation = (remainingCapital + accruedInterest) * outstandingLoanPercentage / 100;
				sumLoansAcuredValuation = sumLoansAcuredValuation + openLoanValuation;
			}
		}
		return sumLoansAcuredValuation;
	} catch (e) {
		return 0;
	}
}

/*
Things to Show on Dashboard
*/

/*
# 1 Assets under management == 
( Cash  + outstanding capital from loans (adjusted for "default", remember the valuation mathod proposed before) + accrued interest )
*/
assetsUnderManagement = async () => {
	try {
		let acuredAllLoansInterest = await acuredAllLoansInterest();
		let outstandingCapitalFromLoans = await outstandingCapitalFromLoans();
		let cash = await cashPool();
		return cash + outstandingCapitalFromLoans + acuredAllLoansInterest;
	} catch (e) {
		return 0;
	}
}

/*
# 2 Cashpool == 
total amount of cash
*/
cashPool = async () => {
	try {
		let companyDetail = await models.LoanBook.findOne();
		return companyDetail.cashPool;
	} catch (e) {
		return 0;
	}
}

/*
# 3 Interest income ==
all interest received
*/
interestIncome = async () => {
	try {
		let companyDetail = await models.LoanBook.findOne();
		return companyDetail.interestIncome;
	} catch (e) {
		return 0;
	}
}

/*
# 4 fees ==
All fees charged == interest * fee (%)
*/
fees = async () => {
	try {
		let companyDetail = await models.LoanBook.findOne();
		return companyDetail.fees;
	} catch (e) {
		return 0;
	}
}

/*
# 5 Operating income ==
interest income - fees
*/
operatingIncome = async () => {
	try {
		let companyDetail = await models.LoanBook.findOne();
		return companyDetail.interestIncome - companyDetail.fees;
	} catch (e) {
		return 0;
	}
}

/*
# 6 cash deposit ==
all deposits made by investors
*/
cashDeposit = async () => {
	try {
		let companyDetail = await models.LoanBook.findOne();
		return companyDetail.cashDeposit;
	} catch (e) {
		return 0;
	}
}

/*
# 7 cash withdrawals ==
all withdrawals clients made
*/
cashWithdrawals = async () => {
	try {
		let companyDetail = await models.LoanBook.findOne();
		return companyDetail.cashWithdrawal;
	} catch (e) {
		return 0;
	}
}

/*
# 8 cash available to withdraw ==
all operating income + deposits - withdrawals + capital repayments - investments
*/
cashAvailableToWithdrawal = async () => {
	try {
		let operatingIncome = await operatingIncome();
		let cashDeposit = await cashDeposit();
		let withdrawals = await withdrawals();
		return 0;
	} catch (e) {
		return 0;
	}
}

/*
# 9 cash available to withdraw (investor) ==
cashAvailableToWithdrawal == all operating income + deposits - withdrawals + capital repayments - investments
cashAvailableToWithdrawalInvestor == cashAvailableToWithdrawal * (% ownership of fund)
*/
cashAvailableToWithdrawalInvestor = async (investorId) => {
	try {
		return 0;
	} catch (e) {
		return 0;
	}
}

/*
# 10 % ownership
*/
percentageOwnership = async () => {
	try {
		return 0;
	} catch (e) {
		return 0;
	}
}

/*
# update percentage owner ship
*/
evaluatePercentageOwnership = async (investorId, investorInterestShare) => {
	try {
		let investorDetail = await models.Investor.findOne({
			where: {
				id: investorId
			}
		});
		let assetsUnderManagementValue = await assetsUnderManagement();
		//((Deposits - withdraws + investorOperatingIncome + investorInterestShare)/Assets under management) * 100
		return (investorDetail.totalInvested - investorDetail.totalWithdraw + investorDetail.operatingIncome + investorInterestShare) * assetsUnderManagementValue * 100
	} catch (e) {
		console.log('Percentage ownership evaluation fail for investor.', investorId)
		return 0;
	}
}

reEvaluatePercentageOwnershipAllInvestors = async () => {
	try {
		let investors = await models.Investor.findAll();
		let assetsUnderManagementValue = await assetsUnderManagement();
		for (key in investors) {
			let investorDetail = investors[key];
			//((Deposits - withdraws + investorOperatingIncome + investorInterestShare)/Assets under management) * 100
			investorDetail.ownershipPercentage = (investorDetail.totalInvested - investorDetail.totalWithdraw + investorDetail.operatingIncome) * assetsUnderManagementValue * 100
			investorDetail.save();
		}
		console.log('Percentage ownership for all user successfully updated.')
	} catch (e) {
		console.log('Percentage ownership updaet for all user fail.')
	}
}

module.exports = {
	totalInvestorInvested: totalInvestorInvested,
	totalInvestorDebited: totalInvestorDebited,
	fetchInvestorInvestment: fetchInvestorInvestment,
	fetchInvestorPercentage: fetchInvestorPercentage,
	fetchInvestorPoolShare: fetchInvestorPoolShare,
	totalInvestmentsTillNow: totalInvestmentsTillNow,
	totalDebitedTilNow: totalDebitedTilNow,
	fetchLateInstallmentFee: fetchLateInstallmentFee,
	fetchInstallmentInterestTillToday: fetchInstallmentInterestTillToday,
	updateLoanAggregations: updateLoanAggregations,
	updateBorrowerAggregations: updateBorrowerAggregations,
	totalBorrowers: totalBorrowers,
	totalInvestors: totalInvestors,
	totalLoanAmount: totalLoanAmount,
	totalInvestedAmount: totalInvestedAmount,
	acuredInstallmentInterest: acuredInstallmentInterest,
	acuredAllLoansInterest: acuredAllLoansInterest,
	outstandingLoanValuedPercentage: outstandingLoanValuedPercentage,
	outstandingCapitalFromLoans: outstandingCapitalFromLoans,

	assetsUnderManagement: assetsUnderManagement,
	cashPool: cashPool,
	interestIncome: interestIncome,
	fees: fees,
	operatingIncome: operatingIncome,
	cashDeposit: cashDeposit,
	cashWithdrawals: cashWithdrawals,
	cashAvailableToWithdrawal: cashAvailableToWithdrawal,
	cashAvailableToWithdrawalInvestor: cashAvailableToWithdrawalInvestor,
	percentageOwnership: percentageOwnership,
};