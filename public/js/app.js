let socket = io();

const mainGame = document.getElementById('mainGame');
const playerScoreSpan = document.getElementById('playerScore');
const opponentScoreSpan = document.getElementById('opponentScore');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const startBtn = document.getElementById('startButton');
const crazyBtn = document.getElementById('crazyButton');
const giveControlBtn = document.getElementById('giveControlButton');

const ROOM_ID = location.pathname;

// Game Vars
var score = 0;
var isControlling = false;
const TIMER = 120;
var timer = TIMER;

startBtn.addEventListener('click', () => {
  socket.emit('startGame', ROOM_ID);
});

crazyBtn.addEventListener('click', () => {
  crazyClicked();
})

giveControlBtn.addEventListener('click', () => {
  giveControl();
})

socket.on("connect", () => {
  socket.emit("joinRoom", ROOM_ID);
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

  socket.emit('giveControl', ROOM_ID);
}

function updateOpponentScore(opponentScore) {
  opponentScoreSpan.innerText = opponentScore;
}

function startGame() {
  setInterval(function() {
    socket.emit('startTimer', ROOM_ID, timer);
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
    socket.emit("takeControl", ROOM_ID);

    takeControl();
  } else {
    score++;

    socket.emit("updateOpponentScore", ROOM_ID, score);

    playerScore.innerText = score;

    crazyBtn.style.top = (40 + Math.random() * 40) + '%';
    crazyBtn.style.left = (10 + Math.random() * 80) + '%';
    crazyBtn.style.animation = "none";
  }
}