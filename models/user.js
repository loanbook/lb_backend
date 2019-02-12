'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    isStaff: DataTypes.BOOLEAN,
    isSuperuser: DataTypes.BOOLEAN,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.Investor, {foreignKey: 'userId'});
    User.hasOne(models.Borrower, {foreignKey: 'userId'});
    User.hasMany(models.Transaction, {foreignKey: 'userId'});
    User.belongsToMany(models.Group, {through: 'UsersGroup', foreignKey: 'userId',})
  };
  return User;
};