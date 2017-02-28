const express = require('express');
// const http = require('http');

var path = require('path');
const WebSocket = require('ws');

var config = require('./config/config.js');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
const app = express();



var routes = require('./routes/index');
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUri, function(error) {
	if (error) {
		console.log(error);
	}
});

app.engine('html',require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine','html');
app.use('/',routes);

require('./routes/ws.js')(app);
require('./routes/api.js')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;