'use strict';
module.exports = (sequelize, DataTypes) => {
  const LoansInvestors = sequelize.define('LoansInvestors', {
    loanId: DataTypes.INTEGER,
    investorId: DataTypes.INTEGER,
    transactionId: DataTypes.INTEGER,
    percentage: DataTypes.FLOAT
  }, {});
  LoansInvestors.associate = function(models) {
    // associations can be defined here
  };
  return LoansInvestors;
};