export const animalPool = {
    chicken: {
        trueName: "chicken",
        size: { width: 40, height: 40 },
        movingSpeed: { min: 50, max: 100 },
        lookingRange: 120,
        buyValue: 100,
        sellValue: 20,
        sprite: {
            idle: "../../assets/chick-idle-8x8.png",
            img: "../../assets/chick-idle-8x8.png",
            walking: "../../assets/chick-walking-4-2-8x8.png",
        },
        spriteSpeed: 0.2,
    },
    duck: {
        trueName: "duck",
        size: { width: 40, height: 40 },
        movingSpeed: { min: 50, max: 100 },
        lookingRange: 120,
        buyValue: 100,
        sellValue: 30,
        sprite: {
            idle: "../../assets/duck-idle-16x16.png",
            img: "../../assets/duck-idle-16x16.png",
            walking: "../../assets/duck-walking-4-2-16x16.png",
        },
        spriteSpeed: 0.2,
    },
    dog: {
        trueName: "dog",
        size: { width: 64, height: 64 },
        movingSpeed: { min: 30, max: 60 },
        lookingRange: 180,
        buyValue: 100,
        sellValue: 100,
        sprite: {
            idle: "../../assets/dog-idle-32x32.png",
            img: "../../assets/dog-idle-32x32.png",
            walking: "../../assets/dog-walking-4-2-16x16.png",
        },
        spriteSpeed: 0.2,
    },
    sheep: {
        trueName: "sheep",
        size: { width: 100, height: 100 },
        movingSpeed: { min: 32, max: 60 },
        lookingRange: 120,
        buyValue: 125,
        sellValue: 225,
        sprite: {
            idle: "../../assets/sheep-idle-32x32.png",
            img: "../../assets/sheep-idle-32x32.png",
            walking: "../../assets/sheep-walking-1-8-32x32.png",
        },
    },
    sheep2: {
        trueName: "sheep2",
        size: { width: 100, height: 100 },
        movingSpeed: { min: 32, max: 60 },
        buyValue: 125,
        sellValue: 225,
        sprite: {
            idle: "../../assets/sheep2-idle-16x16.png",
            img: "../../assets/sheep2-idle-16x16.png",
            walking: "../../assets/sheep2-walking-4-2-16x16.png",
        },
    },
    number: {
        trueName: "number",
        size: { width: 60, height: 60 },
        movingSpeed: { min: 40, max: 80 },
        buyValue: 100,
        sellValue: 50,
        sprite: {
            idle: "../../assets/sheep2-idle-16x16.png",
            img: "../../assets/tri-idle-256x256.png",
            walking: "../../assets/numbers-walking-4-3-16x16.png",
        },
        spriteSpeed: 0.15,
    },
};

export const stationaryObjectPool = {
    tree: {
        trueName: "tree",
        size: { width: 240, height: 240 },
        lookingRange: 180,
        buyValue: 100,
        sellValue: 300,
        sprite: {
            idle: "../../assets/tree-img-32x32.png",
            img: "../../assets/tree-img-32x32.png",
            walking: "../../assets/tri-walking-1-1-256x256.png",
        },
    },
};
