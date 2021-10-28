/* eslint-disable camelcase */
const mongoose = require('mongoose');


//layout1
let reviewsSchema = mongoose.Schema({

  
  id: Number,
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  helpfulness: Number,
  response: String,
  photos: [{
    id: Number,
    reviewId: Number,
    url: String
  }]

});


module.exports = mongoose.model('reviewsByProductId', reviewsSchema );
