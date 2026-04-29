"use strict";

const { Model } = require("sequelize");
const { SellerItemStatus } = require("../helpers/enums");
const {
	requiredString,
	requiredText,
	requiredInteger,
	enumString,
} = require("../helpers/validators");

module.exports = (sequelize, DataTypes) => {
	class SellerItem extends Model {
		static associate(models) {
			SellerItem.belongsTo(models.SellerProfile, {
				foreignKey: "sellerProfileId",
			});
			SellerItem.belongsTo(models.Item, { foreignKey: "itemId" });
			SellerItem.hasMany(models.Booking, { foreignKey: "sellerItemId" });
		}
	}

	SellerItem.init(
		{
			sellerProfileId: requiredInteger(DataTypes, "Seller profile"),

			itemId: requiredInteger(DataTypes, "Item"),

			serviceTitle: requiredString(DataTypes, "Service title"),

			serviceDescription: requiredText(DataTypes, "Service description"),

			price: requiredInteger(DataTypes, "Price", 10000),

			duration: requiredInteger(DataTypes, "Duration", 30),

			location: requiredString(DataTypes, "Location"),

			status: enumString(
				DataTypes,
				"Seller item status",
				SellerItemStatus,
				SellerItemStatus.AVAILABLE,
			),
		},
		{
			sequelize,
			modelName: "SellerItem",
		},
	);

	return SellerItem;
};
