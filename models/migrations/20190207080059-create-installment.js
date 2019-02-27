'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Installments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loanId: {
        type: Sequelize.INTEGER
      },
      payableAmount: {
        type: Sequelize.FLOAT
      },
      principalAmount: {
        type: Sequelize.FLOAT
      },
      interestAmount: {
        type: Sequelize.FLOAT
      },
      dueAmount: {
        type: Sequelize.FLOAT
      },
      dueDate: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.STRING,
        maxLength: 100
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
    return queryInterface.dropTable('Installments');
  }
};