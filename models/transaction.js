'use strict';

const contants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: DataTypes.INTEGER,
    installmentId: {
      type: DataTypes.INTEGER,
    },
    loanId: DataTypes.INTEGER,

    amount:{
      type: DataTypes.FLOAT,
    },
		principalAmount: {
      type: DataTypes.FLOAT,
    },
    interestAmount: {
      type: DataTypes.FLOAT,
    },
    loanInterestAmount: {
      type: DataTypes.FLOAT,
    },
    installmentLateFee: {
      type: DataTypes.FLOAT,
    },
    companyInterestAmount: {
      type: DataTypes.FLOAT,
    },
    type: DataTypes.STRING,
    transactionFlow: {
      type: DataTypes.STRING,
      isIn: contants.TRANSACTION_FLOW_TYPES
    },
    comment: DataTypes.TEXT
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Loan, {foreignKey: 'loanId'});
    Transaction.belongsTo(models.User, {foreignKey: 'userId'});
    Transaction.belongsTo(models.Installment, {foreignKey: 'installmentId'})
  };
  return Transaction;
};