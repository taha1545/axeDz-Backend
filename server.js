require('module-alias/register');
require('dotenv').config();
//
const config = require('@config');
const http = require('http');

const app = require('@app');
const { initSockets } = require('@app/sockets');

const db = require('@config/db');
const logger = require('@config/logger');
const queuePublisher = require('@queues/publisher');
// 

async function startServer() {
    try {
        await db.connect();
        logger.info('Database connected');

        if (queuePublisher?.connect) {
            await queuePublisher.connect();
            logger.info('Queue connected');
        }
        const server = http.createServer(app);
        const socketServer = initSockets(server);
        logger.info('Socket server initialized');
        server.listen(config.app.port, () => {
            logger.info(`🚀 ${config.app.name} started`, {
                port: config.app.port,
                env: config.app.environment,
                apiPrefix: config.app.apiPrefix,
            });
        });

        // 
        const shutdown = async (signal) => {
            logger.info(`Received ${signal}. Shutting down...`);
            //
            server.close(async () => {
                try {
                    if (queuePublisher?.close) {
                        await queuePublisher.close();
                        logger.info('Queue disconnected');
                    }
                    //
                    await db.close();
                    logger.info('Database disconnected');
                    //
                    logger.info('Shutdown complete');
                    process.exit(0);
                } catch (err) {
                    logger.error('Shutdown error', err);
                    process.exit(1);
                }
            });
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
        //
    } catch (err) {
        logger.error('Failed to start server', err);
        process.exit(1);
    }
}

startServer();