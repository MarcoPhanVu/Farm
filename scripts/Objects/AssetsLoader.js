import { animalPool } from "../config/animals.js";

export class AssetsLoaderProto {
    constructor() {
        this.assetsList = {};
    }

    load(animalPool) {
        for (let animalSpecies of Object.keys(animalPool)) {
            let animal = animalPool[animalSpecies];

            if (!this.assetsList[animalSpecies]) {
                //init animal obj
                this.assetsList[animalSpecies] = {};
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

                    this.assetsList[animalSpecies][spriteType] = {
                        spriteImage: spriteImage,
                        spriteSize: Number(spriteSize),
                    };

                    if (spriteProperties[0] === "walking") {
                        let spriteSheet = {
                            col: Number(spriteProperties[1]),
                            row: Number(spriteProperties[2]),
                        };
                        this.assetsList[animalSpecies][spriteType][
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
}
