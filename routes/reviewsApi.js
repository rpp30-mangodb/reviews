/* eslint-disable camelcase */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Reviews = require('../mongo_database/reviews');
// const Photos = require('../mongo_database/reviewPhotos');

router.get('/', (req, res, next) => {
  console.log('hello from reviews Routes', req.query);
  Reviews.find({product_id: req.query.product_id})
    // .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
    .limit(5)
    .exec()
    .then(reviewData => {
      // console.log('From reviews database', reviewData);
      const results = [];
      if (reviewData.length > 0) {
        let results = [];
        reviewData.forEach(review1 => {
          const photoData = [];
          var review = review1.toObject();
          if (review.photos.length > 0) {
            review.photos.forEach(photo => {
              photoData.push({'id': photo.id, 'url': photo.url});
            });
          }
          console.log('review-L27>', review, review.name, review.email);


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
        console.log('Results---->L43', results);
        res.status(200).json({
          product: reviewData[0].product_id,
          page: 1,
          count: reviewData.length,
          results: results,

        });


      } else {
        res.status(404).json({
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
  console.log('POST ROUTE', req.query);
  const {product_id, rating, summary, body, recommended, name, email} = req.query;
  const {photos, characteristics} = req.query;
  // console.log('checking POST query:->', product_id, rating, summary, body, recommended, name, email, photos, characteristics);
  res.status(201).send('CREATED');
});


//PUT ROUTE
router.put('/:review_id/helpful', (req, res)=>{
  console.log('Testing helpful111222222', req.params);
  const {review_id} = req.params;
  res.status(204).send();
});

router.put('/:review_id/report', (req, res, next) => {
  console.log('Update Report Review', req.params);
  const {review_id} = req.params;
  res.status(204).send();
});
module.exports = router;