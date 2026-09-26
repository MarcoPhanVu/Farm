export class UIManager {
    constructor(callbacks) {
        this.callbacks = callbacks;
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

    populateStoreBar(objectPool, assetLoader) {
        // console.log(objectPool);
        console.log(assetLoader);
        for (let objectName of Object.keys(objectPool)) {
            let animal = {
                name: objectPool[objectName].trueName,
                price: objectPool[objectName].buyValue,
                idleImgSrc:
                    assetLoader._assetsList.animals[objectName].idle.spriteImage
                        .src,
            };

            let card = document.createElement("button");
            card.classList.add("animalCard");

            card.innerHTML = `<p>${animal.name}</p>\n<p>${animal.price}</p>`;

            let animalImg = document.createElement("img");
            animalImg.src = animal.idleImgSrc;

            card.appendChild(animalImg);
            card.addEventListener("click", () => {
                this.callbacks.onBuyAnimal(objectName);
            });

            this.bottomPanel.appendChild(card);
        }
        console.log(this.bottomPanel);
    }
}
