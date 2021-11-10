/* eslint-disable camelcase */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
//pick* product_id-575
//notworking- 5501
const Characteristic = require('../mongo_database/characteristic');
const Characteristic_reviews = require('../mongo_database/reviewChara');
const Reviews = require('../mongo_database/reviews');

const cache = (req, res, next) =>{
  const {product_id} = req.query;
  let redisKey = req.query.product_id.toString() + 'meta';
  // console.log('RedisKey-L17--->', redisKey);
  // console.log('product_id from redis middleware reviewMeta->', product_id);
  client.get(redisKey, (err, data) => {
    if (err) { throw err; }

    if ( data !== null) {
      // console.log('MMMMMMMMM Meta CACHE route L21->', JSON.parse(data));
      res.status(200).json({
        product_id: product_id,
        ratings: JSON.parse(data).rating,
        recommended: JSON.parse(data).recommend,
        characteristics: JSON.parse(data).characteristics,

      });

    } else {
      next();
    }
  });
};

const findRating = (reviewData) => {
  // console.log('checkingreview-1->', reviewData);
  let rating1 = 0; let rating2 = 0; let rating3 = 0; let rating4 = 0; let rating5 = 0;
  for (let i = 0; i < reviewData.length; i++) {
    // console.log('checkingreview-->', reviewData[i]);
    let each = reviewData[i];

    switch (each.rating) {
    case 1: rating1 ++;
      break;
    case 2: rating2 ++;
      break;
    case 3: rating3 ++;
      break;
    case 4: rating4 ++;
      break;
    case 5: rating5 ++;
      break;
    }
  }

  return ({
    1: rating1,
    2: rating2,
    3: rating3,
    4: rating4,
    5: rating5,
  });
};
const findrecommend = (data) => {
  // console.log('findrecommend-->', data);
  let trueCount = 0; let falseCount = 0;
  for (let i = 0; i < data.length; i++) {
    let each = data[i];
    if (each.recommend) {
      trueCount ++;
    } else {
      falseCount ++;
    }
  }
  // console.log('true->', trueCount, falseCount);
  return ({false: falseCount, true: trueCount});
};

const computation = (charData, data)=>{
  // console.log('computation->', charData, data.length);
  let characteristic = [];
  for (let i = 0; i < data.length; i++) {
    let each = data[i];
    let metaChar = [];
    // console.log('test-->', i);
    // console.log('inside computation Each-1->', each);
    for (let j = 0; j < charData.length; j++) {
      let eachChar = charData[j];
      let sum = 0;
      let avg = 0;

      // console.log(j, each.id, eachChar[0]._id, each.id === eachChar[0]._id);

      if (each.id === eachChar[0]._id) {
        // console.log('length:', eachChar[0].data.length);
        for (let k = 0; k < eachChar[0].data.length; k++ ) {
          // console.log('each data', eachChar[0].data[i]);
          let finalEach = eachChar[0].data[k];

          sum += finalEach.value;
          // console.log('inside computation Each-3->', k, sum);
        }
        avg = sum / eachChar[0].data.length;
      }

      // console.log('results->', each.id, each.name, avg);
      if (avg > 0) {

        metaChar.push (each.name, {'id': each.id, 'value': avg});
      }



    }
    // console.log('characteristic: 1->', metaChar);
    // characteristic[metaChar] =
    characteristic.push(metaChar);
  }
  let dataFinal = {};
  characteristic.forEach(each=>{
    dataFinal[each[0]] = each[1];
  });

  // console.log('characteristic: computation-->', dataFinal);
  return dataFinal;
};




// characteristic_id
router.get('/', cache, (req, res, next) => {
  // console.log('This is from MetaData Route', req.query);

  Reviews.find({_id: req.query.product_id})
    .exec()
    .then(meta1=> {
      // console.log('From database----------------------', meta1);
      let ratingResult = findRating(meta1);
      // console.log('rating-->', ratingResult);
      let recommendResult = findrecommend(meta1);
      // console.log('recommend-->', recommendResult);
      Characteristic.find({_id: req.query.product_id})
        .exec()
        .then(charData=>{
          // console.log('Characterictic', charData);
          //************** Need to check if there is no data for characteristic****** */
          // const resultChar = fetchCharacteristic(charData[0].data);
          const promises = [];
          const data = charData[0].data;
          // console.log('data--> L 126', data);
          for (let i = 0; i < data.length; i++) {
            let each = data[i];
            // console.log('Each-->', each.id);
            promises.push(Characteristic_reviews.find({_id: each.id}).exec());
          }
          Promise.all(promises)
            .then((reviewCharData)=>{
              // console.log('reviewCharData-->', reviewCharData);
              let metaChar = {};
              if (reviewCharData[0].length !== 0) {
                metaChar = computation(reviewCharData, charData[0].data);
              }

              // console.log('metaChar-->', metaChar);
              const results = {'rating': ratingResult, 'recommended': recommendResult, 'characteristics': metaChar };
              //set data to Redis
              let redisKey = req.query.product_id.toString() + 'meta';
              // console.log('RedisKey-L170>', redisKey);
              client.setex(redisKey, 3600, JSON.stringify(results));
              if (true) {
                res.status(200).json({
                  product_id: req.query.product_id,
                  ratings: ratingResult,
                  recommended: recommendResult,
                  characteristics: metaChar,

                });
              } else {
                res.status(404).json({ message: 'No review Meta data found for provided ID' });
              }

            })
            .catch(error=>{
              // console.log('**L153**error getting Characteristic_reviews', error);
              res.status(404).json({ message: 'No review Meta data found for provided ID' });
            });
        });
    })
    .catch(err=>{
      // console.log(err);
      res.status(404).json({ message: 'No review Meta data found for provided ID' });
    });


});

module.exports = router;