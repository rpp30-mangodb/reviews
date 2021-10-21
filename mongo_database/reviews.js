/* eslint-disable camelcase */
const mongoose = require('mongoose');


//layout1
let reviewSchema = mongoose.Schema({

  _id: Number,
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_Name: String,
  reviewer_email: String,
  photos: [String],
  helpfulness: Number,
  response: String

});

module.exports = mongoose.model('Reviews', reviewSchema );
