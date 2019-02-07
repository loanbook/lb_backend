'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
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
				},
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        maxLength: 100,
				allowNull: false
      },
      amount: {
        type: Sequelize.FLOAT,
				allowNull: false
      },
      currentBalance: {
        type: Sequelize.FLOAT,
				allowNull: false
      },
      closingBalance: {
        type: Sequelize.FLOAT,
				allowNull: false
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
    return queryInterface.dropTable('Transactions');
  }
};