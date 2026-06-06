const { body } = require('express-validator');

const sendSmsValidator = [
    body('to_number')
        .isArray({ min: 1 })
        .withMessage('to_number must be a non-empty array'),

    body('to_number.*')
        .trim()
        .matches(/^\+213\d{9}$/)
        .withMessage('Each phone number must be a valid Algerian number starting with +213'),

    body('message')
        .exists({ checkFalsy: true })
        .withMessage('message is required')
        .bail()
        .trim()
        .isLength({ min: 1, max: 160 })
        .withMessage('Message must be between 1 and 160 characters'),

    body('callback_url')
        .optional()
        .isURL()
        .withMessage('callback_url must be a valid URL'),

    body('callback_data')
        .optional()
        .isObject()
        .withMessage('callback_data must be an object'),

    body('senderName')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('senderName must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('senderName can only contain letters, numbers, underscores and hyphens'),
];

module.exports = { sendSmsValidator };