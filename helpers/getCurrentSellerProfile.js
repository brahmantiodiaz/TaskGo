const { User, UserProfile, SellerProfile } = require("../models");

async function getCurrentSellerProfile(req) {
	const userId = req.session.user.id;

	const sellerProfile = await SellerProfile.findOne({
		include: {
			model: UserProfile,
			where: {
				userId,
			},
			include: {
				model: User,
				attributes: ["id", "username", "email", "role"],
			},
		},
	});

	return sellerProfile;
}

module.exports = getCurrentSellerProfile;
