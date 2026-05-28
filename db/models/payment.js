"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
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
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      order_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      raw_response: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "payments",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Payment.associate = (db) => {
    Payment.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
  };

  return Payment;
};
