'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LoanBooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cashPool: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      loanApprovedAmount: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      interestIncome: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      fees: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      cashDeposit: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      cashWithdrawal: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
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
    return queryInterface.dropTable('LoanBooks');
  }
};