
const jwt = require('jsonwebtoken');
const AuthError = require('@errors/AuthorizeError');
const AuthorizeError = require('@errors/UnauthorizedError');

const {
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_LIFETIME = '15m',
    JWT_REFRESH_LIFETIME = '30d',
} = process.env;

const ACCESS_SECRET = JWT_SECRET;
const REFRESH_SECRET = JWT_REFRESH_SECRET || JWT_SECRET;

const signToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, {
        expiresIn,
    });
};

const verifyToken = (token, secret, errorMessage) => {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        throw new AuthError(`${errorMessage || 'Invalid token'}: ${err.message}`);
    }
};

const createAccessToken = (payload) => {
    try {
        return signToken(payload, ACCESS_SECRET, JWT_LIFETIME);
    } catch (err) {
        throw new AuthError(`AUTH SIGN TOKEN ERROR: ${err.message}`);
    }
};

const createRefreshToken = (payload) => {
    try {
        return signToken(payload, REFRESH_SECRET, JWT_REFRESH_LIFETIME);
    } catch (err) {
        throw new AuthError(`AUTH SIGN REFRESH TOKEN ERROR: ${err.message}`);
    }
};

const validateAccessToken = (token) => verifyToken(token, ACCESS_SECRET, 'INVALID ACCESS TOKEN');
const validateRefreshToken = (token) => verifyToken(token, REFRESH_SECRET, 'INVALID REFRESH TOKEN');


module.exports = {
    createAccessToken,
    createRefreshToken,
    validateAccessToken,
    validateRefreshToken,
};



