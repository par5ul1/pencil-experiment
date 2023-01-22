const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socket(server);

app.use(express.static(publicPath));

app.get('/:room', (req, res) => {
  res.sendFile(path.join(__dirname+'/../public/index.html'));
});

server.listen(port, ()=> {
  console.log(`Server is up on port ${port}.`)
});

// TODO: Make it so broadcast only happen to room numbers.
// io.emit is gonna be io.sockets.in(roomId)
// socket.broadcast.emit is gonna be socket.to(roomId).broadcast.emit

io.on('connection', (socket) => {

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId)
  })

  socket.on('startGame', (roomId) => {
    io.sockets.in(roomId).emit('startGame');
    socket.broadcast.to(roomId).emit('disableControl');
  })

  socket.on('startTimer', (roomId, timer) => {
    io.sockets.in(roomId).emit('startTimer', timer);
  })

  socket.on('takeControl', (roomId) => {
    socket.broadcast.to(roomId).emit('disableControl');
  })

  socket.on('giveControl', (roomId) => {
    socket.broadcast.to(roomId).emit('takeControl');
  })

  socket.on('requestControl', (roomId) => {
    socket.broadcast.to(roomId).emit('displayRequestControl');
  })

  socket.on('updateOpponentScore', (roomId, opponentScore) => {
    socket.broadcast.to(roomId).emit('updateOpponentScore', opponentScore);
  })

});