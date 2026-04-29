const { Op } = require("sequelize");
const {
	SellerItem,
	Item,
	SellerProfile,
	UserProfile,
} = require("../../models");
const { ItemStatus, SellerItemStatus } = require("../../helpers/enums");

class BuyerServiceController {
	static async index(req, res) {
		try {
			const { search, itemId } = req.query;

			const options = {
				where: {
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
				order: [["id", "DESC"]],
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

			if (itemId) {
				options.where.itemId = itemId;
			}

			const services = await SellerItem.findAll(options);

			const items = await Item.findAll({
				where: {
					status: ItemStatus.ACTIVE,
				},
				order: [["name", "ASC"]],
			});

			res.render("buyer/services/index", {
				title: "Explore Services",
				services,
				items,
				search,
				itemId,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async detail(req, res) {
		try {
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

			res.render("buyer/services/detail", {
				title: "Service Detail",
				service,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}
}

module.exports = BuyerServiceController;
