"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("SellerItems", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			// sellerProfileId integer [not null]
			sellerProfileId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "SellerProfiles",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			// itemId integer [not null]
			itemId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Items",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			// serviceTitle varchar [not null, note: 'example: Pijat Refleksi 60 Menit']
			serviceTitle: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			// serviceDescription text [not null, note: 'detail service dari seller']
			serviceDescription: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			// price integer [not null, note: 'validation: required, min 10000']
			price: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			// duration integer [not null, note: 'duration in minutes, validation: required, min 30']
			duration: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			// location varchar [not null, note: 'validation: required']
			location: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			// status SellerItemStatus [not null, default: 'available']
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "available",
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
		await queryInterface.dropTable("SellerItems");
	},
};
