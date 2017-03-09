
const http = require('http');
const WebSocket = require('ws');
// var events = require('events');
// var eventEmitter = new events.EventEmitter();
const url = require('url');
var config = require('../config/config.js');

var Device = require('../model/device');
var mongoose = require('mongoose');

module.exports = function(app,eventEmitter) {
    
    const server = http.createServer(app);
    var netServ =  require('net').createServer(server);
    var clients = {};
    
    // eventEmitter.setMaxListeners(1);

    var initial_packet = {
        "PACKET_ID":"COMMON_CONFIG_DATA",
        "GPS_EN_STATUS":"DISABLE",
        "DEVICEID":"XYZUVWCD123",
        "CUSTOMER_ID":"CUST9926",
        "DS_IPADDR":"192.168.1.12",
        "DS_PORTNUMBER":1025,
        "TS_IPADDR":'',
        "TS_PORTNUMBER":21,
        "PROTOCOL_SELECTED":0,
        "DATA_FORMAT":0,
        "DATA_XMIT_FREQ":0
    }

    var resp_success = true;;

    eventEmitter.on('COMMON_CONFIG_DATA',function(ipAddr,devId,resp,tVal){
        console.log('Processing common config data');
        initial_packet.DEVICEID = devId;
        initial_packet.DS_IPADDR=ipAddr;
        initial_packet.TS_IPADDR = ipAddr;
        clients[ipAddr].write(JSON.stringify(initial_packet));
        clients[ipAddr].mcount=tVal;
        clients[ipAddr].count=0;
        if(resp!==undefined)
            clients[ipAddr].resp = resp;
        // status = false;
    })
 
    eventEmitter.on('COMMON_CONFIG_SUCCESS',function(ipAddr){
        // clients[ws.key].write(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
        // clients[ws.resp].json('success');
        eventEmitter.emit('CL_RESP',ipAddr);
    });

    eventEmitter.on('CL_RESP',function(ipAddr){
        clients[ipAddr].count = clients[ipAddr].count +1;
        if(clients[ipAddr].count==clients[ipAddr].mcount){
            clients[ipAddr].mcount=0;
            clients[ipAddr].count=0;
            if(resp_success)
                clients[ipAddr].resp.json('success');
            else
                clients[ipAddr].resp.json('failed');
            
        }
            
    })

    eventEmitter.on('REGDATA_RESPONSE',function(ipAddr){

        // ws.write(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
    });
    
    eventEmitter.on('DEVID_RESPONSE',function(devId,ipAddress){
        //db check and register here.
        // if(clients[ipAddress].flag){
        //     clients[ipAddress].flag = false;
        
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
                                res.status(500).write({ message: err.message });
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
                            ipAddress:ipAddress
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
                // console.log(clients);
                clients[ipAddress].write(JSON.stringify({"PACKET_ID":"DEV_REG_REQUEST"}));
            };
            
        });
        // }
    });
    
    eventEmitter.on('UM_CONFIG_SUCCESS',function(ipAddr){
        eventEmitter.emit('CL_RESP',ipAddr);
    });

    eventEmitter.on('UM_CONFIG_FAILURE',function(ipAddr){
        resp_success = false;
        eventEmitter.emit('CL_RESP',ipAddr);
    });

    eventEmitter.on('UM_AIN1_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
    });
    
    eventEmitter.on('UM_AIN2_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
    });

    eventEmitter.on('UM_DIN1_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
    });
    
    eventEmitter.on('UM_DIN2_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
    });

    eventEmitter.on('UM_AOUT1_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
    });
    
    eventEmitter.on('UM_AOUT2_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
    });

    eventEmitter.on('UM_DOUT1_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
    });
    
    eventEmitter.on('UM_DOUT2_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
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
                        console.log('updated device for quit');
                        // console.log(docs);
                    }
               })

    })

    netServ.on('connection', function connection(ws) {
    
        console.log('connected new Device')
        console.log(ws.remoteAddress);
        // client.push(ws);
        ws.key = ws.remoteAddress ;
        ws.resp='';
        ws.count=0;
        ws.mcount=0;
        // ws.flag=true;
        clients[ws.key] = ws;
        // console.log(clients);
        // var status = false;
        // console.log(ws.key);

        // You might use location.query.access_token to authenticate or share sessions
        // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
        // var resp='';
        

        
        

        clients[ws.key].write(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}))

        ws.on('data', function incoming(message) {
            console.log(message.toString('utf-8'));
            message = message.toString('utf-8').replace('}{', '} , {')
            var mess = message.toString('utf-8').split(' , ');
                for(var i=0; i<mess.length; i++) {
                    resp = JSON.parse(mess[i]);
                // console.log(resp);
                
                switch(resp.PACKET_ID) {
                case 'COMMON_CONFIG_SUCCESS':
                    // console.log(resp);
                    eventEmitter.emit('COMMON_CONFIG_SUCCESS',ws.remoteAddress);
                    break;
                case 'REGDATA_RESPONSE':
                    // console.log(resp);
                    eventEmitter.emit('REGDATA_RESPONSE',ws.remoteAddress);
                    break;
                case 'UM_AIN1_CONFIG':
                    // console.log(resp);
                    eventEmitter.emit('UM_AIN1_CONFIG');
                    break;
                case 'UM_CONFIG_SUCCESS' :
                    // console.log(resp);
                    eventEmitter.emit('UM_CONFIG_SUCCESS',ws.remoteAddress);
                    break;
                case 'UM_CONFIG_FAILURE':
                    eventEmitter.emit('UM_CONFIG_FAILURE',ws.remoteAddress);
                    break;
                    
                case 'DEVID_RESPONSE':
                    // console.log(resp);
                    // clients[ws._socket.remoteAddress] = ws;
                    eventEmitter.emit('DEVID_RESPONSE',resp.DEVID,ws.remoteAddress);
                }
            }
                
        });

        ws.on('end',function close(){
            eventEmitter.emit('changeStatus',ws.key,false);
            ws.pause();
            clients[ws.key] = '';
            
            delete clients[ws.key]
            delete clients[""];
            // console.log(clients);

            console.log(ws.key);
            console.log('disconnected : ');
        })
  

    });

    netServ.listen(config.TCP_PORT, config.ipAddress,function listening() {
        // console.log(config.COMMON_CONFIG);
        console.log('TCP Server Listening on %d', config.TCP_PORT);
    });
    server.listen(config.HTTP_PORT,config.ipAddress,function(){
        console.log('http server running on '+config.HTTP_PORT);
    })


}

