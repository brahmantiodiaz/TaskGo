const { User, UserProfile } = require("../models");

async function getCurrentBuyerProfile(req) {
	const userId = req.session.user.id;

	const userProfile = await UserProfile.findOne({
		where: {
			userId,
		},
		include: {
			model: User,
			attributes: ["id", "username", "email", "role"],
		},
	});

	return userProfile;
}

module.exports = getCurrentBuyerProfile;
