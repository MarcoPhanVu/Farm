export class UIManager {
    previousPropertyValues = {};

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
        this.timeDisplay = document.getElementById("elapsedTimeDisplay");

        // Bottom Panel
        this.spawnAnimalBtn = document.getElementById("spawnAnimalBtn");
        this.spawn5RandomAnimalsBtn = document.getElementById(
            "spawn5RandomAnimalsBtn",
        );
        this.toggleGameStateBtn = document.getElementById("toggleGameStateBtn");
    }

    populateStoreBar(objectPool, assetLoader) {
        for (let objectName of Object.keys(objectPool)) {
            let animal = {
                name: objectPool[objectName].species,
                price: objectPool[objectName].buyValue,
                idleImgSrc:
                    assetLoader._assetsList.animals[objectName].idle.spriteImage
                        .src,
            };

            // console.log(objectPool[objectName]);

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
        this.timeDisplay.innerText = resources.elapsedTime.toPrecision(3) + "s";
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
            // "selfElapsedTime",
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
            "interactableTargetList",
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

        // Update live properties
        let liveProperties = [
            "position",
            "velocity",
            "selfElapsedTime",
            "interactableTargetList",
            "targetedObject",
            "actionCoolDownTime",
        ];

        this.DOMSHIT = {};

        for (let property of liveProperties) {
            this.DOMSHIT[property] = document.getElementById(
                `selected-${property}`,
            );
        }

        document
            .getElementById("deleteSelectedBtn")
            .addEventListener("click", () => {
                this.callbacks.onDeleteSelected();
            });

        document
            .getElementById("sellSelectedBtn")
            .addEventListener("click", () => {
                this.callbacks.onSellSelected();
            });

        return;
    }

    updatePropertiesPanel(selectedObject) {
        if (selectedObject == null) {
            return;
        }

        if (selectedObject.constructor.name != "Animal") {
            return;
        }

        let liveValues = {
            position:
                `Position: [x: ${Math.floor(selectedObject.position.x)}]` +
                `[y: ${Math.floor(selectedObject.position.y)}]`,
            velocity:
                `Velocity: [moveX: ${Math.floor(selectedObject.velocity.moveX)}]` +
                `[moveY: ${Math.floor(selectedObject.velocity.moveY)}]`,
            selfElapsedTime:
                "selfElapsedTime: " +
                selectedObject.selfElapsedTime.toPrecision(2),
            actionCoolDownTime:
                "actionCoolDownTime: " +
                selectedObject.actionCoolDownTime.toPrecision(2),
        };

        let interactableTargetListDisplayValue = "interactableTargetList: ";

        for (let target of selectedObject.interactableTargetList) {
            interactableTargetListDisplayValue += `${target.name}__`;
        }

        let targetedObjectDisplayValue = "targetedObject: ";
        if (selectedObject.targetedObject != null) {
            targetedObjectDisplayValue += selectedObject.targetedObject.name;
        } else {
            targetedObjectDisplayValue += "nothing";
        }

        for (let [key, value] of Object.entries(liveValues)) {
            if (this.previousPropertyValues[key] == value) {
                // ONly update if the value changed
                continue;
            }

            this.DOMSHIT[key].innerText = value;
            this.previousPropertyValues[key] = value;
        }

        // this.callbacks.onToggleGameState();
    }

    setUpEventListeners() {
        this.spawnAnimalBtn.addEventListener("click", () => {
            this.callbacks.onBuyRandomAnimal();
        });

        this.spawn5RandomAnimalsBtn.addEventListener("click", () => {
            this.callbacks.onBuy5RandomAnimals();
        });

        this.toggleGameStateBtn.addEventListener(
            "click",
            this.callbacks.onToggleGameState,
        );
    }
}
