const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const normalize = require('normalize-url');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const validationResultHandler = require('../utils/validationResultHandler');

module.exports = router;
