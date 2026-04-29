const { Op } = require("sequelize");
const {
	Invoice,
	Booking,
	SellerItem,
	Item,
	SellerProfile,
	UserProfile,
	Payment,
} = require("../../models");
const { InvoiceStatus } = require("../../helpers/enums");

class BuyerInvoiceController {
	static async index(req, res) {
		try {
			const { search, status } = req.query;

			const options = {
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
				order: [["issuedAt", "DESC"]],
				where: {},
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

			res.render("buyer/invoices/index", {
				title: "My Invoices",
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

			res.render("buyer/invoices/detail", {
				title: "Invoice Detail",
				invoice,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}
}

module.exports = BuyerInvoiceController;
