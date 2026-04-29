const router = require("express").Router();
const { setLayout, isGuest } = require("../middlewares/auth");

router.use(setLayout("layouts/public"));

router.get("/", isGuest, (req, res) => {
	res.render("pages/landing", {
		title: "TaskGo - Home Service Platform",
	});
});

module.exports = router;
