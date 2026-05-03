const logger = require('../../../utils/logger');

/**
 * Global error handling middleware.
 * All errors flow here — both AppError (operational) and unexpected errors.
 */
const errorHandler = (err, req, res, _next) => {
  /* Multer file size error */
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds the 50 MB limit.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational) {
    logger.error(`Unexpected error: ${err.stack || err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
