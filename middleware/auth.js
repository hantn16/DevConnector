const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
  let token;
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return next(
      new ErrorResponse('AuthorizeError', 401, [
        'Not authorized to access this route',
      ])
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    return next();
  } catch (err) {
    return next(
      new ErrorResponse('AuthorizeError', 401, [
        'Not authorized to access this route',
      ])
    );
  }
};
