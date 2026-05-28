const logger = require("@config/logger");
const db = require("@db/models");

const { NotFoundError } = require("@errors");

const SmsOtp = require("@app/sms/sms");
const OtpService = require("@app/services/OtpService");


const sendVerifySmsOtp = async (req, res) => {
    //
    const { phone } = req.body;
    const user = await db.User.findOne({ where: { phone } });
    if (!user) {
        throw new NotFoundError("No user found with this phone");
    }
    //
    const { otpCode } = await OtpService.createOtpRecord({
        db,
        userId: user.id,
        type: "verifySms",
    });
    await SmsOtp.send(phone, otpCode);
    //
    return res.status(200).json({
        success: true,
        message: "Verification OTP sent by SMS",
    });
};

const verifySmsOtp = async (req, res) => {
    const { phone, otp_code } = req.body;
    const user = await db.User.findOne({ where: { phone } });
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