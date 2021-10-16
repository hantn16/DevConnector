const express = require('express');

const { body, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { protect } = require('../../middleware/auth');
const User = require('../../models/User');

const { login, getMe, register } = require('../../controllers/auth');

const router = express.Router();
router.route('/').get(protect, getMe);
router
  .route('/login')
  .post(
    [
      check('email', 'Please include valid email').isEmail(),
      check('password', 'Password is required').not().isEmpty(),
    ],
    login
  );
router
  .route('/register')
  .post(
    [
      check('name', 'name is required!!!').not().isEmpty(),
      check('email', 'Please include a valid email!').isEmail(),
      check('password', 'Password is at least 6 characters!').isLength({
        min: 6,
      }),
    ],
    register
  );
// // @route   GET api/auth
// // @desc    Auth route
// // @access  public
// router.get('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });

// // @route   POST api/auth
// // @desc    Authenticate user and return token
// // @access  public
// router.post(
//   '/',
//   body('email', 'Please include valid email').isEmail(),
//   body('password', 'Password is required').not().isEmpty(),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//       const { email, password } = req.body;
//       //Check if email is registered
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Credentials' }] });
//       }
//       //Check if password is matched
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Credentials' }] });
//       }
//       //Return token
//       const payload = { user: { id: user.id } };
//       jwt.sign(
//         payload,
//         config.get('jwtSecret'),
//         { expiresIn: 360000 },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         }
//       );
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

module.exports = router;
