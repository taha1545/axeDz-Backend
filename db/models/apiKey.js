"use strict";

module.exports = (sequelize, DataTypes) => {
  const ApiKey = sequelize.define(
    "ApiKey",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      project_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'suspended', 'blocked'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: "api_keys",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  ApiKey.associate = (db) => {
    ApiKey.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
    ApiKey.hasMany(db.UsageEvent, { foreignKey: "api_key_id", as: "usageEvents" });
    ApiKey.hasMany(db.SmsLog, { foreignKey: "api_key_id", as: "smsLogs" });
    ApiKey.hasMany(db.EmailLog, { foreignKey: "api_key_id", as: "emailLogs" });
  };

  return ApiKey;
};