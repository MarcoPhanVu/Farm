import { RandomFromMinToMax, PosOrNeg } from "../utils/random.js";

export class GameObject {
    constructor(
        id,
        name,
        type,
        position,
        size,
        velocity,
        debugColor,
        sellValue,
        layer,
    ) {
        this.id = id;
        this.name = name;
        this.type = type;

        this.position = position;
        this.size = size;
        this.velocity = velocity;

        this.debugColor = debugColor;
        this.layer = layer;

        this.sellValue = sellValue;

        this.state = "idle";
        this.buyValue = 0;

        this.idleImage = null;
        this.animation = null;

        this.hovered = false;
        this.selected = false;

        this.selfElapsedTime = 0;
    }

    update(deltaTime) {
        // console.log(this.type);
        // console.log("problem", this.position);
        // console.log(this.velocity);
        // console.log(this.debugColor);
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;

        // console.log(this.animation);

        if (this.animation) {
            // console.log(this);
            // console.log("check");
            // console.log(gameASDASD.gameObjects[1]);
            this.animation.update(deltaTime);
        }
    }

    render(context) {
        if (this.animation) {
            this.animation.render(
                context,
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
            // console.log("reached animation");
        } else if (this.idleImage) {
            // use image if exist
            context.drawImage(
                this.idleImage,

                0,
                0,
                this.spriteSize,
                this.spriteSize,

                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
            // console.log("reached image");
        } else {
            context.fillStyle = this.debugColor;
            context.fillRect(
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        }

        this.renderDebugOutline(context);

        context.lineWidth = 1; // reset stroke width
    }

    getBottomY() {
        return this.position.y + this.size.height;
    }

    containsPoints(mouseX, mouseY) {
        return (
            mouseX >= this.position.x &&
            mouseX <= this.position.x + this.size.width &&
            mouseY >= this.position.y &&
            mouseY <= this.position.y + this.size.height
        );
    }

    renderDebugOutline(context) {
        if (this.hovered) {
            context.lineWidth = 2;
            context.strokeStyle = "#fff";
            context.strokeRect(
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        }

        if (this.selected) {
            context.lineWidth = 2;
            context.strokeStyle = "#000";
            context.strokeRect(
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        }
    }

    setImage(img) {
        this.idleImage = img.spriteImage;
        this.spriteSize = img.spriteSize;
        // console.log(img);
    }

    setAnimation(animation) {
        this.animation = animation;
    }
}
