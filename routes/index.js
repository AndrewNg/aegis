var express = require('express');
var twilio = require('twilio');
var twilio = require('twilio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // Render HTML page
  res.render('index', {
    title: 'aegis'
  });
});

/* GET users */
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e, docs){
    res.render('userlist', {
      "userlist": docs
    });
  });
});

module.exports = router;
