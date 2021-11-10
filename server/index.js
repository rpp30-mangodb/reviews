const express = require('express');
const http = require('http');
const app = express();
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const mongoDatabase = require('../mongo_database');

const reviewsRoute = require('../routes/reviewsApi');
const metaRoute = require('../routes/reviewMeta');
const loaderioRoute = require('../routes/loaderio');

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);


server.listen(PORT, ()=> {
  console.log(`Server is listening at port ${PORT}`);
});

mongoose.connect('mongodb://rpp30:hellosdc@127.0.0.1:27017/atelierDB?authSource=admin', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', ()=>{
  console.log('Connected to Atelier Database1');
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
app.use('/loaderio-fdedfeef36d70b6f03f99f5a6a9d4fc5', loaderioRoute);

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



module.exports = app;

