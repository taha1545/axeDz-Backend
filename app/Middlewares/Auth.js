
const { validateAccessToken } = require('@app/jwt/Auth');
const { AuthorizeError } = require('@errors');

const checkAuth = (req, res, next) => {

  const authHeader = req.headers.authorization;
  //
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthorizeError('Authentication token required'));
  }
  //
  const token = authHeader.split(' ')[1];
  try {
    const decoded = validateAccessToken(token);
    if (!decoded?.id) {
      throw new AuthorizeError('Invalid authentication token');
    }
    //
    req.user = { id: decoded.id, role: decoded.role || 'user' };
    //
    return next();

  } catch (err) {
    return next(new AuthorizeError(`Authentication failed: ${err.message}`));
  }
};



module.exports = {
  checkAuth
};
