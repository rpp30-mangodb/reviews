const express = require('express');

const app = express();

app.get('/', (req, res) => {
  console.log('Listening from port 5000')
  res.send('Testing from 5000')
})
app.listen(5000)