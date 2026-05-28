"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserOtp = sequelize.define(
    "UserOtp",
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
      otp_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("email", "verifySms", "resetPassword"),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "user_otps",
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  UserOtp.associate = (db) => {
    UserOtp.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
  };

  return UserOtp;
};
