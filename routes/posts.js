const express = require('express');
const api = express.Router();
const db = require('../models/post');

/** 
* TODO: Authentication middleware - We will defined these later and then uncomment them!!! Just note that we will come back to these one our authentication has been set up and defined.
**/
const auth = require('../middleware/auth');
const isOwner = require('../middleware/isOwner');

// --- Does not require authentication ---
// GET
api.get('/', async(req, res, next) => {
  try{
    const data = await db.find();
    res.json(data);
  } catch(err){
    next(err);
  }
});

// GET:id
api.get('/:id', async(req, res, next) => {
  try{
    const id = req.params.id;
    const data = await db.findById(id);
    res.json(data);
  } catch(err){
    next(err);
  }
});

// --- Requires authentication ---
// POST
api.post('/', auth, async (req, res, next) => {
try {
    const formattedData = {
      ...req.body,
      createdBy_username: req.user.username,
      createdBy_id: req.user._id,
    }

    const newData = await db.create(formattedData)
    res.json(newData);
  } catch (err) {
    next(err)
  }
})

// PUT
api.put('/:id', auth, isOwner, async (req, res, next) => {
  try {
    
    const id = req.params.id;
    const updateCmd = {
      $set: req.body
    };

    const updatedData = await db.findByIdAndUpdate({_id:id}, updateCmd, {new:true});
    res.json({data:updatedData, status:'success'});
  } catch (err) {
    next(err);
  }
})


// DELETE
api.delete('/:id', auth, isOwner, async (req, res, next) => {
  try {
    const id = req.params.id;

    await db.findByIdAndRemove({_id:id});
    
    res.json({
      status:'success',
      id:id,
      message: 'successfully deleted feature'
    });

  } catch (error) {
    next(err);
  }
})

module.exports = api;