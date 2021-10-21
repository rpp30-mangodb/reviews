/* eslint-disable camelcase */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Reviews = require('../mongo_database/reviews');

router.get('/', (req, res, next) => {
  console.log('hello from reviews Routes');
  Reviews.find({product_id: 5501})
    .exec()
    .then(doc => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
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
    })
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