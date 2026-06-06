const { sendMail: sendEmail } = require('./mailer');
const { getTemplateHtml } = require('./template');

const sendMail = async (email) => {
    const html = getTemplateHtml('welcome', {
        FRONT_SIDE_URL: process.env.FRONT_SIDE_URL,
    });

    try {
        await sendEmail({
            from: 'support@axedz.com',
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

