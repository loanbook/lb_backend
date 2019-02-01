'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
				maxLength: 200
      },
      lastName: {
        type: Sequelize.STRING,
				maxLength: 200
      },
      email: {
        type: Sequelize.STRING,
        maxLength: 200
      },
      password: {
        type: Sequelize.STRING,
				maxLength: 255
      },
      role: {
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
    return queryInterface.dropTable('Users');
  }
};