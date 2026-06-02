const express = require('express');
const router = express.Router();
const passport = require('passport');

const TokenSession = require('@app/jwt/TokenSession');

// load strategy
require('@controllers/auth/github.controller');

router.use(passport.initialize());

router.get(
    '/',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
    '/callback',
    passport.authenticate('github', {
        session: false,
        failureRedirect: '/login'
    }),
    (req, res) => {
        const user = req.user;
        // 
        const { accessToken, refreshToken } = TokenSession.createTokens(user);
        TokenSession.setRefreshCookie(res, refreshToken);
        // 
        return res.redirect(
            `${process.env.FRONT_URL_CALLBACK}?token=${accessToken}`
        );
    }
);

module.exports = router;