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
        // console.log('Initial acceptance:');
        // console.log(info.req.connection);
        return cb(true);
    }
 })

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
var resp='';
var initial_packet = {
    "PACKET_ID":"COMMON_CONFIG_DATA",
    "GPS_EN_STATUS":"DIASBLE",
    "DEVICEID":"XYZUVWCD123",
    "CUSTOMER_ID":"CUST9926",
    "DS_IPADDR":"192.168.1.12",
    "DS_PORTNUMBER":1025,
    "TS_IPADDR":ws._socket.remoteAddress,
    "TS_PORTNUMBER":21,
    "PROTOCOL_SELECTED":0,
    "DATA_FORMAT":0
}
 
 eventEmitter.on('COMMON_CONFIG_SUCCESS',function(){
     ws.send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
 });

eventEmitter.on('DEV_ID_REQUEST',function(){
     ws.send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
 });
 
 eventEmitter.on('DEV_REG_REQUEST',function(){
     ws.send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
 });
 
 eventEmitter.on('COMMON_CONFIG_SUCCESS',function(){
     ws.send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
 });
 
 eventEmitter.on('COMMON_CONFIG_SUCCESS',function(){
     ws.send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
 });
 

    ws.send(JSON.stringify(initial_packet))
  ws.on('message', function incoming(message) {
      resp = JSON.parse(message);
      console.log(resp);
      switch(resp.PACKET_ID) {
    case 'COMMON_CONFIG_SUCCESS':
        console.log(resp);
        eventEmitter.emit('COMMON_CONFIG_SUCCESS');
        break;
    case 'DEV_ID_REQUEST':
        console.log(resp);
        eventEmitter.emit('DEV_ID_REQUEST');
        break;
    case 'UM_AIN1_CONFIG':
        console.log(resp);
        eventEmitter.emit('UM_AIN1_CONFIG');
        break;
    case 'UM_AIN2_CONFIG' :
        console.log(resp);
        eventEmitter.emit('UM_AIN2_CONFIG');
        break;
    case 'DEV_REG_REQUEST':
        console.log(resp);
        eventEmitter.emit('DEV_REG_REQUEST');
    }
       
    // console.log('received: %s', message);
  });

eventEmitter.on('hello', function(data){
    //   console.log('hiiiii');
      console.log(data);
      ws.send(JSON.stringify(data));
  })

  ws.on('close',function close(){
    console.log('disconnected');
  })
  

//   ws.send(JSON.stringify({'hello':'world'}));
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
