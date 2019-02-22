'use strict';
module.exports = (sequelize, DataTypes) => {
  const Installment = sequelize.define('Installment', {
    loanId: DataTypes.INTEGER,
    payableAmount: DataTypes.FLOAT,
    principalAmount: DataTypes.FLOAT,
    interestAmount: DataTypes.FLOAT,
    dueAmount: DataTypes.FLOAT,
    dueDate: DataTypes.DATE,
    status: DataTypes.STRING
  }, {});
  Installment.associate = function(models) {
    // associations can be defined here
    Installment.belongsTo(models.Loan, {foreignKey:'loanId'})
  };
  return Installment;
};