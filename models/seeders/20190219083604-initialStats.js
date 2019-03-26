'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const models = require('../index');

module.exports = {
	up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

		return queryInterface.bulkInsert('Stats', [{
			cashPool: 0.0,
			totalBorrowers: 0,
			totalInvestors: 0,
			totalLoanAmount: 0.0,
			totalInvestedAmount: 0.0,
			assetsUnderManagement: 0.0,
			interestIncome: 0.0,
			fees: 0.0,
			operatingIncome: 0.0,
			cashDeposit: 0.0,
			cashWithdrawals: 0.0,
			cashAvailableToWithdrawal: 0.0,
			createdAt: moment().format('YYYY-MM-DD h:mm:ss'),
			updatedAt: moment().format('YYYY-MM-DD h:mm:ss'),
		}], {});
	},

	down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Stats', null, {});
	}
};
