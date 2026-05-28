'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface) {
        const passwordHash = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD, 10);

        await queryInterface.bulkInsert('users', [
            {
                name: 'taha',
                email: process.env.ADMIN_SEED_EMAIL ,
                phone: process.env.ADMIN_SEED_PHONE,
                password: passwordHash,
                role: 'admin',
                is_verified: true,
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', {
            email: process.env.ADMIN_SEED_EMAIL,
        });
    },
};
