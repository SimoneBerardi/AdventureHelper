var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const models = require('./utility/database').models;

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var usersRouter = require('./modules/users/router');
var campaignsRouter = require('./modules/campaigns/router');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  req.context = {
    models,
  };
  next();
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/users', usersRouter);
app.use('/campaigns', campaignsRouter);

module.exports = app;
