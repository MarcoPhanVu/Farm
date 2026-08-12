import { GameObject } from "./GameObjects.js";

export class Animal extends GameObject {
    constructor(id, name, type, state, position, size, velocity, color, layer) {
        super(id, name, type, state, position, size, velocity, color, layer);

        this.isChangingDirection = false;
        this.selfElapsedTime = RandomFromMinToMax(0, 10);
    }

    update(deltaTime, worldBounds) {
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;

        let hitBound = null;

        this.selfElapsedTime += deltaTime;
        if (this.selfElapsedTime >= 10) {
            // console.log("7.5 sec passed");
            hitBound = "none";
            this.selfElapsedTime = 0;
        }

        // Top Bound
        if (this.position.y <= 0) {
            this.position.y = 0;
            hitBound = "top";
        }
        // Bottom Bound
        if (this.position.y + this.size.height >= wordlBounds.height) {
            this.position.y = wordlBounds.height - this.size.height;
            hitBound = "bottom";
        }

        // Left Bound
        if (this.position.x <= 0) {
            this.position.x = 0;
            hitBound = "left";
        }
        // Right Bound
        if (this.position.x + this.size.width >= wordlBounds.width) {
            this.position.x = wordlBounds.width - this.size.width;
            hitBound = "right";
        }

        if (hitBound !== null) {
            this.changeDirection(hitBound);
        }
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
}
