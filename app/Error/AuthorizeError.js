//
const AppError = require('./AppError');
//
class AuthorizeError extends AppError {
  constructor(message = 'Authorization failed') {
    super(message, 403, 'AUTHORIZE_ERROR');
  }

}

module.exports = AuthorizeError;