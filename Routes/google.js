
const express = require('express');
const router = express.Router();
const passport = require('passport');


require('@controllers/auth/google.controller');

const TokenSession = require('@app/jwt/TokenSession');
router.use(passport.initialize());


router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get(
    '/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const user = req.user;
        //
        const { accessToken, refreshToken } = TokenSession.createTokens(user);
        TokenSession.setRefreshCookie(res, refreshToken);
        //
        return res.redirect(`${process.env.FRONT_URL_CALLBACK}/callback?token=${accessToken}`);
    }
);

module.exports = router;
