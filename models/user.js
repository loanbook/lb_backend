'use strict';

const authhelper = require('../helpers/authHelper');
const uuidv1 = require('uuid/v1');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
				isUnique: (value, next) => {
					let self = this;
					User.find({where: {email: value}})
						.then(function (user) {
							if (user && self.id !== user.id) {
								throw new Error('Email already in use');
							}
							return next();
						})
						.catch(function (err) {
							return next(err);
						});
				}
      }
    },
    password: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    isStaff: DataTypes.BOOLEAN,
    isSuperuser: DataTypes.BOOLEAN,
  }, {
		getterMethods: {
		  fullName() {
		    return this.firstName + ' ' + this.lastName;
      }
    },
    setterMethods: {
		  setPassword(value) {
		    if(value)
		      this.setDataValue('password', authhelper.getPasswordHash(value));
        else
					this.setDataValue('password', authhelper.getPasswordHash(uuidv1()))
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.Investor, {foreignKey: 'userId'});
    User.hasOne(models.Borrower, {foreignKey: 'userId'});
    User.hasMany(models.Transaction, {foreignKey: 'userId'});
    User.belongsToMany(models.Group, {through: 'UsersGroup', foreignKey: 'userId',})
  };
  return User;
};