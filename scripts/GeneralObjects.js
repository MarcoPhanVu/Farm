class GameObject {
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

        this.hovered = false;
        this.selected = false;
    }

    update(deltaTime) {
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;
    }

    render(painter) {
        // console.log(painter);
        painter.fillStyle = this.color;
        painter.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height,
        );

        if (this.selected) {
            painter.lineWidth = 4;
            painter.strokeStyle = "#fff";
            painter.strokeRect(
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height,
            );
        }
    }

    getBottomY() {
        return this.position.y + this.size.height;
    }

    announcePosition() {
        console.log(`Position: X[${this.position.x}] - Y[${this.position.y}]`);
    }

    announceSize() {
        console.log(`Size: X[${this.size.width}] - Y[${this.size.height}]`);
    }

    announceVelocity() {
        console.log(
            `Velocity: X[${this.velocity.moveX}] - Y[${this.velocity.moveY}]`,
        );
    }

    announceSelf() {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Type: ${this.type}`);
        console.log(`State: ${this.state}`);
        this.announcePosition();
        this.announceSize();
        this.announceVelocity();
        console.log(`Color: ${this.color}`);
        console.log(`Layer: ${this.layer}`);
        console.log(`Hovered: ${this.hovered}`);
        console.log(`Selected: ${this.selected}`);
    }
}

class Animal extends GameObject {
    constructor(id, name, type, state, position, size, velocity, color, layer) {
        super(id, name, type, state, position, size, velocity, color, layer);

        this.isChangingDirection = false;
    }

    update(deltaTime) {
        this.position.x += this.velocity.moveX * deltaTime;
        this.position.y += this.velocity.moveY * deltaTime;

        let hitBound = null;

        // Top Bound
        if (this.position.y <= 0) {
            this.position.y = 0;
            hitBound = "top";
        }
        // Bottom Bound
        if (this.position.y + this.size.height >= gameCanvas.height) {
            this.position.y = gameCanvas.height - this.size.height;
            hitBound = "bottom";
        }

        // Left Bound
        if (this.position.x <= 0) {
            this.position.x = 0;
            hitBound = "left";
        }
        // Right Bound
        if (this.position.x + this.size.width >= gameCanvas.width) {
            this.position.x = gameCanvas.width - this.size.width;
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
            let veloX = RandomFromMinToMax(40, 100);
            let veloY = RandomFromMinToMax(40, 100);

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

            this.isChangingDirection = false;
        }, 1000);
    }
}

// General Functions
function RandomFromMinToMax(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function PosOrNeg() {
    return Math.random() < 0.5 ? 1 : -1;
}
