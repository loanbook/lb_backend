const uuidv1 = require('uuid/v1');
const models = require('../../../models');
const authHelper = require('../../helpers/authHelper');
const borrowerValidators = require('../../../middlewares/apis/admin/borrowersValidator');


exports.listBorrowersGet = [
	(req, res, next) => {
		models.User.findAll({
			include: [
				{
					model: models.Borrower,
					where: {userId: {[models.Sequelize.Op.not]: null}}
				}
			],
		}).then(q_res => {
			res.status(200).json({borrowers: q_res})
		}).catch(error => {
			res.status(500).json({message: error.message})
		});
	}
];


exports.detailBorrowerGet = [
	(req, res, next) => {

		const borrowerId = req.params.id;
		let investor = models.User.findByPk(borrowerId, {
			include: [
				{
					model: models.Borrower,
					where: {userId: {[models.Sequelize.Op.not]: null}}
				}
			]
		}).then(q_res => {
			if(q_res) res.status(200).json({borrower: q_res});
			else res.status(404).json({message: 'No borrower found with provided borrower id.'})
		}).catch(error => {
			res.status(500).json({message: error.message})
		});
	}
];


exports.createBorrowerPost = [
	borrowerValidators.createBorrowerReqValidator,

	(req, res, next) => {

		models.User.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			isActive: req.isActive,
			password: authHelper.getPasswordHash(uuidv1())
		}).then(q_res => {
			models.Borrower.create({
				userId: q_res.id,
				businessName: req.body.businessName,
				description: req.body.description
			}).then(bq_res => {
				q_res.dataValues.Borrower = bq_res;
				res.status(200).json({borrower: q_res});
			})
		}).catch(error => {
			res.status(500).json({message: error.message})
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
			if(req.body.description){borrower.Borrower.description = req.body.description;}
			borrower.Borrower.businessName = req.body.businessName;
			borrower.save().then(bq_res => {
				res.status(200).json({borrower: q_res});
			})
		}).catch(error => {
			res.status(500).json({message: error.message})
		})
	}
];


exports.loanBorrowerDelete = [
	(req, res, next) => {
		res.status(200).json({})
	}
];
