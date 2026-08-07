const gameCanvas = document.getElementById("gameCanvas");
const painter = gameCanvas.getContext("2d");

const actionPanel = document.getElementById("actionPanel");
const toolPanel = document.getElementById("toolPanel");
const canvasPanel = document.getElementById("canvasPanel");
const propertiesPanel = document.getElementById("propertiesPanel");
const bottomPanel = document.getElementById("bottomPanel");

// console.log(actionPanel);
// console.log(toolPanel);
// console.log(propertiesPanel);
// console.log(canvasPanel);
// console.log(bottomPanel);
// console.log(canvas);

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

let lastTime = 0;
let gameState = "playing";
/*playing, pausing,... */

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Prevent huge jumps if tab was inactive(like spawning balls in physic engine)
    deltaTime = Math.min(deltaTime, 0.05);

    if (gameState === "playing") {
        update(deltaTime);
    }

    render();
}

function update() {}

function render() {}
