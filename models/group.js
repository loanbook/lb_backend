'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING
  }, {});
  Group.associate = function(models) {
    // associations can be defined here
    Group.belongsToMany(models.User, {through: 'UsersGroup', foreignKey: 'groupId'});
    Group.belongsToMany(models.Permission, {through: 'GroupsPermission', foreignKey: 'groupId'});
  };
  return Group;
};