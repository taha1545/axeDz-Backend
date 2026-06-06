const { sendMail } = require('./mailer');
const { getTemplateHtml } = require('./template');

const sendOtp = async (email, otp) => {
    const html = getTemplateHtml('reset-password-otp', {
        FRONT_SIDE_URL: process.env.FRONT_SIDE_URL,
        OTP: otp,
    });

    try {
        await sendMail({
            from: 'support@axedz.com',
      to: email,
      subject: 'Reset Your Password - OTP',
      html,
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

module.exports = { sendOtp };
