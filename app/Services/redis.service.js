const redis = require('@config/redis');

class RedisService {

    async get(key) {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key, value, ttl = 60) {
        return redis.set(key, JSON.stringify(value), 'EX', ttl);
    }

    async del(key) {
        return redis.del(key);
    }

    async incr(key, ttl = 60) {
        const value = await redis.incr(key);
        if (value === 1) {
            await redis.expire(key, ttl);
        }
        return value;
    }

    async getRaw(key) {
        return redis.get(key);
    }
}

module.exports = new RedisService();