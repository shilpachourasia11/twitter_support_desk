const app = require('./app.js');
const http = require('http');
let db=require('./sqldb')
let config = require('./config/environment');
const port = config.port;
console.log(config)
app.set('port', port);

const server = http.createServer(app);

const socketIO = require('socket.io')
const io = socketIO(server)

io.on('connection', socket => {
  console.log('New client connected')
  let twitterController = require('./controllers/twitter');

  socket.on('tweet_notification', (data) =>{
    twitterController.streamTweets(data, io);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

db.connection.sync({ force: false})
.then(() => {
  server.listen(port);
})
.catch((err) => {
	console.log("Server failed to start due to error: ", err);
})
