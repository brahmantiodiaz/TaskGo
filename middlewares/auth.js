function isAuthenticated(req, res, next) {
	if (!req.session.user) {
		return res.redirect("/login");
	}

	next();
}

function isGuest(req, res, next) {
	if (!req.session.user) {
		return next();
	}

	const role = req.session.user.role;

	if (role === "admin") return res.redirect("/admin");
	if (role === "seller") return res.redirect("/seller");
	if (role === "buyer") return res.redirect("/buyer");

	return res.redirect("/");
}

function authorizeRoles(...roles) {
	return (req, res, next) => {
		if (!req.session.user) {
			return res.redirect("/login");
		}

		if (!roles.includes(req.session.user.role)) {
			return res.status(403).send("Forbidden access");
		}

		next();
	};
}

function setLayout(layout) {
	return (req, res, next) => {
		res.locals.layout = layout;
		next();
	};
}

module.exports = {
	isAuthenticated,
	isGuest,
	authorizeRoles,
	setLayout,
};
