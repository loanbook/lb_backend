'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const models = require('../index');
const aggrigationsHelper = require('../../helpers/aggregationsHelper');

module.exports = {
	up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

		let investedAmount = await aggrigationsHelper.totalInvestmentsTillNow();
		let loanbook = [{
			cashPool: investedAmount,
			cashDeposit: investedAmount,
			createdAt: moment().format('YYYY-MM-DD h:mm:ss'),
			updatedAt: moment().format('YYYY-MM-DD h:mm:ss'),
		}];

		return queryInterface.bulkInsert('LoanBooks', loanbook, {});
	},

	down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('LoanBooks', null, {});
	}
};
