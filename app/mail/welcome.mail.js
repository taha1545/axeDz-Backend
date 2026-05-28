const transporter = require('./mailer');
const { getTemplateHtml } = require('./template');

const sendMail = async (email) => {
    const html = getTemplateHtml('welcome', {
        FRONT_SIDE_URL: process.env.FRONT_SIDE_URL,
    });

    try {
        await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Welcome to AxeDz',
            html,
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

module.exports = { sendMail };
