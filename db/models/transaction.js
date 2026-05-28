"use strict";

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
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
      wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "wallets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      reference_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      tableName: "transactions",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Transaction.associate = (db) => {
    Transaction.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
    Transaction.belongsTo(db.Wallet, { foreignKey: "wallet_id", as: "wallet" });
  };

  return Transaction;
};
