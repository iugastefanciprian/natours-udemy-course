const AppError = require('../utils/appError');

const handleErrorDB = (err) => {
  return new AppError(err.message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log back in!', 401);

const handleJWTExpiredError = () =>
  new AppError('Token expired. Please log back in!', 401);

const sendErrorDev = (err, req, res) => {
  // A) APIerrors
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode || 500).json({
      statusCode: err.statusCode || 500,
      status: err.status || 'failed',
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) Rendered webiste data
  console.error(err);

  return res.status(err.statusCode || 500).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        status: err.status || 'failed',
        message: err.message,
      });
      // Programming or other unknown error: don't leak error details
    }
    // 1) Log the error
    console.error(err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
    // Programming or other unknown error: don't leak error details
  }
  // 1) Log the error
  console.error(err);

  // 2) Send generic message
  return res.status(err.statusCode || 500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };
    if (error.name === 'Error') error = handleErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
};
