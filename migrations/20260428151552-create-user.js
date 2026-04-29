"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			//   username varchar [note: 'optional']
			username: {
				type: Sequelize.STRING,
				unique: true,
			},
			//   email varchar [not null, unique, note: 'validation: required, unique, email format']
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			//   password varchar [not null, note: 'validation: required, min length 8']
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			//   role UserRole [not null, default: 'buyer', note: 'buyer, seller, admin']
			role: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "buyer",
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
		await queryInterface.dropTable("Users");
	},
};
