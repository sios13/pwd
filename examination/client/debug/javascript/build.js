(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Window and icon inherits from entity
 */

function Entity(settings = {}) {
    this.xPos = settings.xPos ? settings.xPos : 100;

    this.yPos = settings.yPos ? settings.yPos : 100;

    this.isSelected = settings.isSelected ? settings.isSelected : false;

    this.isDragging = settings.isDragging ? settings.isDragging : false;
}

Entity.prototype.getWidth = function() {
    return this.width;
}

Entity.prototype.getHeight = function() {
    return this.height;
}

Entity.prototype.getXPos = function() {
    return this.xPos;
}

Entity.prototype.getYPos = function() {
    return this.yPos;
}

Entity.prototype.updatePos = function(xMovement, yMovement) {
    this.xPos += xMovement;
    this.yPos += yMovement;

    this.container.style.left = this.xPos + "px";
    this.container.style.top = this.yPos + "px";
}

Entity.prototype.setIsSelected = function(value) {
    this.isSelected = value;

    if (this.isSelected) {
        this.container.classList.add("selected");
    } else {
        this.container.classList.remove("selected");
    }
}

Entity.prototype.setIsDragging = function(value) {
    this.isDragging = value;

    if (this.isDragging) {
        this.container.classList.add("dragging");
    } else {
        this.container.classList.remove("dragging");
    }
}

Entity.prototype.getContainer = function() {
    return this.container;
}

module.exports = Entity;

},{}],2:[function(require,module,exports){
const Entity = require("./Entity.js");

function Icon(settings = {}) {
    Entity.call(this, {
        "xPos": settings.xPos,
        "yPos": settings.yPos,
        "isSelected": settings.isSelected,
        "isDragging": settings.isDragging
    });

    this.width = settings.width ? settings.width : 80;

    this.height = settings.height ? settings.height : 80;

    this.applicationName = settings.applicationName ? settings.applicationName : "";

    this.iconImage = settings.iconImage ? settings.iconImage : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "small";

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("a");
        container.setAttribute("href", "#");
        container.classList.add("PWD-icon");

        let iconImageElem = document.createElement("img");
        iconImageElem.src = "./image/" + this.iconImage;

        let iconText = document.createElement("span");
        iconText.textContent = this.applicationName;

        container.appendChild(iconImageElem);
        container.appendChild(iconText);

        return container;
    }
}

/**
 * Icon inherits from Entity
 */
Icon.prototype = Object.create(Entity.prototype);
Icon.prototype.constructor = Icon;

Icon.prototype.getApplicationName = function() {
    return this.applicationName;
}

Icon.prototype.getWindowSize = function() {
    return this.windowSize;
}

module.exports = Icon;

},{"./Entity.js":1}],3:[function(require,module,exports){
const Window = require("./Window.js");
const Icon = require("./Icon.js");
const Memory = require("./apps/Memory/MemoryGame.js");

function PWD(settings = {}) {
    let container = document.createElement("main");

    document.querySelector(settings.container).appendChild(container);

    let windows = [];

    let icons = [];

    let pwdWidth = 1300;

    let pwdHeight = 600;

    let windowsMadeCounter = 0;

    /**
     * The selected entity is the currently selected window or icon
     */
    let selectedEntity = undefined;

    /**
     * Create the icons
     */
    icons.push( new Icon({
        //"id": 0,
        "applicationName": "Memory",
        //"iconImage": "memory.png",
        "windowSize": "medium"
    }) );

    /**
     * Append the icons to the container
     */
    for (let i = 0; i < icons.length; i++) {
        container.appendChild(icons[i].getContainer());
    }

    addListeners.bind(this)();

    function addListeners() {
        window.addEventListener("mousedown", function(e) {
            e.preventDefault();

            if (selectedEntity) {
                selectedEntity.setIsSelected(false);
            }

            selectedEntity = undefined;

            /**
             * Iterate the windows
             */
            for (let i = 0; i < windows.length; i++) {
                /**
                 * If a mousedown has been made inside a window
                 */
                if (windows[i].getContainer().contains(e.target)) {
                    /**
                     * Make the window active
                     */
                    windows[i].setIsSelected(true);

                    selectedEntity = windows[i];

                    /**
                     * If a mousedown has been made on a top bar -> start dragging
                     */
                    let windowTopBarElem = windows[i].getContainer().querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", windowMoveEvent);
                    }

                    break;
                }
            }

            /**
             * Iterate the icons
             */
            for (let i = 0; i < icons.length; i++) {
                /**
                 * If a mousedown has been made on an icon -> mark it as selected
                 */
                if (icons[i].getContainer().contains(e.target)) {
                    icons[i].setIsSelected(true);

                    selectedEntity = icons[i];

                    window.addEventListener("mousemove", windowMoveEvent);

                    break;
                }
            }
        });

        window.addEventListener("mouseup", function(e) {
            e.preventDefault();

            /**
             * If there is an active entity -> remove the mousemove event and stop dragging
             */
            if (selectedEntity) {
                window.removeEventListener("mousemove", windowMoveEvent);

                selectedEntity.setIsDragging(false);
            }

            console.log("up");
        });

        window.addEventListener("click", function(e) {
            e.preventDefault();
        });

        window.addEventListener("dblclick", function(e) {
            e.preventDefault();

            for (let i = 0; i < icons.length; i++) {
                /**
                 * if a doubleclick has been made on an icon -> launch the associated application
                 */
                if (icons[i].getContainer().contains(e.target)) {
                    launchApplication(icons[i]);
                }
            }
        });
    }

    function getNewWindowXPos() {

    }

    function getNewWindowYPos() {

    }

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let pwdWindow = new Window({
            "id": windowsMadeCounter,
            "windowSize": iconObj.getWindowSize(),
            "name": iconObj.getApplicationName(),
            "xPos": (100 + 15 * windowsMadeCounter),
            "yPos": (20 + 30 * windowsMadeCounter)
        });

        windowsMadeCounter += 1;

        windows.push(pwdWindow);

        container.appendChild(pwdWindow.getContainer());

        if (iconObj.getApplicationName() === "Memory") {
            let memory = new Memory({
                "container": "#PWD-window_content-" + pwdWindow.getId()
            });
        }
    }

    /**
     * Update the position of the active entity
     */
    function windowMoveEvent(e) {
        /**
         * If there is an active entity -> update its position
         */
        if (selectedEntity) {
            selectedEntity.setIsDragging(true);

            let movementX = e.movementX;
            let movementY = e.movementY;

            if ((selectedEntity.getXPos() + movementX + selectedEntity.getWidth()) > pwdWidth) {
                movementX = 0;
            }

            if (selectedEntity.getXPos() + movementX < 0) {
                movementX = 0;
            }

            if ((selectedEntity.getYPos() + movementY + selectedEntity.getHeight()) > pwdHeight) {
                movementY = 0;
            }

            if (selectedEntity.getYPos() + movementY < 0) {
                movementY = 0;
            }

            selectedEntity.updatePos(movementX, movementY);
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;

},{"./Icon.js":2,"./Window.js":4,"./apps/Memory/MemoryGame.js":8}],4:[function(require,module,exports){
const Entity = require("./Entity.js");

function Window(settings = {}) {
    Entity.call(this, {
        "xPos": settings.xPos,
        "yPos": settings.yPos,
        "isSelected": settings.isSelected,
        "isDragging": settings.isDragging
    });

    this.id = settings.id ? settings.id : undefined;

    this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : Math.floor(Math.random()*16777215).toString(16);

    this.name = settings.name ? settings.name : "No name";

    this.icon = settings.icon ? settings.icon : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "medium";

    switch (this.windowSize) {
        case "small":
            this.width = 200;
            this.height = 300;
            break;
        case "medium":
            this.width = 300;
            this.height = 450;
            break;
        case "big":
            this.width = 400;
            this.height = 600;
            break;
    }

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("div");
        container.classList.add("PWD-window");
        container.style.left = this.xPos + "px";
        container.style.top = this.yPos + "px";

        switch(this.windowSize) {
            case "small":
                container.classList.add("PWD-window--small");
                break;
            case "medium":
                container.classList.add("PWD-window--medium");
                break;
            case "big":
                container.classList.add("PWD-window--big");
                break;
        }

        let windowTopBar = document.createElement("div");
        windowTopBar.classList.add("PWD-window_topbar");

        let windowTopBarIcon = document.createElement("img");
        windowTopBarIcon.src = "./image/" + this.icon;

        let windowTopBarSpan = document.createElement("span");
        windowTopBarSpan.textContent = this.name;

        let windowContent = document.createElement("div");
        windowContent.classList.add("PWD-window_content");
        windowContent.setAttribute("id", "PWD-window_content-" + this.id);
        windowContent.style.backgroundColor = "#" + this.backgroundColor;

        windowTopBar.appendChild(windowTopBarIcon);
        windowTopBar.appendChild(windowTopBarSpan);

        container.appendChild(windowTopBar);
        container.appendChild(windowContent);

        return container;
    }
}

/**
 * Window inherits from Entity
 */
Window.prototype = Object.create(Entity.prototype);
Window.prototype.constructor = Window;

Window.prototype.getId = function() {
    return this.id;
}

module.exports = Window;

},{"./Entity.js":1}],5:[function(require,module,exports){
const PWD = require("./PWD.js");

window.addEventListener("load", function() {
    let pwd = new PWD({"container": "body"});
});

},{"./PWD.js":3}],6:[function(require,module,exports){
function Card(value) {
    this.value = value;

    this.isFlipped = false;

    this.isComplete = false;

    this.cardElem = document.createElement("a");
    this.cardElem.setAttribute("href", "#");
    this.cardElem.setAttribute("class", "memoryCard");
    this.cardElem.setAttribute("data-index", this.value);

    this.coverImage = document.createElement("img");
    this.coverImage.setAttribute("class", "front");
    this.coverImage.setAttribute("src", "image/0.png");
    this.coverImage.setAttribute("alt", "Cover image");

    this.cardImage = document.createElement("img");
    this.cardImage.classList.add("back");
    this.cardImage.setAttribute("src", "image/" + this.value[0] + ".png");
    this.cardImage.setAttribute("alt", "Memory card");

    this.cardElem.appendChild(this.coverImage);
    this.cardElem.appendChild(this.cardImage);
}

/**
 * Returns the unique value for this card
 * The card identifier
 */
Card.prototype.getValue = function() {
    return this.value;
}

/**
 * Flips the card
 */
Card.prototype.flip = function() {
    if (this.isFlipped) {
        this.coverImage.classList.remove("flip");
        this.cardImage.classList.remove("flip");

        this.coverImage.classList.add("backflip");
        this.cardImage.classList.add("backflip");

        this.isFlipped = false;
    } else {
        this.coverImage.classList.remove("backflip");
        this.cardImage.classList.remove("backflip");

        this.coverImage.classList.add("flip");
        this.cardImage.classList.add("flip");

        this.isFlipped = true;
    }
}

Card.prototype.getIsFlipped = function() {
    return this.isFlipped;
}

Card.prototype.setIsComplete = function(value) {
    this.isComplete = value;
}

Card.prototype.addClass = function(className) {
    this.cardElem.classList.add(className);
}

Card.prototype.getCardElem = function() {
    return this.cardElem;
}

module.exports = Card;

},{}],7:[function(require,module,exports){
const Card = require("./Card.js");

function Cards(nrOfCards) {
    this.cards = [];

    this.numberOfCards = nrOfCards;

    /**
     * Create the cards
     */
    for (let i = 1; i < nrOfCards + 1; i++) {
        this.cards.push(new Card(i + "" + 1));
        this.cards.push(new Card(i + "" + 2));
    }

    /**
     * Shuffle the cards
     */
    for (let i = this.cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = temp;
    }
}

/**
 * Returns the card with the given value
 */
Cards.prototype.getCard = function(value) {
    let card;

    for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].getValue() === value) {
            card = this.cards[i];
            break;
        }
    }

    return card;
}

/**
 * Returns a fragment containing the card divs and images
 */
Cards.prototype.getCardsFrag = function() {
    let cardsFrag = new DocumentFragment();

    for (let i = 0; i < this.cards.length; i++) {
        let cardElem = this.cards[i].getCardElem();
        cardsFrag.appendChild(cardElem);
    }

    return cardsFrag;
}

module.exports = Cards;

},{"./Card.js":6}],8:[function(require,module,exports){
const Cards = require("./Cards.js");

function MemoryGame(config) {
    this.nrOfPairs = config.nrOfPairs ? config.nrOfPairs : 4;

    let container = config.container ? config.container : "#cool";

    this.cards = new Cards(this.nrOfPairs);

    this.score = 0;

    this.gameTimer = 0;

    this.attempts = 0;

    this.firstCard = "";

    this.secondCard = "";

    this.isCheckingAnswer = false;

    let memoryWrapperDiv = document.createElement("div");
    memoryWrapperDiv.classList.add("memoryWrapper");

    memoryWrapperDiv.addEventListener("click", e => {
        e.preventDefault();

        let imgElem = e.target;

        let aElem = imgElem.nodeName === "IMG" ? imgElem.parentNode : imgElem;

        let value = aElem.getAttribute("data-index");

        let card = this.cards.getCard(value);

        if (card) {
            if (card.getIsFlipped() === false && this.isCheckingAnswer === false) {
                card.flip();

                if (this.firstCard === "") {
                    this.firstCard = card;
                } else {
                    this.secondCard = card;

                    this.checkAnswer();
                }
            }
        }
    });

    this.memoryPanel = document.createElement("div");
    this.memoryPanel.classList.add("memoryPanel");

    this.memoryCards = document.createElement("div");
    this.memoryCards.classList.add("memoryCards");
    switch(this.nrOfPairs) {
        case 1:
        case 2:
            this.memoryCards.classList.add("memoryCards--width-240");
            break;
        case 3:
        case 4:
            this.memoryCards.classList.add("memoryCards--width-360");
            break;
        case 5:
        case 6:
            this.memoryCards.classList.add("memoryCards--width-480");
            break;
        case 7:
        case 8:
            this.memoryCards.classList.add("memoryCards--width-600");
            break;
    }
    this.memoryCards.appendChild(this.cards.getCardsFrag());

    memoryWrapperDiv.appendChild(this.memoryPanel);
    memoryWrapperDiv.appendChild(this.memoryCards);

    let memoryContainerDiv = document.querySelector(container);
    memoryContainerDiv.appendChild(memoryWrapperDiv);

    this.gameTimerInterval = setInterval(function() {
        this.gameTimer++;

        this.memoryPanel.textContent = "Time: " + this.gameTimer + ", Attempts: " + this.attempts;
    }.bind(this), 1000);
}

MemoryGame.prototype.checkAnswer = function() {
    this.isCheckingAnswer = true;

    setTimeout(function() {
        this.attempts++;

        if (this.firstCard.getValue()[0] === this.secondCard.getValue()[0]) {
            this.firstCard.setIsComplete(true);
            this.secondCard.setIsComplete(true);

            this.firstCard.addClass("memoryCard--correct");
            this.secondCard.addClass("memoryCard--correct");

            this.score++;

            if (this.score === this.nrOfPairs) {
                clearInterval(this.gameTimerInterval);
                this.memoryPanel.textContent = "You completed the game in " + this.gameTimer + " seconds after " + this.attempts + " attempts!";
            }
        } else {
            this.firstCard.flip();
            this.secondCard.flip();
        }

        this.firstCard = "";
        this.secondCard = "";

        this.isCheckingAnswer = false;
    }.bind(this), 2000);
}

module.exports = MemoryGame;

},{"./Cards.js":7}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvRW50aXR5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9JY29uLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1dpbmRvdy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBXaW5kb3cgYW5kIGljb24gaW5oZXJpdHMgZnJvbSBlbnRpdHlcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbnRpdHkoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy54UG9zID0gc2V0dGluZ3MueFBvcyA/IHNldHRpbmdzLnhQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy55UG9zID0gc2V0dGluZ3MueVBvcyA/IHNldHRpbmdzLnlQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBzZXR0aW5ncy5pc0RyYWdnaW5nID8gc2V0dGluZ3MuaXNEcmFnZ2luZyA6IGZhbHNlO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRYUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy54UG9zO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFlQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnlQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUudXBkYXRlUG9zID0gZnVuY3Rpb24oeE1vdmVtZW50LCB5TW92ZW1lbnQpIHtcclxuICAgIHRoaXMueFBvcyArPSB4TW92ZW1lbnQ7XHJcbiAgICB0aGlzLnlQb3MgKz0geU1vdmVtZW50O1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuc2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuc2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcImRyYWdnaW5nXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiZHJhZ2dpbmdcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy53aWR0aCA9IHNldHRpbmdzLndpZHRoID8gc2V0dGluZ3Mud2lkdGggOiA4MDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDgwO1xyXG5cclxuICAgIHRoaXMuYXBwbGljYXRpb25OYW1lID0gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lID8gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lIDogXCJcIjtcclxuXHJcbiAgICB0aGlzLmljb25JbWFnZSA9IHNldHRpbmdzLmljb25JbWFnZSA/IHNldHRpbmdzLmljb25JbWFnZSA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcInNtYWxsXCI7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgPSBpbml0aWFsaXplQ29udGFpbmVyLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplQ29udGFpbmVyKCkge1xyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtaWNvblwiKTtcclxuXHJcbiAgICAgICAgbGV0IGljb25JbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGljb25JbWFnZUVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uSW1hZ2U7XHJcblxyXG4gICAgICAgIGxldCBpY29uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGljb25UZXh0LnRleHRDb250ZW50ID0gdGhpcy5hcHBsaWNhdGlvbk5hbWU7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uSW1hZ2VFbGVtKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvblRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogSWNvbiBpbmhlcml0cyBmcm9tIEVudGl0eVxyXG4gKi9cclxuSWNvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVudGl0eS5wcm90b3R5cGUpO1xyXG5JY29uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEljb247XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRBcHBsaWNhdGlvbk5hbWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcGxpY2F0aW9uTmFtZTtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2luZG93U2l6ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xyXG4iLCJjb25zdCBXaW5kb3cgPSByZXF1aXJlKFwiLi9XaW5kb3cuanNcIik7XHJcbmNvbnN0IEljb24gPSByZXF1aXJlKFwiLi9JY29uLmpzXCIpO1xyXG5jb25zdCBNZW1vcnkgPSByZXF1aXJlKFwiLi9hcHBzL01lbW9yeS9NZW1vcnlHYW1lLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gUFdEKHNldHRpbmdzID0ge30pIHtcclxuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWFpblwiKTtcclxuXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNldHRpbmdzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcbiAgICBsZXQgd2luZG93cyA9IFtdO1xyXG5cclxuICAgIGxldCBpY29ucyA9IFtdO1xyXG5cclxuICAgIGxldCBwd2RXaWR0aCA9IDEzMDA7XHJcblxyXG4gICAgbGV0IHB3ZEhlaWdodCA9IDYwMDtcclxuXHJcbiAgICBsZXQgd2luZG93c01hZGVDb3VudGVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBzZWxlY3RlZCBlbnRpdHkgaXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCB3aW5kb3cgb3IgaWNvblxyXG4gICAgICovXHJcbiAgICBsZXQgc2VsZWN0ZWRFbnRpdHkgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGljb25zXHJcbiAgICAgKi9cclxuICAgIGljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAvL1wiaWRcIjogMCxcclxuICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgIC8vXCJpY29uSW1hZ2VcIjogXCJtZW1vcnkucG5nXCIsXHJcbiAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgIH0pICk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHBlbmQgdGhlIGljb25zIHRvIHRoZSBjb250YWluZXJcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uc1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXJzLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbnRpdHkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkRW50aXR5LnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RlZEVudGl0eSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJdGVyYXRlIHRoZSB3aW5kb3dzXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbnNpZGUgYSB3aW5kb3dcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogTWFrZSB0aGUgd2luZG93IGFjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd3NbaV0uc2V0SXNTZWxlY3RlZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRFbnRpdHkgPSB3aW5kb3dzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIG9uIGEgdG9wIGJhciAtPiBzdGFydCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3aW5kb3dUb3BCYXJFbGVtID0gd2luZG93c1tpXS5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfdG9wYmFyXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93VG9wQmFyRWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgd2luZG93TW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSXRlcmF0ZSB0aGUgaWNvbnNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uIC0+IG1hcmsgaXQgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGljb25zW2ldLmdldENvbnRhaW5lcigpLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGljb25zW2ldLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRW50aXR5ID0gaWNvbnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiB0aGVyZSBpcyBhbiBhY3RpdmUgZW50aXR5IC0+IHJlbW92ZSB0aGUgbW91c2Vtb3ZlIGV2ZW50IGFuZCBzdG9wIGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbnRpdHkpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRFbnRpdHkuc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGlmIGEgZG91YmxlY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uIC0+IGxhdW5jaCB0aGUgYXNzb2NpYXRlZCBhcHBsaWNhdGlvblxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24oaWNvbnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TmV3V2luZG93WFBvcygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TmV3V2luZG93WVBvcygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggYW4gYXBwbGljYXRpb24gdXNpbmcgdGhlIG1ldGEgZGF0YSBpbiBhIGdpdmVuIGljb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxhdW5jaEFwcGxpY2F0aW9uKGljb25PYmopIHtcclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gbmV3IFdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwiaWRcIjogd2luZG93c01hZGVDb3VudGVyLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogaWNvbk9iai5nZXRXaW5kb3dTaXplKCksXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogKDEwMCArIDE1ICogd2luZG93c01hZGVDb3VudGVyKSxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6ICgyMCArIDMwICogd2luZG93c01hZGVDb3VudGVyKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3dzTWFkZUNvdW50ZXIgKz0gMTtcclxuXHJcbiAgICAgICAgd2luZG93cy5wdXNoKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICBpZiAoaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKSA9PT0gXCJNZW1vcnlcIikge1xyXG4gICAgICAgICAgICBsZXQgbWVtb3J5ID0gbmV3IE1lbW9yeSh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyBwd2RXaW5kb3cuZ2V0SWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBhY3RpdmUgZW50aXR5XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHdpbmRvd01vdmVFdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGhlcmUgaXMgYW4gYWN0aXZlIGVudGl0eSAtPiB1cGRhdGUgaXRzIHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkRW50aXR5KSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkRW50aXR5LnNldElzRHJhZ2dpbmcodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRYID0gZS5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFkgPSBlLm1vdmVtZW50WTtcclxuXHJcbiAgICAgICAgICAgIGlmICgoc2VsZWN0ZWRFbnRpdHkuZ2V0WFBvcygpICsgbW92ZW1lbnRYICsgc2VsZWN0ZWRFbnRpdHkuZ2V0V2lkdGgoKSkgPiBwd2RXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRYID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRW50aXR5LmdldFhQb3MoKSArIG1vdmVtZW50WCA8IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgoc2VsZWN0ZWRFbnRpdHkuZ2V0WVBvcygpICsgbW92ZW1lbnRZICsgc2VsZWN0ZWRFbnRpdHkuZ2V0SGVpZ2h0KCkpID4gcHdkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbnRpdHkuZ2V0WVBvcygpICsgbW92ZW1lbnRZIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZWN0ZWRFbnRpdHkudXBkYXRlUG9zKG1vdmVtZW50WCwgbW92ZW1lbnRZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblBXRC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUFdEO1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBXaW5kb3coc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgRW50aXR5LmNhbGwodGhpcywge1xyXG4gICAgICAgIFwieFBvc1wiOiBzZXR0aW5ncy54UG9zLFxyXG4gICAgICAgIFwieVBvc1wiOiBzZXR0aW5ncy55UG9zLFxyXG4gICAgICAgIFwiaXNTZWxlY3RlZFwiOiBzZXR0aW5ncy5pc1NlbGVjdGVkLFxyXG4gICAgICAgIFwiaXNEcmFnZ2luZ1wiOiBzZXR0aW5ncy5pc0RyYWdnaW5nXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmlkID0gc2V0dGluZ3MuaWQgPyBzZXR0aW5ncy5pZCA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG5cclxuICAgIHRoaXMubmFtZSA9IHNldHRpbmdzLm5hbWUgPyBzZXR0aW5ncy5uYW1lIDogXCJObyBuYW1lXCI7XHJcblxyXG4gICAgdGhpcy5pY29uID0gc2V0dGluZ3MuaWNvbiA/IHNldHRpbmdzLmljb24gOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJtZWRpdW1cIjtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gMjAwO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IDMwMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIm1lZGl1bVwiOlxyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gMzAwO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IDQ1MDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IDYwMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgPSBpbml0aWFsaXplQ29udGFpbmVyLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplQ29udGFpbmVyKCkge1xyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd1wiKTtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgICAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1zbWFsbFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1lZGl1bVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWJpZ1wiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcEJhckljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhckljb24uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uO1xyXG5cclxuICAgICAgICBsZXQgd2luZG93VG9wQmFyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhclNwYW4udGV4dENvbnRlbnQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB3aW5kb3dDb250ZW50LmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2NvbnRlbnRcIik7XHJcbiAgICAgICAgd2luZG93Q29udGVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIlBXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMuaWQpO1xyXG4gICAgICAgIHdpbmRvd0NvbnRlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjXCIgKyB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuXHJcbiAgICAgICAgd2luZG93VG9wQmFyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhckljb24pO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJTcGFuKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcik7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd0NvbnRlbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogV2luZG93IGluaGVyaXRzIGZyb20gRW50aXR5XHJcbiAqL1xyXG5XaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuV2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFdpbmRvdztcclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvdztcclxuIiwiY29uc3QgUFdEID0gcmVxdWlyZShcIi4vUFdELmpzXCIpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHB3ZCA9IG5ldyBQV0Qoe1wiY29udGFpbmVyXCI6IFwiYm9keVwifSk7XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBDYXJkKHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuaXNDb21wbGV0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5jYXJkRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgIHRoaXMuY2FyZEVsZW0uc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1lbW9yeUNhcmRcIik7XG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIHRoaXMudmFsdWUpO1xuXG4gICAgdGhpcy5jb3ZlckltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICB0aGlzLmNvdmVySW1hZ2Uuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmcm9udFwiKTtcbiAgICB0aGlzLmNvdmVySW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgdGhpcy5jb3ZlckltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkNvdmVyIGltYWdlXCIpO1xuXG4gICAgdGhpcy5jYXJkSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJiYWNrXCIpO1xuICAgIHRoaXMuY2FyZEltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL1wiICsgdGhpcy52YWx1ZVswXSArIFwiLnBuZ1wiKTtcbiAgICB0aGlzLmNhcmRJbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgXCJNZW1vcnkgY2FyZFwiKTtcblxuICAgIHRoaXMuY2FyZEVsZW0uYXBwZW5kQ2hpbGQodGhpcy5jb3ZlckltYWdlKTtcbiAgICB0aGlzLmNhcmRFbGVtLmFwcGVuZENoaWxkKHRoaXMuY2FyZEltYWdlKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB1bmlxdWUgdmFsdWUgZm9yIHRoaXMgY2FyZFxuICogVGhlIGNhcmQgaWRlbnRpZmllclxuICovXG5DYXJkLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xufVxuXG4vKipcbiAqIEZsaXBzIHRoZSBjYXJkXG4gKi9cbkNhcmQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5pc0ZsaXBwZWQpIHtcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJmbGlwXCIpO1xuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiZmxpcFwiKTtcblxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcImJhY2tmbGlwXCIpO1xuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiYmFja2ZsaXBcIik7XG5cbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcImJhY2tmbGlwXCIpO1xuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmFja2ZsaXBcIik7XG5cbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5hZGQoXCJmbGlwXCIpO1xuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiZmxpcFwiKTtcblxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IHRydWU7XG4gICAgfVxufVxuXG5DYXJkLnByb3RvdHlwZS5nZXRJc0ZsaXBwZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pc0ZsaXBwZWQ7XG59XG5cbkNhcmQucHJvdG90eXBlLnNldElzQ29tcGxldGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuaXNDb21wbGV0ZSA9IHZhbHVlO1xufVxuXG5DYXJkLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgIHRoaXMuY2FyZEVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xufVxuXG5DYXJkLnByb3RvdHlwZS5nZXRDYXJkRWxlbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNhcmRFbGVtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhcmQ7XG4iLCJjb25zdCBDYXJkID0gcmVxdWlyZShcIi4vQ2FyZC5qc1wiKTtcblxuZnVuY3Rpb24gQ2FyZHMobnJPZkNhcmRzKSB7XG4gICAgdGhpcy5jYXJkcyA9IFtdO1xuXG4gICAgdGhpcy5udW1iZXJPZkNhcmRzID0gbnJPZkNhcmRzO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHRoZSBjYXJkc1xuICAgICAqL1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnJPZkNhcmRzICsgMTsgaSsrKSB7XG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDEpKTtcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNodWZmbGUgdGhlIGNhcmRzXG4gICAgICovXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICBsZXQgdGVtcCA9IHRoaXMuY2FyZHNbaV07XG4gICAgICAgIHRoaXMuY2FyZHNbaV0gPSB0aGlzLmNhcmRzW2pdO1xuICAgICAgICB0aGlzLmNhcmRzW2pdID0gdGVtcDtcbiAgICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgY2FyZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZVxuICovXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgbGV0IGNhcmQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuY2FyZHNbaV0uZ2V0VmFsdWUoKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGNhcmQgPSB0aGlzLmNhcmRzW2ldO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2FyZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnJhZ21lbnQgY29udGFpbmluZyB0aGUgY2FyZCBkaXZzIGFuZCBpbWFnZXNcbiAqL1xuQ2FyZHMucHJvdG90eXBlLmdldENhcmRzRnJhZyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjYXJkc0ZyYWcgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjYXJkRWxlbSA9IHRoaXMuY2FyZHNbaV0uZ2V0Q2FyZEVsZW0oKTtcbiAgICAgICAgY2FyZHNGcmFnLmFwcGVuZENoaWxkKGNhcmRFbGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FyZHNGcmFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhcmRzO1xuIiwiY29uc3QgQ2FyZHMgPSByZXF1aXJlKFwiLi9DYXJkcy5qc1wiKTtcblxuZnVuY3Rpb24gTWVtb3J5R2FtZShjb25maWcpIHtcbiAgICB0aGlzLm5yT2ZQYWlycyA9IGNvbmZpZy5uck9mUGFpcnMgPyBjb25maWcubnJPZlBhaXJzIDogNDtcblxuICAgIGxldCBjb250YWluZXIgPSBjb25maWcuY29udGFpbmVyID8gY29uZmlnLmNvbnRhaW5lciA6IFwiI2Nvb2xcIjtcblxuICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZHModGhpcy5uck9mUGFpcnMpO1xuXG4gICAgdGhpcy5zY29yZSA9IDA7XG5cbiAgICB0aGlzLmdhbWVUaW1lciA9IDA7XG5cbiAgICB0aGlzLmF0dGVtcHRzID0gMDtcblxuICAgIHRoaXMuZmlyc3RDYXJkID0gXCJcIjtcblxuICAgIHRoaXMuc2Vjb25kQ2FyZCA9IFwiXCI7XG5cbiAgICB0aGlzLmlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcblxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlXcmFwcGVyXCIpO1xuXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBsZXQgaW1nRWxlbSA9IGUudGFyZ2V0O1xuXG4gICAgICAgIGxldCBhRWxlbSA9IGltZ0VsZW0ubm9kZU5hbWUgPT09IFwiSU1HXCIgPyBpbWdFbGVtLnBhcmVudE5vZGUgOiBpbWdFbGVtO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IGFFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIik7XG5cbiAgICAgICAgbGV0IGNhcmQgPSB0aGlzLmNhcmRzLmdldENhcmQodmFsdWUpO1xuXG4gICAgICAgIGlmIChjYXJkKSB7XG4gICAgICAgICAgICBpZiAoY2FyZC5nZXRJc0ZsaXBwZWQoKSA9PT0gZmFsc2UgJiYgdGhpcy5pc0NoZWNraW5nQW5zd2VyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGNhcmQuZmxpcCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RDYXJkID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkID0gY2FyZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY29uZENhcmQgPSBjYXJkO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tBbnN3ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMubWVtb3J5UGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMubWVtb3J5UGFuZWwuY2xhc3NMaXN0LmFkZChcIm1lbW9yeVBhbmVsXCIpO1xuXG4gICAgdGhpcy5tZW1vcnlDYXJkcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHNcIik7XG4gICAgc3dpdGNoKHRoaXMubnJPZlBhaXJzKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTI0MFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzLS13aWR0aC0zNjBcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICB0aGlzLm1lbW9yeUNhcmRzLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkcy0td2lkdGgtNDgwXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTYwMFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLm1lbW9yeUNhcmRzLmFwcGVuZENoaWxkKHRoaXMuY2FyZHMuZ2V0Q2FyZHNGcmFnKCkpO1xuXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZCh0aGlzLm1lbW9yeVBhbmVsKTtcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKHRoaXMubWVtb3J5Q2FyZHMpO1xuXG4gICAgbGV0IG1lbW9yeUNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcbiAgICBtZW1vcnlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XG5cbiAgICB0aGlzLmdhbWVUaW1lckludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZ2FtZVRpbWVyKys7XG5cbiAgICAgICAgdGhpcy5tZW1vcnlQYW5lbC50ZXh0Q29udGVudCA9IFwiVGltZTogXCIgKyB0aGlzLmdhbWVUaW1lciArIFwiLCBBdHRlbXB0czogXCIgKyB0aGlzLmF0dGVtcHRzO1xuICAgIH0uYmluZCh0aGlzKSwgMTAwMCk7XG59XG5cbk1lbW9yeUdhbWUucHJvdG90eXBlLmNoZWNrQW5zd2VyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pc0NoZWNraW5nQW5zd2VyID0gdHJ1ZTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYXR0ZW1wdHMrKztcblxuICAgICAgICBpZiAodGhpcy5maXJzdENhcmQuZ2V0VmFsdWUoKVswXSA9PT0gdGhpcy5zZWNvbmRDYXJkLmdldFZhbHVlKClbMF0pIHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNlY29uZENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5maXJzdENhcmQuYWRkQ2xhc3MoXCJtZW1vcnlDYXJkLS1jb3JyZWN0XCIpO1xuICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkLmFkZENsYXNzKFwibWVtb3J5Q2FyZC0tY29ycmVjdFwiKTtcblxuICAgICAgICAgICAgdGhpcy5zY29yZSsrO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zY29yZSA9PT0gdGhpcy5uck9mUGFpcnMpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ2FtZVRpbWVySW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgIHRoaXMubWVtb3J5UGFuZWwudGV4dENvbnRlbnQgPSBcIllvdSBjb21wbGV0ZWQgdGhlIGdhbWUgaW4gXCIgKyB0aGlzLmdhbWVUaW1lciArIFwiIHNlY29uZHMgYWZ0ZXIgXCIgKyB0aGlzLmF0dGVtcHRzICsgXCIgYXR0ZW1wdHMhXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZC5mbGlwKCk7XG4gICAgICAgICAgICB0aGlzLnNlY29uZENhcmQuZmxpcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maXJzdENhcmQgPSBcIlwiO1xuICAgICAgICB0aGlzLnNlY29uZENhcmQgPSBcIlwiO1xuXG4gICAgICAgIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5R2FtZTtcbiJdfQ==
