class GameObject {
    constructor(id, name, type, state, position, velocity, pictureSource) {
        this.id = id;
        this.name = name;
        this.type = type; // Background, Animal, Building,...
        this.state = state; // Idle, Static
        this.position = position;
        this.velocity = velocity;
        this.picSrc = pictureSource;
    }

    getPosition() {
        return [this.position.x, this.position.y];
    }
}
