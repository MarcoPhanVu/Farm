import { RandomFromMinToMax, PosOrNeg } from "../utils/random.js";

export class GameObject {
    constructor(id, name, type, state, position, size, velocity, color, layer) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.state = state;

        this.position = position;
        this.size = size;
        this.velocity = velocity;

        this.color = color;
        this.layer = layer;

        this.image = null;

        this.hovered = false;
        this.selected = false;
    }

    update(deltaTime) {
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;
    }

    render(context) {
        if (this.img) {
            // use image if exist
            context.drawImage(
                this.img,
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        } else {
            context.fillStyle = this.color;
            context.fillRect(
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        }

        if (this.hovered) {
            context.lineWidth = 4;
            context.strokeStyle = "#fff";
            context.strokeRect(
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        }

        if (this.selected) {
            context.lineWidth = 6;
            context.strokeStyle = "#000";
            context.strokeRect(
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

    log(target) {
        if (!target) {
            console.log(`No valid option for [${target}]`);
        }

        if (target === "pos" || target === "position") {
            console.log(
                `Position: X[${this.position.x}] - Y[${this.position.y}]`,
            );
        }

        if (target === "size") {
            console.log(`Size: X[${this.size.width}] - Y[${this.size.height}]`);
        }

        if (target === "velo" || target === "velocity") {
            console.log(
                `Velocity: X[${this.velocity.moveX}] - Y[${this.velocity.moveY}]`,
            );
        }

        if (target === "self") {
            console.log(`ID: ${this.id}`);
            console.log(`Name: ${this.name}`);
            console.log(`Type: ${this.type}`);
            console.log(`State: ${this.state}`);
            this.log("position");
            this.log("size");
            this.log("velocity");
            console.log(`Color: ${this.color}`);
            console.log(`Layer: ${this.layer}`);
            console.log(`Hovered: ${this.hovered}`);
            console.log(`Selected: ${this.selected}`);
        }

        console.log(`No valid option for [${target}]`);
    }

    containsPoints(mouseX, mouseY) {
        return (
            mouseX >= this.position.x &&
            mouseX <= this.position.x + this.size.width &&
            mouseY >= this.position.y &&
            mouseY <= this.position.y + this.size.height
        );
    }

    setImage(img) {
        this.img = img;
    }
}
