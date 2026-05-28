

const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', errors = null) {
    //
    super(message, 401, 'UNAUTHORIZED_ERROR', errors);
  }
}

module.exports = UnauthorizedError;
