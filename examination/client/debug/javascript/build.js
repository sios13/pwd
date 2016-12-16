(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Icon(settings = {}) {
    this.id = settings.id;

    this.applicationName = settings.applicationName ? settings.applicationName : "";

    this.iconImage = settings.iconImage ? settings.iconImage : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "small";

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
                let windowElem = windows[i].getContainer();

                /**
                 * If a mousedown has been made inside a window
                 */
                if (windowElem.contains(e.target)) {
                    /**
                     * Make the window active
                     */
                    windows[i].setIsActive(true);

                    /**
                     * If a mousedown has been made inside a top bar -> start dragging
                     */
                    let windowTopBarElem = windowElem.querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", windowMoveEvent);

                        windows[i].setIsDragging(true);
                    }
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

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let pwdWindow = new Window({
            "windowSize": iconObj.getWindowSize(),
            "name": iconObj.getApplicationName()
        });

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
            pwdWindow.updatePos(e.movementX, e.movementY);
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

    this.xPos = Window.xPos;
    Window.xPos += 20;

    this.yPos = Window.yPos;
    Window.yPos += 20;

    //this.id = settings.id ? settings.id : 0;

    //this.xPos = settings.xPos ? settings.xPos : 100;

    //this.yPos = settings.yPos ? settings.yPos : 100;

    this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : Math.floor(Math.random()*16777215).toString(16);

    this.isActive = settings.active ? settings.active : true;

    this.dragging = settings.dragging ? settings.dragging : false;

    this.name = settings.name ? settings.name : "No name";

    this.icon = settings.icon ? settings.icon : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "medium";

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

Window.prototype.updatePos = function(xMovement, yMovement) {
    this.xPos += xMovement;
    this.yPos += yMovement;

    this.container.style.left = this.xPos + "px";
    this.container.style.top = this.yPos + "px";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvUFdELmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gSWNvbihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLmlkID0gc2V0dGluZ3MuaWQ7XHJcblxyXG4gICAgdGhpcy5hcHBsaWNhdGlvbk5hbWUgPSBzZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgPyBzZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgOiBcIlwiO1xyXG5cclxuICAgIHRoaXMuaWNvbkltYWdlID0gc2V0dGluZ3MuaWNvbkltYWdlID8gc2V0dGluZ3MuaWNvbkltYWdlIDogXCJkZWZhdWx0SWNvbi5pY29cIjtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwic21hbGxcIjtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtaWNvblwiKTtcclxuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiZGF0YS1pY29uaWRcIiwgdGhpcy5pZCk7XHJcblxyXG4gICAgICAgIGxldCBpY29uSW1hZ2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpY29uSW1hZ2VFbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbkltYWdlO1xyXG5cclxuICAgICAgICBsZXQgaWNvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBpY29uVGV4dC50ZXh0Q29udGVudCA9IHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkltYWdlRWxlbSk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25UZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUubGF1bmNoRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aW5kb3dTaXplO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XHJcbiIsImNvbnN0IFdpbmRvdyA9IHJlcXVpcmUoXCIuL1dpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtYWluXCIpO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dzID0gW107XHJcblxyXG4gICAgbGV0IGljb25zID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGljb25zXHJcbiAgICAgKi9cclxuICAgIGljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICBcImlkXCI6IDAsXHJcbiAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAvL1wiaWNvbkltYWdlXCI6IFwibWVtb3J5LnBuZ1wiLFxyXG4gICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICB9KSApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwZW5kIHRoZSBpY29ucyB0byB0aGUgY29udGFpbmVyXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3RlbmVycy5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE1ha2UgYWxsIHdpbmRvd3MgaW5hY3RpdmVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgIHdpbmRvd3NbaV0uc2V0SXNBY3RpdmUoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSXRlcmF0ZSB0aGUgd2luZG93c1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2luZG93RWxlbSA9IHdpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIGluc2lkZSBhIHdpbmRvd1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93RWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBNYWtlIHRoZSB3aW5kb3cgYWN0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93c1tpXS5zZXRJc0FjdGl2ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbnNpZGUgYSB0b3AgYmFyIC0+IHN0YXJ0IGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdpbmRvd1RvcEJhckVsZW0gPSB3aW5kb3dFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3dUb3BCYXJFbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB3aW5kb3dNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93c1tpXS5zZXRJc0RyYWdnaW5nKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBBTGwgd2luZG93cyBzdG9wIGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvd3NbaV0uc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGlmIGEgZG91YmxlY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uIC0+IGxhdW5jaCB0aGUgYXNzb2NpYXRlZCBhcHBsaWNhdGlvblxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24oaWNvbnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggYW4gYXBwbGljYXRpb24gdXNpbmcgdGhlIG1ldGEgZGF0YSBpbiBhIGdpdmVuIGljb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxhdW5jaEFwcGxpY2F0aW9uKGljb25PYmopIHtcclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gbmV3IFdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBpY29uT2JqLmdldFdpbmRvd1NpemUoKSxcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGljb25PYmouZ2V0QXBwbGljYXRpb25OYW1lKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93cy5wdXNoKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICBpZiAoaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKSA9PT0gXCJNZW1vcnlcIikge1xyXG4gICAgICAgICAgICBsZXQgbWVtb3J5ID0gbmV3IE1lbW9yeSh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNwd2Qtd2luZG93X2NvbnRlbnQtXCIgKyBwd2RXaW5kb3cuZ2V0SWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBhY3RpdmUgd2luZG93XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHdpbmRvd01vdmVFdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRmluZCB0aGUgYWN0aXZlIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwd2RXaW5kb3cgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAod2luZG93c1tpXS5nZXRJc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cgPSB3aW5kb3dzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgd2luZG93IGlzIGZvdW5kIC0+IHVwZGF0ZSBpdHMgcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAocHdkV2luZG93KSB7XHJcbiAgICAgICAgICAgIHB3ZFdpbmRvdy51cGRhdGVQb3MoZS5tb3ZlbWVudFgsIGUubW92ZW1lbnRZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblBXRC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUFdEO1xyXG4iLCJmdW5jdGlvbiBXaW5kb3coc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5pZCA9IFdpbmRvdy5pZDtcclxuICAgIFdpbmRvdy5pZCArPSAxO1xyXG5cclxuICAgIHRoaXMueFBvcyA9IFdpbmRvdy54UG9zO1xyXG4gICAgV2luZG93LnhQb3MgKz0gMjA7XHJcblxyXG4gICAgdGhpcy55UG9zID0gV2luZG93LnlQb3M7XHJcbiAgICBXaW5kb3cueVBvcyArPSAyMDtcclxuXHJcbiAgICAvL3RoaXMuaWQgPSBzZXR0aW5ncy5pZCA/IHNldHRpbmdzLmlkIDogMDtcclxuXHJcbiAgICAvL3RoaXMueFBvcyA9IHNldHRpbmdzLnhQb3MgPyBzZXR0aW5ncy54UG9zIDogMTAwO1xyXG5cclxuICAgIC8vdGhpcy55UG9zID0gc2V0dGluZ3MueVBvcyA/IHNldHRpbmdzLnlQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcclxuXHJcbiAgICB0aGlzLmlzQWN0aXZlID0gc2V0dGluZ3MuYWN0aXZlID8gc2V0dGluZ3MuYWN0aXZlIDogdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmRyYWdnaW5nID0gc2V0dGluZ3MuZHJhZ2dpbmcgPyBzZXR0aW5ncy5kcmFnZ2luZyA6IGZhbHNlO1xyXG5cclxuICAgIHRoaXMubmFtZSA9IHNldHRpbmdzLm5hbWUgPyBzZXR0aW5ncy5uYW1lIDogXCJObyBuYW1lXCI7XHJcblxyXG4gICAgdGhpcy5pY29uID0gc2V0dGluZ3MuaWNvbiA/IHNldHRpbmdzLmljb24gOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJtZWRpdW1cIjtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93XCIpO1xyXG4gICAgICAgIC8vY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImRhdGEtd2luZG93aWRcIiwgdGhpcy5pZCk7XHJcbiAgICAgICAgLy9jb250YWluZXIuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwd2Qtd2luZG93LVwiICsgdGhpcy5pZCk7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjXCIgKyB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuXHJcbiAgICAgICAgc3dpdGNoKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwic21hbGxcIjpcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tc21hbGxcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1lZGl1bVwiOlxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1tZWRpdW1cIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1iaWdcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dUb3BCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJcIik7XHJcbiAgICAgICAgd2luZG93VG9wQmFyLnRleHRDb250ZW50ID0gdGhpcy5uYW1lO1xyXG5cclxuICAgICAgICBsZXQgd2luZG93Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgd2luZG93Q29udGVudC5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19jb250ZW50XCIpO1xyXG4gICAgICAgIHdpbmRvd0NvbnRlbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwd2Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLmlkKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcik7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd0NvbnRlbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG5XaW5kb3cuaWQgPSAwO1xyXG5cclxuV2luZG93LnhQb3MgPSAyMDtcclxuXHJcbldpbmRvdy55UG9zID0gMjA7XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnVwZGF0ZVBvcyA9IGZ1bmN0aW9uKHhNb3ZlbWVudCwgeU1vdmVtZW50KSB7XHJcbiAgICB0aGlzLnhQb3MgKz0geE1vdmVtZW50O1xyXG4gICAgdGhpcy55UG9zICs9IHlNb3ZlbWVudDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRJc0RyYWdnaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kcmFnZ2luZztcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5zZXRJc0RyYWdnaW5nID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuZHJhZ2dpbmcgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1kcmFnZ2luZ1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLWRyYWdnaW5nXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRydWUgaWYgdGhpcyB3aW5kb3cgaXMgYWN0aXZlXHJcbiAqL1xyXG5XaW5kb3cucHJvdG90eXBlLmdldElzQWN0aXZlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZTtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5zZXRJc0FjdGl2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzQWN0aXZlID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0taW5hY3RpdmVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWFjdGl2ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLWFjdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0taW5hY3RpdmVcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV2luZG93O1xyXG4iLCJjb25zdCBQV0QgPSByZXF1aXJlKFwiLi9QV0QuanNcIik7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcHdkID0gbmV3IFBXRCh7XCJjb250YWluZXJcIjogXCJib2R5XCJ9KTtcclxufSk7XHJcbiIsImZ1bmN0aW9uIENhcmQodmFsdWUpIHtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICB0aGlzLmlzRmxpcHBlZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuaXNDb21wbGV0ZSA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuY2FyZEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIHRoaXMuY2FyZEVsZW0uc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XHJcbiAgICB0aGlzLmNhcmRFbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWVtb3J5Q2FyZFwiKTtcclxuICAgIHRoaXMuY2FyZEVsZW0uc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCB0aGlzLnZhbHVlKTtcclxuXHJcbiAgICB0aGlzLmNvdmVySW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgdGhpcy5jb3ZlckltYWdlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZnJvbnRcIik7XHJcbiAgICB0aGlzLmNvdmVySW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcbiAgICB0aGlzLmNvdmVySW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiQ292ZXIgaW1hZ2VcIik7XHJcblxyXG4gICAgdGhpcy5jYXJkSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcImJhY2tcIik7XHJcbiAgICB0aGlzLmNhcmRJbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9cIiArIHRoaXMudmFsdWVbMF0gKyBcIi5wbmdcIik7XHJcbiAgICB0aGlzLmNhcmRJbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgXCJNZW1vcnkgY2FyZFwiKTtcclxuXHJcbiAgICB0aGlzLmNhcmRFbGVtLmFwcGVuZENoaWxkKHRoaXMuY292ZXJJbWFnZSk7XHJcbiAgICB0aGlzLmNhcmRFbGVtLmFwcGVuZENoaWxkKHRoaXMuY2FyZEltYWdlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHVuaXF1ZSB2YWx1ZSBmb3IgdGhpcyBjYXJkXHJcbiAqIFRoZSBjYXJkIGlkZW50aWZpZXJcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZsaXBzIHRoZSBjYXJkXHJcbiAqL1xyXG5DYXJkLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5pc0ZsaXBwZWQpIHtcclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcImZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcImZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiYmFja2ZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcImJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcImJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJiYWNrZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5hZGQoXCJmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmdldElzRmxpcHBlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNGbGlwcGVkO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5zZXRJc0NvbXBsZXRlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNDb21wbGV0ZSA9IHZhbHVlO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xyXG4gICAgdGhpcy5jYXJkRWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmdldENhcmRFbGVtID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYXJkRWxlbTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkO1xyXG4iLCJjb25zdCBDYXJkID0gcmVxdWlyZShcIi4vQ2FyZC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIENhcmRzKG5yT2ZDYXJkcykge1xyXG4gICAgdGhpcy5jYXJkcyA9IFtdO1xyXG5cclxuICAgIHRoaXMubnVtYmVyT2ZDYXJkcyA9IG5yT2ZDYXJkcztcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuck9mQ2FyZHMgKyAxOyBpKyspIHtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAxKSk7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2h1ZmZsZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgbGV0IHRlbXAgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbaV0gPSB0aGlzLmNhcmRzW2pdO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbal0gPSB0ZW1wO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgY2FyZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZVxyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgbGV0IGNhcmQ7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FyZHNbaV0uZ2V0VmFsdWUoKSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgY2FyZCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBmcmFnbWVudCBjb250YWluaW5nIHRoZSBjYXJkIGRpdnMgYW5kIGltYWdlc1xyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmRzRnJhZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNhcmRzRnJhZyA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNhcmRFbGVtID0gdGhpcy5jYXJkc1tpXS5nZXRDYXJkRWxlbSgpO1xyXG4gICAgICAgIGNhcmRzRnJhZy5hcHBlbmRDaGlsZChjYXJkRWxlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmRzRnJhZztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkcztcclxuIiwiY29uc3QgQ2FyZHMgPSByZXF1aXJlKFwiLi9DYXJkcy5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIE1lbW9yeUdhbWUoY29uZmlnKSB7XHJcbiAgICB0aGlzLm5yT2ZQYWlycyA9IGNvbmZpZy5uck9mUGFpcnMgPyBjb25maWcubnJPZlBhaXJzIDogNDtcclxuXHJcbiAgICBsZXQgY29udGFpbmVyID0gY29uZmlnLmNvbnRhaW5lciA/IGNvbmZpZy5jb250YWluZXIgOiBcIiNjb29sXCI7XHJcblxyXG4gICAgdGhpcy5jYXJkcyA9IG5ldyBDYXJkcyh0aGlzLm5yT2ZQYWlycyk7XHJcblxyXG4gICAgdGhpcy5zY29yZSA9IDA7XHJcblxyXG4gICAgdGhpcy5nYW1lVGltZXIgPSAwO1xyXG5cclxuICAgIHRoaXMuYXR0ZW1wdHMgPSAwO1xyXG5cclxuICAgIHRoaXMuZmlyc3RDYXJkID0gXCJcIjtcclxuXHJcbiAgICB0aGlzLnNlY29uZENhcmQgPSBcIlwiO1xyXG5cclxuICAgIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcIm1lbW9yeVdyYXBwZXJcIik7XHJcblxyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBsZXQgaW1nRWxlbSA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBsZXQgYUVsZW0gPSBpbWdFbGVtLm5vZGVOYW1lID09PSBcIklNR1wiID8gaW1nRWxlbS5wYXJlbnROb2RlIDogaW1nRWxlbTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0gYUVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNhcmQgPSB0aGlzLmNhcmRzLmdldENhcmQodmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoY2FyZCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5nZXRJc0ZsaXBwZWQoKSA9PT0gZmFsc2UgJiYgdGhpcy5pc0NoZWNraW5nQW5zd2VyID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY2FyZC5mbGlwKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RDYXJkID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdENhcmQgPSBjYXJkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY29uZENhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQW5zd2VyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1lbW9yeVBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMubWVtb3J5UGFuZWwuY2xhc3NMaXN0LmFkZChcIm1lbW9yeVBhbmVsXCIpO1xyXG5cclxuICAgIHRoaXMubWVtb3J5Q2FyZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHNcIik7XHJcbiAgICBzd2l0Y2godGhpcy5uck9mUGFpcnMpIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICB0aGlzLm1lbW9yeUNhcmRzLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkcy0td2lkdGgtMjQwXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICB0aGlzLm1lbW9yeUNhcmRzLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkcy0td2lkdGgtMzYwXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICB0aGlzLm1lbW9yeUNhcmRzLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkcy0td2lkdGgtNDgwXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDc6XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICB0aGlzLm1lbW9yeUNhcmRzLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkcy0td2lkdGgtNjAwXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHRoaXMubWVtb3J5Q2FyZHMuYXBwZW5kQ2hpbGQodGhpcy5jYXJkcy5nZXRDYXJkc0ZyYWcoKSk7XHJcblxyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZCh0aGlzLm1lbW9yeVBhbmVsKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5tZW1vcnlDYXJkcyk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeUNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChtZW1vcnlXcmFwcGVyRGl2KTtcclxuXHJcbiAgICB0aGlzLmdhbWVUaW1lckludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lVGltZXIrKztcclxuXHJcbiAgICAgICAgdGhpcy5tZW1vcnlQYW5lbC50ZXh0Q29udGVudCA9IFwiVGltZTogXCIgKyB0aGlzLmdhbWVUaW1lciArIFwiLCBBdHRlbXB0czogXCIgKyB0aGlzLmF0dGVtcHRzO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcclxufVxyXG5cclxuTWVtb3J5R2FtZS5wcm90b3R5cGUuY2hlY2tBbnN3ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9IHRydWU7XHJcblxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmF0dGVtcHRzKys7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmZpcnN0Q2FyZC5nZXRWYWx1ZSgpWzBdID09PSB0aGlzLnNlY29uZENhcmQuZ2V0VmFsdWUoKVswXSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZC5zZXRJc0NvbXBsZXRlKHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnNlY29uZENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkLmFkZENsYXNzKFwibWVtb3J5Q2FyZC0tY29ycmVjdFwiKTtcclxuICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkLmFkZENsYXNzKFwibWVtb3J5Q2FyZC0tY29ycmVjdFwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2NvcmUrKztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNjb3JlID09PSB0aGlzLm5yT2ZQYWlycykge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVUaW1lckludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVtb3J5UGFuZWwudGV4dENvbnRlbnQgPSBcIllvdSBjb21wbGV0ZWQgdGhlIGdhbWUgaW4gXCIgKyB0aGlzLmdhbWVUaW1lciArIFwiIHNlY29uZHMgYWZ0ZXIgXCIgKyB0aGlzLmF0dGVtcHRzICsgXCIgYXR0ZW1wdHMhXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZC5mbGlwKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kQ2FyZC5mbGlwKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpcnN0Q2FyZCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5zZWNvbmRDYXJkID0gXCJcIjtcclxuXHJcbiAgICAgICAgdGhpcy5pc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XHJcbiAgICB9LmJpbmQodGhpcyksIDIwMDApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWU7XHJcbiJdfQ==
