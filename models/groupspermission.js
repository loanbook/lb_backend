'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupsPermission = sequelize.define('GroupsPermission', {
    groupId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER
  }, {});
  GroupsPermission.associate = function(models) {
    // associations can be defined here
  };
  return GroupsPermission;
};