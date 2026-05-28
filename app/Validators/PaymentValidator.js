const { body, query } = require('express-validator');
const db = require('@db/models');


const initiatePaymentValidator = [
    body('amount')
        .exists({ checkFalsy: true })
        .withMessage('amount is required')
        .isFloat({ min: 0.01 })
        .withMessage('amount must be greater than 0'),
    body('currency')
        .exists({ checkFalsy: true })
        .withMessage('currency is required')
        .isString()
        .withMessage('currency must be a string')
        .isLength({ min: 3, max: 10 })
        .withMessage('currency must be 3–10 characters')
        .trim()
        .toUpperCase(),
];


const syncPaymentStatusValidator = [
    body('status')
        .exists({ checkFalsy: true })
        .withMessage('status is required')
        .isIn(['pending', 'success', 'failed'])
        .withMessage('status must be pending, success, or failed'),
];


module.exports = {
    initiatePaymentValidator,
    syncPaymentStatusValidator,
};