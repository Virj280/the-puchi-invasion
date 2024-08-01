let board;
let boardWidth = 597;
let boardHeight = 900;
let context;

let puchiWidth = 97;
let puchiHeight = 117.5;
let puchiX = boardWidth/8;
let puchiY = boardHeight/2;
let puchiImg; 

let puchi = {
    x : puchiX,
    y : puchiY,
    width : puchiWidth,
    height : puchiHeight
}

let pipeArray = [];
let pipeWidth = 120;
let pipeHeight = 654;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -1.5;
let velocityY = 0;
let gravity = 0.3;

let puchiL = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    puchiImg = new Image();
    puchiImg.src = "./sprites/puchi_67_jetpack.png";
    puchiImg.onload = function() {
        context.drawImage(puchiImg, puchi.x, puchi.y, puchi.width, puchi.height);

    topPipeImg = new Image();
    topPipeImg.src="./sprites/top_pipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src="./sprites/bottom_pipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 3500);
    document.addEventListener("keydown", movePuchi);

    }
}

function update() {
    requestAnimationFrame(update);
        if (puchiL) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    puchi.y = Math.max(puchi.y + velocityY, 0);
    context.drawImage(puchiImg, puchi.x, puchi.y, puchi.width, puchi.height);
    if (puchi.y > board.height) {
        puchiL = true;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && puchi.x > pipe.x + pipe.width) {
            score += 500;
            pipe.passed = true;
        }
        
        if (detectCollision(puchi, pipe)) {
            puchiL = true;
        }
            }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    let head = document.getElementsByClassName('fontStyle')[0]; 

    let link = document.createElement('link');

    link.rel = 'stylesheet';
 
    link.type = 'text/css';
 
    link.href = 'https://virj280.github.io/the-puchi-invasion/Linescript%20webfont%20kit/stylesheet.css';
context.fillStyle = "#ff0000";
context.font="70px Linescript";
context.fillText(score, 5, 70);

    if (puchiL){
        context.fillText("L YOU DIED", 75, 580)
    }
}

function placePipes() {
    if (puchiL) {
        return;
    }
    
    let randomPipeY = pipeY - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

        let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}

function movePuchi(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -5;
        if (puchiL) {
            puchi.y = puchiY;
            pipeArray = [];
            score = 0;
            puchiL = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width >  b.x &&
            a.y < b.y + b.height &&
            a.y + a.height >  b.y;
}
