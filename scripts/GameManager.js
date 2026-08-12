const gameCanvas = document.getElementById("gameCanvas");
const painter = gameCanvas.getContext("2d");

const actionPanel = document.getElementById("actionPanel");
const toolPanel = document.getElementById("toolPanel");
const canvasPanel = document.getElementById("canvasPanel");
const propertiesPanel = document.getElementById("propertiesPanel");
const bottomPanel = document.getElementById("bottomPanel");

// Properties Panel
const mouseXText = document.getElementById("mouseX");
const mouseYText = document.getElementById("mouseY");

// Bottom Panel
const spawnAnimalBtn = document.getElementById("spawnAnimalBtn");

const animalPool = ["chimken", "duck", "car", "dawg"];

const colorTemplate = {
    BrightAss: [
        "#EE6055",
        "#60D394",
        "#AAF683",
        "#FFD97D",
        "#FF9B85",
        "https://coolors.co/ee6055-60d394-aaf683-ffd97d-ff9b85",
    ],

    LessBright: [
        "#0fa3b1",
        "#b5e2fa",
        "#f9f7f3",
        "#eddea4",
        "#f7a072",
        "https://coolors.co/0fa3b1-b5e2fa-f9f7f3-eddea4-f7a072",
    ],

    CuteGayColor: [
        "#3a405a",
        "#aec5eb",
        "#f9dec9",
        "#e9afa3",
        "#685044",
        "https://coolors.co/3a405a-aec5eb-f9dec9-e9afa3-685044",
    ],
};

const gameObjects = [
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
let nextAnimalID = 2;

function resizeCanvas() {
    gameCanvas.width = canvasPanel.clientWidth;
    gameCanvas.height = canvasPanel.clientHeight;
    // console.log(`CanvasSize: ${gameCanvas.width}`);
    // console.log(`CanvasSize: ${gameCanvas.height}`);
    render();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let lastTime = 0;
let gameState = "playing";
/*playing, pausing,... */

function gameLoop(currentTime) {
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

function update(deltaTime, elapsedTime) {
    for (let object of gameObjects) {
        // object.log("self");
        object.update(deltaTime);
    }
}

function render() {
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

requestAnimationFrame(gameLoop);
// Hover Over Object
let hoveredObject = null;
let selectedObject = null;

function getMousePosition(event) {
    const rect = gameCanvas.getBoundingClientRect(); // Dist from gameCanvas to client's windows

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

function getObjectsFromFrontToBack() {
    const sortedObjects = [...gameObjects].sort((a, b) => {
        if (a.layer !== b.layer) {
            return b.layer - a.layer;
        }

        return b.getBottomY() - a.getBottomY();
    });

    return sortedObjects;
}

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

function updatePropertiesPanel() {
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

function spawnRandomAnimal() {
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

spawnAnimalBtn.addEventListener("click", spawnRandomAnimal);
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
