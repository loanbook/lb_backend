'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    permission: DataTypes.STRING,
    module: DataTypes.STRING
  }, {});
  Permission.associate = function(models) {
    // associations can be defined here
    Permission.belongsToMany(models.Group, {through: 'GroupsPermission', foreignKey: 'permissionId'})
  };
  return Permission;
};