const { Op } = require("sequelize");
const {
	Booking,
	SellerItem,
	Item,
	SellerProfile,
	UserProfile,
	Invoice,
} = require("../../models");
const {
	BookingStatus,
	ItemStatus,
	SellerItemStatus,
} = require("../../helpers/enums");
const getValidationError = require("../../helpers/helpers");
const getCurrentBuyerProfile = require("../../helpers/getCurrentBuyerProfile");

function generateBookingCode(totalBooking) {
	const number = String(totalBooking + 1).padStart(6, "0");
	return `TSK-${number}`;
}

class BuyerBookingController {
	static async add(req, res) {
		try {
			const buyerProfile = await getCurrentBuyerProfile(req);

			if (!buyerProfile) {
				return res.redirect("/buyer/profile/setup");
			}

			const { id } = req.params;

			const service = await SellerItem.findOne({
				where: {
					id,
					status: SellerItemStatus.AVAILABLE,
				},
				include: [
					{
						model: Item,
						where: {
							status: ItemStatus.ACTIVE,
						},
					},
					{
						model: SellerProfile,
						include: UserProfile,
					},
				],
			});

			if (!service) {
				return res.redirect("/buyer/services");
			}

			res.render("buyer/bookings/form", {
				title: "Create Booking",
				action: `/buyer/services/${id}/book`,
				service,
				detail: {
					address: buyerProfile.address,
				},
				error: null,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async create(req, res) {
		try {
			const buyerProfile = await getCurrentBuyerProfile(req);

			if (!buyerProfile) {
				return res.redirect("/buyer/profile/setup");
			}

			const { id } = req.params;
			const { bookingDate, address, note } = req.body;

			const service = await SellerItem.findOne({
				where: {
					id,
					status: SellerItemStatus.AVAILABLE,
				},
				include: {
					model: Item,
					where: {
						status: ItemStatus.ACTIVE,
					},
				},
			});

			if (!service) {
				return res.redirect("/buyer/services");
			}

			const totalBooking = await Booking.count();

			await Booking.create({
				bookingCode: generateBookingCode(totalBooking),
				buyerId: req.session.user.id,
				sellerItemId: service.id,
				bookingDate,
				address,
				note,
				status: BookingStatus.PENDING,
			});

			res.redirect("/buyer/bookings");
		} catch (error) {
			console.log(error);

			const service = await SellerItem.findByPk(req.params.id, {
				include: [Item, { model: SellerProfile, include: UserProfile }],
			});

			res.render("buyer/bookings/form", {
				title: "Create Booking",
				action: `/buyer/services/${req.params.id}/book`,
				service,
				detail: req.body,
				error: getValidationError(error),
			});
		}
	}

	static async index(req, res) {
		try {
			const { search, status } = req.query;

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

			const bookings = await Booking.findAll(options);

			res.render("buyer/bookings/index", {
				title: "My Bookings",
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
			const { id } = req.params;

			const booking = await Booking.findOne({
				where: {
					id,
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
			});

			if (!booking) {
				return res.redirect("/buyer/bookings");
			}

			res.render("buyer/bookings/detail", {
				title: "Booking Detail",
				booking,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async cancel(req, res) {
		try {
			const { id } = req.params;

			const booking = await Booking.findOne({
				where: {
					id,
					buyerId: req.session.user.id,
					status: {
						[Op.in]: [BookingStatus.PENDING, BookingStatus.APPROVED],
					},
				},
			});

			if (!booking) {
				return res.redirect("/buyer/bookings");
			}

			await booking.update({
				status: BookingStatus.CANCELLED,
			});

			res.redirect(`/buyer/bookings/${id}`);
		} catch (error) {
			console.log(error);
			res.redirect("/buyer/bookings");
		}
	}
}

module.exports = BuyerBookingController;
