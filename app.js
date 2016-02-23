var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbuser = process.env.dbuser;
var dbpassword = process.env.dbpassword;
var dbaddress = process.env.dbaddress;

var app = express();
var hbs = require("hbs");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

hbs.registerHelper('escape', function(variable) {
  return variable.replace(/(['])/g, '\\$1');
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

var mongoose = require("mongoose");
mongoose.connect("mongodb://"+dbuser+":"+dbpassword+dbaddress);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function(){

  require("./models")();

  var routes = require('./routes/index');
  var users = require('./routes/users');
  var api = require('./routes/api');

  app.use('/', routes);
  app.use('/users', users);
  app.use('/api', api);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
});

module.exports = app;
