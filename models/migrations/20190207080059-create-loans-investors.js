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
					key: 'id',
				},
				onDelete: 'CASCADE'
      },
      investorId: {
        type: Sequelize.INTEGER,
				references:{
					model: 'Investors',
					key: 'id',
				},
				onDelete: 'CASCADE'
      },
      transactionId: {
        type: Sequelize.INTEGER,
				references:{
					model: 'Transactions',
					key: 'id',
				},
				onDelete: 'CASCADE'
      },
      percentage: {
        type: Sequelize.FLOAT
      },
			amount: {
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