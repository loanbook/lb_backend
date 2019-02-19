'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

		return queryInterface.bulkInsert('Loans', [
		  {
        id: 1,
        borrowerId: 1,
        duration: 12,
        interestRate: 10,
        amount: 2000,
        status: 'IN_REVIEW',
				loanType: 'FIXED_INTEREST',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00',
      },
		  {
        id: 2,
        borrowerId: 2,
				amount: 5000,
        duration: 24,
        interestRate: 10,
        status: 'IN_REVIEW',
				loanType: 'REGULAR_INTEREST',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00',
      },
		  {
        id: 3,
        borrowerId: 3,
				amount: 7000,
        duration: 48,
        interestRate: 10,
        status: 'IN_REVIEW',
				loanType: 'FULL_FINAL_PAYMENT',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00',
      },
		], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Loans', null, {where: {
				[Op.in]: [1, 2, 3]
			}
		});
  }
};
