"use strict";

const { Model } = require("sequelize");
const { InvoiceStatus } = require("../helpers/enums");
const {
	requiredString,
	requiredInteger,
	requiredDate,
	optionalDate,
	enumString,
} = require("../helpers/validators");
const { toIdr } = require("../helpers/helpers");

module.exports = (sequelize, DataTypes) => {
	class Invoice extends Model {
		static associate(models) {
			Invoice.belongsTo(models.Booking, { foreignKey: "bookingId" });
			Invoice.belongsTo(models.SellerProfile, {
				foreignKey: "issuedBySellerProfileId",
				as: "issuedBySeller",
			});
			Invoice.hasOne(models.Payment, { foreignKey: "invoiceId" });
		}
		get amountIdr() {
			return toIdr(this.amount);
		}
	}

	Invoice.init(
		{
			invoiceNumber: {
				...requiredString(DataTypes, "Invoice number"),
				unique: {
					msg: "Invoice number already exists",
				},
			},

			bookingId: {
				...requiredInteger(DataTypes, "Booking"),
				unique: {
					msg: "Booking already has an invoice",
				},
			},

			amount: requiredInteger(DataTypes, "Amount", 10000),

			status: enumString(
				DataTypes,
				"Invoice status",
				InvoiceStatus,
				InvoiceStatus.ISSUED,
			),

			issuedAt: requiredDate(DataTypes, "Issued at"),

			dueDate: optionalDate(DataTypes, "Due date"),

			issuedBySellerProfileId: requiredInteger(
				DataTypes,
				"Issued by seller profile",
			),
		},
		{
			sequelize,
			modelName: "Invoice",
		},
	);

	return Invoice;
};
