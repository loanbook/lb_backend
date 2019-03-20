const models = require('../../../models');
const authHelper = require('../../../helpers/authHelper');
const borrowerValidators = require('../../../middlewares/apis/admin/borrowersValidator');
const aggrigationsHelper = require('../../../helpers/aggregationsHelper');

exports.listBorrowersGet = [
	(req, res, next) => {
		models.User.findAll({
			include: [
				{
					model: models.Borrower,
					where: { userId: { [models.Sequelize.Op.not]: null } }
				}
			],
		}).then(q_res => {
			res.status(200).json({ borrowers: q_res })
		}).catch(error => {
			res.status(500).json({ message: error.message })
		});
	}
];


exports.detailBorrowerGet = [
	async (req, res, next) => {
		const borrowerId = req.params.id;
		let borrowerDetail = await models.User.findByPk(borrowerId, {
			include: [
				{
					model: models.Borrower,
					where: { userId: { [models.Sequelize.Op.not]: null } },
				}
			]
		});
		if (borrowerDetail) {
			let borrowerAggregationRes = await aggrigationsHelper.updateBorrowerAggregations(borrowerId);
			if (borrowerAggregationRes) {
				borrowerDetail.dataValues.total_borrowed_amount = borrowerAggregationRes.total_borrowed_amount;
				borrowerDetail.dataValues.remaining_borrowed_amount = borrowerAggregationRes.remaining_borrowed_amount;
				borrowerDetail.dataValues.total_amount_return = borrowerAggregationRes.total_amount_return;
				res.status(200).json({ loan: borrowerDetail });
			}
			else res.status(200).json({ loan: borrowerDetail });
		}
		else res.status(404).json({ message: 'No borrower found with provided borrower id.' })
	}
];


exports.createBorrowerPost = [
	borrowerValidators.createBorrowerReqValidator,

	(req, res, next) => {

		let userInstance = models.User.build({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			isActive: req.isActive,
		});
		userInstance.setPassword = null;

		userInstance.save().then(q_res => {
			models.Borrower.create({
				userId: q_res.id,
				businessName: req.body.Borrower.businessName,
				description: req.body.Borrower.description
			}).then(bq_res => {
				q_res.dataValues.Borrower = bq_res;
				res.status(200).json({ borrower: q_res });
			})
		}).catch(error => {
			res.status(500).json({ message: error.message })
		});
	}
];


exports.updateBorrowerPut = [

	borrowerValidators.updateBorrowerReqValidator,

	(req, res, next) => {
		let borrower = req.borrower;
		borrower.firstName = req.body.firstName;
		borrower.lastName = req.body.lastName;
		borrower.email = req.body.email;
		borrower.isActive = req.body.isActive;

		borrower.save().then(q_res => {
			if (req.body.Borrower.description) { borrower.Borrower.description = req.body.Borrower.description; }
			borrower.Borrower.businessName = req.body.Borrower.businessName;
			borrower.Borrower.save().then(bq_res => {
				q_res.dataValues.Borrower = bq_res;
				res.status(200).json({ borrower: q_res });
			})
		}).catch(error => {
			res.status(500).json({ message: error.message })
		})
	}
];


exports.loanBorrowerDelete = [
	(req, res, next) => {
		const borrowerId = req.params.id;
		let investor = models.User.findByPk(borrowerId, {
			include: [
				{
					model: models.Borrower,
					where: { userId: { [models.Sequelize.Op.not]: null } }
				}
			]
		}).then(q_res => {
			if (q_res) {
				q_res.destroy().then(dq_res => {
					res.status(200).json({ message: "Borrower has been deleted successfully." })
				})
			}
			else res.status(404).json({ message: 'No borrower found with provided borrower id.' })
		}).catch(error => {
			res.status(500).json({ message: error.message })
		});
	}
];
