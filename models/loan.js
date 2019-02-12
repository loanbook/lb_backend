'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    amount: DataTypes.FLOAT,
    duration: DataTypes.INTEGER,
    interestRate: DataTypes.INTEGER
  }, {});
  Loan.associate = function(models) {
    // associations can be defined here
    Loan.hasMany(models.Transaction, {foreignKey: 'loanId'});
    Loan.hasMany(models.LoansInvestor, {foreignKey: 'loanId'})
  };
  return Loan;
};