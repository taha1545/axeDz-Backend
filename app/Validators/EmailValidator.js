const { body } = require('express-validator');

const sendEmailValidator = [
    body('to_email')
        .exists({ checkFalsy: true })
        .withMessage('to_email is required')
        .bail()
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must be at most 255 characters'),

    body('subject')
        .exists({ checkFalsy: true })
        .withMessage('subject is required')
        .bail()
        .trim()
        .isLength({ min: 1, max: 150 })
        .withMessage('Subject must be 1-150 characters'),

    body('body')
        .exists({ checkFalsy: true })
        .withMessage('body is required')
        .bail()
        .isString()
        .withMessage('body must be a string')
        .isLength({ min: 1, max: 50000 })
        .withMessage('body must be between 1 and 50000 characters'),

    body('body_type')
        .optional()
        .isIn(['text', 'html'])
        .withMessage('body_type must be text or html'),

    body('callback_url')
        .optional()
        .isURL()
        .withMessage('callback_url must be a valid URL'),

    body('callbackData')
        .optional()
        .isObject()
        .withMessage('callbackData must be an object'),

    body('senderName')
        .optional()
        .isString()
        .withMessage('senderName must be a string')
        .isLength({ max: 100 })
        .withMessage('senderName must be at most 100 characters'),
];

module.exports = { sendEmailValidator };