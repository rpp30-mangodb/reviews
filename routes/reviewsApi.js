/* eslint-disable camelcase */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Reviews = require('../mongo_database/reviews');
const Photos = require('../mongo_database/reviewPhotos');

router.get('/', (req, res, next) => {
  console.log('hello from reviews Routes', req.query);
  Reviews.find({_id: req.query.product_id})
    .exec()
    .then(reviewData => {
      console.log('From database', reviewData);
      const promises = [];
      const photoData = [];
      for (j = 0; j < reviewData[0].data.length; j++) {
        let review_id = reviewData[0].data[j].id;

        promises.push(Photos.find({_id: review_id}).exec());
      }
      Promise.all(promises)
        .then((photoData)=>{
          // for (j = 0; j < reviewData[0].data.length; j++) {
          // console.log('promises->', photoData);
          // }

          if (reviewData) {

            let results = [];

            let length = reviewData[0].data.length;
            if ( length > 0) {

              for (let i = 0; i < length; i++) {
                let photos = [];
                let review = reviewData[0].data[i];

                for (let j = 0; j < photoData.length; j++) {

                  for (let k = 0; k < photoData[j].length; k++) {

                    let photo = photoData[j][k];

                    if (photo._id === review.id) {
                      for (let x = 0; x < photo.data.length; x++) {
                        let each = photo.data[x];
                        photos.push({id: each.id, url: each.url});
                      }

                    }

                  }

                }


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
                  'photos': photos
                });


              }
              // console.log('results-->', results);
            }
            res.status(200).json({
              product: reviewData[0]._id,
              page: 0,
              count: reviewData[0].count,
              results: results,
              request: {
                type: 'GET',
                url: 'http://localhost:8080/reviews'
              }
            });
          } else {
            res
              .status(404)
              .json({ message: 'No valid entry found for provided ID' });
          }
        });
    })
  // .catch(err=>{
  //   console.log('error getting photos from DB');
  // });


    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

  // mongoDatabase.readReview((err, data)=> {
  //   if (err) {
  //     console.log('error', err);
  //     // res.send(err)
  //   } else {
  //     console.log('data back from mongo readReview->', data);
  //     // res.send(data);
  //   }
  // });
});

module.exports = router;