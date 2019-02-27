'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    borrowerId: DataTypes.INTEGER,
    loanType: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    interestRate: DataTypes.FLOAT,
    amount: DataTypes.FLOAT,
		loanDate: DataTypes.DATEONLY,
		companyPercentage: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  Loan.associate = function(models) {
		// associations can be defined here
		Loan.hasMany(models.Transaction, {foreignKey: 'loanId'});
		Loan.hasMany(models.Installment, {foreignKey: 'loanId'});
		Loan.belongsTo(models.Borrower, {foreignKey: 'borrowerId'});
  };
  return Loan;
};

