const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const models = require('../../../models');
const utilHelper = require('../../../helpers/util');

const amountRound = utilHelper.roundAmount;


exports.payInstallmentValidator = [
	(req, res, next) => {
		const loanId = req.params.loanId;
		const installmentId = req.params.installmentId;

		models.Loan.findByPk(loanId, {
			where: {
				status: 'OPEN',
			},
			include: [
				{
					model: models.Installment,
					where: {
						id: installmentId,
						// status: { $ne:'PAYMENT_DUE' },
					},
					// order: [
					// 	['dueDate', 'ASC']
					// ]
				},
				{ model: models.Borrower }
			]
		}).then(loan => {
			if (loan) {
				let installment = (loan.Installments) ? loan.Installments[0] : null;
				req.loan = loan;
				req.installment = installment;

				if (installment) {
					models.Transaction.findOne({
						where: { installmentId: installment.id, transactionFlow: 'DEBITED' },
						attributes: [

							[models.sequelize.fn('SUM', models.sequelize.col('interestAmount')), 'paidInterestAmount'],
							[models.sequelize.fn('SUM', models.sequelize.col('amount')), 'paidAmount'],
							[models.sequelize.fn('SUM', models.sequelize.col('principalAmount')), 'paidPrincipalAmount'],
						]
					}).then(aggregations => {
						req.installmentAggre = aggregations;
						next();
					});

				} else {
					res.status(404).json({ message: 'Loan does not has any installment.' });
				}
			} else {
				res.status(404).json({ message: 'Invalid loan id is provided.' });
			}
		}).catch(error => {
			res.status(500).json({ message: error });
		});

	},

	body('amount').isLength({ min: 1 }).withMessage('This field is required.')
		.isFloat().withMessage('Field must be a number.')
		.custom((value, { req }) => {
			const amount = parseFloat(value);
			let paidAmount = req.installmentAggre.dataValues.paidAmount;
			paidAmount = (paidAmount) ? parseFloat(paidAmount) : 0;
			let remainingAmount = amountRound(req.installment.payableAmount - paidAmount);
			if (amount <= 0)
				throw new Error('Amount must be greater then 0.');
			else if (amount > remainingAmount)
				throw new Error('Amount should be less then installment Amount(' + remainingAmount + ')');
			return true;
		}),

	sanitizeBody('amount').trim().escape(),

	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).json({ 'errors': errors.array({ onlyFirstError: true }) });
		} else {
			next();
		}
	}
];