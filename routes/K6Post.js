/* eslint-disable camelcase */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DummyPost = require('../mongo_database/reviews').dummyCollection;
const checkReviewId = require('../mongo_database/reviews').reviewid;
// console.log('review--> L 15', DummyPost );

router.post('/', (req, res, next) => {
  console.log('POST ROUTE---TEST--->', req);

  // Reviews.collection.dropIndex({ 'product_id': 1 });
  // var review_id;
  const {product_id, rating, summary, body, recommended, name, email} = req.body;
  const {photos, characteristics} = req.body;
  // console.log('checking POST query:->', product_id, rating, summary, body, recommended, name, email, photos, characteristics);
  checkReviewId.find({}).sort({review_id: -1}).limit(1).exec().then(lastId=>{
    // console.log('last id', lastId[0].toObject().review_id);
    let review_id = lastId[0].toObject().review_id + 1;
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
    DummyPost.create(data)
      .then(data=>{
        console.log('data created', data);
        res.status(201).send('CREATED');
        checkReviewId.create({id: review_id, product_id: Number(product_id) })
          .then(data => { console.log('success creating review_id'); } )
          .catch(err => { throw err; });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });


});







module.exports = router;