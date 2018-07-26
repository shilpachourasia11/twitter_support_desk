var _ = require('lodash');
var secrets = require('../config/secrets');

var Twitter = require('twitter'); //not using
var client = ''; //not using

var twitterAPI = require('node-twitter-api');
var requestTokenTwitter = '';
var requestTokenSecretTwitter = '';

var rp = require('request-promise');

var db=require('./../sqldb');
var userID = '';

var app = require('../app.js');
var io = require('socket.io')(app);

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
  let userDetail = db.user_detail;

  userDetail.findOne({ where: {
    id: req.body.id,
  }})
  .then((result)=>{
      let data = JSON.parse(result.dataValues.twitter_handle)
      let accessToken = data.accessToken;
      let accessTokenSecret = data.accessTokenSecret;
      let params = {
        hashtags: ['#orders']
      };

      let order = [];
      let feedback = [];
      let complaint = [];
      let chat = [];

      let substringOrder = 'order';
      let subStrFeedback = 'feedback';
      let subStrCompliant = 'complaint';

      twitter.getTimeline("mentions", params, accessToken, accessTokenSecret, function(error, data, response) {
        if(error){
          res.send({
            error: true,
            value: error
          })
        }
        else{
          data.map((item, index)=>{
            item.entities.hashtags.map((hash, index2)=>{
              if(hash.text.includes(substringOrder)){
                order.push(item);
              }
              else if(hash.text.includes(subStrFeedback)){
                feedback.push(item);
              }
              else if(hash.text.includes(subStrCompliant)){
                complaint.push(item);
              }
              else{
                chat.push(item);
              }
            })
          })
          res.send({
            error: false,
            value: {
              order,
              feedback,
              complaint,
              chat
            }
          })
        }
      });
  })
}

exports.streamTweets = function(req,res) {
  let userDetail = db.user_detail;

  userDetail.findOne({ where: {
    id: req.body.id,
  }})
  .then((result)=>{
      let data = JSON.parse(result.dataValues.twitter_handle)
      let accessToken = data.accessToken;
      let accessTokenSecret = data.accessTokenSecret;

      let params = {
        track: "#food"
      }

      var client = new Twitter({
        consumer_key: secrets.twitter.api_key,
        consumer_secret: secrets.twitter.api_secret_key,
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret
      });

      let order = [];
      let feedback = [];
      let complaint = [];
      let chat = [];

      let substringOrder = 'order';
      let subStrFeedback = 'feedback';
      let subStrCompliant = 'complaint';

      var stream = client.stream('statuses/filter', {track: '@FoodBird7'});
      stream.on('data', function(data) {
        console.log(data.entities)
        data.entities.hashtags.map((hash, index2)=>{
            if(hash.text.includes(substringOrder)){
              order.push(data);
            }
            else if(hash.text.includes(subStrFeedback)){
              feedback.push(data);
            }
            else if(hash.text.includes(subStrCompliant)){
              complaint.push(data);
            }
            else{
              chat.push(data);
            }
          })

          io.sockets.emit('tweet', {
            order,
            feedback,
            complaint,
            chat
          });
      });

      stream.on('error', function(error) {
        throw error;
      });


      //twitter.getStream("site", params, accessToken, accessTokenSecret, dataCallback, endcallback)
  });
}
