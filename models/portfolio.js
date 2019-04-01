'use strict';

const contants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const InvestorPortfolio = sequelize.define('InvestorPortfolio', {
    totalInvested: DataTypes.FLOAT,
    totalWithdraw: DataTypes.FLOAT,
    ownershipPercentage: DataTypes.FLOAT,
    currentWeitage: DataTypes.FLOAT,
    operatingIncome: DataTypes.FLOAT,
    cashAvailableToWithdrawal: DataTypes.FLOAT,
    updateReason: {
      type: DataTypes.STRING,
      isIn: contants.PORTFOLIO_UPDATE_REASON
    },
  }, {});
  InvestorPortfolio.associate = function (models) {
    // associations can be defined here
    InvestorPortfolio.belongsTo(models.Investor, { foreignKey: 'userId' });
  };
  return InvestorPortfolio;
};