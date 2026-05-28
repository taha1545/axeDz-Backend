

const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors = null) {
    //
    super(message, 400, 'BAD_REQUEST', errors);
  }
}

module.exports = BadRequestError;
