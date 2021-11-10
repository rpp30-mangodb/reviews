/* eslint-disable camelcase */
const mongoose = require('mongoose');


//layout1
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


module.exports = mongoose.model('reviewsByProductId', reviewsSchema );
module.exports = mongoose.model('reviews1', reviewsSchema );
