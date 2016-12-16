(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Icon(settings = {}) {
    this.id = settings.id;

    this.applicationName = settings.applicationName ? settings.applicationName : "";

    this.iconImage = settings.iconImage ? settings.iconImage : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "small";

    this.isSelected = settings.isSelected ? settings.isSelected : false;

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

        window.addEventListener("mouseup", function(e) {
            e.preventDefault();

            window.removeEventListener("mousemove", windowMoveEvent);
            /**
             * ALl windows stop dragging
             */
            for (let i = 0; i < windows.length; i++) {
                windows[i].setIsDragging(false);
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
            pwdWindow.setIsDragging(true);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvUFdELmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gSWNvbihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLmlkID0gc2V0dGluZ3MuaWQ7XHJcblxyXG4gICAgdGhpcy5hcHBsaWNhdGlvbk5hbWUgPSBzZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgPyBzZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgOiBcIlwiO1xyXG5cclxuICAgIHRoaXMuaWNvbkltYWdlID0gc2V0dGluZ3MuaWNvbkltYWdlID8gc2V0dGluZ3MuaWNvbkltYWdlIDogXCJkZWZhdWx0SWNvbi5pY29cIjtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwic21hbGxcIjtcclxuXHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSBzZXR0aW5ncy5pc1NlbGVjdGVkID8gc2V0dGluZ3MuaXNTZWxlY3RlZCA6IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWljb25cIik7XHJcblxyXG4gICAgICAgIGxldCBpY29uSW1hZ2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpY29uSW1hZ2VFbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbkltYWdlO1xyXG5cclxuICAgICAgICBsZXQgaWNvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBpY29uVGV4dC50ZXh0Q29udGVudCA9IHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkltYWdlRWxlbSk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25UZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUubGF1bmNoRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldElzU2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWQ7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtaWNvbi0tc2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0QtaWNvbi0tc2VsZWN0ZWRcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aW5kb3dTaXplO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XHJcbiIsImNvbnN0IFdpbmRvdyA9IHJlcXVpcmUoXCIuL1dpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtYWluXCIpO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dzID0gW107XHJcblxyXG4gICAgbGV0IGljb25zID0gW107XHJcblxyXG4gICAgbGV0IHB3ZFdpZHRoID0gMTMwMDtcclxuXHJcbiAgICBsZXQgcHdkSGVpZ2h0ID0gNjAwO1xyXG5cclxuICAgIGxldCB3aW5kb3dzTWFkZUNvdW50ZXIgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSBpY29uc1xyXG4gICAgICovXHJcbiAgICBpY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgXCJpZFwiOiAwLFxyXG4gICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgLy9cImljb25JbWFnZVwiOiBcIm1lbW9yeS5wbmdcIixcclxuICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIlxyXG4gICAgfSkgKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGVuZCB0aGUgaWNvbnMgdG8gdGhlIGNvbnRhaW5lclxyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25zW2ldLmdldENvbnRhaW5lcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcnMuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBNYWtlIGFsbCB3aW5kb3dzIGluYWN0aXZlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICB3aW5kb3dzW2ldLnNldElzQWN0aXZlKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEl0ZXJhdGUgdGhlIHdpbmRvd3NcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIGluc2lkZSBhIHdpbmRvd1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93c1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBNYWtlIHRoZSB3aW5kb3cgYWN0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93c1tpXS5zZXRJc0FjdGl2ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBvbiBhIHRvcCBiYXIgLT4gc3RhcnQgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgd2luZG93VG9wQmFyRWxlbSA9IHdpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvd1RvcEJhckVsZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRGVzZWxlY3QgYWxsIGljb25zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpY29uc1tpXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEl0ZXJhdGUgdGhlIGljb25zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvbiAtPiBtYXJrIGl0IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChpY29uc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpY29uc1tpXS5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBBTGwgd2luZG93cyBzdG9wIGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvd3NbaV0uc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGlmIGEgZG91YmxlY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uIC0+IGxhdW5jaCB0aGUgYXNzb2NpYXRlZCBhcHBsaWNhdGlvblxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24oaWNvbnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TmV3V2luZG93WFBvcygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TmV3V2luZG93WVBvcygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggYW4gYXBwbGljYXRpb24gdXNpbmcgdGhlIG1ldGEgZGF0YSBpbiBhIGdpdmVuIGljb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxhdW5jaEFwcGxpY2F0aW9uKGljb25PYmopIHtcclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gbmV3IFdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBpY29uT2JqLmdldFdpbmRvd1NpemUoKSxcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGljb25PYmouZ2V0QXBwbGljYXRpb25OYW1lKCksXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAoMTAwICsgMTUgKiB3aW5kb3dzTWFkZUNvdW50ZXIpLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogKDIwICsgMzAgKiB3aW5kb3dzTWFkZUNvdW50ZXIpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvd3NNYWRlQ291bnRlciArPSAxO1xyXG5cclxuICAgICAgICB3aW5kb3dzLnB1c2gocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIGlmIChpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpID09PSBcIk1lbW9yeVwiKSB7XHJcbiAgICAgICAgICAgIGxldCBtZW1vcnkgPSBuZXcgTWVtb3J5KHtcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI1BXRC13aW5kb3dfY29udGVudC1cIiArIHB3ZFdpbmRvdy5nZXRJZCgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIGFjdGl2ZSB3aW5kb3dcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gd2luZG93TW92ZUV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGaW5kIHRoZSBhY3RpdmUgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dzW2ldLmdldElzQWN0aXZlKCkpIHtcclxuICAgICAgICAgICAgICAgIHB3ZFdpbmRvdyA9IHdpbmRvd3NbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSB3aW5kb3cgaXMgZm91bmQgLT4gdXBkYXRlIGl0cyBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChwd2RXaW5kb3cpIHtcclxuICAgICAgICAgICAgcHdkV2luZG93LnNldElzRHJhZ2dpbmcodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRYID0gZS5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFkgPSBlLm1vdmVtZW50WTtcclxuXHJcbiAgICAgICAgICAgIGlmICgocHdkV2luZG93LmdldFhQb3MoKSArIG1vdmVtZW50WCArIHB3ZFdpbmRvdy5nZXRXaWR0aCgpKSA+IHB3ZFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFggPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocHdkV2luZG93LmdldFhQb3MoKSArIG1vdmVtZW50WCA8IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgocHdkV2luZG93LmdldFlQb3MoKSArIG1vdmVtZW50WSArIHB3ZFdpbmRvdy5nZXRIZWlnaHQoKSkgPiBwd2RIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwd2RXaW5kb3cuZ2V0WVBvcygpICsgbW92ZW1lbnRZIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcHdkV2luZG93LnVwZGF0ZVBvcyhtb3ZlbWVudFgsIG1vdmVtZW50WSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5QV0QucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBXRDtcclxuIiwiZnVuY3Rpb24gV2luZG93KHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuaWQgPSBXaW5kb3cuaWQ7XHJcbiAgICBXaW5kb3cuaWQgKz0gMTtcclxuLypcclxuICAgIHRoaXMueFBvcyA9IFdpbmRvdy54UG9zO1xyXG4gICAgV2luZG93LnhQb3MgKz0gMjA7XHJcblxyXG4gICAgdGhpcy55UG9zID0gV2luZG93LnlQb3M7XHJcbiAgICBXaW5kb3cueVBvcyArPSAyMDtcclxuKi9cclxuICAgIC8vdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIHRoaXMueFBvcyA9IHNldHRpbmdzLnhQb3MgPyBzZXR0aW5ncy54UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMueVBvcyA9IHNldHRpbmdzLnlQb3MgPyBzZXR0aW5ncy55UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjE2Nzc3MjE1KS50b1N0cmluZygxNik7XHJcblxyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IHNldHRpbmdzLmFjdGl2ZSA/IHNldHRpbmdzLmFjdGl2ZSA6IHRydWU7XHJcblxyXG4gICAgdGhpcy5kcmFnZ2luZyA9IHNldHRpbmdzLmRyYWdnaW5nID8gc2V0dGluZ3MuZHJhZ2dpbmcgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLm5hbWUgPSBzZXR0aW5ncy5uYW1lID8gc2V0dGluZ3MubmFtZSA6IFwiTm8gbmFtZVwiO1xyXG5cclxuICAgIHRoaXMuaWNvbiA9IHNldHRpbmdzLmljb24gPyBzZXR0aW5ncy5pY29uIDogXCJkZWZhdWx0SWNvbi5pY29cIjtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwibWVkaXVtXCI7XHJcblxyXG4gICAgc3dpdGNoICh0aGlzLndpbmRvd1NpemUpIHtcclxuICAgICAgICBjYXNlIFwic21hbGxcIjpcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IDIwMDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAzMDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IDMwMDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA0NTA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJiaWdcIjpcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IDQwMDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcbiAgICAgICAgLy9jb250YWluZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13aW5kb3dpZFwiLCB0aGlzLmlkKTtcclxuICAgICAgICAvL2NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInB3ZC13aW5kb3ctXCIgKyB0aGlzLmlkKTtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgICAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1zbWFsbFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1lZGl1bVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWJpZ1wiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcEJhckljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhckljb24uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uO1xyXG5cclxuICAgICAgICBsZXQgd2luZG93VG9wQmFyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhclNwYW4udGV4dENvbnRlbnQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB3aW5kb3dDb250ZW50LmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2NvbnRlbnRcIik7XHJcbiAgICAgICAgd2luZG93Q29udGVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIlBXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMuaWQpO1xyXG4gICAgICAgIHdpbmRvd0NvbnRlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjXCIgKyB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuXHJcbiAgICAgICAgd2luZG93VG9wQmFyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhckljb24pO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJTcGFuKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcik7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd0NvbnRlbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG5XaW5kb3cuaWQgPSAwO1xyXG5cclxuV2luZG93LnhQb3MgPSAyMDtcclxuXHJcbldpbmRvdy55UG9zID0gMjA7XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmdldFhQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnhQb3M7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0WVBvcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueVBvcztcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS51cGRhdGVQb3MgPSBmdW5jdGlvbih4TW92ZW1lbnQsIHlNb3ZlbWVudCkge1xyXG4gICAgdGhpcy54UG9zICs9IHhNb3ZlbWVudDtcclxuICAgIHRoaXMueVBvcyArPSB5TW92ZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRXaWR0aCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5oZWlnaHQ7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmdldElzRHJhZ2dpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmRyYWdnaW5nO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnNldElzRHJhZ2dpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5kcmFnZ2luZyA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWRyYWdnaW5nXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tZHJhZ2dpbmdcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGlzIHdpbmRvdyBpcyBhY3RpdmVcclxuICovXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzQWN0aXZlO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnNldElzQWN0aXZlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNBY3RpdmUgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1pbmFjdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tYWN0aXZlXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1pbmFjdGl2ZVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3c7XHJcbiIsImNvbnN0IFBXRCA9IHJlcXVpcmUoXCIuL1BXRC5qc1wiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBwd2QgPSBuZXcgUFdEKHtcImNvbnRhaW5lclwiOiBcImJvZHlcIn0pO1xyXG59KTtcclxuIiwiZnVuY3Rpb24gQ2FyZCh2YWx1ZSkge1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5jYXJkRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgIHRoaXMuY2FyZEVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtZW1vcnlDYXJkXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIHRoaXMudmFsdWUpO1xyXG5cclxuICAgIHRoaXMuY292ZXJJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICB0aGlzLmNvdmVySW1hZ2Uuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmcm9udFwiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgXCJDb3ZlciBpbWFnZVwiKTtcclxuXHJcbiAgICB0aGlzLmNhcmRJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiYmFja1wiKTtcclxuICAgIHRoaXMuY2FyZEltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL1wiICsgdGhpcy52YWx1ZVswXSArIFwiLnBuZ1wiKTtcclxuICAgIHRoaXMuY2FyZEltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIk1lbW9yeSBjYXJkXCIpO1xyXG5cclxuICAgIHRoaXMuY2FyZEVsZW0uYXBwZW5kQ2hpbGQodGhpcy5jb3ZlckltYWdlKTtcclxuICAgIHRoaXMuY2FyZEVsZW0uYXBwZW5kQ2hpbGQodGhpcy5jYXJkSW1hZ2UpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdW5pcXVlIHZhbHVlIGZvciB0aGlzIGNhcmRcclxuICogVGhlIGNhcmQgaWRlbnRpZmllclxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogRmxpcHMgdGhlIGNhcmRcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmlzRmxpcHBlZCkge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5hZGQoXCJiYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmFja2ZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcImJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcImZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcImZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuZ2V0SXNGbGlwcGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0ZsaXBwZWQ7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLnNldElzQ29tcGxldGUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gdmFsdWU7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKSB7XHJcbiAgICB0aGlzLmNhcmRFbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuZ2V0Q2FyZEVsZW0gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNhcmRFbGVtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmQ7XHJcbiIsImNvbnN0IENhcmQgPSByZXF1aXJlKFwiLi9DYXJkLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ2FyZHMobnJPZkNhcmRzKSB7XHJcbiAgICB0aGlzLmNhcmRzID0gW107XHJcblxyXG4gICAgdGhpcy5udW1iZXJPZkNhcmRzID0gbnJPZkNhcmRzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSBjYXJkc1xyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG5yT2ZDYXJkcyArIDE7IGkrKykge1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDEpKTtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaHVmZmxlIHRoZSBjYXJkc1xyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gdGhpcy5jYXJkcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICBsZXQgdGVtcCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgdGhpcy5jYXJkc1tpXSA9IHRoaXMuY2FyZHNbal07XHJcbiAgICAgICAgdGhpcy5jYXJkc1tqXSA9IHRlbXA7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBjYXJkIHdpdGggdGhlIGdpdmVuIHZhbHVlXHJcbiAqL1xyXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICBsZXQgY2FyZDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5jYXJkc1tpXS5nZXRWYWx1ZSgpID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBjYXJkID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIGZyYWdtZW50IGNvbnRhaW5pbmcgdGhlIGNhcmQgZGl2cyBhbmQgaW1hZ2VzXHJcbiAqL1xyXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZHNGcmFnID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY2FyZHNGcmFnID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY2FyZEVsZW0gPSB0aGlzLmNhcmRzW2ldLmdldENhcmRFbGVtKCk7XHJcbiAgICAgICAgY2FyZHNGcmFnLmFwcGVuZENoaWxkKGNhcmRFbGVtKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZHNGcmFnO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmRzO1xyXG4iLCJjb25zdCBDYXJkcyA9IHJlcXVpcmUoXCIuL0NhcmRzLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTWVtb3J5R2FtZShjb25maWcpIHtcclxuICAgIHRoaXMubnJPZlBhaXJzID0gY29uZmlnLm5yT2ZQYWlycyA/IGNvbmZpZy5uck9mUGFpcnMgOiA0O1xyXG5cclxuICAgIGxldCBjb250YWluZXIgPSBjb25maWcuY29udGFpbmVyID8gY29uZmlnLmNvbnRhaW5lciA6IFwiI2Nvb2xcIjtcclxuXHJcbiAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRzKHRoaXMubnJPZlBhaXJzKTtcclxuXHJcbiAgICB0aGlzLnNjb3JlID0gMDtcclxuXHJcbiAgICB0aGlzLmdhbWVUaW1lciA9IDA7XHJcblxyXG4gICAgdGhpcy5hdHRlbXB0cyA9IDA7XHJcblxyXG4gICAgdGhpcy5maXJzdENhcmQgPSBcIlwiO1xyXG5cclxuICAgIHRoaXMuc2Vjb25kQ2FyZCA9IFwiXCI7XHJcblxyXG4gICAgdGhpcy5pc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XHJcblxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwibWVtb3J5V3JhcHBlclwiKTtcclxuXHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGxldCBpbWdFbGVtID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIGxldCBhRWxlbSA9IGltZ0VsZW0ubm9kZU5hbWUgPT09IFwiSU1HXCIgPyBpbWdFbGVtLnBhcmVudE5vZGUgOiBpbWdFbGVtO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWUgPSBhRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIpO1xyXG5cclxuICAgICAgICBsZXQgY2FyZCA9IHRoaXMuY2FyZHMuZ2V0Q2FyZCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmIChjYXJkKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXJkLmdldElzRmxpcHBlZCgpID09PSBmYWxzZSAmJiB0aGlzLmlzQ2hlY2tpbmdBbnN3ZXIgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmZsaXAoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maXJzdENhcmQgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZCA9IGNhcmQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kQ2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tBbnN3ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMubWVtb3J5UGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5tZW1vcnlQYW5lbC5jbGFzc0xpc3QuYWRkKFwibWVtb3J5UGFuZWxcIik7XHJcblxyXG4gICAgdGhpcy5tZW1vcnlDYXJkcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLm1lbW9yeUNhcmRzLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkc1wiKTtcclxuICAgIHN3aXRjaCh0aGlzLm5yT2ZQYWlycykge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzLS13aWR0aC0yNDBcIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzLS13aWR0aC0zNjBcIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzLS13aWR0aC00ODBcIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICBjYXNlIDg6XHJcbiAgICAgICAgICAgIHRoaXMubWVtb3J5Q2FyZHMuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmRzLS13aWR0aC02MDBcIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5tZW1vcnlDYXJkcy5hcHBlbmRDaGlsZCh0aGlzLmNhcmRzLmdldENhcmRzRnJhZygpKTtcclxuXHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKHRoaXMubWVtb3J5UGFuZWwpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZCh0aGlzLm1lbW9yeUNhcmRzKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgIHRoaXMuZ2FtZVRpbWVySW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmdhbWVUaW1lcisrO1xyXG5cclxuICAgICAgICB0aGlzLm1lbW9yeVBhbmVsLnRleHRDb250ZW50ID0gXCJUaW1lOiBcIiArIHRoaXMuZ2FtZVRpbWVyICsgXCIsIEF0dGVtcHRzOiBcIiArIHRoaXMuYXR0ZW1wdHM7XHJcbiAgICB9LmJpbmQodGhpcyksIDEwMDApO1xyXG59XHJcblxyXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5jaGVja0Fuc3dlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5pc0NoZWNraW5nQW5zd2VyID0gdHJ1ZTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuYXR0ZW1wdHMrKztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RDYXJkLmdldFZhbHVlKClbMF0gPT09IHRoaXMuc2Vjb25kQ2FyZC5nZXRWYWx1ZSgpWzBdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kQ2FyZC5zZXRJc0NvbXBsZXRlKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5maXJzdENhcmQuYWRkQ2xhc3MoXCJtZW1vcnlDYXJkLS1jb3JyZWN0XCIpO1xyXG4gICAgICAgICAgICB0aGlzLnNlY29uZENhcmQuYWRkQ2xhc3MoXCJtZW1vcnlDYXJkLS1jb3JyZWN0XCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zY29yZSsrO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2NvcmUgPT09IHRoaXMubnJPZlBhaXJzKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ2FtZVRpbWVySW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZW1vcnlQYW5lbC50ZXh0Q29udGVudCA9IFwiWW91IGNvbXBsZXRlZCB0aGUgZ2FtZSBpbiBcIiArIHRoaXMuZ2FtZVRpbWVyICsgXCIgc2Vjb25kcyBhZnRlciBcIiArIHRoaXMuYXR0ZW1wdHMgKyBcIiBhdHRlbXB0cyFcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWNvbmRDYXJkLmZsaXAoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmlyc3RDYXJkID0gXCJcIjtcclxuICAgICAgICB0aGlzLnNlY29uZENhcmQgPSBcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLmlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuICAgIH0uYmluZCh0aGlzKSwgMjAwMCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5R2FtZTtcclxuIl19
