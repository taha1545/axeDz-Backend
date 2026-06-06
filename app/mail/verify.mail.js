const { sendMail } = require('./mailer');
const { getTemplateHtml } = require('./template');

const sendVerifyMail = async (email, otp) => {
    const html = getTemplateHtml('verify-otp', {
        FRONT_SIDE_URL: process.env.FRONT_SIDE_URL,
        OTP: otp,
    });

    try {
        await sendMail({
            from: 'support@axedz.com',
            to: email,
            subject: 'Verify Your Account - OTP',
            html,
        });
    } catch (error) {
        console.error('Error sending verification OTP email:', error);
        throw error;
    }
};

module.exports = { sendVerifyMail };
