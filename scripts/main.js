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
        console.assert("spawn5RandomAnimals");
        FARM.currentMoney -= 150;
    },

    onBuyRandomAnimal: () => {
        FARM.spawnRandomAnimal();
    },

    onToggleGameState: () => {
        FARM.togglePlaying();
        console.assert("togglePlaying", FARM.gameState);
    },

    onDeleteSelected: () => {
        FARM.deleteSelectedObject();
    },

    onSellSelected: () => {
        FARM.sellSelectedObject();
    },
});

uiManager.setUpEventListeners();

const FARM = new GameManager(assetsLoader, uiManager);

window.FARM = FARM;
window.assetsLoader = assetsLoader;

FARM.start();
