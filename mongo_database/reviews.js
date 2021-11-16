/* eslint-disable camelcase */
const mongoose = require('mongoose');


/*
layout1
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
*/

let reviewsSchema = mongoose.Schema({

  //indexing not recommend in development {type:[ Number], index: true},
  _id: Number,
  count: Number,
  data: [
    {
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

    }
  ]
});

let reviewidSchema = mongoose.Schema({
  id: Number,
  product_id: Number

});

// const review = mongoose.model('reviewsByProductId', reviewsSchema );
const reviewid = mongoose.model('reviewids', reviewidSchema);
const review1 = mongoose.model('reviews1', reviewsSchema );
const dummyCollection = mongoose.model('dummyreview', reviewsSchema );

module.exports = {review1, dummyCollection, reviewid};

