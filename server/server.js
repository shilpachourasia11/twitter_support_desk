const app = require('./app.js');
const http = require('http');
let db=require('./sqldb')
const port = parseInt(process.env.PORT, 10) || 3000;

app.set('port', port);

const server = http.createServer(app);
var io = require('socket.io')(server);


db.connection.sync({ force: false})
.then(() => {
  server.listen(port);
})
.catch((err) => {
	console.log("Server failed to start due to error: ", err);
})
