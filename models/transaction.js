'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    loanId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    currentBalance: DataTypes.FLOAT,
    closingBalance: DataTypes.FLOAT
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Loan, {foreignKey: 'loanId'})
  };
  return Transaction;
};