import { GameManager } from "./GameManager.js";
import { AssetsLoader } from "./objects/AssetsLoader.js";

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
        FARM.spawnAnimal(animalName);
    },

    onBuy5RandomAnimals: () => {
        FARM.spawn5RandomAnimals();
        console.log("spawn5RandomAnimals");
        FARM.currentMoney -= 150;
    },

    onBuyRandomAnimal: () => {
        FARM.spawnRandomAnimal();
        console.log("spawnRandomAnimal");
    },

    onToggleGameState: () => {
        FARM.togglePlaying();
        console.log("togglePlaying", FARM.gameState);
    },

    onDeleteSelected: () => {
        FARM.deleteSelectedObject();
        console.log("deleteSelectedObject");
    },

    onSellSelected: () => {
        FARM.sellSelectedObject();
        console.log("sellSelectedObject");
    }
});

uiManager.setUpEventListeners()

const FARM = new GameManager(assetsLoader, uiManager);

window.FARM = FARM;
window.assetsLoader = assetsLoader;

FARM.start();
