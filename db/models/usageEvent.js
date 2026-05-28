"use strict";

module.exports = (sequelize, DataTypes) => {
  const UsageEvent = sequelize.define(
    "UsageEvent",
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
      service_type: {
        type: DataTypes.ENUM("sms", "email"),
        allowNull: false,
      },
      unit_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      reference_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "usage_events",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  UsageEvent.associate = (db) => {
    UsageEvent.belongsTo(db.ApiKey, { foreignKey: "api_key_id", as: "apiKey" });
  };

  return UsageEvent;
};
