const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world.');
});

app.listen(8080, '127.0.0.1', () => {
  console.log('App listening on port 8080.');
});
