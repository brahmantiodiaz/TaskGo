const router = require("express").Router();
const { isGuest, setLayout } = require("../middlewares/auth");
const AuthController = require("../controller/authController");

router.use(setLayout("layouts/auth"));

router.get("/login", isGuest, AuthController.loginForm);

router.post("/login", isGuest, AuthController.login);

router.get("/register", isGuest, AuthController.registerForm);

router.post("/register", isGuest, AuthController.register);

router.get("/logout", AuthController.logout);

module.exports = router;
