import { Animal } from "./Objects/Animal.js";
import { GameObject } from "./Objects/GameObjects.js";
import { RandomFromMinToMax, PosOrNeg } from "./utils/random.js";
import { colorTemplate } from "./config/colors.js";

export class GameManager {
    constructor() {
        this.gameCanvas = document.getElementById("gameCanvas");
        this.painter = this.gameCanvas.getContext("2d");

        this.actionPanel = document.getElementById("actionPanel");
        this.toolPanel = document.getElementById("toolPanel");
        this.canvasPanel = document.getElementById("canvasPanel");
        this.propertiesPanel = document.getElementById("propertiesPanel");
        this.bottomPanel = document.getElementById("bottomPanel");

        // Properties Panel
        // this.mouseXText = document.getElementById("mouseX");
        // this.mouseYText = document.getElementById("mouseY");

        // Bottom Panel
        this.spawnAnimalBtn = document.getElementById("spawnAnimalBtn");

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

        this.nextAnimalID = 2;
        this.animalPool = ["chimken", "duck", "car", "dawg"];

        // Entirely depends on chatGPT for this part, gotta learn about bindings in the future.
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.spawnRandomAnimal = this.spawnRandomAnimal.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }

    updatePropertiesPanel() {
        const header = "<h3>Properties</h3>";
        const footer = '<button id="deleteSelectedBtn">Delete</button>';
        if (this.selectedObject === null) {
            console.log("Reached null selected");
            this.propertiesPanel.innerHTML =
                header + `Nothing selected for now`;
            return;
        }

        console.log("Reached");

        this.propertiesPanel.innerHTML =
            header +
            `
				<p><strong>ID: ${this.selectedObject.id}</strong></p>
				<p><strong>Name: ${this.selectedObject.name}</strong></p>
				<p><strong>Type: ${this.selectedObject.type}</strong></p>
				<p><strong>State: ${this.selectedObject.state}</strong></p>
				<p><strong>Position: X[${this.selectedObject.position.x}] - Y[${this.selectedObject.position.y}</strong>]</p>
				<p><strong>Size: X[${this.selectedObject.size.width}] - Y[${this.selectedObject.size.height}</strong>]</p>
				<p><strong>Velocity: X[${this.selectedObject.velocity.moveX}] - Y[${this.selectedObject.velocity.moveY}</strong>]</p>
				<p><strong>Color: ${this.selectedObject.color}</strong></p>
				<p><strong>Layer: ${this.selectedObject.layer}</strong></p>
				<p><strong>Hovered: ${this.selectedObject.hovered}</strong></p>
				<p><strong>Selected: ${this.selectedObject.selected}</strong></p>
			` +
            footer;

        document
            .getElementById("deleteSelectedBtn")
            .addEventListener("click", () => {
                console.log("Will work on deleting stuffs later");
            });

        return;
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
            // object.log("self");
            object.update(deltaTime, this.gameCanvas);
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

    spawnRandomAnimal() {
        // let animal = "chimken";
        let animal = {
            size: { width: 40, height: 60 },
        };
        let currentID = this.nextAnimalID++;
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
        let size = { width: 40, height: 60 };

        let color =
            colorTemplate["BrightAss"].colors[
                RandomFromMinToMax(0, colorTemplate["BrightAss"].colors.length)
            ];

        console.log(`color: ${color}`);

        console.log(currentID);
        this.gameObjects.push(
            new Animal(
                currentID + 1,
                `car ${currentID + 1}`,
                "animal",
                "moving",
                position,
                size,
                velocity,
                color,
                1,
            ),
        );

        console.log("spawned");
    }

    start() {
        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas();

        this.spawnAnimalBtn.addEventListener("click", this.spawnRandomAnimal);

        // Hover Over Object
        this.gameCanvas.addEventListener("mousemove", (event) => {
            const mouse = this.getMousePosition(event);
            const objsList = this.getObjectsFromFrontToBack();
            this.hoveredObject = null;

            for (let obj of objsList) {
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

            this.updatePropertiesPanel();
        });

        requestAnimationFrame(this.gameLoop);

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
}
