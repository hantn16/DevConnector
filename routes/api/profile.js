const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../../middleware/auth');
const {
  getMyProfile,
  getProfiles,
  getUserProfile,
  deleteProfile,
  updateExperience,
  deleteExperience,
  updateEducation,
  deleteEducation,
  getGithubRepos,
  createOrUpdateProfile,
} = require('../../controllers/profiles');

const router = express.Router();

router
  .route('/')
  .post(
    protect,
    [
      // Validator check
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'skills is required').not().isEmpty(),
    ],
    createOrUpdateProfile
  )
  .get(getProfiles)
  .delete(deleteProfile);
router.route('/me').get(protect, getMyProfile);
router.route('/user/:user_id').get(getUserProfile);
router.route('/experience').put(
  [
    protect,
    [
      // Validator check
      check('title', 'title is required'),
      check('company', 'company is required'),
      check('from', 'from Date is required'),
    ],
  ],
  updateExperience
);
router.route('/experience/:exp_id').delete(protect, deleteExperience);
router.route('/education/:edu_id').delete(protect, deleteEducation);
router.route('').put(
  [
    protect,
    [
      // Validator check
      check('school', 'school is required'),
      check('degree', 'degree is required'),
      check('fieldOfStudy', 'fieldOfStudy is required'),
      check('from', 'from Date is required'),
    ],
  ],
  updateEducation
);
router.route('/github/:username').get(getGithubRepos);

module.exports = router;
