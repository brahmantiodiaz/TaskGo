const router = require("express").Router();

const { authorizeRoles, setLayout } = require("../middlewares/auth");
const { UserRole } = require("../helpers/enums");

const AdminDashboardController = require("../controller/admin/dashboard");
const AdminItemController = require("../controller/admin/items");
const AdminUserController = require("../controller/admin/user");
const AdminInvoiceController = require("../controller/admin/invoice");

router.use(authorizeRoles(UserRole.ADMIN));
router.use(setLayout("layouts/admin"));

// Dashboard
router.get("/", AdminDashboardController.index);

// Items CRUD
router.get("/items", AdminItemController.index);
router.get("/items/add", AdminItemController.add);
router.post("/items/add", AdminItemController.create);
router.get("/items/:id", AdminItemController.detail);
router.get("/items/:id/edit", AdminItemController.edit);
router.post("/items/:id/edit", AdminItemController.update);
router.get("/items/:id/delete", AdminItemController.delete);
router.get("/items/:id/status", AdminItemController.toggleStatus);

// // Users CRUD
router.get("/users", AdminUserController.index);
router.get("/users/add", AdminUserController.add);
router.post("/users/add", AdminUserController.create);
router.get("/users/:id", AdminUserController.detail);
router.get("/users/:id/edit", AdminUserController.edit);
router.post("/users/:id/edit", AdminUserController.update);
router.get("/users/:id/delete", AdminUserController.delete);

// // Invoices
router.get("/invoices", AdminInvoiceController.index);
router.get("/invoices/:id", AdminInvoiceController.detail);

module.exports = router;
