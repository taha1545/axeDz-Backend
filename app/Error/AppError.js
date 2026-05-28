// 
class AppError extends Error {
  constructor(message = 'Application error', statusCode = 500, name = 'AppError', errors = null) {
    super(message);
    //
    this.name = name;
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
    //
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
