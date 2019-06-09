const express = require('express');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');

const models = require('./utility/database').models;

var usersRouter = require('./modules/users/router');
var campaignsRouter = require('./modules/campaigns/router');

var app = express();

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

if (process.env.NODE_ENV === 'production') {
  // Creo uno stream rotante di file di log giornalieri
  var accessLogStream = rfs('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'log')
  })
  app.use(logger('combined', { stream: accessLogStream }))
} else
  app.use(logger('dev'));

// aumentato il limite in upload per caricare immagini
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/resources', express.static(process.env.RESOURCES_PATH, {}));

app.use(function (req, res, next) {
  req.context = {
    models,
  };
  next();
});

app.use('/users', usersRouter);
app.use('/campaigns', campaignsRouter);

module.exports = app;