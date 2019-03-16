'use strict';
module.exports = (sequelize, DataTypes) => {
  const Investor = sequelize.define('Investor', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    location: DataTypes.STRING
  }, {
      getterMethods: {}
    });
  Investor.associate = function (models) {
    // associations can be defined here
    Investor.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Investor;
};