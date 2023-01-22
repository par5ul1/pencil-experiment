let socket = io();

const mainGame = document.getElementById('mainGame');
const hud = document.getElementById('hud');
const playerScoreSpan = document.getElementById('playerScore');
const opponentScoreSpan = document.getElementById('opponentScore');
const waitingMsg = document.getElementById('waitingMsg');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const startBtn = document.getElementById('startButton');
const crazyBtn = document.getElementById('crazyButton');
const giveControlBtn = document.getElementById('giveControlButton');
const requestControlBtn = document.getElementById('requestControlButton');
const requestControlMsg = document.getElementById('requestControlMessage');

const endScreen = document.getElementById('endScreen');
const winStatus = document.getElementById('winStatus');


const ROOM_ID = location.pathname;

// Game Vars
var score = 0;
var isControlling = false;
const TIMER = 120;
const COOLDOWN = 2;
var cooldown = COOLDOWN;
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

requestControlBtn.addEventListener('click', () => {
  requestControl();
})

socket.on("connect", () => {
  socket.emit("joinRoom", ROOM_ID);
});

socket.on("allowStart", () => {
  waitingMsg.style.display = "none";
  startBtn.style.display = "block";
});

socket.on("revokeStart", () => {
  waitingMsg.style.display = "block";
  startBtn.style.display = "none";
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

socket.on('displayRequestControl', () => {
  displayRequestControl();
});

function disableControl() {
  isControlling = false;
  crazyBtn.innerHTML = cooldown;

  startCooldown();

  giveControlBtn.disabled = true;
  requestControlBtn.disabled = false;
  crazyBtn.style.background = "#44475a";
  crazyBtn.disabled = true;
  requestControlMsg.style.display = "none";
}

function takeControl() {
  isControlling = true;

  moveCrazy();

  giveControlBtn.disabled = false;
  requestControlBtn.disabled = true;
  crazyBtn.style.background = "red";
}

function giveControl() {
  disableControl();

  socket.emit('giveControl', ROOM_ID);
}

function requestControl() {
  socket.emit('requestControl', ROOM_ID);
}

function displayRequestControl() {
  requestControlMsg.style.display = "block";
}

function updateOpponentScore(opponentScore) {
  opponentScoreSpan.innerText = opponentScore;
}

function startGame() {
  mainTimer = setInterval(function() {
    socket.emit('startTimer', ROOM_ID, --timer);
    if (timer == 0) {
      clearInterval(mainTimer);
      endGame();
    }
  }, 1000);

  isControlling = true;

  hud.style.display = "block";
  startBtn.style.display = "none";
  crazyBtn.style.display = "block";
  giveControlBtn.style.display = "inline-block";
  requestControlBtn.style.display = "inline-block";
}

function endGame() {
  mainGame.style.display = "none";
  endScreen.style.display = "flex";
  endScreen.style.height = "100vh";
  endScreen.style.visibility = "visible";

  // This is an awful way of doing this. Literally inspect element will kill this. Don't do this.

  winStatus.innerHTML = score == opponentScoreSpan.innerHTML ? "You Tied." : (score > opponentScoreSpan.innerHTML ? "You Won!" : "You Lost.");
}

function startTimer(currentTimer) {
  var minutes = "0" + Math.floor(currentTimer / 60);
  var seconds = currentTimer % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutesSpan.innerText = minutes;
  secondsSpan.innerText = seconds;
}

function startCooldown() {
  var cooldownTimer = setInterval(function() {
    crazyBtn.innerHTML = --cooldown;
    if (cooldown == 0) {
      crazyBtn.disabled = false;
      crazyBtn.innerHTML = "";
      cooldown = COOLDOWN;
      clearInterval(cooldownTimer);
    }
  }, 1000);
}

function crazyClicked() {

  if (!isControlling) {
    socket.emit("takeControl", ROOM_ID);

    takeControl();
  } else {
    score++;

    socket.emit("updateOpponentScore", ROOM_ID, score);

    playerScore.innerText = score;

    moveCrazy();
  }
}

function moveCrazy() {
  crazyBtn.style.top = (30 + Math.random() * 60) + '%';
  crazyBtn.style.left = (10 + Math.random() * 80) + '%';
}