"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Invoices", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			// invoiceNumber varchar [not null, unique, note: 'generated after seller marks work as done']
			invoiceNumber: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			// bookingId integer [not null, unique]
			bookingId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true,
				references: {
					model: "Bookings",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			// amount integer [not null, note: 'taken from SellerItems.price']
			amount: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			// status InvoiceStatus [not null, default: 'issued']
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "issued",
			},
			// issuedAt datetime [not null]
			issuedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			// dueDate datetime
			dueDate: {
				type: Sequelize.DATE,
			},
			// issuedBySellerProfileId integer [not null, note: 'seller who confirms the work is done']
			issuedBySellerProfileId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "SellerProfiles",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Invoices");
	},
};
