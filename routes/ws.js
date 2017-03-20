
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
        "DEVICEID":"",
        "CUSTOMER_ID":"",
        "DS_IPADDR":"",
        "DS_PORTNUMBER":1025,
        "TS_IPADDR":"",
        "TS_PORTNUMBER":21,
        "PROTOCOL_SELECTED":'0',
        "DATA_FORMAT": '0',
        "DATA_XMIT_FREQ": '0', 
        "DEVICE_ALIAS_NAME":"ALIAS_NAME", 
        "DEVICE_CATEGORY":"WIRED_WITH_ETHERNET", 
        "INSTALLED_LOCATION":"MARATHALLI", 
        "PLATFORM_SUPPORTED":'0', 
        "WIFI_NAME":"NAME", 
        "WIFI_PASSWORD":"PASSOWORD",  
        "DS_URL":"dweet.io", 
        "FREEBOARD_THING_NAME":"tangent"
    }


    eventEmitter.on('COMMON_CONFIG_DATA',function(ipAddr,devId,resp,um_data){
        console.log('Processing common config data');
        initial_packet.DEVICEID = devId;
        // initial_packet.DS_IPADDR=ipAddr.split(':')[0];
        // initial_packet.TS_IPADDR = ipAddr.split(':')[0];
        if(clients[ipAddr]!=undefined){
            console.log(clients[ipAddr].common_config);
            if(clients[ipAddr].common_config!='')
                initial_packet = clients[ipAddr].common_config;
            clients[ipAddr].write(JSON.stringify(initial_packet));
            
            if(um_data!=undefined)
                clients[ipAddr].um_data = um_data
            if(resp!==undefined)
                clients[ipAddr].resp = resp;
        }else {
            eventEmitter.emit('changeStatus',ipAddr,false);
            resp.json('offline');
        }        
        
    })
 
    eventEmitter.on('COMMON_CONFIG_SUCCESS',function(ipAddr){
        
        if(clients[ipAddr].um_data!==''){
            console.log(' Processing UM_CONFIG_DATA information...');
            eventEmitter.emit('UM_CONFIG',ipAddr,clients[ipAddr].um_data);
            clients[ipAddr].um_data='';
        }
        else
            clients[ipAddr].resp.json('success');
        
    });

    eventEmitter.on('UPDATE_COMMON_DATA',function(ipAddr,data){
        // initial_packet = data;
        if(clients[ipAddr]!=undefined)
        clients[ipAddr].common_config = data;
    })

    eventEmitter.on('REGDATA_RESPONSE',function(ipAddr){

        // ws.write(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}));
    });
    
    eventEmitter.on('DEVID_RESPONSE',function(devId,ipAddress,port){
        //db check and register here.
        
            Device.find({deviceId:devId}).lean().exec(function(err, rec) {
                if(err)
                    console.log(err);
                else {
                    if(rec.length==0){
                        var device = new Device({
                            deviceId:devId,
                            ipAddress:ipAddress,
                            port:port,
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
                            ipAddress:ipAddress,
                            port:port
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
                clients[ipAddress+':'+port].write(JSON.stringify({"PACKET_ID":"DEV_REG_REQUEST"}));
            };
            
        });
        // }
    });
    
    eventEmitter.on('UM_CONFIG_SUCCESS',function(ipAddr){
        
        clients[ipAddr].resp.json('success');
    });

    eventEmitter.on('UM_CONFIG_FAILURE',function(ipAddr){
        // clients[ipAddr].resp_success = false;
        clients[ipAddr].resp.json('failed');
        
    });

    

    eventEmitter.on('UM_CONFIG',function(ipAddr,data){
        clients[ipAddr].write(JSON.stringify(data));
    })

    eventEmitter.on('changeStatus',function(ip,stat){
        var ipAddr = ip.split(':')[0];
        var port = ip.split(':')[1];

        Device.update({ipAddress:ipAddr,port:port}, {
                    $set: {
                        status: stat,
                        ipAddress:'',
                        port:''
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
        console.log(ws.remotePort);
        console.log(ws.remoteFamily);
        // client.push(ws);
        ws.key = ws.remoteAddress +':'+ws.remotePort;
        ws.resp='';
        
        ws.um_data='';
        ws.common_config='';
        clients[ws.key] = ws;
        
        clients[ws.key].write(JSON.stringify({"PACKET_ID":"DEV_ID_REQUEST"}))

        ws.on('data', function incoming(message) {
            console.log(message.toString('utf-8'));
            message = message.toString('utf-8').replace(/}{/g , "} , {")
            var mess = message.toString('utf-8').split(' , ');
                for(var i=0; i<mess.length; i++) {
                    resp = JSON.parse(mess[i]);
                // console.log(resp);
                
                switch(resp.PACKET_ID) {
                case 'COMMON_CONFIG_SUCCESS':
                    // console.log(resp);
                    eventEmitter.emit('COMMON_CONFIG_SUCCESS',ws.key);
                    break;
                case 'REGDATA_RESPONSE':
                    // console.log(resp);
                    eventEmitter.emit('REGDATA_RESPONSE',ws.key);
                    break;
                
                case 'UM_CONFIG_SUCCESS' :
                    // console.log(resp);
                    eventEmitter.emit('UM_CONFIG_SUCCESS',ws.key);
                    break;
                case 'UM_CONFIG_FAILURE':
                    eventEmitter.emit('UM_CONFIG_FAILURE',ws.key);
                    break;
                    
                case 'DEVID_RESPONSE':
                    
                    eventEmitter.emit('DEVID_RESPONSE',resp.DEVID,ws.remoteAddress,ws.remotePort);
                    break;
                }
            }
                
        });

        ws.on('close',function(){
            console.log('close event called');
        })

        ws.on('error',function(err){
            console.log('Error event triggered '+err);
            eventEmitter.emit('changeStatus',ws.key,false);
        })
        ws.on('end',function close(){
            eventEmitter.emit('changeStatus',ws.key,false);
            ws.pause();
            clients[ws.key] = '';
            
            delete clients[ws.key]
            // delete clients[""];
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

