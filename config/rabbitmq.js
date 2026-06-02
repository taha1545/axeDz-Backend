require('dotenv').config();

const url = process.env.RABBITMQ_URL;

module.exports = {
    url,

    queues: {
        sms: 'sms_queue',
        email: 'email_queue',
    },

    options: {
        heartbeat: 30,

        // prevents overwhelming consumers
        prefetch: 10,

        // reconnection strategy
        reconnectInterval: 5000,

        // safer TLS detection
        ssl: url ? url.startsWith('amqps://') : false,
    }
};