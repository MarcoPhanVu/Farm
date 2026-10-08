import { Animal } from "./objects/Animal.js";
import { GameObject } from "./objects/GameObjects.js";
import { SpriteAnimation } from "./objects/SpriteAnimation.js";

import {
    RandomFromMinToMax,
    PosOrNeg,
    getRandomKeyFromObject,
    getRandomElementFromArray,
} from "./utils/random.js";
import { print } from "./utils/common.js";

import { colorTemplate } from "./config/colors.js";

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

        this.topPanel = this.ui.topPanel;
        this.toolPanel = this.ui.toolPanel;
        this.canvasPanel = this.ui.canvasPanel;
        this.propertiesPanel = this.ui.propertiesPanel;
        this.bottomPanel = this.ui.bottomPanel;

        // Top Panel
        this.moneyDisplay = this.ui.moneyDisplay;
        this.eggDisplay = this.ui.eggDisplay;
        this.stickDisplay = this.ui.stickDisplay;

        // Bottom Panel
        this.spawnAnimalBtn = this.ui.spawnAnimalBtn;
        this.spawn10RandomAnimalsBtn = this.ui.spawn10RandomAnimalsBtn;
        this.toggleGameStateBtn = this.ui.toggleGameStateBtn;

        const initTree = new GameObject(
            1,
            "Tree",
            "object",
            { x: 160, y: 100 },
            { width: 240, height: 240 },
            { moveX: 0, moveY: 0 },
            "tomato",
            150,
            1,
        );
        // initTree.setImage(this.assetsLoader.assetsList["stationaries"]["tree"]);
        // initTree.setAnimation(
        //     new SpriteAnimation(
        //         this.assetsLoader.assetsList.stationaries.tree.walking,
        //         0.15,
        //     ),
        // );
        // this.gameObjects.push(initTree);

        this.nextAnimalID = 2;
        this.animalsConfiguration = animalsConfiguration;
        this.animalNames = animalNames;

        // Entirely depended on chatGPT for this part, gotta learn about bindings in the future.
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.spawnAnimal = this.spawnAnimal.bind(this);
        this.spawnRandomAnimal = this.spawnRandomAnimal.bind(this);
        this.spawn10RandomAnimals = this.spawn10RandomAnimals.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.togglePlaying = this.togglePlaying.bind(this);

        // EventListeners
        // Have to bind functions first
        // this.spawnAnimalBtn.addEventListener("click", this.spawnRandomAnimal);
        document.addEventListener("keydown", (ev) => {
            console.log(ev.key);
            if (ev.key == "space") {
                console.log("spaced something");
            }
        });

        this.spawnAnimalBtn.addEventListener("click", () => {
            this.spawnRandomAnimal();
            this.currentMoney -= 30;
        });

        this.spawn10RandomAnimalsBtn.addEventListener("click", () => {
            this.spawn10RandomAnimals();
            this.currentMoney -= 300;
        });

        this.toggleGameStateBtn.addEventListener("click", this.togglePlaying);

        // Hover Over Object
        this.gameCanvas.addEventListener("mousemove", (event) => {
            this.getMousePosition(event);
            const objsList = this.getObjectsFromFrontToBack();
            this.hoveredObject = null; // ensure null

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

            this.selectedObject = null;

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
            this.buildPropertiesPanel();
        });
    }

    buildPropertiesPanel() {
        const header = "<h3>Properties</h3>";
        if (this.selectedObject == null) {
            this.propertiesPanel.innerHTML =
                header + `Nothing selected for now`;
            return;
        }

        const footer =
            '<button id="deleteSelectedBtn" class="simpleBtn">Delete</button>' +
            `<button id="sellSelectedBtn" class="simpleBtn">Sell for ${this.selectedObject.sellValue} </button>`;

        // console.log(JSON.stringify(this.selectedObject.animation));

        let propertiesHTML = header;
        const unneededProperties = [
            "id",
            // "position",
            "size",
            // "velocity",
            "layer",
            "sellValue",
            "state",
            "buyValue",
            "idleImage",
            "animation",
            "hovered",
            "selfElapsedTime",
            "selected",
            "isChangingDirection",
            "spriteSize",
            "boundTouched",
            "config",
            // "targetedObject",
            "currentActionTime",
            // species,
            "debugColor",
            "animations",
            "spriteDimension",
            "consumed",
        ];

        for (let keyName of Object.keys(this.selectedObject)) {
            // console.log(keyName);
            if (unneededProperties.includes(keyName)) {
                continue;
            }
            propertiesHTML +=
                `<p class="property-name" id="selected-${keyName}">` +
                // keyName.charAt(0).toUpperCase() +
                // keyName.slice(1) +
                keyName +
                ": ";

            try {
                if (this.selectedObject[keyName] == null) {
                    // Img and Animation will be Null in default
                    continue;
                }

                if (this.selectedObject[keyName].constructor == Object) {
                    // Expand if a dictionary
                    for (let key of Object.keys(this.selectedObject[keyName])) {
                        propertiesHTML +=
                            // '<p class="property-value">' +
                            `[${key}: ${this.selectedObject[keyName][key]}] `;
                    }
                }

                if (this.selectedObject[keyName].constructor == Number) {
                    propertiesHTML += Math.floor(this.selectedObject[keyName]);
                } else {
                    propertiesHTML +=
                        // '<p class="property-value">' +
                        this.selectedObject[keyName];
                }
            } catch (error) {
                console.log(this.selectedObject);
                console.log(this.selectedObject[keyName]);
                console.log(error);
            } finally {
                propertiesHTML += "</p>\n";
            }
        }

        this.propertiesPanel.innerHTML = propertiesHTML + footer;

        document
            .getElementById("deleteSelectedBtn")
            .addEventListener("click", () => {
                this.deleteSelectedObject();
            });

        document
            .getElementById("sellSelectedBtn")
            .addEventListener("click", () => {
                this.sellSelectedObject();
            });

        this.selectedObjectDOM = new Object();

        this.selectedObjectDOM.position =
            document.getElementById("selected-position");

        this.selectedObjectDOM.velocity =
            document.getElementById("selected-velocity");

        this.selectedObjectDOM.selfElapsedTime = document.getElementById(
            "selected-selfElapsedTime",
        );

        this.selectedObjectDOM.targetList = document.getElementById(
            "selected-targetList",
        );

        this.selectedObjectDOM.targetedObject = document.getElementById(
            "selected-targetedObject",
        );

        this.selectedObjectDOM.actionCoolDownTime = document.getElementById(
            "selected-actionCoolDownTime",
        );

        return;
    }

    updatePropertiesPanel() {
        if (
            this.selectedObject == null
            // this.selectedObject.position == null ||
            // this.selectedObject.velocity == null
        ) {
            return;
        }

        this.selectedObjectDOM.position.innerHTML = `[x: ${Math.floor(this.selectedObject.position.x)}] [y: ${Math.floor(this.selectedObject.position.y)}]`;

        this.selectedObjectDOM.velocity.innerHTML = `[moveX: ${this.selectedObject.velocity.moveX}] [moveY: ${this.selectedObject.velocity.moveY}]`;

        // this.selectedObjectDOM.selfElapsedTime.innerHTML = `elapsedTime: ${this.selectedObject.selfElapsedTime.toPrecision(2)}`;

        if (this.selectedObject.type == "animal") {
            let inText = "";
            for (let animal of this.selectedObject.targetList) {
                inText += animal.name + "__";
            }

            try {
                this.selectedObjectDOM.actionCoolDownTime.innerHTML = `actionCoolDownTime: ${this.selectedObject.actionCoolDownTime.toPrecision(2)}`;
                this.selectedObjectDOM.targetList.innerHTML = `targetList: ${inText}`;
                this.selectedObjectDOM.targetedObject.innerHTML = `targetedObject: ${this.selectedObject.targetedObject.name}`;
            } catch (error) {
                // console.log(error);
            }
        }
    }

    resizeCanvas() {
        this.gameCanvas.width = this.canvasPanel.clientWidth;
        this.gameCanvas.height = this.canvasPanel.clientHeight;
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
        this.updatePropertiesPanel();
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
        this.moneyDisplay.innerText = this.currentMoney;
        this.eggDisplay.innerText = this.currentEgg;
        this.stickDisplay.innerText = this.currentStick;
    }

    togglePlaying() {
        this.gameState = this.gameState == "playing" ? "paused" : "playing";
    }

    /**
     *
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
            // animalObj.setImage(animalSpriteMyAss["img"]);

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

    spawn10RandomAnimals() {
        this.spawnRandomAnimal();
        this.spawnRandomAnimal();
        this.spawnRandomAnimal();
        this.spawnRandomAnimal();
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

        this.buildPropertiesPanel();
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
