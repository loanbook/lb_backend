'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkInsert('Transactions', [
		  {
			  id: 1,
        userId: 2,
        type: 'INITIAL_DEPOSIT',
        amount: 20000,
        currentBalance: 0,
        closingBalance: 20000,
        transactionFlow: 'CREDITED',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
		  },
		  {
			  id: 2,
        userId: 3,
        type: 'INITIAL_DEPOSIT',
				transactionFlow: 'CREDITED',
				amount: 30000,
        currentBalance: 0,
        closingBalance: 30000,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
		  },
		  {
			  id: 3,
        userId: 4,
        type: 'INITIAL_DEPOSIT',
				transactionFlow: 'CREDITED',
				amount: 50000,
        currentBalance: 0,
        closingBalance: 50000,
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
		  }
		], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Transactions', null, {where: {id: {
		    [Op.in]: [1, 2, 3]
		  }
		}});
  }
};
