'use strict';

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
				transactionFlow: 'CREDITED',
				userId: user.id,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
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
