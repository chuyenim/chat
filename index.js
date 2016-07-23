var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('socket', socket);
    socket.on('join', function(data) {
        socket.room = data.room;
        socket.user = data;
        socket.join(data.room);
        socket.broadcast.to(socket.room).emit('user_connected', socket.user);
    });
    socket.on('leave', function(roomData) {
        socket.leave(roomData);
    });
	socket.on('switch_room', function(newRoom) {
        socket.leave(socket.room);
        socket.room = newRoom;
        socket.join(newRoom);
	});
    socket.in(socket.room).on('chat_message', function(msg){
		var data = socket.user;
		data.msg = msg;
        io.to(socket.room).emit('chat_message', data);
    });
    socket.in(socket.room).on('disconnect', function() {
        socket.broadcast.to(socket.room).emit('user_disconnect', socket.user);
        socket.leave(socket.room);
    });
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});
