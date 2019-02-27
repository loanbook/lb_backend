'use strict';
const crypto = require('crypto');
const authHelper = require('../../helpers/authHelper');
const Sequelize = require('sequelize');
const moment = require('moment');
const Op = Sequelize.Op;


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

		let createdAt = moment().format('YYYY-MM-DD h:mm:ss');
		let updatedAt = moment().format('YYYY-MM-DD h:mm:ss');

    return queryInterface.bulkInsert('Users', [
      // Admin users
      {
        firstName: 'Jone',
        lastName: 'Doe',
        email: 'admin@loanbook.com',
        password: authHelper.getPasswordHash('123456'),
        isActive: true,
        isSuperuser: true,
        isStaff: true,
				createdAt: createdAt,
				updatedAt: updatedAt,
      },
      // Investor Users
      {
        firstName: 'Alex investor',
        lastName: 'Tester',
				email: 'alex.investor@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: createdAt,
				updatedAt: updatedAt
      },
      {
        firstName: 'Alina investor',
        lastName: 'Tester',
				email: 'alina.investor@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: createdAt,
				updatedAt: updatedAt
      },
      {
        firstName: 'Jmima investor',
        lastName: 'Tester',
				email: 'Jmima.investor@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: createdAt,
				updatedAt: updatedAt
      },

      // Borrower Users

			{
				firstName: 'Rasel MM',
				lastName: 'Tester',
				email: 'raselmm.borrower@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: createdAt,
				updatedAt: updatedAt
			},
			{
				firstName: 'Jbeen TT',
				lastName: 'Tester',
				email: 'Jbeen.borrower@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: createdAt,
				updatedAt: updatedAt
			},
			{
				firstName: 'Dead TT',
				lastName: 'Tester',
				email: 'dead.borrower@loanbook.com',
				password: authHelper.getPasswordHash('123456'),
				isActive: true,
				createdAt: createdAt,
				updatedAt: updatedAt
			},
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Users', null, {where: {email: {
					[Op.in]: [
						'admin@loanbook.com',
						'alex.investor@loanbook.com', 'alina.investor@loanbook.com', 'Jmima.investor@loanbook.com',
						'raselmm.borrower@loanbook.com', 'Jbeen.borrower@loanbook.com', 'dead.borrower@loanbook.com'
					]
      }
		}});
  }
};
