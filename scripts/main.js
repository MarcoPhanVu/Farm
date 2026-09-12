import { GameManager } from "./GameManager.js";
import { AssetsLoader } from "./Objects/AssetsLoader.js";
import { animalPool, stationaryObjectPool } from "./config/generalObjects.js";
import { UIManager } from "./manager/UIManager.js";

// Global scope
const assetsLoader = new AssetsLoader();
assetsLoader.loadAnimals(animalPool);
assetsLoader.loadObjects(stationaryObjectPool);

const uiManager = new UIManager({
    onBuyAnimal: (animalName) => {
        gameASDASD.spawnAnimal(animalName);
    },
});

const gameASDASD = new GameManager(assetsLoader, uiManager);

window.gameASDASD = gameASDASD;
window.assetsLoader = assetsLoader;

gameASDASD.start();
