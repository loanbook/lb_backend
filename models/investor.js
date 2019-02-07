'use strict';
module.exports = (sequelize, DataTypes) => {
  const Investor = sequelize.define('Investor', {
    userId: DataTypes.INTEGER,
    availableBalance: DataTypes.FLOAT,
    location: DataTypes.STRING
  }, {});
  Investor.associate = function(models) {
    // associations can be defined here
    Investor.belongsTo(models.User, {foreignKey: 'userId'})
  };
  return Investor;
};