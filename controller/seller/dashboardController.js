const { SellerItem, Booking, Invoice, Payment } = require("../../models");
const {
	BookingStatus,
	InvoiceStatus,
	PaymentStatus,
} = require("../../helpers/enums");
const getCurrentSellerProfile = require("../../helpers/getCurrentSellerProfile");

class SellerDashboardController {
	static async index(req, res) {
		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const sellerProfileId = sellerProfile.id;

			const totalServices = await SellerItem.count({
				where: {
					sellerProfileId,
				},
			});

			const totalBookings = await Booking.count({
				include: {
					model: SellerItem,
					where: {
						sellerProfileId,
					},
				},
			});

			const pendingBookings = await Booking.count({
				where: {
					status: BookingStatus.PENDING,
				},
				include: {
					model: SellerItem,
					where: {
						sellerProfileId,
					},
				},
			});

			const completedBookings = await Booking.count({
				where: {
					status: BookingStatus.COMPLETED,
				},
				include: {
					model: SellerItem,
					where: {
						sellerProfileId,
					},
				},
			});

			const totalInvoices = await Invoice.count({
				where: {
					issuedBySellerProfileId: sellerProfileId,
				},
			});

			const paidInvoices = await Invoice.count({
				where: {
					issuedBySellerProfileId: sellerProfileId,
					status: InvoiceStatus.PAID,
				},
			});

			const totalRevenue = await Invoice.sum("amount", {
				where: {
					issuedBySellerProfileId: sellerProfileId,
					status: InvoiceStatus.PAID,
				},
			});

			const waitingPayments = await Payment.count({
				where: {
					paymentStatus: PaymentStatus.WAITING_CONFIRMATION,
				},
				include: {
					model: Invoice,
					where: {
						issuedBySellerProfileId: sellerProfileId,
					},
				},
			});

			res.render("seller/dashboard", {
				title: "Seller Dashboard",
				sellerProfile,
				totalServices,
				totalBookings,
				pendingBookings,
				completedBookings,
				totalInvoices,
				paidInvoices,
				totalRevenue: totalRevenue || 0,
				waitingPayments,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}
}

module.exports = SellerDashboardController;
