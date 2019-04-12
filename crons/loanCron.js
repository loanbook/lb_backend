const models = require('../models');
const aggrigationsHelper = require('../helpers/aggregationsHelper');
const moment = require('moment');
const Op = models.Sequelize.Op;

exports.changeLoanStatus = async function () {
	const currentDate = moment();
	models.Loan.update({ status: 'OPEN' }, {
		where: {
			status: 'APPROVED', loanDate: {
				[Op.lte]: currentDate,
			}
		}
	}).then(q_res => {
		// res.status(200).json({ data: q_res });
		// log for successfull execution
		console.log('changeLoanStatus: cron updated records: ', q_res, moment().format('YYYY-MM-DD HH:MM:ss'));
	}).catch(error => {
		// res.status(500).json({ message: error.message });
		// log for error execution
		console.log(error.message);
	})
}
