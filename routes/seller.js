const router = require("express").Router();
const { authorizeRoles, setLayout } = require("../middlewares/auth");
const { UserRole } = require("../helpers/enums");

router.use(authorizeRoles(UserRole.SELLER));
router.use(setLayout("layouts/seller"));

router.get("/", (req, res) => {
	res.render("pages/seller-dashboard", {
		title: "Seller Dashboard",
	});
});

module.exports = router;
