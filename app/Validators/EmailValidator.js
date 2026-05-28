const { body } = require('express-validator');
const db = require('@db/models');

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
    //
    body('subject')
        .exists({ checkFalsy: true })
        .withMessage('subject is required')
        .trim()
        .isLength({ min: 1, max: 150 })
        .withMessage('Subject must be 1–150 characters'),
    //
    body('message')
        .exists({ checkFalsy: true })
        .withMessage('message is required')
        .isLength({ min: 1, max: 5000 })
        .withMessage('Message must be 1–5000 characters')
        .trim(),
    //
    body('body_type')
        .optional()
        .isIn(['text', 'html'])
        .withMessage('body_type must be text or html'),
];

module.exports = { sendEmailValidator };