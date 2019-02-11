'use strict';
const crypto = require('crypto');
const authHelper = require('../../controllers/helpers/authHelper');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

    return queryInterface.bulkInsert('Users', [{
      firstName: 'Jone',
      lastName: 'Doe',
      email: 'admin@loanbook.com',
      password: authHelper.getPasswordHash('123456'),
      isActive: true,
      isSuperuser: true,
      isStaff: true,
      createdAt: '2019-01-01 00:00:00',
			updatedAt: '2019-01-01 00:00:00'
    }])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Users', null, {where: {email: 'admin@loanbook.com'}});
  }
};
