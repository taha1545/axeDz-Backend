const Redis = require('ioredis');
const logger = require('./logger');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
});

redis.on('connect', () => {
    logger.info('Connected to Redis');
});

redis.on('error', (err) => {
    logger.error('Redis error:', err);
});

module.exports = redis;