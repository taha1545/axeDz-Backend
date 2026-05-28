const { Sequelize } = require('sequelize');
const logger = require('@config/logger');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',

        logging: (msg) => logger.debug(msg),

        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// database connection
async function connect() {
    try {
        await sequelize.authenticate();
        logger.info('Database connected successfully');
    } catch (err) {
        logger.error('Database connection failed', err);
        throw err;
    }
}
async function close() {
    await sequelize.close();
    logger.info('Database connection closed');
}


module.exports = {
    sequelize,
    connect,
    close,
};