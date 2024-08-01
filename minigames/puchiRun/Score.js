export default class Score {

    score = 0;
    HIGH_SCORE_KEY = "highScore";

    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas  = ctx.canvas;
        this. scaleRatio = scaleRatio;
    }

    update(frameTimeDelta) {
        this.score += frameTimeDelta * 0.015;
    }

    reset() {
        this.score = 0;
    }

    setHighScore() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if(this.score > highScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    draw() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        const y = 20 * this.scaleRatio;

        const fontsize = 20 * this.scaleRatio;
        this.ctx.font = `${fontsize}px serif`;
        this.ctx.fillStyle = "#ff0000";
        const scoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
        const HighScorePadded = highScore.toString().padStart(6, 0);

        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText(`HI ${HighScorePadded}`, highScoreX, y);
    }
}