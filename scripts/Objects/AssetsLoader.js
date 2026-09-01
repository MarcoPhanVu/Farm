import { animalPool, stationaryObjectPool } from "../config/generalObjects.js";

export class AssetsLoaderProto {
    constructor() {
        this.assetsList = { animals: {}, statObjects: {} };
    }

    loadAnimals(pool) {
        for (let animalSpecies of Object.keys(pool)) {
            let animal = animalPool[animalSpecies];

            if (!this.assetsList["animals"][animalSpecies]) {
                //init animal obj
                this.assetsList["animals"][animalSpecies] = {};
            }

            // Clean version from chatGPT
            for (let [spriteType, spritePath] of Object.entries(
                animal.sprite,
            )) {
                if (spritePath !== null) {
                    const spriteImage = new Image();

                    spriteImage.src = new URL(spritePath, import.meta.url).href;

                    let spriteProperties = animal.sprite[spriteType]
                        .split("-")
                        .splice(1);

                    let spriteSize = spriteProperties.pop().split("x")[0];

                    this.assetsList["animals"][animalSpecies][spriteType] = {
                        spriteImage: spriteImage,
                        spriteSize: Number(spriteSize),
                    };

                    if (spriteProperties[0] === "walking") {
                        let spriteSheet = {
                            col: Number(spriteProperties[1]),
                            row: Number(spriteProperties[2]),
                        };
                        this.assetsList["animals"][animalSpecies][spriteType][
                            "spriteSheet"
                        ] = spriteSheet;
                    }

                    spriteImage.onload = () => {
                        // console.log(`${animalSpecies}[${spriteType}]: sprite loaded`);
                    };
                }
            }
        }
    }
    loadObjects(pool) {
        for (let objectType of Object.keys(pool)) {
            let statObject = stationaryObjectPool[objectType];

            if (!this.assetsList["statObjects"][objectType]) {
                this.assetsList["statObjects"][objectType] = {};
            }

            // Clean version from chatGPT
            for (let [spriteType, spritePath] of Object.entries(
                statObject.sprite,
            )) {
                if (spritePath !== null) {
                    const spriteImage = new Image();

                    spriteImage.src = new URL(spritePath, import.meta.url).href;

                    let spriteProperties = statObject.sprite[spriteType]
                        .split("-")
                        .splice(1);

                    let spriteSize = spriteProperties.pop().split("x")[0];

                    this.assetsList["statObjects"][objectType][spriteType] = {
                        spriteImage: spriteImage,
                        spriteSize: Number(spriteSize),
                    };

                    let spriteSheet = {
                        col: Number(spriteProperties[1]),
                        row: Number(spriteProperties[2]),
                    };
                    this.assetsList["statObjects"][objectType][spriteType][
                        "spriteSheet"
                    ] = spriteSheet;

                    console.log(this.assetsList["statObjects"][objectType]);

                    spriteImage.onload = () => {};
                }
            }
        }
    }
}
