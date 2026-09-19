import { RandomFromMinToMax, PosOrNeg } from "../utils/random.js";
import { colorTemplate } from "../config/colors.js";

export class GameObject {
    velocity = { moveX: 0, moveY: 0 };
    debugColor =
        colorTemplate["CuteGayColor"].colors[
            Math.floor(
                Math.random() * colorTemplate["CuteGayColor"].colors.length,
            )
        ];
    state = "idle";
    buyValue = 0;

    idleImage = null;
    animation = null;

    hovered = false;
    selected = false;

    selfElapsedTime = 0;

    constructor(id, name, type, position, size, sellValue, layer) {
        this.id = id;
        this.name = name;
        this.type = type;

        this.position = position;
        this.size = size;

        this.sellValue = sellValue;

        this.layer = layer;

        // console.log(this.debugColor);
        // console.log(colorTemplate["CuteGayColor"]);
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
        context.lineWidth = 1; // reset stroke width

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

        context.fillStyle = "white";
        context.fillText(this.name, this.position.x, this.position.y);
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
        try {
            this.idleImage = img.spriteImage;
            this.spriteSize = img.spriteSize;
        } catch (error) {
            console.log("Undefine sprite Image of: ", this);
        }
    }

    setAnimation(animation) {
        this.animation = animation;
    }
}
