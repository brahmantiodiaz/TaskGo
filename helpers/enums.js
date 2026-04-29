const UserRole = Object.freeze({
	BUYER: "buyer",
	SELLER: "seller",
	ADMIN: "admin",
});

const ItemStatus = Object.freeze({
	ACTIVE: "active",
	INACTIVE: "inactive",
});

const SellerItemStatus = Object.freeze({
	AVAILABLE: "available",
	UNAVAILABLE: "unavailable",
});

const BookingStatus = Object.freeze({
	PENDING: "pending",
	APPROVED: "approved",
	REJECTED: "rejected",
	ON_PROGRESS: "on_progress",
	WAITING_PAYMENT: "waiting_payment",
	WAITING_PAYMENT_CONFIRMATION: "waiting_payment_confirmation",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
});

const InvoiceStatus = Object.freeze({
	ISSUED: "issued",
	PAID: "paid",
	CANCELLED: "cancelled",
});

const PaymentMethod = Object.freeze({
	BANK_TRANSFER: "bank_transfer",
	E_WALLET: "e_wallet",
	CASH: "cash",
});

const PaymentStatus = Object.freeze({
	UNPAID: "unpaid",
	WAITING_CONFIRMATION: "waiting_confirmation",
	PAID: "paid",
	REJECTED: "rejected",
});

module.exports = {
	UserRole,
	ItemStatus,
	SellerItemStatus,
	BookingStatus,
	InvoiceStatus,
	PaymentMethod,
	PaymentStatus,
};
