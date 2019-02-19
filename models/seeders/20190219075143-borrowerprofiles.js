'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
		return queryInterface.bulkInsert('Borrowers', [
		  {
		    id: 1,
        userId: 5,
        businessName: "businessName 1",
        description: 'Description 1',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
		  },
		  {
		    id: 2,
        userId: 6,
        businessName: "businessName 2",
        description: 'Description 13',
				createdAt: '2019-01-01 00:00:00',
				updatedAt: '2019-01-01 00:00:00'
		  },
		  {
		    id: 3,
        userId: 7,
        businessName: "businessName 3",
        description: 'Description 3',
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
		return queryInterface.bulkDelete('Borrowers', null, {where: {
				[Op.in]: [1, 2, 3]
			}
		});
  }
};
