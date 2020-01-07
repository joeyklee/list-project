const jwt = require('jsonwebtoken');
const User = require('../models/users');
const config = require('../config');

const auth = async (req, res, next) => {

  try{

    let token;

    if(req.cookies.auth_token ){
      token = req.cookies.auth_token;
    } else if(req.header('Authorization')) {
      token = req.header('Authorization').replace('Bearer ', '');  
    } else{
      throw new Error('no token given')
    }


    const data = jwt.verify(token, config.JWT_KEY)
    const user = await User.findOne({_id: data._id, 'tokens.token':token})

    if(!user){
      throw new Error({error: 'error logging in'})
    }

    req.user = user;
    req.token = token;

    next();
  } catch(err){
    res.status(401).send({ error: 'Not authorized to access this resource' })
  }
}

module.exports = auth;