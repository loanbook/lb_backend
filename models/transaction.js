'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: DataTypes.INTEGER,
    loanId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    transactionFlow: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    comment: DataTypes.TEXT
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Loan, {foreignKey: 'loanId'});
    Transaction.belongsTo(models.User, {foreignKey: 'userID'});
  };
  return Transaction;
};