import Puchi from "./Puchi.js";
import Ground from "./Ground.js";
import ObstaclesController from "./ObstaclesController.js";
import Score from "./Score.js";

const canvas = document.getElementById("puchiRun")
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 0.8
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 426;
const PUCHI_WIDTH = 40;
const PUCHI_HEIGHT = 76;
const MAX_JUMP_HEIGHT = 270;
const MIN_JUMP_HEIGHT = 70;
const GROUND_WIDTH = 1000;
const GROUND_HEIGHT = 429;
const GROUND_AND_OBSTACLES_SPEED = 0.5;

const OBSTACLES_CONFIG = [
    {width:40, height:80, image:"sprites/stalagmite_1.png"},
    {width:80, height:50, image:"sprites/stalagmite_2.png"},
    {width:80, height:60, image:"sprites/stalagmite_3.png"},
    {width:20, height:90, image:"sprites/stalagmite_big.png"},
]

let puchi = null;
let ground = null;
let obstaclesController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let puchiL = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
    const puchiWidthInGame = PUCHI_WIDTH * scaleRatio;
    const puchiHeightInGame = PUCHI_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    puchi = new Puchi(
        ctx,
        puchiWidthInGame,
        puchiHeightInGame,
        minJumpHeightInGame,
        maxJumpHeightInGame,
        scaleRatio
    );

    ground = new Ground(ctx,
        groundWidthInGame,
        groundHeightInGame,
        GROUND_AND_OBSTACLES_SPEED,
        scaleRatio
    );
    const obstaclesImages = OBSTACLES_CONFIG.map(obstacle =>{
        const image = new Image();
        image.src = obstacle.image;
        return {
            image:image,
            width: obstacle.width * scaleRatio,
            height: obstacle.height * scaleRatio,
        };
    });

    obstaclesController = new ObstaclesController(ctx,
        obstaclesImages,
        scaleRatio,
        GROUND_AND_OBSTACLES_SPEED
    );

    score = new Score(ctx, scaleRatio);
} 

function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}

setScreen();

window.addEventListener('resize', setScreen);

function getScaleRatio() {
    const screenHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
    );

    const screenWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth
    );

    if(screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT){
        return screenWidth / GAME_WIDTH
    }
    else{
        return screenHeight / GAME_HEIGHT;
    }
}

function clearScreen() {
    ctx.fillStyle = "#131326";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

link.href = 'https://virj280.github.io/the-puchi-invasion/Linescript%20webfont%20kit/stylesheet.css';
function showPuchiL() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Linescript`;
    ctx.fillStyle = "#ff0000";
    const x = canvas.width / 8.5;
    const y = canvas.height / 2;
    ctx.fillText("L YOU DIED SKILL ISSUE", x, y);
}

function setupGameReset() {
    if (!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart = true;

        setTimeout(()=>{
        window.addEventListener("keyup", reset, {once:true})
        window.addEventListener("touchstart", reset, {once:true})
        }, 1000);
    }
}

function reset() {
    hasAddedEventListenersForRestart = false;
    puchiL = false;
    waitingToStart = false;
    ground.reset();
    obstaclesController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;
}

function showStartGameText () {
    const fontSize = 60 * scaleRatio;
    ctx.font = `${fontSize}px Linescript`;
    ctx.fillStyle = "#ff0000";
    const x = canvas.width / 20;
    const y = canvas.height / 2;
    ctx.fillText("Press any key or tap anywhere to start", x, y);
}

function updateGameSpeed(frameTimeDelta) {
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function gameLoop(currentTime) {
    if(previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen();

    if(!puchiL && !waitingToStart) {
    ground.update(gameSpeed, frameTimeDelta);
    obstaclesController.update(gameSpeed, frameTimeDelta);
    puchi.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
    }
    
    if (!puchiL && obstaclesController.collideWith(puchi)) {
        puchiL = true;
        setupGameReset();
        score.setHighScore();
    }

    ground.draw();
    obstaclesController.draw();
    puchi.draw();
    score.draw();

    if(puchiL) {
        showPuchiL();
    }

    if(waitingToStart) {
        showStartGameText();
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, {once:true});
window.addEventListener("touchstart", reset, {once:true});
