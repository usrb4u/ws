
const http = require('http');
const WebSocket = require('ws');
var events = require('events');
var eventEmitter = new events.EventEmitter();
const url = require('url');
var config = require('../config/config.js');

var Device = require('../model/device');
var mongoose = require('mongoose');

module.exports = function(app) {
    
    const server = http.createServer(app);
    var clients = {};
    const wss = new WebSocket.Server({ server,
        verifyClient:function(info,cb){
            // console.log('Initial acceptance:');
            // console.log(info.req.connection);
            // console.log(info.origin);
            return cb(true);
        }
    })

    wss.on('connection', function connection(ws) {
    const location = url.parse(ws.upgradeReq.url, true);
    // console.log(location);

    ws.key = ws._socket.remoteAddress ;
    clients[ws.key] = ws;
    console.log(ws.key);

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

    eventEmitter.on('REGDATA_RESPONSE',function(){

        // ws.send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
    });
    
    eventEmitter.on('DEVID_RESPONSE',function(devId,ipAddress){
        //db check and register here.
        
        Device.find({deviceId:devId}).lean().exec(function(err, rec) {
            if(err)
                console.log(err);
            else {
                if(rec.length==0){
                    var device = new Device({
                        deviceId:devId,
                        ipAddress:ipAddress,
                        status: true,
                        aliasName:'',
                        userName:'',
                        regDate:new Date()
                    })
                device.save(function(err, result) {
                        if (err) {
                            res.status(500).send({ message: err.message });
                        }else {
                            // res.json(result);
                            console.log('Device registered in db:');
                            console.log(result);
                        }
                        
                  });
               } else {
                Device.update({deviceId:devId}, {
                    $set: {
                        status: true,
                    }
                }).lean().exec(function (err, docs) {
                    if (err) {
                        console.log('Device Id record update failed.. ' + err);
                    }
                    else{
                        // res.json('success');
                        console.log('updated device');
                        console.log(docs);
                    }
               })
               
            }

            clients[ws.key].send(JSON.stringify({"PACKET_ID":"DEV_REG_REQUEST"}));
        };
        
      });
    });
    
    eventEmitter.on('COMMON_CONFIG_SUCCESS',function(){
        clients[ws.key].send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
    });
    
    eventEmitter.on('COMMON_CONFIG_SUCCESS',function(){
        clients[ws.key].send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
    });
    eventEmitter.on('changeStatus',function(ip,stat){

        Device.update({ipAddress:ip}, {
                    $set: {
                        status: stat,
                    }
                }).lean().exec(function (err, docs) {
                    if (err) {
                        console.log('Device Id record update failed.. ' + err);
                    }
                    else{
                        // res.json('success');
                        console.log('updated device');
                        console.log(docs);
                    }
               })

    })
    

    clients[ws.key].send(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}))

    ws.on('message', function incoming(message) {
        resp = JSON.parse(message);
        console.log(resp);
        switch(resp.PACKET_ID) {
        case 'COMMON_CONFIG_SUCCESS':
            // console.log(resp);
            eventEmitter.emit('COMMON_CONFIG_SUCCESS');
            break;
        case 'REGDATA_RESPONSE':
            // console.log(resp);
            eventEmitter.emit('REGDATA_RESPONSE');
            break;
        case 'UM_AIN1_CONFIG':
            // console.log(resp);
            eventEmitter.emit('UM_AIN1_CONFIG');
            break;
        case 'UM_AIN2_CONFIG' :
            // console.log(resp);
            eventEmitter.emit('UM_AIN2_CONFIG');
            break;
        case 'DEVID_RESPONSE':
            // console.log(resp);
            // clients[ws._socket.remoteAddress] = ws;
            eventEmitter.emit('DEVID_RESPONSE',resp.DEVID,ws._socket.remoteAddress);
        }       
      });

    ws.on('close',function close(){
        eventEmitter.emit('changeStatus',ws.key,false);
        delete clients[ws.key]
        console.log(ws.key);
        console.log('disconnected : ');
    })
  

    });

    server.listen(8080, config.ipAddress,function listening() {
        // console.log(config.COMMON_CONFIG);
        console.log('Listening on %d', server.address().port);
    });


}

