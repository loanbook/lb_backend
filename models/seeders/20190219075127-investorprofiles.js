const Sequelize = require('sequelize');
const Op = Sequelize.Op;

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkInsert('Investors', [
		  {
		    id: 1,
        userId: 2,
        location: 'Paris, France',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
      },
		  {
				id: 2,
        userId: 3,
        location: 'Paris, France',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
      },
		  {
				id: 3,
        userId: 4,
        location: 'Paris, France',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
      }
		], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkDelete('Investors', null, {where: {
				[Op.in]: [1, 2, 3]
      }
		});
  }
};
