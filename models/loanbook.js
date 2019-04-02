'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stats = sequelize.define('LoanBook', {
    cashPool: DataTypes.FLOAT,
    loanApprovedAmount: DataTypes.FLOAT,
    interestIncome: DataTypes.FLOAT,
    fees: DataTypes.FLOAT,
    cashDeposit: DataTypes.FLOAT,
    cashWithdrawal: DataTypes.FLOAT,
  }, {});
  Stats.associate = function(models) {
    // associations can be defined here
  };
  return Stats;
};