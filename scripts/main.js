import { GameManager } from "./GameManager.js";
import { AssetsLoader } from "./Objects/AssetsLoader.js";

import { animalsConfiguration } from "./config/generalObjects.js";
import { stationariesConfiguration } from "./config/generalObjects.js";
import { interactablesConfiguration } from "./config/generalObjects.js";

import { UIManager } from "./manager/UIManager.js";

// Global scope
const assetsLoader = new AssetsLoader();
const configurationCollection = {
    animals: animalsConfiguration,
    interactables: interactablesConfiguration,
    stationaries: stationariesConfiguration,
};

assetsLoader.load(configurationCollection);
// assetsLoader.load(stationariesConfiguration);
// assetsLoader.load(interactablesConfiguration);

const uiManager = new UIManager({
    onBuyAnimal: (animalName) => {
        gameASDASD.spawnAnimal(animalName);
    },
});

const gameASDASD = new GameManager(assetsLoader, uiManager);

window.gameASDASD = gameASDASD;
window.assetsLoader = assetsLoader;

gameASDASD.start();
