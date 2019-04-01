'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('InvestorPortfolio', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      totalInvested: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      totalWithdraw: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      ownershipPercentage: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      currentWeitage: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      operatingIncome: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      cashAvailableToWithdrawal: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      updateReason: {
        type: Sequelize.STRING,
        maxLength: 100,
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
    return queryInterface.dropTable('InvestorPortfolio');
  }
};