export const animalPool = {
    chicken: {
        trueName: "chicken",
        size: { width: 40, height: 40 },
        movingSpeed: { min: 40, max: 80 },
        lookingRange: 120,
        buyValue: 100,
        sellValue: 20,
        sprite: {
            img: "../../assets/chick-idle-8x8.png",
            idle: null,
            walking: "../../assets/chick-walking-4-2-8x8.png",
        },
        spriteSpeed: 0.2,
    },
    duck: {
        trueName: "duck",
        size: { width: 40, height: 40 },
        movingSpeed: { min: 40, max: 80 },
        lookingRange: 120,
        buyValue: 100,
        sellValue: 30,
        sprite: {
            img: "../../assets/duck-idle-16x16.png",
            idle: null,
            walking: "../../assets/duck-walking-4-2-16x16.png",
        },
        spriteSpeed: 0.2,
    },
    cat: {
        trueName: "cat",
        size: { width: 64, height: 64 },
        movingSpeed: { min: 40, max: 80 },
        lookingRange: 240,
        buyValue: 100,
        sellValue: 80,
        sprite: {
            img: null,
            idle: null,
            walking: null,
        },
        spriteSpeed: 0.2,
    },
    dog: {
        trueName: "dog",
        size: { width: 64, height: 64 },
        movingSpeed: { min: 40, max: 80 },
        lookingRange: 180,
        buyValue: 100,
        sellValue: 100,
        sprite: {
            img: "../../assets/dog-idle-16x16.png",
            idle: null,
            walking: "../../assets/dog-walking-4-2-16x16.png",
        },
        spriteSpeed: 0.2,
    },
    // number: {
    //     trueName: "number",
    //     size: { width: 60, height: 60 },
    //     movingSpeed: { min: 40, max: 80 },
    //     lookingRange: 180,
    //     buyValue: 100,
    //     sellValue: 50,
    //     sprite: {
    //         img: "../../assets/numbers-idle-4-3-16x16.png",
    //         idle: null,
    //         walking: "../../assets/numbers-walking-4-3-16x16.png",
    //     },
    //     spriteSpeed: 0.2,
    // },
};

export const stationaryObjectPool = {
    tree: {
        trueName: "tree",
        size: { width: 240, height: 240 },
        movingSpeed: { min: 40, max: 80 },
        lookingRange: 180,
        buyValue: 100,
        sellValue: 300,
        sprite: {
            img: "../../assets/tree-img-32x32.png",
            idle: null,
            walking: "../../assets/tree-idle-4-4-32x32.png",
        },
        spriteSpeed: 0.15,
    },
};
