const axios = require("axios");
const logger = require("@config/logger");

module.exports = {
  async send(phone, otp) {
    try {
      //
      const url = `https://www.wasenderapi.com/api/send-message`;
      //
      const response = await axios.post(
        url,
        {
          to: phone,
          text: `AxeDz OTP: ${otp} , Expires in 10 min. Do not share it.`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      logger.error("[AxeDz WhatsApp] Failed to send OTP", {
        phone,
        error: err.response?.data || err.message,
      });
      return {
        success: false,
        error: err.response?.data || err.message,
      };
    }
  },
};