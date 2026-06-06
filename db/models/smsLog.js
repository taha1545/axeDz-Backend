"use strict";

module.exports = (sequelize, DataTypes) => {
  const SmsLog = sequelize.define(
    "SmsLog",
    {
      api_key_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "api_keys",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      to_number: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      callback_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      callback_data: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      status_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("queued", "sent", "failed"),
        defaultValue: "queued",
      },
      retry_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "sms_logs",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  SmsLog.associate = (db) => {
    SmsLog.belongsTo(db.ApiKey, { foreignKey: "api_key_id", as: "apiKey" });
  };

  return SmsLog;
};
