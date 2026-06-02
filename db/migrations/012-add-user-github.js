"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("users", "github_id", {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("users", "github_id");
    },
};