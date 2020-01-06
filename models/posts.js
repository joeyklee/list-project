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
    required: true
  },
  "createdBy_id": {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const db = mongoose.model('posts', postSchema)
module.exports = db;