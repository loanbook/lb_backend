const Sequelize = require('sequelize');
const moment = require('moment');
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
				createdAt: moment().format('YYYY-MM-DD h:mm:ss'),
				updatedAt: moment().format('YYYY-MM-DD h:mm:ss'),
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
