const { Op } = require("sequelize");
const { Item, User } = require("../../models");
const { ItemStatus } = require("../../helpers/enums");
const getValidationError = require("../../helpers/helpers");

class AdminItemController {
  static async index(req, res) {
    try {
      const { search } = req.query;

      const options = {
        order: [["id", "ASC"]],
        include: {
          model: User,
          attributes: ["id", "username", "email", "role"],
        },
      };

      if (search) {
        options.where = {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              description: {
                [Op.iLike]: `%${search}%`,
              },
            },
          ],
        };
      }

      const items = await Item.findAll(options);

      res.render("admin/items/index", {
        title: "Manage Items",
        items,
        search,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static add(req, res) {
    res.render("admin/items/form", {
      title: "Add Item",
      action: "/admin/items/add",
      detail: null,
      error: null,
      isEdit: false,
      itemStatuses: Object.values(ItemStatus),
    });
  }

  static async create(req, res) {
    try {
      const { name, description, status } = req.body;

      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      await Item.create({
        name,
        description,
        imageUrl,
        status,
        createdById: req.session.user.id,
      });

      res.redirect("/admin/items");
    } catch (error) {
      console.log(error);

      res.render("admin/items/form", {
        title: "Add Item",
        action: "/admin/items/add",
        detail: req.body,
        error: getValidationError(error),
        isEdit: false,
        itemStatuses: Object.values(ItemStatus),
      });
    }
  }

  static async detail(req, res) {
    try {
      const { id } = req.params;

      const item = await Item.findByPk(id, {
        include: {
          model: User,
          attributes: ["id", "username", "email", "role"],
        },
      });

      if (!item) {
        return res.redirect("/admin/items");
      }

      res.render("admin/items/detail", {
        title: "Item Detail",
        item,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async edit(req, res) {
    try {
      const { id } = req.params;

      const item = await Item.findByPk(id);

      if (!item) {
        return res.redirect("/admin/items");
      }

      res.render("admin/items/form", {
        title: "Edit Item",
        action: `/admin/items/${id}/edit`,
        detail: item,
        error: null,
        isEdit: true,
        itemStatuses: Object.values(ItemStatus),
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, imageUrl, status } = req.body;

      await Item.update(
        {
          name,
          description,
          imageUrl,
          status,
        },
        {
          where: { id },
          individualHooks: true,
        },
      );

      res.redirect("/admin/items");
    } catch (error) {
      console.log(error);

      res.render("admin/items/form", {
        title: "Edit Item",
        action: `/admin/items/${req.params.id}/edit`,
        detail: {
          id: req.params.id,
          ...req.body,
        },
        error: getValidationError(error),
        isEdit: true,
        itemStatuses: Object.values(ItemStatus),
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      await Item.destroy({
        where: { id },
      });

      res.redirect("/admin/items");
    } catch (error) {
      console.log(error);
      res.redirect("/admin/items");
    }
  }

  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;

      const item = await Item.findByPk(id);

      if (!item) {
        return res.redirect("/admin/items");
      }

      const newStatus =
        item.status === ItemStatus.ACTIVE
          ? ItemStatus.INACTIVE
          : ItemStatus.ACTIVE;

      await item.update({
        status: newStatus,
      });

      res.redirect("/admin/items");
    } catch (error) {
      console.log(error);
      res.redirect("/admin/items");
    }
  }
}

module.exports = AdminItemController;
