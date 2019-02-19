'use strict';
const crypto = require('crypto');
const authHelper = require('../../controllers/helpers/authHelper');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

    return queryInterface.bulkInsert('Users', [
      // Admin users
      {
        id: 1,
        firstName: 'Jone',
        lastName: 'Doe',
        email: 'admin@loanbook.com',
        password: authHelper.getPasswordHash('123456'),
        isActive: true,
        isSuperuser: true,
        isStaff: true,
        createdAt: '2019-01-01 00:00:00',
        updatedAt: '2019-01-01 00:00:00'
      },
      // Investor Users
      {
				id: 2,
        firstName: 'Alex investor',
        lastName: 'Tester',
				email: 'alex.investor@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
      },
      {
				id: 3,
        firstName: 'Alina investor',
        lastName: 'Tester',
				email: 'alina.investor@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
      },
      {
				id: 4,
        firstName: 'Jmima investor',
        lastName: 'Tester',
				email: 'Jmima.investor@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
      },

      // Borrower Users

			{
				id: 5,
				firstName: 'Rasel MM',
				lastName: 'Tester',
				email: 'raselmm.borrower@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
			},
			{
				id: 6,
				firstName: 'Jbeen TT',
				lastName: 'Tester',
				email: 'Jbeen.borrower@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
			},
			{
				id: 7,
				firstName: 'Dead TT',
				lastName: 'Tester',
				email: 'dead.borrower@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
			},
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Users', null, {where: {id: {
					[Op.in]: [1, 2, 3, 4, 5, 6, 7]
      }
		}});
  }
};
