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
    layer = 1;

    buyValue = 0;
    sellValue = 0;

    /**
     * contains image object and dimension (32x64 or sum)
     *  @type {ImageConfig}
     */
    idleImage = null;
    spriteDimension = { width: 0, height: 0 };
    /**
     *  @type {animationSheet}
     */
    animation = null;

    hovered = false;
    selected = false;

    selfElapsedTime = 0; // For animation choices

    constructor(id, name, position, config) {
        this.id = id;
        this.name = name;

        this.position = position;

        /**
         * Object unique configuration
         * Basic attributes: Buy/Sell Value and Size
         */
        this.config = config;

        this.size = config.size;
        this.sellValue = config.sellValue;
        this.buyValue = config.buyValue;
    }

    update(deltaTime) {
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;

        if (this.animation) {
            this.animation.update(deltaTime);
        }
    }

    render(context) {
        this.renderOutline(context);
        context.lineWidth = 1; // reset stroke width

        if (this.animation) {
            // if option exist
            this.animation.render(
                context,
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        } else if (this.idleImage) {
            // if option exist
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

    containsPoints(mouseX, mouseY) {
        // Check if mouse is inside object
        return (
            mouseX >= this.position.x &&
            mouseX <= this.position.x + this.size.width &&
            mouseY >= this.position.y &&
            mouseY <= this.position.y + this.size.height
        );
    }

    renderOutline(context) {
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

    // Getters
    getBottomY() {
        // console.log(this);
        // Calculating actual object position and use it to calculate render order
        return this.position.y + this.size.height;
    }

    getState() {
        return this.state;
    }

    getVelocity() {
        // velocity = {moveX, moveY}
        return this.velocity;
    }

    // Setters
    setState(state) {
        this.state = state;
    }

    setVelocity(moveXVal, moveYVal) {
        this.velocity = { moveX: moveXVal, moveY: moveYVal };
    }

    setImage(imgConfig) {
        try {
            this.idleImage = imgConfig.image;
            this.spriteDimension = imgConfig.dimension;
        } catch (error) {
            console.log("Undefine sprite Image of: ", this);
        }
    }

    setAnimation(animation) {
        this.animation = animation;
    }
}
