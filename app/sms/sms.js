

module.exports = {
  async send(phone, otp) {
    console.log(`SMS OTP to ${phone}: ${otp}`);
    return true;
  },
};
