var app = require('express')();
var express =require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('socket'));

io.on('connection', function(socket){

  socket.on('friend', function(fr){
    users.push(fr);
    io.emit('online', users);
  })

  socket.on("chat message", function(msg){
    io.emit(msg.user, msg);
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
