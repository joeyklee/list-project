const scrub = async (req, res, next) => {

  try{
    if(req.user){
      const cleanUser = {
        username: req.user.username,
        _id: req.user._id,
      };
      
      res.locals.cleanUser = cleanUser;
    }
    next();
  } catch(err){
    next(err);
  }


}

module.exports = scrub;