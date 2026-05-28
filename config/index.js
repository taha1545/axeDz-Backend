require('dotenv').config();

const db = require('@config/db');
const logger = require('@config/logger');
const rabbitmq = require('@config/rabbitmq');
const s3 = require('@config/s3');
const satim = require('@config/satim');

// 
module.exports = {
    app: {
        name: process.env.APP_NAME || 'AxeDZ',
        environment: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.APP_PORT) || 3000,
        logLevel: process.env.LOG_LEVEL || 'info',
        apiPrefix: process.env.API_PREFIX || '/api',
        version: process.env.APP_VERSION || '1.0.0',
    },
    db,
    logger,
    security: {
        jwt: {
            secret: process.env.JWT_SECRET,
            lifetime: process.env.JWT_LIFETIME || '15m',
        },
        jwtRefresh: {
            secret: process.env.JWT_REFRESH_SECRET,
            lifetime: process.env.JWT_REFRESH_LIFETIME || '30d',
            cookieMaxAge: parseInt(process.env.REFRESH_COOKIE_MAX_AGE_MS) || 2592000000, // 30 days in ms
        },
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    },
    cors: {
        allowlist: (process.env.CORS_ALLOWLIST || '*').split(','),
        allowAll: process.env.CORS_ALLOW_ALL === 'true',
        credentials: process.env.CORS_CREDENTIALS === 'true',
    },
    rateLimit: {
        max: parseInt(process.env.RATE_LIMIT_MAX) || 300,
        authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 20,
    },
    bruteForce: {
        delayAfter: parseInt(process.env.BRUTE_FORCE_DELAY_AFTER) || 5,
        delayMs: parseInt(process.env.BRUTE_FORCE_DELAY_MS) || 500,
        maxDelayMs: parseInt(process.env.BRUTE_FORCE_MAX_DELAY_MS) || 5000,
    },
    session: {
        secret: process.env.SESSION_SECRET || 'your-session-secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        },
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        db: parseInt(process.env.REDIS_DB) || 0,
    },
    otp: {
        expiryMinutes: parseInt(process.env.OTP_EXP_MINUTES) || 15,
        maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS) || 3,
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT) || 465,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },

    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
        frontUrlCallback: process.env.FRONT_URL_CALLBACK || 'http://localhost:3000/',
    },
    s3,
    rabbitmq,
    satim,
};
