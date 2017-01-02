(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Window and icon inherits from entity
 */

function Entity(settings = {}) {
    this.width = settings.width ? settings.width : 100;

    this.height = settings.height ? settings.height : 100;

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
const Panel = require("./Panel.js");
const Memory = require("./apps/Memory/MemoryGame.js");
const Chat = require("./apps/Chat/ChatStart.js");

function PWD(settings = {}) {

    initialize();

    /**
     * Initialize default behaviour/properties
     */
    function initialize() {
        /**
         * Elements
         */
        this.container = document.createElement("main");

        this.bottomBar = document.createElement("div");
        this.bottomBar.classList.add("PWD-bottomBar");

        this.container.appendChild(this.bottomBar);

        document.querySelector(settings.container).appendChild(this.container);

        /**
         * Properties
         */
        this.windows = [];

        this.panels = [];

        this.icons = [];

        this.applications = [];

        this.pwdWidth = 1300;

        this.pwdHeight = 700;

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
        /**
         * For every mousedown event we will attempt to find a new selected entity
         */
        findSelectedEntity(e.target);

        updateBottomBar();

        if (this.selectedEntity) {
            if (this.selectedEntity instanceof Icon) {
                window.addEventListener("mousemove", entityMoveEvent);

                e.preventDefault();
            }

            if (this.selectedEntity instanceof Window) {
                /**
                 * Windows should only be draggable by the topbar
                 */
                let windowTopBarElem = this.selectedEntity.getContainer().querySelector(".PWD-window_topbar");

                if (windowTopBarElem.contains(e.target)) {
                    window.addEventListener("mousemove", entityMoveEvent);

                    e.preventDefault();
                }
            }
        }
    }

    function mouseupEvent(e) {
        if (this.selectedEntity) {
            /**
             * If the entity is dragging -> stop dragging
             */
            //if (this.selectedEntity.getIsDragging()) {
                this.selectedEntity.setIsDragging(false);

                window.removeEventListener("mousemove", entityMoveEvent);
            //}

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
        if (this.selectedEntity) {
            if (this.selectedEntity instanceof Window) {
                let windowCloseDiv = this.selectedEntity.getContainer().querySelector(".PWD-window_close");

                /**
                 * If a click has been made on the close button
                 */
                if (windowCloseDiv.contains(e.target)) {
                    let index = this.windows.indexOf(this.selectedEntity);

                    /**
                     * Call the close functionn implemented by every application
                     */
                    this.applications[index].close();

                    /**
                     * Remove the window from the DOM
                     */
                    this.windows[index].getContainer().parentNode.removeChild(this.selectedEntity.getContainer());

                    /**
                     * Remove the window, panel and application from their respective arrays
                     */
                    this.windows[index].setIsSelected(false);
                    this.panels[index].setIsSelected(false);

                    this.windows.splice(index, 1);
                    this.panels.splice(index, 1);
                    this.applications.splice(index, 1);

                    this.selectedEntity = undefined;

                    return;
                }

                let windowResizeDiv = this.selectedEntity.getContainer().querySelector(".PWD-window_resize");

                /**
                 * If a click has been made on the resize button -> resize the window
                 */
                if (windowResizeDiv.contains(e.target)) {
                    this.selectedEntity.resize();

                    return;
                }

                let windowMinimizeDiv = this.selectedEntity.getContainer().querySelector(".PWD-window_minimize");

                /**
                 * If a click has been made on the minimize button
                 */
                if (windowMinimizeDiv.contains(e.target)) {
                    this.selectedEntity.setMinimized(true);

                    this.selectedEntity.setIsSelected(false);

                    let index = windows.indexOf(this.selectedEntity);

                    this.panels[index].setIsSelected(false);

                    return;
                }
            }
        }
    }

    function dblclickEvent(e) {
        if (this.selectedEntity) {
            /**
             * if a doubleclick has been made on an icon -> launch the associated application
             */
            if (this.selectedEntity instanceof Icon) {
                launchApplication(this.selectedEntity);
            }
        }
    }

    function updateBottomBar() {

    }

    /**
     * Set the selected entity if the provided target exists inside a entity (window or icon)
     */
    function findSelectedEntity(target) {
        /**
         * If there is a selected entity -> deselect and set as undefined
         */
        if (this.selectedEntity) {
            if (this.selectedEntity instanceof Window) {
                let index = windows.indexOf(this.selectedEntity);

                this.windows[index].setIsSelected(false);

                this.panels[index].setIsSelected(false);
            }

            if (this.selectedEntity instanceof Icon) {
                this.selectedEntity.setIsSelected(false);
            }

            this.selectedEntity = undefined;
        }

        /**
         * We will now attempt to find the selected entity, iterating the windows and icons
         */

        /**
         * Iterate the windows
         */
        for (let i = 0; i < this.windows.length; i++) {
            /**
             * If a mousedown has been made in a window -> mark the window as selected
             */
            if (this.windows[i].getContainer().contains(target)) {
                this.windows[i].setIsSelected(true);

                this.selectedEntity = windows[i];

                this.panels[i].setIsSelected(true);

                break;
            }
        }

        /**
         * Iterate the icons
         */
        for (let i = 0; i < this.icons.length; i++) {
            /**
             * If a mousedown has been made on an icon -> mark the icon as selected
             */
            if (this.icons[i].getContainer().contains(target)) {

                this.icons[i].setIsSelected(true);

                this.selectedEntity = icons[i];

                break;
            }
        }
    }

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let id = this.windows.length;

        /**
         * Create a new window to launch the application in
         */
        let pwdWindow = new Window({
            "id": this.windows.length,
            "windowSize": iconObj.getWindowSize(),
            "topBarText": iconObj.getIconText(),
            "topBarIcon": iconObj.getIconImage(),
            "xPos": (100 + 15 * id),
            "yPos": (20 + 30 * id)
        });

        //windowsMadeCounter += 1;

        this.windows.push(pwdWindow);

        this.container.appendChild(pwdWindow.getContainer());

        /**
         * For every window there is also a panel in the bottom bar
         */
        let pwdPanel = new Panel({
            "text": iconObj.getIconText(),
            "icon": iconObj.getIconImage()
        });

        this.panels.push(pwdPanel);

        this.bottomBar.appendChild(pwdPanel.getContainer());

        /**
         * Start the application and append it to the newly created window
         */
        let applicationObj = undefined;

        if (iconObj.getApplicationName() === "Memory") {
            applicationObj = new Memory({
                "container": "#PWD-window_content-" + id
            });
        } else if (iconObj.getApplicationName() === "Chat") {
            applicationObj = new Chat({
                "container": "#PWD-window_content-" + id
            });
        }

        this.applications.push(applicationObj);
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

            if (!this.selectedEntity.getContainer().querySelector(".PWD-window_topbar").contains(e.target)) {
                return;
            }

            /**
             * If mouse pointer is outside window -> do not update the position
             */
            if (e.clientX < 0 || e.clientX > this.pwdWidth || e.clientY < 0 || e.clientY > this.pwdHeight) {
                return;
            }

            let movementX = e.movementX;
            let movementY = e.movementY;

            if ((this.selectedEntity.getXPos() + movementX + this.selectedEntity.getWidth()) > this.pwdWidth && movementX > 0) {
                movementX = 0;
            }

            if (this.selectedEntity.getXPos() + movementX < 0) {
                movementX = 0;
            }

            if ((this.selectedEntity.getYPos() + movementY + this.selectedEntity.getHeight()) > this.pwdHeight && movementY > 0) {
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

},{"./Icon.js":2,"./Panel.js":4,"./Window.js":5,"./apps/Chat/ChatStart.js":8,"./apps/Memory/MemoryGame.js":11}],4:[function(require,module,exports){
function Panel(settings = {}) {
    /**
     * Properties
     */
    this.text = settings.text ? settings.text : "no text";

    this.icon = settings.icon ? settings.icon : undefined;

    this.isSelected = settings.isSelected ? settings.isSelected : false;

    /**
     * Elements
     */
    this.container = document.createElement("div");
    this.container.classList.add("PWD-bottomBar_panel");

    this.container.textContent = this.text;
}

Panel.prototype.setIsSelected = function(value) {
    this.isSelected = value;

    if (this.isSelected) {
        this.container.classList.add("selected");
    } else {
        this.container.classList.remove("selected");
    }
}

Panel.prototype.getContainer = function() {
    return this.container;
}

module.exports = Panel;

},{}],5:[function(require,module,exports){
const Entity = require("./Entity.js");

function Window(settings = {}) {
    /**
     * Properties
     */
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

    /**
     * Elements
     */
    this.container = document.createElement("div");
    this.container.classList.add("PWD-window");
    this.container.style.left = this.xPos + "px";
    this.container.style.top = this.yPos + "px";

    let windowTopBar = document.createElement("div");
    windowTopBar.classList.add("PWD-window_topbar");

    let windowTopBarIcon = document.createElement("img");
    windowTopBarIcon.src = "./image/" + this.topBarIcon;
    windowTopBarIcon.alt = "Top bar icon";

    let windowTopBarSpan = document.createElement("span");
    windowTopBarSpan.textContent = this.topBarText;

    let windowMinimizeDiv = document.createElement("div");
    windowMinimizeDiv.classList.add("PWD-window_minimize");
    windowMinimizeDiv.classList.add("ion-minus-round");

    this.windowResizeDiv = document.createElement("div");
    this.windowResizeDiv.classList.add("PWD-window_resize");

    let windowCloseDiv = document.createElement("div");
    windowCloseDiv.classList.add("PWD-window_close");
    windowCloseDiv.classList.add("ion-close-round");

    let windowContent = document.createElement("div");
    windowContent.classList.add("PWD-window_content");
    windowContent.setAttribute("id", "PWD-window_content-" + this.id);
    if (this.backgroundColor) {
        windowContent.style.backgroundColor = this.backgroundColor;
    }

    let windowTopBarWrapper = document.createElement("div");
    windowTopBarWrapper.classList.add("PWD-window_topbar_wrapper");

    windowTopBar.appendChild(windowTopBarIcon);
    windowTopBar.appendChild(windowTopBarSpan);

    windowTopBarWrapper.appendChild(windowTopBar);
    windowTopBarWrapper.appendChild(windowMinimizeDiv);
    windowTopBarWrapper.appendChild(this.windowResizeDiv);
    windowTopBarWrapper.appendChild(windowCloseDiv);

    this.container.appendChild(windowTopBarWrapper);
    this.container.appendChild(windowContent);

    this.update = function() {
        /**
         * Remove all classes
         */
        this.windowResizeDiv.classList.remove("ion-arrow-expand");
        this.windowResizeDiv.classList.remove("ion-arrow-shrink");

        switch (this.windowSize) {
            case "small":
                this.width = 200;
                this.height = 300;
                this.windowResizeDiv.classList.add("ion-arrow-expand");
                break;
            case "medium":
                this.width = 300;
                this.height = 450;
                this.windowResizeDiv.classList.add("ion-arrow-expand");
                break;
            case "big":
                this.width = 400;
                this.height = 600;
                this.windowResizeDiv.classList.add("ion-arrow-shrink");
                break;
        }

        this.container.classList.add("PWD-window--" + this.windowSize);
    }

    this.update();
}

/**
 * Window inherits from Entity
 */
Window.prototype = Object.create(Entity.prototype);
Window.prototype.constructor = Window;

Window.prototype.setMinimized = function(value) {
    this.minimized = value;

    if (this.minimized) {
        this.container.classList.add("PWD-window--invisible");
    } else {
        this.container.classList.remove("PWD-window--invisible");
    }
}

Window.prototype.resize = function() {
    this.container.classList.remove("PWD-window--" + this.windowSize);

    switch(this.windowSize) {
        case "small":
            this.windowSize = "medium";
            break;
        case "medium":
            this.windowSize = "big";
            break;
        case "big":
            this.windowSize = "small";
            break;
    }

    this.update();
}

Window.prototype.close = function() {
    this.applicationObj.close();
}

Window.prototype.getId = function() {
    return this.id;
}

module.exports = Window;

},{"./Entity.js":1}],6:[function(require,module,exports){
const PWD = require("./PWD.js");

window.addEventListener("load", function() {
    let pwd = new PWD({"container": "body"});
});

},{"./PWD.js":3}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./Chat.js":7}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./Card.js":9}],11:[function(require,module,exports){
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

},{"./MemoryGameBoard.js":12}],12:[function(require,module,exports){
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

},{"./Cards.js":10}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvRW50aXR5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9JY29uLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9DaGF0L0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0U3RhcnQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L0NhcmQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L0NhcmRzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9NZW1vcnlHYW1lLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9NZW1vcnlHYW1lQm9hcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBXaW5kb3cgYW5kIGljb24gaW5oZXJpdHMgZnJvbSBlbnRpdHlcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbnRpdHkoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy53aWR0aCA9IHNldHRpbmdzLndpZHRoID8gc2V0dGluZ3Mud2lkdGggOiAxMDA7XHJcblxyXG4gICAgdGhpcy5oZWlnaHQgPSBzZXR0aW5ncy5oZWlnaHQgPyBzZXR0aW5ncy5oZWlnaHQgOiAxMDA7XHJcblxyXG4gICAgdGhpcy54UG9zID0gc2V0dGluZ3MueFBvcyA/IHNldHRpbmdzLnhQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy55UG9zID0gc2V0dGluZ3MueVBvcyA/IHNldHRpbmdzLnlQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBzZXR0aW5ncy5pc0RyYWdnaW5nID8gc2V0dGluZ3MuaXNEcmFnZ2luZyA6IGZhbHNlO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRYUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy54UG9zO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFlQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnlQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUudXBkYXRlUG9zID0gZnVuY3Rpb24oeFBvcywgeVBvcykge1xyXG4gICAgdGhpcy54UG9zID0geFBvcztcclxuICAgIHRoaXMueVBvcyA9IHlQb3M7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnNldElzRHJhZ2dpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2luZ1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdnaW5nXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldElzRHJhZ2dpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRHJhZ2dpbmc7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pY29uVGV4dCAgICAgICAgPSBzZXR0aW5ncy5pY29uVGV4dCA/IHNldHRpbmdzLmljb25UZXh0IDogXCJObyBpY29uIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLndpZHRoICAgICAgICAgICA9IHNldHRpbmdzLndpZHRoID8gc2V0dGluZ3Mud2lkdGggOiAxMDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCAgICAgICAgICA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDEwO1xyXG5cclxuICAgIHRoaXMuYXBwbGljYXRpb25OYW1lID0gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lID8gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lIDogXCJcIjtcclxuXHJcbiAgICB0aGlzLmljb25JbWFnZSAgICAgICA9IHNldHRpbmdzLmljb25JbWFnZSA/IHNldHRpbmdzLmljb25JbWFnZSA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplICAgICAgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwic21hbGxcIjtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciAgICAgICA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1pY29uXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcblxyXG4gICAgICAgIGxldCBpY29uSW1hZ2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpY29uSW1hZ2VFbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbkltYWdlO1xyXG5cclxuICAgICAgICBsZXQgaWNvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBpY29uVGV4dC50ZXh0Q29udGVudCA9IHRoaXMuaWNvblRleHQ7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uSW1hZ2VFbGVtKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvblRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogSWNvbiBpbmhlcml0cyBmcm9tIEVudGl0eVxyXG4gKi9cclxuSWNvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVudGl0eS5wcm90b3R5cGUpO1xyXG5JY29uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEljb247XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRBcHBsaWNhdGlvbk5hbWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcGxpY2F0aW9uTmFtZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEljb25zIGFyZSBzdXBwb3NlZCB0byBiZSBhbGlnbmVkIGluIGEgZ3JpZCBzeXN0ZW0uXHJcbiAqIFRoaXMgZnVuY3Rpb24gY29ycmVjdHMgdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgb2YgdGhlIGljb24sIG1ha2luZyBpdCBhbGlnbiB0byB0aGUgbmVhcmVzdCBncmlkXHJcbiAqL1xyXG5JY29uLnByb3RvdHlwZS5jb3JyZWN0R3JpZFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnhQb3MgPSAxMCArIHRoaXMueFBvcyAtIHRoaXMueFBvcyAlIDEwMDtcclxuICAgIHRoaXMueVBvcyA9IDEwICsgdGhpcy55UG9zIC0gdGhpcy55UG9zICUgMTAwO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEljb25UZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uVGV4dDtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvbkltYWdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uSW1hZ2U7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLndpbmRvd1NpemU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcclxuIiwiY29uc3QgV2luZG93ID0gcmVxdWlyZShcIi4vV2luZG93LmpzXCIpO1xyXG5jb25zdCBJY29uID0gcmVxdWlyZShcIi4vSWNvbi5qc1wiKTtcclxuY29uc3QgUGFuZWwgPSByZXF1aXJlKFwiLi9QYW5lbC5qc1wiKTtcclxuY29uc3QgTWVtb3J5ID0gcmVxdWlyZShcIi4vYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qc1wiKTtcclxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoXCIuL2FwcHMvQ2hhdC9DaGF0U3RhcnQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG5cclxuICAgIGluaXRpYWxpemUoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgZGVmYXVsdCBiZWhhdmlvdXIvcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEVsZW1lbnRzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWFpblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJvdHRvbUJhcik7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnB3ZFdpZHRoID0gMTMwMDtcclxuXHJcbiAgICAgICAgdGhpcy5wd2RIZWlnaHQgPSA3MDA7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93c01hZGVDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIHNlbGVjdGVkIGVudGl0eSBpcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHdpbmRvdyBvciBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIHRoZSBkZXNrdG9wIGljb25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgc21hbGxcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2FyZHMucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcInNtYWxsXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiTWVtb3J5IG1lZGl1bVwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAxMjAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2FyZHMucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBiaWdcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMjUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcImNhcmRzLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJiaWdcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJDaGF0XCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiQ2hhdFwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAzNTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2hhdC5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgICAgICB9KSApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcHBlbmQgdGhlIGljb25zIHRvIHRoZSBjb250YWluZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGQgbGlzdGVuZXJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2V1cEV2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0V2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBkYmxjbGlja0V2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtb3VzZWRvd25FdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIGV2ZXJ5IG1vdXNlZG93biBldmVudCB3ZSB3aWxsIGF0dGVtcHQgdG8gZmluZCBhIG5ldyBzZWxlY3RlZCBlbnRpdHlcclxuICAgICAgICAgKi9cclxuICAgICAgICBmaW5kU2VsZWN0ZWRFbnRpdHkoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICB1cGRhdGVCb3R0b21CYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkgaW5zdGFuY2VvZiBXaW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogV2luZG93cyBzaG91bGQgb25seSBiZSBkcmFnZ2FibGUgYnkgdGhlIHRvcGJhclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsZXQgd2luZG93VG9wQmFyRWxlbSA9IHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93VG9wQmFyRWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbW91c2V1cEV2ZW50KGUpIHtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVudGl0eSkge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgdGhlIGVudGl0eSBpcyBkcmFnZ2luZyAtPiBzdG9wIGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvL2lmICh0aGlzLnNlbGVjdGVkRW50aXR5LmdldElzRHJhZ2dpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eS5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhbiBpY29uIC0+IGFsaWduIHRoZSBpY29uIHRvIHRoZSBncmlkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVudGl0eSBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHkuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcInVwXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5IGluc3RhbmNlb2YgV2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSB0aGlzLnNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19jbG9zZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3dDbG9zZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZih0aGlzLnNlbGVjdGVkRW50aXR5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogQ2FsbCB0aGUgY2xvc2UgZnVuY3Rpb25uIGltcGxlbWVudGVkIGJ5IGV2ZXJ5IGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnNbaW5kZXhdLmNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIFJlbW92ZSB0aGUgd2luZG93IGZyb20gdGhlIERPTVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1tpbmRleF0uZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogUmVtb3ZlIHRoZSB3aW5kb3csIHBhbmVsIGFuZCBhcHBsaWNhdGlvbiBmcm9tIHRoZWlyIHJlc3BlY3RpdmUgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhbmVscy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHkgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgd2luZG93UmVzaXplRGl2ID0gdGhpcy5zZWxlY3RlZEVudGl0eS5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfcmVzaXplXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSByZXNpemUgYnV0dG9uIC0+IHJlc2l6ZSB0aGUgd2luZG93XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3dSZXNpemVEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eS5yZXNpemUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCB3aW5kb3dNaW5pbWl6ZURpdiA9IHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X21pbmltaXplXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBtaW5pbWl6ZSBidXR0b25cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvd01pbmltaXplRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHkuc2V0TWluaW1pemVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRW50aXR5LnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB3aW5kb3dzLmluZGV4T2YodGhpcy5zZWxlY3RlZEVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRibGNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5KSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBpZiBhIGRvdWJsZWNsaWNrIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvbiAtPiBsYXVuY2ggdGhlIGFzc29jaWF0ZWQgYXBwbGljYXRpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24odGhpcy5zZWxlY3RlZEVudGl0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlQm90dG9tQmFyKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgc2VsZWN0ZWQgZW50aXR5IGlmIHRoZSBwcm92aWRlZCB0YXJnZXQgZXhpc3RzIGluc2lkZSBhIGVudGl0eSAod2luZG93IG9yIGljb24pXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZpbmRTZWxlY3RlZEVudGl0eSh0YXJnZXQpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0aGVyZSBpcyBhIHNlbGVjdGVkIGVudGl0eSAtPiBkZXNlbGVjdCBhbmQgc2V0IGFzIHVuZGVmaW5lZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5IGluc3RhbmNlb2YgV2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB3aW5kb3dzLmluZGV4T2YodGhpcy5zZWxlY3RlZEVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdlIHdpbGwgbm93IGF0dGVtcHQgdG8gZmluZCB0aGUgc2VsZWN0ZWQgZW50aXR5LCBpdGVyYXRpbmcgdGhlIHdpbmRvd3MgYW5kIGljb25zXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIHdpbmRvd3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbiBhIHdpbmRvdyAtPiBtYXJrIHRoZSB3aW5kb3cgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzW2ldLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eSA9IHdpbmRvd3NbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0SXNTZWxlY3RlZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgaWNvbnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvbiAtPiBtYXJrIHRoZSBpY29uIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pY29uc1tpXS5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHkgPSBpY29uc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExhdW5jaCBhbiBhcHBsaWNhdGlvbiB1c2luZyB0aGUgbWV0YSBkYXRhIGluIGEgZ2l2ZW4gaWNvbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbGF1bmNoQXBwbGljYXRpb24oaWNvbk9iaikge1xyXG4gICAgICAgIGxldCBpZCA9IHRoaXMud2luZG93cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZSBhIG5ldyB3aW5kb3cgdG8gbGF1bmNoIHRoZSBhcHBsaWNhdGlvbiBpblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwd2RXaW5kb3cgPSBuZXcgV2luZG93KHtcclxuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLndpbmRvd3MubGVuZ3RoLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogaWNvbk9iai5nZXRXaW5kb3dTaXplKCksXHJcbiAgICAgICAgICAgIFwidG9wQmFyVGV4dFwiOiBpY29uT2JqLmdldEljb25UZXh0KCksXHJcbiAgICAgICAgICAgIFwidG9wQmFySWNvblwiOiBpY29uT2JqLmdldEljb25JbWFnZSgpLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogKDEwMCArIDE1ICogaWQpLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogKDIwICsgMzAgKiBpZClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy93aW5kb3dzTWFkZUNvdW50ZXIgKz0gMTtcclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnB1c2gocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHdkV2luZG93LmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIGV2ZXJ5IHdpbmRvdyB0aGVyZSBpcyBhbHNvIGEgcGFuZWwgaW4gdGhlIGJvdHRvbSBiYXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcHdkUGFuZWwgPSBuZXcgUGFuZWwoe1xyXG4gICAgICAgICAgICBcInRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcImljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy5wdXNoKHB3ZFBhbmVsKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuYXBwZW5kQ2hpbGQocHdkUGFuZWwuZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24gYW5kIGFwcGVuZCBpdCB0byB0aGUgbmV3bHkgY3JlYXRlZCB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgYXBwbGljYXRpb25PYmogPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpID09PSBcIk1lbW9yeVwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IE1lbW9yeSh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyBpZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGljb25PYmouZ2V0QXBwbGljYXRpb25OYW1lKCkgPT09IFwiQ2hhdFwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IENoYXQoe1xyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJcIjogXCIjUFdELXdpbmRvd19jb250ZW50LVwiICsgaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucy5wdXNoKGFwcGxpY2F0aW9uT2JqKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIHNlbGVjdGVkIGVudGl0eVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBlbnRpdHlNb3ZlRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlbnRpdHkgLT4gdXBkYXRlIGl0cyBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRW50aXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHkuc2V0SXNEcmFnZ2luZyh0cnVlKTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgbGV0IG9mZnNldFggPSBlLmNsaWVudFggLSBzZWxlY3RlZEVudGl0eS5nZXRDb250YWluZXIoKS5vZmZzZXRMZWZ0O1xyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIHNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpLm9mZnNldFRvcDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkRW50aXR5LmdldFhQb3MoKSArIFwiIDogXCIgKyBvZmZzZXRYKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRFbnRpdHkuZ2V0WVBvcygpICsgXCIgOiBcIiArIG9mZnNldFkpO1xyXG5cclxuICAgICAgICAgICAgc2VsZWN0ZWRFbnRpdHkudXBkYXRlUG9zKHNlbGVjdGVkRW50aXR5LmdldFhQb3MoKSArIG9mZnNldFgsIHNlbGVjdGVkRW50aXR5LmdldFlQb3MoKSArIG9mZnNldFkpO1xyXG4gICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd190b3BiYXJcIikuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBtb3VzZSBwb2ludGVyIGlzIG91dHNpZGUgd2luZG93IC0+IGRvIG5vdCB1cGRhdGUgdGhlIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoZS5jbGllbnRYIDwgMCB8fCBlLmNsaWVudFggPiB0aGlzLnB3ZFdpZHRoIHx8IGUuY2xpZW50WSA8IDAgfHwgZS5jbGllbnRZID4gdGhpcy5wd2RIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WCA9IGUubW92ZW1lbnRYO1xyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRZID0gZS5tb3ZlbWVudFk7XHJcblxyXG4gICAgICAgICAgICBpZiAoKHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0WFBvcygpICsgbW92ZW1lbnRYICsgdGhpcy5zZWxlY3RlZEVudGl0eS5nZXRXaWR0aCgpKSA+IHRoaXMucHdkV2lkdGggJiYgbW92ZW1lbnRYID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRYID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0WFBvcygpICsgbW92ZW1lbnRYIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRYID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCh0aGlzLnNlbGVjdGVkRW50aXR5LmdldFlQb3MoKSArIG1vdmVtZW50WSArIHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0SGVpZ2h0KCkpID4gdGhpcy5wd2RIZWlnaHQgJiYgbW92ZW1lbnRZID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0WVBvcygpICsgbW92ZW1lbnRZIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eS51cGRhdGVQb3ModGhpcy5zZWxlY3RlZEVudGl0eS5nZXRYUG9zKCkgKyBtb3ZlbWVudFgsIHRoaXMuc2VsZWN0ZWRFbnRpdHkuZ2V0WVBvcygpICsgbW92ZW1lbnRZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblBXRC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUFdEO1xyXG4iLCJmdW5jdGlvbiBQYW5lbChzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgdGhpcy50ZXh0ID0gc2V0dGluZ3MudGV4dCA/IHNldHRpbmdzLnRleHQgOiBcIm5vIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLmljb24gPSBzZXR0aW5ncy5pY29uID8gc2V0dGluZ3MuaWNvbiA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSBzZXR0aW5ncy5pc1NlbGVjdGVkID8gc2V0dGluZ3MuaXNTZWxlY3RlZCA6IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxcIik7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIudGV4dENvbnRlbnQgPSB0aGlzLnRleHQ7XHJcbn1cclxuXHJcblBhbmVsLnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsO1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBXaW5kb3coc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIC8vdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBcIiNcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy50b3BCYXJUZXh0ID0gc2V0dGluZ3MudG9wQmFyVGV4dCA/IHNldHRpbmdzLnRvcEJhclRleHQgOiBcIk5vIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLnRvcEJhckljb24gPSBzZXR0aW5ncy50b3BCYXJJY29uID8gc2V0dGluZ3MudG9wQmFySWNvbiA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcIm1lZGl1bVwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgIGxldCB3aW5kb3dUb3BCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFySWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICB3aW5kb3dUb3BCYXJJY29uLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMudG9wQmFySWNvbjtcclxuICAgIHdpbmRvd1RvcEJhckljb24uYWx0ID0gXCJUb3AgYmFyIGljb25cIjtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgd2luZG93VG9wQmFyU3Bhbi50ZXh0Q29udGVudCA9IHRoaXMudG9wQmFyVGV4dDtcclxuXHJcbiAgICBsZXQgd2luZG93TWluaW1pemVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93TWluaW1pemVEaXYuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfbWluaW1pemVcIik7XHJcbiAgICB3aW5kb3dNaW5pbWl6ZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLW1pbnVzLXJvdW5kXCIpO1xyXG5cclxuICAgIHRoaXMud2luZG93UmVzaXplRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMud2luZG93UmVzaXplRGl2LmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3Jlc2l6ZVwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93Q2xvc2VEaXYuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY2xvc2VcIik7XHJcbiAgICB3aW5kb3dDbG9zZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLWNsb3NlLXJvdW5kXCIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY29udGVudFwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLmlkKTtcclxuICAgIGlmICh0aGlzLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgIHdpbmRvd0NvbnRlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJfd3JhcHBlclwiKTtcclxuXHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFySWNvbik7XHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyU3Bhbik7XHJcblxyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dNaW5pbWl6ZURpdik7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMud2luZG93UmVzaXplRGl2KTtcclxuICAgIHdpbmRvd1RvcEJhcldyYXBwZXIuYXBwZW5kQ2hpbGQod2luZG93Q2xvc2VEaXYpO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcldyYXBwZXIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93Q29udGVudCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgYWxsIGNsYXNzZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaW9uLWFycm93LXNocmlua1wiKTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLndpbmRvd1NpemUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInNtYWxsXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAzMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA0NTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LXNocmlua1wiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLVwiICsgdGhpcy53aW5kb3dTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogV2luZG93IGluaGVyaXRzIGZyb20gRW50aXR5XHJcbiAqL1xyXG5XaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuV2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFdpbmRvdztcclxuXHJcbldpbmRvdy5wcm90b3R5cGUuc2V0TWluaW1pemVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMubWluaW1pemVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMubWluaW1pemVkKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWludmlzaWJsZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLWludmlzaWJsZVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1cIiArIHRoaXMud2luZG93U2l6ZSk7XHJcblxyXG4gICAgc3dpdGNoKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcIm1lZGl1bVwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwiYmlnXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJiaWdcIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJzbWFsbFwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uT2JqLmNsb3NlKCk7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvdztcclxuIiwiY29uc3QgUFdEID0gcmVxdWlyZShcIi4vUFdELmpzXCIpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHB3ZCA9IG5ldyBQV0Qoe1wiY29udGFpbmVyXCI6IFwiYm9keVwifSk7XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBDaGF0KHNldHRpbmdzKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwibm8gY29udGFpbmVyXCI7XHJcblxyXG4gICAgbGV0IHVzZXJuYW1lID0gc2V0dGluZ3MudXNlcm5hbWUgPyBzZXR0aW5ncy51c2VybmFtZSA6IFwibmFqc3NpbW9uXCI7XHJcblxyXG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIik7XHJcbiAgICAvL3NvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBzb2NrZXRPcGVuRXZlbnQpO1xyXG4gICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgc29ja2V0TWVzc2FnZUV2ZW50KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIENoYXQgd3JhcHBlclxyXG4gICAgbGV0IGNoYXRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0V3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBNZXNzYWdlcyBkaXZcclxuICAgIGxldCBtZXNzYWdlc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBtZXNzYWdlc0Rpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdE1lc3NhZ2VzXCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVzc2FnZXNEaXYpO1xyXG5cclxuICAgIC8vIElucHV0IGZvcm1cclxuICAgIGxldCBpbnB1dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmcm9tXCIpO1xyXG4gICAgaW5wdXREaXYuY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dFwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGlucHV0RGl2KTtcclxuXHJcbiAgICAvLyBUZXh0YXJlYSBpbiB0aGUgaW5wdXQgZGl2XHJcbiAgICBsZXQgaW5wdXREaXZfdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XHJcbiAgICBpbnB1dERpdl90ZXh0YXJlYS5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X3RleHRhcmVhXCIpO1xyXG4gICAgLy8gZml4IHRvIG1ha2UgdGV4dGFyZWEgc2VsZWN0YWJsZVxyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNsaWNrKCk7XHJcbiAgICB9KTtcclxuICAgIGlucHV0RGl2LmFwcGVuZENoaWxkKGlucHV0RGl2X3RleHRhcmVhKTtcclxuXHJcbiAgICAvLyBCdXR0b24gaW4gdGhlIGlucHV0IGRpdlxyXG4gICAgbGV0IGlucHV0RGl2X2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBpbnB1dERpdl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJ1dHRvbkV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRfYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XHJcbiAgICBpbnB1dERpdl9idXR0b24udGV4dENvbnRlbnQgPSBcIlNlbmRcIjtcclxuICAgIGlucHV0RGl2LmFwcGVuZENoaWxkKGlucHV0RGl2X2J1dHRvbik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyIGRpdlxyXG4gICAgbGV0IGNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIGNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgLypcclxuICAgIGZ1bmN0aW9uIHNvY2tldE9wZW5FdmVudChlKSB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgfVxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIHNvY2tldE1lc3NhZ2VFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgbGV0IGNoYXRNZXNzYWdlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi5jbGFzc0xpc3QuYWRkKFwiY2hhdE1lc3NhZ2VcIik7XHJcblxyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSBcIltcIiArIHJlc3BvbnNlLnR5cGUgKyBcIl0gXCI7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IHJlc3BvbnNlLnVzZXJuYW1lICsgXCI6IFwiO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSByZXNwb25zZS5kYXRhO1xyXG5cclxuICAgICAgICBtZXNzYWdlc0Rpdi5hcHBlbmRDaGlsZChjaGF0TWVzc2FnZVNwYW4pO1xyXG5cclxuICAgICAgICBtZXNzYWdlc0Rpdi5zY3JvbGxUb3AgPSBtZXNzYWdlc0Rpdi5zY3JvbGxIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnV0dG9uRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGlucHV0RGl2X3RleHRhcmVhLnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNdXN0IGVudGVyIGEgbWVzc2FnZSFcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dERpdl90ZXh0YXJlYS52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiIDogdmFsdWUsXHJcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNoYXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XHJcbiIsImNvbnN0IENoYXQgPSByZXF1aXJlKFwiLi9DaGF0LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ2hhdFN0YXJ0KHNldHRpbmdzKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwibm8gY29udGFpbmVyXCI7XHJcblxyXG4gICAgdGhpcy5jaGF0T2JqID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gV3JhcHBlclxyXG4gICAgbGV0IGNoYXRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0V3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBDaGF0IHN0YXJ0IGhlYWRlclxyXG4gICAgbGV0IGNoYXRTdGFydEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXIuY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydEhlYWRlclwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXRTdGFydEhlYWRlcik7XHJcblxyXG4gICAgbGV0IGNoYXRTdGFydEhlYWRlclNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIGNoYXRTdGFydEhlYWRlclNwYW4udGV4dENvbnRlbnQgPSBcIlNVUEVSQ0hBVFwiO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyLmFwcGVuZENoaWxkKGNoYXRTdGFydEhlYWRlclNwYW4pO1xyXG5cclxuICAgIC8vIENoYXQgbmFtZSBpbnB1dFxyXG4gICAgbGV0IGNoYXROYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAvLyBmaXggdG8gbWFrZSBpbnB1dCBzZWxlY3RhYmxlXHJcbiAgICBjaGF0TmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgICBjaGF0TmFtZUlucHV0LnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiRW50ZXIgbmFtZSEhIVwiKTtcclxuICAgIGNoYXROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydE5hbWVJbnB1dFwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXROYW1lSW5wdXQpO1xyXG5cclxuICAgIC8vIENoYXQgbmFtZSBidXR0b25cclxuICAgIGxldCBjaGF0TmFtZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0TmFtZUJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU3RhcnQgY2hhdHRpbmchISEhISEhIVwiO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdE5hbWVCdXR0b24pO1xyXG5cclxuICAgIC8vIENvbnRhaW5lciBkaXZcclxuICAgIGxldCBjb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBjb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGNoYXROYW1lSW5wdXQudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVudGVyIGEgbmFtZSFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXR0aW5ncy51c2VybmFtZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBjaGF0V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGF0T2JqID0gbmV3IENoYXQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGF0U3RhcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5jaGF0T2JqKSB7XHJcbiAgICAgICAgdGhpcy5jaGF0T2JqLmNsb3NlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhdFN0YXJ0O1xyXG4iLCJmdW5jdGlvbiBDYXJkKHZhbHVlKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICBsZXQgY2FyZFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDYXJkVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgY2FyZFRlbXBsYXRlRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUoY2FyZFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIC8vIFRoZSBjYXJkRWxlbSBpcyB0aGUgZWxlbWVudCB3cmFwcGluZyB0aGUgdHdvIGltYWdlc1xyXG4gICAgdGhpcy5jYXJkRWxlbSA9IGNhcmRUZW1wbGF0ZUZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktY2FyZFwiKTtcclxuICAgIHRoaXMuY2FyZEVsZW0uc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCB0aGlzLnZhbHVlKTtcclxuXHJcbiAgICAvLyBUaGUgY292ZXJJbWFnZSBpcyB0aGUgcXVlc3Rpb24gbWFyayBhYm92ZSB0aGUgY2FyZCBpbWFnZVxyXG4gICAgdGhpcy5jb3ZlckltYWdlID0gdGhpcy5jYXJkRWxlbS5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkX2JhY2tcIik7XHJcbiAgICB0aGlzLmNvdmVySW1hZ2Uuc3JjID0gXCJpbWFnZS9cIiArIHRoaXMudmFsdWVbMF0gKyBcIi5wbmdcIjtcclxuXHJcbiAgICAvLyBUaGUgY2FyZEltYWdlIGlzIHRoZSBpbWFnZSBvZiB0aGUgbWVtb3J5IGNhcmRcclxuICAgIHRoaXMuY2FyZEltYWdlID0gdGhpcy5jYXJkRWxlbS5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkX2Zyb250XCIpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdW5pcXVlIHZhbHVlIGZvciB0aGlzIGNhcmRcclxuICogVGhlIGNhcmQgaWRlbnRpZmllclxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogRmxpcHMgdGhlIGNhcmRcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmlzRmxpcHBlZCkge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRJc0ZsaXBwZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRmxpcHBlZDtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuc2V0SXNDb21wbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSB2YWx1ZTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcclxuICAgIHRoaXMuY2FyZEVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRDYXJkRWxlbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZEVsZW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZDtcclxuIiwiY29uc3QgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDYXJkcyhuck9mQ2FyZHMpIHtcclxuICAgIHRoaXMuY2FyZHMgPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuck9mQ2FyZHMgKyAxOyBpKyspIHtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAxKSk7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2h1ZmZsZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgbGV0IHRlbXAgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbaV0gPSB0aGlzLmNhcmRzW2pdO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbal0gPSB0ZW1wO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgY2FyZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZVxyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgbGV0IGNhcmQ7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FyZHNbaV0uZ2V0VmFsdWUoKSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgY2FyZCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBmcmFnbWVudCBjb250YWluaW5nIHRoZSBjYXJkIGRpdnMgYW5kIGltYWdlc1xyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmRzRnJhZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNhcmRzRnJhZyA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNhcmRFbGVtID0gdGhpcy5jYXJkc1tpXS5nZXRDYXJkRWxlbSgpO1xyXG4gICAgICAgIGNhcmRzRnJhZy5hcHBlbmRDaGlsZChjYXJkRWxlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmRzRnJhZztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkcztcclxuIiwiY29uc3QgTWVtb3J5R2FtZUJvYXJkID0gcmVxdWlyZShcIi4vTWVtb3J5R2FtZUJvYXJkLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTWVtb3J5R2FtZShzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIiMxMjNcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIFdyYXBwZXJcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVdyYXBwZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5V3JhcHBlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gbWVtb3J5V3JhcHBlckZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktd3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBIZWFkZXJcclxuICAgIGxldCBtZW1vcnlIZWFkZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5SGVhZGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5SGVhZGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUhlYWRlciA9IG1lbW9yeUhlYWRlckZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlIZWFkZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUhlYWRlcik7XHJcblxyXG4gICAgLy8gUGFpciBmb3JtXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1UZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJGb3JtVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtID0gbWVtb3J5UGFpckZvcm1GcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1cIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVBhaXJGb3JtKTtcclxuXHJcbiAgICAvLyBSYWRpbyBpbnB1dHNcclxuICAgIGxldCBtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpclJhZGlvVGVtcGxhdGVcIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gODsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJSYWRpb0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJSYWRpb1RlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgICAgICBsZXQgbWVtb3J5UGFpckxhYmVsID0gbWVtb3J5UGFpclJhZGlvRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhaXJSYWRpb0xhYmVsXCIpO1xyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyUmFkaW8gPSBtZW1vcnlQYWlyTGFiZWwucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBtZW1vcnlQYWlyTGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaSArIFwiIHBhaXJzXCIpKTtcclxuICAgICAgICAvLyBGaXggdG8gbWFrZSByYWRpbyBpbnB1dHMgY2xpY2thYmxlXHJcbiAgICAgICAgbWVtb3J5UGFpckxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtZW1vcnlQYWlyUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhaXJGb3JtLmFwcGVuZENoaWxkKG1lbW9yeVBhaXJMYWJlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRm9ybSBidXR0b25cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b24gPSBtZW1vcnlQYWlyRm9ybUJ1dHRvbkZyYWcucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcclxuICAgIG1lbW9yeVBhaXJGb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZW1vcnlQYWlyRm9ybUJ1dHRvbkV2ZW50KTtcclxuXHJcbiAgICBtZW1vcnlQYWlyRm9ybS5hcHBlbmRDaGlsZChtZW1vcnlQYWlyRm9ybUJ1dHRvbik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyXHJcbiAgICBsZXQgbWVtb3J5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IG5yT2ZQYWlycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm0gaW5wdXQ6Y2hlY2tlZFwiKS52YWx1ZTtcclxuXHJcbiAgICAgICAgbWVtb3J5V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICBzZXR0aW5ncy5uck9mUGFpcnMgPSBwYXJzZUludChuck9mUGFpcnMpO1xyXG4gICAgICAgIG5ldyBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge31cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5R2FtZTtcclxuIiwiY29uc3QgQ2FyZHMgPSByZXF1aXJlKFwiLi9DYXJkcy5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIE1lbW9yeUdhbWVCb2FyZChzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIiNjb29sXCI7XHJcblxyXG4gICAgbGV0IG5yT2ZQYWlycyA9IHNldHRpbmdzLm5yT2ZQYWlycyA/IHNldHRpbmdzLm5yT2ZQYWlycyA6IDQ7XHJcblxyXG4gICAgbGV0IGNhcmRzID0gbmV3IENhcmRzKG5yT2ZQYWlycyk7XHJcblxyXG4gICAgbGV0IHNjb3JlID0gMDtcclxuXHJcbiAgICBsZXQgZ2FtZVRpbWVyID0gMDtcclxuXHJcbiAgICBsZXQgYXR0ZW1wdHMgPSAwO1xyXG5cclxuICAgIGxldCBmaXJzdENhcmQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgbGV0IHNlY29uZENhcmQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgbGV0IGlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgZ2FtZVRpbWVySW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aW1lciwgMTAwMCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFTGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBNZW1vcnkgd3JhcHBlclxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V3JhcHBlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlXcmFwcGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJEaXYgPSBtZW1vcnlXcmFwcGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS13cmFwcGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWVtb3J5V3JhcHBlckNsaWNrRXZlbnQpO1xyXG5cclxuICAgIC8vIEhlYWRlclxyXG4gICAgbGV0IG1lbW9yeUhlYWRlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlIZWFkZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlIZWFkZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlIZWFkZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyID0gbWVtb3J5SGVhZGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUhlYWRlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5SGVhZGVyKTtcclxuXHJcbiAgICAvLyBNZW1vcnkgcGFuZWxcclxuICAgIGxldCBtZW1vcnlQYW5lbFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbFRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFuZWxUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFuZWxEaXYgICAgICAgICAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktcGFuZWxcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW4gPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbEF0dGVtcHRzU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbFRpbWVTcGFuICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsVGltZVNwYW5cIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxNZXNzYWdlU3BhbiAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlQYW5lbERpdik7XHJcblxyXG4gICAgLy8gTWVtb3J5IGNhcmRzXHJcbiAgICBsZXQgbWVtb3lDYXJkc1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDYXJkc1RlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUNhcmRzRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5Q2FyZHNUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5Q2FyZHNEaXYgPSBtZW1vcnlDYXJkc0ZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktY2FyZHNcIik7XHJcbiAgICBtZW1vcnlDYXJkc0Rpdi5hcHBlbmRDaGlsZChjYXJkcy5nZXRDYXJkc0ZyYWcoKSk7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUNhcmRzRGl2KTtcclxuXHJcbiAgICAvLyBNZW1vcnkgY29udGFpbmVyXHJcbiAgICBsZXQgbWVtb3J5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHRpbWVyKCkge1xyXG4gICAgICAgIGdhbWVUaW1lciArPSAxO1xyXG5cclxuICAgICAgICBtZW1vcnlQYW5lbEF0dGVtcHRzU3Bhbi50ZXh0Q29udGVudCA9IFwiQXR0ZW1wdHM6IFwiICsgYXR0ZW1wdHM7XHJcbiAgICAgICAgbWVtb3J5UGFuZWxUaW1lU3Bhbi50ZXh0Q29udGVudCA9IFwiVGltZTogXCIgKyBnYW1lVGltZXIgKyBcIiBzZWNvbmRzXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWVtb3J5V3JhcHBlckNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgaXMgY3VycmVudGx5IGNoZWNraW5nIGFuc3dlciAtPiBleGl0IGZ1bmN0aW9uXHJcbiAgICAgICAgICogKHdhaXRpbmcgZm9yIHRpbWVyIHRvIGZpbmlzaClcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaXNDaGVja2luZ0Fuc3dlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW1nRWxlbSA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBsZXQgYUVsZW0gPSBpbWdFbGVtLm5vZGVOYW1lID09PSBcIklNR1wiID8gaW1nRWxlbS5wYXJlbnROb2RlIDogaW1nRWxlbTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0gYUVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNhcmQgPSBjYXJkcy5nZXRDYXJkKHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGNhcmQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuZ2V0SXNGbGlwcGVkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmZsaXAoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RDYXJkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdENhcmQgPSBjYXJkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRDYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tBbnN3ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja0Fuc3dlcigpIHtcclxuICAgICAgICBpc0NoZWNraW5nQW5zd2VyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgYXR0ZW1wdHMgKz0gMTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaXJzdENhcmQuZ2V0VmFsdWUoKVswXSA9PT0gc2Vjb25kQ2FyZC5nZXRWYWx1ZSgpWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuYWRkQ2xhc3MoXCJNZW1vcnktY2FyZC0tY29ycmVjdFwiKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuYWRkQ2xhc3MoXCJNZW1vcnktY2FyZC0tY29ycmVjdFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29yZSArPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgc2NvcmUgaXMgZXF1YWwgdG8gbWF4aW11bSBhbW91bnQgb2YgcGFpcnMgLT4gdGhlIGdhbWUgaXMgY29tcGxldGVcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3JlID09PSBuck9mUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdhbWVUaW1lckludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ID0gXCJZb3UgY29tcGxldGVkIHRoZSBnYW1lIVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuZmxpcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaXJzdENhcmQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHNlY29uZENhcmQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5R2FtZUJvYXJkO1xyXG4iXX0=
