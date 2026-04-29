const router = require("express").Router();

const { authorizeRoles, setLayout } = require("../middlewares/auth");
const { UserRole } = require("../helpers/enums");
const upload = require("../helpers/multer");

const BuyerDashboardController = require("../controller/buyer/dashboardController");
const BuyerProfileController = require("../controller/buyer/profileController");
const BuyerServiceController = require("../controller/buyer/serviceController");
const BuyerBookingController = require("../controller/buyer/bookingController");
const BuyerInvoiceController = require("../controller/buyer/invoiceController");
const BuyerPaymentController = require("../controller/buyer/paymentController");

router.use(authorizeRoles(UserRole.BUYER));
router.use(setLayout("layouts/buyer"));

// Dashboard
router.get("/", BuyerDashboardController.index);

// Profile
router.get("/profile", BuyerProfileController.detail);
router.get("/profile/setup", BuyerProfileController.setup);
router.post(
  "/profile/setup",
  upload.single("avatarUrl"),
  BuyerProfileController.create,
);
router.get("/profile/edit", BuyerProfileController.edit);
router.post("/profile/edit", BuyerProfileController.update);

// Explore services
router.get("/services", BuyerServiceController.index);
router.get("/services/:id", BuyerServiceController.detail);
router.get("/services/:id/book", BuyerBookingController.add);
router.post("/services/:id/book", BuyerBookingController.create);

// Bookings
router.get("/bookings", BuyerBookingController.index);
router.get("/bookings/:id", BuyerBookingController.detail);
router.post("/bookings/:id/cancel", BuyerBookingController.cancel);

// Invoices
router.get("/invoices", BuyerInvoiceController.index);
router.get("/invoices/:id", BuyerInvoiceController.detail);
router.get("/invoices/:id/pay", BuyerPaymentController.add);
router.post(
  "/invoices/:id/pay",
  upload.single("proofPaymentUrl"),
  BuyerPaymentController.create,
);

// Payments
router.get("/payments", BuyerPaymentController.index);
router.get("/payments/:id", BuyerPaymentController.detail);

module.exports = router;
