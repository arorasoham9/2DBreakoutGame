"use strict";
const grid = document.querySelector(".grid");
const scoredisp = document.querySelector("#score");
// const bwidth = 100;
// const bheight = 20;
let yadd = -30;
let startStop = 1;
//let gameover = 1;
let start = 0;
const boardWidth = 560;
const ballDia = 20;
const boardHeight = 300;
let timerId;
const blockWidth = 100;
const blockHeight = 20;
const startPos = [230, 10];
let curPos = startPos;
let iniDir = [-1, 1];
document.querySelector(".instructions").textContent = "Press enter to begin.";
// const dir = [1, 2, 3, 4, 13, 14, 23, 24];
// let iniDir = Math.floor(Math.random() * dir.length);
let yDir = 2;
let xDir = 2 * iniDir[Math.floor(Math.random() * iniDir.length)]; //[2, 2];
let score = 0;

const ballStart = [270, 35];
let ballCur = ballStart;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}
//add block objects to the blocks array
const blocks = [new Block(10, 270)];
for (let j = 0; j < 3; j++) {
  for (let i = 0; i < 4; i++) {
    blocks.push(
      new Block(
        blocks[i].bottomRight[0] + 10,
        blocks[i].bottomRight[1] + j * yadd
      )
    );
  }
  if (j && 1) {
    blocks.push(
      new Block(blocks[0].bottomLeft[0], blocks[0].bottomLeft[1] + j * yadd)
    );
  }
}

// console.log(blocks.length);

function addBlock(block) {
  const blocked = document.createElement("div");
  blocked.classList.add("block");
  blocked.style.left = block.bottomLeft[0] + "px";
  blocked.style.bottom = block.bottomLeft[1] + "px";
  grid.appendChild(blocked);
}

blocks.forEach(addBlock);

function resetUser() {
  user.style.left = curPos[0] + "px";
  user.style.bottom = curPos[1] + "px";
}

const user = document.createElement("div");
user.classList.add("block");
resetUser();
user.style.backgroundColor = "red";
grid.appendChild(user);
// console.log(user);

function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      curPos[0] -= 10 * (curPos[0] >= 10);
      // console.log(curPos[0]);
      resetUser();
      break;
    case "ArrowRight":
      curPos[0] += 10 * (curPos[0] < 460);
      resetUser();
      break;
    case "Enter":
      start = 1;
      document.querySelector(".instructions").textContent = "";
      break;
  }
}

function resetBall() {
  ball.style.left = ballCur[0] + "px";
  ball.style.bottom = ballCur[1] + "px";
}

// document.addEventListener("keydown", startGame);
document.addEventListener("keydown", moveUser);

const ball = document.createElement("div");
ball.classList.add("ball");
resetBall();
grid.appendChild(ball);

function moveBall() {
  ballCur[0] += xDir * (start === 1); //* (1 && gameover);
  ballCur[1] += yDir * (start === 1);
  resetBall();
  checkCollisions();
  // console.log(ball);
}
//if (start === 1) {
timerId = setInterval(moveBall, 15); // * (start === 1);

function checkCollisions() {
  //check for block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCur[0] > blocks[i].bottomLeft[0] &&
      ballCur[0] < blocks[i].bottomRight[0] &&
      ballCur[1] + ballDia > blocks[i].bottomLeft[1] &&
      ballCur[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      // console.
      blocks.splice(i);
      changeDir();
      score++;
      document.querySelector(".score").textContent = "Score: " + score;
      // score.innerHTML = score;
      if (blocks.length == 0) {
        // scoredisp.innerHTML = "YOU WIN";
        document.removeEventListener("keydown", moveUser);
        clearInterval(timerId);
      }
    }
  }

  if (
    ballCur[0] > curPos[0] &&
    ballCur[0] < curPos[0] + blockWidth &&
    ballCur[1] > curPos[1] &&
    ballCur[1] < curPos[1] + blockHeight
  ) {
    changeDir();
  }

  if (
    ballCur[0] >= boardWidth - ballDia ||
    ballCur[1] >= boardHeight - ballDia ||
    ballCur[0] <= 0 //||
    //(ballCur[0] >= curPos[0] && ballCur[0] <= curPos[0]+100)
  ) {
    changeDir();
  }
  //check for game over
  if (ballCur[1] <= 0) {
    clearInterval(timerId);
    // console.log("You lost!");
    // scoredisp.innerHTML = "You Lost!";
    console.log("You lost!");
    document.removeEventListener("keydown", moveUser);
    changeDir();
    //gameover = 0;
  }
}

function changeDir() {
  if (xDir === 2 && yDir === 2) {
    yDir = -2;
    return;
  }
  if (xDir === 2 && yDir === -2) {
    xDir = -2;
    return;
  }
  if (xDir === -2 && yDir === -2) {
    yDir = 2;
    return;
  }
  if (xDir === -2 && yDir === 2) {
    xDir = 2;
    return;
  }
}
