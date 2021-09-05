const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get profile of current user
// @access  private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'No profiles for you' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or Update profile of current user
// @access  private
router.post(
  '/',
  [
    auth,
    [
      // Validator check
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Validator Result Handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubUserName,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
      } = req.body;
      // Build profile object
      const profileFields = {};
      profileFields.user = req.user.id;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (status) profileFields.status = status;
      if (bio) profileFields.bio = bio;
      if (githubUserName) profileFields.githubUserName = githubUserName;
      if (skills) {
        profileFields.skills = skills.split(',').map((skill) => skill.trim());
      }
      // Build social object
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (instagram) profileFields.social.instagram = instagram;
      //Check if current user has any profile
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update Profile
        profile = await profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: { profileFields } },
          { new: true }
        );
        return res.json(profile);
      }
      //Create Profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile from user ID
// @access  public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    delete profile, posts & user
// @access  private
router.delete('/', auth, async (req, res) => {
  try {
    //@todo remove all posts of this user

    // Remove profile of this user
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove this user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'user deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    Update experience to user profile
// @access  private
router.put(
  '/experience',
  [
    auth,
    [
      // Validator check
      check('title', 'title is required'),
      check('company', 'company is required'),
      check('from', 'from Date is required'),
    ],
  ],
  async (req, res) => {
    //Validator errors handling(if any)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Build new experience
    const { title, company,location, from, to, current, description } = req.body;
    let newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      // Update new experience
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from user profile
// @access  private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get index of the experience to remove
    const expIndex = await profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    // Remove index
    profile.experience.splice(expIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/education
// @desc    Update education to user profile
// @access  private
router.put(
    '/education',
    [
      auth,
      [
        // Validator check
        check('school', 'school is required'),
        check('degree', 'degree is required'),
        check('fieldOfStudy', 'fieldOfStudy is required'),
        check('from', 'from Date is required'),
      ],
    ],
    async (req, res) => {
      //Validator errors handling(if any)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Build new experience
      const { school, degree,fieldOfStudy, from, to, current, description } = req.body;
      let newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description,
      };
  
      try {
        // Update new experience
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
  // @route   DELETE api/profile/education/:edu_id
  // @desc    Delete education from user profile
  // @access  private
  router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // Get index of the education to remove
      const removeIndex = await profile.education
        .map((item) => item.id)
        .indexOf(req.params.edu_id);
      // Remove index
      profile.education.splice(removeIndex, 1);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

    // @route   GET api/profile/github/:username
  // @desc    Get github repos of user
  // @access  public
  router.get('/github/:username',async (req,res) => {
      try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${
                config.get('githubClientId')
            }&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: {'user-agent':'node.js'}
        };
        request(options,(error,response,body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({msg:'No github repos found'});
            }
            res.json(JSON.parse(body));
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
  });
module.exports = router;
