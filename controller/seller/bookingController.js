const {
	sequelize,
	Booking,
	User,
	SellerItem,
	Item,
	Invoice,
	SellerProfile,
} = require("../../models");
const { BookingStatus, InvoiceStatus } = require("../../helpers/enums");

function generateInvoiceNumber(totalInvoice) {
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const date = String(now.getDate()).padStart(2, "0");
	const number = String(totalInvoice + 1).padStart(6, "0");

	return `INV-${year}${month}${date}-${number}`;
}

class SellerBookingController {
	static async index(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { search, status } = req.query;

			const options = {
				include: [
					{
						model: User,
						as: "buyer",
						attributes: ["id", "username", "email", "role"],
					},
					{
						model: SellerItem,
						where: {
							sellerProfileId: sellerProfile.id,
						},
						include: Item,
					},
				],
				order: [["bookingDate", "DESC"]],
				where: {},
			};

			if (search) {
				options.where.bookingCode = {
					[require("sequelize").Op.iLike]: `%${search}%`,
				};
			}

			if (status) {
				options.where.status = status;
			}

			const bookings = await Booking.findAll(options);

			res.render("seller/bookings/index", {
				title: "Bookings",
				bookings,
				search,
				status,
				bookingStatuses: Object.values(BookingStatus),
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async detail(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const booking = await Booking.findOne({
				where: {
					id,
				},
				include: [
					{
						model: User,
						as: "buyer",
						attributes: ["id", "username", "email", "role"],
					},
					{
						model: SellerItem,
						where: {
							sellerProfileId: sellerProfile.id,
						},
						include: Item,
					},
					{
						model: Invoice,
					},
				],
			});

			if (!booking) {
				return res.redirect("/seller/bookings");
			}

			res.render("seller/bookings/detail", {
				title: "Booking Detail",
				booking,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async approve(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const booking = await Booking.findOne({
				where: {
					id,
					status: BookingStatus.PENDING,
				},
				include: {
					model: SellerItem,
					where: {
						sellerProfileId: sellerProfile.id,
					},
				},
			});

			if (!booking) {
				return res.redirect("/seller/bookings");
			}

			await booking.update({
				status: BookingStatus.APPROVED,
			});

			res.redirect(`/seller/bookings/${id}`);
		} catch (error) {
			console.log(error);
			res.redirect("/seller/bookings");
		}
	}

	static async reject(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const booking = await Booking.findOne({
				where: {
					id,
					status: BookingStatus.PENDING,
				},
				include: {
					model: SellerItem,
					where: {
						sellerProfileId: sellerProfile.id,
					},
				},
			});

			if (!booking) {
				return res.redirect("/seller/bookings");
			}

			await booking.update({
				status: BookingStatus.REJECTED,
			});

			res.redirect(`/seller/bookings/${id}`);
		} catch (error) {
			console.log(error);
			res.redirect("/seller/bookings");
		}
	}

	static async complete(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const booking = await Booking.findOne({
				where: {
					id,
				},
				include: {
					model: SellerItem,
					where: {
						sellerProfileId: sellerProfile.id,
					},
				},
			});

			if (!booking) {
				return res.redirect("/seller/bookings");
			}

			if (
				booking.status !== BookingStatus.APPROVED &&
				booking.status !== BookingStatus.ON_PROGRESS
			) {
				return res.redirect(`/seller/bookings/${id}`);
			}

			await booking.update({
				status: BookingStatus.COMPLETED,
			});

			res.redirect(`/seller/bookings/${id}`);
		} catch (error) {
			console.log(error);
			res.redirect("/seller/bookings");
		}
	}

	static async createInvoice(req, res) {
		const t = await sequelize.transaction();

		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				await t.rollback();
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const booking = await Booking.findOne({
				where: {
					id,
				},
				include: {
					model: SellerItem,
					where: {
						sellerProfileId: sellerProfile.id,
					},
				},
				transaction: t,
			});

			if (!booking) {
				await t.rollback();
				return res.redirect("/seller/bookings");
			}

			if (booking.status !== BookingStatus.COMPLETED) {
				await t.rollback();
				return res.redirect(`/seller/bookings/${id}`);
			}

			const existingInvoice = await Invoice.findOne({
				where: {
					bookingId: booking.id,
				},
				transaction: t,
			});

			if (existingInvoice) {
				await t.rollback();
				return res.redirect(`/seller/invoices/${existingInvoice.id}`);
			}

			const totalInvoice = await Invoice.count({
				transaction: t,
			});

			const dueDate = new Date();
			dueDate.setDate(dueDate.getDate() + 3);

			const invoice = await Invoice.create(
				{
					invoiceNumber: generateInvoiceNumber(totalInvoice),
					bookingId: booking.id,
					amount: booking.SellerItem.price,
					status: InvoiceStatus.ISSUED,
					issuedAt: new Date(),
					dueDate,
					issuedBySellerProfileId: sellerProfile.id,
				},
				{
					transaction: t,
				},
			);

			await booking.update(
				{
					status: BookingStatus.WAITING_PAYMENT,
				},
				{
					transaction: t,
				},
			);

			await t.commit();

			res.redirect(`/seller/invoices/${invoice.id}`);
		} catch (error) {
			await t.rollback();

			console.log(error);
			res.redirect("/seller/bookings");
		}
	}
}

module.exports = SellerBookingController;
