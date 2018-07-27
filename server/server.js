const app = require('./app.js');
const http = require('http');
let db=require('./sqldb')
const port = parseInt(process.env.PORT, 10) || 3000;

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

  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('tweet', (color) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('Color Changed to: ', color)
    io.sockets.emit('tweet', color)
  })

  // disconnect is fired when a client leaves the server
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
