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

        container.appendChild(iconImageElem);

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

    let newWindowXPos = 0;

    let newWindowYPos = 0;

    let icons = [];
/*
    for (let i = 0; i < 10; i++) {
        windows.push(new Window({"id": i, "xPos": getNewWindowXPos(), "yPos": getNewWindowYPos()}));
    }
*/
/*
    for (let i = 0; i < windows.length; i++) {
        this.container.appendChild(windows[i].getContainer());
    }
*/
    icons.push(new Icon({
        "id": 0,
        "applicationName": "Memory",
        //"iconImage": "memory.png",
        "windowSize": "medium"
    }));

    for (let i = 0; i < icons.length; i++) {
        container.appendChild(icons[i].getContainer());
    }

    addListeners.bind(this)();

    function addListeners() {
        window.addEventListener("mousedown", function(e) {
            e.preventDefault();

            let pwdWindow = getWindow(parseInt(e.target.getAttribute("data-windowid")));

            if (pwdWindow) {
                setActive(pwdWindow);

                let pwdWindowElem = pwdWindow.getContainer();

                window.addEventListener("mousemove", windowMoveEvent);
            }
        });

        window.addEventListener("mouseup", function() {
            window.removeEventListener("mousemove", windowMoveEvent);
            console.log("up");
        });

        window.addEventListener("dblclick", function(e) {
            if (e.target.nodeName !== "IMG") {
                return;
            }

            let pwdIconDiv = e.target.parentNode;
            let pwdIconObj = getIcon(parseInt(pwdIconDiv.getAttribute("data-iconid")));

            launchApplication(pwdIconObj);
        });
    }

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let pwdWindow = new Window({
            "windowSize": iconObj.getWindowSize()
        });

        windows.push(pwdWindow);

        container.appendChild(pwdWindow.getContainer());

        if (iconObj.getApplicationName() === "Memory") {
            let memory = new Memory({
                "container": "#pwd-window-" + pwdWindow.getId()
            });
        }
    }

    /**
     * Returns the icon object with the given id
     */
    function getIcon(id) {
        for (let i = 0; i < icons.length; i++) {
            if (icons[i].getId() === id) {
                return icons[i];
            }
        }

        return undefined;
    }

    function windowMoveEvent(e) {
        let pwdWindow = getActiveWindow();

        if (pwdWindow) {
            pwdWindow.updatePos(e.movementX, e.movementY);
        }
    }

    /**
     * Returns the active window.
     * If no window is active -> return undefined
     */
    function getActiveWindow() {
        for (let i = 0; i < windows.length; i++) {
            if (windows[i].isActive()) {
                return windows[i];
            }
        }

        return undefined;
    }

    /**
     * Sets all the windows as inactive
     * Sets the given window as active
     */
    function setActive(pwdWindow) {
        for (let i = 0; i < windows.length; i++) {
            windows[i].setActive(false);
        }

        pwdWindow.setActive(true);
    }

    /**
     * Returns the window object with the given id
     */
    function getWindow(id) {
        for (let i = 0; i < windows.length; i++) {
            if (windows[i].getId() === id) {
                return windows[i];
            }
        }
    }

    function getNewWindowXPos() {
        newWindowXPos += 20;

        return newWindowXPos;
    }

    function getNewWindowYPos() {
        newWindowYPos += 20;

        return newWindowYPos;
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

    this.active = settings.active ? settings.active : true;

    this.windowSize = settings.windowSize ? settings.windowSize : "medium";

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("div");

        container.classList.add("PWD-window");

        container.setAttribute("data-windowid", this.id);

        container.setAttribute("id", "pwd-window-" + this.id);

        container.style.left = this.xPos + "px";

        container.style.top = this.yPos + "px";

        container.style.backgroundColor = "#" + this.backgroundColor;

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

/**
 * Return true if this window is active
 */
Window.prototype.isActive = function() {
    return this.active;
}

Window.prototype.setActive = function(value) {
    this.active = value;

    if (this.active) {
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
    //let container = document.querySelector("main");

    let pwd = new PWD({"container": "body"});

    //container.appendChild(pwd.getContainer());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvUFdELmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZDtcclxuXHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA/IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5pY29uSW1hZ2UgPSBzZXR0aW5ncy5pY29uSW1hZ2UgPyBzZXR0aW5ncy5pY29uSW1hZ2UgOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJzbWFsbFwiO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1pY29uXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLWljb25pZFwiLCB0aGlzLmlkKTtcclxuXHJcbiAgICAgICAgbGV0IGljb25JbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGljb25JbWFnZUVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uSW1hZ2U7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uSW1hZ2VFbGVtKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUubGF1bmNoRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aW5kb3dTaXplO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XHJcbiIsImNvbnN0IFdpbmRvdyA9IHJlcXVpcmUoXCIuL1dpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtYWluXCIpO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dzID0gW107XHJcblxyXG4gICAgbGV0IG5ld1dpbmRvd1hQb3MgPSAwO1xyXG5cclxuICAgIGxldCBuZXdXaW5kb3dZUG9zID0gMDtcclxuXHJcbiAgICBsZXQgaWNvbnMgPSBbXTtcclxuLypcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICAgIHdpbmRvd3MucHVzaChuZXcgV2luZG93KHtcImlkXCI6IGksIFwieFBvc1wiOiBnZXROZXdXaW5kb3dYUG9zKCksIFwieVBvc1wiOiBnZXROZXdXaW5kb3dZUG9zKCl9KSk7XHJcbiAgICB9XHJcbiovXHJcbi8qXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh3aW5kb3dzW2ldLmdldENvbnRhaW5lcigpKTtcclxuICAgIH1cclxuKi9cclxuICAgIGljb25zLnB1c2gobmV3IEljb24oe1xyXG4gICAgICAgIFwiaWRcIjogMCxcclxuICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgIC8vXCJpY29uSW1hZ2VcIjogXCJtZW1vcnkucG5nXCIsXHJcbiAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgIH0pKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25zW2ldLmdldENvbnRhaW5lcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcnMuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwd2RXaW5kb3cgPSBnZXRXaW5kb3cocGFyc2VJbnQoZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS13aW5kb3dpZFwiKSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHB3ZFdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgc2V0QWN0aXZlKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHB3ZFdpbmRvd0VsZW0gPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgd2luZG93TW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQubm9kZU5hbWUgIT09IFwiSU1HXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHB3ZEljb25EaXYgPSBlLnRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICBsZXQgcHdkSWNvbk9iaiA9IGdldEljb24ocGFyc2VJbnQocHdkSWNvbkRpdi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWljb25pZFwiKSkpO1xyXG5cclxuICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24ocHdkSWNvbk9iaik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggYW4gYXBwbGljYXRpb24gdXNpbmcgdGhlIG1ldGEgZGF0YSBpbiBhIGdpdmVuIGljb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxhdW5jaEFwcGxpY2F0aW9uKGljb25PYmopIHtcclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gbmV3IFdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBpY29uT2JqLmdldFdpbmRvd1NpemUoKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3dzLnB1c2gocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIGlmIChpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpID09PSBcIk1lbW9yeVwiKSB7XHJcbiAgICAgICAgICAgIGxldCBtZW1vcnkgPSBuZXcgTWVtb3J5KHtcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI3B3ZC13aW5kb3ctXCIgKyBwd2RXaW5kb3cuZ2V0SWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpY29uIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBpZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRJY29uKGlkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaWNvbnNbaV0uZ2V0SWQoKSA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpY29uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB3aW5kb3dNb3ZlRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCBwd2RXaW5kb3cgPSBnZXRBY3RpdmVXaW5kb3coKTtcclxuXHJcbiAgICAgICAgaWYgKHB3ZFdpbmRvdykge1xyXG4gICAgICAgICAgICBwd2RXaW5kb3cudXBkYXRlUG9zKGUubW92ZW1lbnRYLCBlLm1vdmVtZW50WSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgYWN0aXZlIHdpbmRvdy5cclxuICAgICAqIElmIG5vIHdpbmRvdyBpcyBhY3RpdmUgLT4gcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVXaW5kb3coKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dzW2ldLmlzQWN0aXZlKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3dzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBhbGwgdGhlIHdpbmRvd3MgYXMgaW5hY3RpdmVcclxuICAgICAqIFNldHMgdGhlIGdpdmVuIHdpbmRvdyBhcyBhY3RpdmVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2V0QWN0aXZlKHB3ZFdpbmRvdykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB3aW5kb3dzW2ldLnNldEFjdGl2ZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwd2RXaW5kb3cuc2V0QWN0aXZlKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgd2luZG93IG9iamVjdCB3aXRoIHRoZSBnaXZlbiBpZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRXaW5kb3coaWQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvd3NbaV0uZ2V0SWQoKSA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3dzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldE5ld1dpbmRvd1hQb3MoKSB7XHJcbiAgICAgICAgbmV3V2luZG93WFBvcyArPSAyMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1dpbmRvd1hQb3M7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TmV3V2luZG93WVBvcygpIHtcclxuICAgICAgICBuZXdXaW5kb3dZUG9zICs9IDIwO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3V2luZG93WVBvcztcclxuICAgIH1cclxufVxyXG5cclxuUFdELnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQV0Q7XHJcbiIsImZ1bmN0aW9uIFdpbmRvdyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLmlkID0gV2luZG93LmlkO1xyXG4gICAgV2luZG93LmlkICs9IDE7XHJcblxyXG4gICAgdGhpcy54UG9zID0gV2luZG93LnhQb3M7XHJcbiAgICBXaW5kb3cueFBvcyArPSAyMDtcclxuXHJcbiAgICB0aGlzLnlQb3MgPSBXaW5kb3cueVBvcztcclxuICAgIFdpbmRvdy55UG9zICs9IDIwO1xyXG5cclxuICAgIC8vdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIC8vdGhpcy54UG9zID0gc2V0dGluZ3MueFBvcyA/IHNldHRpbmdzLnhQb3MgOiAxMDA7XHJcblxyXG4gICAgLy90aGlzLnlQb3MgPSBzZXR0aW5ncy55UG9zID8gc2V0dGluZ3MueVBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gc2V0dGluZ3MuYWN0aXZlID8gc2V0dGluZ3MuYWN0aXZlIDogdHJ1ZTtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwibWVkaXVtXCI7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgPSBpbml0aWFsaXplQ29udGFpbmVyLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplQ29udGFpbmVyKCkge1xyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdpbmRvd2lkXCIsIHRoaXMuaWQpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwd2Qtd2luZG93LVwiICsgdGhpcy5pZCk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG5cclxuICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgICAgICBjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjXCIgKyB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LmlkID0gMDtcclxuXHJcbldpbmRvdy54UG9zID0gMjA7XHJcblxyXG5XaW5kb3cueVBvcyA9IDIwO1xyXG5cclxuV2luZG93LnByb3RvdHlwZS51cGRhdGVQb3MgPSBmdW5jdGlvbih4TW92ZW1lbnQsIHlNb3ZlbWVudCkge1xyXG4gICAgdGhpcy54UG9zICs9IHhNb3ZlbWVudDtcclxuICAgIHRoaXMueVBvcyArPSB5TW92ZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGlzIHdpbmRvdyBpcyBhY3RpdmVcclxuICovXHJcbldpbmRvdy5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZTtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5hY3RpdmUgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0taW5hY3RpdmVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWFjdGl2ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLWFjdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0taW5hY3RpdmVcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV2luZG93O1xyXG4iLCJjb25zdCBQV0QgPSByZXF1aXJlKFwiLi9QV0QuanNcIik7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAvL2xldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcclxuXHJcbiAgICBsZXQgcHdkID0gbmV3IFBXRCh7XCJjb250YWluZXJcIjogXCJib2R5XCJ9KTtcclxuXHJcbiAgICAvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChwd2QuZ2V0Q29udGFpbmVyKCkpO1xyXG59KTtcclxuIiwiZnVuY3Rpb24gQ2FyZCh2YWx1ZSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLmlzQ29tcGxldGUgPSBmYWxzZTtcblxuICAgIHRoaXMuY2FyZEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICB0aGlzLmNhcmRFbGVtLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgIHRoaXMuY2FyZEVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtZW1vcnlDYXJkXCIpO1xuICAgIHRoaXMuY2FyZEVsZW0uc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCB0aGlzLnZhbHVlKTtcblxuICAgIHRoaXMuY292ZXJJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgdGhpcy5jb3ZlckltYWdlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZnJvbnRcIik7XG4gICAgdGhpcy5jb3ZlckltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xuICAgIHRoaXMuY292ZXJJbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgXCJDb3ZlciBpbWFnZVwiKTtcblxuICAgIHRoaXMuY2FyZEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiYmFja1wiKTtcbiAgICB0aGlzLmNhcmRJbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9cIiArIHRoaXMudmFsdWVbMF0gKyBcIi5wbmdcIik7XG4gICAgdGhpcy5jYXJkSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiTWVtb3J5IGNhcmRcIik7XG5cbiAgICB0aGlzLmNhcmRFbGVtLmFwcGVuZENoaWxkKHRoaXMuY292ZXJJbWFnZSk7XG4gICAgdGhpcy5jYXJkRWxlbS5hcHBlbmRDaGlsZCh0aGlzLmNhcmRJbWFnZSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdW5pcXVlIHZhbHVlIGZvciB0aGlzIGNhcmRcbiAqIFRoZSBjYXJkIGlkZW50aWZpZXJcbiAqL1xuQ2FyZC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbn1cblxuLyoqXG4gKiBGbGlwcyB0aGUgY2FyZFxuICovXG5DYXJkLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaXNGbGlwcGVkKSB7XG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiZmxpcFwiKTtcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcImZsaXBcIik7XG5cbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5hZGQoXCJiYWNrZmxpcFwiKTtcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcImJhY2tmbGlwXCIpO1xuXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJiYWNrZmxpcFwiKTtcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcImJhY2tmbGlwXCIpO1xuXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiZmxpcFwiKTtcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcImZsaXBcIik7XG5cbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSB0cnVlO1xuICAgIH1cbn1cblxuQ2FyZC5wcm90b3R5cGUuZ2V0SXNGbGlwcGVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNGbGlwcGVkO1xufVxuXG5DYXJkLnByb3RvdHlwZS5zZXRJc0NvbXBsZXRlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB0aGlzLmlzQ29tcGxldGUgPSB2YWx1ZTtcbn1cblxuQ2FyZC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICB0aGlzLmNhcmRFbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbn1cblxuQ2FyZC5wcm90b3R5cGUuZ2V0Q2FyZEVsZW0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jYXJkRWxlbTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYXJkO1xuIiwiY29uc3QgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmQuanNcIik7XG5cbmZ1bmN0aW9uIENhcmRzKG5yT2ZDYXJkcykge1xuICAgIHRoaXMuY2FyZHMgPSBbXTtcblxuICAgIHRoaXMubnVtYmVyT2ZDYXJkcyA9IG5yT2ZDYXJkcztcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSB0aGUgY2FyZHNcbiAgICAgKi9cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG5yT2ZDYXJkcyArIDE7IGkrKykge1xuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAxKSk7XG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDIpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaHVmZmxlIHRoZSBjYXJkc1xuICAgICAqL1xuICAgIGZvciAobGV0IGkgPSB0aGlzLmNhcmRzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgbGV0IHRlbXAgPSB0aGlzLmNhcmRzW2ldO1xuICAgICAgICB0aGlzLmNhcmRzW2ldID0gdGhpcy5jYXJkc1tqXTtcbiAgICAgICAgdGhpcy5jYXJkc1tqXSA9IHRlbXA7XG4gICAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGNhcmQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVcbiAqL1xuQ2FyZHMucHJvdG90eXBlLmdldENhcmQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGxldCBjYXJkO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmNhcmRzW2ldLmdldFZhbHVlKCkgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICBjYXJkID0gdGhpcy5jYXJkc1tpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcmQ7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZyYWdtZW50IGNvbnRhaW5pbmcgdGhlIGNhcmQgZGl2cyBhbmQgaW1hZ2VzXG4gKi9cbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkc0ZyYWcgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgY2FyZHNGcmFnID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY2FyZEVsZW0gPSB0aGlzLmNhcmRzW2ldLmdldENhcmRFbGVtKCk7XG4gICAgICAgIGNhcmRzRnJhZy5hcHBlbmRDaGlsZChjYXJkRWxlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcmRzRnJhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYXJkcztcbiIsImNvbnN0IENhcmRzID0gcmVxdWlyZShcIi4vQ2FyZHMuanNcIik7XG5cbmZ1bmN0aW9uIE1lbW9yeUdhbWUoY29uZmlnKSB7XG4gICAgdGhpcy5uck9mUGFpcnMgPSBjb25maWcubnJPZlBhaXJzID8gY29uZmlnLm5yT2ZQYWlycyA6IDQ7XG5cbiAgICBsZXQgY29udGFpbmVyID0gY29uZmlnLmNvbnRhaW5lciA/IGNvbmZpZy5jb250YWluZXIgOiBcIiNjb29sXCI7XG5cbiAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRzKHRoaXMubnJPZlBhaXJzKTtcblxuICAgIHRoaXMuc2NvcmUgPSAwO1xuXG4gICAgdGhpcy5nYW1lVGltZXIgPSAwO1xuXG4gICAgdGhpcy5hdHRlbXB0cyA9IDA7XG5cbiAgICB0aGlzLmZpcnN0Q2FyZCA9IFwiXCI7XG5cbiAgICB0aGlzLnNlY29uZENhcmQgPSBcIlwiO1xuXG4gICAgdGhpcy5pc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XG5cbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbWVtb3J5V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwibWVtb3J5V3JhcHBlclwiKTtcblxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGltZ0VsZW0gPSBlLnRhcmdldDtcblxuICAgICAgICBsZXQgYUVsZW0gPSBpbWdFbGVtLm5vZGVOYW1lID09PSBcIklNR1wiID8gaW1nRWxlbS5wYXJlbnROb2RlIDogaW1nRWxlbTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBhRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIpO1xuXG4gICAgICAgIGxldCBjYXJkID0gdGhpcy5jYXJkcy5nZXRDYXJkKHZhbHVlKTtcblxuICAgICAgICBpZiAoY2FyZCkge1xuICAgICAgICAgICAgaWYgKGNhcmQuZ2V0SXNGbGlwcGVkKCkgPT09IGZhbHNlICYmIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjYXJkLmZsaXAoKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0Q2FyZCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZCA9IGNhcmQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkID0gY2FyZDtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQW5zd2VyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLm1lbW9yeVBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLm1lbW9yeVBhbmVsLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlQYW5lbFwiKTtcblxuICAgIHRoaXMubWVtb3J5Q2FyZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzXCIpO1xuICAgIHN3aXRjaCh0aGlzLm5yT2ZQYWlycykge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzLS13aWR0aC0yNDBcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB0aGlzLm1lbW9yeUNhcmRzLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkcy0td2lkdGgtMzYwXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTQ4MFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDc6XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzLS13aWR0aC02MDBcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5tZW1vcnlDYXJkcy5hcHBlbmRDaGlsZCh0aGlzLmNhcmRzLmdldENhcmRzRnJhZygpKTtcblxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5tZW1vcnlQYW5lbCk7XG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZCh0aGlzLm1lbW9yeUNhcmRzKTtcblxuICAgIGxldCBtZW1vcnlDb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xuXG4gICAgdGhpcy5nYW1lVGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdhbWVUaW1lcisrO1xuXG4gICAgICAgIHRoaXMubWVtb3J5UGFuZWwudGV4dENvbnRlbnQgPSBcIlRpbWU6IFwiICsgdGhpcy5nYW1lVGltZXIgKyBcIiwgQXR0ZW1wdHM6IFwiICsgdGhpcy5hdHRlbXB0cztcbiAgICB9LmJpbmQodGhpcyksIDEwMDApO1xufVxuXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5jaGVja0Fuc3dlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9IHRydWU7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmF0dGVtcHRzKys7XG5cbiAgICAgICAgaWYgKHRoaXMuZmlyc3RDYXJkLmdldFZhbHVlKClbMF0gPT09IHRoaXMuc2Vjb25kQ2FyZC5nZXRWYWx1ZSgpWzBdKSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZC5zZXRJc0NvbXBsZXRlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkLmFkZENsYXNzKFwibWVtb3J5Q2FyZC0tY29ycmVjdFwiKTtcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kQ2FyZC5hZGRDbGFzcyhcIm1lbW9yeUNhcmQtLWNvcnJlY3RcIik7XG5cbiAgICAgICAgICAgIHRoaXMuc2NvcmUrKztcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2NvcmUgPT09IHRoaXMubnJPZlBhaXJzKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVUaW1lckludGVydmFsKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1lbW9yeVBhbmVsLnRleHRDb250ZW50ID0gXCJZb3UgY29tcGxldGVkIHRoZSBnYW1lIGluIFwiICsgdGhpcy5nYW1lVGltZXIgKyBcIiBzZWNvbmRzIGFmdGVyIFwiICsgdGhpcy5hdHRlbXB0cyArIFwiIGF0dGVtcHRzIVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5maXJzdENhcmQuZmxpcCgpO1xuICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkLmZsaXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlyc3RDYXJkID0gXCJcIjtcbiAgICAgICAgdGhpcy5zZWNvbmRDYXJkID0gXCJcIjtcblxuICAgICAgICB0aGlzLmlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcbiAgICB9LmJpbmQodGhpcyksIDIwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWU7XG4iXX0=
