"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const hashedPassword = await bcrypt.hash("admin12345", 10);

		await queryInterface.bulkInsert(
			"Users",
			[
				{
					username: "admin",
					email: "admin@taskgo.com",
					password: hashedPassword,
					role: "admin",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete(
			"Users",
			{
				email: "admin@taskgo.com",
			},
			{},
		);
	},
};
