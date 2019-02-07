'use strict';
module.exports = (sequelize, DataTypes) => {
  const UsersGroup = sequelize.define('UsersGroup', {
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {});
  UsersGroup.associate = function(models) {
    // associations can be defined here
  };
  return UsersGroup;
};