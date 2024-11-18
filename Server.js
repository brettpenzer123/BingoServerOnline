const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })


wss.on('open', function open() {
  console.log('connected');
  ws.send(Date.now());
});

wss.on('close', function close() {
  console.log('disconnected');
});

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
})

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
	console.log(data);
  });
});