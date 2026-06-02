"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      google_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      github_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      role: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.associate = (db) => {
    User.hasMany(db.UserOtp, { foreignKey: "user_id", as: "otps" });
    User.hasMany(db.ApiKey, { foreignKey: "user_id", as: "apiKeys" });
    User.hasOne(db.Wallet, { foreignKey: "user_id", as: "wallet" });
    User.hasMany(db.Transaction, { foreignKey: "user_id", as: "transactions" });
    User.hasMany(db.Payment, { foreignKey: "user_id", as: "payments" });
  };

  return User;
};
