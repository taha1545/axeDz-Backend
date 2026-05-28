

const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = null) {
    //
    super(message, 422, 'VALIDATION_ERROR', errors);
  }
}

module.exports = ValidationError;
