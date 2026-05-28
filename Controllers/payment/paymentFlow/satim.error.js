const { SatimError } = require('@errors');

const handleSatimError = (error) => {
  if (error?.name?.startsWith('Satim')) {
    throw new ExternalServiceError('SATIM request failed', {
      name: error.name,
      message: error.message,
      raw: error.raw || null,
      errorCode: error.errorCode || null,
    });
  }

  throw error;
};

module.exports = {
  handleSatimError,
};
