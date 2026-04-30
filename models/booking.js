"use strict";

const { Model, Op } = require("sequelize");
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

		static async BuyerBookingList(search, status, req) {
			const { SellerItem, Invoice, Item, SellerProfile, UserProfile } =
				sequelize.models;
			const options = {
				where: {
					buyerId: req.session.user.id,
				},
				include: [
					{
						model: SellerItem,
						include: [
							Item,
							{
								model: SellerProfile,
								include: UserProfile,
							},
						],
					},
					{
						model: Invoice,
					},
				],
				order: [["bookingDate", "DESC"]],
			};

			if (search) {
				options.where.bookingCode = {
					[Op.iLike]: `%${search}%`,
				};
			}

			if (status) {
				options.where.status = status;
			}

			return await Booking.findAll(options);
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

			bookingDate: {
				...requiredDate(DataTypes, "Booking date"),
				validate: {
					...requiredDate(DataTypes, "Booking date").validate,

					minToday(value) {
						if (!value) return;

						const inputDate = new Date(value);

						const today = new Date();
						today.setHours(0, 0, 0, 0);

						if (inputDate < today) {
							throw new Error("Booking date cannot be earlier than today");
						}
					},
				},
			},

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
