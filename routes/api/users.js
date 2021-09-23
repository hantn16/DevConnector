const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalize = require('normalize-url');
const User = require('../../models/User');

// @route   POST api/users
// @desc    Users route
// @access  public
router.post(
  '/',
  body('name', 'name is required!!!').not().isEmpty(),
  body('email', 'Please include a valid email!').isEmail(),
  body('password', 'Password is at least 6 characters!').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // See if user exists
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
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
      // Encrypt password
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      // Return jsonwebtoken
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
