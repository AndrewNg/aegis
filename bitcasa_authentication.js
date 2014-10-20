var CryptoJS = require('crypto-js');
var http = require ('http');
var querystring = require('querystring');
var secret = require('./super_secret');
var utf8 = require('utf8');

var post_options = {
  method: 'GET',
  headers: {
    'Host': 'qi4uisuzus.cloudfs.io',
    'Path': '/v2/files/' + (new Buffer("test").toString('base64')).toString(),
    'Authorization': 'Bearer US2.ff22a2deaf8c484bb13b68d069d2f8d5.LYVvn3YFASc2fyA28Bz7XJbak08JUa1-Zk35_ShgXpk',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf8 or multipart/form-data'
  }
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

post_req.end();
