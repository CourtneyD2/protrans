const express = require('express');
const router = express.Router();
const {check, body, validationResult} = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require ('../../models/User')
// @route   POST   api/users
// @desc    Resgister User
// @acess   Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
],
async (req,res) => {
  const errors = validationResult(req);
  const {name, email, password} = req.body;  
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
  try{
    //checks email to see if already exisits if does, respondes with error
    let user = await User.findOne({email});
    if (user){return res.status(400).json({errors: [{msg: 'user already exists'}]})}
   
    const avatar = gravatar.url(email, {s:"200", r:"pg", d: 'mm'})
    const salt = await bcrypt.genSalt(10);

    user = new User({name, email,avatar, password});
    user.password = await bcrypt.hash(password, salt);


    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtToken'), {expiresIn: 360000}, (err, token)=> {
      if (err) throw err;
      res.json({token})
    } )

    await user.save();
    res.send('User Registered') 
  }catch (err){
    //console.error(err.message);
    try {
      res.status(500).json({msg: 'server error'})
    } catch (error) {
      
    } 
  }


});

module.exports = router;