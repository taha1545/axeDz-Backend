

const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    //
    super(message, 404, 'NOTFOUND_ERROR');
  }
}

module.exports = NotFoundError;