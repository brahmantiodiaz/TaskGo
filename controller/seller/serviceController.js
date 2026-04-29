const { Op } = require("sequelize");
const { SellerItem, Item, SellerProfile } = require("../../models");
const { ItemStatus, SellerItemStatus } = require("../../helpers/enums");
const { getValidationError } = require("../../helpers/helpers");

class SellerServiceController {
	static async index(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { search, status } = req.query;

			const options = {
				where: {
					sellerProfileId: sellerProfile.id,
				},
				include: Item,
				order: [["id", "ASC"]],
			};

			if (search) {
				options.where[Op.or] = [
					{
						serviceTitle: {
							[Op.iLike]: `%${search}%`,
						},
					},
					{
						serviceDescription: {
							[Op.iLike]: `%${search}%`,
						},
					},
					{
						location: {
							[Op.iLike]: `%${search}%`,
						},
					},
				];
			}

			if (status) {
				options.where.status = status;
			}

			const services = await SellerItem.findAll(options);

			res.render("seller/services/index", {
				title: "My Services",
				services,
				search,
				status,
				sellerItemStatuses: Object.values(SellerItemStatus),
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async add(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const items = await Item.findAll({
				where: {
					status: ItemStatus.ACTIVE,
				},
				order: [["name", "ASC"]],
			});

			res.render("seller/services/form", {
				title: "Add Service",
				action: "/seller/services/add",
				detail: null,
				error: null,
				isEdit: false,
				items,
				sellerItemStatuses: Object.values(SellerItemStatus),
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async create(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const {
				itemId,
				serviceTitle,
				serviceDescription,
				price,
				duration,
				location,
				status,
			} = req.body;

			await SellerItem.create({
				sellerProfileId: sellerProfile.id,
				itemId,
				serviceTitle,
				serviceDescription,
				price,
				duration,
				location,
				status,
			});

			res.redirect("/seller/services");
		} catch (error) {
			console.log(error);

			const items = await Item.findAll({
				where: {
					status: ItemStatus.ACTIVE,
				},
				order: [["name", "ASC"]],
			});

			res.render("seller/services/form", {
				title: "Add Service",
				action: "/seller/services/add",
				detail: req.body,
				error: getValidationError(error),
				isEdit: false,
				items,
				sellerItemStatuses: Object.values(SellerItemStatus),
			});
		}
	}

	static async detail(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const service = await SellerItem.findOne({
				where: {
					id,
					sellerProfileId: sellerProfile.id,
				},
				include: Item,
			});

			if (!service) {
				return res.redirect("/seller/services");
			}

			res.render("seller/services/detail", {
				title: "Service Detail",
				service,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async edit(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const service = await SellerItem.findOne({
				where: {
					id,
					sellerProfileId: sellerProfile.id,
				},
			});

			if (!service) {
				return res.redirect("/seller/services");
			}

			const items = await Item.findAll({
				where: {
					status: ItemStatus.ACTIVE,
				},
				order: [["name", "ASC"]],
			});

			res.render("seller/services/form", {
				title: "Edit Service",
				action: `/seller/services/${id}/edit`,
				detail: service,
				error: null,
				isEdit: true,
				items,
				sellerItemStatuses: Object.values(SellerItemStatus),
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async update(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;
			const {
				itemId,
				serviceTitle,
				serviceDescription,
				price,
				duration,
				location,
				status,
			} = req.body;

			const service = await SellerItem.findOne({
				where: {
					id,
					sellerProfileId: sellerProfile.id,
				},
			});

			if (!service) {
				return res.redirect("/seller/services");
			}

			await service.update({
				itemId,
				serviceTitle,
				serviceDescription,
				price,
				duration,
				location,
				status,
			});

			res.redirect("/seller/services");
		} catch (error) {
			console.log(error);

			const items = await Item.findAll({
				where: {
					status: ItemStatus.ACTIVE,
				},
				order: [["name", "ASC"]],
			});

			res.render("seller/services/form", {
				title: "Edit Service",
				action: `/seller/services/${req.params.id}/edit`,
				detail: {
					id: req.params.id,
					...req.body,
				},
				error: getValidationError(error),
				isEdit: true,
				items,
				sellerItemStatuses: Object.values(SellerItemStatus),
			});
		}
	}

	static async delete(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			await SellerItem.destroy({
				where: {
					id,
					sellerProfileId: sellerProfile.id,
				},
			});

			res.redirect("/seller/services");
		} catch (error) {
			console.log(error);
			res.redirect("/seller/services");
		}
	}

	static async toggleStatus(req, res) {
		try {
			const sellerProfile = await SellerProfile.getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			const { id } = req.params;

			const service = await SellerItem.findOne({
				where: {
					id,
					sellerProfileId: sellerProfile.id,
				},
			});

			if (!service) {
				return res.redirect("/seller/services");
			}

			const newStatus =
				service.status === SellerItemStatus.AVAILABLE
					? SellerItemStatus.UNAVAILABLE
					: SellerItemStatus.AVAILABLE;

			await service.update({
				status: newStatus,
			});

			res.redirect("/seller/services");
		} catch (error) {
			console.log(error);
			res.redirect("/seller/services");
		}
	}
}

module.exports = SellerServiceController;
