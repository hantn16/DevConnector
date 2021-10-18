const { validationResult } = require('express-validator');
const normalize = require('normalize-url');
const gravatar = require('gravatar');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const validationResultHandler = require('../utils/validationResultHandler');

// @route   GET /api/auth/me
// @desc    Get user logged in
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// @route   POST api/auth/login
// @desc    Login user and return token
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(validationResultHandler(errors));
  }
  const { email, password } = req.body;
  //Check if email is registered
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse('AuthError', 404, ['Invalid Credentials']));
  }
  //Check if password is matched
  const isMatch = await user.matchPassword(password);
  console.log(isMatch);
  if (!isMatch) {
    return next(new ErrorResponse('AuthError', 404, ['Invalid Credentials']));
  }
  //Return token
  sendTokenResponse(user, 200, res);
});

// @route   POST api/auth/register
// @desc    Register user route
// @access  public
exports.register = asyncHandler(async (req, res, next) => {
  // Validation checks
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(validationResultHandler(errors));
  }
  // Check if email exists
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return next(
      new ErrorResponse('DuplicateKeyError', 400, ['User already exists'])
    );
  }
  // Get user's gravatar
  const avatar = normalize(
    gravatar.url(email, {
      s: 200,
      r: 'pg',
      d: 'mm',
    }),
    { forceHttps: true }
  );
  user = new User({
    name,
    email,
    password,
    avatar,
  });
  await user.save();
  // Return jsonwebtoken
  sendTokenResponse(user, 201, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const option = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    option.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, option)
    .json({ success: true, token });
};
