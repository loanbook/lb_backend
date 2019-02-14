'use strict';
module.exports = (sequelize, DataTypes) => {
  const Borrower = sequelize.define('Borrower', {
    userId: DataTypes.INTEGER,
    businessName: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Borrower.associate = function(models) {
    // associations can be defined here
    Borrower.belongsTo(models.User, {foreignKey: 'userId'});
    Borrower.hasMany(models.Loan, {foreignKey: 'borrowerId'});
  };
  return Borrower;
};