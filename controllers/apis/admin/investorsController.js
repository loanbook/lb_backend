const models = require('../../../models');
const authHelper = require('../../../helpers/authHelper');
const investorValidators = require('../../../middlewares/apis/admin/investorsValidators');
const aggregationsHelper = require('../../../helpers/aggregationsHelper');
const { investorQueue } = require('../../../crons/backendQueue');


exports.listInvestorsGet = async (req, res, next) => {
	let investors = await models.User.findAll({
		include: [
			{
				model: models.Investor,
				where: { userId: { [models.Sequelize.Op.not]: null } }
			}
		],
	});
	res.status(200).json({ investors });
};


exports.detialInvestorGet = [
	async (req, res, next) => {
		const investorID = req.params.id;
		let investor = await models.User.findByPk(investorID, {
			include: [
				{
					model: models.Investor,
					where: { userId: { [models.Sequelize.Op.not]: null } }
				}
			]
		});
		if (investor) {
			investor.dataValues.investment = await aggregationsHelper.fetchInvestorInvestment(investor.id);
			investor.dataValues.investorPercentage = await aggregationsHelper.fetchInvestorPercentage(investor.id);
			investor.dataValues.investorPoolShare = await aggregationsHelper.fetchInvestorPoolShare(investor.id);
			res.status(200).json({ investor });
		}
		else res.status(404).json({ message: 'No investor found with provided investor id.' })
	}
];


exports.createInvestorPost = [

	investorValidators.createInvestorReqValidator,

	async (req, res, next) => {
		const initialDeposit = parseInt(req.body.initialBalance);
		let investorProfile = null;
		let trans_detail = null;

		let userInstance = models.User.build({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			isActive: req.isActive,
		});
		userInstance.setPassword = null;

		models.sequelize.transaction((t) => {
			return userInstance.save({ transaction: t }).then(user => {
				investorProfile = user;
				return models.Investor.create({
					userId: user.id,
					location: req.body.Investor.location,
					totalInvested: initialDeposit,
				}, { transaction: t }).then(investor => {
					investorProfile.dataValues.Investor = investor;
					const initialDeposit = parseInt(req.body.initialBalance);
					if (initialDeposit) {
						return models.Transaction.create({
							userId: investor.userId, type: 'INVESTMENT_DEPOSIT', transactionFlow: 'CREDITED', amount: initialDeposit,
							comment: 'Initial deposit'
						}, { transaction: t }).then(trans => {
							trans_detail = trans;
							return models.LoanBook.findOne().then(companyDetail => {
								companyDetail.cashPool = companyDetail.cashPool + initialDeposit;
								companyDetail.cashDeposit = companyDetail.cashDeposit + initialDeposit;
								return companyDetail.save({ transactions: t }).then(res_qs => {
									// update the ownershipPercentage for all users
									investorQueue.add('investorInitialDeposit', { investorId: investor.userId })
								});
							});
						});
					}
				});
			});
		}).then(result => {
			if (trans_detail) {
				res.status(200).json({ investor: investorProfile, transaction: trans_detail });
			} else {
				res.status(200).json({ investor: investorProfile });
			}
		}).catch(error => {
			res.status(500).json({ error: error.message });
		});
	}
];

exports.updateInvestorPut = [

	investorValidators.updateInvestorReqValidator,

	async (req, res, next) => {
		const investorId = req.params.id;
		let investor = req.investor;

		investor.firstName = req.body.firstName;
		investor.lastName = req.body.lastName;
		investor.email = req.body.email;
		investor.isActive = req.body.isActive;
		investor.save().then(user => {
			investor.Investor.location = req.body.Investor.location;
			investor.Investor.save().then(q_investor => {
				res.status(200).json({ investor: investor })
			})
		}).catch(error => {
			res.status(500).json({ message: error.message })
		});

	}
];


exports.investorAddDeposit = [
	investorValidators.addDepositValidator,

	async (req, res, next) => {
		const amountDeposit = parseInt(req.body.amount);
		let investor = req.investor.Investor;
		let transDeposit = null;
		models.sequelize.transaction((t) => {
			return models.Transaction.create({
				userId: req.investor.userId, type: 'INVESTMENT_DEPOSIT', transactionFlow: 'CREDITED', amount: amountDeposit,
				comment: 'Deposit'
			}, { transactions: t })
				.then(trans => {
					transDeposit = trans;
					return models.LoanBook.findOne().then(companyDetail => {
						companyDetail.cashPool = companyDetail.cashPool + amountDeposit;
						companyDetail.cashDeposit = companyDetail.cashDeposit + amountDeposit;
						return companyDetail.save({ transactions: t }).then(res_qs => {
							investor.totalInvested = investor.totalInvested + amountDeposit;
							return investor.save({ transactions: t }).then(res_investor_qs => {
								// this backend process will update percentage for each user after this investment.
								investorQueue.add('investorAddDeposit', { investorId: res_investor_qs.userId });
								return res_investor_qs;
							});
						});
					});
				})
		}).then(investor_qs => {
			req.investor.Investor = investor_qs;
			res.status(200).json({ transaction: transDeposit, investor: req.investor })
		}).catch(error => {
			res.status(500).json({ error: error.message });
		});
	}
];

exports.investorWithdraw = [
	investorValidators.withdrawValidator,

	async (req, res, next) => {
		const amountWithdraw = parseInt(req.body.amount);
		let investor = req.investor.Investor;
		let transWithdraw = null;
		models.sequelize.transaction((t) => {
			return models.Transaction.create({
				userId: req.investor.userId, type: 'INVESTMENT_WITHDRAW', transactionFlow: 'DEBITED', amount: amountWithdraw,
				comment: 'Withdraw'
			}, { transactions: t }).then(trans => {
				transWithdraw = trans;
				return models.LoanBook.findOne().then(companyDetail => {
					companyDetail.cashPool = companyDetail.cashPool - amountWithdraw;
					companyDetail.cashWithdrawal = companyDetail.cashWithdrawal + amountWithdraw;
					return companyDetail.save({ transactions: t }).then(res_qs => {
						investor.totalWithdraw = investor.totalWithdraw + amountWithdraw;
						return investor.save({ transactions: t }).then(res_investor_qs => {
							// this backend process will update percentage for each user after this withdraw.
							investorQueue.add('investorWithdraw', { investorId: res_investor_qs.userId });
							return res_investor_qs;
						});
					});
				});
			});
		}).then(investor_qs => {
			req.investor.Investor = investor_qs;
			res.status(200).json({ transaction: transWithdraw, investor: req.investor })
		}).catch(error => {
			res.status(500).json({ error: error.message });
		});
	}
];

exports.investorDelete = async (req, res, next) => {
	const investorId = req.params.id;
	let investor = await models.User.findByPk(investorId, {
		include: [
			{
				model: models.Investor,
				where: { userId: { [models.Sequelize.Op.not]: null } }
			}
		]
	});

	if (!investor) { res.status(404).json({ message: 'No investor found with provided investor id.' }); }
	else {
		investor.destroy().then((q_data) => {
			res.status(200).json({ 'message': 'Investor has been deleted successfully.' })
		}).catch((error) => {
			res.status(500).json({ 'message': "Unable to delete investor" })
		})
	}
};