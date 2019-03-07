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
				references: {
					model: 'Users',
					key: 'id',
				},
				onDelete: 'CASCADE'
			},
			loanId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Loans',
					key: 'id',
				},
				onDelete: 'CASCADE'
			},
			installmentId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Installments',
					key: 'id',
				},
				onDelete: 'CASCADE'
			},
			amount: {
				type: Sequelize.FLOAT,
				allowNull: false,
				defaultValue: 0
			},
			principalAmount: {
				type: Sequelize.FLOAT,
				allowNull: false,
				defaultValue: 0
			},
			interestAmount: {
				type: Sequelize.FLOAT,
				allowNull: true,
				defaultValue: 0
			},
			loanInterestAmount: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			installmentLateFee: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			companyInterestAmount: {
				type: Sequelize.FLOAT,
				defaultValue: 0
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