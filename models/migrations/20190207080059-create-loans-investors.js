'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LoansInvestors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loanId: {
        type: Sequelize.INTEGER,
				references:{
					model: 'Loans',
					key: 'id'
				}
      },
      investorId: {
        type: Sequelize.INTEGER,
				references:{
					model: 'Investors',
					key: 'id'
				}
      },
      transactionId: {
        type: Sequelize.INTEGER,
				references:{
					model: 'Transactions',
					key: 'id'
				}
      },
      percentage: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LoansInvestors');
  }
};