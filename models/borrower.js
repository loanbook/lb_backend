'use strict';
module.exports = (sequelize, DataTypes) => {
  const Borrower = sequelize.define('Borrower', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    businessName: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Borrower.associate = function (models) {
    // associations can be defined here
    Borrower.belongsTo(models.User, { foreignKey: 'userId' });
    Borrower.hasMany(models.Loan, { foreignKey: 'borrowerId' });
  };
  return Borrower;
};