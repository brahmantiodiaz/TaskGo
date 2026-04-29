const { sequelize, User, UserProfile, SellerProfile } = require("../../models");
const getValidationError = require("../../helpers/helpers");
const getCurrentSellerProfile = require("../../helpers/getCurrentSellerProfile");

class SellerProfileController {
	static async detail(req, res) {
		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			res.render("seller/profile/detail", {
				title: "Seller Profile",
				sellerProfile,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async setup(req, res) {
		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (sellerProfile) {
				return res.redirect("/seller/profile");
			}

			const user = await User.findByPk(req.session.user.id, {
				include: UserProfile,
			});

			res.render("seller/profile/form", {
				title: "Setup Seller Profile",
				action: "/seller/profile/setup",
				detail: {
					username: user.username,
					email: user.email,
					...(user.UserProfile?.toJSON() || {}),
				},
				error: null,
				isEdit: false,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async create(req, res) {
		const t = await sequelize.transaction();

		try {
			const {
				fullName,
				phoneNumber,
				address,
				avatarUrl,
				headline,
				description,
				experienceYear,
				bankName,
				bankAccountNumber,
			} = req.body;

			let userProfile = await UserProfile.findOne({
				where: {
					userId: req.session.user.id,
				},
				transaction: t,
			});

			if (!userProfile) {
				userProfile = await UserProfile.create(
					{
						userId: req.session.user.id,
						fullName,
						phoneNumber,
						address,
						avatarUrl,
					},
					{
						transaction: t,
					},
				);
			} else {
				await userProfile.update(
					{
						fullName,
						phoneNumber,
						address,
						avatarUrl,
					},
					{
						transaction: t,
					},
				);
			}

			await SellerProfile.create(
				{
					userProfileId: userProfile.id,
					headline,
					description,
					experienceYear,
					bankName,
					bankAccountNumber,
				},
				{
					transaction: t,
				},
			);

			await t.commit();

			res.redirect("/seller/profile");
		} catch (error) {
			await t.rollback();

			console.log(error);

			res.render("seller/profile/form", {
				title: "Setup Seller Profile",
				action: "/seller/profile/setup",
				detail: req.body,
				error: getValidationError(error),
				isEdit: false,
			});
		}
	}

	static async edit(req, res) {
		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (!sellerProfile) {
				return res.redirect("/seller/profile/setup");
			}

			res.render("seller/profile/form", {
				title: "Edit Seller Profile",
				action: "/seller/profile/edit",
				detail: {
					...sellerProfile.toJSON(),
					...sellerProfile.UserProfile.toJSON(),
				},
				error: null,
				isEdit: true,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async update(req, res) {
		const t = await sequelize.transaction();
		console.log(req.body);
		try {
			const sellerProfile = await getCurrentSellerProfile(req);

			if (!sellerProfile) {
				await t.rollback();
				return res.redirect("/seller/profile/setup");
			}

			const {
				fullName,
				phoneNumber,
				address,
				avatarUrl,
				headline,
				description,
				experienceYear,
				bankName,
				bankAccountNumber,
			} = req.body;

			await sellerProfile.UserProfile.update(
				{
					fullName,
					phoneNumber,
					address,
					avatarUrl,
				},
				{
					transaction: t,
				},
			);

			await sellerProfile.update(
				{
					headline,
					description,
					experienceYear,
					bankName,
					bankAccountNumber,
				},
				{
					transaction: t,
				},
			);

			await t.commit();

			res.redirect("/seller/profile");
		} catch (error) {
			await t.rollback();

			console.log(error);

			res.render("seller/profile/form", {
				title: "Edit Seller Profile",
				action: "/seller/profile/edit",
				detail: req.body,
				error: getValidationError(error),
				isEdit: true,
			});
		}
	}
}

module.exports = SellerProfileController;
