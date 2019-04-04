'use strict';
module.exports = (sequelize, DataTypes) => {
  const Investor = sequelize.define('Investor', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    location: DataTypes.STRING,
    totalInvested: DataTypes.FLOAT,
    totalWithdraw: DataTypes.FLOAT,
    ownershipPercentage: DataTypes.FLOAT,
    operatingIncome: DataTypes.FLOAT,
  }, {
      getterMethods: {}
    });
  Investor.associate = function (models) {
    // associations can be defined here
    Investor.belongsTo(models.User, { foreignKey: 'userId' });
    Investor.hasMany(models.InvestorPortfolio, {foreignKey: 'userId'});
  };
  return Investor;
};