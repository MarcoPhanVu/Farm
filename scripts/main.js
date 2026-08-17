import { GameManager } from "./GameManager.js";
import { animalPool } from "./config/animals.js";

const gameASDASD = new GameManager();

// Global scope
const assetsLoader = {};

for (let animalType of Object.keys(animalPool)) {
    let animal = animalPool[animalType];

    // Sample URL: walking: "../assets/duck-walking-anim-2-3-16x16.png"

    if (!assetsLoader[animalType]) {
        // animal has not been initiated yet
        assetsLoader[animalType] = {};
    }
    for (let spriteType of Object.keys(animal.sprite)) {
        if (animal.sprite[spriteType] != null) {
            let spriteImg = new Image();
            spriteImg.src = new URL(
                animal.sprite[spriteType],
                import.meta.url,
            ).href;

            assetsLoader[animalType][spriteType] = spriteImg;

            spriteImg.onload = () => {
                console.log(`${animalType}[${spriteType}]: sprite loaded`);
            };
        }
    }

    // Cleaner version from chatGPT
    // for (let [spriteType, spritePath] of Object.entries(animal.sprite)) {
    //     if (spritePath !== null) {
    //         const spriteImg = new Image();

    //         spriteImg.src = new URL(spritePath, import.meta.url).href;

    //         assetsLoader[animalType][spriteType] = spriteImg;
    //     }
    // }
}
console.log("Assets Loader:", assetsLoader);

// animalObj.setImage(chickImage);
// const chickenAnimation = new SpriteAnimation(
//     chickImage,
//     8,
//     8,
//     4,
//     2,
//     0.15,
// );
// animalObj.setAnimation(chickenAnimation);

window.gameASDASD = gameASDASD;
window.assetsLoader = assetsLoader;

gameASDASD.start();
