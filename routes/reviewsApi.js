/* eslint-disable camelcase */
// import Redis from 'ioredis';
// import JSONCache from 'redis-json';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
// const redis = new Redis();

// const jsonCache = new JSONCache(redis);

const Reviews = require('../mongo_database/reviews');
// console.log('review--> L 15', Reviews );
// const Photos = require('../mongo_database/reviewPhotos');

const cache = (req, res, next) =>{
  const {product_id} = req.query;
  // console.log('product_id from redis middleware->', product_id);
  client.get(product_id, (err, data) => {
    if (err) { throw err; }

    if ( data !== null) {
      // console.log('REVIEWS********** L 25->', JSON.parse(data).length);
      res.status(200).json({
        product: product_id,
        page: 1,
        count: JSON.parse(data).length,
        results: JSON.parse(data),

      });

    } else {
      next();
    }
  });
};

router.get('/', cache, (req, res, next) => {
  // router.get('/', (req, res, next) => {
  // Reviews.collection.createIndex({ 'product_id': 1 });
  console.log('hello from reviews Routes', req.query);

  Reviews.find({_id: req.query.product_id})
    // .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
    // .limit(5)
    .exec()
    .then(reviewData => {
      console.log('From reviews database', reviewData);
      const results = [];
      if (reviewData.length > 0) {
        // console.log('each--->', reviewData[0].data);
        let results = [];
        reviewData[0].data.forEach(review1 => {
          const photoData = [];
          var review = review1.toObject();
          if (review.photos.length > 0) {
            review.photos.forEach(photo => {
              photoData.push({'id': photo.id, 'url': photo.url});
            });
          }
          console.log('review-L27>', review);


          results.push({
            'review_id': review.id,
            'rating': review.rating,
            'summary': review.summary,
            'recommend': review.recommend,
            'response': review.response || null,
            'body': review.body,
            'date': review.date,
            'reviewer_name': review.reviewer_name,
            'helpfulness': review.helpfulness,
            'photos': photoData
          });
        });
        // console.log('Results---->L43', results);
        // console.log('test->', req.query.product_id);
        //set data to Redis
        client.setex(req.query.product_id, 3600, JSON.stringify(results));

        res.status(200).json({
          product: reviewData[0].product_id,
          page: 1,
          count: reviewData[0].data.length,
          results: results,

        });


      } else {
        res.status(500).json({
          message: 'No valid entry found for provided ID'
        });
      }

    })

    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });

    });

});

//POST
router.post('/', (req, res, next) => {
  // console.log('POST ROUTE', req.query);

  // Reviews.collection.dropIndex({ 'product_id': 1 });
  var review_id;
  const {product_id, rating, summary, body, recommended, name, email} = req.query;
  const {photos, characteristics} = req.query;
  // console.log('checking POST query:->', product_id, rating, summary, body, recommended, name, email, photos, characteristics);
  Reviews.find({}).sort({id: -1}).limit(1).exec().then(lastId=>{
    console.log('last id', lastId[0].id);
    review_id = lastId[0].id + 1;
    console.log('reviewId-', review_id);
    const data = {
      //how to find the last review_id and increment it????
      id: review_id,
      product_id: Number(product_id),
      rating: Number(rating),
      date: new Date,
      summary: summary,
      body: body,
      recommend: recommended,
      reported: false,
      reviewer_name: recommended,
      reviewer_email: email,
      helpfulness: 0,
      response: null,
      photos: []
    };
    Reviews.create(data)
      .then(data=>{
        console.log('data created', data);
        res.status(201).send('CREATED');
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });


});


//PUT ROUTE
router.put('/:review_id/helpful', (req, res)=>{
  console.log('Testing helpful111222222', req.params);
  const {review_id} = req.params;

  Reviews.findOneAndUpdate(
    { id: review_id},
    { $inc: {'helpfulness': 1 } },
    {new: true })
    .exec()
    .then(data => {
      // console.log('tell me something', data);
      res.status(204).send();
    })
    .catch(err => {
      // console.log('error', err);
      res.status(500).send(err);
    });

});

router.put('/:review_id/report', (req, res, next) => {
  console.log('Update Report Review', req.params);
  const {review_id} = req.params;

  Reviews.findOne({id: review_id })
    .exec()
    .then(data => {
      // console.log('data', data);
      data.reported = !data.reported;
      data.save()
        .then(success=>{
          // console.log('yeh!', success.reported);
          res.status(204).send();
        })
        .catch(err => {
          res.status(500).send({'error': err});
        });


    })
    .catch(err=>{
      res.status(500).send({'error': err});
    });


});


module.exports = router;