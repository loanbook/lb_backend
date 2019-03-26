'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stats = sequelize.define('Stats', {
    cashPool: DataTypes.FLOAT,
    totalBorrowers: DataTypes.INTEGER,
    totalInvestors: DataTypes.INTEGER,
    totalLoanAmount: DataTypes.FLOAT,
    totalInvestedAmount: DataTypes.FLOAT,
    assetsUnderManagement: DataTypes.FLOAT,
    interestIncome: DataTypes.FLOAT,
    fees: DataTypes.FLOAT,
    operatingIncome: DataTypes.FLOAT,
    cashDeposit: DataTypes.FLOAT,
    cashWithdrawals: DataTypes.FLOAT,
    cashAvailableToWithdrawal: DataTypes.FLOAT
  }, {});
  Stats.associate = function(models) {
    // associations can be defined here
  };
  return Stats;
};