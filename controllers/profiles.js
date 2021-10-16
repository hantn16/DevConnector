const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');
const normalize = require('normalize-url');
const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET api/profile/me
// @desc    Get profile of current user
// @access  private
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    'user',
    ['name', 'avatar']
  );
  if (!profile) {
    return next(new ErrorResponse('No profiles for you', 404));
  }
  res.status(200).json(profile);
});

// @route   POST api/profile
// @desc    Create or Update profile of current user
// @access  private
exports.createOrUpdateProfile = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    website,
    skills,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
    // spread the rest of the fields we don't need to check
    ...rest
  } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user.id,
    website:
      website && website !== '' ? normalize(website, { forceHttps: true }) : '',
    skills: Array.isArray(skills)
      ? skills
      : skills.split(',').map((skill) => ' ' + skill.trim()),
    ...rest,
  };
  // Build socialFields object
  const socialFields = { youtube, twitter, instagram, linkedin, facebook };

  // normalize social fields to ensure valid url
  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0)
      socialFields[key] = normalize(value, { forceHttps: true });
  }
  // add to profileFields
  profileFields.social = socialFields;
  // Using upsert option (creates new doc if no match is found):
  let profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: profileFields },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return res.json(profile);
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  public
exports.getProfiles = asyncHandler(async (req, res, next) => {
  const profiles = await Profile.find().populate('user', ['name', 'avatar']);
  res.json(profiles);
});

// @route   GET api/profile/user/:user_id
// @desc    Get single profile from user ID
// @access  public
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({
    user: req.params.user_id,
  }).populate('user', ['name', 'avatar']);
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }
  res.json(profile);
});

// @route   DELETE api/profile
// @desc    delete profile, posts & user
// @access  private
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  //@todo remove all posts of this user
  await Post.deleteMany({ user: req.user.id });
  // Remove profile of this user
  await Profile.findOneAndRemove({ user: req.user.id });
  // Remove this user
  await User.findOneAndRemove({ _id: req.user.id });
  res.status(200).json({ msg: 'user deleted' });
});

// @route   PUT api/profile/experience
// @desc    Update experience to user profile
// @access  private
exports.updateExperience = asyncHandler(async (req, res, next) => {
  //Validator errors handling(if any)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Build new experience
  const { title, company, location, from, to, current, description } = req.body;
  let newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };
  // Update new experience
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }
  profile.experience.unshift(newExp);
  await profile.save();
  res.json(profile);
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from user profile
// @access  private
exports.deleteExperience = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }
  // Get index of the experience to remove
  const expIndex = await profile.experience
    .map((item) => item.id)
    .indexOf(req.params.exp_id);
  // Remove index
  profile.experience.splice(expIndex, 1);
  await profile.save();
  res.json(profile);
});

// @route   PUT api/profile/education
// @desc    Update education to user profile
// @access  private
exports.updateEducation = asyncHandler(async (req, res, next) => {
  //Validator errors handling(if any)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Build new experience
  const { school, degree, fieldOfStudy, from, to, current, description } =
    req.body;
  let newEdu = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description,
  };
  // Update new experience
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }
  profile.education.unshift(newEdu);
  await profile.save();
  res.json(profile);
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from user profile
// @access  private
exports.deleteEducation = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }
  // Get index of the education to remove
  const removeIndex = await profile.education
    .map((item) => item.id)
    .indexOf(req.params.edu_id);
  // Remove index
  profile.education.splice(removeIndex, 1);
  await profile.save();
  res.json(profile);
});

// @route   GET api/profile/github/:username
// @desc    Get github repos of user
// @access  public
exports.getGithubRepos = asyncHandler(async (req, res, next) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`, //fix this
    };
    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    return next(new ErrorResponse('No Github profile found', 404));
  }
});

module.exports = router;
