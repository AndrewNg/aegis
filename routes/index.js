var express = require('express');
var twilio = require('twilio');
var twilio = require('twilio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // Create an object which generates a capability token
  var capability = new twilio.Capability(
    "ACf790f48ac9a0c4a1cb5e5548945e0889",
    "8be80276be5dd74cf822b080068b1fd4"
  );

  // Give capability generator permission to accept incoming calls
  capability.allowClientIncoming('kevin');

  // outgoing
  capability.allowClientOutgoing('AP168c7b4fccfe20acc03dd2646626d0d3');

  // Render HTML page which contains capability token
  res.render('index', {
    token:capability.generate(),
    title: 'aegis'
  });
});

module.exports = router;
