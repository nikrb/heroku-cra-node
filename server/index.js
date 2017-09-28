const express = require('express');
const http = require( 'http');
const WebSocket = require( 'ws');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const app = express();
const PORT = process.env.PORT || 5000;
let db = null;
MongoClient.connect( "mongodb://nik:nik9@ds149954.mlab.com:49954/fcc", function(err, dbc) {
  if( err){
    console.log( "mongo connect error:", err);
  } else {
    db = dbc;
  }
});

const fetchTestData = () => {
  return db.collection( 'test')
  .find({})
  .toArray();
};

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get( '/api/test', function( req, res){
  fetchTestData()
  .then( (data) => {
    res.send( data);
  });
});

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
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
