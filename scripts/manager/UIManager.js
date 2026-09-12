export class UIManager {
    constructor() {
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
    }
}
