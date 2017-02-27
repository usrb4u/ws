const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8080/');

ws.on('open', function open() {
  console.log('connected');
  ws.send(Date.now());
});

ws.on('close', function close() {
  console.log('disconnected');
});


ws.on('message', function incoming(data, flags) {
    console.log(data);
    ws.on('msg',function outgoing(){
        ws.send('Acknowledgement');
    })
//   console.log(`Roundtrip time: ${Date.now() - data} ms`, flags);

//   setTimeout(function timeout() {
//     ws.send('Acknowledgement success');
//   }, 500);
});