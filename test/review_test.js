/* eslint-disable camelcase */
//supertest- HTTP assertions library that test your node.js
const request = require('supertest');
var chai = require('chai');
const expect = require('chai').expect;
const assert = require('assert');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/testDB');
mongoose.connection
  .once('open', ()=>{ console.log('test DB connected!'); })
  .on('error', error=>{ console.warn('Error with testDB: ', error); });


const PORT = process.env.PORT || 8080;
const HOST = `http://localhost:${PORT}`;
//import the schema for reviews
const Reviews = require('../mongo_database/reviews');
console.log('Review Test-1->');

describe('creating document', ()=>{
  it('Create new review', (done) => {
    const review = new Reviews({
      product_id: '5002',
      rating: 5,
      date: new Date,
      summary: 'Testing summary review',
      body: 'This is just awesome purchase.',
      recommend: true,
      reported: false,
      reviewer_name: 'Jane',
      reviewer_email: 'jane@gmail.com',
      helpfulness: 0,
      response: null,
      photos: []
    });
    review.save()
      .then((data)=>{
        console.log('save', data);
        assert(!review.isNew);
        done();
      });
    // done();
  });
  //
});

describe('Reviews Routing Tests', ()=>{
  // console.log('Review Test-2->');
  describe('testing database', () =>{
    // console.log('Review Test-3->');
    before((done)=>{
      mongoose.connection.db.dropDatabase(()=>{
        console.log('Cleaning - test database dropped');
      });
      return done();
    });
    it ('should reject invalid data with 404 status', (done) => {
      const badReq = {
        notAJob: 'not real data',
      };
      request(HOST)
        .post('/post')
        .send(badReq)
        .expect(404, done);
    });
    after(()=>{
      mongoose.connection.close(()=> {
        console.log('Test database connection closed');
      });
    });
  });


});
