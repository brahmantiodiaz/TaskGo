"use strict";

const { Model } = require("sequelize");
const {
	requiredString,
	requiredText,
	optionalInteger,
} = require("../helpers/validators");

module.exports = (sequelize, DataTypes) => {
	class SellerProfile extends Model {
		static associate(models) {
			SellerProfile.belongsTo(models.UserProfile, {
				foreignKey: "userProfileId",
			});
			SellerProfile.hasMany(models.SellerItem, {
				foreignKey: "sellerProfileId",
			});
			SellerProfile.hasMany(models.Invoice, {
				foreignKey: "issuedBySellerProfileId",
			});
			SellerProfile.hasMany(models.Payment, {
				foreignKey: "confirmedBySellerProfileId",
			});
		}
		static async geTest() {
			return await SellerProfile.findAll();
		}

		static async getCurrentSellerProfile(req) {
			const { UserProfile, User } = sequelize.models;
			const userId = req.session.user.id;

			const sellerProfile = await SellerProfile.findOne({
				include: {
					model: UserProfile,
					where: {
						userId,
					},
					include: {
						model: User,
						attributes: ["id", "username", "email", "role"],
					},
				},
			});

			return sellerProfile;
		}
	}

	SellerProfile.init(
		{
			userProfileId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: {
					msg: "User profile already registered as seller",
				},
				validate: {
					notNull: {
						msg: "User profile is required",
					},
					isInt: {
						msg: "User profile must be valid",
					},
				},
			},

			headline: requiredString(DataTypes, "Headline"),

			description: requiredText(DataTypes, "Description"),

			experienceYear: optionalInteger(DataTypes, "Experience year", 0),

			bankName: requiredString(DataTypes, "Bank name"),

			bankAccountNumber: requiredString(DataTypes, "Bank account number"),
		},
		{
			sequelize,
			modelName: "SellerProfile",
		},
	);

	return SellerProfile;
};
