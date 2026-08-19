import { GameManager } from "./GameManager.js";
import { AssetsLoaderProto } from "./Objects/AssetsLoader.js";
import { animalPool } from "./config/animals.js";

// Global scope
const assetsLoader = new AssetsLoaderProto();
assetsLoader.load(animalPool);
console.log("Assets Loader:", assetsLoader);

const gameASDASD = new GameManager(assetsLoader);

window.gameASDASD = gameASDASD;
window.assetsLoader = assetsLoader;

gameASDASD.start();
