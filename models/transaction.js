'use strict';

const contants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: DataTypes.INTEGER,
    loanId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    transactionFlow: {
      type: DataTypes.STRING,
      validate: {
        isIn: contants.TRANSACTION_FLOW_TYPES
      }
    },
    amount:{
      type: DataTypes.FLOAT,
      isFloat: {msg: 'Must be a float value.'}
    },
    comment: DataTypes.TEXT
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Loan, {foreignKey: 'loanId'});
    Transaction.belongsTo(models.User, {foreignKey: 'userID'});
  };
  return Transaction;
};