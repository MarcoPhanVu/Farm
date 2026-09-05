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
        debugColor,
        sellValue,
        layer,
        animalConfig,
    ) {
        super(id, name, type, position, size, debugColor, sellValue, layer);

        this.config = animalConfig;
        this.isChangingDirection = false;
        this.selfElapsedTime = RandomFromMinToMax(0, 10);

        this.targetList = [];

        this.targetedObject = null;
        this.currentActionTime = RandomFromMinToMax(4, 8);

        this.actionCoolDownTime = 0;
    }

    update(deltaTime, worldBounds, objectList) {
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;

        this.actionCoolDownTime -= deltaTime;

        this.checkWallCollision(deltaTime, worldBounds);

        this.seeAround(objectList);
    }

    checkWallCollision(deltaTime, worldBounds) {
        let hitBound = null;

        this.selfElapsedTime += deltaTime;
        if (this.selfElapsedTime >= this.currentActionTime) {
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
            // exist
            this.move(hitBound);
        }

        if (this.animation) {
            // exist
            this.animation.update(deltaTime);
        }
    }

    move(hitBound) {
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
        const seeRange = 180;

        for (let object of objectList) {
            let isDog = this.name.includes("dog"); // for dog only
            let isTargetedAnimal =
                object.name.includes("chicken") ||
                object.name.includes("duck") ||
                object.name.includes("dogfood");

            if (!isDog || !isTargetedAnimal) {
                continue;
            }

            let dist = Math.sqrt(
                (object.position.x - this.position.x) ** 2 +
                    (object.position.y - this.position.y) ** 2,
            );

            if (dist <= seeRange && !this.targetList.includes(object)) {
                this.targetList.push(object);
            }
        }

        this.targetList = this.targetList.filter((target) => {
            // clear out of range targets
            let dist = Math.sqrt(
                (target.position.x - this.position.x) ** 2 +
                    (target.position.y - this.position.y) ** 2,
            );

            return dist <= seeRange;
        });

        for (let object of this.targetList) {
            object.hovered = false;
            object.selected = false;
        }

        if (this.targetList.length > 0 && this.actionCoolDownTime <= 0) {
            let chosenTarget =
                this.targetList[
                    RandomFromMinToMax(0, this.targetList.length - 1)
                ];

            this.targetedObject = chosenTarget;

            console.log("target chosen", chosenTarget.name);

            this.actionCoolDownTime = 8;
        }

        if (this.targetedObject) {
            this.targetedObject.hovered = true;
            this.targetedObject.selected = true;
            this.goTowards(this.targetedObject);
        }
    }

    goTowards(object) {
        let dest = object.position;
        let maxSpeed = 80;

        const dx = dest.x - this.position.x;
        const dy = dest.y - this.position.y;

        this.velocity.moveX = Math.floor(
            Math.max(-maxSpeed, Math.min(maxSpeed, dx)),
        );
        this.velocity.moveY = Math.floor(
            Math.max(-maxSpeed, Math.min(maxSpeed, dy)),
        );
    }

    glideTowards(object) {
        //ease out
        let dest = object.position;
        this.velocity.moveX = dest.x - this.position.x;
        this.velocity.moveY = dest.y - this.position.y;
    }
}
