"use strict";

const { Model } = require("sequelize");
const { ItemStatus } = require("../helpers/enums");
const {
	requiredString,
	requiredText,
	requiredUrl,
	enumString,
} = require("../helpers/validators");

module.exports = (sequelize, DataTypes) => {
	class Item extends Model {
		static associate(models) {
			Item.belongsTo(models.User, { foreignKey: "createdById" });
			Item.hasMany(models.SellerItem, { foreignKey: "itemId" });
		}
	}

	Item.init(
		{
			name: {
				...requiredString(DataTypes, "Item name"),
				unique: {
					msg: "Item name already exists",
				},
			},

			description: requiredText(DataTypes, "Description"),

			imageUrl: requiredUrl(DataTypes, "Image URL"),

			status: enumString(
				DataTypes,
				"Item status",
				ItemStatus,
				ItemStatus.ACTIVE,
			),

			createdById: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Created by is required",
					},
					isInt: {
						msg: "Created by must be valid",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "Item",
		},
	);

	return Item;
};
