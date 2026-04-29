"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Payments", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			//  invoiceId integer [not null, unique]
			invoiceId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true,
			},
			// amount integer [not null, note: 'validation: required, min 10000']
			amount: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			// paymentMethod PaymentMethod [not null, default: 'cash']
			paymentMethod: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "cash",
			},
			// paymentStatus PaymentStatus [not null, default: 'unpaid']
			paymentStatus: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "unpaid",
			},

			// proofPaymentUrl varchar [note: 'upload bukti pembayaran, validation: isUrl']
			proofPaymentUrl: {
				type: Sequelize.STRING,
			},
			// paidAt datetime
			paidAt: {
				type: Sequelize.DATE,
			},
			// confirmedAt datetime
			confirmedAt: {
				type: Sequelize.DATE,
			},
			// confirmedBySellerProfileId integer [note: 'seller who confirms the payment']
			confirmedBySellerProfileId: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable("Payments");
	},
};
