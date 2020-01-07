const Location = require('../models/post');
const isOwner = async (req, res, next) => {
  try{
    const id = req.params.id; // typeof req.params.id === String ? req.params.id : null;
    const data = await Location.findById(id);

    if(String(data.createdBy_id) === String(req.user._id)){
      next();
    } else {
      throw new Error('Sorry, you are not the owner of that resource');
    }
  } catch(err){
    res.status(401).send({ error: 'Not authorized to edit or delete this resource' })
  }
}


module.exports = isOwner;