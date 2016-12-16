(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Icon(settings = {}) {
    this.id = settings.id;

    this.applicationName = settings.applicationName ? settings.applicationName : "";

    this.iconImage = settings.iconImage ? settings.iconImage : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "small";

    this.isSelected = settings.isSelected ? settings.isSelected : false;

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("div");
        container.classList.add("PWD-icon");
        container.setAttribute("data-iconid", this.id);

        let iconImageElem = document.createElement("img");
        iconImageElem.src = "./image/" + this.iconImage;

        let iconText = document.createElement("span");
        iconText.textContent = this.applicationName;

        container.appendChild(iconImageElem);
        container.appendChild(iconText);

        return container;
    }
}

Icon.prototype.launchEvent = function() {

}

Icon.prototype.getIsSelected = function() {
    return this.isSelected;
}

Icon.prototype.setIsSelected = function(value) {
    this.isSelected = value;

    if (this.isSelected) {
        this.container.classList.add("PWD-icon--selected");
    } else {
        this.container.classList.remove("PWD-icon--selected");
    }
}

Icon.prototype.getApplicationName = function() {
    return this.applicationName;
}

Icon.prototype.getWindowSize = function() {
    return this.windowSize;
}

Icon.prototype.getId = function() {
    return this.id;
}

Icon.prototype.getContainer = function() {
    return this.container;
}

module.exports = Icon;

},{}],2:[function(require,module,exports){
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
     * Create the icons
     */
    icons.push( new Icon({
        "id": 0,
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

            /**
             * Make all windows inactive
             */
            for (let i = 0; i < windows.length; i++) {
                 windows[i].setIsActive(false);
            }

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
                    windows[i].setIsActive(true);

                    /**
                     * If a mousedown has been made on a top bar -> start dragging
                     */
                    let windowTopBarElem = windows[i].getContainer().querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", windowMoveEvent);

                        windows[i].setIsDragging(true);
                    }
                }
            }

            /**
             * Deselect all icons
             */
            for (let i = 0; i < icons.length; i++) {
                icons[i].setIsSelected(false);
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
                }
            }
        });

        window.addEventListener("mouseup", function() {
            window.removeEventListener("mousemove", windowMoveEvent);
            /**
             * ALl windows stop dragging
             */
            for (let i = 0; i < windows.length; i++) {
                windows[i].setIsDragging(false);
            }

            console.log("up");
        });

        window.addEventListener("dblclick", function(e) {
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
                "container": "#pwd-window_content-" + pwdWindow.getId()
            });
        }
    }

    /**
     * Update the position of the active window
     */
    function windowMoveEvent(e) {
        /**
         * Find the active window
         */
        let pwdWindow = undefined;

        for (let i = 0; i < windows.length; i++) {
            if (windows[i].getIsActive()) {
                pwdWindow = windows[i];
                break;
            }
        }

        /**
         * If a window is found -> update its position
         */
        if (pwdWindow) {
            let movementX = e.movementX;
            let movementY = e.movementY;

            if ((pwdWindow.getXPos() + movementX + pwdWindow.getWidth()) > pwdWidth) {
                movementX = 0;
            }

            if (pwdWindow.getXPos() + movementX < 0) {
                movementX = 0;
            }

            if ((pwdWindow.getYPos() + movementY + pwdWindow.getHeight()) > pwdHeight) {
                movementY = 0;
            }

            if (pwdWindow.getYPos() + movementY < 0) {
                movementY = 0;
            }

            pwdWindow.updatePos(movementX, movementY);
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;

},{"./Icon.js":1,"./Window.js":3,"./apps/Memory/MemoryGame.js":7}],3:[function(require,module,exports){
function Window(settings = {}) {
    this.id = Window.id;
    Window.id += 1;
/*
    this.xPos = Window.xPos;
    Window.xPos += 20;

    this.yPos = Window.yPos;
    Window.yPos += 20;
*/
    //this.id = settings.id ? settings.id : 0;

    this.xPos = settings.xPos ? settings.xPos : 100;

    this.yPos = settings.yPos ? settings.yPos : 100;

    this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : Math.floor(Math.random()*16777215).toString(16);

    this.isActive = settings.active ? settings.active : true;

    this.dragging = settings.dragging ? settings.dragging : false;

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
        //container.setAttribute("data-windowid", this.id);
        //container.setAttribute("id", "pwd-window-" + this.id);
        container.style.left = this.xPos + "px";
        container.style.top = this.yPos + "px";
        container.style.backgroundColor = "#" + this.backgroundColor;

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
        windowTopBar.textContent = this.name;

        let windowContent = document.createElement("div");
        windowContent.classList.add("PWD-window_content");
        windowContent.setAttribute("id", "pwd-window_content-" + this.id);

        container.appendChild(windowTopBar);
        container.appendChild(windowContent);

        return container;
    }
}

Window.id = 0;

Window.xPos = 20;

Window.yPos = 20;

Window.prototype.getXPos = function() {
    return this.xPos;
}

Window.prototype.getYPos = function() {
    return this.yPos;
}

Window.prototype.updatePos = function(xMovement, yMovement) {
    this.xPos += xMovement;
    this.yPos += yMovement;

    this.container.style.left = this.xPos + "px";
    this.container.style.top = this.yPos + "px";
}

Window.prototype.getWidth = function() {
    return this.width;
}

Window.prototype.getHeight = function() {
    return this.height;
}

Window.prototype.getId = function() {
    return this.id;
}

Window.prototype.getIsDragging = function() {
    return this.dragging;
}

Window.prototype.setIsDragging = function(value) {
    this.dragging = value;

    if (this.dragging) {
        this.container.classList.add("PWD-window--dragging");
    } else {
        this.container.classList.remove("PWD-window--dragging");
    }
}

/**
 * Return true if this window is active
 */
Window.prototype.getIsActive = function() {
    return this.isActive;
}

Window.prototype.setIsActive = function(value) {
    this.isActive = value;

    if (this.isActive) {
        this.container.classList.remove("PWD-window--inactive");
        this.container.classList.add("PWD-window--active");
    } else {
        this.container.classList.remove("PWD-window--active");
        this.container.classList.add("PWD-window--inactive");
    }
}

Window.prototype.getContainer = function() {
    return this.container;
}

module.exports = Window;

},{}],4:[function(require,module,exports){
const PWD = require("./PWD.js");

window.addEventListener("load", function() {
    let pwd = new PWD({"container": "body"});
});

},{"./PWD.js":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./Card.js":5}],7:[function(require,module,exports){
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

},{"./Cards.js":6}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvUFdELmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIEljb24oc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5pZCA9IHNldHRpbmdzLmlkO1xyXG5cclxuICAgIHRoaXMuYXBwbGljYXRpb25OYW1lID0gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lID8gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lIDogXCJcIjtcclxuXHJcbiAgICB0aGlzLmljb25JbWFnZSA9IHNldHRpbmdzLmljb25JbWFnZSA/IHNldHRpbmdzLmljb25JbWFnZSA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcInNtYWxsXCI7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtaWNvblwiKTtcclxuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiZGF0YS1pY29uaWRcIiwgdGhpcy5pZCk7XHJcblxyXG4gICAgICAgIGxldCBpY29uSW1hZ2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpY29uSW1hZ2VFbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbkltYWdlO1xyXG5cclxuICAgICAgICBsZXQgaWNvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBpY29uVGV4dC50ZXh0Q29udGVudCA9IHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkltYWdlRWxlbSk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25UZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUubGF1bmNoRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldElzU2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWQ7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtaWNvbi0tc2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0QtaWNvbi0tc2VsZWN0ZWRcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aW5kb3dTaXplO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XHJcbiIsImNvbnN0IFdpbmRvdyA9IHJlcXVpcmUoXCIuL1dpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtYWluXCIpO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dzID0gW107XHJcblxyXG4gICAgbGV0IGljb25zID0gW107XHJcblxyXG4gICAgbGV0IHB3ZFdpZHRoID0gMTMwMDtcclxuXHJcbiAgICBsZXQgcHdkSGVpZ2h0ID0gNjAwO1xyXG5cclxuICAgIGxldCB3aW5kb3dzTWFkZUNvdW50ZXIgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSBpY29uc1xyXG4gICAgICovXHJcbiAgICBpY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgXCJpZFwiOiAwLFxyXG4gICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgLy9cImljb25JbWFnZVwiOiBcIm1lbW9yeS5wbmdcIixcclxuICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIlxyXG4gICAgfSkgKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGVuZCB0aGUgaWNvbnMgdG8gdGhlIGNvbnRhaW5lclxyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25zW2ldLmdldENvbnRhaW5lcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcnMuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBNYWtlIGFsbCB3aW5kb3dzIGluYWN0aXZlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICB3aW5kb3dzW2ldLnNldElzQWN0aXZlKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEl0ZXJhdGUgdGhlIHdpbmRvd3NcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIGluc2lkZSBhIHdpbmRvd1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93c1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBNYWtlIHRoZSB3aW5kb3cgYWN0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93c1tpXS5zZXRJc0FjdGl2ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBvbiBhIHRvcCBiYXIgLT4gc3RhcnQgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgd2luZG93VG9wQmFyRWxlbSA9IHdpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvd1RvcEJhckVsZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dzW2ldLnNldElzRHJhZ2dpbmcodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRGVzZWxlY3QgYWxsIGljb25zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpY29uc1tpXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEl0ZXJhdGUgdGhlIGljb25zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvbiAtPiBtYXJrIGl0IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChpY29uc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpY29uc1tpXS5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgd2luZG93TW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEFMbCB3aW5kb3dzIHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgd2luZG93c1tpXS5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogaWYgYSBkb3VibGVjbGljayBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb24gLT4gbGF1bmNoIHRoZSBhc3NvY2lhdGVkIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChpY29uc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXVuY2hBcHBsaWNhdGlvbihpY29uc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXROZXdXaW5kb3dYUG9zKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXROZXdXaW5kb3dZUG9zKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExhdW5jaCBhbiBhcHBsaWNhdGlvbiB1c2luZyB0aGUgbWV0YSBkYXRhIGluIGEgZ2l2ZW4gaWNvbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbGF1bmNoQXBwbGljYXRpb24oaWNvbk9iaikge1xyXG4gICAgICAgIGxldCBwd2RXaW5kb3cgPSBuZXcgV2luZG93KHtcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IGljb25PYmouZ2V0V2luZG93U2l6ZSgpLFxyXG4gICAgICAgICAgICBcIm5hbWVcIjogaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKSxcclxuICAgICAgICAgICAgXCJ4UG9zXCI6ICgxMDAgKyAxNSAqIHdpbmRvd3NNYWRlQ291bnRlciksXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAoMjAgKyAzMCAqIHdpbmRvd3NNYWRlQ291bnRlcilcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93c01hZGVDb3VudGVyICs9IDE7XHJcblxyXG4gICAgICAgIHdpbmRvd3MucHVzaChwd2RXaW5kb3cpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocHdkV2luZG93LmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgaWYgKGljb25PYmouZ2V0QXBwbGljYXRpb25OYW1lKCkgPT09IFwiTWVtb3J5XCIpIHtcclxuICAgICAgICAgICAgbGV0IG1lbW9yeSA9IG5ldyBNZW1vcnkoe1xyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJcIjogXCIjcHdkLXdpbmRvd19jb250ZW50LVwiICsgcHdkV2luZG93LmdldElkKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgYWN0aXZlIHdpbmRvd1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB3aW5kb3dNb3ZlRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZpbmQgdGhlIGFjdGl2ZSB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvd3NbaV0uZ2V0SXNBY3RpdmUoKSkge1xyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93ID0gd2luZG93c1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIHdpbmRvdyBpcyBmb3VuZCAtPiB1cGRhdGUgaXRzIHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHB3ZFdpbmRvdykge1xyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRYID0gZS5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFkgPSBlLm1vdmVtZW50WTtcclxuXHJcbiAgICAgICAgICAgIGlmICgocHdkV2luZG93LmdldFhQb3MoKSArIG1vdmVtZW50WCArIHB3ZFdpbmRvdy5nZXRXaWR0aCgpKSA+IHB3ZFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFggPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocHdkV2luZG93LmdldFhQb3MoKSArIG1vdmVtZW50WCA8IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgocHdkV2luZG93LmdldFlQb3MoKSArIG1vdmVtZW50WSArIHB3ZFdpbmRvdy5nZXRIZWlnaHQoKSkgPiBwd2RIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwd2RXaW5kb3cuZ2V0WVBvcygpICsgbW92ZW1lbnRZIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcHdkV2luZG93LnVwZGF0ZVBvcyhtb3ZlbWVudFgsIG1vdmVtZW50WSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5QV0QucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBXRDtcclxuIiwiZnVuY3Rpb24gV2luZG93KHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuaWQgPSBXaW5kb3cuaWQ7XHJcbiAgICBXaW5kb3cuaWQgKz0gMTtcclxuLypcclxuICAgIHRoaXMueFBvcyA9IFdpbmRvdy54UG9zO1xyXG4gICAgV2luZG93LnhQb3MgKz0gMjA7XHJcblxyXG4gICAgdGhpcy55UG9zID0gV2luZG93LnlQb3M7XHJcbiAgICBXaW5kb3cueVBvcyArPSAyMDtcclxuKi9cclxuICAgIC8vdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIHRoaXMueFBvcyA9IHNldHRpbmdzLnhQb3MgPyBzZXR0aW5ncy54UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMueVBvcyA9IHNldHRpbmdzLnlQb3MgPyBzZXR0aW5ncy55UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjE2Nzc3MjE1KS50b1N0cmluZygxNik7XHJcblxyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IHNldHRpbmdzLmFjdGl2ZSA/IHNldHRpbmdzLmFjdGl2ZSA6IHRydWU7XHJcblxyXG4gICAgdGhpcy5kcmFnZ2luZyA9IHNldHRpbmdzLmRyYWdnaW5nID8gc2V0dGluZ3MuZHJhZ2dpbmcgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLm5hbWUgPSBzZXR0aW5ncy5uYW1lID8gc2V0dGluZ3MubmFtZSA6IFwiTm8gbmFtZVwiO1xyXG5cclxuICAgIHRoaXMuaWNvbiA9IHNldHRpbmdzLmljb24gPyBzZXR0aW5ncy5pY29uIDogXCJkZWZhdWx0SWNvbi5pY29cIjtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwibWVkaXVtXCI7XHJcblxyXG4gICAgc3dpdGNoICh0aGlzLndpbmRvd1NpemUpIHtcclxuICAgICAgICBjYXNlIFwic21hbGxcIjpcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IDIwMDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAzMDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IDMwMDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA0NTA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJiaWdcIjpcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IDQwMDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcbiAgICAgICAgLy9jb250YWluZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13aW5kb3dpZFwiLCB0aGlzLmlkKTtcclxuICAgICAgICAvL2NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInB3ZC13aW5kb3ctXCIgKyB0aGlzLmlkKTtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNcIiArIHRoaXMuYmFja2dyb3VuZENvbG9yO1xyXG5cclxuICAgICAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1zbWFsbFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1lZGl1bVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWJpZ1wiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuICAgICAgICB3aW5kb3dUb3BCYXIudGV4dENvbnRlbnQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB3aW5kb3dDb250ZW50LmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2NvbnRlbnRcIik7XHJcbiAgICAgICAgd2luZG93Q29udGVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInB3ZC13aW5kb3dfY29udGVudC1cIiArIHRoaXMuaWQpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93Q29udGVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbldpbmRvdy5pZCA9IDA7XHJcblxyXG5XaW5kb3cueFBvcyA9IDIwO1xyXG5cclxuV2luZG93LnlQb3MgPSAyMDtcclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0WFBvcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueFBvcztcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRZUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy55UG9zO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnVwZGF0ZVBvcyA9IGZ1bmN0aW9uKHhNb3ZlbWVudCwgeU1vdmVtZW50KSB7XHJcbiAgICB0aGlzLnhQb3MgKz0geE1vdmVtZW50O1xyXG4gICAgdGhpcy55UG9zICs9IHlNb3ZlbWVudDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZHJhZ2dpbmc7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuc2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmRyYWdnaW5nID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tZHJhZ2dpbmdcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1kcmFnZ2luZ1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoaXMgd2luZG93IGlzIGFjdGl2ZVxyXG4gKi9cclxuV2luZG93LnByb3RvdHlwZS5nZXRJc0FjdGl2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNBY3RpdmU7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuc2V0SXNBY3RpdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLWluYWN0aXZlXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1hY3RpdmVcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1hY3RpdmVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWluYWN0aXZlXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvdztcclxuIiwiY29uc3QgUFdEID0gcmVxdWlyZShcIi4vUFdELmpzXCIpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHB3ZCA9IG5ldyBQV0Qoe1wiY29udGFpbmVyXCI6IFwiYm9keVwifSk7XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBDYXJkKHZhbHVlKSB7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmNhcmRFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLmNhcmRFbGVtLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1lbW9yeUNhcmRcIik7XHJcbiAgICB0aGlzLmNhcmRFbGVtLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgdGhpcy52YWx1ZSk7XHJcblxyXG4gICAgdGhpcy5jb3ZlckltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZyb250XCIpO1xyXG4gICAgdGhpcy5jb3ZlckltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xyXG4gICAgdGhpcy5jb3ZlckltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkNvdmVyIGltYWdlXCIpO1xyXG5cclxuICAgIHRoaXMuY2FyZEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJiYWNrXCIpO1xyXG4gICAgdGhpcy5jYXJkSW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvXCIgKyB0aGlzLnZhbHVlWzBdICsgXCIucG5nXCIpO1xyXG4gICAgdGhpcy5jYXJkSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiTWVtb3J5IGNhcmRcIik7XHJcblxyXG4gICAgdGhpcy5jYXJkRWxlbS5hcHBlbmRDaGlsZCh0aGlzLmNvdmVySW1hZ2UpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5hcHBlbmRDaGlsZCh0aGlzLmNhcmRJbWFnZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSB1bmlxdWUgdmFsdWUgZm9yIHRoaXMgY2FyZFxyXG4gKiBUaGUgY2FyZCBpZGVudGlmaWVyXHJcbiAqL1xyXG5DYXJkLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGbGlwcyB0aGUgY2FyZFxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZmxpcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMuaXNGbGlwcGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcImJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJiYWNrZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJiYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRJc0ZsaXBwZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRmxpcHBlZDtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuc2V0SXNDb21wbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSB2YWx1ZTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcclxuICAgIHRoaXMuY2FyZEVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRDYXJkRWxlbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZEVsZW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZDtcclxuIiwiY29uc3QgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDYXJkcyhuck9mQ2FyZHMpIHtcclxuICAgIHRoaXMuY2FyZHMgPSBbXTtcclxuXHJcbiAgICB0aGlzLm51bWJlck9mQ2FyZHMgPSBuck9mQ2FyZHM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnJPZkNhcmRzICsgMTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMSkpO1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNodWZmbGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSB0aGlzLmNhcmRzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgIGxldCB0ZW1wID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2ldID0gdGhpcy5jYXJkc1tqXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2pdID0gdGVtcDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGNhcmQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIGxldCBjYXJkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmNhcmRzW2ldLmdldFZhbHVlKCkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGNhcmQgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgZnJhZ21lbnQgY29udGFpbmluZyB0aGUgY2FyZCBkaXZzIGFuZCBpbWFnZXNcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkc0ZyYWcgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjYXJkc0ZyYWcgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjYXJkRWxlbSA9IHRoaXMuY2FyZHNbaV0uZ2V0Q2FyZEVsZW0oKTtcclxuICAgICAgICBjYXJkc0ZyYWcuYXBwZW5kQ2hpbGQoY2FyZEVsZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkc0ZyYWc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZHM7XHJcbiIsImNvbnN0IENhcmRzID0gcmVxdWlyZShcIi4vQ2FyZHMuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lKGNvbmZpZykge1xyXG4gICAgdGhpcy5uck9mUGFpcnMgPSBjb25maWcubnJPZlBhaXJzID8gY29uZmlnLm5yT2ZQYWlycyA6IDQ7XHJcblxyXG4gICAgbGV0IGNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXIgPyBjb25maWcuY29udGFpbmVyIDogXCIjY29vbFwiO1xyXG5cclxuICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZHModGhpcy5uck9mUGFpcnMpO1xyXG5cclxuICAgIHRoaXMuc2NvcmUgPSAwO1xyXG5cclxuICAgIHRoaXMuZ2FtZVRpbWVyID0gMDtcclxuXHJcbiAgICB0aGlzLmF0dGVtcHRzID0gMDtcclxuXHJcbiAgICB0aGlzLmZpcnN0Q2FyZCA9IFwiXCI7XHJcblxyXG4gICAgdGhpcy5zZWNvbmRDYXJkID0gXCJcIjtcclxuXHJcbiAgICB0aGlzLmlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlXcmFwcGVyXCIpO1xyXG5cclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgbGV0IGltZ0VsZW0gPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGFFbGVtID0gaW1nRWxlbS5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGltZ0VsZW0ucGFyZW50Tm9kZSA6IGltZ0VsZW07XHJcblxyXG4gICAgICAgIGxldCB2YWx1ZSA9IGFFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIik7XHJcblxyXG4gICAgICAgIGxldCBjYXJkID0gdGhpcy5jYXJkcy5nZXRDYXJkKHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGNhcmQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuZ2V0SXNGbGlwcGVkKCkgPT09IGZhbHNlICYmIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuZmxpcCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0Q2FyZCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkID0gY2FyZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0Fuc3dlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5tZW1vcnlQYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLm1lbW9yeVBhbmVsLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlQYW5lbFwiKTtcclxuXHJcbiAgICB0aGlzLm1lbW9yeUNhcmRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzXCIpO1xyXG4gICAgc3dpdGNoKHRoaXMubnJPZlBhaXJzKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTI0MFwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTM2MFwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTQ4MFwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTYwMFwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1lbW9yeUNhcmRzLmFwcGVuZENoaWxkKHRoaXMuY2FyZHMuZ2V0Q2FyZHNGcmFnKCkpO1xyXG5cclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5tZW1vcnlQYW5lbCk7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKHRoaXMubWVtb3J5Q2FyZHMpO1xyXG5cclxuICAgIGxldCBtZW1vcnlDb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBtZW1vcnlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgdGhpcy5nYW1lVGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZVRpbWVyKys7XHJcblxyXG4gICAgICAgIHRoaXMubWVtb3J5UGFuZWwudGV4dENvbnRlbnQgPSBcIlRpbWU6IFwiICsgdGhpcy5nYW1lVGltZXIgKyBcIiwgQXR0ZW1wdHM6IFwiICsgdGhpcy5hdHRlbXB0cztcclxuICAgIH0uYmluZCh0aGlzKSwgMTAwMCk7XHJcbn1cclxuXHJcbk1lbW9yeUdhbWUucHJvdG90eXBlLmNoZWNrQW5zd2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmlzQ2hlY2tpbmdBbnN3ZXIgPSB0cnVlO1xyXG5cclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5hdHRlbXB0cysrO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5maXJzdENhcmQuZ2V0VmFsdWUoKVswXSA9PT0gdGhpcy5zZWNvbmRDYXJkLmdldFZhbHVlKClbMF0pIHtcclxuICAgICAgICAgICAgdGhpcy5maXJzdENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZC5hZGRDbGFzcyhcIm1lbW9yeUNhcmQtLWNvcnJlY3RcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kQ2FyZC5hZGRDbGFzcyhcIm1lbW9yeUNhcmQtLWNvcnJlY3RcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNjb3JlKys7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zY29yZSA9PT0gdGhpcy5uck9mUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lVGltZXJJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lbW9yeVBhbmVsLnRleHRDb250ZW50ID0gXCJZb3UgY29tcGxldGVkIHRoZSBnYW1lIGluIFwiICsgdGhpcy5nYW1lVGltZXIgKyBcIiBzZWNvbmRzIGFmdGVyIFwiICsgdGhpcy5hdHRlbXB0cyArIFwiIGF0dGVtcHRzIVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5maXJzdENhcmQuZmxpcCgpO1xyXG4gICAgICAgICAgICB0aGlzLnNlY29uZENhcmQuZmxpcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maXJzdENhcmQgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuc2Vjb25kQ2FyZCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnlHYW1lO1xyXG4iXX0=
