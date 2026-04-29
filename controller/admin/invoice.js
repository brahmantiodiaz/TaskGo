const { Op } = require("sequelize");
const {
	Invoice,
	Booking,
	User,
	SellerItem,
	Item,
	SellerProfile,
	UserProfile,
	Payment,
} = require("../../models");
const { InvoiceStatus } = require("../../helpers/enums");

class AdminInvoiceController {
	static async index(req, res) {
		try {
			const { search, status } = req.query;

			const options = {
				order: [["issuedAt", "DESC"]],
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
						model: SellerProfile,
						as: "issuedBySeller",
						include: UserProfile,
					},
				],
				where: {},
			};

			if (status) {
				options.where.status = status;
			}

			if (search) {
				options.where[Op.or] = [
					{
						invoiceNumber: {
							[Op.iLike]: `%${search}%`,
						},
					},
				];
			}

			const invoices = await Invoice.findAll(options);

			res.render("admin/invoices/index", {
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
			const { id } = req.params;

			const invoice = await Invoice.findByPk(id, {
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
						model: SellerProfile,
						as: "issuedBySeller",
						include: UserProfile,
					},
					{
						model: Payment,
					},
				],
			});

			if (!invoice) {
				return res.redirect("/admin/invoices");
			}

			res.render("admin/invoices/detail", {
				title: "Invoice Detail",
				invoice,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}
}

module.exports = AdminInvoiceController;
