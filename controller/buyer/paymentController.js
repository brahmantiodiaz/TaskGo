const {
	sequelize,
	Payment,
	Invoice,
	Booking,
	SellerItem,
	Item,
	SellerProfile,
	UserProfile,
} = require("../../models");
const {
	PaymentMethod,
	PaymentStatus,
	InvoiceStatus,
	BookingStatus,
} = require("../../helpers/enums");
const { getValidationError } = require("../../helpers/helpers");

class BuyerPaymentController {
	static async add(req, res) {
		try {
			const { id } = req.params;

			const invoice = await Invoice.findOne({
				where: {
					id,
				},
				include: [
					{
						model: Booking,
						where: {
							buyerId: req.session.user.id,
						},
						include: {
							model: SellerItem,
							include: [
								Item,
								{
									model: SellerProfile,
									include: UserProfile,
								},
							],
						},
					},
					{
						model: Payment,
					},
				],
			});

			if (!invoice) {
				return res.redirect("/buyer/invoices");
			}

			if (invoice.status === InvoiceStatus.PAID) {
				return res.redirect(`/buyer/bookings/${invoice.bookingId}`);
			}

			if (invoice.Payment?.paymentStatus === PaymentStatus.WAITING_CONFIRMATION) {
				return res.redirect(`/buyer/bookings/${invoice.bookingId}`);
			}

			res.render("buyer/payments/form", {
				title: "Submit Payment",
				action: `/buyer/invoices/${id}/pay`,
				invoice,
				detail: invoice.Payment || null,
				error: null,
				paymentMethods: Object.values(PaymentMethod),
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async create(req, res) {
		const t = await sequelize.transaction();

		try {
			const { id } = req.params;
			const { paymentMethod } = req.body;

			let proofPaymentUrl = null;
			if (req.file) {
				proofPaymentUrl = `/uploads/${req.file.filename}`;
			}

			const invoice = await Invoice.findOne({
				where: {
					id,
				},
				include: [
					{
						model: Booking,
						where: {
							buyerId: req.session.user.id,
						},
					},
					{
						model: Payment,
					},
				],
				transaction: t,
			});

			if (!invoice) {
				await t.rollback();
				return res.redirect("/buyer/bookings");
			}

			if (invoice.status === InvoiceStatus.PAID) {
				await t.rollback();
				return res.redirect(`/buyer/bookings/${invoice.bookingId}`);
			}

			if (invoice.Payment) {
				await invoice.Payment.update(
					{
						amount: invoice.amount,
						paymentMethod,
						paymentStatus: PaymentStatus.WAITING_CONFIRMATION,
						proofPaymentUrl,
						paidAt: new Date(),
						confirmedAt: null,
						confirmedBySellerProfileId: null,
					},
					{
						transaction: t,
					},
				);
			} else {
				await Payment.create(
					{
						invoiceId: invoice.id,
						amount: invoice.amount,
						paymentMethod,
						paymentStatus: PaymentStatus.WAITING_CONFIRMATION,
						proofPaymentUrl,
						paidAt: new Date(),
					},
					{
						transaction: t,
					},
				);
			}

			await invoice.Booking.update(
				{
					status: BookingStatus.WAITING_PAYMENT_CONFIRMATION,
				},
				{
					transaction: t,
				},
			);

			await t.commit();

			res.redirect(`/buyer/bookings/${invoice.bookingId}`);
		} catch (error) {
			await t.rollback();

			console.log(error);

			const invoice = await Invoice.findByPk(req.params.id, {
				include: [
					{
						model: Booking,
						include: {
							model: SellerItem,
							include: [
								Item,
								{
									model: SellerProfile,
									include: UserProfile,
								},
							],
						},
					},
					Payment,
				],
			});

			res.render("buyer/payments/form", {
				title: "Submit Payment",
				action: `/buyer/invoices/${req.params.id}/pay`,
				invoice,
				detail: req.body,
				error: getValidationError(error),
				paymentMethods: Object.values(PaymentMethod),
			});
		}
	}

	static async index(req, res) {
		try {
			const { status } = req.query;

			const options = {
				include: {
					model: Invoice,
					include: {
						model: Booking,
						where: {
							buyerId: req.session.user.id,
						},
						include: {
							model: SellerItem,
							include: [
								Item,
								{
									model: SellerProfile,
									include: UserProfile,
								},
							],
						},
					},
				},
				order: [["createdAt", "DESC"]],
				where: {},
			};

			if (status) {
				options.where.paymentStatus = status;
			}

			const payments = await Payment.findAll(options);

			res.render("buyer/payments/index", {
				title: "My Payments",
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
			const { id } = req.params;

			const payment = await Payment.findOne({
				where: {
					id,
				},
				include: {
					model: Invoice,
					include: {
						model: Booking,
						where: {
							buyerId: req.session.user.id,
						},
						include: {
							model: SellerItem,
							include: [
								Item,
								{
									model: SellerProfile,
									include: UserProfile,
								},
							],
						},
					},
				},
			});

			if (!payment) {
				return res.redirect("/buyer/payments");
			}

			res.render("buyer/payments/detail", {
				title: "Payment Detail",
				payment,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}
}

module.exports = BuyerPaymentController;
