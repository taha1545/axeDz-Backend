const amqp = require('amqplib');

const config = require('@config/rabbitmq');
const logger = require('@config/logger');

class QueuePublisher {

    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(config.url);
            this.channel = await this.connection.createChannel();
            logger.info('Connected to RabbitMQ');
        } catch (error) {
            logger.error('Failed to connect to RabbitMQ', error);
            throw error;
        }
    }

    async publish(queue, message) {
        try {
            if (!this.channel) await this.connect();
            await this.channel.assertQueue(queue, { durable: true });
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            logger.info(`Message published to queue: ${queue}`, { message });
        } catch (error) {
            logger.error(`Failed to publish message to queue: ${queue}`, error);
            throw error;
        }
    }

    async close() {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            logger.info('RabbitMQ connection closed');
        } catch (error) {
            logger.error('Error closing RabbitMQ connection', error);
        }
    }
}

module.exports = new QueuePublisher();