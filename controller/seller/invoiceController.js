const {
	Invoice,
	Booking,
	User,
	SellerItem,
	Item,
	Payment,
	SellerProfile,
} = require("../../models");
const { Op } = require("sequelize");
const { InvoiceStatus } = require("../../helpers/enums");

class SellerInvoiceController {
	static async index(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { search, status } = req.query;

			const options = {
				where: {
					issuedBySellerProfileId: sellerProfile.id,
				},
				include: [
					{
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
					{
						model: Payment,
					},
				],
				order: [["issuedAt", "DESC"]],
			};

			if (search) {
				options.where.invoiceNumber = {
					[Op.iLike]: `%${search}%`,
				};
			}

			if (status) {
				options.where.status = status;
			}

			const invoices = await Invoice.findAll(options);

			res.render("seller/invoices/index", {
				title: "Invoices",
				invoices,
				search,
				status,
				invoiceStatuses: Object.values(InvoiceStatus),
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

			const invoice = await Invoice.findOne({
				where: {
					id,
					issuedBySellerProfileId: sellerProfile.id,
				},
				include: [
					{
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
					{
						model: Payment,
					},
				],
			});

			if (!invoice) {
				return res.redirect("/seller/invoices");
			}

			res.render("seller/invoices/detail", {
				title: "Invoice Detail",
				invoice,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}
}

module.exports = SellerInvoiceController;
