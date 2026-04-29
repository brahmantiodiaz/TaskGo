"use strict";

const { Model } = require("sequelize");
const { UserRole } = require("../helpers/enums");
const {
	optionalString,
	requiredString,
	enumString,
} = require("../helpers/validators");
const encryptPassword = require("../helpers/authHooks");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			User.hasOne(models.UserProfile, { foreignKey: "userId" });
			User.hasMany(models.Item, { foreignKey: "createdById" });
			User.hasMany(models.Booking, { foreignKey: "buyerId" });
		}
	}

	User.init(
		{
			username: optionalString(DataTypes),

			email: {
				...requiredString(DataTypes, "Email"),
				unique: {
					msg: "Email already exists",
				},
				validate: {
					...requiredString(DataTypes, "Email").validate,
					isEmail: {
						msg: "Email format is invalid",
					},
				},
			},

			password: {
				...requiredString(DataTypes, "Password"),
				validate: {
					...requiredString(DataTypes, "Password").validate,
					len: {
						args: [8],
						msg: "Password minimum 8 characters",
					},
				},
			},

			role: enumString(DataTypes, "Role", UserRole, UserRole.BUYER),
		},
		{
			sequelize,
			modelName: "User",
			hooks: {
				beforeCreate: encryptPassword,
				beforeUpdate: encryptPassword,
			},
		},
	);

	return User;
};
