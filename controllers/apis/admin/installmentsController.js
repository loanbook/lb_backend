const models = require('../../../models');


exports.installmentsListGet = (req, res, next) => {
	models.Installment.findAll({
		order: ['dueDate'],
	}).then(installments => {
		res.status(200).json({installments: installments});
	}).catch(error => {
		res.status(500).json({message: error.message});
	})
};


exports.installmentDetailGet = (req, res, next) => {
	const installmentId = req.params.id;
	models.Installment.findByPk(installmentId, {
		include: [
			{model: models.Loan, include:[
					{model: models.Borrower}
				]}
		]
	}).then(installment => {
		if(installment)
			res.status(200).json({installment: installment});
		else
			res.status(400).json({message: 'Not installment found with provided id.'})
	}).catch(error => {
		res.status(500).json({message: error.message});
	})
};
