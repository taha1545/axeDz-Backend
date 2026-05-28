const crypto = require('crypto');
const { Op } = require('sequelize');

const createOtpRecord = async ({ db, userId, type, transaction }) => {
  //
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  //
  await db.UserOtp.create(
    {
      user_id: userId,
      otp_code: otpCode,
      type,
      expires_at: expiresAt,
    },
    { transaction }
  );

  return { otpCode };
};

const getValidOtpRecord = async ({ db, userId, otpCode, type }) => {
  //
  const otpRecord = await db.UserOtp.findOne({
    where: {
      user_id: userId,
      otp_code: otpCode,
      type,
      expires_at: { [Op.gt]: new Date() },
      used_at: null,
    },
  });
  //
  if (!otpRecord) {
    throw new Error('Invalid or expired OTP');
  }
  return otpRecord;
};

const markOtpUsed = async (otpRecord) => {
  //
  otpRecord.used_at = new Date();
  await otpRecord.save();
  //
};

module.exports = {
  createOtpRecord,
  getValidOtpRecord,
  markOtpUsed,
};