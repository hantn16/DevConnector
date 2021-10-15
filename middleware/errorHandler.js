const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  const errors = [];
  error.message = err.message;
  // Log to console for dev
  console.log(err);
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resources not found`;
    errors.push(new ErrorResponse(message, 404));
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicated field value entered';
    errors.push(new ErrorResponse(message, 404));
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map(
      (val) => new ErrorResponse(val.message, 400)
    );
    errors.push(validationErrors);
  }
  if (errors.length === 0) {
    return res.status(500).send('Server Error');
  }
  res.status(errors[0].statusCode).json({ errors });
};
module.exports = errorHandler;
