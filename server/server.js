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

server.listen(port, ()=> {
  console.log(`Server is up on port ${port}.`)
});

// TODO: Make it so broadcast only happen to room numbers.
// io.emit is gonna be io.sockets.in(lobbyCode)
// socket.broadcast.emit is gonna be socket.broadcast.to(lobbyCode).emit

io.on('connection', (socket) => {

  socket.on('joinGame', (lobbyCode) => {
    io.emit('setRoomNumber', lobbyCode);
    io.emit('joinGame');
  })

	socket.on('startGame', (lobbyCode) => {
    io.emit('startGame');
    socket.broadcast.emit('disableControl');
  })

  socket.on('startTimer', (lobbyCode, timer) => {
    io.emit('startTimer', timer);
  })

  socket.on('takeControl', (lobbyCode) => {
    socket.broadcast.emit('disableControl');
  })

  socket.on('giveControl', (lobbyCode) => {
    socket.broadcast.emit('takeControl');
  })

  socket.on('updateOpponentScore', (lobbyCode, opponentScore) => {
    socket.broadcast.emit('updateOpponentScore', opponentScore);
  })

});
