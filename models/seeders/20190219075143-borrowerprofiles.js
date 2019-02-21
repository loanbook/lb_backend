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

		let users = await models.User.findAll({where: {email: {[Op.in]: borrowersEmail}}});
		let borrowers_r = [];

		for (let index in users) {
			let user = users[index];
			borrowers_r.push({
				userId: user.id,
				businessName: "businessName " + index,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
			})
		}

		return queryInterface.bulkInsert('Borrowers', borrowers_r, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Borrowers', null, {where: {
				email: {[Op.in]: borrowersEmail}
			}
		});
  }
};
