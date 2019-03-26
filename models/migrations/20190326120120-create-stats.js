'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stats', {
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
      totalBorrowers: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalInvestors: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalLoanAmount: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      totalInvestedAmount: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      assetsUnderManagement: {
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
      operatingIncome: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      cashDeposit: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      cashWithdrawals: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      cashAvailableToWithdrawal: {
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
    return queryInterface.dropTable('Stats');
  }
};