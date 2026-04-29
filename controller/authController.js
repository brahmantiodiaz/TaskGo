const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { UserRole } = require("../helpers/enums");
const getValidationError = require("../helpers/helpers");

class AuthController {
	static loginForm(req, res) {
		res.render("auth/login", {
			title: "Login",
		});
	}

	static async login(req, res) {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({
				where: { email },
			});

			if (!user) {
				return res.render("auth/login", {
					title: "Login",
					error: "Invalid email or password",
				});
			}

			const isValidPassword = await bcrypt.compare(password, user.password);

			if (!isValidPassword) {
				return res.render("auth/login", {
					title: "Login",
					error: "Invalid email or password",
				});
			}

			req.session.user = {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
			};

			if (user.role === UserRole.ADMIN) return res.redirect("/admin");
			if (user.role === UserRole.SELLER) return res.redirect("/seller");
			if (user.role === UserRole.BUYER) return res.redirect("/buyer");

			return res.redirect("/");
		} catch (error) {
			console.log(error);

			res.render("auth/login", {
				title: "Login",
				error: "Something went wrong",
			});
		}
	}

	static registerForm(req, res) {
		res.render("auth/register", {
			title: "Register",
			error: null,
		});
	}

	static async register(req, res) {
		try {
			const { username, email, password } = req.body;

			await User.create({
				username,
				email,
				password,
				role: UserRole.BUYER,
			});
			res.redirect("/login");
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				const customError = getValidationError(error);
				console.log(customError);
				res.render("auth/register", {
					title: "Register",
					error: customError,
				});
			}
			console.log(error);
		}
	}

	static logout(req, res) {
		req.session.destroy((error) => {
			if (error) {
				console.log(error);
				return res.redirect("/");
			}

			res.redirect("/login");
		});
	}
}
module.exports = AuthController;
