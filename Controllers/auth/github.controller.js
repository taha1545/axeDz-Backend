const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { Op } = require('sequelize');

const db = require('@db/models');
const logger = require('@config/logger');
const WelcomeMail = require('@app/mail/welcome.mail');

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                //
                const email = profile.emails?.[0]?.value || null;
                // 
                const user = await db.User.findOne({
                    where: {
                        [Op.or]: [
                            { github_id: profile.id },
                            ...(email ? [{ email }] : [])
                        ]
                    }
                });
                let finalUser = user;
                // 
                if (finalUser && !finalUser.github_id) {
                    finalUser.github_id = profile.id;
                    await finalUser.save();
                }
                // 
                if (!finalUser) {
                    finalUser = await db.User.create({
                        github_id: profile.id,
                        name: profile.displayName || profile.username,
                        email,
                        is_verified: false,
                    });
                    //
                    if (email) {
                        WelcomeMail.sendMail(email).catch((err) => {
                            logger.error(
                                `WELCOME_EMAIL_FAILED userId=${finalUser.id}`,
                                err.message
                            );
                        });
                    }
                }

                return done(null, finalUser);
            } catch (err) {
                logger.error('GITHUB_AUTH_ERROR', err);
                return done(err, null);
            }
        }
    )
);

// serialize
passport.serializeUser((user, done) => done(null, user.id));

// deserialize
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.User.findByPk(id);
        done(null, user || null);
    } catch (err) {
        logger.error('DESERIALIZE_USER_ERROR', err);
        done(err, null);
    }
});