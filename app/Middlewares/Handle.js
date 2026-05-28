
const fs = require('fs');
const logger = require('@config/logger');

function errorHandler(err, req, res, next) {
    //
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    //
    logger.error(`${err.name}: ${message} - ${req.method} ${req.originalUrl} - ${err.stack || ''}`);
    //
    if (err.code === 'INVALID_FILE_TYPE' || err.code === 'LIMIT_FILE_SIZE') {
        const fileMessage = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message;
        return res.status(400).json({
            success: false,
            message: fileMessage,
        });
    }
    //
    if (err.errors && Array.isArray(err.errors)) {
        return res.status(400).json({
            success: false,
            message: message,
            errors: err.errors,
        });
    }
    //
    res.status(statusCode).json({
        success: false,
        message,
    });
}

module.exports = errorHandler;


