const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  const errors = [];
  error.message = err.message;
  // Log to console for dev
  console.log(err);
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ErrorResponse(err.name, 404, ['Resources not found']);
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse('DuplicateKeyError', 404, [
      'Duplicated field value entered',
    ]);
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messageArr = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(err.name, 400, messageArr);
  }
  res.status(error.statusCode || 500).json({
    errors: error.errors || [{ msg: 'Server Error' }],
  });
};
module.exports = errorHandler;
