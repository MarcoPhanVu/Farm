import { Animal } from "./Objects/Animal.js";
import { GameObject } from "./Objects/GameObjects.js";
import {
    RandomFromMinToMax,
    PosOrNeg,
    getRandomValueFromObject,
} from "./utils/random.js";
import { colorTemplate } from "./config/colors.js";
import { animalPool } from "./config/animals.js";
import { SpriteAnimation } from "./Objects/SpriteAnimation.js";

export class GameManager {
    constructor() {
        this.gameCanvas = document.getElementById("gameCanvas");
        this.painter = this.gameCanvas.getContext("2d");

        this.actionPanel = document.getElementById("actionPanel");
        this.toolPanel = document.getElementById("toolPanel");
        this.canvasPanel = document.getElementById("canvasPanel");
        this.propertiesPanel = document.getElementById("propertiesPanel");
        this.bottomPanel = document.getElementById("bottomPanel");

        // Bottom Panel
        this.spawnAnimalBtn = document.getElementById("spawnAnimalBtn");
        this.toggleGameStateBtn = document.getElementById("toggleGameStateBtn");

        // Initial objects
        this.gameObjects = [
            new GameObject(
                1,
                "Tree",
                "object",
                "idle",
                { x: 160, y: 100 },
                { width: 150, height: 200 },
                { moveX: 0, moveY: 0 },
                "darkgreen",
                1,
            ),
        ];

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
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.togglePlaying = this.togglePlaying.bind(this);

        // EventListeners
        // Have to bind functions first
        // this.spawnAnimalBtn.addEventListener(
        //     "click",
        //     this.spawnAnimal("dawg", assetsLoader),
        // );

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
                // console.log(this.selectedObject);
            }

            this.buildPropertiesPanel();
        });
    }

    buildPropertiesPanel() {
        const header = "<h3>Properties</h3>";
        const footer = '<button id="deleteSelectedBtn">Delete</button>';
        if (this.selectedObject == null) {
            this.propertiesPanel.innerHTML =
                header + `Nothing selected for now`;
            return;
        }

        // console.log(JSON.stringify(this.selectedObject));
        // console.log(Object.keys(this.selectedObject));
        // console.log(Object.entries(this.selectedObject));
        // console.log(JSON.stringify(this.selectedObject, 2, null));

        let propertiesHTML = header;
        for (let keyName of Object.keys(this.selectedObject)) {
            propertiesHTML +=
                `<p class="property-name" id="selected-${keyName}">` +
                keyName.charAt(0).toUpperCase() +
                keyName.slice(1) +
                ": ";

            try {
                if (this.selectedObject[keyName] === null) {
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
                console.log(this.selectedObject[keyName]);
                console.log(error);
            } finally {
                propertiesHTML += "</p></p>\n";
            }
        }

        this.propertiesPanel.innerHTML = propertiesHTML + footer;

        document
            .getElementById("deleteSelectedBtn")
            .addEventListener("click", () => {
                console.log("Will work on deleting stuffs later");
            });

        this.selectedObjectDOM = new Object();

        this.selectedObjectDOM.position =
            document.getElementById("selected-position");
        // console.log(this.selectedObjectDOM.position);

        this.selectedObjectDOM.velocity =
            document.getElementById("selected-velocity");
        // console.log(this.selectedObjectDOM.velocity);

        this.selectedObjectDOM.selfElapsedTime = document.getElementById(
            "selected-selfElapsedTime",
        );

        return;
    }

    updatePropertiesPanel() {
        if (
            this.selectedObject == null ||
            !this.selectedObject ||
            !this.selectedObject.position ||
            !this.selectedObject.velocity
        ) {
            return;
        }

        this.selectedObjectDOM.position.innerHTML = `[x: ${Math.floor(this.selectedObject.position.x)}] [y: ${Math.floor(this.selectedObject.position.y)}]`;
        this.selectedObjectDOM.velocity.innerHTML = `[moveX: ${this.selectedObject.velocity.moveX}] [moveY: ${this.selectedObject.velocity.moveY}]`;
        this.selectedObjectDOM.selfElapsedTime.innerHTML = `elapsedTime: ${this.selectedObject.selfElapsedTime.toPrecision(2)}`;
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
            // console.log("inloop: ", this.gameState);
        }

        this.render();
        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime, elapsedTime) {
        for (let object of this.gameObjects) {
            object.update(deltaTime, this.gameCanvas);
        }

        this.updatePropertiesPanel();
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

    togglePlaying() {
        this.gameState = this.gameState == "playing" ? "paused" : "playing";
        // console.log(this.gameState);
    }

    spawnAnimal(species, assetsLoader) {
        let animal = this.animalPool[species];

        let currentID = this.nextAnimalID++;
        let name = `${species} ${currentID}`;
        let type = "animal";
        let state = "moving";
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
        let velocity = {
            moveX: RandomFromMinToMax(40, 100) * PosOrNeg(),
            moveY: RandomFromMinToMax(40, 100) * PosOrNeg(),
        };
        let size = animal["size"];
        let color =
            colorTemplate["BrightAss"].colors[
                RandomFromMinToMax(0, colorTemplate["BrightAss"].colors.length)
            ];

        let animalObj = new Animal(
            currentID,
            name,
            type,
            state,
            position,
            size,
            velocity,
            color,
            1, // Animal will be in layer 1
        );

        let animalSprite = assetsLoader[species];
        animalObj.setImage(animalSprite["img"]);

        let spriteAnimationContainer = new SpriteAnimation(
            animalSprite["walking"],
            1,
        );
        console.log("sprite animation:", spriteAnimationContainer);

        animalObj.setAnimation(spriteAnimationContainer);

        this.gameObjects.push(animalObj);
    }

    start() {
        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas();

        requestAnimationFrame(this.gameLoop);

        for (let i = 0; i < 2; i++) {
            this.spawnAnimal("chicken", assetsLoader);
            this.spawnAnimal("dack", assetsLoader);
            this.spawnAnimal("dawg", assetsLoader);
        }
    }
}
