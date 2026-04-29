const { Op } = require("sequelize");
const { User, UserProfile, SellerProfile } = require("../../models");
const { UserRole } = require("../../helpers/enums");
const { getValidationError } = require("../../helpers/helpers");

class AdminUserController {
	static async index(req, res) {
		try {
			const { search, role } = req.query;

			const options = {
				order: [["id", "ASC"]],
				include: {
					model: UserProfile,
					include: SellerProfile,
				},
				where: {},
			};

			if (search) {
				options.where[Op.or] = [
					{
						username: {
							[Op.iLike]: `%${search}%`,
						},
					},
					{
						email: {
							[Op.iLike]: `%${search}%`,
						},
					},
				];
			}

			if (role) {
				options.where.role = role;
			}

			const users = await User.findAll(options);

			res.render("admin/users/index", {
				title: "Manage Users",
				users,
				search,
				role,
				userRoles: Object.values(UserRole),
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static add(req, res) {
		res.render("admin/users/form", {
			title: "Add User",
			action: "/admin/users/add",
			detail: null,
			error: null,
			isEdit: false,
			userRoles: Object.values(UserRole),
		});
	}

	static async create(req, res) {
		try {
			const { username, email, password, role } = req.body;

			await User.create({
				username,
				email,
				password,
				role,
			});

			res.redirect("/admin/users");
		} catch (error) {
			console.log(error);

			res.render("admin/users/form", {
				title: "Add User",
				action: "/admin/users/add",
				detail: req.body,
				error: getValidationError(error),
				isEdit: false,
				userRoles: Object.values(UserRole),
			});
		}
	}

	static async detail(req, res) {
		try {
			const { id } = req.params;

			const user = await User.findByPk(id, {
				include: {
					model: UserProfile,
					include: SellerProfile,
				},
			});

			if (!user) {
				return res.redirect("/admin/users");
			}

			res.render("admin/users/detail", {
				title: "User Detail",
				user,
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async edit(req, res) {
		try {
			const { id } = req.params;

			const user = await User.findByPk(id);

			if (!user) {
				return res.redirect("/admin/users");
			}

			res.render("admin/users/form", {
				title: "Edit User",
				action: `/admin/users/${id}/edit`,
				detail: user,
				error: null,
				isEdit: true,
				userRoles: Object.values(UserRole),
			});
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	}

	static async update(req, res) {
		try {
			const { id } = req.params;
			const { username, email, password, role } = req.body;

			const payload = {
				username,
				email,
				role,
			};

			if (password) {
				payload.password = password;
			}

			await User.update(payload, {
				where: { id },
				individualHooks: true,
			});

			res.redirect("/admin/users");
		} catch (error) {
			console.log(error);

			res.render("admin/users/form", {
				title: "Edit User",
				action: `/admin/users/${req.params.id}/edit`,
				detail: {
					id: req.params.id,
					...req.body,
				},
				error: getValidationError(error),
				isEdit: true,
				userRoles: Object.values(UserRole),
			});
		}
	}

	static async delete(req, res) {
		try {
			const { id } = req.params;

			if (Number(id) === Number(req.session.user.id)) {
				return res.redirect("/admin/users");
			}

			await User.destroy({
				where: { id },
			});

			res.redirect("/admin/users");
		} catch (error) {
			console.log(error);
			res.redirect("/admin/users");
		}
	}
}

module.exports = AdminUserController;
