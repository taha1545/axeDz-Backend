
const bcrypt = require("bcrypt");

const logger = require("@config/logger");
const db = require("@db/models");

const { AuthorizeError, NotFoundError } = require("@errors");
const { UserResource } = require("@app/resource");

const WelcomeMail = require("@app/mail/welcome.mail");
const SmsOtp = require("@app/sms/sms");
const verifyOtp = require("@app/mail/verify.mail.js");

const OtpService = require("@app/Services/OtpService");

const Auth = require("@app/jwt/Auth");
const TokenSession = require("@app/jwt/TokenSession");


const signUp = async (req, res) => {
    //
    const t = await db.sequelize.transaction();
    try {
        //
        const { name, email, phone, password } = req.body;
        const imagePath = req.file?.key || null;
        //
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await db.User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            imagePath,
            is_verified: false,
        }, { transaction: t });
        const wallet = await db.Wallet.create({
            currency: 'DZD',
            balance: 0,
            user_id: user.id,
            is_free: true,
            free_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }, { transaction: t });
        const { otpCode } = await OtpService.createOtpRecord({
            db,
            userId: user.id,
            type: "verifySms",
            transaction: t,
        });
        //  Commit transaction
        await t.commit();
        // 
        const { accessToken, refreshToken } = TokenSession.createTokens(user);
        TokenSession.setRefreshCookie(res, refreshToken);
        // 
        WelcomeMail.sendMail(user.email).catch((err) => {
            logger.error(`WELCOME_EMAIL_FAILED userId=${user.id}`, err.message);
        });
        //
        verifyOtp.sendVerifyMail(user.email, otpCode).catch((err) => {
            logger.error(`SMS_OTP_FAILED userId=${user.id}`, err.message);
        });
        //
        return res.status(201).json({
            success: true,
            message: "User created successfully. Please verify your phone.",
            data: UserResource(user),
            accessToken,
        });

    } catch (error) {
        // 
        await t.rollback();
        logger.error("SIGNUP_FAILED", error);
        //
        return res.status(500).json({
            success: false,
            message: "Signup failed",
        });
    }
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