export class SpriteAnimation {
    constructor(animation, frameDuration) {
        this.spriteImage = animation.spriteImage;

        this.spriteWidth = animation.spriteSize;
        this.spriteHeight = animation.spriteSize;

        this.spriteSheetColumn = animation.spriteSheet.col;
        this.spriteSheetRow = animation.spriteSheet.row;

        this.frameDuration = frameDuration;
        this.timer = 0;

        this.currentFrame = 0;
        this.totalFrames =
            animation.spriteSheet.col * animation.spriteSheet.row;
    }

    update(deltaTime) {
        this.timer += deltaTime;

        if (this.timer >= this.frameDuration) {
            this.timer = 0;
            this.currentFrame++;

            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
        }
    }

    render(ctx, posX, posY, objWidth, objHeight) {
        let column = this.currentFrame % this.spriteSheetColumn;
        let row = Math.floor(this.currentFrame / this.spriteSheetColumn);

        let sourceX = column * this.spriteWidth;
        let sourceY = row * this.spriteHeight;

        try {
            ctx.drawImage(
                this.spriteImage,

                sourceX,
                sourceY,
                this.spriteWidth,
                this.spriteHeight,

                posX,
                posY,
                objWidth,
                objHeight,
            );
        } catch (error) {
            console.log("Error:", error);
            console.log("Name");
        }
    }
}
