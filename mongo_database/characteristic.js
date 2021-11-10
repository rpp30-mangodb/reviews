/* eslint-disable camelcase */
const mongoose = require('mongoose');


//layout photo
let characteristicSchema = mongoose.Schema({

  _id: Number,
  count: Number,
  data: [{id: Number, product_id: Number, name: String}]


});
//constructorctor
module.exports = mongoose.model('characteristicbyproductid', characteristicSchema);
