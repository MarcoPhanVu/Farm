export const animalConfiguration = {
    chicken: {
        size: { width: 40, height: 40 },
        movingSpeed: { min: 50, max: 100 },
        seeRange: 120,
        buyValue: 100,
        sellValue: 20,
        sprite: {
            defaultImg: { src: "../../assets/chick-idle-32x32.png" },
            idle: { src: "../../assets/chick-idle-32x32.png", mspFrame: 0.25 },
            walking: {
                src: "../../assets/chick-walking-4-2-8x8.png",
                mspFrame: 0.25,
            },
        },
    },
    duck: {
        size: { width: 40, height: 40 },
        movingSpeed: { min: 50, max: 100 },
        seeRange: 120,
        buyValue: 100,
        sellValue: 30,
        sprite: {
            defaultImg: { src: "../../assets/duck-idle-16x16.png" },
            idle: { src: "../../assets/duck-idle-16x16.png", mspFrame: 0.25 },
            walking: {
                src: "../../assets/duck-walking-4-2-16x16.png",
                mspFrame: 0.25,
            },
        },
    },
    dog: {
        size: { width: 64, height: 64 },
        movingSpeed: { min: 30, max: 60 },
        seeRange: 180,
        buyValue: 100,
        sellValue: 100,
        sprite: {
            defaultImg: { src: "../../assets/dog-idle-32x32.png" },
            idle: { src: "../../assets/dog-idle-32x32.png", mspFrame: 0.25 },
            walking: {
                src: "../../assets/dog-walking-4-2-16x16.png",
                mspFrame: 0.25,
            },
        },
    },
    sheep: {
        size: { width: 100, height: 100 },
        movingSpeed: { min: 32, max: 60 },
        seeRange: 120,
        buyValue: 125,
        sellValue: 225,
        sprite: {
            defaultImg: { src: "../../assets/sheep-idle-32x32.png" },
            idle: { src: "../../assets/sheep-idle-32x32.png", mspFrame: 0.25 },
            walking: {
                src: "../../assets/sheep-walking-1-8-32x32.png",
                mspFrame: 0.25,
            },
        },
    },
    sheep2: {
        size: { width: 100, height: 100 },
        movingSpeed: { min: 32, max: 60 },
        buyValue: 125,
        sellValue: 225,
        sprite: {
            defaultImg: { src: "../../assets/sheep2-idle-16x16.png" },
            idle: { src: "../../assets/sheep2-idle-16x16.png", mspFrame: 0.25 },
            walking: {
                src: "../../assets/sheep2-walking-4-2-16x16.png",
                mspFrame: 0.25,
            },
        },
    },
    number: {
        size: { width: 60, height: 60 },
        movingSpeed: { min: 40, max: 80 },
        buyValue: 100,
        sellValue: 50,
        sprite: {
            defaultImg: { src: "../../assets/tri-idle-256x256.png" },
            idle: { src: "../../assets/sheep2-idle-16x16.png", mspFrame: 0.25 },
            walking: {
                src: "../../assets/numbers-walking-4-3-16x16.png",
                mspFrame: 0.25,
            },
        },
    },
};

export const stationaryObjectConfiguration = {
    tree: {
        size: { width: 240, height: 240 },
        seeRange: 180,
        buyValue: 100,
        sellValue: 300,
        sprite: {
            defaultImg: { src: "../../assets/tree-img-32x32.png" },
            idle: { src: "../../assets/tree-img-32x32.png", mspFrame: 0.25 },
            walking: {
                src: "../../assets/tri-walking-1-1-256x256.png",
                mspFrame: 0.25,
            },
        },
    },
};

export const interactablesConfiguration = {
    grain: {
        size: { width: 20, height: 20 },
        sprite: {
            option1: "../../assets/grain-idle-16x16.png",
            option2: "../../assets/grain2-idle-16x16.png",
        },
    },
};
