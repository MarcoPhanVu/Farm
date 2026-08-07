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
        painter.fillStyle = this.color;
        painter.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height,
        );

        if (this.selected) {
            painter.lineWidth = 3;
            painter.strokeStyle = "black";
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
}
