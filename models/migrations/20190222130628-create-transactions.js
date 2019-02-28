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
			userId: {
				type: Sequelize.INTEGER,
				references:{
					model: 'Users',
					key: 'id',
				},
				onDelete: 'CASCADE'
			},
      loanId: {
        type: Sequelize.INTEGER,
				references:{
					model: 'Loans',
					key: 'id',
				},
				onDelete: 'CASCADE'
      },
			installmentId: {
      	type: Sequelize.INTEGER,
				references:{
					model: 'Installments',
					key: 'id',
				},
				onDelete: 'CASCADE'
			},
      type: {
        type: Sequelize.STRING,
        maxLength: 100,
				allowNull: false
      },
			transactionFlow: {
      	type: Sequelize.STRING,
				maxLength: 100,
				allowNull: false
			},
      amount: {
        type: Sequelize.FLOAT,
				allowNull: false,
      },
			principalAmount: {
      	type: Sequelize.FLOAT,
				allowNull: false,
			},
			interestAmount: {
      	type: Sequelize.FLOAT,
				allowNull: true
			},
			comment: {
        type: Sequelize.TEXT,
        allowNull: true,
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