'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    borrowerId: DataTypes.INTEGER,
    loanType: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    interestRate: DataTypes.FLOAT,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING
  }, {});
  Loan.associate = function(models) {
		// associations can be defined here
		Loan.hasMany(models.Transaction, {foreignKey: 'loanId'});
		Loan.hasMany(models.LoanInvestment, {foreignKey: 'loanId'});

		Loan.belongsTo(models.Borrower, {foreignKey: 'borrowerId'});
  };
  return Loan;
};

