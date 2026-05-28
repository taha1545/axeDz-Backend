const nodemailer = require('nodemailer');

const {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD,
} = process.env;

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: true,
    auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
    },
});

module.exports = transporter;