'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LoanInvestments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      investorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Investors',
          key: 'id'
        },
				onDelete: 'CASCADE'
      },
      loanId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Loans',
          key: 'id'
        },
				onDelete: 'CASCADE'
      },
      investedAmount: {
        type: Sequelize.FLOAT
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
    return queryInterface.dropTable('LoanInvestments');
  }
};