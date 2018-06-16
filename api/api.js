const express = require('express');
const artistRouter = require('./artists.js');

const apiRouter = express.Router();

apiRouter.use('/artists', artistRouter);

module.exports = apiRouter;
