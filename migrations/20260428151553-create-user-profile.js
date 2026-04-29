"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("UserProfiles", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			// userId integer [not null, unique]
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			// fullName varchar [not null, note: 'validation: required']

			fullName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			// phoneNumber varchar [not null, note: 'validation: required']

			phoneNumber: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			// address text
			address: {
				type: Sequelize.TEXT,
			},
			// avatarUrl varchar [note: 'validation: isUrl']
			avatarUrl: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("UserProfiles");
	},
};
