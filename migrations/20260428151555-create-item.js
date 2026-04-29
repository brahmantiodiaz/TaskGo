"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Items", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			// name varchar [not null, unique, note: 'example: Pijat, Cleaning Service, Pet Care, Home Repair']
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			// description text [not null, note: 'validation: required']
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			// imageUrl varchar [not null, note: 'validation: required, isUrl']
			imageUrl: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			// status ItemStatus [not null, default: 'active']
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "active",
			},
			// createdById integer [not null, note: 'admin user id']
			createdById: {
				type: Sequelize.INTEGER,
				allowNull: false,
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
		await queryInterface.dropTable("Items");
	},
};
