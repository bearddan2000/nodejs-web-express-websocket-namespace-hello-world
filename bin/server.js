var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var clicks = 0;
var namespaceClick = 0;
let path = "/resources/";

app.get('/', function(req, res) {
  res.sendFile(__dirname + path + 'index.html');
});

app.get('/page1', function(req, res) {
  io.on('connection', function(socket) {
    socket.emit('announcements', { message: 'A new user has joined!' });
  });
  res.sendFile(__dirname + path + 'page1.html');
});

app.get('/page2', function(req, res) {
  io.on('connection', function(socket) {
    socket.on('event', function(data) {
        console.log('A client sent us this message:', data.message);
    });
  });
  res.sendFile(__dirname + path + 'page2.html');
});

app.get('/page3', function(req, res) {
  io.on('connection', function(socket) {
    socket.emit('clickResponse', { message: clicks });
    socket.on('clickRequest', function(data) {
      socket.emit('clickResponse', { message: clicks++ });
    });
  });
  res.sendFile(__dirname + path + 'page3.html');
});

app.get('/page4', function(req, res) {
  let ioa = io.of("/click")
  ioa.on('connection', function(socket) {
    socket.emit('clickResponse', { message: namespaceClick });
    socket.on('clickRequest', function(data) {
      socket.emit('clickResponse', { message: namespaceClick++ });
    });
  });
  res.sendFile(__dirname + path + 'page4.html');
});

server.listen(8000);
