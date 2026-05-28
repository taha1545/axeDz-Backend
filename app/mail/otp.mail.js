const transporter = require('./mailer');
const { getTemplateHtml } = require('./template');

const sendOtp = async (email, otp) => {
  const html = getTemplateHtml('reset-password-otp', {
    FRONT_SIDE_URL: process.env.FRONT_SIDE_URL,
    OTP: otp,
  });

  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.MAIL_USER}>`,
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
