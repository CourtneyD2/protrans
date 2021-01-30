const express = require('express');
const router = express.Router();
const {check, body, validationResult} = require('express-validator')
const axios = require('axios')
const config = require('config')
const auth = require('../../middleware/auth')
const Profile = require ('../../models/Profile');
const User = require ("../../models/User")
const Post = require ("../../models/Posts")

// @route   GET api/profile/me
// @desc    get current user profile
// @acess   Private
router.get('/me', auth,  async (req,res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id }).populate('user', ['name', 'avatar']);
    if(!profile){ return res.status(400).json({msg: 'No profile Found'})};
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error")
  }
});

// @route   POST api/profile/
// @desc    create current user profile
// @acess   Private
router.post ('/',[auth, [
  check('status', 'status is required').not().isEmpty(),
  check ('skills', 'Skills is required').not().isEmpty(),   
  ]],
  async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){return res.status(400).json({errors: errors.array()});};  
    
    const {company, website, location, bio, 
    status, githubusername,skills,youtube,
    facebook, twitter, instagram, linkedin, pronouns} = req.body;

    const profileFields = {};
    //fields certain to be there
    profileFields.user = req.user.id;
    profileFields.status = status;
    profileFields.skills = skills.split(',').map(skill => skill.trim()); //takes comma seprated lists and turns into an array, trimming white space

    if (company) profileFields.company = company;
    if (pronouns) profileFields.pronouns = pronouns;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;    
    if (githubusername) profileFields.githubusername = githubusername;

    profileFields.social ={};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({user: req.user.id});
      if(profile){
        profile = await Profile.findOneAndUpdate({user:req.user.id},{$set: profileFields}, {new:true})        
      }
      else {
        profile = new Profile(profileFields);
        await profile.save();
      }
      return res.json(profile);
    } catch (error) {
      try {
        console.error(error.message);
        res.status(500).send('Server Error')  
      } catch (error) {
        
      }
    
    }
});

// @route   GET api/profile/
// @desc    get all profiles
// @acess   Public

router.get ('/', async (req,res)=> {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error')
  }
});

// @route   GET api/profile/user/:user_id
// @desc    get profile by user id
// @acess   Public

router.get ('/user/:user_id', async (req,res)=> {
  try {
    const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
    if(!profile) return res.status(400).json({msg: "Profile not Found"});
    res.json(profile);

  } catch (error) {
    console.error(error.message);
    if(error.kind == 'ObjectId'){res.status(400).json({msg: "Profile not Found"})}
    res.status(500).send('Server Error')
  }
});

// @route   DELETE api/profile/
// @desc    Delete profile, user, post
// @acess   Private

router.delete ('/', auth,  async (req,res)=> {
  try {
    await Post.deleteMany({user: req.user.id})
    await Profile.findOneAndRemove({user: req.user.id});
    await User.findOneAndRemove({_id: req.user.id});
    res.json({msg: "user Deleted"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error')
  }
});


// @route   PUT api/profile/
// @desc    add profile experiance
// @acess   Private
router.put('/experiance', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty(),
]], async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  const {title, company, location, from, to, current, description} = req.body;
  const newExp = {
    title, company, location, from, to, current, description}
  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.experiance.unshift(newExp);
    await profile.save();
    res.json(profile)
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");

  }  

  }
);

// @route   DELETE api/profile/experiance/:exp_id
// @desc    delete a profile experiance
// @acess   Private

router.delete('/experience/:exp_id', auth , async (req,res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.experiance.map(item => item.id).indexOf(req.params.exp_id);

    profile.experiance.splice(removeIndex,1);
    await profile.save();

    res.json(profile)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/
// @desc    add profile education
// @acess   Private
router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'degree is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty(),
  check('fieldofstudy', 'field of study is required').not().isEmpty(),
]], async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  const {school, degree, fieldofstudy, from, to, current, description} = req.body;
  const newEdu = {
    school, degree, fieldofstudy, from, to, current, description}
  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.education.unshift(newEdu);
    await profile.save();
    res.json(profile)
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");

  }  

  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    delete a profile education
// @acess   Private

router.delete('/education/:edu_id', auth , async (req,res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    profile.education.splice(removeIndex,1);
    await profile.save();

    res.json(profile)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/
// @desc    add profile education
// @acess   Private
router.put('/games', [auth, [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'description is required').not().isEmpty(),
  check('genre', 'genre is required').not().isEmpty(),  
]], async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  const {name, thumbnail, rating, description, genre, tags} = req.body;
  const newGame = {
    name, thumbnail, rating, description, genre, tags}
  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.games.unshift(newGame);
    await profile.save();
    res.json(profile)
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");

  }  

  }
);

// @route   DELETE api/profile/games/:game_id
// @desc    delete a profile education
// @acess   Private

router.delete('/games/:game_id', auth , async (req,res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.games.map(item => item.id).indexOf(req.params.edu_id);

    profile.games.splice(removeIndex,1);
    await profile.save();

    res.json(profile)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/stuckin
// @desc    delete a profile education
// @acess   Private

// router.put('/stuckin', [auth, [
//   check('world', 'world is required').not().isEmpty(),
//   check('name', 'name is required').not().isEmpty(),
// ]], async (req,res) => {
//   const errors = validationResult(req);
//   if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

//   const {world, timePeriod, worldTypeGame, name, avatar, profession, heroType, descritpion, storyBeats } = req.body;
//   const newStuck = {
//     world, timePeriod, worldTypeGame, name, avatar, profession, heroType, descritpion, storyBeats}
//   try {
//     const profile = await Profile.findOne({user: req.user.id});
//     profile.stuckIn[0] = newStuck;
//     await profile.save();
//     res.json(profile)
    
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }  
//   }
// );

// @route   DELETE api/profile/games/:game_id
// @desc    delete a profile education
// @acess   Private

// router.delete('/stuckin/:stuckin_id', auth , async (req,res) => {
//   try {
//     const profile = await Profile.findOne({user: req.user.id});
    
//     profile.stuckIn.splice(0,1);
//     await profile.save();

//     res.json(profile)

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route   GET api/profile/github/:username
// @desc    delete a profile education
// @acess   Public

router.get ('/github/:username', async (req, res) => {
  try {
  const uri = encodeURI(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client`);
  const headers = {
    'user-agent': 'node.js',
    Authorization: `token ${config.get('githubToken')}`
  };

  const gitHubResponse = await axios.get(uri, { headers });
   return res.json(gitHubResponse.data);
  
  } catch (error) {
    console.error(error.message);
    res.status(404).json({msg: "No githubprofile found"});
  }
})




module.exports = router;