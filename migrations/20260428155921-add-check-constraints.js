"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addConstraint("Users", {
			fields: ["role"],
			type: "check",
			name: "Users_role_check",
			where: {
				role: ["buyer", "seller", "admin"],
			},
		});

		await queryInterface.addConstraint("Items", {
			fields: ["status"],
			type: "check",
			name: "Items_status_check",
			where: {
				status: ["active", "inactive"],
			},
		});

		await queryInterface.addConstraint("SellerItems", {
			fields: ["status"],
			type: "check",
			name: "SellerItems_status_check",
			where: {
				status: ["available", "unavailable"],
			},
		});

		await queryInterface.addConstraint("Bookings", {
			fields: ["status"],
			type: "check",
			name: "Bookings_status_check",
			where: {
				status: [
					"pending",
					"approved",
					"rejected",
					"on_progress",
					"waiting_payment",
					"waiting_payment_confirmation",
					"completed",
					"cancelled",
				],
			},
		});

		await queryInterface.addConstraint("Invoices", {
			fields: ["status"],
			type: "check",
			name: "Invoices_status_check",
			where: {
				status: ["issued", "paid", "cancelled"],
			},
		});

		await queryInterface.addConstraint("Payments", {
			fields: ["paymentMethod"],
			type: "check",
			name: "Payments_paymentMethod_check",
			where: {
				paymentMethod: ["bank_transfer", "e_wallet", "cash"],
			},
		});

		await queryInterface.addConstraint("Payments", {
			fields: ["paymentStatus"],
			type: "check",
			name: "Payments_paymentStatus_check",
			where: {
				paymentStatus: ["unpaid", "waiting_confirmation", "paid", "rejected"],
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint("Users", "Users_role_check");
		await queryInterface.removeConstraint("Items", "Items_status_check");

		await queryInterface.removeConstraint(
			"SellerItems",
			"SellerItems_status_check",
		);

		await queryInterface.removeConstraint("Bookings", "Bookings_status_check");
		await queryInterface.removeConstraint("Invoices", "Invoices_status_check");

		await queryInterface.removeConstraint(
			"Payments",
			"Payments_paymentMethod_check",
		);

		await queryInterface.removeConstraint(
			"Payments",
			"Payments_paymentStatus_check",
		);
	},
};
