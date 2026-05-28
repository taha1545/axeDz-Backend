const { body, param } = require('express-validator');
const db = require('@db/models');

const createApiKeyValidation = [
    //
    body('project_name')
        .exists({ checkFalsy: true })
        .withMessage('Project name is required')
        .isString()
        .withMessage('Project name must be a string')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Project name must be 1–100 characters')
        .escape()
        .bail(),
];

module.exports = {
    createApiKeyValidation,
};