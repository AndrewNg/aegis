var express = require('express');
var twilio = require('twilio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // Render HTML page
  res.render('index', {
    title: 'aegis'
  });
});

module.exports = router;
