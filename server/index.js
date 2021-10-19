const express = require('express');
const bodyParser = require('body-parser');
const mongoDatabase = require('../mongo_database');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());//important *2

app.get('/', (req, res) => {
  console.log('Listening from port 5000');
  mongoDatabase.readReview((err, data)=> {
    if (err) {
      console.log('error', err);
      // res.send(err)
    } else {
      console.log('data back from mongo readReview->', data);
      // res.send(data);
    }
  });
  mongoDatabase.readCharacteristics((err, data)=> {
    if (err) {
      console.log('error', err);
      // res.send(err)
    } else {
      console.log('data back from mongo readCharacteristics->', data);
      // res.send(data);
    }
  });
  mongoDatabase.readCharacteristicReviews((err, data)=> {
    if (err) {
      console.log('error', err);
      // res.send(err)
    } else {
      console.log('data back from mongo readCharacteristicReviews->', data);
      // res.send(data);
    }
  });
  mongoDatabase.readReviewsPhotos((err, data)=> {
    if (err) {
      console.log('error', err);
      // res.send(err)
    } else {
      console.log('data back from mongo readReviewsPhotos->', data);
      res.send(data);
    }
  });

});
app.listen(5000, ()=> {
  console.log('Server is listening at port 5000');
});