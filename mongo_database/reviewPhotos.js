/* eslint-disable camelcase */
const mongoose = require('mongoose');


//layout photo
let reviewsPhotosSchema = mongoose.Schema({

  _id: Number,
  count: Number,
  data: [{id: Number, review_id: Number, url: String}]


});
//constructorctor
module.exports = mongoose.model('reviewphotosById', reviewsPhotosSchema);

