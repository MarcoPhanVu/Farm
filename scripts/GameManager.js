import { Animal } from "./Objects/Animal.js";
import { GameObject } from "./Objects/GameObjects.js";
import {
    RandomFromMinToMax,
    PosOrNeg,
    getRandomValueFromObject,
} from "./utils/random.js";
import { colorTemplate } from "./config/colors.js";
import { animalPool } from "./config/generalObjects.js";
import { SpriteAnimation } from "./Objects/SpriteAnimation.js";

export class GameManager {
    constructor(assetsLoader) {
        this.gameCanvas = document.getElementById("gameCanvas");
        this.painter = this.gameCanvas.getContext("2d");

        this.topPanel = document.getElementById("topPanel");
        this.toolPanel = document.getElementById("toolPanel");
        this.canvasPanel = document.getElementById("canvasPanel");
        this.propertiesPanel = document.getElementById("propertiesPanel");
        this.bottomPanel = document.getElementById("bottomPanel");

        // Top Panel
        this.moneyDisplay = document.getElementById("currentMoneyDisplay");
        this.eggDisplay = document.getElementById("currentEggDisplay");
        this.stickDisplay = document.getElementById("currentStickDisplay");

        // Bottom Panel
        this.spawnAnimalBtn = document.getElementById("spawnAnimalBtn");
        this.spawn10RandomAnimalsBtn = document.getElementById(
            "spawn10RandomAnimalsBtn",
        );
        this.toggleGameStateBtn = document.getElementById("toggleGameStateBtn");

        // Initial objects
        this.assetsLoader = assetsLoader;

        this.gameObjects = [];

        const initTree = new GameObject(
            1,
            "Tree",
            "object",
            { x: 160, y: 100 },
            { width: 240, height: 240 },
            { moveX: 0, moveY: 0 },
            // "cornsilk",
            // "honeydew",
            // "ivory",
            // "floralwhite",
            // "forestgreen",
            // "darkseagreen",
            // "darksalmon",
            // "darkolivegreen",
            // "darkmagenta",
            // "coral",
            // "burlywood",
            // "azure",
            // "beige",
            // "bisque",
            // "lightcyan",
            "lightgreen",
            // "lightslategrey",
            // "palevioletred",
            // "powderblue",
            // "tomato",
            150,
            1,
        );
        initTree.setImage(this.assetsLoader.assetsList["statObjects"]["tree"]);
        initTree.setAnimation(
            new SpriteAnimation(
                this.assetsLoader.assetsList.statObjects.tree.walking,
                0.15,
            ),
        );
        this.gameObjects.push(initTree);

        this.currentMoney = 40;
        this.currentEgg = 70;
        this.currentStick = 90;

        this.lastTime = 0;
        this.gameState = "playing";

        this.hoveredObject = null;
        this.selectedObject = null;
        this.selectedObjectDOM = null;

        this.nextAnimalID = 2;
        this.animalPool = animalPool;

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
            const mouse = this.getMousePosition(event);
            const objsList = this.getObjectsFromFrontToBack();
            this.hoveredObject = null; // ensure null

            for (let obj of objsList) {
                // need to find a more optimal way to deal with
                if (obj.containsPoints(mouse.x, mouse.y)) {
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
            const mouse = this.getMousePosition(event);
            const objsList = this.getObjectsFromFrontToBack();

            this.selectedObject = null;

            for (let obj of objsList) {
                if (obj.containsPoints(mouse.x, mouse.y)) {
                    this.selectedObject = obj;
                    break;
                }
            }

            for (let obj of this.gameObjects) {
                obj.selected = obj === this.selectedObject;
            }

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
            // "name",
            "type",
            // "position",
            // "size",
            // "velocity",
            "debugColor",
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
        for (let object of this.gameObjects) {
            object.update(deltaTime, this.gameCanvas, this.gameObjects);
        }

        this.updatePropertiesPanel();
        this.updateResourcesBar();
    }

    render() {
        // From back to front
        this.painter.clearRect(
            0,
            0,
            this.gameCanvas.width,
            this.gameCanvas.height,
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

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
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

    spawnAnimal(species) {
        let animal = this.animalPool[species];

        if (!animal) {
            console.log(species, "is not exist");
        } else {
            let currentID = this.nextAnimalID++;
            let name = `${species} ${currentID}`;
            let type = "animal";
            let position = {
                x: RandomFromMinToMax(
                    80,
                    this.gameCanvas.width - animal.size.width,
                ),
                y: RandomFromMinToMax(
                    80,
                    this.gameCanvas.height - animal.size.height,
                ),
            };
            let debugColor =
                colorTemplate["BrightAss"].colors[
                    RandomFromMinToMax(
                        0,
                        colorTemplate["BrightAss"].colors.length - 1,
                    )
                ];

            let animalObj = new Animal(
                currentID,
                name,
                type,
                position,
                animal["size"],
                debugColor,
                animal["sellValue"],
                1, // Animal will be in layer 1
                animal,
            );

            let animalSpriteMyAss =
                this.assetsLoader.assetsList["animals"][species];

            animalObj.setImage(animalSpriteMyAss["img"]);

            let spriteAnimationContainer = new SpriteAnimation(
                animalSpriteMyAss["walking"],
                0.2,
            );

            animalObj.setAnimation(spriteAnimationContainer);

            this.gameObjects.push(animalObj);
        }
    }

    spawnRandomAnimal() {
        this.spawnAnimal(getRandomValueFromObject(animalPool).trueName);
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
        this.spawnRandomAnimal();
    }

    deleteSelectedObject() {
        if (this.selectedObject == null) {
            return;
        }

        let index = this.gameObjects.indexOf(this.selectedObject);

        if (index !== -1) {
            // object exist
            this.gameObjects.splice(index, 1); // take 1 ele out of that index.
        }

        this.selectedObject = null;
        this.selectedObjectDOM = null;
        this.hoveredObject = null;

        this.buildPropertiesPanel();
    }

    sellSelectedObject() {
        this.currentMoney += this.selectedObject.sellValue;
        this.deleteSelectedObject();
    }

    start() {
        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas();

        requestAnimationFrame(this.gameLoop);

        this.spawnAnimal("dog");

        for (let i = 0; i < 5; i++) {
            this.spawnAnimal("chicken");
            this.spawnAnimal("duck");
            this.spawnAnimal("chicken");
            this.spawnAnimal("duck");
            // this.spawnAnimal("dog");
            this.spawnAnimal("number");
            this.spawnAnimal("sheep");
            this.spawnAnimal("sheep2");
        }

        // this.gameState = "pause";
    }
}
