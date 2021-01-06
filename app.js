require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoDB = require('./src/database/mongo_db');

var webRouter = require('./src/routes/index');
var apiRouter = require('./src/routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', webRouter);
app.use('/api', apiRouter);

module.exports = app;
