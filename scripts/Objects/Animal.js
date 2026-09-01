import { RandomFromMinToMax, PosOrNeg } from "../utils/random.js";
import { GameObject } from "./GameObjects.js";
import { colorTemplate } from "../config/colors.js";

export class Animal extends GameObject {
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
        super(
            id,
            name,
            type,
            position,
            size,
            velocity,
            debugColor,
            sellValue,
            layer,
        );

        this.isChangingDirection = false;
        this.selfElapsedTime = RandomFromMinToMax(0, 10);
    }

    update(deltaTime, worldBounds, objectList) {
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;

        let hitBound = null;

        this.selfElapsedTime += deltaTime;
        if (this.selfElapsedTime >= RandomFromMinToMax(4, 8)) {
            hitBound = "none";
            this.selfElapsedTime = 0;
        }

        // Top Bound
        if (this.position.y <= 0) {
            this.position.y = 0;
            hitBound = "top";
        }
        // Bottom Bound
        if (this.position.y + this.size.height >= worldBounds.height) {
            this.position.y = worldBounds.height - this.size.height;
            hitBound = "bottom";
        }
        // Left Bound
        if (this.position.x <= 0) {
            this.position.x = 0;
            hitBound = "left";
        }
        // Right Bound
        if (this.position.x + this.size.width >= worldBounds.width) {
            this.position.x = worldBounds.width - this.size.width;
            hitBound = "right";
        }

        if (hitBound !== null) {
            this.changeDirection(hitBound);
        }

        if (this.animation) {
            this.animation.update(deltaTime);
        }

        this.seeAround(objectList);
    }

    changeDirection(hitBound) {
        if (this.isChangingDirection) {
            return;
        }

        this.isChangingDirection = true;

        this.velocity.moveX = 0;
        this.velocity.moveY = 0;
        this.boundTouched = false;
        setTimeout(() => {
            let veloX = RandomFromMinToMax(10, 80);
            let veloY = RandomFromMinToMax(0, 40);

            if (hitBound === "top") {
                this.velocity.moveX = veloX * PosOrNeg();
                this.velocity.moveY = veloY;
            }
            if (hitBound === "bottom") {
                this.velocity.moveX = veloX * PosOrNeg();
                this.velocity.moveY = -veloY;
            }
            if (hitBound === "left") {
                this.velocity.moveX = veloX;
                this.velocity.moveY = veloY * PosOrNeg();
            }
            if (hitBound === "right") {
                this.velocity.moveX = -veloX;
                this.velocity.moveY = veloY * PosOrNeg();
            }
            if (hitBound === "none") {
                this.velocity.moveX = veloX * PosOrNeg();
                this.velocity.moveY = veloY * PosOrNeg();
            }

            this.isChangingDirection = false;
        }, 1000);
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

        if (this.name.includes("dog")) {
            context.beginPath();
            context.arc(
                this.position.x + this.size.width / 2,
                this.position.y + this.size.height / 2,
                180,
                0,
                Math.PI * 2,
            );
            context.fillStyle = this.debugColor + "40";
            context.fill();
            context.closePath();
        }
    }

    seeAround(objectList) {
        for (let object of objectList) {
            if (object.name.includes("chicken") && this.name.includes("dog")) {
                this.glideTowards(object);
                // this.goTowards(object);
                // console.log("CHIEKEN!!!");
            }
        }
    }

    goTowards(object) {
        let dest = object.position;
        this.velocity.moveX = dest.x - this.position.x;
        this.velocity.moveY = dest.y - this.position.y;
    }

    glideTowards(object) {
        let dest = object.position;
        this.velocity.moveX = dest.x - this.position.x;
        this.velocity.moveY = dest.y - this.position.y;
    }
}
