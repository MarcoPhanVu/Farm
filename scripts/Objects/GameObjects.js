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
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;

        if (this.animation) {
            this.animation.update(deltaTime);
        }
    }

    render(context) {
        this.renderDebugOutline(context);

        if (this.animation) {
            this.animation.render(
                context,
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
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
        } else {
            context.fillStyle = this.debugColor;
            context.fillRect(
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        }

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

            context.beginPath();
            context.arc(
                this.position.x + this.size.width / 2,
                this.position.y + this.size.height / 2,
                80,
                0,
                Math.PI * 2,
            );
            context.fillStyle = this.debugColor + "80";
            context.fill();
            context.closePath();
        }
    }

    setImage(img) {
        this.idleImage = img.spriteImage;
        this.spriteSize = img.spriteSize;
    }

    setAnimation(animation) {
        this.animation = animation;
    }
}
