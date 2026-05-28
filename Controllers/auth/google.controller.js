
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require('@db/models');
const logger = require('@config/logger');
const WelcomeMail = require('@app/mail/welcome.mail');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            //
            let user = await db.User.findOne({ where: { google_id: profile.id } });
            //
            if (!user) {
                user = await db.User.create({
                    google_id: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                });
                //  email 
                WelcomeMail.sendMail(user.email).catch((err) => {
                    logger.error(
                        `WELCOME_EMAIL_FAILED userId=${user.id}`,
                        err.message
                    );
                });
                //
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

// 
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.User.findByPk(id);
        return done(null, user || null);
    } catch (err) {
        return done(err, null);
    }
});