
const Auth = require('./Auth');

const REFRESH_COOKIE_MAX_AGE_MS = Number(process.env.REFRESH_COOKIE_MAX_AGE_MS) || 30 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_SECURE = process.env.NODE_ENV === 'production';
const REFRESH_COOKIE_HTTP_ONLY = true;
const REFRESH_COOKIE_SAME_SITE = 'strict';

//
const createTokens = (user) => {
  const tokenPayload = { id: user?.id, role: user?.role || 'user' };
  if (!tokenPayload.id) {
    throw new Error('User ID is required to create JWT tokens');
  }
  return {
    accessToken: Auth.createAccessToken(tokenPayload),
    refreshToken: Auth.createRefreshToken(tokenPayload),
  };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: REFRESH_COOKIE_HTTP_ONLY,
    secure: REFRESH_COOKIE_SECURE,
    sameSite: REFRESH_COOKIE_SAME_SITE,
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: REFRESH_COOKIE_HTTP_ONLY,
    secure: REFRESH_COOKIE_SECURE,
    sameSite: REFRESH_COOKIE_SAME_SITE,
  });
};

module.exports = {
  createTokens,
  setRefreshCookie,
  clearRefreshCookie,
};
