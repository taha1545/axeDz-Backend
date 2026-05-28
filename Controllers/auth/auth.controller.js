
const bcrypt = require("bcrypt");

const logger = require("@config/logger");
const db = require("@db/models");

const { AuthorizeError, NotFoundError } = require("@errors");
const { UserResource } = require("@app/resource");

const WelcomeMail = require("@app/mail/welcome.mail");
const SmsOtp = require("@app/sms/sms");

const OtpService = require("@app/services/OtpService");

const Auth = require("@app/jwt/Auth");
const TokenSession = require("@app/jwt/TokenSession");


const signUp = async (req, res) => {
    //
    const { name, email, phone, password } = req.body;
    const imagePath = req.file?.key || null;
    //
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await db.User.create({
        name,
        email,
        phone: phone,
        password: hashedPassword,
        imagePath,
        is_verified: false,
    });
    const wallet = await db.Wallet.create({
        currency: 'DZD',
        balance: 0,
        user_id: user.id,
        is_free: true,
        free_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    //
    const { otpCode } = await OtpService.createOtpRecord({
        db,
        userId: user.id,
        type: "verifySms",
    });
    //
    const { accessToken, refreshToken } = TokenSession.createTokens(user);
    TokenSession.setRefreshCookie(res, refreshToken);
    //  email 
    WelcomeMail.sendMail(user.email).catch((err) => {
        logger.error(
            `WELCOME_EMAIL_FAILED userId=${user.id}`,
            err.message
        );
    });
    //  SMS 
    SmsOtp.send(phone, otpCode).catch((err) => {
        logger.error(
            `SMS_OTP_FAILED userId=${user.id}`,
            err.message
        );
    });
    //
    return res.status(201).json({
        success: true,
        message: "User created successfully. Please verify your phone if provided.",
        data: UserResource(user),
        accessToken,
    });
};

const login = async (req, res) => {
    //
    const { identifier, password } = req.body;
    const user = await db.User.findOne({
        where: {
            [db.Sequelize.Op.or]: [
                { email: identifier },
                { phone: identifier }
            ]
        }
    });
    if (!user) {
        throw new NotFoundError("User not found with this email or phone");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AuthorizeError("Invalid password");
    }
    //
    const { accessToken, refreshToken } = TokenSession.createTokens(user);
    TokenSession.setRefreshCookie(res, refreshToken);
    //
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: UserResource(user),
        accessToken,
    });
};

const refreshAccessToken = async (req, res) => {
    //
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
        throw new AuthorizeError("Refresh token is required");
    }
    //
    const decoded = Auth.validateRefreshToken(refreshToken);
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    //
    const tokens = TokenSession.createTokens(user);
    TokenSession.setRefreshCookie(res, tokens.refreshToken);
    //
    return res.status(200).json({
        success: true,
        message: "Access token refreshed",
        user: UserResource(user),
        accessToken: tokens.accessToken,
    });
};

const logout = async (req, res) => {
    //
    TokenSession.clearRefreshCookie(res);
    //
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

module.exports = {
    signUp,
    login,
    refreshAccessToken,
    logout,
};