const {
	sequelize,
	Payment,
	Invoice,
	Booking,
	User,
	SellerItem,
	Item,
} = require("../../models");
const {
	PaymentStatus,
	InvoiceStatus,
	BookingStatus,
} = require("../../helpers/enums");
const getCurrentSellerProfile = require("../../helpers/getCurrentSellerProfile");

class SellerPaymentController {
	static async index(req, res) {
		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { status } = req.query;

			const options = {
				include: {
					model: Invoice,
					where: {
						issuedBySellerProfileId: sellerProfile.id,
					},
					include: {
						model: Booking,
						include: [
							{
								model: User,
								as: "buyer",
								attributes: ["id", "username", "email", "role"],
							},
							{
								model: SellerItem,
								include: Item,
							},
						],
					},
				},
				order: [["createdAt", "DESC"]],
				where: {},
			};

			if (status) {
				options.where.paymentStatus = status;
			}

			const payments = await Payment.findAll(options);

			res.render("seller/payments/index", {
				title: "Payments",
				payments,
				status,
				paymentStatuses: Object.values(PaymentStatus),
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async detail(req, res) {
		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const payment = await Payment.findOne({
				where: {
					id,
				},
				include: {
					model: Invoice,
					where: {
						issuedBySellerProfileId: sellerProfile.id,
					},
					include: {
						model: Booking,
						include: [
							{
								model: User,
								as: "buyer",
								attributes: ["id", "username", "email", "role"],
							},
							{
								model: SellerItem,
								include: Item,
							},
						],
					},
				},
			});

			if (!payment) {
				return res.redirect("/seller/payments");
			}

			res.render("seller/payments/detail", {
				title: "Payment Detail",
				payment,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async confirm(req, res) {
		const t = await sequelize.transaction();

		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (!sellerProfile) {
				await t.rollback();
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const payment = await Payment.findOne({
				where: {
					id,
				},
				include: {
					model: Invoice,
					where: {
						issuedBySellerProfileId: sellerProfile.id,
					},
				},
				transaction: t,
			});

			if (!payment) {
				await t.rollback();
				return res.redirect("/seller/payments");
			}

			await payment.update(
				{
					paymentStatus: PaymentStatus.PAID,
					confirmedAt: new Date(),
					confirmedBySellerProfileId: sellerProfile.id,
				},
				{
					transaction: t,
				},
			);

			await payment.Invoice.update(
				{
					status: InvoiceStatus.PAID,
				},
				{
					transaction: t,
				},
			);

			await Booking.update(
				{
					status: BookingStatus.COMPLETED,
				},
				{
					where: {
						id: payment.Invoice.bookingId,
					},
					transaction: t,
				},
			);

			await t.commit();

			res.redirect(`/seller/payments/${id}`);
		} catch (error) {
			await t.rollback();

			console.log(error);
			res.redirect("/seller/payments");
		}
	}

	static async reject(req, res) {
		const t = await sequelize.transaction();

		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (!sellerProfile) {
				await t.rollback();
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const payment = await Payment.findOne({
				where: {
					id,
				},
				include: {
					model: Invoice,
					where: {
						issuedBySellerProfileId: sellerProfile.id,
					},
				},
				transaction: t,
			});

			if (!payment) {
				await t.rollback();
				return res.redirect("/seller/payments");
			}

			await payment.update(
				{
					paymentStatus: PaymentStatus.REJECTED,
					confirmedAt: new Date(),
					confirmedBySellerProfileId: sellerProfile.id,
				},
				{
					transaction: t,
				},
			);

			await payment.Invoice.update(
				{
					status: InvoiceStatus.ISSUED,
				},
				{
					transaction: t,
				},
			);

			await Booking.update(
				{
					status: BookingStatus.WAITING_PAYMENT,
				},
				{
					where: {
						id: payment.Invoice.bookingId,
					},
					transaction: t,
				},
			);

			await t.commit();

			res.redirect(`/seller/payments/${id}`);
		} catch (error) {
			await t.rollback();

			console.log(error);
			res.redirect("/seller/payments");
		}
	}
}

module.exports = SellerPaymentController;
