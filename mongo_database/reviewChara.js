/* eslint-disable camelcase */
const mongoose = require('mongoose');


//layout photo
let reviewCharaSchema = mongoose.Schema({

  _id: Number,
  count: Number,
  data: [{
    id: Number,
    characteristic_id: Number,
    review_id: Number,
    value: Number
  }]


});
//constructorctor
module.exports = mongoose.model('metaBycharId', reviewCharaSchema);