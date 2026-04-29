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
		static async getCurrentBuyerProfile(req) {
			const userId = req.session.user.id;
			const { User } = sequelize.models;
			const userProfile = await UserProfile.findOne({
				where: {
					userId,
				},
				include: {
					model: User,
					attributes: ["id", "username", "email", "role"],
				},
			});

			return userProfile;
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
