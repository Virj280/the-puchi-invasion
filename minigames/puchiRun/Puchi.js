export default class Puchi {
    RUN_ANIMATION_TIMER = 150;
    runAnimationTimer = this.RUN_ANIMATION_TIMER;
    puchiRunImages = [];

    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;

    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 20 * scaleRatio;
        this.y = this.canvas.height - this.height - 40.5 * scaleRatio;
        this.yStandingPosition = this.y;

        this.PuchiStillImage = new Image();
        this.PuchiStillImage.src = "sprites/mean_puchi_jump.png";
        this.image = this.PuchiStillImage;

        const puchiRunImage1 = new Image ();
        puchiRunImage1.src = "sprites/mean_puchi_walk_frame1.png";
        const puchiRunImage2 = new Image ();
        puchiRunImage2.src = "sprites/mean_puchi_walk_frame2.png";

        this.puchiRunImages.push(puchiRunImage1);
        this.puchiRunImages.push(puchiRunImage2);

        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);

        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);
        
        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);
    }

    touchstart = ()=>{
        this.jumpPressed = true;
    }

    touchend = ()=>{
        this.jumpPressed = false;
    }
    
    
    keydown = (event)=>{
        if(event.code === "Space") {
            this.jumpPressed = true;
        }
    };

    keyup = (event)=>{
        if(event.code === "Space") {
            this.jumpPressed = false;
        }
    };

    update(gameSpeed, frameTimeDelta) {
        console.log(this.jumpPressed);
        this.run(gameSpeed, frameTimeDelta);
        
        if(this.jumpInProgress) {
            this.image = this.PuchiStillImage;
        }

        this.jump(frameTimeDelta);
    }

    jump(frameTimeDelta) {
        if(this.jumpPressed) {
            this.jumpInProgress = true;
        }

        if(this.jumpInProgress && !this.falling) {
            if (
                this.y > this.canvas.height - this.minJumpHeight ||
                (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
            ) {
                    this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
                }
                else {
                    this.falling = true;
                }
        } else {
            if(this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;
                }
            } else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }

    run(gameSpeed, frameTimeDelta) {
        if (this. runAnimationTimer <=0) {
            if(this.image === this.puchiRunImages[0]) {
                this.image = this.puchiRunImages[1];
            }
            else {
                this.image = this.puchiRunImages[0];
            }
            this.runAnimationTimer = this.RUN_ANIMATION_TIMER;
        }
        this.runAnimationTimer -= frameTimeDelta * gameSpeed;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
