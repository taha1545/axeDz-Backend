const { body } = require('express-validator');
const db = require('@db/models');

const loginValidation = [
    body('identifier')
        .notEmpty().withMessage('Email or phone is required')
        .custom(async (identifier) => {
            const existingUser = await db.User.findOne({
                where: {
                    [db.Sequelize.Op.or]: [
                        { email: identifier },
                        { phone: identifier }
                    ]
                }
            });
            if (!existingUser) {
                throw new Error('User not found with this email or phone');
            }
        }),
    body('password').notEmpty().withMessage('Password is required'),
];

const signupValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone')
        .optional()
        .isString()
        .withMessage('Phone must be a string')
        .bail()
        .custom(async (phone) => {
            if (!phone) return;
            const existingUser = await db.User.findOne({ where: { phone } });
            if (existingUser) {
                throw new Error('Phone is already in use');
            }
        }),
    //
    body('email')
        .isEmail().withMessage('Valid email is required')
        .custom(async (email) => {
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Email is already in use');
            }
        }),
    //
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];


const updateUserValidation = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty'),
    //
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email address')
        .custom(async (email, { req }) => {
            //
            const userId = req.user?.id;
            //
            const existingUser = await db.User.findOne({ where: { email } });
            //
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Email is already in use');
            }
        }),
    body('phone')
        .optional()
        .isString()
        .withMessage('Phone must be a string')
        .custom(async (phone, { req }) => {
            //
            const userId = req.user?.id;
            //
            const existingUser = await db.User.findOne({ where: { phone } });
            //
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Phone is already in use');
            }
        }),
];


module.exports = {
    loginValidation,
    signupValidation,
    updateUserValidation,
};
