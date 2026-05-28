const bcrypt = require("bcrypt");

const db = require("@db/models");

const { NotFoundError } = require("@errors");

const OtpMail = require("@app/mail/otp.mail");
const OtpService = require("@app/Services/OtpService");


const sendResetOtp = async (req, res) => {
    //
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundError("No user found with this email");
    }
    //
    const { otpCode } = await OtpService.createOtpRecord({
        db,
        userId: user.id,
        type: "resetPassword",
    });
    await OtpMail.sendOtp(user.email, otpCode);
    //
    return res.status(200).json({
        success: true,
        message: "Reset OTP has been sent to your email",
    });
};

const resetPasswordWithOtp = async (req, res) => {
    //
    const { email, otp_code, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundError("No user found with this email");
    }
    //
    const otpRecord = await OtpService.getValidOtpRecord({
        db,
        userId: user.id,
        otpCode: otp_code,
        type: "resetPassword",
    });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await OtpService.markOtpUsed(otpRecord);

    return res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
    });
};

module.exports = {
    sendResetOtp,
    resetPasswordWithOtp,
};