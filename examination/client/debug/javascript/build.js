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

Entity.prototype.updatePos = function(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;

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

Entity.prototype.getIsSelected = function() {
    return this.isSelected;
}

Entity.prototype.setIsDragging = function(value) {
    this.isDragging = value;

    if (this.isDragging) {
        this.container.classList.add("dragging");
    } else {
        this.container.classList.remove("dragging");
    }
}

Entity.prototype.getIsDragging = function() {
    return this.isDragging;
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

    this.iconText        = settings.iconText ? settings.iconText : "No icon text";

    this.width           = settings.width ? settings.width : 10;

    this.height          = settings.height ? settings.height : 10;

    this.applicationName = settings.applicationName ? settings.applicationName : "";

    this.iconImage       = settings.iconImage ? settings.iconImage : "defaultIcon.ico";

    this.windowSize      = settings.windowSize ? settings.windowSize : "small";

    this.container       = initializeContainer.bind(this)();

    this.correctGridPosition();

    function initializeContainer() {
        let container = document.createElement("a");
        container.setAttribute("href", "#");
        container.classList.add("PWD-icon");
        container.style.left = this.xPos + "px";
        container.style.top = this.yPos + "px";

        let iconImageElem = document.createElement("img");
        iconImageElem.src = "./image/" + this.iconImage;

        let iconText = document.createElement("span");
        iconText.textContent = this.iconText;

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

/**
 * Icons are supposed to be aligned in a grid system.
 * This function corrects the x and y coordinates of the icon, making it align to the nearest grid
 */
Icon.prototype.correctGridPosition = function() {
    this.xPos = 10 + this.xPos - this.xPos % 100;
    this.yPos = 10 + this.yPos - this.yPos % 100;

    this.container.style.left = this.xPos + "px";
    this.container.style.top = this.yPos + "px";
}

Icon.prototype.getIconText = function() {
    return this.iconText;
}

Icon.prototype.getIconImage = function() {
    return this.iconImage;
}

Icon.prototype.getWindowSize = function() {
    return this.windowSize;
}

module.exports = Icon;

},{"./Entity.js":1}],3:[function(require,module,exports){
const Window = require("./Window.js");
const Icon = require("./Icon.js");
const Memory = require("./apps/Memory/MemoryGame.js");
const Chat = require("./apps/Chat/ChatStart.js");

function PWD(settings = {}) {

    initialize();

    /**
     * Initialize default behaviour/properties
     */
    function initialize() {
        this.container = document.createElement("main");

        document.querySelector(settings.container).appendChild(container);

        this.windows = [];

        this.icons = [];

        this.pwdWidth = 1300;

        this.pwdHeight = 800;

        this.windowsMadeCounter = 0;

        /**
         * The selected entity is the currently selected window or icon
         */
        this.selectedEntity = undefined;

        /**
         * Create the desktop icons
         */
        this.icons.push( new Icon({
            "iconText": "Memory small",
            "applicationName": "Memory",
            "xPos": 10,
            "yPos": 10,
            "iconImage": "cards.png",
            "windowSize": "small"
        }) );
        this.icons.push( new Icon({
            "iconText": "Memory medium",
            "applicationName": "Memory",
            "xPos": 10,
            "yPos": 120,
            "iconImage": "cards.png",
            "windowSize": "medium"
        }) );
        this.icons.push( new Icon({
            "iconText": "Memory big",
            "applicationName": "Memory",
            "xPos": 10,
            "yPos": 250,
            "iconImage": "cards.png",
            "windowSize": "big"
        }) );
        this.icons.push( new Icon({
            "iconText": "Chat",
            "applicationName": "Chat",
            "xPos": 10,
            "yPos": 350,
            "iconImage": "chat.png",
            "windowSize": "medium"
        }) );

        /**
         * Append the icons to the container
         */
        for (let i = 0; i < this.icons.length; i++) {
            this.container.appendChild(this.icons[i].getContainer());
        }

        /**
         * Add listeners
         */
        window.addEventListener("mousedown", mousedownEvent);

        window.addEventListener("mouseup", mouseupEvent);

        window.addEventListener("click", clickEvent);

        window.addEventListener("dblclick", dblclickEvent);
    }

    /**
     * Event functions
     */
    function mousedownEvent(e) {
        if (this.selectedEntity) {
            this.selectedEntity.setIsSelected(false);
        }

        this.selectedEntity = undefined;

        /**
         * Iterate the windows
         */
        for (let i = 0; i < this.windows.length; i++) {
            /**
             * If a mousedown has been made inside a window
             */
            if (this.windows[i].getContainer().contains(e.target)) {
                /**
                 * Mark the window as selected
                 */
                this.windows[i].setIsSelected(true);

                this.selectedEntity = windows[i];

                break;
            }
        }

        /**
         * Iterate the icons
         */
        for (let i = 0; i < this.icons.length; i++) {
            /**
             * If a mousedown has been made on an icon -> mark it as selected
             */
            if (this.icons[i].getContainer().contains(e.target)) {
                /**
                 * Mark the icon as selected
                 */
                this.icons[i].setIsSelected(true);

                this.selectedEntity = icons[i];

                break;
            }
        }

        if (selectedEntity) {
            /**
             * If a mousedown has been made on the selected entity
             */
            if (selectedEntity.getContainer().contains(e.target)) {
                /**
                 * Prevent default to avoid unwanted behaviour
                 */
                e.preventDefault();

                if (selectedEntity instanceof Icon) {
                    window.addEventListener("mousemove", entityMoveEvent);
                }

                if (selectedEntity instanceof Window) {
                    let windowTopBarElem = selectedEntity.getContainer().querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", entityMoveEvent);
                    }
                }
            }
        }
    }

    function mouseupEvent(e) {
        /**
         * If there is a selected entity -> remove the mousemove event and stop dragging
         */
        if (this.selectedEntity) {
            this.selectedEntity.setIsDragging(false);

            window.removeEventListener("mousemove", entityMoveEvent);

            /**
             * If an icon -> align the icon to the grid
             */
            if (this.selectedEntity instanceof Icon) {
                this.selectedEntity.correctGridPosition();
            }
        }

        console.log("up");
    }

    function clickEvent(e) {
        if (selectedEntity) {
            if (selectedEntity instanceof Window) {
                /**
                 * If a click has been made on the close button -> remove the window from the DOM
                 */
                let windowCloseDiv = this.selectedEntity.getContainer().querySelector(".PWD-window_close");

                if (windowCloseDiv.contains(e.target)) {
                    this.selectedEntity.close();
                    this.selectedEntity.getContainer().parentNode.removeChild(this.selectedEntity.getContainer());
                }
            }
        }
    }

    function dblclickEvent(e) {
        /**
         * Iterate the icons to see if a double click was made on an icon
         */
        for (let i = 0; i < this.icons.length; i++) {
            /**
             * if a doubleclick has been made on an icon -> launch the associated application
             */
            if (this.icons[i].getContainer().contains(e.target)) {
                launchApplication(this.icons[i]);
            }
        }
    }

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        /**
         * Create a new window to launch the application in
         */
        let pwdWindow = new Window({
            "id": windowsMadeCounter,
            "windowSize": iconObj.getWindowSize(),
            "topBarText": iconObj.getIconText(),
            "topBarIcon": iconObj.getIconImage(),
            "xPos": (100 + 15 * windowsMadeCounter),
            "yPos": (20 + 30 * windowsMadeCounter)
        });

        windowsMadeCounter += 1;

        this.windows.push(pwdWindow);

        this.container.appendChild(pwdWindow.getContainer());

        /**
         * Start the application and append it to the newly created window
         */
        let applicationObj = undefined;

        if (iconObj.getApplicationName() === "Memory") {
            applicationObj = new Memory({
                "container": "#PWD-window_content-" + pwdWindow.getId()
            });
        } else if (iconObj.getApplicationName() === "Chat") {
            applicationObj = new Chat({
                "container": "#PWD-window_content-" + pwdWindow.getId()
            });
        }

        /**
         * Every window has a referencce to its application
         */
        pwdWindow.setApplicationObj(applicationObj);
    }

    /**
     * Update the position of the selected entity
     */
    function entityMoveEvent(e) {
        /**
         * If there is an active entity -> update its position
         */
        if (this.selectedEntity) {
            this.selectedEntity.setIsDragging(true);
            /*
            let offsetX = e.clientX - selectedEntity.getContainer().offsetLeft;
            let offsetY = e.clientY - selectedEntity.getContainer().offsetTop;

            console.log(selectedEntity.getXPos() + " : " + offsetX);
            console.log(selectedEntity.getYPos() + " : " + offsetY);

            selectedEntity.updatePos(selectedEntity.getXPos() + offsetX, selectedEntity.getYPos() + offsetY);
            */

            /**
             * If mouse pointer is outside window -> do not update the position
             */
            if (e.clientX < 0 || e.clientX > this.pwdWidth || e.clientY < 0 || e.clientY > this.pwdHeight) {
                return;
            }

            let movementX = e.movementX;
            let movementY = e.movementY;

            if ((this.selectedEntity.getXPos() + movementX + this.selectedEntity.getWidth()) > this.pwdWidth) {
                movementX = 0;
            }

            if (this.selectedEntity.getXPos() + movementX < 0) {
                movementX = 0;
            }

            if ((this.selectedEntity.getYPos() + movementY + this.selectedEntity.getHeight()) > this.pwdHeight) {
                movementY = 0;
            }

            if (this.selectedEntity.getYPos() + movementY < 0) {
                movementY = 0;
            }

            this.selectedEntity.updatePos(this.selectedEntity.getXPos() + movementX, this.selectedEntity.getYPos() + movementY);
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;

},{"./Icon.js":2,"./Window.js":4,"./apps/Chat/ChatStart.js":7,"./apps/Memory/MemoryGame.js":10}],4:[function(require,module,exports){
const Entity = require("./Entity.js");

function Window(settings = {}) {
    Entity.call(this, {
        "xPos": settings.xPos,
        "yPos": settings.yPos,
        "isSelected": settings.isSelected,
        "isDragging": settings.isDragging
    });

    this.id = settings.id ? settings.id : 0;

    //this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : "#" + Math.floor(Math.random()*16777215).toString(16);
    this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : undefined;

    this.topBarText = settings.topBarText ? settings.topBarText : "No text";

    this.topBarIcon = settings.topBarIcon ? settings.topBarIcon : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "medium";

    this.applicationObj = settings.applicationObj ? settings.applicationObj : undefined;

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
        windowTopBarIcon.src = "./image/" + this.topBarIcon;

        let windowTopBarSpan = document.createElement("span");
        windowTopBarSpan.textContent = this.topBarText;

        let windowTopBarMinimize = document.createElement("div");
        windowTopBarMinimize.classList.add("PWD-window_minimize");

        let windowTopBarResize = document.createElement("div");
        windowTopBarResize.classList.add("PWD-window_resize");

        let windowCloseDiv = document.createElement("div");
        windowCloseDiv.classList.add("PWD-window_close");

        let windowContent = document.createElement("div");
        windowContent.classList.add("PWD-window_content");
        windowContent.setAttribute("id", "PWD-window_content-" + this.id);
        if (this.backgroundColor) {
            windowContent.style.backgroundColor = this.backgroundColor;
        }

        windowTopBar.appendChild(windowTopBarIcon);
        windowTopBar.appendChild(windowTopBarSpan);

        container.appendChild(windowTopBar);
        container.appendChild(windowTopBarMinimize);
        container.appendChild(windowTopBarResize);
        container.appendChild(windowCloseDiv);
        container.appendChild(windowContent);

        return container;
    }
}

/**
 * Window inherits from Entity
 */
Window.prototype = Object.create(Entity.prototype);
Window.prototype.constructor = Window;

Window.prototype.close = function() {
    this.applicationObj.close();
}

Window.prototype.setApplicationObj = function(value) {
    this.applicationObj = value;
}

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
function Chat(settings) {
    /**
     * Properties
     */
    let container = settings.container ? settings.container : "no container";

    let username = settings.username ? settings.username : "najssimon";

    this.socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");
    //socket.addEventListener("open", socketOpenEvent);
    this.socket.addEventListener("message", socketMessageEvent);

    /**
     * Elements
     */
    // Chat wrapper
    let chatWrapperDiv = document.createElement("div");
    chatWrapperDiv.classList.add("chatWrapper");

    // Messages div
    let messagesDiv = document.createElement("div");
    messagesDiv.classList.add("chatMessages");
    chatWrapperDiv.appendChild(messagesDiv);

    // Input form
    let inputDiv = document.createElement("from");
    inputDiv.classList.add("chatInput");
    chatWrapperDiv.appendChild(inputDiv);

    // Textarea in the input div
    let inputDiv_textarea = document.createElement("textarea");
    inputDiv_textarea.classList.add("chatInput_textarea");
    // fix to make textarea selectable
    inputDiv_textarea.addEventListener("mousedown", function(e) {
        e.stopPropagation();
        this.click();
    });
    inputDiv.appendChild(inputDiv_textarea);

    // Button in the input div
    let inputDiv_button = document.createElement("button");
    inputDiv_button.addEventListener("click", buttonEvent.bind(this));
    inputDiv_button.classList.add("chatInput_button");
    inputDiv_button.setAttribute("type", "button");
    inputDiv_button.textContent = "Send";
    inputDiv.appendChild(inputDiv_button);

    // Container div
    let containerDiv = document.querySelector(container);
    containerDiv.appendChild(chatWrapperDiv);

    /**
     * Functions
     */
    /*
    function socketOpenEvent(e) {
        socket.send(JSON.stringify(data));
    }
    */
    function socketMessageEvent(e) {
        let response = JSON.parse(e.data);
        console.log(response);

        let chatMessageSpan = document.createElement("span");
        chatMessageSpan.classList.add("chatMessage");

        chatMessageSpan.textContent += "[" + response.type + "] ";
        chatMessageSpan.textContent += response.username + ": ";
        chatMessageSpan.textContent += response.data;

        messagesDiv.appendChild(chatMessageSpan);

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function buttonEvent(e) {
        let value = inputDiv_textarea.value;

        if (value === "") {
            console.log("Must enter a message!");

            return;
        }

        inputDiv_textarea.value = "";

        let data = {
            "type": "message",
            "data" : value,
            "username": username,
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        }

        this.socket.send(JSON.stringify(data));
    }
}

Chat.prototype.close = function() {
    this.socket.close();
}

module.exports = Chat;

},{}],7:[function(require,module,exports){
const Chat = require("./Chat.js");

function ChatStart(settings) {
    /**
     * Properties
     */
    let container = settings.container ? settings.container : "no container";

    this.chatObj = undefined;

    /**
     * Elements
     */
    // Wrapper
    let chatWrapperDiv = document.createElement("div");
    chatWrapperDiv.classList.add("chatWrapper");

    // Chat start header
    let chatStartHeader = document.createElement("div");
    chatStartHeader.classList.add("chatStartHeader");
    chatWrapperDiv.appendChild(chatStartHeader);

    let chatStartHeaderSpan = document.createElement("span");
    chatStartHeaderSpan.textContent = "SUPERCHAT";
    chatStartHeader.appendChild(chatStartHeaderSpan);

    // Chat name input
    let chatNameInput = document.createElement("input");
    // fix to make input selectable
    chatNameInput.addEventListener("mousedown", function(e) {
        e.stopPropagation();
        this.click();
    });
    chatNameInput.setAttribute("placeholder", "Enter name!!!");
    chatNameInput.classList.add("chatStartNameInput");
    chatWrapperDiv.appendChild(chatNameInput);

    // Chat name button
    let chatNameButton = document.createElement("button");
    chatNameButton.addEventListener("click", buttonEvent.bind(this));
    chatNameButton.classList.add("chatStartNameButton");
    chatNameButton.setAttribute("type", "button");
    chatNameButton.textContent = "Start chatting!!!!!!!!";
    chatWrapperDiv.appendChild(chatNameButton);

    // Container div
    let containerDiv = document.querySelector(container);
    containerDiv.appendChild(chatWrapperDiv);

    /**
     * Functions
     */
    function buttonEvent() {
        let value = chatNameInput.value;

        if (value === "") {
            console.log("Enter a name!");
        }

        settings.username = value;

        chatWrapperDiv.parentNode.removeChild(chatWrapperDiv);

        this.chatObj = new Chat(settings);
    }
}

ChatStart.prototype.close = function() {
    if (this.chatObj) {
        this.chatObj.close();
    }
}

module.exports = ChatStart;

},{"./Chat.js":6}],8:[function(require,module,exports){
function Card(value) {
    /**
     * Properties
     */
    this.value = value;

    this.isFlipped = false;

    this.isComplete = false;

    /**
     * Elements
     */
    let cardTemplate = document.querySelector("#memoryCardTemplate");
    let cardTemplateFrag = document.importNode(cardTemplate.content, true);

    // The cardElem is the element wrapping the two images
    this.cardElem = cardTemplateFrag.querySelector(".Memory-card");
    this.cardElem.setAttribute("data-index", this.value);

    // The coverImage is the question mark above the card image
    this.coverImage = this.cardElem.querySelector(".Memory-card_back");
    this.coverImage.src = "image/" + this.value[0] + ".png";

    // The cardImage is the image of the memory card
    this.cardImage = this.cardElem.querySelector(".Memory-card_front");
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
        this.coverImage.classList.remove("Memory-card--flip");
        this.cardImage.classList.remove("Memory-card--flip");

        this.coverImage.classList.add("Memory-card--backflip");
        this.cardImage.classList.add("Memory-card--backflip");

        this.isFlipped = false;
    } else {
        this.coverImage.classList.remove("Memory-card--backflip");
        this.cardImage.classList.remove("Memory-card--backflip");

        this.coverImage.classList.add("Memory-card--flip");
        this.cardImage.classList.add("Memory-card--flip");

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

},{}],9:[function(require,module,exports){
const Card = require("./Card.js");

function Cards(nrOfCards) {
    this.cards = [];

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

},{"./Card.js":8}],10:[function(require,module,exports){
const MemoryGameBoard = require("./MemoryGameBoard.js");

function MemoryGame(settings) {
    /**
     * Properties
     */
    let container = settings.container ? settings.container : "#123";

    /**
     * Elements
     */
    // Wrapper
    let memoryWrapperTemplate = document.querySelector("#memoryWrapperTemplate");
    let memoryWrapperFrag = document.importNode(memoryWrapperTemplate.content, true);

    let memoryWrapperDiv = memoryWrapperFrag.querySelector(".Memory-wrapper");

    // Header
    let memoryHeaderTemplate = document.querySelector("#memoryHeaderTemplate");
    let memoryHeaderFrag = document.importNode(memoryHeaderTemplate.content, true);

    let memoryHeader = memoryHeaderFrag.querySelector(".memoryHeader");
    memoryWrapperDiv.appendChild(memoryHeader);

    // Pair form
    let memoryPairFormTemplate = document.querySelector("#memoryPairFormTemplate");
    let memoryPairFormFrag = document.importNode(memoryPairFormTemplate.content, true);

    let memoryPairForm = memoryPairFormFrag.querySelector("#memoryPairForm");
    memoryWrapperDiv.appendChild(memoryPairForm);

    // Radio inputs
    let memoryPairRadioTemplate = document.querySelector("#memoryPairRadioTemplate");

    for (let i = 1; i <= 8; i++) {
        let memoryPairRadioFrag = document.importNode(memoryPairRadioTemplate.content, true);

        let memoryPairLabel = memoryPairRadioFrag.querySelector(".memoryPairRadioLabel");
        let memoryPairRadio = memoryPairLabel.querySelector("input");

        memoryPairLabel.appendChild(document.createTextNode(i + " pairs"));
        // Fix to make radio inputs clickable
        memoryPairLabel.addEventListener("click", function(e) {
            e.stopPropagation();
            this.click();
        });
        memoryPairRadio.setAttribute("value", i);

        memoryPairForm.appendChild(memoryPairLabel);
    }

    // Form button
    let memoryPairFormButtonTemplate = document.querySelector("#memoryPairFormButtonTemplate");
    let memoryPairFormButtonFrag = document.importNode(memoryPairFormButtonTemplate.content, true);

    let memoryPairFormButton = memoryPairFormButtonFrag.querySelector("button");
    memoryPairFormButton.addEventListener("click", memoryPairFormButtonEvent);

    memoryPairForm.appendChild(memoryPairFormButton);

    // Container
    let memoryContainerDiv = document.querySelector(container);
    memoryContainerDiv.appendChild(memoryWrapperDiv);

    /**
     * Functions
     */
    function memoryPairFormButtonEvent() {
        let nrOfPairs = document.querySelector("#memoryPairForm input:checked").value;

        memoryWrapperDiv.parentNode.removeChild(memoryWrapperDiv);

        settings.nrOfPairs = parseInt(nrOfPairs);
        new MemoryGameBoard(settings);
    }
}

MemoryGame.prototype.close = function() {}

module.exports = MemoryGame;

},{"./MemoryGameBoard.js":11}],11:[function(require,module,exports){
const Cards = require("./Cards.js");

function MemoryGameBoard(settings) {
    /**
     * Properties
     */
    let container = settings.container ? settings.container : "#cool";

    let nrOfPairs = settings.nrOfPairs ? settings.nrOfPairs : 4;

    let cards = new Cards(nrOfPairs);

    let score = 0;

    let gameTimer = 0;

    let attempts = 0;

    let firstCard = undefined;

    let secondCard = undefined;

    let isCheckingAnswer = false;

    let gameTimerInterval = setInterval(timer, 1000);

    /**
     * ELements
     */
    // Memory wrapper
    let memoryWrapperTemplate = document.querySelector("#memoryWrapperTemplate");
    let memoryWrapperFrag = document.importNode(memoryWrapperTemplate.content, true);

    let memoryWrapperDiv = memoryWrapperFrag.querySelector(".Memory-wrapper");
    memoryWrapperDiv.addEventListener("click", memoryWrapperClickEvent);

    // Header
    let memoryHeaderTemplate = document.querySelector("#memoryHeaderTemplate");
    let memoryHeaderFrag = document.importNode(memoryHeaderTemplate.content, true);

    let memoryHeader = memoryHeaderFrag.querySelector(".memoryHeader");
    memoryWrapperDiv.appendChild(memoryHeader);

    // Memory panel
    let memoryPanelTemplate = document.querySelector("#memoryPanelTemplate");
    let memoryPanelFrag = document.importNode(memoryPanelTemplate.content, true);

    let memoryPanelDiv          = memoryPanelFrag.querySelector(".Memory-panel");
    let memoryPanelAttemptsSpan = memoryPanelFrag.querySelector("#memoryPanelAttemptsSpan");
    let memoryPanelTimeSpan     = memoryPanelFrag.querySelector("#memoryPanelTimeSpan");
    let memoryPanelMessageSpan  = memoryPanelFrag.querySelector("#memoryPanelMessageSpan");
    memoryWrapperDiv.appendChild(memoryPanelDiv);

    // Memory cards
    let memoyCardsTemplate = document.querySelector("#memoryCardsTemplate");
    let memoryCardsFrag = document.importNode(memoryCardsTemplate.content, true);

    let memoryCardsDiv = memoryCardsFrag.querySelector(".Memory-cards");
    memoryCardsDiv.appendChild(cards.getCardsFrag());
    memoryWrapperDiv.appendChild(memoryCardsDiv);

    // Memory container
    let memoryContainerDiv = document.querySelector(container);
    memoryContainerDiv.appendChild(memoryWrapperDiv);

    /**
     * Functions
     */
    function timer() {
        gameTimer += 1;

        memoryPanelAttemptsSpan.textContent = "Attempts: " + attempts;
        memoryPanelTimeSpan.textContent = "Time: " + gameTimer + " seconds";
    }

    function memoryWrapperClickEvent(e) {
        e.preventDefault();

        /**
         * If is currently checking answer -> exit function
         * (waiting for timer to finish)
         */
        if (isCheckingAnswer) {
            return;
        }

        let imgElem = e.target;

        let aElem = imgElem.nodeName === "IMG" ? imgElem.parentNode : imgElem;

        let value = aElem.getAttribute("data-index");

        let card = cards.getCard(value);

        if (card) {
            if (card.getIsFlipped() === false) {
                card.flip();

                if (firstCard === undefined) {
                    firstCard = card;
                } else {
                    secondCard = card;

                    checkAnswer();
                }
            }
        }
    }

    function checkAnswer() {
        isCheckingAnswer = true;

        attempts += 1;

        setTimeout(function() {

            isCheckingAnswer = false;

            if (firstCard.getValue()[0] === secondCard.getValue()[0]) {
                firstCard.setIsComplete(true);
                secondCard.setIsComplete(true);

                firstCard.addClass("Memory-card--correct");
                secondCard.addClass("Memory-card--correct");

                score += 1;

                /**
                 * If score is equal to maximum amount of pairs -> the game is complete
                 */
                if (score === nrOfPairs) {
                    clearInterval(gameTimerInterval);
                    memoryPanelMessageSpan.textContent = "You completed the game!";
                }
            } else {
                firstCard.flip();
                secondCard.flip();
            }

            firstCard = undefined;
            secondCard = undefined;
        }, 2000);
    }
}

module.exports = MemoryGameBoard;

},{"./Cards.js":9}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvRW50aXR5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9JY29uLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1dpbmRvdy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL0NoYXQvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9DaGF0L0NoYXRTdGFydC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L01lbW9yeUdhbWVCb2FyZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBXaW5kb3cgYW5kIGljb24gaW5oZXJpdHMgZnJvbSBlbnRpdHlcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbnRpdHkoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy54UG9zID0gc2V0dGluZ3MueFBvcyA/IHNldHRpbmdzLnhQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy55UG9zID0gc2V0dGluZ3MueVBvcyA/IHNldHRpbmdzLnlQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBzZXR0aW5ncy5pc0RyYWdnaW5nID8gc2V0dGluZ3MuaXNEcmFnZ2luZyA6IGZhbHNlO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRYUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy54UG9zO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFlQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnlQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUudXBkYXRlUG9zID0gZnVuY3Rpb24oeFBvcywgeVBvcykge1xyXG4gICAgdGhpcy54UG9zID0geFBvcztcclxuICAgIHRoaXMueVBvcyA9IHlQb3M7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnNldElzRHJhZ2dpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2luZ1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdnaW5nXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldElzRHJhZ2dpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRHJhZ2dpbmc7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pY29uVGV4dCAgICAgICAgPSBzZXR0aW5ncy5pY29uVGV4dCA/IHNldHRpbmdzLmljb25UZXh0IDogXCJObyBpY29uIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLndpZHRoICAgICAgICAgICA9IHNldHRpbmdzLndpZHRoID8gc2V0dGluZ3Mud2lkdGggOiAxMDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCAgICAgICAgICA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDEwO1xyXG5cclxuICAgIHRoaXMuYXBwbGljYXRpb25OYW1lID0gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lID8gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lIDogXCJcIjtcclxuXHJcbiAgICB0aGlzLmljb25JbWFnZSAgICAgICA9IHNldHRpbmdzLmljb25JbWFnZSA/IHNldHRpbmdzLmljb25JbWFnZSA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplICAgICAgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwic21hbGxcIjtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciAgICAgICA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1pY29uXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcblxyXG4gICAgICAgIGxldCBpY29uSW1hZ2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpY29uSW1hZ2VFbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbkltYWdlO1xyXG5cclxuICAgICAgICBsZXQgaWNvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBpY29uVGV4dC50ZXh0Q29udGVudCA9IHRoaXMuaWNvblRleHQ7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uSW1hZ2VFbGVtKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvblRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogSWNvbiBpbmhlcml0cyBmcm9tIEVudGl0eVxyXG4gKi9cclxuSWNvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVudGl0eS5wcm90b3R5cGUpO1xyXG5JY29uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEljb247XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRBcHBsaWNhdGlvbk5hbWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcGxpY2F0aW9uTmFtZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEljb25zIGFyZSBzdXBwb3NlZCB0byBiZSBhbGlnbmVkIGluIGEgZ3JpZCBzeXN0ZW0uXHJcbiAqIFRoaXMgZnVuY3Rpb24gY29ycmVjdHMgdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgb2YgdGhlIGljb24sIG1ha2luZyBpdCBhbGlnbiB0byB0aGUgbmVhcmVzdCBncmlkXHJcbiAqL1xyXG5JY29uLnByb3RvdHlwZS5jb3JyZWN0R3JpZFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnhQb3MgPSAxMCArIHRoaXMueFBvcyAtIHRoaXMueFBvcyAlIDEwMDtcclxuICAgIHRoaXMueVBvcyA9IDEwICsgdGhpcy55UG9zIC0gdGhpcy55UG9zICUgMTAwO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEljb25UZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uVGV4dDtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvbkltYWdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uSW1hZ2U7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLndpbmRvd1NpemU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcclxuIiwiY29uc3QgV2luZG93ID0gcmVxdWlyZShcIi4vV2luZG93LmpzXCIpO1xyXG5jb25zdCBJY29uID0gcmVxdWlyZShcIi4vSWNvbi5qc1wiKTtcclxuY29uc3QgTWVtb3J5ID0gcmVxdWlyZShcIi4vYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qc1wiKTtcclxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoXCIuL2FwcHMvQ2hhdC9DaGF0U3RhcnQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG5cclxuICAgIGluaXRpYWxpemUoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgZGVmYXVsdCBiZWhhdmlvdXIvcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1haW5cIik7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnB3ZFdpZHRoID0gMTMwMDtcclxuXHJcbiAgICAgICAgdGhpcy5wd2RIZWlnaHQgPSA4MDA7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93c01hZGVDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIHNlbGVjdGVkIGVudGl0eSBpcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHdpbmRvdyBvciBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIHRoZSBkZXNrdG9wIGljb25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgc21hbGxcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2FyZHMucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcInNtYWxsXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiTWVtb3J5IG1lZGl1bVwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAxMjAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2FyZHMucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBiaWdcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMjUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcImNhcmRzLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJiaWdcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJDaGF0XCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiQ2hhdFwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAzNTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2hhdC5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgICAgICB9KSApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcHBlbmQgdGhlIGljb25zIHRvIHRoZSBjb250YWluZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGQgbGlzdGVuZXJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2V1cEV2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0V2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBkYmxjbGlja0V2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtb3VzZWRvd25FdmVudChlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHkgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIHdpbmRvd3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbnNpZGUgYSB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIE1hcmsgdGhlIHdpbmRvdyBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbaV0uc2V0SXNTZWxlY3RlZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRW50aXR5ID0gd2luZG93c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgaWNvbnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvbiAtPiBtYXJrIGl0IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogTWFyayB0aGUgaWNvbiBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLmljb25zW2ldLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eSA9IGljb25zW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZWN0ZWRFbnRpdHkpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gdGhlIHNlbGVjdGVkIGVudGl0eVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBQcmV2ZW50IGRlZmF1bHQgdG8gYXZvaWQgdW53YW50ZWQgYmVoYXZpb3VyXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbnRpdHkgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZW50aXR5TW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbnRpdHkgaW5zdGFuY2VvZiBXaW5kb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgd2luZG93VG9wQmFyRWxlbSA9IHNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3dUb3BCYXJFbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb3VzZXVwRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRoZXJlIGlzIGEgc2VsZWN0ZWQgZW50aXR5IC0+IHJlbW92ZSB0aGUgbW91c2Vtb3ZlIGV2ZW50IGFuZCBzdG9wIGRyYWdnaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eS5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGVudGl0eU1vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYW4gaWNvbiAtPiBhbGlnbiB0aGUgaWNvbiB0byB0aGUgZ3JpZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRW50aXR5LmNvcnJlY3RHcmlkUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGlja0V2ZW50KGUpIHtcclxuICAgICAgICBpZiAoc2VsZWN0ZWRFbnRpdHkpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRW50aXR5IGluc3RhbmNlb2YgV2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uIC0+IHJlbW92ZSB0aGUgd2luZG93IGZyb20gdGhlIERPTVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSB0aGlzLnNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19jbG9zZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93Q2xvc2VEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkYmxjbGlja0V2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSBpY29ucyB0byBzZWUgaWYgYSBkb3VibGUgY2xpY2sgd2FzIG1hZGUgb24gYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogaWYgYSBkb3VibGVjbGljayBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb24gLT4gbGF1bmNoIHRoZSBhc3NvY2lhdGVkIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGxhdW5jaEFwcGxpY2F0aW9uKHRoaXMuaWNvbnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoIGFuIGFwcGxpY2F0aW9uIHVzaW5nIHRoZSBtZXRhIGRhdGEgaW4gYSBnaXZlbiBpY29uIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsYXVuY2hBcHBsaWNhdGlvbihpY29uT2JqKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIGEgbmV3IHdpbmRvdyB0byBsYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGluXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IG5ldyBXaW5kb3coe1xyXG4gICAgICAgICAgICBcImlkXCI6IHdpbmRvd3NNYWRlQ291bnRlcixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IGljb25PYmouZ2V0V2luZG93U2l6ZSgpLFxyXG4gICAgICAgICAgICBcInRvcEJhclRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcInRvcEJhckljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKSxcclxuICAgICAgICAgICAgXCJ4UG9zXCI6ICgxMDAgKyAxNSAqIHdpbmRvd3NNYWRlQ291bnRlciksXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAoMjAgKyAzMCAqIHdpbmRvd3NNYWRlQ291bnRlcilcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93c01hZGVDb3VudGVyICs9IDE7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93cy5wdXNoKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvbiBhbmQgYXBwZW5kIGl0IHRvIHRoZSBuZXdseSBjcmVhdGVkIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBsaWNhdGlvbk9iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKGljb25PYmouZ2V0QXBwbGljYXRpb25OYW1lKCkgPT09IFwiTWVtb3J5XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgTWVtb3J5KHtcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI1BXRC13aW5kb3dfY29udGVudC1cIiArIHB3ZFdpbmRvdy5nZXRJZCgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKSA9PT0gXCJDaGF0XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgQ2hhdCh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyBwd2RXaW5kb3cuZ2V0SWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEV2ZXJ5IHdpbmRvdyBoYXMgYSByZWZlcmVuY2NlIHRvIGl0cyBhcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB3ZFdpbmRvdy5zZXRBcHBsaWNhdGlvbk9iaihhcHBsaWNhdGlvbk9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBzZWxlY3RlZCBlbnRpdHlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZW50aXR5TW92ZUV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0aGVyZSBpcyBhbiBhY3RpdmUgZW50aXR5IC0+IHVwZGF0ZSBpdHMgcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVudGl0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRW50aXR5LnNldElzRHJhZ2dpbmcodHJ1ZSk7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gZS5jbGllbnRYIC0gc2VsZWN0ZWRFbnRpdHkuZ2V0Q29udGFpbmVyKCkub2Zmc2V0TGVmdDtcclxuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBlLmNsaWVudFkgLSBzZWxlY3RlZEVudGl0eS5nZXRDb250YWluZXIoKS5vZmZzZXRUb3A7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZEVudGl0eS5nZXRYUG9zKCkgKyBcIiA6IFwiICsgb2Zmc2V0WCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkRW50aXR5LmdldFlQb3MoKSArIFwiIDogXCIgKyBvZmZzZXRZKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGVjdGVkRW50aXR5LnVwZGF0ZVBvcyhzZWxlY3RlZEVudGl0eS5nZXRYUG9zKCkgKyBvZmZzZXRYLCBzZWxlY3RlZEVudGl0eS5nZXRZUG9zKCkgKyBvZmZzZXRZKTtcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBtb3VzZSBwb2ludGVyIGlzIG91dHNpZGUgd2luZG93IC0+IGRvIG5vdCB1cGRhdGUgdGhlIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoZS5jbGllbnRYIDwgMCB8fCBlLmNsaWVudFggPiB0aGlzLnB3ZFdpZHRoIHx8IGUuY2xpZW50WSA8IDAgfHwgZS5jbGllbnRZID4gdGhpcy5wd2RIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WCA9IGUubW92ZW1lbnRYO1xyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRZID0gZS5tb3ZlbWVudFk7XHJcblxyXG4gICAgICAgICAgICBpZiAoKHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0WFBvcygpICsgbW92ZW1lbnRYICsgdGhpcy5zZWxlY3RlZEVudGl0eS5nZXRXaWR0aCgpKSA+IHRoaXMucHdkV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5LmdldFhQb3MoKSArIG1vdmVtZW50WCA8IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgodGhpcy5zZWxlY3RlZEVudGl0eS5nZXRZUG9zKCkgKyBtb3ZlbWVudFkgKyB0aGlzLnNlbGVjdGVkRW50aXR5LmdldEhlaWdodCgpKSA+IHRoaXMucHdkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVudGl0eS5nZXRZUG9zKCkgKyBtb3ZlbWVudFkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRW50aXR5LnVwZGF0ZVBvcyh0aGlzLnNlbGVjdGVkRW50aXR5LmdldFhQb3MoKSArIG1vdmVtZW50WCwgdGhpcy5zZWxlY3RlZEVudGl0eS5nZXRZUG9zKCkgKyBtb3ZlbWVudFkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuUFdELnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQV0Q7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoXCIuL0VudGl0eS5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFdpbmRvdyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBFbnRpdHkuY2FsbCh0aGlzLCB7XHJcbiAgICAgICAgXCJ4UG9zXCI6IHNldHRpbmdzLnhQb3MsXHJcbiAgICAgICAgXCJ5UG9zXCI6IHNldHRpbmdzLnlQb3MsXHJcbiAgICAgICAgXCJpc1NlbGVjdGVkXCI6IHNldHRpbmdzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgXCJpc0RyYWdnaW5nXCI6IHNldHRpbmdzLmlzRHJhZ2dpbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZCA/IHNldHRpbmdzLmlkIDogMDtcclxuXHJcbiAgICAvL3RoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogXCIjXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMudG9wQmFyVGV4dCA9IHNldHRpbmdzLnRvcEJhclRleHQgPyBzZXR0aW5ncy50b3BCYXJUZXh0IDogXCJObyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy50b3BCYXJJY29uID0gc2V0dGluZ3MudG9wQmFySWNvbiA/IHNldHRpbmdzLnRvcEJhckljb24gOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJtZWRpdW1cIjtcclxuXHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uT2JqID0gc2V0dGluZ3MuYXBwbGljYXRpb25PYmogPyBzZXR0aW5ncy5hcHBsaWNhdGlvbk9iaiA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gMjAwO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IDMwMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIm1lZGl1bVwiOlxyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gMzAwO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IDQ1MDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IDYwMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgPSBpbml0aWFsaXplQ29udGFpbmVyLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplQ29udGFpbmVyKCkge1xyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd1wiKTtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgICAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1zbWFsbFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1lZGl1bVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWJpZ1wiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcEJhckljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhckljb24uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy50b3BCYXJJY29uO1xyXG5cclxuICAgICAgICBsZXQgd2luZG93VG9wQmFyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhclNwYW4udGV4dENvbnRlbnQgPSB0aGlzLnRvcEJhclRleHQ7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dUb3BCYXJNaW5pbWl6ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgd2luZG93VG9wQmFyTWluaW1pemUuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfbWluaW1pemVcIik7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dUb3BCYXJSZXNpemUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhclJlc2l6ZS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19yZXNpemVcIik7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dDbG9zZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgd2luZG93Q2xvc2VEaXYuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY2xvc2VcIik7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB3aW5kb3dDb250ZW50LmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2NvbnRlbnRcIik7XHJcbiAgICAgICAgd2luZG93Q29udGVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIlBXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMuaWQpO1xyXG4gICAgICAgIGlmICh0aGlzLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICB3aW5kb3dDb250ZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2luZG93VG9wQmFyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhckljb24pO1xyXG4gICAgICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJTcGFuKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcik7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhck1pbmltaXplKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyUmVzaXplKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93Q2xvc2VEaXYpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3aW5kb3dDb250ZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFdpbmRvdyBpbmhlcml0cyBmcm9tIEVudGl0eVxyXG4gKi9cclxuV2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRW50aXR5LnByb3RvdHlwZSk7XHJcbldpbmRvdy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBXaW5kb3c7XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uT2JqLmNsb3NlKCk7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuc2V0QXBwbGljYXRpb25PYmogPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5hcHBsaWNhdGlvbk9iaiA9IHZhbHVlO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3c7XHJcbiIsImNvbnN0IFBXRCA9IHJlcXVpcmUoXCIuL1BXRC5qc1wiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBwd2QgPSBuZXcgUFdEKHtcImNvbnRhaW5lclwiOiBcImJvZHlcIn0pO1xyXG59KTtcclxuIiwiZnVuY3Rpb24gQ2hhdChzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIm5vIGNvbnRhaW5lclwiO1xyXG5cclxuICAgIGxldCB1c2VybmFtZSA9IHNldHRpbmdzLnVzZXJuYW1lID8gc2V0dGluZ3MudXNlcm5hbWUgOiBcIm5hanNzaW1vblwiO1xyXG5cclxuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIpO1xyXG4gICAgLy9zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgc29ja2V0T3BlbkV2ZW50KTtcclxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHNvY2tldE1lc3NhZ2VFdmVudCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBDaGF0IHdyYXBwZXJcclxuICAgIGxldCBjaGF0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdFdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gTWVzc2FnZXMgZGl2XHJcbiAgICBsZXQgbWVzc2FnZXNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbWVzc2FnZXNEaXYuY2xhc3NMaXN0LmFkZChcImNoYXRNZXNzYWdlc1wiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lc3NhZ2VzRGl2KTtcclxuXHJcbiAgICAvLyBJbnB1dCBmb3JtXHJcbiAgICBsZXQgaW5wdXREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZnJvbVwiKTtcclxuICAgIGlucHV0RGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChpbnB1dERpdik7XHJcblxyXG4gICAgLy8gVGV4dGFyZWEgaW4gdGhlIGlucHV0IGRpdlxyXG4gICAgbGV0IGlucHV0RGl2X3RleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dF90ZXh0YXJlYVwiKTtcclxuICAgIC8vIGZpeCB0byBtYWtlIHRleHRhcmVhIHNlbGVjdGFibGVcclxuICAgIGlucHV0RGl2X3RleHRhcmVhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl90ZXh0YXJlYSk7XHJcblxyXG4gICAgLy8gQnV0dG9uIGluIHRoZSBpbnB1dCBkaXZcclxuICAgIGxldCBpbnB1dERpdl9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X2J1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLnRleHRDb250ZW50ID0gXCJTZW5kXCI7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl9idXR0b24pO1xyXG5cclxuICAgIC8vIENvbnRhaW5lciBkaXZcclxuICAgIGxldCBjb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBjb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIC8qXHJcbiAgICBmdW5jdGlvbiBzb2NrZXRPcGVuRXZlbnQoZSkge1xyXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgIH1cclxuICAgICovXHJcbiAgICBmdW5jdGlvbiBzb2NrZXRNZXNzYWdlRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGxldCBjaGF0TWVzc2FnZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4uY2xhc3NMaXN0LmFkZChcImNoYXRNZXNzYWdlXCIpO1xyXG5cclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gXCJbXCIgKyByZXNwb25zZS50eXBlICsgXCJdIFwiO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSByZXNwb25zZS51c2VybmFtZSArIFwiOiBcIjtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gcmVzcG9uc2UuZGF0YTtcclxuXHJcbiAgICAgICAgbWVzc2FnZXNEaXYuYXBwZW5kQ2hpbGQoY2hhdE1lc3NhZ2VTcGFuKTtcclxuXHJcbiAgICAgICAgbWVzc2FnZXNEaXYuc2Nyb2xsVG9wID0gbWVzc2FnZXNEaXYuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1dHRvbkV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dERpdl90ZXh0YXJlYS52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTXVzdCBlbnRlciBhIG1lc3NhZ2UhXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5wdXREaXZfdGV4dGFyZWEudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIiA6IHZhbHVlLFxyXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLFxyXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGF0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xyXG4iLCJjb25zdCBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIENoYXRTdGFydChzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIm5vIGNvbnRhaW5lclwiO1xyXG5cclxuICAgIHRoaXMuY2hhdE9iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIFdyYXBwZXJcclxuICAgIGxldCBjaGF0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdFdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gQ2hhdCBzdGFydCBoZWFkZXJcclxuICAgIGxldCBjaGF0U3RhcnRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnRIZWFkZXJcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0U3RhcnRIZWFkZXIpO1xyXG5cclxuICAgIGxldCBjaGF0U3RhcnRIZWFkZXJTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXJTcGFuLnRleHRDb250ZW50ID0gXCJTVVBFUkNIQVRcIjtcclxuICAgIGNoYXRTdGFydEhlYWRlci5hcHBlbmRDaGlsZChjaGF0U3RhcnRIZWFkZXJTcGFuKTtcclxuXHJcbiAgICAvLyBDaGF0IG5hbWUgaW5wdXRcclxuICAgIGxldCBjaGF0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgLy8gZml4IHRvIG1ha2UgaW5wdXQgc2VsZWN0YWJsZVxyXG4gICAgY2hhdE5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgIH0pO1xyXG4gICAgY2hhdE5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBcIkVudGVyIG5hbWUhISFcIik7XHJcbiAgICBjaGF0TmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnROYW1lSW5wdXRcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0TmFtZUlucHV0KTtcclxuXHJcbiAgICAvLyBDaGF0IG5hbWUgYnV0dG9uXHJcbiAgICBsZXQgY2hhdE5hbWVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJ1dHRvbkV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydE5hbWVCdXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24udGV4dENvbnRlbnQgPSBcIlN0YXJ0IGNoYXR0aW5nISEhISEhISFcIjtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXROYW1lQnV0dG9uKTtcclxuXHJcbiAgICAvLyBDb250YWluZXIgZGl2XHJcbiAgICBsZXQgY29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBidXR0b25FdmVudCgpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBjaGF0TmFtZUlucHV0LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbnRlciBhIG5hbWUhXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0dGluZ3MudXNlcm5hbWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgY2hhdFdyYXBwZXJEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhdE9iaiA9IG5ldyBDaGF0KHNldHRpbmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuQ2hhdFN0YXJ0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMuY2hhdE9iaikge1xyXG4gICAgICAgIHRoaXMuY2hhdE9iai5jbG9zZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXRTdGFydDtcclxuIiwiZnVuY3Rpb24gQ2FyZCh2YWx1ZSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICB0aGlzLmlzRmxpcHBlZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuaXNDb21wbGV0ZSA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgbGV0IGNhcmRUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q2FyZFRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IGNhcmRUZW1wbGF0ZUZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKGNhcmRUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICAvLyBUaGUgY2FyZEVsZW0gaXMgdGhlIGVsZW1lbnQgd3JhcHBpbmcgdGhlIHR3byBpbWFnZXNcclxuICAgIHRoaXMuY2FyZEVsZW0gPSBjYXJkVGVtcGxhdGVGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRcIik7XHJcbiAgICB0aGlzLmNhcmRFbGVtLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgdGhpcy52YWx1ZSk7XHJcblxyXG4gICAgLy8gVGhlIGNvdmVySW1hZ2UgaXMgdGhlIHF1ZXN0aW9uIG1hcmsgYWJvdmUgdGhlIGNhcmQgaW1hZ2VcclxuICAgIHRoaXMuY292ZXJJbWFnZSA9IHRoaXMuY2FyZEVsZW0ucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktY2FyZF9iYWNrXCIpO1xyXG4gICAgdGhpcy5jb3ZlckltYWdlLnNyYyA9IFwiaW1hZ2UvXCIgKyB0aGlzLnZhbHVlWzBdICsgXCIucG5nXCI7XHJcblxyXG4gICAgLy8gVGhlIGNhcmRJbWFnZSBpcyB0aGUgaW1hZ2Ugb2YgdGhlIG1lbW9yeSBjYXJkXHJcbiAgICB0aGlzLmNhcmRJbWFnZSA9IHRoaXMuY2FyZEVsZW0ucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktY2FyZF9mcm9udFwiKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHVuaXF1ZSB2YWx1ZSBmb3IgdGhpcyBjYXJkXHJcbiAqIFRoZSBjYXJkIGlkZW50aWZpZXJcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZsaXBzIHRoZSBjYXJkXHJcbiAqL1xyXG5DYXJkLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5pc0ZsaXBwZWQpIHtcclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tYmFja2ZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJNZW1vcnktY2FyZC0tYmFja2ZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuZ2V0SXNGbGlwcGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0ZsaXBwZWQ7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLnNldElzQ29tcGxldGUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gdmFsdWU7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKSB7XHJcbiAgICB0aGlzLmNhcmRFbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuZ2V0Q2FyZEVsZW0gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNhcmRFbGVtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmQ7XHJcbiIsImNvbnN0IENhcmQgPSByZXF1aXJlKFwiLi9DYXJkLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ2FyZHMobnJPZkNhcmRzKSB7XHJcbiAgICB0aGlzLmNhcmRzID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnJPZkNhcmRzICsgMTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMSkpO1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNodWZmbGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSB0aGlzLmNhcmRzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgIGxldCB0ZW1wID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2ldID0gdGhpcy5jYXJkc1tqXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2pdID0gdGVtcDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGNhcmQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIGxldCBjYXJkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmNhcmRzW2ldLmdldFZhbHVlKCkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGNhcmQgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgZnJhZ21lbnQgY29udGFpbmluZyB0aGUgY2FyZCBkaXZzIGFuZCBpbWFnZXNcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkc0ZyYWcgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjYXJkc0ZyYWcgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjYXJkRWxlbSA9IHRoaXMuY2FyZHNbaV0uZ2V0Q2FyZEVsZW0oKTtcclxuICAgICAgICBjYXJkc0ZyYWcuYXBwZW5kQ2hpbGQoY2FyZEVsZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkc0ZyYWc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZHM7XHJcbiIsImNvbnN0IE1lbW9yeUdhbWVCb2FyZCA9IHJlcXVpcmUoXCIuL01lbW9yeUdhbWVCb2FyZC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIE1lbW9yeUdhbWUoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCIjMTIzXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBXcmFwcGVyXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlXcmFwcGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVdyYXBwZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IG1lbW9yeVdyYXBwZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LXdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gSGVhZGVyXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUhlYWRlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUhlYWRlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUhlYWRlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlIZWFkZXIgPSBtZW1vcnlIZWFkZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5SGVhZGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG5cclxuICAgIC8vIFBhaXIgZm9ybVxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJGb3JtVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyRm9ybVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybSA9IG1lbW9yeVBhaXJGb3JtRnJhZy5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJGb3JtXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlQYWlyRm9ybSk7XHJcblxyXG4gICAgLy8gUmFkaW8gaW5wdXRzXHJcbiAgICBsZXQgbWVtb3J5UGFpclJhZGlvVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJSYWRpb1RlbXBsYXRlXCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDg7IGkrKykge1xyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyUmFkaW9GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJMYWJlbCA9IG1lbW9yeVBhaXJSYWRpb0ZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlQYWlyUmFkaW9MYWJlbFwiKTtcclxuICAgICAgICBsZXQgbWVtb3J5UGFpclJhZGlvID0gbWVtb3J5UGFpckxhYmVsLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFpckxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGkgKyBcIiBwYWlyc1wiKSk7XHJcbiAgICAgICAgLy8gRml4IHRvIG1ha2UgcmFkaW8gaW5wdXRzIGNsaWNrYWJsZVxyXG4gICAgICAgIG1lbW9yeVBhaXJMYWJlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWVtb3J5UGFpclJhZGlvLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGkpO1xyXG5cclxuICAgICAgICBtZW1vcnlQYWlyRm9ybS5hcHBlbmRDaGlsZChtZW1vcnlQYWlyTGFiZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZvcm0gYnV0dG9uXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvbkZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uID0gbWVtb3J5UGFpckZvcm1CdXR0b25GcmFnLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XHJcbiAgICBtZW1vcnlQYWlyRm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWVtb3J5UGFpckZvcm1CdXR0b25FdmVudCk7XHJcblxyXG4gICAgbWVtb3J5UGFpckZvcm0uYXBwZW5kQ2hpbGQobWVtb3J5UGFpckZvcm1CdXR0b24pO1xyXG5cclxuICAgIC8vIENvbnRhaW5lclxyXG4gICAgbGV0IG1lbW9yeUNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeUNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChtZW1vcnlXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtZW1vcnlQYWlyRm9ybUJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgIGxldCBuck9mUGFpcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJGb3JtIGlucHV0OmNoZWNrZWRcIikudmFsdWU7XHJcblxyXG4gICAgICAgIG1lbW9yeVdyYXBwZXJEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChtZW1vcnlXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAgICAgc2V0dGluZ3MubnJPZlBhaXJzID0gcGFyc2VJbnQobnJPZlBhaXJzKTtcclxuICAgICAgICBuZXcgTWVtb3J5R2FtZUJvYXJkKHNldHRpbmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuTWVtb3J5R2FtZS5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHt9XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWU7XHJcbiIsImNvbnN0IENhcmRzID0gcmVxdWlyZShcIi4vQ2FyZHMuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCIjY29vbFwiO1xyXG5cclxuICAgIGxldCBuck9mUGFpcnMgPSBzZXR0aW5ncy5uck9mUGFpcnMgPyBzZXR0aW5ncy5uck9mUGFpcnMgOiA0O1xyXG5cclxuICAgIGxldCBjYXJkcyA9IG5ldyBDYXJkcyhuck9mUGFpcnMpO1xyXG5cclxuICAgIGxldCBzY29yZSA9IDA7XHJcblxyXG4gICAgbGV0IGdhbWVUaW1lciA9IDA7XHJcblxyXG4gICAgbGV0IGF0dGVtcHRzID0gMDtcclxuXHJcbiAgICBsZXQgZmlyc3RDYXJkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGxldCBzZWNvbmRDYXJkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGxldCBpc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XHJcblxyXG4gICAgbGV0IGdhbWVUaW1lckludGVydmFsID0gc2V0SW50ZXJ2YWwodGltZXIsIDEwMDApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRUxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gTWVtb3J5IHdyYXBwZXJcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVdyYXBwZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5V3JhcHBlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gbWVtb3J5V3JhcHBlckZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktd3JhcHBlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1lbW9yeVdyYXBwZXJDbGlja0V2ZW50KTtcclxuXHJcbiAgICAvLyBIZWFkZXJcclxuICAgIGxldCBtZW1vcnlIZWFkZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5SGVhZGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5SGVhZGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUhlYWRlciA9IG1lbW9yeUhlYWRlckZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlIZWFkZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUhlYWRlcik7XHJcblxyXG4gICAgLy8gTWVtb3J5IHBhbmVsXHJcbiAgICBsZXQgbWVtb3J5UGFuZWxUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbEZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhbmVsVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhbmVsRGl2ICAgICAgICAgID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LXBhbmVsXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW5cIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxUaW1lU3BhbiAgICAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbFRpbWVTcGFuXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsTWVzc2FnZVNwYW4gID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxNZXNzYWdlU3BhblwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5UGFuZWxEaXYpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBjYXJkc1xyXG4gICAgbGV0IG1lbW95Q2FyZHNUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q2FyZHNUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlDYXJkc0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUNhcmRzVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUNhcmRzRGl2ID0gbWVtb3J5Q2FyZHNGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRzXCIpO1xyXG4gICAgbWVtb3J5Q2FyZHNEaXYuYXBwZW5kQ2hpbGQoY2FyZHMuZ2V0Q2FyZHNGcmFnKCkpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlDYXJkc0Rpdik7XHJcblxyXG4gICAgLy8gTWVtb3J5IGNvbnRhaW5lclxyXG4gICAgbGV0IG1lbW9yeUNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeUNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChtZW1vcnlXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0aW1lcigpIHtcclxuICAgICAgICBnYW1lVGltZXIgKz0gMTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW4udGV4dENvbnRlbnQgPSBcIkF0dGVtcHRzOiBcIiArIGF0dGVtcHRzO1xyXG4gICAgICAgIG1lbW9yeVBhbmVsVGltZVNwYW4udGV4dENvbnRlbnQgPSBcIlRpbWU6IFwiICsgZ2FtZVRpbWVyICsgXCIgc2Vjb25kc1wiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVdyYXBwZXJDbGlja0V2ZW50KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGlzIGN1cnJlbnRseSBjaGVja2luZyBhbnN3ZXIgLT4gZXhpdCBmdW5jdGlvblxyXG4gICAgICAgICAqICh3YWl0aW5nIGZvciB0aW1lciB0byBmaW5pc2gpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKGlzQ2hlY2tpbmdBbnN3ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGltZ0VsZW0gPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGFFbGVtID0gaW1nRWxlbS5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGltZ0VsZW0ucGFyZW50Tm9kZSA6IGltZ0VsZW07XHJcblxyXG4gICAgICAgIGxldCB2YWx1ZSA9IGFFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIik7XHJcblxyXG4gICAgICAgIGxldCBjYXJkID0gY2FyZHMuZ2V0Q2FyZCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmIChjYXJkKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXJkLmdldElzRmxpcHBlZCgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY2FyZC5mbGlwKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0Q2FyZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RDYXJkID0gY2FyZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kQ2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQW5zd2VyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tBbnN3ZXIoKSB7XHJcbiAgICAgICAgaXNDaGVja2luZ0Fuc3dlciA9IHRydWU7XHJcblxyXG4gICAgICAgIGF0dGVtcHRzICs9IDE7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlyc3RDYXJkLmdldFZhbHVlKClbMF0gPT09IHNlY29uZENhcmQuZ2V0VmFsdWUoKVswXSkge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLmFkZENsYXNzKFwiTWVtb3J5LWNhcmQtLWNvcnJlY3RcIik7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLmFkZENsYXNzKFwiTWVtb3J5LWNhcmQtLWNvcnJlY3RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcmUgKz0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIHNjb3JlIGlzIGVxdWFsIHRvIG1heGltdW0gYW1vdW50IG9mIHBhaXJzIC0+IHRoZSBnYW1lIGlzIGNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChzY29yZSA9PT0gbnJPZlBhaXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChnYW1lVGltZXJJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5UGFuZWxNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCA9IFwiWW91IGNvbXBsZXRlZCB0aGUgZ2FtZSFcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5mbGlwKCk7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlyc3RDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBzZWNvbmRDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWVCb2FyZDtcclxuIl19
