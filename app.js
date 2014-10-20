var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var secret = require('./super_secret');
var querystring = require('querystring');
var http = require('http');
//var auth = require('./bitcasa_authentication');

var client = require('twilio')(secret.ACCOUNT_SID, secret.AUTH_TOKEN);
var sendgrid = require('sendgrid')(secret.USERNAME, secret.PASSWORD);
var atob = require('atob');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

var app = express();

var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public/images/shield.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', key: 'sid', cookie: { secure: true }}));
app.use(passport.initialize());;
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
// mongoose.connect('mongodb://localhost/aegis');

// Build the email
var email = new sendgrid.Email({
  from: 'alert@rshield.com',
  subject: 'URGENT - Movement Detected',
});

/* Send outgoing SMS message. The req will have the phone number and screenshot URL */
/* Also send out the call. And the SendGrid email. */
app.post('/message', function(req, res) {
  console.log(req);
  client.sendMessage({
    to: '+1' + req.body.number,
    from: '+17328100203',
    body: 'A movement has been detected. Please check your email for a snapshot of the incident.'
  }, function(err, responseData) {
    if (!err) {
      // log errors
    }
  });

  client.makeCall({
    to: '+1' + req.body.number,
    from: '+17328100203',
    url: 'http://twimlbin.com/external/41992fe96204cbcd'
  });

  var data = req.body.image;

  function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
  }

  var imageBuffer = decodeBase64Image(data);

  email.addTo(req.body.email);
  email.setText("Dear User,\nPlease see attached a snapshot of the area when the motion sensor was triggered.");
  email.addFile({
    filename: "image.png",
    content: imageBuffer.data
  });

  sendgrid.send(email, function(err, json) {
    if (err) {return console.error(err); }
  });

  res.send(req.body);
});

/* Store extra pictures into the database after the alert */
app.post('/storeimage', function(req, res) {
  var data = req.body.image;

  function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
  }

  var imageBuffer = decodeBase64Image(data);
  var im = imageBuffer.data;

  var get_options = {
    method: 'GET',
    headers: {
      'Host': 'qi4uisuzus.cloudfs.io',
      'Path': '/v2/user/profile/',
      'Authorization': 'Bearer US2.ff22a2deaf8c484bb13b68d069d2f8d5.LYVvn3YFASc2fyA28Bz7XJbak08JUa1-Zk35_ShgXpk'
    }
  }

  http.request(get_ping_options, function(res) {
  console.log("Got response: " + res.statusCode);

    res.on('data', function (chunk) {
      output += chunk;
    });

    res.on('end', function() {
      var obj = JSON.parse(output);
      console.log(obj);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  }).end();

/*
  var form_options = {
    'file': 'test',
    'exists': 'overwrite',
  };
  var formData = querystring.stringify(form_options);

  var post_options = {
    method: 'POST',
    headers: {
      'Host': 'qi4uisuzus.cloudfs.io',
      'Path': '/v2/files/',
      'Authorization': 'Bearer US2.ff22a2deaf8c484bb13b68d069d2f8d5.LYVvn3YFASc2fyA28Bz7XJbak08JUa1-Zk35_ShgXpk',
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  };

  var post_req = http.request(post_options, function(res) {
    console.log(res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
    });
  });

  post_req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  post_req.write(im);
  post_req.end();
*/

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
