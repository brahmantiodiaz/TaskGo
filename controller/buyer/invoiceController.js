const { Op } = require("sequelize");

const easyinvoice = require("easyinvoice");
const {
	User,
	Invoice,
	Booking,
	SellerItem,
	Item,
	SellerProfile,
	UserProfile,
	Payment,
} = require("../../models");
const { InvoiceStatus } = require("../../helpers/enums");
function formatDate(date) {
	if (!date) return "-";

	return new Date(date).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

function sanitizeFileName(fileName) {
	return fileName.replace(/[^\w.-]/g, "_");
}
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
	static async download(req, res) {
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
						include: [
							{
								model: User,
								as: "buyer",
								attributes: ["id", "username", "email", "role"],
								include: UserProfile,
							},
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
						],
					},
					{
						model: Payment,
					},
				],
			});

			if (!invoice) {
				return res.redirect("/buyer/invoices");
			}

			const booking = invoice.Booking;
			const buyer = booking.buyer;
			const buyerProfile = buyer?.UserProfile;
			const sellerItem = booking.SellerItem;
			const item = sellerItem?.Item;
			const sellerProfile = sellerItem?.SellerProfile;
			const sellerUserProfile = sellerProfile?.UserProfile;
			const payment = invoice.Payment;

			const invoiceData = {
				sender: {
					company: sellerUserProfile?.fullName || "TaskGo Seller",
					address: sellerUserProfile?.address || sellerItem?.location || "-",
					zip: "-",
					city: sellerItem?.location || "-",
					country: "Indonesia",
					custom1: `Phone: ${sellerUserProfile?.phoneNumber || "-"}`,
					custom2: `Bank: ${sellerProfile?.bankName || "-"}`,
					custom3: `Account: ${sellerProfile?.bankAccountNumber || "-"}`,
				},

				client: {
					company: buyerProfile?.fullName || buyer?.username || "TaskGo Buyer",
					address: booking.address || buyerProfile?.address || "-",
					zip: "-",
					city: "-",
					country: "Indonesia",
					custom1: `Email: ${buyer?.email || "-"}`,
					custom2: `Phone: ${buyerProfile?.phoneNumber || "-"}`,
				},

				information: {
					number: invoice.invoiceNumber,
					date: formatDate(invoice.issuedAt),
					dueDate: formatDate(invoice.dueDate),
				},

				products: [
					{
						quantity: 1,
						description: `${sellerItem?.serviceTitle || "Service"} - ${
							item?.name || "TaskGo Service"
						}`,
						taxRate: 0,
						price: Number(invoice.amount || 0),
					},
				],

				bottomNotice: `Booking Code: ${booking.bookingCode}. Payment Status: ${
					payment?.paymentStatus || "unpaid"
				}. Thank you for using TaskGo.`,

				settings: {
					currency: "IDR",
					locale: "id-ID",
					format: "A4",
				},
			};

			const result = await easyinvoice.createInvoice(invoiceData);

			if (!result?.pdf) {
				return res.status(500).send("Failed to generate invoice PDF");
			}

			const pdfBuffer = Buffer.from(result.pdf, "base64");
			const fileName = sanitizeFileName(`${invoice.invoiceNumber}.pdf`);

			res.setHeader("Content-Type", "application/pdf");
			res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

			return res.send(pdfBuffer);
		} catch (error) {
			console.log(error);
			return res.status(500).send("Failed to download invoice");
		}
	}
}

module.exports = BuyerInvoiceController;
