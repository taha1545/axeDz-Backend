const { body } = require('express-validator');
const db = require('@db/models');

const sendSmsValidator = [
    body('to_number')
        .exists({ checkFalsy: true })
        .withMessage('to_number is required')
        .bail()
        .trim()
        .isMobilePhone('any')
        .withMessage('Invalid phone number')
        .isLength({ min: 8, max: 20 })
        .withMessage('Phone number must be between 8 and 20 characters'),
    body('message')
        .exists({ checkFalsy: true })
        .withMessage('message is required')
        .bail()
        .trim()
        .isLength({ min: 1, max: 160 })
        .withMessage('Message must be between 1 and 160 characters'),
];

module.exports = { sendSmsValidator };