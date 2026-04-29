"use strict";

const { Model } = require("sequelize");
const {
  requiredString,
  optionalText,
  optionalUrl,
} = require("../helpers/validators");

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, { foreignKey: "userId" });
      UserProfile.hasOne(models.SellerProfile, { foreignKey: "userProfileId" });
    }
  }

  UserProfile.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          msg: "User already has a profile",
        },
        validate: {
          notNull: {
            msg: "User is required",
          },
          isInt: {
            msg: "User must be valid",
          },
        },
      },

      fullName: requiredString(DataTypes, "Full name"),

      phoneNumber: requiredString(DataTypes, "Phone number"),

      address: optionalText(DataTypes),

      avatarUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserProfile",
    },
  );

  return UserProfile;
};
