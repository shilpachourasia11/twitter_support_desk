//const db = require('../database.js');
let twitterController = require('../controllers/twitter');
let loginController = require('../controllers/login');

module.exports = function(app){
	app.post('/user/login', loginController.login);
	app.post('/user/signup', loginController.signUp);
	app.post('/auth_twitter', twitterController.connect)
	//app.get('/twitter_reverse', twitterController.connect)
	app.post('/twitter', twitterController.callback)
	// app.get('/twitter', twitterController.connect);
	// app.get('/getOrder', twitterController.getOrder);
};
