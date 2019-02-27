'use strict';

const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require('../index');

const investorsEmails = ['alex.investor@loanbook.com', 'alina.investor@loanbook.com', 'Jmima.investor@loanbook.com'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
		let users = await models.User.findAll({where: {email: {[Op.in]: investorsEmails}}});
		let transactions = [];

		for (let index in users) {
			let user = users[index];
			transactions.push({
				type: 'INVESTMENT_DEPOSIT',
				amount: 2000 * (index + 1),
				principalAmount: 2000 * (index + 1),
				interestAmount: 0,
				transactionFlow: 'CREDITED',
				userId: user.id,
				comment: 'Initial Test amount',
				createdAt: moment().format('YYYY-MM-DD h:mm:ss'),
				updatedAt: moment().format('YYYY-MM-DD h:mm:ss'),
			})
		}

		return queryInterface.bulkInsert('Transactions', transactions, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Transactions', null, {include: [
				{model: models.User, where:{email: {[Op.in]: investorsEmails}}}
			]
		});
  }
};
