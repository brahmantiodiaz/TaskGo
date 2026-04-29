const { User, UserProfile } = require("../../models");
const getValidationError = require("../../helpers/helpers");
const getCurrentBuyerProfile = require("../../helpers/getCurrentBuyerProfile");

class BuyerProfileController {
	static async detail(req, res) {
		try {
			const buyerProfile = await getCurrentBuyerProfile(req);

			if (!buyerProfile) {
				return res.redirect("/buyer/profile/setup");
			}

			res.render("buyer/profile/detail", {
				title: "Buyer Profile",
				buyerProfile,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async setup(req, res) {
		try {
			const buyerProfile = await getCurrentBuyerProfile(req);

			if (buyerProfile) {
				return res.redirect("/buyer/profile");
			}

			const user = await User.findByPk(req.session.user.id);

			res.render("buyer/profile/form", {
				title: "Setup Buyer Profile",
				action: "/buyer/profile/setup",
				detail: user,
				error: null,
				isEdit: false,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async create(req, res) {
		try {
			const { fullName, phoneNumber, address } = req.body;

			let avatarUrl = null;
			if (req.file) {
				avatarUrl = `/uploads/${req.file.filename}`;
			}

			await UserProfile.create({
				userId: req.session.user.id,
				fullName,
				phoneNumber,
				address,
				avatarUrl,
			});

			res.redirect("/buyer/profile");
		} catch (error) {
			console.log(error);

			res.render("buyer/profile/form", {
				title: "Setup Buyer Profile",
				action: "/buyer/profile/setup",
				detail: req.body,
				error: getValidationError(error),
				isEdit: false,
			});
		}
	}

	static async edit(req, res) {
		try {
			const buyerProfile = await getCurrentBuyerProfile(req);

			if (!buyerProfile) {
				return res.redirect("/buyer/profile/setup");
			}

			res.render("buyer/profile/form", {
				title: "Edit Buyer Profile",
				action: "/buyer/profile/edit",
				detail: buyerProfile,
				error: null,
				isEdit: true,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async update(req, res) {
		try {
			const buyerProfile = await getCurrentBuyerProfile(req);

			if (!buyerProfile) {
				return res.redirect("/buyer/profile/setup");
			}

			const { fullName, phoneNumber, address } = req.body;

			let avatarUrl = buyerProfile.avatarUrl; 
			if (req.file) {
				avatarUrl = `/uploads/${req.file.filename}`;
			}

			await buyerProfile.update({
				fullName,
				phoneNumber,
				address,
				avatarUrl,
			});

			res.redirect("/buyer/profile");
		} catch (error) {
			console.log(error);

			res.render("buyer/profile/form", {
				title: "Edit Buyer Profile",
				action: "/buyer/profile/edit",
				detail: req.body,
				error: getValidationError(error),
				isEdit: true,
			});
		}
	}
}

module.exports = BuyerProfileController;
