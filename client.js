const WebSocket = require('net');
var events = require('events');
var emtr = new events.EventEmitter();

const ws = new WebSocket.Socket();
ws.connect(8080,'192.168.1.101',function(){
    console.log('connected');
    // ws.write('From Client:::');
})

emtr.on('COMMON_CONFIG_DATA',function(){

    ws.write(JSON.stringify({"PACKET_ID":"COMMON_CONFIG_SUCCESS"}));
})

emtr.on('DEV_REG_REQUEST',function(){
    ws.write(JSON.stringify({"PACKET_ID":"REGDATA_RESPONSE","UM_AVAIL_STAT":"UM_PRESENT"}));
})

emtr.on('DEV_ID_REQUEST',function(){
    ws.write(JSON.stringify({"PACKET_ID":"DEVID_RESPONSE","DEVID":"DEV2134"}))
})

ws.on('open', function open() {
  console.log('connected');
//   ws.send(Date.now());
});

ws.on('close', function close() {
  console.log('disconnected');
});


ws.on('data', function incoming(data, flags) {
    console.log(data);
    data = data.toString('utf-8').replace('}{', '} , {')
    var mess = data.toString('utf-8').split(' , ')
    for(var i=0; i<mess.length; i++) {
    
        var pkt = JSON.parse(mess[i]);
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
            // emtr.emit('UM_AIN1_CONFIG');
            ws.write(JSON.stringify({"PACKET_ID":"UM_CONFIG_SUCCESS"}))
            break;
        case 'UM_AIN2_CONFIG' :
            // console.log(pkt);
            // emtr.emit('UM_AIN2_CONFIG');
            ws.write(JSON.stringify({"PACKET_ID":"UM_CONFIG_SUCCESS"}))
            break;
        case 'DEV_REG_REQUEST':
            // console.log(pkt);
            emtr.emit('DEV_REG_REQUEST');

        }
    }
    
//   console.log(`Roundtrip time: ${Date.now() - data} ms`, flags);

//   setTimeout(function timeout() {
//     ws.send('Acknowledgement success');
//   }, 500);
});