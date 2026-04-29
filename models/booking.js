"use strict";

const { Model } = require("sequelize");
const { BookingStatus } = require("../helpers/enums");
const {
	requiredString,
	requiredText,
	optionalText,
	requiredInteger,
	requiredDate,
	enumString,
} = require("../helpers/validators");

module.exports = (sequelize, DataTypes) => {
	class Booking extends Model {
		static associate(models) {
			Booking.belongsTo(models.User, {
				foreignKey: "buyerId",
				as: "buyer",
			});

			Booking.belongsTo(models.SellerItem, { foreignKey: "sellerItemId" });
			Booking.hasOne(models.Invoice, { foreignKey: "bookingId" });
		}
	}

	Booking.init(
		{
			bookingCode: {
				...requiredString(DataTypes, "Booking code"),
				unique: {
					msg: "Booking code already exists",
				},
			},

			buyerId: requiredInteger(DataTypes, "Buyer"),

			sellerItemId: requiredInteger(DataTypes, "Seller item"),

			bookingDate: requiredDate(DataTypes, "Booking date"),

			address: requiredText(DataTypes, "Address"),

			note: optionalText(DataTypes),

			status: enumString(
				DataTypes,
				"Booking status",
				BookingStatus,
				BookingStatus.PENDING,
			),
		},
		{
			sequelize,
			modelName: "Booking",
		},
	);

	return Booking;
};
