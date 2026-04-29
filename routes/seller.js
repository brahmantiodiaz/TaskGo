const router = require("express").Router();

const { authorizeRoles, setLayout } = require("../middlewares/auth");
const { UserRole } = require("../helpers/enums");
const upload = require("../helpers/multer");

const SellerDashboardController = require("../controller/seller/dashboardController");
const SellerProfileController = require("../controller/seller/profileController");
const SellerServiceController = require("../controller/seller/serviceController");
const SellerBookingController = require("../controller/seller/bookingController");
const SellerInvoiceController = require("../controller/seller/invoiceController");
const SellerPaymentController = require("../controller/seller/paymentController");

router.use(authorizeRoles(UserRole.SELLER));
router.use(setLayout("layouts/seller"));

// Dashboard
router.get("/", SellerDashboardController.index);

// Profile
router.get("/profile", SellerProfileController.detail);
router.get("/profile/setup", SellerProfileController.setup);
router.post(
  "/profile/setup",
  upload.single("avatarUrl"),
  SellerProfileController.create,
);
router.get("/profile/edit", SellerProfileController.edit);
router.post(
  "/profile/edit",
  upload.single("avatarUrl"),
  SellerProfileController.update,
);

// Services
router.get("/services", SellerServiceController.index);
router.get("/services/add", SellerServiceController.add);
router.post("/services/add", SellerServiceController.create);
router.get("/services/:id", SellerServiceController.detail);
router.get("/services/:id/edit", SellerServiceController.edit);
router.post("/services/:id/edit", SellerServiceController.update);
router.get("/services/:id/delete", SellerServiceController.delete);
router.get("/services/:id/status", SellerServiceController.toggleStatus);

// Bookings
router.get("/bookings", SellerBookingController.index);
router.get("/bookings/:id", SellerBookingController.detail);
router.post("/bookings/:id/approve", SellerBookingController.approve);
router.post("/bookings/:id/reject", SellerBookingController.reject);
router.post("/bookings/:id/complete", SellerBookingController.complete);
router.post(
  "/bookings/:id/create-invoice",
  SellerBookingController.createInvoice,
);

// Invoices
router.get("/invoices", SellerInvoiceController.index);
router.get("/invoices/:id", SellerInvoiceController.detail);

// Payments
router.get("/payments", SellerPaymentController.index);
router.get("/payments/:id", SellerPaymentController.detail);
router.post("/payments/:id/confirm", SellerPaymentController.confirm);
router.post("/payments/:id/reject", SellerPaymentController.reject);

module.exports = router;
