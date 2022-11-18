let socket = io();

const waitingLobby = document.getElementById('waitingLobby');
const lobbyCode = document.getElementById('lobbyCode');
const lobbyCodeInput = document.getElementById('lobbyCodeInput');
const joinBtn = document.getElementById('joinButton');

const mainGame = document.getElementById('mainGame');
const playerScoreSpan = document.getElementById('playerScore');
const opponentScoreSpan = document.getElementById('opponentScore');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const startBtn = document.getElementById('startButton');
const crazyBtn = document.getElementById('crazyButton');
const giveControlBtn = document.getElementById('giveControlButton');

// Global
var ROOM_NUM;

// Game Vars
var score = 0;
var isControlling = false;
const TIMER = 120;
var timer = TIMER;

socket.on('connect', () => {
  lobbyCode.innerText = socket.id;
});

joinBtn.addEventListener('click', () => {
  if (lobbyCodeInput.value !== '') {
    socket.emit('joinGame', lobbyCodeInput.value);
  }
});

startBtn.addEventListener('click', () => {
  socket.emit('startGame', ROOM_NUM);
});

crazyBtn.addEventListener('click', () => {
  crazyClicked();
})

giveControlBtn.addEventListener('click', () => {
  giveControl();
})

socket.on('joinGame', () => {
  hideLobby();
});

socket.on('startGame', () => {
  startGame();
});

socket.on('startTimer', (currentTimer) => {
  startTimer(currentTimer);
});

socket.on('updateOpponentScore', (opponentScore) => {
  updateOpponentScore(opponentScore)
});

socket.on('disableControl', () => {
  disableControl();
});

socket.on('takeControl', () => {
  takeControl();
});

socket.on('setRoomNumber', (lobbyCode) => {
  ROOM_NUM = lobbyCode;
})

function hideLobby() {
  waitingLobby.style.display = "none";
  mainGame.style.display = "block";
}

function disableControl() {
  isControlling = false;

  giveControlBtn.disabled = true;
  crazyBtn.style.background = "gray";
}

function takeControl() {
  isControlling = true;

  giveControlBtn.disabled = false;
  crazyBtn.style.background = "red";
}

function giveControl() {
  disableControl();

  socket.emit('giveControl', ROOM_NUM);
}

function updateOpponentScore(opponentScore) {
  opponentScoreSpan.innerText = opponentScore;
}

function startGame() {
  setInterval(function() {
    socket.emit('startTimer', ROOM_NUM, timer);
    timer--;
  }, 1000);

  isControlling = true;

  startBtn.style.display = "none";
  crazyBtn.style.display = "block";
  giveControlBtn.style.display = "block";
}

function startTimer(currentTimer) {
  var minutes = "0" + Math.floor(currentTimer / 60);
  var seconds = currentTimer % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutesSpan.innerText = minutes;
  secondsSpan.innerText = seconds;
}

function crazyClicked() {

  if (!isControlling) {
    socket.emit("takeControl", ROOM_NUM);

    takeControl();
  } else {
    score++;

    socket.emit("updateOpponentScore", ROOM_NUM, score);

    playerScore.innerText = score;

    crazyBtn.style.top = (40 + Math.random() * 40) + '%';
    crazyBtn.style.left = (10 + Math.random() * 80) + '%';
    crazyBtn.style.animation = "none";
  }
}

// debug
socket.on('testFn', () => {
  alert("test");
});