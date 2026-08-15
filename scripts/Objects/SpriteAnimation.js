export class SpriteAnimation {
    constructor(image, frameWidth, frameHeight, columns, rows, frameDuration) {
        this.image = image;

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.columns = columns;
        this.rows = rows;

        this.frameDuration = frameDuration;
        this.timer = 0;

        this.currentFrame = 0;
        this.totalFrames = columns * rows;
    }

    update(deltaTime) {
        this.timer += deltaTime;

        if (this.timer >= this.frameDuration) {
            this.timer = 0;
            this.currentFrame++;

            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
                // console.log("reset frames");
            }
        }
    }

    render(ctx, x, y, width, height) {
        let column = this.currentFrame % this.columns;
        let row = Math.floor(this.currentFrame / this.columns);

        let sourceX = column * this.frameWidth;
        let sourceY = row * this.frameHeight;

        ctx.drawImage(
            this.image,

            sourceX,
            sourceY,
            this.frameWidth,
            this.frameHeight,

            x,
            y,
            width,
            height,
        );
    }
}
