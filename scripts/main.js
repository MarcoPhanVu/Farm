import { GameManager } from "./GameManager.js";
import { animalPool } from "./config/animals.js";

const gameASDASD = new GameManager();

// Global scope
const assetsLoader = {};

for (let animalSpecies of Object.keys(animalPool)) {
    let animal = animalPool[animalSpecies];

    // Sample URL: walking: "../assets/duck-walking-anim-2-3-16x16.png"

    if (!assetsLoader[animalSpecies]) {
        // animal has not been initiated yet
        assetsLoader[animalSpecies] = {};
    }
    for (let spriteType of Object.keys(animal.sprite)) {
        if (animal.sprite[spriteType] != null) {
            let spriteImage = new Image();
            spriteImage.src = new URL(
                animal.sprite[spriteType],
                import.meta.url,
            ).href;

            let spritePropeties = animal.sprite[spriteType]
                .split("-")
                .splice(1);

            // let spriteSize = spritePropeties.at(-1).split("x")[0];
            let spriteSize = spritePropeties.pop().split("x")[0];

            assetsLoader[animalSpecies][spriteType] = {
                spriteImage: spriteImage,
                spriteSize: Number(spriteSize),
            };

            if (spritePropeties[0] == "walking") {
                let spriteSheet = {
                    col: Number(spritePropeties[1]),
                    row: Number(spritePropeties[2]),
                };
                assetsLoader[animalSpecies][spriteType]["spriteSheet"] =
                    spriteSheet;
            }

            spriteImage.onload = () => {
                // console.log(`${animalSpecies}[${spriteType}]: sprite loaded`);
            };
        }
    }

    // Cleaner version from chatGPT
    // for (let [spriteType, spritePath] of Object.entries(animal.sprite)) {
    //     if (spritePath !== null) {
    //         const spriteImage = new Image();

    //         spriteImage.src = new URL(spritePath, import.meta.url).href;

    //         assetsLoader[animalSpecies][spriteType] = spriteImage;
    //     }
    // }
}
console.log("Assets Loader:", assetsLoader);

window.gameASDASD = gameASDASD;
window.assetsLoader = assetsLoader;

gameASDASD.start();
