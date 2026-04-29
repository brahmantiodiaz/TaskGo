const { Booking, Invoice, Payment } = require("../../models");
const {
	BookingStatus,
	InvoiceStatus,
	PaymentStatus,
} = require("../../helpers/enums");
const getCurrentBuyerProfile = require("../../helpers/getCurrentBuyerProfile");

class BuyerDashboardController {
	static async index(req, res) {
		try {
			const buyerProfile = await getCurrentBuyerProfile(req);

			if (!buyerProfile) {
				return res.redirect("/buyer/profile/setup");
			}

			const buyerId = req.session.user.id;

			const totalBookings = await Booking.count({
				where: {
					buyerId,
				},
			});

			const pendingBookings = await Booking.count({
				where: {
					buyerId,
					status: BookingStatus.PENDING,
				},
			});

			const completedBookings = await Booking.count({
				where: {
					buyerId,
					status: BookingStatus.COMPLETED,
				},
			});

			const totalInvoices = await Invoice.count({
				include: {
					model: Booking,
					where: {
						buyerId,
					},
				},
			});

			const unpaidInvoices = await Invoice.count({
				where: {
					status: InvoiceStatus.ISSUED,
				},
				include: {
					model: Booking,
					where: {
						buyerId,
					},
				},
			});

			const waitingPayments = await Payment.count({
				where: {
					paymentStatus: PaymentStatus.WAITING_CONFIRMATION,
				},
				include: {
					model: Invoice,
					include: {
						model: Booking,
						where: {
							buyerId,
						},
					},
				},
			});

			const paidInvoices = await Invoice.findAll({
				where: {
					status: InvoiceStatus.PAID,
				},
				include: {
					model: Booking,
					where: {
						buyerId,
					},
				},
			});

			const totalSpending = paidInvoices.reduce((total, invoice) => {
				return total + invoice.amount;
			}, 0);

			res.render("buyer/dashboard", {
				title: "Buyer Dashboard",
				buyerProfile,
				totalBookings,
				pendingBookings,
				completedBookings,
				totalInvoices,
				unpaidInvoices,
				waitingPayments,
				totalSpending,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}
}

module.exports = BuyerDashboardController;
