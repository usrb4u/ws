// Load the TCP Library
// var server = require("net").createServer();
// var io = require("socket.io")(server);
var app = require("express");
var serv = require('http').Server(app);
var server = require('net').createServer(serv);

// Keep track of the chat clients
var clients = [];


// var handleClient = function (socket) {
//     // we've got a client connection
//     socket.emit("tweet", {user: "nodesource", text: "Hello, world!"});
// };

// io.on("connection", handleClient);

server.on('connection', function(sock) {
	clients.push(sock);
	
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
	//sock.write("Welcome " + sock.remoteAddress + "\n");
	
	
	sock.on('data', function(buff) {
		//broadcast(sock.remoteAddress + "> " + buff.toString('utf8'), sock);
		broadcast(buff.toString('utf8'), sock);
	});
	
	sock.on('end', function() {
		for(var i = 0;i<clients.length; i++)
		{
			if((sock.remoteAddress == clients[i].remoteAddress) && 
			(sock.remotePort == clients[i].remotePort)) {
				console.log('DISCONNECTED: ' + clients[i].remoteAddress +':'+ clients[i].remotePort);
				clients.splice(i,1);
				break;
			}
		}
	});
});

server.on('error', function(err) {
	throw err;
});
// server is getting closed because of pressing ctrl+c
process.on('SIGINT', function() {
	server.close();
	console.log("Server is closed because of pressing ctrl + c");
});

server.on('close', function() {
	console.log('server closed');
});


server.listen(8080,'192.168.1.13');
console.info("TCP server listening on " + 8080);

console.log("tcp server running at port 8080\n");