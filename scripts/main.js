import { GameManager } from "./GameManager.js";
import { AssetsLoader } from "./Objects/AssetsLoader.js";

import { animalConfiguration } from "./config/generalObjects.js";
import { stationaryObjectConfiguration } from "./config/generalObjects.js";
import { interactablesConfiguration } from "./config/generalObjects.js";

import { UIManager } from "./manager/UIManager.js";

// Global scope
const assetsLoader = new AssetsLoader();
assetsLoader.loadAnimals(animalConfiguration);
assetsLoader.loadObjects(stationaryObjectConfiguration);
// assetsLoader.loadInteractables(interactablesConfiguration);

const uiManager = new UIManager({
    onBuyAnimal: (animalName) => {
        gameASDASD.spawnAnimal(animalName);
    },
});

const gameASDASD = new GameManager(assetsLoader, uiManager);

window.gameASDASD = gameASDASD;
window.assetsLoader = assetsLoader;

gameASDASD.start();
