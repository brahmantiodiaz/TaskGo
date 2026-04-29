"use strict";

const { Model } = require("sequelize");
const { PaymentMethod, PaymentStatus } = require("../helpers/enums");
const {
	requiredInteger,
	optionalInteger,
	optionalUrl,
	optionalDate,
	enumString,
} = require("../helpers/validators");
const { toIdr } = require("../helpers/helpers");

module.exports = (sequelize, DataTypes) => {
	class Payment extends Model {
		static associate(models) {
			Payment.belongsTo(models.Invoice, { foreignKey: "invoiceId" });
			Payment.belongsTo(models.SellerProfile, {
				foreignKey: "confirmedBySellerProfileId",
				as: "confirmedBySeller",
			});
		}
		get amountIdr() {
			return toIdr(this.amount);
		}
	}

	Payment.init(
		{
			invoiceId: {
				...requiredInteger(DataTypes, "Invoice"),
				unique: {
					msg: "Invoice already has a payment",
				},
			},

			amount: requiredInteger(DataTypes, "Amount", 10000),

			paymentMethod: enumString(
				DataTypes,
				"Payment method",
				PaymentMethod,
				PaymentMethod.BANK_TRANSFER,
			),

			paymentStatus: enumString(
				DataTypes,
				"Payment status",
				PaymentStatus,
				PaymentStatus.UNPAID,
			),

			proofPaymentUrl: DataTypes.STRING,

			paidAt: optionalDate(DataTypes, "Paid at"),

			confirmedAt: optionalDate(DataTypes, "Confirmed at"),

			confirmedBySellerProfileId: optionalInteger(
				DataTypes,
				"Confirmed by seller profile",
			),
		},
		{
			sequelize,
			modelName: "Payment",
		},
	);

	return Payment;
};
