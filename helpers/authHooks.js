const bcrypt = require("bcryptjs");

async function encryptPassword(user) {
	if (!user.password) return;

	if (user.changed("password")) {
		user.password = await bcrypt.hash(user.password, 10);
	}
}

module.exports = encryptPassword;
