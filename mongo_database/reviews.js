/* eslint-disable camelcase */
const mongoose = require('mongoose');


//layout1
let reviewsSchema = mongoose.Schema({

  _id: Number,
  id: Number,
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_Name: String,
  reviewer_email: String,
  helpfulness: Number,
  response: String,
  photos: [{
    id: Number,
    review_id: Number,
    url: String
  }]




});


module.exports = mongoose.model('reviewsByProductId', reviewsSchema );
