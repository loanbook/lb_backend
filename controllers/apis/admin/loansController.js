const models = require('../../../models');
const loanValidators = require('../../../middlewares/apis/admin/loansValidators');
const installmentHelper = require('../../helpers/installmentsHelper');

/*
	@param: loan (Loan Model object)
*/

addLoanInstallments = async (loan) => {
	let installments = [];
	if (loan.loanType === 'FIXED_INTEREST') {
		installments = installmentHelper.finalAmortSchedule(loan.duration, loan.loanDate, loan.interestRate, loan.amount);
	} else if (loan.loanType === 'REGULAR_INTEREST') {
		installments = installmentHelper.noAmortSchedule(loan.duration, loan.loanDate, loan.interestRate, loan.amount);
	}

	let instData = [];
	for (let index in installments) {
		let installment = installments[index];
		instData.push({
			loanId: loan.id,
			payableAmount: installment.payment,
			principalAmount: installment.principal,
			interestAmount: installment.interest,
			dueAmount: installment.balance,
			dueDate: installment.due_date,
			status: installment.tracking,
		})
	}
	let q_installments = await models.Installment.bulkCreate(instData);
	return await models.Installment.findAll({where: {loanId: loan.id}});
};

exports.listLoansGet = [
	async (req, res, next) => {
		models.Loan.findAll({
			include: [
				{model: models.Borrower}
			]
		}).then(q_res => {
			res.status(200).json({loans: q_res});
		}).catch(error => {
			res.status(500).json({message: error.message});
		})
	}
];

exports.detailLoanGet = [
	async (req, res, next) => {
		const loanId = req.params.id;
		models.Loan.findOne({
			where: {id: loanId},
			include: [
				{model: models.Borrower},
				{model: models.Installment},
			]
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

exports.createLoanPost = [

	loanValidators.createLoanReqValidator,

	async (req, res, next) => {
	let loan = null;
		models.Loan.create({
			amount: req.body.amount,
			duration: req.body.duration,
			interestRate: req.body.interestRate,
			borrowerId: req.borrower.id,
			status: req.body.status,
			loanType: req.body.loanType,
			loanDate: req.body.loanDate,
		}).then(q_res => {
			q_res.dataValues.Borrower = req.borrower;
			if(q_res.status === 'APPROVED'){
				addLoanInstallments(q_res).then(installments => {
					q_res.dataValues.Installment = installments;
					res.status(200).json({loan: q_res})
				});
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
		loan.status = req.body.status;
		loan.type = req.body.type;
		loan.loanDate = req.body.loanDate;
		loan.save().then(q_res => {
			q_res.dataValues.Borrower = req.borrower;
			if(q_res.status === 'APPROVED'){
				addLoanInstallments(q_res).then(installments => {
					q_res.dataValues.Installment = installments;
					res.status(200).json({loan: q_res})
				})
			}else{
				res.status(200).json({loan: q_res});
			}
		}).catch(error => {
			console.log(error);
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