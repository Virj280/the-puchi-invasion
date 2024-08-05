let tileSize = 100;
let rows = 10;
let columns = 10;

let board;
let boardWidth = 1000;
let boardHeight = 1000;
let context;

let puchiWidth = 112;
let puchiHeight = 152;
let puchiX = tileSize * columns / 2 - tileSize;
let puchiY = 825;

let puchi = {
    x : puchiX,
    y : puchiY,
    width : puchiWidth,
    height : puchiHeight,
}

let puchiImg;
let puchiVelocityX = tileSize;

let swordArray = [];
let swordWidth = 40;
let swordHeight = 72;
let swordX = tileSize;
let swordY = tileSize;
let swordImg;

let swordRows = 2;
let swordColumns = 3;
let swordCount = 0;
let swordVelocityX = 2;

let laserArray = [];
let laserVelocityY = -30;

let score = 0;
let puchiL = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    puchiImg = new Image();
    puchiImg.src = "./sprites/puchi.png";
    puchiImg.onload = function() {
        context.drawImage(puchiImg, puchi.x, puchi.y, puchi.width, puchi.height);
    }

    swordImg = new Image();
    swordImg.src = "./sprites/sword.png";
    createSwords();

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePuchi);
    document.addEventListener("keyup", fire);
}

function update() {
    requestAnimationFrame(update);

    if (puchiL) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(puchiImg, puchi.x, puchi.y, puchi.width, puchi.height);

    for (let i = 0; i < swordArray.length; i++) {
        let sword = swordArray[i];
        if (sword.alive) {
            sword.x += swordVelocityX;

            if(sword.x + sword.width >= board.width || sword.x <= 0) {
                swordVelocityX *= -1;
                sword.x += swordVelocityX * 2;

                for (let j = 0; j < swordArray.length; j++) {
                    swordArray[j].y += swordHeight;
                }
            }
            context.drawImage(swordImg, sword.x, sword.y, sword.width, sword.height);

            if (sword.y >= puchi.y) {
                puchiL = true;
            }
        }
    }

    for (let i = 0; i < laserArray.length; i++) {
        let laser = laserArray[i];
        laser.y += laserVelocityY;
        context.fillStyle = "#ff0000";
        context.fillRect(laser.x, laser.y, laser.width, laser.height);

        for(let j = 0; j < swordArray.length; j++) {
            let sword = swordArray[j];
            if(!laser.used && sword.alive && detectCollsion(laser, sword)) {
                laser.used = true;
                sword.alive = false;
                swordCount--;
                score += 1000;
            }
        }
    }

    while (laserArray.length > 1000 && (laserArray[0] || laserArray[0].y < 1000)) {
        laserArray.shift();
    }

    if(swordCount == 0) {
        swordColumns = Math.min(swordColumns + 1, columns - 3);
        swordRows = Math.min(swordRows + 1, rows - 3);
        if (swordVelocityX > 0) {
            swordVelocityX += 0.7;
        }
        else {
            swordVelocityX -= 0.7;
        }
        swordArray = [];
        laserArray = [];
        createSwords();
        }

    context.fillStyle="#ff0000";
    context.font="32px courier";
    context.fillText(score, 10, 40);
    if (puchiL){
        context.fillText("L YOU DIED", 75, 580)
}

function movePuchi(e) {
    if (puchiL) {
        return;
    }
    if(e.code == "ArrowLeft" && puchi.x - puchiVelocityX >= 0) {
        puchi.x -= puchiVelocityX;
    }
    else if (e.code == "ArrowRight" && puchi.x + puchiVelocityX + puchi.width <= board.width) {
        puchi.x += puchiVelocityX + 1;
    }
}

function createSwords() {
    for (let c = 0; c < swordColumns; c++) {
        for (let r = 0; r < swordRows; r++) {
            let sword = {
                img : swordImg,
                x : swordX + c * swordWidth,
                y : swordY + r * swordHeight,
                width : swordWidth,
                height : swordHeight,
                alive : true
            }
            swordArray.push(sword);
        }
    }
    swordCount = swordArray.length;
}

function fire(e) {
    if (puchiL) {
        return;
    }
    if (e.code == "Space") {
        let laser = {
            x : puchi.x + puchiWidth - 104,
            y : puchi.y + 90,
            width : 7,
            height : 20,
            used : false
        }
        laserArray.push(laser);
    }
}

function detectCollsion(a, b) {
    return a.x < b.x + b.width && 
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
