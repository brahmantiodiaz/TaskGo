"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("SellerProfiles", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			// userProfileId integer [not null, unique]
			userProfileId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true,
				references: {
					model: "UserProfiles",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},

			// headline varchar [not null, note: 'example: Saya bisa membantu membersihkan rumah dengan cepat dan rapi']
			headline: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			// description text [not null, note: 'validation: required']
			description: {
				type: Sequelize.TEXT,
			},
			// experienceYear integer [note: 'validation: min 0']
			experienceYear: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			// bankName varchar [not null, note: 'validation: required']
			bankName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			// bankAccountNumber varchar [not null, note: 'validation: required']
			bankAccountNumber: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("SellerProfiles");
	},
};
