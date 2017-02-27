const express = require('express');
const http = require('http');
const url = require('url');
var path = require('path');
const WebSocket = require('ws');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
const app = express();

// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });


const server = http.createServer(app);

var routes = require('./routes/index');
// var db = mongoose.connect('mongodb://127.0.0.1:27017/test');

app.engine('html',require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine','html');
app.use('/',routes);

const wss = new WebSocket.Server({ server,
    verifyClient:function(info,cb){
        console.log('Initial acceptance:');
        // console.log(info.req.connection);
        return cb(true);
    }
 })

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

//   console.log(ws);
console.log(ws._socket.remoteAddress);
// console.log(location);
ws.send('After acceptance from server')

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

eventEmitter.on('hello', function(data){
    //   console.log('hiiiii');
      console.log(data);
      ws.send(JSON.stringify(data));
  })

  ws.on('close',function close(){
    console.log('disconnected');
  })
  

  ws.send(JSON.stringify({'hello':'world'}));
});

// app.get('/',function(req,res){
//     var data = {'name':'srinivas'};
//     // evt.emit('hello')
//     eventEmitter.emit('hello',data);
//     res.send('hello world');
// })



server.listen(8080, '127.0.0.1',function listening() {
  console.log('Listening on %d', server.address().port);
});