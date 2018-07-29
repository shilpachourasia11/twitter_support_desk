//const db = require('../database.js');
let twitterController = require('../controllers/twitter');
let loginController = require('../controllers/login');
const express = require('express');
import path from 'path'

module.exports = function(app){
	if (process.env.NODE_ENV === 'production') {
		app.use(express.static('public/'));
	}
	app.get('*', (request, response) => {
		response.sendFile(path.join(__dirname, 'public/', 'index.html'));
	});

	app.post('/user/login', loginController.login);
	app.post('/user/signup', loginController.signUp);
	app.post('/auth_twitter', twitterController.connect)
	//app.get('/twitter_reverse', twitterController.connect)
	app.post('/twitter', twitterController.callback)
	// app.get('/twitter', twitterController.connect);
	app.post('/getOrder', twitterController.getOrder);
	app.post('/streamTweets', twitterController.streamTweets);
	app.post('/getReplies', twitterController.getReplies);
	app.post('/sendReply', twitterController.sendTweets);
};
