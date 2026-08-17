import { GameManager } from "./GameManager.js";
import { animalPool } from "./config/animals.js";

const gameASDASD = new GameManager();

for (let animalType of Object.keys(animalPool)) {
    let animal = animalPool[animalType];
    console.log(animal);

    for (let spriteType of Object.keys(animal.sprite)) {
        console.log(`spriteType: ${spriteType}`);
        if (animal[spriteType] != "none") {
            console.log(animal.sprite[spriteType]);
        }
    }

    // chickImage.onload = () => {
    //     console.log("Chicken sprite loaded");
    // };
}

window.gameASDASD = gameASDASD;

gameASDASD.start();
