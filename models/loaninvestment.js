'use strict';
module.exports = (sequelize, DataTypes) => {
  const LoanInvestment = sequelize.define('LoanInvestment', {
    investorId: DataTypes.INTEGER,
    loanId: DataTypes.INTEGER,
    investedAmount: DataTypes.FLOAT,
    percentage: DataTypes.FLOAT
  }, {});
  LoanInvestment.associate = function(models) {
    // associations can be defined here
    LoanInvestment.belongsTo(models.Investor, {foreignKey: 'investorId'});
    LoanInvestment.belongsTo(models.Loan, {foreignKey: 'loanId'})
  };
  return LoanInvestment;
};