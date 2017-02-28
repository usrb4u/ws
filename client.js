const WebSocket = require('ws');
var events = require('events');
var emtr = new events.EventEmitter();

const ws = new WebSocket('ws://127.0.0.1:8080/');

emtr.on('COMMON_CONFIG_DATA',function(){

    ws.send(JSON.stringify({"PACKET_ID":"COMMON_CONFIG_SUCCESS"}));
})

emtr.on('DEV_REG_REQUEST',function(){
    ws.send(JSON.stringify({"PACKET_ID":"REGDATA_RESPONSE","UM_AVAIL_STAT":"UM_PRESENT"}));
})

emtr.on('DEV_ID_REQUEST',function(){
    ws.send(JSON.stringify({"PACKET_ID":"DEVID_RESPONSE","DEVID":"DEV2134"}))
})

ws.on('open', function open() {
  console.log('connected');
//   ws.send(Date.now());
});

ws.on('close', function close() {
  console.log('disconnected');
});


ws.on('message', function incoming(data, flags) {
    console.log(data);
    var pkt = JSON.parse(data);
    console.log(pkt.PACKET_ID);
    switch(pkt.PACKET_ID) {
    case 'COMMON_CONFIG_DATA':
        emtr.emit('COMMON_CONFIG_DATA');
        break;
    case 'DEV_ID_REQUEST':
        emtr.emit('DEV_ID_REQUEST');
        break;
    case 'UM_AIN1_CONFIG':
        // console.log(pkt);
        emtr.emit('UM_AIN1_CONFIG');
        break;
    case 'UM_AIN2_CONFIG' :
        // console.log(pkt);
        emtr.emit('UM_AIN2_CONFIG');
        break;
    case 'DEV_REG_REQUEST':
        // console.log(pkt);
        emtr.emit('DEV_REG_REQUEST');
    }
    
//   console.log(`Roundtrip time: ${Date.now() - data} ms`, flags);

//   setTimeout(function timeout() {
//     ws.send('Acknowledgement success');
//   }, 500);
});