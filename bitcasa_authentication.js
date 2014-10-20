var CryptoJS = require('crypto-js');
var http = require ('http');
var querystring = require('querystring');
var secret = require('./super_secret');
var utf8 = require('utf8');


var encodeURL = function(str){
    return encodeURIComponent(str).replace(/%20/g, "+").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
}

var date = new Date();
var interesting_headers = encodeURL("Content-Type") + ":" + encodeURL("application/x-www-form-urlencoded; charset=\"utf-8\"") +
                          "&" + encodeURL("Date") + ":" + encodeURL(date.toUTCString());
var query_string_parameters = encodeURL("grant_type") + "=" + encodeURL("password") +
                          "&" + encodeURL("password") + "=" + encodeURL("password") +
                          "&" + encodeURL("username") + "=" + encodeURL("sabar");

var url_path = "/v2/oauth2/token";
var http_verb = "POST";
var string_to_sign = http_verb +
                    "&" + url_path +
                    "&" + query_string_parameters +
                    "&" + interesting_headers;

string_to_sign = "POST&/v2/oauth2/token&grant_type=password&password=password&username=sabar&Content-Type:application%2Fx-www-form-urlencoded&Date:Sun%2C+19+Oct+2014+06%3A06%3A24+GMT"
var signature = CryptoJS.HmacSHA1(string_to_sign, secret.BITCASA_CLIENT_SECRET).toString(CryptoJS.enc.Base64);
//console.log(signature);


// console.log(unescape(encodeURIComponent(string_to_sign)));
// console.log(secret.BITCASA_CLIENT_SECRET);
// console.log(CryptoJS.HmacSHA1(unescape(encodeURIComponent(string_to_sign)), secret.BITCASA_CLIENT_SECRET));

var header_value = "BCS " + secret.BITCASA_CLIENT_ID + ":" + signature.toString();
var header = "Authorization: " + header_value;

var form = {
  grant_type: 'password',
  password: 'password',
  username: 'sabar'
};
var formData = querystring.stringify(form);

//console.log(header_value);

/*
var post_options = {
  host: 'qi4uisuzus.cloudfs.io',
  path: '/v2/oauth2/token',
  method: 'POST',
  body: formData,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset="utf-8"',
    'Date' : date.toUTCString(),
    'Authorization': header_value
  }
};

var post_req = http.request(post_options, function(res) {
  //console.log(res.headers);
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
  });
});

post_req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

post_req.end();*/

// var get_token_options = {
//   host: 'qi4uisuzus.cloudfs.io',
//   headers: {

//   }
// };

var get_ping_options = {
  method: 'GET',
  headers: {
    'Host': 'qi4uisuzus.cloudfs.io',
    'Path': '/v2/ping',
    'Authorization': 'Bearer US2.daed6ecde32a470f88bd150c0b39cb06.LYVvn3YFASc2fyA28Bz7XJbak08JUa1-Zk35_ShgXpk'
  }
};

var output = "";

http.request(get_ping_options, function(res) {
  console.log("Got response: " + res.statusCode);

  res.on('data', function (chunk) {
    output += chunk;
  });

  res.on('end', function() {
    console.log(output);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
}).end();

