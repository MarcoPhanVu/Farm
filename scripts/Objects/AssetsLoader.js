import {
    animalConfiguration,
    interactablesConfiguration,
    stationaryObjectConfiguration,
} from "../config/generalObjects.js";

/**
 * This class takes in Object Configurations and process it to be spriteImgs for other classes can use it without having extra functions to load images and animations.
 */
export class AssetsLoader {
    _assetsList = { animals: {}, statObjects: {}, interactables: {} };
    constructor() {}

    loadAnimals(config) {
        for (let animalSpecies of Object.keys(config)) {
            let animal = animalConfiguration[animalSpecies];

            if (!this._assetsList["animals"][animalSpecies]) {
                this._assetsList["animals"][animalSpecies] = {};
            }
            console.log(Object.entries(animal.sprite));

            // Cleaner version from chatGPT
            for (let [spriteType, spriteInfo] of Object.entries(
                animal.sprite,
            )) {
                console.log(spriteType);
                console.log(spriteInfo);
                if (spriteInfo.src !== null) {
                    // Create image if source is valid
                    const spriteImage = new Image();
                    spriteImage.src = new URL(
                        spriteInfo.src,
                        import.meta.url,
                    ).href;

                    // Process sprite file name
                    let spriteProperties = spriteInfo.src.split("-").splice(1); // get properties after animal name

                    // Get spriteSize
                    let spriteSize = spriteProperties.pop().split("x")[0];

                    this._assetsList["animals"][animalSpecies][spriteType] = {
                        spriteImage: spriteImage,
                        spriteSize: Number(spriteSize),
                    };

                    if (spriteProperties[0] === "walking") {
                        let spriteSheet = {
                            col: Number(spriteProperties[1]),
                            row: Number(spriteProperties[2]),
                        };
                        this._assetsList["animals"][animalSpecies][spriteType][
                            "spriteSheet"
                        ] = spriteSheet;
                    }

                    spriteImage.onload = () => {
                        // console.log(`${animalSpecies}[${spriteType}]: sprite loaded`);
                    };
                }
            }
        }

        console.log(this._assetsList);
    }
}
