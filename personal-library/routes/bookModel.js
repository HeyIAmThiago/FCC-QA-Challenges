const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  commentcount: {
    type: Number,
    default: 0
  },
  comments: []
})

module.exports = mongoose.model('bookModel', bookSchema);