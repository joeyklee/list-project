const express = require('express');
const api = express.Router();
const User = require('../models/users.js');
const auth = require('../middleware/auth');
const scrub = require('../middleware/scrub');


// for emailer
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('../config');
const emailer = require('../helpers/emailer');


/**
 * POST /users
 * create a new user
 */
api.post('/register', async (req, res) => {
  try {

    const user = new User(req.body)

    await user.save();
    const token = await user.generateAuthToken();

    // Set a cookie
    res.cookie('auth_token', token, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      secure: false, // true,
      sameSite: false,
    })

    res.status(201).send({
      user,
      token
    });

  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * Allow the user to login
 * with the email and password
 */
api.post('/login', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.findByCredentials(email, password);

    if (!user) {
      return res.status(401).send({
        error: 'login failed! check your credentials'
      })
    }

    const token = await user.generateAuthToken();

    // Set a cookie
    res.cookie('auth_token', token, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      secure: false, // true,
      sameSite: false,
    })

    res.send({
      user: user,
      token
    });

  } catch (err) {
    res.status(400).send(err);
  }
})


/**
 * logout
 */
api.post('/me/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    })

    await req.user.save();
    res.send({status:'success', message:"logout complete"});
  } catch (err) {
    res.status(500).send(err);
  }
})


/**
 * logout all
 */
api.post('/me/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send({status:'success', message:"logout complete"});
  } catch (err) {
    res.status(500).send(err);
  }
})

/**
 * send back user info
 */
api.get('/me', auth, scrub, async (req, res) => {
  try{
    res.json({status:'success', ...res.locals.cleanUser});
  } catch(err){
    throw new Error(err)
  }
  
})


/**
 * forgot password 
 * data to be sent via a form
 */
api.post('/auth/forgot_password', async (req, res) => {
  try {

    const user = await User.findOne({
      "email": req.body.email
    });

    if (!user) {
      throw new Error('no user found by that email address')
    }

    const token = await crypto.randomBytes(20).toString('hex');

    // add the reset password token and expiry date
    await User.findByIdAndUpdate({
      _id: user._id
    }, {
      reset_password_token: token,
      reset_password_expires: Date.now() + 86400000
    });

    const emailData = {
      to: user.email,
      from: config.MAILER.EMAIL,
      subject: '[list project] Forgot Password Request',
      html: `
        <div>
        <h1>Password reset for list project</h1>
        <p>
          url: http://localhost:8080/reset_password?token=${token}
          name: ${user.username}
        </p>
        </div>
      `
    }

    await emailer.sendMail(emailData);

    return res.json({status:'success', message:'Kindly check your email for further instructions'})

  } catch (err) {

    throw new Error('error in password reset')

  }
})

/**
 * reset password
 */
api.post('/auth/reset_password', async (req, res) =>{
  try{

    const user = await User.findOne({
      reset_password_token: req.body.token,
      reset_password_expires: {
        $gt: Date.now()
      }
    });

    if(!user){
      throw new Error('no matching token found!')
    }

    if(req.body.newPassword === req.body.verifyPassword){
      user.password = req.body.newPassword
      user.reset_password_token = undefined;
      user.reset_password_token_expires = undefined;

      await user.save()
      // TODO: need to send this back to the user
      await user.generateAuthToken();


      const emailData = {
        to: user.email,
        from: config.MAILER.EMAIL,
        subject: '[List Project] Password Reset Confirmation',
        html:`
          <div>
            <h1>Password Reset Confirmation</h1>
            <p>You've successfully reset your password.</p>
          </div>
        `
      }

      await emailer.sendMail(emailData)

      return res.json({status:'success', message:'password reset successful!'})
    } else {
      throw new Error('passwords do not match')
    }


  } catch(err){
    throw new Error(err)
  }

})





module.exports = api;