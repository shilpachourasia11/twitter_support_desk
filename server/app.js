const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
let env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "x-requested-with, Content-Type, origin, authorization, accept, client-security-token");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('dist'));

var normalizedPath = require("path").join(__dirname, "routes");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./routes/" + file)(app);
});


module.exports = app;
