'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
			borrowerId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Borrowers',
					key: 'id'
				},
				onDelete: 'CASCADE'
			},
      loanType: {
        type: Sequelize.STRING,
				allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
				allowNull: false
      },
      interestRate: {
        type: Sequelize.INTEGER,
				allowNull: false
      },
			amount: {
				type: Sequelize.FLOAT,
				allowNull: false
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
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
    return queryInterface.dropTable('Loans');
  }
};