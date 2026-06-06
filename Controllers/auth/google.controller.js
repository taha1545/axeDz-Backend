const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Op } = require('sequelize');

const db = require('@db/models');
const logger = require('@config/logger');
const WelcomeMail = require('@app/mail/welcome.mail');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                //
                const email = profile.emails?.[0]?.value || null;
                // 
                const user = await db.User.findOne({
                    where: {
                        [Op.or]: [
                            { google_id: profile.id },
                            ...(email ? [{ email }] : [])
                        ]
                    }
                });
                let finalUser = user;
                // 
                if (finalUser && !finalUser.google_id) {
                    finalUser.google_id = profile.id;
                    await finalUser.save();
                }
                // 
                if (!finalUser) {
                    finalUser = await db.User.create({
                        google_id: profile.id,
                        name: profile.displayName,
                        email,
                        is_verified: true,
                    });
                    const wallet = await db.Wallet.create({
                        currency: 'DZD',
                        balance: 0,
                        user_id: finalUser.id,
                        is_free: true,
                        free_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    });
                    // Send welcome email (non-blocking)
                    if (email) {
                        WelcomeMail.sendMail(email).catch((err) => {
                            logger.error(
                                `WELCOME_EMAIL_FAILED userId=${finalUser.id}`,
                                err.message
                            );
                        });
                    }
                }
                //
                return done(null, finalUser);
                //
            } catch (err) {
                logger.error('GOOGLE_AUTH_ERROR', err);
                return done(err, null);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.User.findByPk(id);
        done(null, user || null);
    } catch (err) {
        logger.error('DESERIALIZE_USER_ERROR', err);
        done(err, null);
    }
});