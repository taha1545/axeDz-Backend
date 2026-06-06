const logger = require("@config/logger");
const db = require("@db/models");

const { NotFoundError } = require("@errors");

const SmsOtp = require("@app/sms/sms");
const OtpService = require("@app/Services/OtpService");

const verifyOtp = require("@app/mail/verify.mail.js");

const sendVerifySmsOtp = async (req, res) => {
    //
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundError("No user found with this phone");
    }
    //
    const { otpCode } = await OtpService.createOtpRecord({
        db,
        userId: user.id,
        type: "verifySms",
    });
    verifyOtp.sendVerifyMail(user.email, otpCode).catch((err) => {
        logger.error(`SMS_OTP_FAILED userId=${user.id}`, err.message);
    });
    //
    return res.status(200).json({
        success: true,
        message: "Verification OTP sent by SMS",
    });
};

const verifySmsOtp = async (req, res) => {
    const { email, otp_code } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundError("No user found with this phone");
    }
    //
    const otpRecord = await OtpService.getValidOtpRecord({
        db,
        userId: user.id,
        otpCode: otp_code,
        type: "verifySms",
    });
    //
    user.is_verified = true;
    await user.save();
    await OtpService.markOtpUsed(otpRecord);
    //
    return res.status(200).json({
        success: true,
        message: "User verified successfully with SMS OTP",
    });
};

module.exports = {
    sendVerifySmsOtp,
    verifySmsOtp,
};