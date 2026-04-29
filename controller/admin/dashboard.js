const { User, Item, Invoice } = require("../../models");
const { InvoiceStatus } = require("../../helpers/enums");

class AdminDashboardController {
	static async index(req, res) {
		try {
			console.log("hallo");
			const totalUsers = await User.count();
			const totalItems = await Item.count();
			const totalInvoices = await Invoice.count();

			const paidInvoices = await Invoice.count({
				where: {
					status: InvoiceStatus.PAID,
				},
			});

			const totalRevenue = await Invoice.sum("amount", {
				where: {
					status: InvoiceStatus.PAID,
				},
			});

			res.render("admin/dashboard", {
				title: "Admin Dashboard",
				totalUsers,
				totalItems,
				totalInvoices,
				paidInvoices,
				totalRevenue: totalRevenue || 0,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}
}

module.exports = AdminDashboardController;
