/* eslint-disable camelcase */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/atelierDB', {useNewUrlParser: true, useUnifiedTopology: true});

//layout1
// let reviewSchema = mongoose.Schema({

//   id: Number,
//   product_id: Number,
//   rating: Number,
//   date: Date,
//   summary: String,
//   body: String,
//   recommend: Boolean,
//   reported: Boolean,
//   reviewer_Name: String,
//   reviewer_email: String,
//   photos: [String],
//   helpfulness: Number,
//   response: String,
// });
// //constructorctor
// let Review = mongoose.model('Review', reviewSchema );

//layout2
let characteristic_reviewSchema = mongoose.Schema({

  id: Number,
  characteristic_id: Number,
  reviewer_id: Number,
  value: Number,
  test: String
});
//constructorctor
let Characteristic_reviews = mongoose.model('Characteristic_reviews', characteristic_reviewSchema );

//layout3
let characteristicsSchema = mongoose.Schema({

  id: Number,
  product_id: Number,
  name: String

});
//constructorctor
let characteristics = mongoose.model('characteristics', characteristicsSchema);




let readReview = (cb) => {
  console.log('reading Review from reviews-->');
  Review.find().exec(
    function(err, data) {
      if (err) {
        cb(err, null);
      } else {
        console.log('Data-->', data);
        cb(null, data);
      }
    }
  );

};

let readCharacteristics = (cb) => {
  console.log('reading characteristics from reviews-->');
  characteristics.find().exec(
    function(err, data) {
      if (err) {
        cb(err, null);
      } else {
        console.log('Data-->', data);
        cb(null, data);
      }
    }
  );

};

let readCharacteristicReviews = (cb) => {
  console.log('reading characteristics from reviews-->');
  Characteristic_reviews.find().exec(
    function(err, data) {
      if (err) {
        cb(err, null);
      } else {
        console.log('Data-->', data);
        cb(null, data);
      }
    }
  );

};

let readReviewsPhotos = (cb) => {
  console.log('reading readReviewsPhotos from reviews-->');
  reviews_photos.aggregate(
    [
      {
        '$group': {
          '_id': '$review_id',
          photos: {
            $push: {id: '$id', url: '$url'}
          }
        }
      }
    ], function(err, data) {
      if (err) {
        cb(err, null);
      } else {
        console.log('Data-->', data);
        cb(null, data);
      }
    }
  );

  // reviews_photos.find().exec(
  //   function(err, data) {
  //     if (err) {
  //       cb(err, null);
  //     } else {
  //       console.log('Data-->', data);
  //       cb(null, data);
  //     }
  //   }
  // );

};


// module.exports = {readReview, readCharacteristics, readCharacteristicReviews, readReviewsPhotos};