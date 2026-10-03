import { RandomFromMinToMax, PosOrNeg } from "../utils/random.js";
import { GameObject } from "./GameObjects.js";
import { colorTemplate } from "../config/colors.js";

export class Animal extends GameObject {
    isChangingDirection = false;

    /**
     * list of all interactable GameObjects
     * @type {GameObject}
     */
    interactabletargetList = [];
    targetedObject = null;

    selfElapsedTime = RandomFromMinToMax(0, 10); // randomize
    currentActionTime = RandomFromMinToMax(4, 8);
    /**
     * to keep the animal do current task unless called upon
     *
     * @type {double}
     */
    actionCoolDownTime = 0;

    /**
     * Creates an instance of Animal.
     *
     * @constructor
     * @type {string} id
     * @type {string} name
     * @type {{int, int}} position
     * @type {generalObjects} animalConfig
     * @type {animationCollection} animalAnimationCollection
     */
    constructor(id, name, position, animalConfig, animalAnimationCollection) {
        super(id, name, position, animalConfig);
        this.animations = animalAnimationCollection;

        this.setState("walkingRight");
        this.species = animalConfig.species;
    }

    update(deltaTime, worldBounds, objectList) {
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;

        this.actionCoolDownTime -= deltaTime;
        if (this.actionCoolDownTime <= 0) {
            this.state = "chill";
        }

        this.checkWallCollision(deltaTime, worldBounds);

        this.seeAround(objectList);
    }

    /**
     * Fuck ass function, I'll deal with this shit in the future
     * @param {*} deltaTime
     * @param {*} worldBounds
     */
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

    chooseNewDirection() {}

    move(hitBound) {
        if (this.isChangingDirection) {
            return;
        }

        this.isChangingDirection = true;

        this.velocity.moveX = 0;
        this.velocity.moveY = 0;
        this.boundTouched = false;
        setTimeout(() => {
            try {
                let veloX = RandomFromMinToMax(
                    this.config.movingSpeed.min,
                    this.config.movingSpeed.max,
                );
                let veloY = RandomFromMinToMax(
                    this.config.movingSpeed.min,
                    this.config.movingSpeed.max,
                );
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
            } catch (error) {
                console.log(error);
                console.log(this.config);
            }

            this.isChangingDirection = false;
        }, 1000);
    }

    renderOutline(context) {
        super.renderOutline(context);

        context.beginPath();
        context.arc(
            this.position.x + this.size.width / 2,
            this.position.y + this.size.height / 2,
            this.config.seeRange,
            0,
            Math.PI * 2,
        );
        context.fillStyle = this.debugColor + "40";
        context.fillStyle = "#ffffff20";
        context.fill();
        context.closePath();
    }

    /**
     * Get all objects in a list then do an Animal Behavior
     * @param {GameObject} objectList
     */
    seeAround(objectList) {
        const seeRange = this.config.seeRange;
        for (let object of objectList) {
            let dist = Math.sqrt(
                (object.position.x - this.position.x) ** 2 +
                    (object.position.y - this.position.y) ** 2,
            );

            if (
                dist <= seeRange &&
                !this.interactabletargetList.includes(object)
            ) {
                this.interactabletargetList.push(object);
            }
        }

        this.interactabletargetList = this.interactabletargetList.filter(
            (target) => {
                // clear out of range targets
                let dist = Math.sqrt(
                    (target.position.x - this.position.x) ** 2 +
                        (target.position.y - this.position.y) ** 2,
                );

                return dist <= seeRange;
            },
        );

        this.animalBehavior();
    }

    animalBehavior() {
        // General Behavior

        if (
            this.species.includes("sheep") ||
            this.species.includes("chicken") ||
            this.species.includes("duck")
        ) {
            if (
                this.interactabletargetList.length > 0 &&
                this.actionCoolDownTime <= 0
            ) {
                this.targetedObject = this.getClosestTarget("grain");
            }
        }

        if (this.species.includes("dog")) {
            if (
                this.interactabletargetList.length > 0 &&
                this.actionCoolDownTime <= 0
            ) {
                let chosenTarget =
                    this.interactabletargetList[
                        RandomFromMinToMax(
                            0,
                            this.interactabletargetList.length - 1,
                        )
                    ];

                this.targetedObject = chosenTarget;

                this.actionCoolDownTime = 6;
            }
        }

        if (this.targetedObject) {
            this.targetedObject.hovered = true;
            this.targetedObject.selected = true;
            console.log(this.targetedObject);
            this.goTowards(this.targetedObject);
            this.state = "chasing";
        }
    }

    getClosestTarget(targetNameSpace) {
        let closestTarget = null;
        let closestDistance = Infinity;

        for (let target of this.interactabletargetList) {
            if (!target.name.includes(targetNameSpace)) {
                continue;
            }

            let dx = target.position.x - this.position.x;
            let dy = target.position.y - this.position.y;

            let dist = dx ** dx + dy ** dy; // (skip sqrt)

            if (dist < closestDistance) {
                closestDistance = dist;
                closestTarget = target;
            }
        }

        return closestTarget;
    }

    eatObject(object) {
        object.consumed = true;
    }

    goTowards(object) {
        let dest = object.position;
        let maxSpeed = 80;

        const dx = dest.x - this.position.x;
        const dy = dest.y - this.position.y;

        if (dx <= 50 && dy <= 50) {
            this.eatObject(object);
        }

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

    setState(state) {
        let stateList = [
            "idle, active, inactive",
            "walkingLeft",
            "walkingRight",
            "eating",
            "chasing",
            "playing",
        ];

        if (stateList.includes(state)) {
            this.state = state;
        } else {
            console.log("State:", state, "is invalid");
        }

        if (state.includes("walking")) {
            this.setAnimation(this.animations);
        }
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
