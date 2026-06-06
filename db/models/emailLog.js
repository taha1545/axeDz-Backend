"use strict";

module.exports = (sequelize, DataTypes) => {
  const EmailLog = sequelize.define(
    "EmailLog",
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
      to_email: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      body_type: {
        type: DataTypes.ENUM("text", "html"),
        allowNull: false,
        defaultValue: "text",
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
      tableName: "email_logs",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  EmailLog.associate = (db) => {
    EmailLog.belongsTo(db.ApiKey, { foreignKey: "api_key_id", as: "apiKey" });
  };

  return EmailLog;
};
