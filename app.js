var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var client = require('twilio')('ACf790f48ac9a0c4a1cb5e5548945e0889', '8be80276be5dd74cf822b080068b1fd4');

// Set up communciation with the database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/aegis');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

// Handle SMS

/* Send out going SMS message. The req will have the phone number and screenshot URL */
app.post('/message', function(req, res) {
  client.sendMessage({
    to: '+17327663590',
    from: '+17328100203',
    body: 'Movement detected and here is the link to a screenshot:'
  }, function(err, responseData) {
    if (!err) {
      console.log(responseData.from);
      console.log(responseData.body);
    }
  });

  client.makeCall({
    to: '+17327663590',
    from: '+17328100203',
    url: 'http://twimlbin.com/external/d41989be5b86b0d6'
  });
  res.send(req.body);
});

client.makeCall({
  to: '+17327663590',
  from: '+17328100203',
  url: 'http://twimlbin.com/external/d41989be5b86b0d6'
});


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
