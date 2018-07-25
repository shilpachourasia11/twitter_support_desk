var _ = require('lodash');
var secrets = require('../config/secrets');

var Twitter = require('twitter'); //not using
var client = ''; //not using

var twitterAPI = require('node-twitter-api');
var requestTokenTwitter = '';
var requestTokenSecretTwitter = '';

var db=require('./../sqldb');
var userID = '';
var twitter = new twitterAPI({
    consumerKey: secrets.twitter.api_key,
    consumerSecret: secrets.twitter.api_secret_key,
    callback:secrets.twitter.callback
});

exports.connect = function(req, res) {
   userID = req.body;
   console.log(userID)
   twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
        console.log("Error getting OAuth request token : " + error);
    } else {
        requestTokenTwitter = requestToken;
        requestTokenSecretTwitter = requestTokenSecret;
        let url = 'https://twitter.com/oauth/authenticate?oauth_token=' + requestToken;
        res.send(url);
    }
  });
}

exports.callback = function(req, res) {
  let oauth_verifier = req.body.oauth.oauth_verifier;
  let oauth_token = req.body.oauth.oauth_token;

  twitter.getAccessToken(requestTokenTwitter, requestTokenSecretTwitter, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
    if (error) {
        console.log(error);
    } else {
        twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, data, response) {
            if (error) {
              res.send({
                error: true,
                value: error
              });
            } else {
                let twitter_data = {
                  accessToken,
                  accessTokenSecret,
                  oauth_verifier,
                  oauth_token,
                  data
                }

                let userDetail = db.user_detail;
                userDetail.update(
                   {
                     twitter_handle: twitter_data
                   },
                   {
                     where: {
                       id: userID.id
                     }
                  }
                 )
                 .then(function(rowsUpdated) {
                   res.json({
                     value: rowsUpdated,
                     error: false
                   })
                 })
            }
        });
    }
  });
}

exports.getOrder = function(req, res) {
  var params = {
    q: '#orders @sheep'
  };
  client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets);
    }
    else{
      console.log(error)
    }
  });
}

exports.getFeedback = function(req, res) {
  var params = {
    q: '#feedback'
  };
  client.get('statuses/mentions_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets);
    }
    else{
      console.log(error)
    }
  });
}

exports.getComplaints = function(req, res) {
  var params = {
    q: '#complaints'
  };
  client.get('statuses/mentions_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets);
    }
    else{
      console.log(error)
    }
  });
}
