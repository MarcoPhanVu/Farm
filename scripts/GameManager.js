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
    gameObjects = [];

    grainCount = 0;
    currentMoney = 40;
    currentEgg = 70;
    currentStick = 90;

    lastTime = 0;
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

        this.nextAnimalID = 0;
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
        let elapsedTime = currentTime - this.lastTime;
        let deltaTime = elapsedTime / 1000;
        this.lastTime = currentTime;

        // Prevent huge jumps if tab was inactive(like spawning balls in physic engine)
        deltaTime = Math.min(deltaTime, 0.05);

        if (this.gameState === "playing") {
            this.update(deltaTime, elapsedTime);
        }

        this.render();
        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime, elapsedTime) {
        this.ui.updatePropertiesPanel(this.selectedObject);
        this.updateResourcesBar();

        for (let object of this.gameObjects) {
            object.update(deltaTime, this.gameCanvas, this.gameObjects);
        }

        this.gameObjects = this.gameObjects.filter(
            (object) => !object.consumed,
        );
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

    updateResourcesBar() {
        this.ui.updateResources({
            money: this.currentMoney,
            eggs: this.currentEgg,
            sticks: this.currentStick,
            elapsedTime: this.elapsedTime
        });
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
            console.log(species, "is not exist");
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

        console.log("obj removed");
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

    spawnManyGrains(n) {
        for (let i = 0; i < n; i++) {
            this.spawnGrain(
                RandomFromMinToMax(100, this.gameCanvas.width - 100),
                RandomFromMinToMax(100, this.gameCanvas.height - 100),
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
            this.assetsLoader._assetsList["interactables"]["grain"],
        );

        this.gameObjects.push(smallGrainPile);
    }

    drawingLessons() {
        let ptn = this.painter; // requestAnimationFrame(this.gameLoop);

        ptn.fillStyle = "salmon";
        ptn.font = "normal 120px sans-serif";
        ptn.fillText("something", 500, 500);
        ptn.moveTo(560, 540);
        ptn.lineTo(680, 590);
        ptn.lineTo(630, 710);
        ptn.lineTo(510, 660);
        ptn.fill();
        // this.gameState = "pause";

        ptn.beginPath();
        ptn.strokeStyle = "lightgray";
        for (let i = 0; i < 16; i++) {
            ptn.moveTo(500 + i * 20, 500 + 0);
            ptn.lineTo(500 + i * 20, 500 + 300);
            ptn.moveTo(500 + 0, 500 + i * 20);
            ptn.lineTo(500 + 300, 500 + i * 20);
            ptn.stroke();
        }

        ptn.beginPath();
        ptn.strokeStyle = "lightblue";
        ptn.lineWidth = 30;
        ptn.lineCap = "round";
        ptn.lineCap = "square";
        ptn.moveTo(800, 500);
        ptn.lineTo(900, 550);
        ptn.stroke();
    }

    start() {
        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas();

        requestAnimationFrame(this.gameLoop);

        this.ui.populateStoreBar(this.animalsConfiguration, this.assetsLoader);

        for (let i = 0; i < 8; i++) {
            // this.spawnAnimal("chicken");
            // this.spawnAnimal("duck");
            this.spawnAnimal("dog");
        }

        this.spawnManyGrains(5);

        // this.drawingLessons();
    }
}
