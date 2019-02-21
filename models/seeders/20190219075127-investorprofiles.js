const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require('../index');

'use strict';

const investorsEmails = ['alex.investor@loanbook.com', 'alina.investor@loanbook.com', 'Jmima.investor@loanbook.com'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

    let users = await models.User.findAll({where: {email: {[Op.in]: investorsEmails}}});
    let user_r = [];

    for (let index in users) {
    	let user = users[index];
			user_r.push({
				userId: user.id,
				location: 'Paris, France',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
			})
		}

		return queryInterface.bulkInsert('Investors', user_r, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Investors', null, {where: {
				email: {[Op.in]: investorsEmails}
      }
		});
  }
};
