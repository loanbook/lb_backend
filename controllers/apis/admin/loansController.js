const models = require('../../../models');
const loanValidators = require('../../../middlewares/apis/admin/loansValidators');

exports.listLoansGet = [
	async (req, res, next) => {
		models.Loan.findAll().then(q_res => {
			res.status(200).json({loans: q_res});
		}).catch(error => {
			res.status(500).json({message: error.message});
		})
	}
];

exports.detailLoanGet = [
	async (req, res, next) => {
		const loanId = req.params.id;

		models.Loan.findOne({where: {id: loanId}}).then(q_res => {
			if(!q_res){
				res.status(404).json({message: 'No loan is found against provided loan id.'})
			}else{
				res.status(200).json({loan: q_res});
			}
		}).catch(error => {
			res.status(500).json({message: error.message});
		});
	}
];

exports.createLoanPost = [

	loanValidators.createLoanReqValidator,

	async (req, res, next) => {
	let loan = null;
		models.Loan.create({
			amount: req.body.amount,
			duration: req.body.duration,
			interestRate: req.body.interestRate
		}).then(q_res => {
			if(!q_res){
				res.status(404).json({message: 'No loan is found against provided loan id.'})
			}else{
				res.status(200).json({loan: q_res});
			}
		}).catch(error => {
			res.status(500).json({message: error.message});
		});
	}
];


exports.updateLoanPut = [

	loanValidators.updateLoanReqValidator,

	async (req, res, next) => {

		const loan = req.loan;
		loan.amount = req.body.amount;
		loan.duration = req.body.duration;
		loan.interestRate = req.body.interestRate;
		loan.save().then(q_res => {
			res.status(200).json({loan: q_res});
		}).catch(error => {
			res.status(500).json({message: error.message})
		})
	}
];


exports.loanDelete = [
	async (req, res, next) => {
		const loanId = req.params.id;
		models.Loan.findOne({where: {id: loanId}}).then(q_res => {
			if(!q_res){
				res.status(400).json({message: 'No loan is found against provided loan id.'})
			}else{
				q_res.destroy().then(dq_res => {
					res.status(200).json({message: 'Loan has been deleted successfully.', loan: q_res})
				})
			}
		}).catch(error => {
			res.status(500).json({message: error.message});
		});
	}
];