const express = require('express');
const http = require( 'http');
const WebSocket = require( 'ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

const server = http.createServer( app);

server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

const ws = new WebSocket.Server({server});
ws.on( 'connection', (sock, req) => {
  // console.log( "websocket on connection", sock, req);
  sock.send( JSON.stringify( { success: true, message: "connected"}));
  sock.on( 'message', (msg) => {
    // console.log( "socket message:", msg);
    const json = JSON.parse( msg)
    console.log( "got data:", json);
    sock.send( JSON.stringify( {success: true, message: "ack"}));
  });
});
