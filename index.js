var app = require('express')();
var express =require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var users = [];
var count= 0; //message count

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index1.html');
});

app.use(express.static('socket'));

io.on('connection', function(socket){

  socket.on('friend', function(fr){
    users.push(fr);
    io.emit('online', users);
  })

  socket.on('typing', function(status){
    socket.broadcast.emit('typing status',status);
  });

  socket.on("chat message", function(msg){
    msg["count"] = ++count;
    io.emit('message', msg);
  });

  socket.on('private message', function(msg){
    io.emit(msg.receiver, msg);
  })

});

http.listen(port, '0.0.0.0',function(){
  console.log('listening on *:' + port);
});
