const gameCanvas = document.getElementById("gameCanvas");
const painter = gameCanvas.getContext("2d");

const actionPanel = document.getElementById("actionPanel");
const toolPanel = document.getElementById("toolPanel");
const canvasPanel = document.getElementById("canvasPanel");
const propertiesPanel = document.getElementById("propertiesPanel");
const bottomPanel = document.getElementById("bottomPanel");

// bottomPanel
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

    cuteGayColor: [
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
    gameCanvas.width = 800;
    gameCanvas.height = 400;
    console.log(`CanvasSize: ${gameCanvas.width}`);
    console.log(`CanvasSize: ${gameCanvas.height}`);
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
    // console.log(`E time: ${elapsedTime}`);
    // Prevent huge jumps if tab was inactive(like spawning balls in physic engine)
    deltaTime = Math.min(deltaTime, 0.05);

    if (gameState === "playing") {
        update(deltaTime, elapsedTime);
    }

    render();

    requestAnimationFrame(gameLoop);
}

function update(deltaTime, elapsedTime) {
    for (let object of gameObjects) {
        // object.announceSelf();
        object.update(deltaTime);
    }
}

function render() {
    // console.log("Render from GameManager")

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
            colorTemplate["cuteGayColor"][
                RandomFromMinToMax(0, colorTemplate["cuteGayColor"].length - 2)
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
// const testArr = [40, 100, 10, 20, 11, 1, 25, 4];

// console.log(
//     testArr.sort((a, b) => {
//         return a - b;
//     }),
// );

// console.log(
//     testArr.sort(function (a, b) {
//         return a + b;
//     }),
// );
