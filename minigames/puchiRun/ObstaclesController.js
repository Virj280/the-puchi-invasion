import Obstacle from "./Obstacle.js";

export default class ObstaclesController {
    OBSTACLE_INTERVAL_MIN = 500;
    OBSTACLE_INTERVAL_MAX = 2000;

    nextObstacleInterval = null;
    obstacles = [];

    constructor(ctx, obstaclesImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.obstaclesImages = obstaclesImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextObstacleTime();
    }

    setNextObstacleTime() {
        const num = this.getRandomNumber(
            this.OBSTACLE_INTERVAL_MIN,
            this.OBSTACLE_INTERVAL_MAX
        );

        this.nextObstacleInterval = num;
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createObstacle() {
        const index = this.getRandomNumber(0, this.obstaclesImages.length - 1);
        const obstacleImage = this.obstaclesImages [index];
        const x = this.canvas.width * 1.75;
        const y = this.canvas.height - obstacleImage.height * 1.45;
        const obstacle = new Obstacle(
            this.ctx,
            x,
            y,
            obstacleImage.width,
            obstacleImage.height,
            obstacleImage.image
        );

        this.obstacles.push(obstacle);
    }

    
    update(gameSpeed, frameTimeDelta) {
        if(this.nextObstacleInterval <= 0) {
            this.createObstacle();
            this.setNextObstacleTime();
        }
        this.nextObstacleInterval -= frameTimeDelta;
        
        this.obstacles.forEach((obstacle)=>{
            obstacle.update(
                this.speed,
                gameSpeed,
                frameTimeDelta,
                this.scaleRatio
            );
        });

        this.obstacles = this.obstacles.filter(obstacle=>obstacle.x > -obstacle.width);
    
    console.log(this.obstacles.length);
    }

    draw() {
        this.obstacles.forEach((obstacle) => obstacle.draw());
    }

    collideWith(sprite) {
        return this.obstacles.some(obstacle=> obstacle.collideWith(sprite));
    }

    reset() {
        this.obstacles = [];
    }
}