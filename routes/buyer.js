const router = require("express").Router();
const { authorizeRoles, setLayout } = require("../middlewares/auth");
const { UserRole } = require("../helpers/enums");

router.use(authorizeRoles(UserRole.BUYER));
router.use(setLayout("layouts/buyer"));

router.get("/", (req, res) => {
	res.render("pages/buyer-dashboard", {
		title: "Buyer Dashboard",
	});
});

module.exports = router;
