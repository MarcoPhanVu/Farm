import { GameManager } from "./GameManager.js";
import { AssetsLoaderProto } from "./Objects/AssetsLoader.js";
import { animalPool, stationaryObjectPool } from "./config/generalObjects.js";

// Global scope
const assetsLoader = new AssetsLoaderProto();
assetsLoader.loadAnimals(animalPool);
assetsLoader.loadObjects(stationaryObjectPool);
// console.log("Assets Loader:", assetsLoader);

const gameASDASD = new GameManager(assetsLoader);

window.gameASDASD = gameASDASD;
window.assetsLoader = assetsLoader;

gameASDASD.start();
