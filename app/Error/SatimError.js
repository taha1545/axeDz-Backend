

const AppError = require('./AppError');

class SatimError extends AppError {
  constructor(message = 'Satim service error', errors = null) {
    super(message, 502, 'SATIM_ERROR', errors);
  }
}

module.exports = SatimError;
