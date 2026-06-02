"use strict";

module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define(
    "Wallet",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      balance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'DZD',
      },
      is_free: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      free_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      low_balance_alert: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "wallets",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Wallet.associate = (db) => {
    Wallet.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
    Wallet.hasMany(db.Transaction, { foreignKey: "wallet_id", as: "transactions" });
  };

  return Wallet;
};
