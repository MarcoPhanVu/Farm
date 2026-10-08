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

const uiManager = new UIManager({
    onBuyAnimal: (animalName) => {
        MAINGAMEMANGER.spawnAnimal(animalName);
    },

    onBuy10RandomAnimals: () => {
        MAINGAMEMANGER.spawn10RandomAnimals();
    },

    onBuyRandomAnimal: () => {
        MAINGAMEMANGER.spawnRandomAnimal();
    },

    onToggleGameState: () => {
        MAINGAMEMANGER.togglePlaying();
    }

    onDeleteSelected: () => {
        
    }
});

const MAINGAMEMANGER = new GameManager(assetsLoader, uiManager);

window.MAINGAMEMANGER = MAINGAMEMANGER;
window.assetsLoader = assetsLoader;

MAINGAMEMANGER.start();
