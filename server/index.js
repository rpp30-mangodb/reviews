const express = require('express');
const http = require('http');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoDatabase = require('../mongo_database');

const reviewsRoute = require('../routes/reviewsApi');
const metaRoute = require('../routes/reviewMeta');

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, ()=> {
  console.log(`Server is listening at port ${port}`);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());//important *2


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// ******ROUTES**********
app.use('/reviews', reviewsRoute);
app.use('/reviews/meta', metaRoute);

app.use((req, res, next) => {
  // console.log('checking MAIN request-->', req.url);
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// app.get('/', (req, res) => {
//   console.log('Listening from port 5000');
// mongoDatabase.readReview((err, data)=> {
//   if (err) {
//     console.log('error', err);
//     // res.send(err)
//   } else {
//     console.log('data back from mongo readReview->', data);
//     // res.send(data);
//   }
// });
// mongoDatabase.readCharacteristics((err, data)=> {
//   if (err) {
//     console.log('error', err);
//     // res.send(err)
//   } else {
//     console.log('data back from mongo readCharacteristics->', data);
//     // res.send(data);
//   }
// });
// mongoDatabase.readCharacteristicReviews((err, data)=> {
//   if (err) {
//     console.log('error', err);
//     // res.send(err)
//   } else {
//     console.log('data back from mongo readCharacteristicReviews->', data);
//     // res.send(data);
//   }
// });
// mongoDatabase.readReviewsPhotos((err, photos)=> {
//   if (err) {
//     console.log('error', err);
//     // res.send(err)
//   } else {
//     console.log('data back from mongo readReviewsPhotos->', photos);
//     res.json(photos);
//   }
// });

// });

module.exports = app;

