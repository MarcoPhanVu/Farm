import {
    animalsConfiguration,
    interactablesConfiguration,
    stationariesConfiguration,
} from "../config/generalObjects.js";

/**
 * This class takes in Object Configurations and process it to be spriteImgs for other classes can use it without having extra functions to load images and animations.
 */
export class AssetsLoader {
    _assetsList = { animals: {}, stationaries: {}, interactables: {} };
    constructor() {}

    load(configurations) {
        console.log(Object.entries(configurations));
        for (let [configName, config] of Object.entries(configurations)) {
            console.log(configName);
            console.log(config);
            for (let objectName of Object.keys(config)) {
                let object = config[objectName];

                if (!this._assetsList[configName][objectName]) {
                    this._assetsList[configName][objectName] = {};
                }

                // Cleaner version from chatGPT
                for (let [spriteType, spriteInfo] of Object.entries(
                    object.sprite,
                )) {
                    if (spriteInfo.src !== null) {
                        // Create image if source is valid
                        const spriteImage = new Image();
                        spriteImage.src = new URL(
                            spriteInfo.src,
                            import.meta.url,
                        ).href;

                        //fucking shiet, now I'll have to deal with the stationaries too
                        // if (configName != "animals") {
                        //     console.log(spriteType);
                        //     console.log(spriteInfo);
                        // }

                        let spriteProperties = spriteInfo.src
                            .split("-")
                            .splice(1); // get properties after object name

                        // console.log("props", objectName, ":", spriteProperties);

                        let lastProps = spriteProperties.pop();
                        // console.log("last of", objectName, ":", lastProps);

                        // Get spriteSize (just before extension)
                        let spriteSize = {
                            width: Number(lastProps.split("x")[0]),
                            height: Number(
                                lastProps.split("x")[1].split(".")[0],
                            ),
                        };

                        this._assetsList[configName][objectName][spriteType] = {
                            spriteImage: spriteImage,
                            spriteSize: spriteSize,
                        };

                        if (spriteProperties[0] === "walking") {
                            let spriteSheet = {
                                col: Number(spriteProperties[1]),
                                row: Number(spriteProperties[2]),
                            };
                            this._assetsList[configName][objectName][
                                spriteType
                            ]["spriteSheet"] = spriteSheet;
                        }

                        spriteImage.onload = () => {};
                    }
                }
            }

            // console.log(this._assetsList.animals);
            // console.log(this._assetsList.statObjects);
            // console.log(this._assetsList.interactables);
        }
    }
}
