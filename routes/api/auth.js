const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const {check, body, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')

// @route   GET api/auth
// @desc    Test route
// @acess   Public
router.get('/', auth, async (req,res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
});

// @route   POST   api/auth
// @desc    Authenticate User
// @acess   Public
router.post('/', [
  check('email', 'please include a valid email').isEmail(),
  check('password', 'Password Required').not().isEmpty()
],
async (req,res) => {
  const errors = validationResult(req);
  const {email, password} = req.body;  
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
  try{
    //checks email to see if already exisits if does, respondes with error
    let user = await User.findOne({email});
    if (!user){return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})}
   
    const match = await bcrypt.compare(password, user.password)
    if (!match) {return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})}//using same message as failed to find user for security reasons

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtToken'), {expiresIn: 360000}, (err, token)=> {
      if (err) throw err;
      res.json({token})
    } )


    //res.send('User Authed') 
  }catch (err){
    console.error(err.message);
    res.status(500).send('server error')
  }


});

module.exports = router;