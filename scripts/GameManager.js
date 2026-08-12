import { colorTemplate } from "./config/colors.js";
import { Animal } from "./Objects/Animal.js";
import { GameObject } from "./Objects/GameObjects.js";
import { RandomFromMinToMax, PosOrNeg } from "./utils/random.js";

export class GameManager {
    constructor() {
        this.gameCanvas = document.getElementById("gameCanvas");
        this.painter = gameCanvas.getContext("2d");

        this.actionPanel = document.getElementById("actionPanel");
        this.toolPanel = document.getElementById("toolPanel");
        this.canvasPanel = document.getElementById("canvasPanel");
        this.propertiesPanel = document.getElementById("propertiesPanel");
        this.bottomPanel = document.getElementById("bottomPanel");

        // Properties Panel
        this.mouseXText = document.getElementById("mouseX");
        this.mouseYText = document.getElementById("mouseY");

        // Bottom Panel
        this.spawnAnimalBtn = document.getElementById("spawnAnimalBtn");

        this.animalPool = ["chimken", "duck", "car", "dawg"];
    }

    updatePropertiesPanel() {
        const header = "<h3>Properties</h3>";
        const footer = '<button id="deleteSelectedBtn">Delete</button>';
        if (selectedObject === null) {
            console.log("Reached null selected");
            propertiesPanel.innerHTML = header + `Nothing selected for now`;
            return;
        }

        console.log("Reached");

        propertiesPanel.innerHTML =
            header +
            `
				<p><strong>ID: ${selectedObject.id}</strong></p>
				<p><strong>Name: ${selectedObject.name}</strong></p>
				<p><strong>Type: ${selectedObject.type}</strong></p>
				<p><strong>State: ${selectedObject.state}</strong></p>
				<p><strong>Position: X[${selectedObject.position.x}] - Y[${selectedObject.position.y}</strong>]</p>
				<p><strong>Size: X[${selectedObject.size.width}] - Y[${selectedObject.size.height}</strong>]</p>
				<p><strong>Velocity: X[${selectedObject.velocity.moveX}] - Y[${selectedObject.velocity.moveY}</strong>]</p>
				<p><strong>Color: ${selectedObject.color}</strong></p>
				<p><strong>Layer: ${selectedObject.layer}</strong></p>
				<p><strong>Hovered: ${selectedObject.hovered}</strong></p>
				<p><strong>Selected: ${selectedObject.selected}</strong></p>
			` +
            footer;

        document
            .getElementById("deleteSelectedBtn")
            .addEventListener("click", () => {
                console.log("Will work on deleting stuffs later");
            });

        return;
    }

    start() {
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        this.spawnAnimalBtn.addEventListener("click", spawnRandomAnimal);

        this.lastTime = 0;
        this.gameState = "playing";

        // Hover Over Object
        this.hoveredObject = null;
        this.selectedObject = null;

        this.nextAnimalID = 2;
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

        gameCanvas.addEventListener("mousemove", function (event) {
            const mouse = getMousePosition(event);
            // mouseXText.innerHTML = `mouseX: ${mouse.x}`;
            // mouseYText.innerHTML = `mouseY: ${mouse.y}`;
            const objsList = getObjectsFromFrontToBack();
            hoveredObject = null;

            for (let obj of objsList) {
                if (obj.containsPoints(mouse.x, mouse.y)) {
                    hoveredObject = obj;
                    break;
                }
            }

            for (let obj of gameObjects) {
                // determine the hovered state of hovered object.
                obj.hovered = obj === hoveredObject;
            }
        });

        gameCanvas.addEventListener("click", function (event) {
            const mouse = getMousePosition(event);
            mouseXText.innerHTML = `Last mouseX clicked: ${mouse.x}`;
            mouseYText.innerHTML = `Last mouseY clicked: ${mouse.y}`;
            const objsList = getObjectsFromFrontToBack();

            selectedObject = null;

            for (let obj of objsList) {
                if (obj.containsPoints(mouse.x, mouse.y)) {
                    selectedObject = obj;
                    break;
                }
            }

            for (let obj of gameObjects) {
                obj.selected = obj === selectedObject;
            }

            updatePropertiesPanel();
        });

        requestAnimationFrame(gameLoop);

        spawnRandomAnimal();
        spawnRandomAnimal();
        spawnRandomAnimal();
        spawnRandomAnimal();
        spawnRandomAnimal();
        spawnRandomAnimal();
        spawnRandomAnimal();
        spawnRandomAnimal();
        spawnRandomAnimal();
        spawnRandomAnimal();
    }

    resizeCanvas() {
        gameCanvas.width = canvasPanel.clientWidth;
        gameCanvas.height = canvasPanel.clientHeight;
        render();
    }

    gameLoop(currentTime) {
        let elapsedTime = currentTime - lastTime;
        let deltaTime = elapsedTime / 800;
        lastTime = currentTime;
        // Prevent huge jumps if tab was inactive(like spawning balls in physic engine)
        deltaTime = Math.min(deltaTime, 0.05);

        if (gameState === "playing") {
            update(deltaTime, elapsedTime);
        }

        // updatePropertiesPanel();
        render();
        requestAnimationFrame(gameLoop);
    }

    update(deltaTime, elapsedTime) {
        for (let object of gameObjects) {
            // object.log("self");
            object.update(deltaTime);
        }
    }

    render() {
        // From back to front
        painter.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        const sortedObjects = [...gameObjects].sort((a, b) => {
            if (a.layer !== b.layer) {
                return a.layer - b.layer; // if pos -> b b4 a, if neg -> a b4 b
            }

            return a.getBottomY() - b.getBottomY();
        });

        for (let object of sortedObjects) {
            object.render(painter);
        }
    }

    getMousePosition(event) {
        const rect = gameCanvas.getBoundingClientRect(); // Dist from gameCanvas to client's windows

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    getObjectsFromFrontToBack() {
        const sortedObjects = [...gameObjects].sort((a, b) => {
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
        let currentID = nextAnimalID++;
        let position = {
            x: RandomFromMinToMax(80, gameCanvas.width - animal.size.width),
            y: RandomFromMinToMax(80, gameCanvas.height - animal.size.height),
        };
        let velocity = {
            moveX: RandomFromMinToMax(40, 100) * PosOrNeg(),
            moveY: RandomFromMinToMax(40, 100) * PosOrNeg(),
        };
        let size = { width: 40, height: 60 };

        console.log(currentID);
        gameObjects.push(
            new Animal(
                currentID + 1,
                `car ${currentID + 1}`,
                "animal",
                "moving",
                position,
                size,
                velocity,
                colorTemplate["BrightAss"][
                    RandomFromMinToMax(0, colorTemplate["BrightAss"].length - 2)
                ],
                1,
            ),
        );

        console.log("spawned");
    }
}
