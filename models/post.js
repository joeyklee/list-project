const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
  "link": {
    type: String,
    required: false
  },
  "title":{
    type: String,
    required: false,
    default:"Fresh link"
  },
  "description":{
    type: String,
    required: false,
    default: "Fresh link description"
  },
  "createdBy_username": {
    type: String,
    required: false // TODO: change to true!
  },
  "createdBy_id": {
    type: String,
    required: false // TODO: change to true!
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const db = mongoose.model('Post', postSchema)
module.exports = db;