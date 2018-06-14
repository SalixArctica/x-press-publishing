const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorHandler');
const cors = require('cors');
const apiRouter = require('./api/api.js');

const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api', apiRouter);

app.use(errorHandler());
app.listen(PORT, (err) => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
