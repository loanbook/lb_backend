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
				allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
				allowNull: true
      },
      interestRate: {
        type: Sequelize.INTEGER,
				allowNull: true
      },
			amount: {
				type: Sequelize.FLOAT,
				allowNull: true
			},
			loanDate: {
      	type: Sequelize.DATEONLY,
				allowNull: true
			},
			companyPercentage: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			status: {
				type: Sequelize.STRING,
				allowNull: true,
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