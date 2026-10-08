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
        // console.log(assetLoader);
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
    }

    updateResources(resources) {
        this.moneyDisplay.innerText = resources.money;
        this.eggDisplay.innerText = resources.eggs;
        this.stickDisplay.innerText = resources.sticks;
    }

    buildPropertiesPanel(selectedObject) {
        const header = "<h3>Properties</h3>";
        if (selectedObject == null) {
            this.propertiesPanel.innerHTML =
                header + `Nothing selected for now`;
            return;
        }

        const footer =
            '<button id="deleteSelectedBtn" class="simpleBtn">Delete</button>' +
            `<button id="sellSelectedBtn" class="simpleBtn">Sell for ${selectedObject.sellValue} </button>`;

        // console.log(JSON.stringify(selectedObject.animation));

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

        for (let keyName of Object.keys(selectedObject)) {
            if (unneededProperties.includes(keyName)) {
                continue;
            }
            propertiesHTML +=
                `<p class="property-name" id="selected-${keyName}">` +
                keyName +
                ": ";

            try {
                if (selectedObject[keyName] == null) {
                    // Img and Animation will be Null in default
                    continue;
                }

                if (selectedObject[keyName].constructor == Object) {
                    // Expand if a dictionary
                    for (let key of Object.keys(selectedObject[keyName])) {
                        propertiesHTML +=
                            // '<p class="property-value">' +
                            `[${key}: ${selectedObject[keyName][key]}] `;
                    }
                }

                if (selectedObject[keyName].constructor == Number) {
                    propertiesHTML += Math.floor(selectedObject[keyName]);
                } else {
                    propertiesHTML +=
                        // '<p class="property-value">' +
                        selectedObject[keyName];
                }
            } catch (error) {
                console.log(selectedObject);
                console.log(selectedObject[keyName]);
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

        this.DOMSHIT = new Object();

        this.DOMSHIT.position = document.getElementById("selected-position");

        this.DOMSHIT.velocity = document.getElementById("selected-velocity");

        this.DOMSHIT.selfElapsedTime = document.getElementById(
            "selected-selfElapsedTime",
        );

        this.DOMSHIT.targetList = document.getElementById(
            "selected-targetList",
        );

        this.DOMSHIT.targetedObject = document.getElementById(
            "selected-targetedObject",
        );

        this.DOMSHIT.actionCoolDownTime = document.getElementById(
            "selected-actionCoolDownTime",
        );

        return;
    }

    updatePropertiesPanel(selectedObject) {
        if (
            selectedObject == null
            // selectedObject.position == null ||
            // selectedObject.velocity == null
        ) {
            return;
        }

        this.DOMSHIT.position.innerHTML = `[x: ${Math.floor(selectedObject.position.x)}] [y: ${Math.floor(selectedObject.position.y)}]`;

        this.DOMSHIT.velocity.innerHTML = `[moveX: ${selectedObject.velocity.moveX}] [moveY: ${selectedObject.velocity.moveY}]`;

        // this.DOMSHIT.selfElapsedTime.innerHTML = `elapsedTime: ${selectedObject.selfElapsedTime.toPrecision(2)}`;

        if (selectedObject.type == "animal") {
            let inText = "";
            for (let animal of selectedObject.targetList) {
                inText += animal.name + "__";
            }

            try {
                this.DOMSHIT.actionCoolDownTime.innerHTML = `actionCoolDownTime: ${selectedObject.actionCoolDownTime.toPrecision(2)}`;
                this.DOMSHIT.targetList.innerHTML = `targetList: ${inText}`;
                this.DOMSHIT.targetedObject.innerHTML = `targetedObject: ${selectedObject.targetedObject.name}`;
            } catch (error) {
                // console.log(error);
            }
        }
    }
}
