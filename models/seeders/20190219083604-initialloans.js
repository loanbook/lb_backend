'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require('../index');

const borrowersEmail = ['raselmm.borrower@loanbook.com', 'Jbeen.borrower@loanbook.com', 'dead.borrower@loanbook.com'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

		let borrowers = await models.Borrower.findAll({include: [
				{model: models.User, where: {email: {[Op.in]: borrowersEmail}}}
			]});
		let loans = [];

		for (let index in borrowers) {
			let borrower = borrowers[index];
			loans.push({
				borrowerId: borrower.id,
				duration: 12 * (index + 1),
				interestRate: 10,
				amount: 2000 * (index + 1),
				status: 'IN_REVIEW',
				loanType: 'FIXED_INTEREST',
				loanDate: '2019-05-01 00:00:00',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00',
			})
		}

		return queryInterface.bulkInsert('Loans', loans, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Loans', null, {include:[
				{model: models.Borrower, include: [
						{model: models.User, where: {email: {[Op.in]: borrowersEmail}}}
					]}
			]}
		);
  }
};
