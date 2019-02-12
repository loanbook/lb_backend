'use strict';
module.exports = (sequelize, DataTypes) => {
  const LoansInvestor = sequelize.define('LoansInvestor', {
    loanId: DataTypes.INTEGER,
    investorId: DataTypes.INTEGER,
    transactionId: DataTypes.INTEGER,
    percentage: DataTypes.FLOAT,
		amount: DataTypes.FLOAT,
  }, {});
  LoansInvestor.associate = function(models) {
    // associations can be defined here
    LoansInvestor.belongsTo(models.Investor, {foreignKey: 'investorId'});
    LoansInvestor.belongsTo(models.Transaction, {foreignKey: 'transactionId'});
    LoansInvestor.belongsTo(models.Loan, {foreignKey: 'loanId'});
  };
  return LoansInvestor;
};
