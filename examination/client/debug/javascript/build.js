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

    //alert(document.querySelector("html").parentNode.parentNode);

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

            setActive();

            for (let i = 0; i < windows.length; i++) {
                let windowElem = windows[i].getContainer();

                /**
                 * if a mousedown has been made inside a window -> make the window active
                 */
                if (windowElem.contains(e.target)) {
                    setActive(windows[i]);

                    /**
                     * if a mousedown has been made inside a top bar -> start dragging
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
            "windowSize": iconObj.getWindowSize(),
            "name": iconObj.getApplicationName()
        });

        windows.push(pwdWindow);

        container.appendChild(pwdWindow.getContainer());

        if (iconObj.getApplicationName() === "Memory") {
            /*
            let memory = new Memory({
                "container": "#pwd-window-" + pwdWindow.getId()
            });
            */
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
     * If a pwdWindow is given, set it as active
     */
    function setActive(pwdWindow) {
        for (let i = 0; i < windows.length; i++) {
            windows[i].setActive(false);
        }

        if (pwdWindow) {
            pwdWindow.setActive(true);
        }
    }

    /**
     * Returns the window object with the given id
     */
    /*
    function getWindowObj(id) {
        for (let i = 0; i < windows.length; i++) {
            if (windows[i].getId() === id) {
                return windows[i];
            }
        }

        return undefined;
    }
    */
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

    this.dragging = settings.dragging ? settings.dragging : false;

    this.name = settings.name ? settings.name : "No name";

    this.icon = settings.icon ? settings.icon : "defaultIcon.ico";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvUFdELmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZDtcclxuXHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA/IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5pY29uSW1hZ2UgPSBzZXR0aW5ncy5pY29uSW1hZ2UgPyBzZXR0aW5ncy5pY29uSW1hZ2UgOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJzbWFsbFwiO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1pY29uXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLWljb25pZFwiLCB0aGlzLmlkKTtcclxuXHJcbiAgICAgICAgbGV0IGljb25JbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGljb25JbWFnZUVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uSW1hZ2U7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uSW1hZ2VFbGVtKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUubGF1bmNoRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aW5kb3dTaXplO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XHJcbiIsImNvbnN0IFdpbmRvdyA9IHJlcXVpcmUoXCIuL1dpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtYWluXCIpO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgIC8vYWxlcnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcclxuXHJcbiAgICBsZXQgd2luZG93cyA9IFtdO1xyXG5cclxuICAgIGxldCBuZXdXaW5kb3dYUG9zID0gMDtcclxuXHJcbiAgICBsZXQgbmV3V2luZG93WVBvcyA9IDA7XHJcblxyXG4gICAgbGV0IGljb25zID0gW107XHJcbi8qXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICB3aW5kb3dzLnB1c2gobmV3IFdpbmRvdyh7XCJpZFwiOiBpLCBcInhQb3NcIjogZ2V0TmV3V2luZG93WFBvcygpLCBcInlQb3NcIjogZ2V0TmV3V2luZG93WVBvcygpfSkpO1xyXG4gICAgfVxyXG4qL1xyXG4vKlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93c1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICB9XHJcbiovXHJcbiAgICBpY29ucy5wdXNoKG5ldyBJY29uKHtcclxuICAgICAgICBcImlkXCI6IDAsXHJcbiAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAvL1wiaWNvbkltYWdlXCI6IFwibWVtb3J5LnBuZ1wiLFxyXG4gICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICB9KSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uc1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXJzLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBzZXRBY3RpdmUoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHdpbmRvd0VsZW0gPSB3aW5kb3dzW2ldLmdldENvbnRhaW5lcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogaWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbnNpZGUgYSB3aW5kb3cgLT4gbWFrZSB0aGUgd2luZG93IGFjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93RWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRBY3RpdmUod2luZG93c1tpXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGlmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgaW5zaWRlIGEgdG9wIGJhciAtPiBzdGFydCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3aW5kb3dUb3BCYXJFbGVtID0gd2luZG93RWxlbS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfdG9wYmFyXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93VG9wQmFyRWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgd2luZG93TW92ZUV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd3NbaV0uc2V0SXNEcmFnZ2luZyh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB3aW5kb3dNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEFMbCB3aW5kb3dzIHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgd2luZG93c1tpXS5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5ub2RlTmFtZSAhPT0gXCJJTUdcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcHdkSWNvbkRpdiA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHdkSWNvbk9iaiA9IGdldEljb24ocGFyc2VJbnQocHdkSWNvbkRpdi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWljb25pZFwiKSkpO1xyXG5cclxuICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24ocHdkSWNvbk9iaik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggYW4gYXBwbGljYXRpb24gdXNpbmcgdGhlIG1ldGEgZGF0YSBpbiBhIGdpdmVuIGljb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxhdW5jaEFwcGxpY2F0aW9uKGljb25PYmopIHtcclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gbmV3IFdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBpY29uT2JqLmdldFdpbmRvd1NpemUoKSxcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGljb25PYmouZ2V0QXBwbGljYXRpb25OYW1lKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93cy5wdXNoKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICBpZiAoaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKSA9PT0gXCJNZW1vcnlcIikge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBsZXQgbWVtb3J5ID0gbmV3IE1lbW9yeSh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNwd2Qtd2luZG93LVwiICsgcHdkV2luZG93LmdldElkKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaWNvbiBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gaWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0SWNvbihpZCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGljb25zW2ldLmdldElkKCkgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWNvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gd2luZG93TW92ZUV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gZ2V0QWN0aXZlV2luZG93KCk7XHJcblxyXG4gICAgICAgIGlmIChwd2RXaW5kb3cpIHtcclxuICAgICAgICAgICAgcHdkV2luZG93LnVwZGF0ZVBvcyhlLm1vdmVtZW50WCwgZS5tb3ZlbWVudFkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGFjdGl2ZSB3aW5kb3cuXHJcbiAgICAgKiBJZiBubyB3aW5kb3cgaXMgYWN0aXZlIC0+IHJldHVybiB1bmRlZmluZWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlV2luZG93KCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAod2luZG93c1tpXS5pc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgYWxsIHRoZSB3aW5kb3dzIGFzIGluYWN0aXZlXHJcbiAgICAgKiBJZiBhIHB3ZFdpbmRvdyBpcyBnaXZlbiwgc2V0IGl0IGFzIGFjdGl2ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRBY3RpdmUocHdkV2luZG93KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHdpbmRvd3NbaV0uc2V0QWN0aXZlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwd2RXaW5kb3cpIHtcclxuICAgICAgICAgICAgcHdkV2luZG93LnNldEFjdGl2ZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB3aW5kb3cgb2JqZWN0IHdpdGggdGhlIGdpdmVuIGlkXHJcbiAgICAgKi9cclxuICAgIC8qXHJcbiAgICBmdW5jdGlvbiBnZXRXaW5kb3dPYmooaWQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvd3NbaV0uZ2V0SWQoKSA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3dzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldE5ld1dpbmRvd1hQb3MoKSB7XHJcbiAgICAgICAgbmV3V2luZG93WFBvcyArPSAyMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1dpbmRvd1hQb3M7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TmV3V2luZG93WVBvcygpIHtcclxuICAgICAgICBuZXdXaW5kb3dZUG9zICs9IDIwO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3V2luZG93WVBvcztcclxuICAgIH1cclxufVxyXG5cclxuUFdELnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQV0Q7XHJcbiIsImZ1bmN0aW9uIFdpbmRvdyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLmlkID0gV2luZG93LmlkO1xyXG4gICAgV2luZG93LmlkICs9IDE7XHJcblxyXG4gICAgdGhpcy54UG9zID0gV2luZG93LnhQb3M7XHJcbiAgICBXaW5kb3cueFBvcyArPSAyMDtcclxuXHJcbiAgICB0aGlzLnlQb3MgPSBXaW5kb3cueVBvcztcclxuICAgIFdpbmRvdy55UG9zICs9IDIwO1xyXG5cclxuICAgIC8vdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIC8vdGhpcy54UG9zID0gc2V0dGluZ3MueFBvcyA/IHNldHRpbmdzLnhQb3MgOiAxMDA7XHJcblxyXG4gICAgLy90aGlzLnlQb3MgPSBzZXR0aW5ncy55UG9zID8gc2V0dGluZ3MueVBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gc2V0dGluZ3MuYWN0aXZlID8gc2V0dGluZ3MuYWN0aXZlIDogdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmRyYWdnaW5nID0gc2V0dGluZ3MuZHJhZ2dpbmcgPyBzZXR0aW5ncy5kcmFnZ2luZyA6IGZhbHNlO1xyXG5cclxuICAgIHRoaXMubmFtZSA9IHNldHRpbmdzLm5hbWUgPyBzZXR0aW5ncy5uYW1lIDogXCJObyBuYW1lXCI7XHJcblxyXG4gICAgdGhpcy5pY29uID0gc2V0dGluZ3MuaWNvbiA/IHNldHRpbmdzLmljb24gOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJtZWRpdW1cIjtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93XCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdpbmRvd2lkXCIsIHRoaXMuaWQpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInB3ZC13aW5kb3ctXCIgKyB0aGlzLmlkKTtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNcIiArIHRoaXMuYmFja2dyb3VuZENvbG9yO1xyXG5cclxuICAgICAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1zbWFsbFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1lZGl1bVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWJpZ1wiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuICAgICAgICB3aW5kb3dUb3BCYXIudGV4dENvbnRlbnQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB3aW5kb3dDb250ZW50LmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2NvbnRlbnRcIik7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3aW5kb3dDb250ZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LmlkID0gMDtcclxuXHJcbldpbmRvdy54UG9zID0gMjA7XHJcblxyXG5XaW5kb3cueVBvcyA9IDIwO1xyXG5cclxuV2luZG93LnByb3RvdHlwZS51cGRhdGVQb3MgPSBmdW5jdGlvbih4TW92ZW1lbnQsIHlNb3ZlbWVudCkge1xyXG4gICAgdGhpcy54UG9zICs9IHhNb3ZlbWVudDtcclxuICAgIHRoaXMueVBvcyArPSB5TW92ZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZHJhZ2dpbmc7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuc2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmRyYWdnaW5nID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tZHJhZ2dpbmdcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1kcmFnZ2luZ1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoaXMgd2luZG93IGlzIGFjdGl2ZVxyXG4gKi9cclxuV2luZG93LnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1pbmFjdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tYWN0aXZlXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1pbmFjdGl2ZVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3c7XHJcbiIsImNvbnN0IFBXRCA9IHJlcXVpcmUoXCIuL1BXRC5qc1wiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIC8vbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xyXG5cclxuICAgIGxldCBwd2QgPSBuZXcgUFdEKHtcImNvbnRhaW5lclwiOiBcImJvZHlcIn0pO1xyXG5cclxuICAgIC8vY29udGFpbmVyLmFwcGVuZENoaWxkKHB3ZC5nZXRDb250YWluZXIoKSk7XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBDYXJkKHZhbHVlKSB7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmNhcmRFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLmNhcmRFbGVtLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1lbW9yeUNhcmRcIik7XHJcbiAgICB0aGlzLmNhcmRFbGVtLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgdGhpcy52YWx1ZSk7XHJcblxyXG4gICAgdGhpcy5jb3ZlckltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZyb250XCIpO1xyXG4gICAgdGhpcy5jb3ZlckltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xyXG4gICAgdGhpcy5jb3ZlckltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkNvdmVyIGltYWdlXCIpO1xyXG5cclxuICAgIHRoaXMuY2FyZEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJiYWNrXCIpO1xyXG4gICAgdGhpcy5jYXJkSW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvXCIgKyB0aGlzLnZhbHVlWzBdICsgXCIucG5nXCIpO1xyXG4gICAgdGhpcy5jYXJkSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiTWVtb3J5IGNhcmRcIik7XHJcblxyXG4gICAgdGhpcy5jYXJkRWxlbS5hcHBlbmRDaGlsZCh0aGlzLmNvdmVySW1hZ2UpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5hcHBlbmRDaGlsZCh0aGlzLmNhcmRJbWFnZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSB1bmlxdWUgdmFsdWUgZm9yIHRoaXMgY2FyZFxyXG4gKiBUaGUgY2FyZCBpZGVudGlmaWVyXHJcbiAqL1xyXG5DYXJkLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGbGlwcyB0aGUgY2FyZFxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZmxpcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMuaXNGbGlwcGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcImJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJiYWNrZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJiYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRJc0ZsaXBwZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRmxpcHBlZDtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuc2V0SXNDb21wbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSB2YWx1ZTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcclxuICAgIHRoaXMuY2FyZEVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRDYXJkRWxlbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZEVsZW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZDtcclxuIiwiY29uc3QgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDYXJkcyhuck9mQ2FyZHMpIHtcclxuICAgIHRoaXMuY2FyZHMgPSBbXTtcclxuXHJcbiAgICB0aGlzLm51bWJlck9mQ2FyZHMgPSBuck9mQ2FyZHM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnJPZkNhcmRzICsgMTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMSkpO1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNodWZmbGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSB0aGlzLmNhcmRzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgIGxldCB0ZW1wID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2ldID0gdGhpcy5jYXJkc1tqXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2pdID0gdGVtcDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGNhcmQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIGxldCBjYXJkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmNhcmRzW2ldLmdldFZhbHVlKCkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGNhcmQgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgZnJhZ21lbnQgY29udGFpbmluZyB0aGUgY2FyZCBkaXZzIGFuZCBpbWFnZXNcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkc0ZyYWcgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjYXJkc0ZyYWcgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjYXJkRWxlbSA9IHRoaXMuY2FyZHNbaV0uZ2V0Q2FyZEVsZW0oKTtcclxuICAgICAgICBjYXJkc0ZyYWcuYXBwZW5kQ2hpbGQoY2FyZEVsZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkc0ZyYWc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZHM7XHJcbiIsImNvbnN0IENhcmRzID0gcmVxdWlyZShcIi4vQ2FyZHMuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lKGNvbmZpZykge1xyXG4gICAgdGhpcy5uck9mUGFpcnMgPSBjb25maWcubnJPZlBhaXJzID8gY29uZmlnLm5yT2ZQYWlycyA6IDQ7XHJcblxyXG4gICAgbGV0IGNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXIgPyBjb25maWcuY29udGFpbmVyIDogXCIjY29vbFwiO1xyXG5cclxuICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZHModGhpcy5uck9mUGFpcnMpO1xyXG5cclxuICAgIHRoaXMuc2NvcmUgPSAwO1xyXG5cclxuICAgIHRoaXMuZ2FtZVRpbWVyID0gMDtcclxuXHJcbiAgICB0aGlzLmF0dGVtcHRzID0gMDtcclxuXHJcbiAgICB0aGlzLmZpcnN0Q2FyZCA9IFwiXCI7XHJcblxyXG4gICAgdGhpcy5zZWNvbmRDYXJkID0gXCJcIjtcclxuXHJcbiAgICB0aGlzLmlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlXcmFwcGVyXCIpO1xyXG5cclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgbGV0IGltZ0VsZW0gPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGFFbGVtID0gaW1nRWxlbS5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGltZ0VsZW0ucGFyZW50Tm9kZSA6IGltZ0VsZW07XHJcblxyXG4gICAgICAgIGxldCB2YWx1ZSA9IGFFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIik7XHJcblxyXG4gICAgICAgIGxldCBjYXJkID0gdGhpcy5jYXJkcy5nZXRDYXJkKHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGNhcmQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuZ2V0SXNGbGlwcGVkKCkgPT09IGZhbHNlICYmIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuZmxpcCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0Q2FyZCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkID0gY2FyZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0Fuc3dlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5tZW1vcnlQYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLm1lbW9yeVBhbmVsLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlQYW5lbFwiKTtcclxuXHJcbiAgICB0aGlzLm1lbW9yeUNhcmRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzXCIpO1xyXG4gICAgc3dpdGNoKHRoaXMubnJPZlBhaXJzKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTI0MFwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTM2MFwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTQ4MFwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgdGhpcy5tZW1vcnlDYXJkcy5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZHMtLXdpZHRoLTYwMFwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1lbW9yeUNhcmRzLmFwcGVuZENoaWxkKHRoaXMuY2FyZHMuZ2V0Q2FyZHNGcmFnKCkpO1xyXG5cclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5tZW1vcnlQYW5lbCk7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKHRoaXMubWVtb3J5Q2FyZHMpO1xyXG5cclxuICAgIGxldCBtZW1vcnlDb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBtZW1vcnlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgdGhpcy5nYW1lVGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZVRpbWVyKys7XHJcblxyXG4gICAgICAgIHRoaXMubWVtb3J5UGFuZWwudGV4dENvbnRlbnQgPSBcIlRpbWU6IFwiICsgdGhpcy5nYW1lVGltZXIgKyBcIiwgQXR0ZW1wdHM6IFwiICsgdGhpcy5hdHRlbXB0cztcclxuICAgIH0uYmluZCh0aGlzKSwgMTAwMCk7XHJcbn1cclxuXHJcbk1lbW9yeUdhbWUucHJvdG90eXBlLmNoZWNrQW5zd2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmlzQ2hlY2tpbmdBbnN3ZXIgPSB0cnVlO1xyXG5cclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5hdHRlbXB0cysrO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5maXJzdENhcmQuZ2V0VmFsdWUoKVswXSA9PT0gdGhpcy5zZWNvbmRDYXJkLmdldFZhbHVlKClbMF0pIHtcclxuICAgICAgICAgICAgdGhpcy5maXJzdENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZC5hZGRDbGFzcyhcIm1lbW9yeUNhcmQtLWNvcnJlY3RcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kQ2FyZC5hZGRDbGFzcyhcIm1lbW9yeUNhcmQtLWNvcnJlY3RcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNjb3JlKys7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zY29yZSA9PT0gdGhpcy5uck9mUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lVGltZXJJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lbW9yeVBhbmVsLnRleHRDb250ZW50ID0gXCJZb3UgY29tcGxldGVkIHRoZSBnYW1lIGluIFwiICsgdGhpcy5nYW1lVGltZXIgKyBcIiBzZWNvbmRzIGFmdGVyIFwiICsgdGhpcy5hdHRlbXB0cyArIFwiIGF0dGVtcHRzIVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5maXJzdENhcmQuZmxpcCgpO1xyXG4gICAgICAgICAgICB0aGlzLnNlY29uZENhcmQuZmxpcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maXJzdENhcmQgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuc2Vjb25kQ2FyZCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHRoaXMuaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnlHYW1lO1xyXG4iXX0=
