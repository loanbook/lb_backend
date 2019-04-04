'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Investors', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },
      userId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      location: {
        type: Sequelize.STRING
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
      operatingIncome: {
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
    return queryInterface.dropTable('Investors');
  }
};