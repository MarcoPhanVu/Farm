import { Animal } from "./objects/Animal.js";
import { GameObject } from "./objects/GameObjects.js";
import { SpriteAnimation } from "./objects/SpriteAnimation.js";

import {
    RandomFromMinToMax,
    PosOrNeg,
    getRandomKeyFromObject,
    getRandomElementFromArray,
} from "./utils/random.js";

import {
    animalsConfiguration,
    stationariesConfiguration,
    interactablesConfiguration,
} from "./config/generalObjects.js";

import { animalNames } from "./config/animalNames.js";

export class GameManager {
    // Initial variables
    gameObjects = [];

    grainCount = 0;
    boneCount = 0;

    currentMoney = 40;
    currentEgg = 70;
    currentStick = 90;
    nextAnimalID = 0;

    // Timer
    lastTime = 0;
    totalElapsedTime = 0;
    properyUpdateTimer = 0;

    grainSpawnTimer = 6;
    grassSpawnTimer = 6;
    boneSpawnTimer = 6;

    // Spawn Intervals
    grainSpawnInterval = 8;
    grassSpawnInterval = 12;
    boneSpawnInterval = 16;

    gameState = "playing";

    hoveredObject = null;
    selectedObject = null;
    selectedObjectDOM = null;

    mouse = { x: 0, y: 0 };

    constructor(assetsLoader, UIManager) {
        this.assetsLoader = assetsLoader;
        this.ui = UIManager;

        this.gameCanvas = this.ui.gameCanvas;
        this.painter = this.gameCanvas.getContext("2d");

        this.animalsConfiguration = animalsConfiguration;
        this.animalNames = animalNames;

        // Entirely depended on chatGPT for this part, gotta learn about bindings in the future.
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.spawnAnimal = this.spawnAnimal.bind(this);
        this.spawnRandomAnimal = this.spawnRandomAnimal.bind(this);
        this.spawn5RandomAnimals = this.spawn5RandomAnimals.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.togglePlaying = this.togglePlaying.bind(this);

        // EventListeners
        // Have to bind functions so they know that they belong to GAMEMANAGER first
        document.addEventListener("keydown", (ev) => {
            if (ev.key == "space") {
                console.log("spaced something");
            }
        });

        // Hover Over Object
        this.gameCanvas.addEventListener("mousemove", (event) => {
            this.getMousePosition(event);
            const objsList = this.getObjectsFromFrontToBack();
            this.hoveredObject = null; // ensure null(new target)

            for (let obj of objsList) {
                // need to find a more optimal way to deal with
                if (obj.containsPoints(this.mouse.x, this.mouse.y)) {
                    this.hoveredObject = obj;
                    break;
                }
            }

            for (let obj of this.gameObjects) {
                // determine the hovered state of hovered object.
                obj.hovered = obj === this.hoveredObject;
            }
        });

        // Select Objects
        this.gameCanvas.addEventListener("click", (event) => {
            this.getMousePosition(event);
            const objsList = this.getObjectsFromFrontToBack();

            this.selectedObject = null; //always one selected at a time

            for (let obj of objsList) {
                if (obj.containsPoints(this.mouse.x, this.mouse.y)) {
                    this.selectedObject = obj;
                    break;
                }
            }

            for (let obj of this.gameObjects) {
                obj.selected = obj === this.selectedObject;
            }

            this.spawnGrain(this.mouse.x, this.mouse.y);
            this.ui.buildPropertiesPanel(this.selectedObject);
        });
    }

    resizeCanvas() {
        this.gameCanvas.width = this.ui.canvasPanel.clientWidth;
        this.gameCanvas.height = this.ui.canvasPanel.clientHeight;
        this.render();
    }

    gameLoop(currentTime) {
        let instantElapsedTime = currentTime - this.lastTime;
        let deltaTime = instantElapsedTime / 1000;

        // Prevent huge jumps if tab was inactive(like spawning balls in physic engine)
        deltaTime = Math.min(deltaTime, 0.05);

        this.lastTime = currentTime;

        if (this.gameState === "playing") {
            this.update(deltaTime);
        }

        this.render();
        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime) {
        this.properyUpdateTimer += deltaTime;
        if (this.properyUpdateTimer >= 0.2) {
            this.ui.updatePropertiesPanel(this.selectedObject);
            this.properyUpdateTimer -= 0.2;
        }

        this.totalElapsedTime += deltaTime; // prevent totalElapse keep increasing when tab is unfocus(requestAnimationFrame will keep on counting)
        this.ui.updateResources({
            money: this.currentMoney,
            eggs: this.currentEgg,
            sticks: this.currentStick,
            elapsedTime: this.totalElapsedTime,
        });

        // spawn time counter
        this.grainSpawnTimer += deltaTime;
        this.grassSpawnTimer += deltaTime;
        this.boneSpawnTimer += deltaTime;

        // Update all other objects in general
        for (let object of this.gameObjects) {
            object.update(deltaTime, this.gameCanvas, this.gameObjects);
        }

        // Clear consumed/killed/destroyed objects
        this.gameObjects = this.gameObjects.filter(
            (object) => !object.consumed,
        );

        // Spawn food every interval
        if (this.grainSpawnTimer >= this.grainSpawnInterval) {
            this.grainSpawnTimer -= this.grainSpawnInterval;
            this.spawnManyGrains(3);
        }
        if (this.grassSpawnTimer >= this.grassSpawnInterval) {
            this.grassSpawnTimer -= this.grassSpawnInterval;
        }
        if (this.boneSpawnTimer >= this.boneSpawnInterval) {
            this.boneSpawnTimer -= this.boneSpawnInterval;
            this.spawnManyBones(3);
        }
    }

    render() {
        // From back to front
        this.painter.clearRect(
            0,
            0,
            this.gameCanvas.width,
            this.gameCanvas.height,
        );

        // show cursor
        this.painter.fillStyle = "white";
        let cursorSize = 12;
        this.painter.fillRect(
            this.mouse.x - cursorSize / 2,
            this.mouse.y - cursorSize / 2,
            cursorSize,
            cursorSize,
        );

        this.painter.imageSmoothingEnabled = false;

        const sortedObjects = [...this.gameObjects].sort((a, b) => {
            if (a.layer !== b.layer) {
                return a.layer - b.layer; // if pos -> b b4 a, if neg -> a b4 b
            }

            return a.getBottomY() - b.getBottomY();
        });

        for (let object of sortedObjects) {
            object.render(this.painter);
        }
    }

    getMousePosition(event) {
        const rect = this.gameCanvas.getBoundingClientRect(); // Dist from this.gameCanvas to client's windows

        let mousePos = {
            x: event.clientX - rect.left + 2,
            y: event.clientY - rect.top + 6,
        };

        this.mouse = mousePos;

        return mousePos;
    }

    getObjectsFromFrontToBack() {
        const sortedObjects = [...this.gameObjects].sort((a, b) => {
            if (a.layer !== b.layer) {
                return b.layer - a.layer;
            }

            return b.getBottomY() - a.getBottomY();
        });

        return sortedObjects;
    }

    togglePlaying() {
        this.gameState = this.gameState == "playing" ? "paused" : "playing";
    }

    /**
     * @param {string} species - species
     */
    spawnAnimal(species) {
        let animalConfig = this.animalsConfiguration[species];

        if (!animalConfig) {
            console.error(species, "is not exist");
        } else {
            let currentID = this.nextAnimalID++;
            let name = this.animalNames.pop();
            let position = {
                x: RandomFromMinToMax(
                    80,
                    this.gameCanvas.width - animalConfig.size.width,
                ),
                y: RandomFromMinToMax(
                    80,
                    this.gameCanvas.height - animalConfig.size.height,
                ),
            };
            let animalSpriteCollection =
                this.assetsLoader._assetsList["animals"][species];

            let animalObj = new Animal(
                currentID,
                name,
                position,
                animalConfig,
                animalSpriteCollection,
            );

            let animalSpriteMyAss =
                this.assetsLoader._assetsList["animals"][species];

            animalObj.setImage(animalSpriteMyAss["defaultImg"]);

            let spriteAnimationContainer = new SpriteAnimation(
                animalSpriteMyAss["walking"],
                0.2,
            );

            animalObj.setAnimation(spriteAnimationContainer);

            this.gameObjects.push(animalObj);

            return animalObj;
        }
    }

    spawnRandomAnimal() {
        this.spawnAnimal(getRandomKeyFromObject(animalsConfiguration).species);
    }

    spawn5RandomAnimals() {
        this.spawnRandomAnimal();
        this.spawnRandomAnimal();
        this.spawnRandomAnimal();
        this.spawnRandomAnimal();
        this.spawnRandomAnimal();
    }

    removeGameObject(obj) {
        const index = this.gameObjects.indexOf(obj);

        if (index !== -1) {
            this.gameObjects.splice(index, 1);
        }

        console.error("obj removed");
    }

    deleteSelectedObject() {
        if (this.selectedObject == null) {
            return;
        }

        this.removeGameObject(this.selectedObject);

        this.selectedObject = null;
        this.selectedObjectDOM = null;
        this.hoveredObject = null;

        this.ui.buildPropertiesPanel(this.selectedObject);
    }

    sellSelectedObject() {
        this.currentMoney += this.selectedObject.sellValue;
        this.deleteSelectedObject();
    }

    /**
     *
     * @type {int} n: amount of grains per spawn
     */
    spawnManyGrains(n) {
        for (let i = 0; i < n; i++) {
            this.spawnGrain(
                RandomFromMinToMax(50, this.gameCanvas.width - 50),
                RandomFromMinToMax(50, this.gameCanvas.height - 50),
            );
        }
    }

    spawnManyBones(n) {
        for (let i = 0; i < n; i++) {
            this.spawnBone(
                RandomFromMinToMax(50, this.gameCanvas.width - 50),
                RandomFromMinToMax(50, this.gameCanvas.height - 50),
            );
        }
    }

    spawnGrain(posX, posY) {
        const smallGrainPile = new GameObject(
            "randomID",
            `grain pile ${this.grainCount++}`,
            {
                x: posX,
                y: posY,
            },
            interactablesConfiguration.grain,
        );
        smallGrainPile.setImage(
            this.assetsLoader._assetsList["interactables"]["grain"]["idle"],
        );

        this.gameObjects.push(smallGrainPile);

        const grainSprite =
            this.assetsLoader._assetsList.interactables.grain.defaultImg;
    }

    spawnBone(posX, posY) {
        const pieceOfBone = new GameObject(
            "randomID",
            `bone ${this.boneCount++}`,
            {
                x: posX,
                y: posY,
            },
            interactablesConfiguration.bone,
        );
        pieceOfBone.setImage(
            this.assetsLoader._assetsList["interactables"]["bone"][
                "defaultImg"
            ],
        );

        this.gameObjects.push(pieceOfBone);

        const boneSprite =
            this.assetsLoader._assetsList.interactables.bone.defaultImg;
    }

    start() {
        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas();

        requestAnimationFrame(this.gameLoop);

        this.ui.populateStoreBar(this.animalsConfiguration, this.assetsLoader);

        let newestDawg = null;

        for (let i = 0; i < 3; i++) {
            newestDawg = this.spawnAnimal("dog");
            // console.log(newestDawg.name)
        }

        // newestDawg.selected = true;
        this.ui.buildPropertiesPanel(newestDawg);
        console.log(newestDawg);
        // this.gameState = "paused"
        for (let i = 0; i < 8; i++) {
            this.spawnAnimal("chicken");
            this.spawnAnimal("duck");
        }
    }
}
