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

        /**
         * The target is...
         */
        this.target = undefined;

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
         * For every mousedown event we will attempt to find a new target
         */
        this.target = findTarget(e.target);

        /**
         * Deselect everything
         */
        for (let i = 0; i < this.windows.length; i++) {
            this.windows[i].setIsSelected(false);
        }

        for (let i = 0; i < this.panels.length; i++) {
            this.panels[i].setIsSelected(false);
        }

        for (let i = 0; i < this.icons.length; i++) {
            this.icons[i].setIsSelected(false);
        }

        /**
         * If target is a window
         */
        if (this.target instanceof Window) {
            /**
             * Set the window as selected
             */
            this.target.setIsSelected(true);

            /**
             * Mark the associated panel as selected
             */
            let index = windows.indexOf(this.target);

            this.panels[index].setIsSelected(true);

            /**
             * If target is the window top bar -> add mousemove listener
             */
            let windowTopBarElem = this.target.getContainer().querySelector(".PWD-window_topbar");

            if (windowTopBarElem.contains(e.target)) {
                window.addEventListener("mousemove", entityMoveEvent);

                e.preventDefault();
            }

            return;
        }

        /**
         * If target is a panel
         */
        if (this.target instanceof Panel) {
            /**
             * Set the panel as selected
             */
            this.target.setIsSelected(true);

            /**
             * Set the associated window as selected
             */
            let index = panels.indexOf(this.target);

            this.windows[index].setIsSelected(true);

            if (this.windows[index].getIsMinimized()) {
                /**
                 * Bring up the window
                 */
                this.windows[index].setMinimized(false);
            } else {
                /**
                 * Bring down the window
                 */
                //this.windows[index].setMinimized(true);
            }

            return;
        }

        /**
         * If target is an icon
         */
        if (this.target instanceof Icon) {
            /**
             * Set the icon as selected
             */
            this.target.setIsSelected(true);

            return;
        }
    }

    function mouseupEvent(e) {
        /**
         * If target is a window
         */
        if (this.target instanceof Window) {
            this.target.setIsDragging(false);

            window.removeEventListener("mousemove", entityMoveEvent);
        }

        /**
         * If target is an icon
         */
        if (this.target instanceof Icon) {
            this.target.setIsDragging(false);

            window.removeEventListener("mousemove", entityMoveEvent);

            this.target.correctGridPosition();
        }

        console.log("up");
    }

    function clickEvent(e) {
        if (this.target instanceof Window) {
            /**
             * If a click has been made on the close button
             */
            let windowCloseDiv = this.target.getContainer().querySelector(".PWD-window_close");

            if (windowCloseDiv.contains(e.target)) {
                let index = this.windows.indexOf(this.target);

                closeWindow(index);

                return;
            }

            /**
             * If a click has been made on the resize button -> resize the window
             */
            let windowResizeDiv = this.target.getContainer().querySelector(".PWD-window_resize");

            if (windowResizeDiv.contains(e.target)) {
                this.target.resize();

                return;
            }

            /**
             * If a click has been made on the minimize button
             */
            let windowMinimizeDiv = this.target.getContainer().querySelector(".PWD-window_minimize");

            if (windowMinimizeDiv.contains(e.target)) {
                this.target.setMinimized(true);

                this.target.setIsSelected(false);

                let index = windows.indexOf(this.target);

                this.panels[index].setIsSelected(false);

                return;
            }
        }

        /**
         * If target is an icon
         */
        if (this.target instanceof Panel) {
            let index = panels.indexOf(this.target);

            /**
             * If a click has been made on the close button
             */
            if (this.target.getContainer().querySelector(".PWD-bottomBar_panel__close").contains(e.target)) {
                closeWindow(index);

                return;
            }
        }
    }

    function dblclickEvent(e) {
        /**
         * If target is an icon
         */
        if (this.target instanceof Icon) {
            /**
             * Launch the application associated with the icon
             */
            launchApplication(this.target);

            return;
        }
    }

    /**
     * CLose a window with a given index
     */
    function closeWindow(index) {
        /**
         * Call the close functionn implemented by every application
         */
        this.applications[index].close();

        /**
         * Remove the window and panel from the DOM
         */
        this.windows[index].getContainer().parentNode.removeChild(this.windows[index].getContainer());

        this.panels[index].getContainer().parentNode.removeChild(this.panels[index].getContainer());

        /**
         * Remove the window, panel and application from their respective arrays
         */
        this.windows.splice(index, 1);
        this.panels.splice(index, 1);
        this.applications.splice(index, 1);
    }

    /**
     * Check if a given target exists in a window, panel or icon
     */
    function findTarget(target) {
        /**
         * Iterate the windows
         */
        for (let i = 0; i < this.windows.length; i++) {
            /**
             * If a mousedown has been made in a window -> mark the window and the panel as selected
             */
            if (this.windows[i].getContainer().contains(target)) {
                return this.windows[i];
            }
        }

        /**
         * Iterate the panels
         */
        for (let i = 0; i < this.panels.length; i++) {
            /**
             * If a mousedown has been made in a panel -> mark the panel and the window as selected
             */
            if (this.panels[i].getContainer().contains(target)) {
                return this.panels[i];
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
                return this.icons[i];
            }
        }

        /**
         * There is no target -> return undefined
         */
        return undefined;
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
        //if (this.selectedEntity) {
            this.target.setIsDragging(true);
            /*
            let offsetX = e.clientX - selectedEntity.getContainer().offsetLeft;
            let offsetY = e.clientY - selectedEntity.getContainer().offsetTop;

            console.log(selectedEntity.getXPos() + " : " + offsetX);
            console.log(selectedEntity.getYPos() + " : " + offsetY);

            selectedEntity.updatePos(selectedEntity.getXPos() + offsetX, selectedEntity.getYPos() + offsetY);
            */

            if (!this.target.getContainer().querySelector(".PWD-window_topbar").contains(e.target)) {
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

            if ((this.target.getXPos() + movementX + this.target.getWidth()) > this.pwdWidth && movementX > 0) {
                movementX = 0;
            }

            if (this.target.getXPos() + movementX < 0) {
                movementX = 0;
            }

            if ((this.target.getYPos() + movementY + this.target.getHeight()) > this.pwdHeight && movementY > 0) {
                movementY = 0;
            }

            if (this.target.getYPos() + movementY < 0) {
                movementY = 0;
            }

            this.target.updatePos(this.target.getXPos() + movementX, this.target.getYPos() + movementY);
        //}
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

    let iconElem = document.createElement("img");
    iconElem.classList.add("PWD-bottomBar_panel__icon");
    iconElem.src = "./image/" + this.icon;
    iconElem.alt = "Icon";

    let spanElem = document.createElement("span");
    spanElem.classList.add("PWD-bottomBar_panel__span");
    spanElem.textContent = this.text;

    let closeElem = document.createElement("div");
    closeElem.classList.add("PWD-bottomBar_panel__close");

    this.container.appendChild(iconElem);
    this.container.appendChild(spanElem);
    this.container.appendChild(closeElem);
}

Panel.prototype.getIsSelected = function() {
    return this.isSelected;
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

Window.prototype.getIsMinimized = function() {
    return this.minimized;
}

Window.prototype.setMinimized = function(value) {
    this.minimized = value;

    if (this.minimized) {
        this.container.classList.add("PWD-window--minimized");
    } else {
        this.container.classList.remove("PWD-window--minimized");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvRW50aXR5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9JY29uLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9DaGF0L0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0U3RhcnQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L0NhcmQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L0NhcmRzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9NZW1vcnlHYW1lLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9NZW1vcnlHYW1lQm9hcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIFdpbmRvdyBhbmQgaWNvbiBpbmhlcml0cyBmcm9tIGVudGl0eVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVudGl0eShzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLndpZHRoID0gc2V0dGluZ3Mud2lkdGggPyBzZXR0aW5ncy53aWR0aCA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnhQb3MgPSBzZXR0aW5ncy54UG9zID8gc2V0dGluZ3MueFBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnlQb3MgPSBzZXR0aW5ncy55UG9zID8gc2V0dGluZ3MueVBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSBzZXR0aW5ncy5pc1NlbGVjdGVkID8gc2V0dGluZ3MuaXNTZWxlY3RlZCA6IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHNldHRpbmdzLmlzRHJhZ2dpbmcgPyBzZXR0aW5ncy5pc0RyYWdnaW5nIDogZmFsc2U7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLndpZHRoO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFhQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnhQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0WVBvcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueVBvcztcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS51cGRhdGVQb3MgPSBmdW5jdGlvbih4UG9zLCB5UG9zKSB7XHJcbiAgICB0aGlzLnhQb3MgPSB4UG9zO1xyXG4gICAgdGhpcy55UG9zID0geVBvcztcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldElzU2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWQ7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuc2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcImRyYWdnaW5nXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiZHJhZ2dpbmdcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNEcmFnZ2luZztcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoXCIuL0VudGl0eS5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIEljb24oc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgRW50aXR5LmNhbGwodGhpcywge1xyXG4gICAgICAgIFwieFBvc1wiOiBzZXR0aW5ncy54UG9zLFxyXG4gICAgICAgIFwieVBvc1wiOiBzZXR0aW5ncy55UG9zLFxyXG4gICAgICAgIFwiaXNTZWxlY3RlZFwiOiBzZXR0aW5ncy5pc1NlbGVjdGVkLFxyXG4gICAgICAgIFwiaXNEcmFnZ2luZ1wiOiBzZXR0aW5ncy5pc0RyYWdnaW5nXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmljb25UZXh0ICAgICAgICA9IHNldHRpbmdzLmljb25UZXh0ID8gc2V0dGluZ3MuaWNvblRleHQgOiBcIk5vIGljb24gdGV4dFwiO1xyXG5cclxuICAgIHRoaXMud2lkdGggICAgICAgICAgID0gc2V0dGluZ3Mud2lkdGggPyBzZXR0aW5ncy53aWR0aCA6IDEwO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ICAgICAgICAgID0gc2V0dGluZ3MuaGVpZ2h0ID8gc2V0dGluZ3MuaGVpZ2h0IDogMTA7XHJcblxyXG4gICAgdGhpcy5hcHBsaWNhdGlvbk5hbWUgPSBzZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgPyBzZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgOiBcIlwiO1xyXG5cclxuICAgIHRoaXMuaWNvbkltYWdlICAgICAgID0gc2V0dGluZ3MuaWNvbkltYWdlID8gc2V0dGluZ3MuaWNvbkltYWdlIDogXCJkZWZhdWx0SWNvbi5pY29cIjtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgICAgICA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJzbWFsbFwiO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyICAgICAgID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWljb25cIik7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICAgICAgbGV0IGljb25JbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGljb25JbWFnZUVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uSW1hZ2U7XHJcblxyXG4gICAgICAgIGxldCBpY29uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGljb25UZXh0LnRleHRDb250ZW50ID0gdGhpcy5pY29uVGV4dDtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25JbWFnZUVsZW0pO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uVGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJY29uIGluaGVyaXRzIGZyb20gRW50aXR5XHJcbiAqL1xyXG5JY29uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRW50aXR5LnByb3RvdHlwZSk7XHJcbkljb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSWNvbjtcclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG4vKipcclxuICogSWNvbnMgYXJlIHN1cHBvc2VkIHRvIGJlIGFsaWduZWQgaW4gYSBncmlkIHN5c3RlbS5cclxuICogVGhpcyBmdW5jdGlvbiBjb3JyZWN0cyB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBvZiB0aGUgaWNvbiwgbWFraW5nIGl0IGFsaWduIHRvIHRoZSBuZWFyZXN0IGdyaWRcclxuICovXHJcbkljb24ucHJvdG90eXBlLmNvcnJlY3RHcmlkUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMueFBvcyA9IDEwICsgdGhpcy54UG9zIC0gdGhpcy54UG9zICUgMTAwO1xyXG4gICAgdGhpcy55UG9zID0gMTAgKyB0aGlzLnlQb3MgLSB0aGlzLnlQb3MgJSAxMDA7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvblRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmljb25UZXh0O1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJY29uSW1hZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmljb25JbWFnZTtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2luZG93U2l6ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xyXG4iLCJjb25zdCBXaW5kb3cgPSByZXF1aXJlKFwiLi9XaW5kb3cuanNcIik7XHJcbmNvbnN0IEljb24gPSByZXF1aXJlKFwiLi9JY29uLmpzXCIpO1xyXG5jb25zdCBQYW5lbCA9IHJlcXVpcmUoXCIuL1BhbmVsLmpzXCIpO1xyXG5jb25zdCBNZW1vcnkgPSByZXF1aXJlKFwiLi9hcHBzL01lbW9yeS9NZW1vcnlHYW1lLmpzXCIpO1xyXG5jb25zdCBDaGF0ID0gcmVxdWlyZShcIi4vYXBwcy9DaGF0L0NoYXRTdGFydC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFBXRChzZXR0aW5ncyA9IHt9KSB7XHJcblxyXG4gICAgaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBkZWZhdWx0IGJlaGF2aW91ci9wcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRWxlbWVudHNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtYWluXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmJvdHRvbUJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYm90dG9tQmFyKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZXR0aW5ncy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvcGVydGllc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93cyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmljb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucHdkV2lkdGggPSAxMzAwO1xyXG5cclxuICAgICAgICB0aGlzLnB3ZEhlaWdodCA9IDcwMDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIHRhcmdldCBpcy4uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgdGhlIGRlc2t0b3AgaWNvbnNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBzbWFsbFwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJjYXJkcy5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwic21hbGxcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgbWVkaXVtXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDEyMCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJjYXJkcy5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiTWVtb3J5IGJpZ1wiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAyNTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2FyZHMucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcImJpZ1wiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIkNoYXRcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJDaGF0XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDM1MCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJjaGF0LnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIlxyXG4gICAgICAgIH0pICk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFwcGVuZCB0aGUgaWNvbnMgdG8gdGhlIGNvbnRhaW5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmljb25zW2ldLmdldENvbnRhaW5lcigpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZCBsaXN0ZW5lcnNcclxuICAgICAgICAgKi9cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd25FdmVudCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZXVwRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRibGNsaWNrXCIsIGRibGNsaWNrRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXZlbnQgZnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1vdXNlZG93bkV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGb3IgZXZlcnkgbW91c2Vkb3duIGV2ZW50IHdlIHdpbGwgYXR0ZW1wdCB0byBmaW5kIGEgbmV3IHRhcmdldFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gZmluZFRhcmdldChlLnRhcmdldCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERlc2VsZWN0IGV2ZXJ5dGhpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd3NbaV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWNvbnNbaV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0YXJnZXQgaXMgYSB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBXaW5kb3cpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNldCB0aGUgd2luZG93IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE1hcmsgdGhlIGFzc29jaWF0ZWQgcGFuZWwgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHdpbmRvd3MuaW5kZXhPZih0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uc2V0SXNTZWxlY3RlZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiB0YXJnZXQgaXMgdGhlIHdpbmRvdyB0b3AgYmFyIC0+IGFkZCBtb3VzZW1vdmUgbGlzdGVuZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dUb3BCYXJFbGVtID0gdGhpcy50YXJnZXQuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dUb3BCYXJFbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZW50aXR5TW92ZUV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhIHBhbmVsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNldCB0aGUgcGFuZWwgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU2V0IHRoZSBhc3NvY2lhdGVkIHdpbmRvdyBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGFuZWxzLmluZGV4T2YodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMud2luZG93c1tpbmRleF0uZ2V0SXNNaW5pbWl6ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBCcmluZyB1cCB0aGUgd2luZG93XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1tpbmRleF0uc2V0TWluaW1pemVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQnJpbmcgZG93biB0aGUgd2luZG93XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vdGhpcy53aW5kb3dzW2luZGV4XS5zZXRNaW5pbWl6ZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU2V0IHRoZSBpY29uIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb3VzZXVwRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCBpbnN0YW5jZW9mIFdpbmRvdykge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGVudGl0eU1vdmVFdmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0YXJnZXQgaXMgYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGlja0V2ZW50KGUpIHtcclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBXaW5kb3cpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSB0aGlzLnRhcmdldC5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfY2xvc2VcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93Q2xvc2VEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZih0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xvc2VXaW5kb3coaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgcmVzaXplIGJ1dHRvbiAtPiByZXNpemUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd1Jlc2l6ZURpdiA9IHRoaXMudGFyZ2V0LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19yZXNpemVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93UmVzaXplRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQucmVzaXplKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBtaW5pbWl6ZSBidXR0b25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dNaW5pbWl6ZURpdiA9IHRoaXMudGFyZ2V0LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19taW5pbWl6ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dNaW5pbWl6ZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB3aW5kb3dzLmluZGV4T2YodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGFuZWxzLmluZGV4T2YodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXQuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0QtYm90dG9tQmFyX3BhbmVsX19jbG9zZVwiKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGNsb3NlV2luZG93KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGJsY2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBMYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgaWNvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24odGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENMb3NlIGEgd2luZG93IHdpdGggYSBnaXZlbiBpbmRleFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjbG9zZVdpbmRvdyhpbmRleCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhbGwgdGhlIGNsb3NlIGZ1bmN0aW9ubiBpbXBsZW1lbnRlZCBieSBldmVyeSBhcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zW2luZGV4XS5jbG9zZSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgdGhlIHdpbmRvdyBhbmQgcGFuZWwgZnJvbSB0aGUgRE9NXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5nZXRDb250YWluZXIoKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMud2luZG93c1tpbmRleF0uZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnBhbmVsc1tpbmRleF0uZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIGZyb20gdGhlaXIgcmVzcGVjdGl2ZSBhcnJheXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB0aGlzLnBhbmVscy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhIGdpdmVuIHRhcmdldCBleGlzdHMgaW4gYSB3aW5kb3csIHBhbmVsIG9yIGljb25cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZmluZFRhcmdldCh0YXJnZXQpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSB3aW5kb3dzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgaW4gYSB3aW5kb3cgLT4gbWFyayB0aGUgd2luZG93IGFuZCB0aGUgcGFuZWwgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2luZG93c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgcGFuZWxzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbiBhIHBhbmVsIC0+IG1hcmsgdGhlIHBhbmVsIGFuZCB0aGUgd2luZG93IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYW5lbHNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFuZWxzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSBpY29uc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uIC0+IG1hcmsgdGhlIGljb24gYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmljb25zW2ldLmdldENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmljb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGVyZSBpcyBubyB0YXJnZXQgLT4gcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggYW4gYXBwbGljYXRpb24gdXNpbmcgdGhlIG1ldGEgZGF0YSBpbiBhIGdpdmVuIGljb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxhdW5jaEFwcGxpY2F0aW9uKGljb25PYmopIHtcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLndpbmRvd3MubGVuZ3RoO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgYSBuZXcgd2luZG93IHRvIGxhdW5jaCB0aGUgYXBwbGljYXRpb24gaW5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gbmV3IFdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy53aW5kb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IGljb25PYmouZ2V0V2luZG93U2l6ZSgpLFxyXG4gICAgICAgICAgICBcInRvcEJhclRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcInRvcEJhckljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKSxcclxuICAgICAgICAgICAgXCJ4UG9zXCI6ICgxMDAgKyAxNSAqIGlkKSxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6ICgyMCArIDMwICogaWQpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93cy5wdXNoKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBldmVyeSB3aW5kb3cgdGhlcmUgaXMgYWxzbyBhIHBhbmVsIGluIHRoZSBib3R0b20gYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFBhbmVsID0gbmV3IFBhbmVsKHtcclxuICAgICAgICAgICAgXCJ0ZXh0XCI6IGljb25PYmouZ2V0SWNvblRleHQoKSxcclxuICAgICAgICAgICAgXCJpY29uXCI6IGljb25PYmouZ2V0SWNvbkltYWdlKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMucHVzaChwd2RQYW5lbCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmFwcGVuZENoaWxkKHB3ZFBhbmVsLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uIGFuZCBhcHBlbmQgaXQgdG8gdGhlIG5ld2x5IGNyZWF0ZWQgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IGFwcGxpY2F0aW9uT2JqID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAoaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKSA9PT0gXCJNZW1vcnlcIikge1xyXG4gICAgICAgICAgICBhcHBsaWNhdGlvbk9iaiA9IG5ldyBNZW1vcnkoe1xyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJcIjogXCIjUFdELXdpbmRvd19jb250ZW50LVwiICsgaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpID09PSBcIkNoYXRcIikge1xyXG4gICAgICAgICAgICBhcHBsaWNhdGlvbk9iaiA9IG5ldyBDaGF0KHtcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI1BXRC13aW5kb3dfY29udGVudC1cIiArIGlkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMucHVzaChhcHBsaWNhdGlvbk9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBzZWxlY3RlZCBlbnRpdHlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZW50aXR5TW92ZUV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0aGVyZSBpcyBhbiBhY3RpdmUgZW50aXR5IC0+IHVwZGF0ZSBpdHMgcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICAvL2lmICh0aGlzLnNlbGVjdGVkRW50aXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldElzRHJhZ2dpbmcodHJ1ZSk7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gZS5jbGllbnRYIC0gc2VsZWN0ZWRFbnRpdHkuZ2V0Q29udGFpbmVyKCkub2Zmc2V0TGVmdDtcclxuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBlLmNsaWVudFkgLSBzZWxlY3RlZEVudGl0eS5nZXRDb250YWluZXIoKS5vZmZzZXRUb3A7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZEVudGl0eS5nZXRYUG9zKCkgKyBcIiA6IFwiICsgb2Zmc2V0WCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkRW50aXR5LmdldFlQb3MoKSArIFwiIDogXCIgKyBvZmZzZXRZKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGVjdGVkRW50aXR5LnVwZGF0ZVBvcyhzZWxlY3RlZEVudGl0eS5nZXRYUG9zKCkgKyBvZmZzZXRYLCBzZWxlY3RlZEVudGl0eS5nZXRZUG9zKCkgKyBvZmZzZXRZKTtcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy50YXJnZXQuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3RvcGJhclwiKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIG1vdXNlIHBvaW50ZXIgaXMgb3V0c2lkZSB3aW5kb3cgLT4gZG8gbm90IHVwZGF0ZSB0aGUgcG9zaXRpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChlLmNsaWVudFggPCAwIHx8IGUuY2xpZW50WCA+IHRoaXMucHdkV2lkdGggfHwgZS5jbGllbnRZIDwgMCB8fCBlLmNsaWVudFkgPiB0aGlzLnB3ZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRYID0gZS5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFkgPSBlLm1vdmVtZW50WTtcclxuXHJcbiAgICAgICAgICAgIGlmICgodGhpcy50YXJnZXQuZ2V0WFBvcygpICsgbW92ZW1lbnRYICsgdGhpcy50YXJnZXQuZ2V0V2lkdGgoKSkgPiB0aGlzLnB3ZFdpZHRoICYmIG1vdmVtZW50WCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldC5nZXRYUG9zKCkgKyBtb3ZlbWVudFggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFggPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKHRoaXMudGFyZ2V0LmdldFlQb3MoKSArIG1vdmVtZW50WSArIHRoaXMudGFyZ2V0LmdldEhlaWdodCgpKSA+IHRoaXMucHdkSGVpZ2h0ICYmIG1vdmVtZW50WSA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldC5nZXRZUG9zKCkgKyBtb3ZlbWVudFkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC51cGRhdGVQb3ModGhpcy50YXJnZXQuZ2V0WFBvcygpICsgbW92ZW1lbnRYLCB0aGlzLnRhcmdldC5nZXRZUG9zKCkgKyBtb3ZlbWVudFkpO1xyXG4gICAgICAgIC8vfVxyXG4gICAgfVxyXG59XHJcblxyXG5QV0QucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBXRDtcclxuIiwiZnVuY3Rpb24gUGFuZWwoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHRoaXMudGV4dCA9IHNldHRpbmdzLnRleHQgPyBzZXR0aW5ncy50ZXh0IDogXCJubyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy5pY29uID0gc2V0dGluZ3MuaWNvbiA/IHNldHRpbmdzLmljb24gOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsXCIpO1xyXG5cclxuICAgIGxldCBpY29uRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICBpY29uRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9faWNvblwiKTtcclxuICAgIGljb25FbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbjtcclxuICAgIGljb25FbGVtLmFsdCA9IFwiSWNvblwiO1xyXG5cclxuICAgIGxldCBzcGFuRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgc3BhbkVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxfX3NwYW5cIik7XHJcbiAgICBzcGFuRWxlbS50ZXh0Q29udGVudCA9IHRoaXMudGV4dDtcclxuXHJcbiAgICBsZXQgY2xvc2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9fY2xvc2VcIik7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkVsZW0pO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc3BhbkVsZW0pO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoY2xvc2VFbGVtKTtcclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLmdldElzU2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWQ7XHJcbn1cclxuXHJcblBhbmVsLnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsO1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBXaW5kb3coc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIC8vdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBcIiNcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy50b3BCYXJUZXh0ID0gc2V0dGluZ3MudG9wQmFyVGV4dCA/IHNldHRpbmdzLnRvcEJhclRleHQgOiBcIk5vIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLnRvcEJhckljb24gPSBzZXR0aW5ncy50b3BCYXJJY29uID8gc2V0dGluZ3MudG9wQmFySWNvbiA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcIm1lZGl1bVwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgIGxldCB3aW5kb3dUb3BCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFySWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICB3aW5kb3dUb3BCYXJJY29uLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMudG9wQmFySWNvbjtcclxuICAgIHdpbmRvd1RvcEJhckljb24uYWx0ID0gXCJUb3AgYmFyIGljb25cIjtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgd2luZG93VG9wQmFyU3Bhbi50ZXh0Q29udGVudCA9IHRoaXMudG9wQmFyVGV4dDtcclxuXHJcbiAgICBsZXQgd2luZG93TWluaW1pemVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93TWluaW1pemVEaXYuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfbWluaW1pemVcIik7XHJcbiAgICB3aW5kb3dNaW5pbWl6ZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLW1pbnVzLXJvdW5kXCIpO1xyXG5cclxuICAgIHRoaXMud2luZG93UmVzaXplRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMud2luZG93UmVzaXplRGl2LmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3Jlc2l6ZVwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93Q2xvc2VEaXYuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY2xvc2VcIik7XHJcbiAgICB3aW5kb3dDbG9zZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLWNsb3NlLXJvdW5kXCIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY29udGVudFwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLmlkKTtcclxuICAgIGlmICh0aGlzLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgIHdpbmRvd0NvbnRlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJfd3JhcHBlclwiKTtcclxuXHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFySWNvbik7XHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyU3Bhbik7XHJcblxyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dNaW5pbWl6ZURpdik7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMud2luZG93UmVzaXplRGl2KTtcclxuICAgIHdpbmRvd1RvcEJhcldyYXBwZXIuYXBwZW5kQ2hpbGQod2luZG93Q2xvc2VEaXYpO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcldyYXBwZXIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93Q29udGVudCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgYWxsIGNsYXNzZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaW9uLWFycm93LXNocmlua1wiKTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLndpbmRvd1NpemUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInNtYWxsXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAzMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA0NTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZURpdi5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LXNocmlua1wiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLVwiICsgdGhpcy53aW5kb3dTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogV2luZG93IGluaGVyaXRzIGZyb20gRW50aXR5XHJcbiAqL1xyXG5XaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuV2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFdpbmRvdztcclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SXNNaW5pbWl6ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLm1pbmltaXplZDtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5zZXRNaW5pbWl6ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5taW5pbWl6ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5taW5pbWl6ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tbWluaW1pemVkXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWluaW1pemVkXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLVwiICsgdGhpcy53aW5kb3dTaXplKTtcclxuXHJcbiAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgY2FzZSBcInNtYWxsXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwibWVkaXVtXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJiaWdcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcInNtYWxsXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXBwbGljYXRpb25PYmouY2xvc2UoKTtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV2luZG93O1xyXG4iLCJjb25zdCBQV0QgPSByZXF1aXJlKFwiLi9QV0QuanNcIik7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcHdkID0gbmV3IFBXRCh7XCJjb250YWluZXJcIjogXCJib2R5XCJ9KTtcclxufSk7XHJcbiIsImZ1bmN0aW9uIENoYXQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCJubyBjb250YWluZXJcIjtcclxuXHJcbiAgICBsZXQgdXNlcm5hbWUgPSBzZXR0aW5ncy51c2VybmFtZSA/IHNldHRpbmdzLnVzZXJuYW1lIDogXCJuYWpzc2ltb25cIjtcclxuXHJcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiKTtcclxuICAgIC8vc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIHNvY2tldE9wZW5FdmVudCk7XHJcbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBzb2NrZXRNZXNzYWdlRXZlbnQpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gQ2hhdCB3cmFwcGVyXHJcbiAgICBsZXQgY2hhdFdyYXBwZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcImNoYXRXcmFwcGVyXCIpO1xyXG5cclxuICAgIC8vIE1lc3NhZ2VzIGRpdlxyXG4gICAgbGV0IG1lc3NhZ2VzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG1lc3NhZ2VzRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0TWVzc2FnZXNcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZXNzYWdlc0Rpdik7XHJcblxyXG4gICAgLy8gSW5wdXQgZm9ybVxyXG4gICAgbGV0IGlucHV0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZyb21cIik7XHJcbiAgICBpbnB1dERpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0XCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoaW5wdXREaXYpO1xyXG5cclxuICAgIC8vIFRleHRhcmVhIGluIHRoZSBpbnB1dCBkaXZcclxuICAgIGxldCBpbnB1dERpdl90ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcclxuICAgIGlucHV0RGl2X3RleHRhcmVhLmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRfdGV4dGFyZWFcIik7XHJcbiAgICAvLyBmaXggdG8gbWFrZSB0ZXh0YXJlYSBzZWxlY3RhYmxlXHJcbiAgICBpbnB1dERpdl90ZXh0YXJlYS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgIH0pO1xyXG4gICAgaW5wdXREaXYuYXBwZW5kQ2hpbGQoaW5wdXREaXZfdGV4dGFyZWEpO1xyXG5cclxuICAgIC8vIEJ1dHRvbiBpbiB0aGUgaW5wdXQgZGl2XHJcbiAgICBsZXQgaW5wdXREaXZfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBpbnB1dERpdl9idXR0b24uY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dF9idXR0b25cIik7XHJcbiAgICBpbnB1dERpdl9idXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi50ZXh0Q29udGVudCA9IFwiU2VuZFwiO1xyXG4gICAgaW5wdXREaXYuYXBwZW5kQ2hpbGQoaW5wdXREaXZfYnV0dG9uKTtcclxuXHJcbiAgICAvLyBDb250YWluZXIgZGl2XHJcbiAgICBsZXQgY29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICAvKlxyXG4gICAgZnVuY3Rpb24gc29ja2V0T3BlbkV2ZW50KGUpIHtcclxuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gc29ja2V0TWVzc2FnZUV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBsZXQgY2hhdE1lc3NhZ2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLmNsYXNzTGlzdC5hZGQoXCJjaGF0TWVzc2FnZVwiKTtcclxuXHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IFwiW1wiICsgcmVzcG9uc2UudHlwZSArIFwiXSBcIjtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gcmVzcG9uc2UudXNlcm5hbWUgKyBcIjogXCI7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IHJlc3BvbnNlLmRhdGE7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzRGl2LmFwcGVuZENoaWxkKGNoYXRNZXNzYWdlU3Bhbik7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzRGl2LnNjcm9sbFRvcCA9IG1lc3NhZ2VzRGl2LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBidXR0b25FdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gaW5wdXREaXZfdGV4dGFyZWEudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk11c3QgZW50ZXIgYSBtZXNzYWdlIVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlucHV0RGl2X3RleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJkYXRhXCIgOiB2YWx1ZSxcclxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSxcclxuICAgICAgICAgICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgIH1cclxufVxyXG5cclxuQ2hhdC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcclxuIiwiY29uc3QgQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDaGF0U3RhcnQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCJubyBjb250YWluZXJcIjtcclxuXHJcbiAgICB0aGlzLmNoYXRPYmogPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBXcmFwcGVyXHJcbiAgICBsZXQgY2hhdFdyYXBwZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcImNoYXRXcmFwcGVyXCIpO1xyXG5cclxuICAgIC8vIENoYXQgc3RhcnQgaGVhZGVyXHJcbiAgICBsZXQgY2hhdFN0YXJ0SGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRTdGFydEhlYWRlci5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0SGVhZGVyXCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFN0YXJ0SGVhZGVyKTtcclxuXHJcbiAgICBsZXQgY2hhdFN0YXJ0SGVhZGVyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyU3Bhbi50ZXh0Q29udGVudCA9IFwiU1VQRVJDSEFUXCI7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXIuYXBwZW5kQ2hpbGQoY2hhdFN0YXJ0SGVhZGVyU3Bhbik7XHJcblxyXG4gICAgLy8gQ2hhdCBuYW1lIGlucHV0XHJcbiAgICBsZXQgY2hhdE5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIC8vIGZpeCB0byBtYWtlIGlucHV0IHNlbGVjdGFibGVcclxuICAgIGNoYXROYW1lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNsaWNrKCk7XHJcbiAgICB9KTtcclxuICAgIGNoYXROYW1lSW5wdXQuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgXCJFbnRlciBuYW1lISEhXCIpO1xyXG4gICAgY2hhdE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0TmFtZUlucHV0XCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdE5hbWVJbnB1dCk7XHJcblxyXG4gICAgLy8gQ2hhdCBuYW1lIGJ1dHRvblxyXG4gICAgbGV0IGNoYXROYW1lQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnROYW1lQnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBjaGF0dGluZyEhISEhISEhXCI7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0TmFtZUJ1dHRvbik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyIGRpdlxyXG4gICAgbGV0IGNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIGNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gY2hhdE5hbWVJbnB1dC52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW50ZXIgYSBuYW1lIVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHRpbmdzLnVzZXJuYW1lID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGNoYXRXcmFwcGVyRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICB0aGlzLmNoYXRPYmogPSBuZXcgQ2hhdChzZXR0aW5ncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNoYXRTdGFydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmNoYXRPYmopIHtcclxuICAgICAgICB0aGlzLmNoYXRPYmouY2xvc2UoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGF0U3RhcnQ7XHJcbiIsImZ1bmN0aW9uIENhcmQodmFsdWUpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIGxldCBjYXJkVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUNhcmRUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBjYXJkVGVtcGxhdGVGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShjYXJkVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gVGhlIGNhcmRFbGVtIGlzIHRoZSBlbGVtZW50IHdyYXBwaW5nIHRoZSB0d28gaW1hZ2VzXHJcbiAgICB0aGlzLmNhcmRFbGVtID0gY2FyZFRlbXBsYXRlRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIHRoaXMudmFsdWUpO1xyXG5cclxuICAgIC8vIFRoZSBjb3ZlckltYWdlIGlzIHRoZSBxdWVzdGlvbiBtYXJrIGFib3ZlIHRoZSBjYXJkIGltYWdlXHJcbiAgICB0aGlzLmNvdmVySW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRfYmFja1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zcmMgPSBcImltYWdlL1wiICsgdGhpcy52YWx1ZVswXSArIFwiLnBuZ1wiO1xyXG5cclxuICAgIC8vIFRoZSBjYXJkSW1hZ2UgaXMgdGhlIGltYWdlIG9mIHRoZSBtZW1vcnkgY2FyZFxyXG4gICAgdGhpcy5jYXJkSW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRfZnJvbnRcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSB1bmlxdWUgdmFsdWUgZm9yIHRoaXMgY2FyZFxyXG4gKiBUaGUgY2FyZCBpZGVudGlmaWVyXHJcbiAqL1xyXG5DYXJkLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGbGlwcyB0aGUgY2FyZFxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZmxpcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMuaXNGbGlwcGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJNZW1vcnktY2FyZC0tYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmdldElzRmxpcHBlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNGbGlwcGVkO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5zZXRJc0NvbXBsZXRlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNDb21wbGV0ZSA9IHZhbHVlO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xyXG4gICAgdGhpcy5jYXJkRWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmdldENhcmRFbGVtID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYXJkRWxlbTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkO1xyXG4iLCJjb25zdCBDYXJkID0gcmVxdWlyZShcIi4vQ2FyZC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIENhcmRzKG5yT2ZDYXJkcykge1xyXG4gICAgdGhpcy5jYXJkcyA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSBjYXJkc1xyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG5yT2ZDYXJkcyArIDE7IGkrKykge1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDEpKTtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaHVmZmxlIHRoZSBjYXJkc1xyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gdGhpcy5jYXJkcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICBsZXQgdGVtcCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgdGhpcy5jYXJkc1tpXSA9IHRoaXMuY2FyZHNbal07XHJcbiAgICAgICAgdGhpcy5jYXJkc1tqXSA9IHRlbXA7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBjYXJkIHdpdGggdGhlIGdpdmVuIHZhbHVlXHJcbiAqL1xyXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICBsZXQgY2FyZDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5jYXJkc1tpXS5nZXRWYWx1ZSgpID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBjYXJkID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIGZyYWdtZW50IGNvbnRhaW5pbmcgdGhlIGNhcmQgZGl2cyBhbmQgaW1hZ2VzXHJcbiAqL1xyXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZHNGcmFnID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY2FyZHNGcmFnID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY2FyZEVsZW0gPSB0aGlzLmNhcmRzW2ldLmdldENhcmRFbGVtKCk7XHJcbiAgICAgICAgY2FyZHNGcmFnLmFwcGVuZENoaWxkKGNhcmRFbGVtKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZHNGcmFnO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmRzO1xyXG4iLCJjb25zdCBNZW1vcnlHYW1lQm9hcmQgPSByZXF1aXJlKFwiLi9NZW1vcnlHYW1lQm9hcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lKHNldHRpbmdzKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwiIzEyM1wiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gV3JhcHBlclxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V3JhcHBlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlXcmFwcGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJEaXYgPSBtZW1vcnlXcmFwcGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS13cmFwcGVyXCIpO1xyXG5cclxuICAgIC8vIEhlYWRlclxyXG4gICAgbGV0IG1lbW9yeUhlYWRlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlIZWFkZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlIZWFkZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlIZWFkZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyID0gbWVtb3J5SGVhZGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUhlYWRlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5SGVhZGVyKTtcclxuXHJcbiAgICAvLyBQYWlyIGZvcm1cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybVRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpckZvcm1UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm0gPSBtZW1vcnlQYWlyRm9ybUZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybVwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5UGFpckZvcm0pO1xyXG5cclxuICAgIC8vIFJhZGlvIGlucHV0c1xyXG4gICAgbGV0IG1lbW9yeVBhaXJSYWRpb1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZVwiKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSA4OyBpKyspIHtcclxuICAgICAgICBsZXQgbWVtb3J5UGFpclJhZGlvRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpclJhZGlvVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyTGFiZWwgPSBtZW1vcnlQYWlyUmFkaW9GcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5UGFpclJhZGlvTGFiZWxcIik7XHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJSYWRpbyA9IG1lbW9yeVBhaXJMYWJlbC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhaXJMYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpICsgXCIgcGFpcnNcIikpO1xyXG4gICAgICAgIC8vIEZpeCB0byBtYWtlIHJhZGlvIGlucHV0cyBjbGlja2FibGVcclxuICAgICAgICBtZW1vcnlQYWlyTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1lbW9yeVBhaXJSYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFpckZvcm0uYXBwZW5kQ2hpbGQobWVtb3J5UGFpckxhYmVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGb3JtIGJ1dHRvblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b25GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvbiA9IG1lbW9yeVBhaXJGb3JtQnV0dG9uRnJhZy5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xyXG4gICAgbWVtb3J5UGFpckZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQpO1xyXG5cclxuICAgIG1lbW9yeVBhaXJGb3JtLmFwcGVuZENoaWxkKG1lbW9yeVBhaXJGb3JtQnV0dG9uKTtcclxuXHJcbiAgICAvLyBDb250YWluZXJcclxuICAgIGxldCBtZW1vcnlDb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBtZW1vcnlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbWVtb3J5UGFpckZvcm1CdXR0b25FdmVudCgpIHtcclxuICAgICAgICBsZXQgbnJPZlBhaXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybSBpbnB1dDpjaGVja2VkXCIpLnZhbHVlO1xyXG5cclxuICAgICAgICBtZW1vcnlXcmFwcGVyRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgICAgIHNldHRpbmdzLm5yT2ZQYWlycyA9IHBhcnNlSW50KG5yT2ZQYWlycyk7XHJcbiAgICAgICAgbmV3IE1lbW9yeUdhbWVCb2FyZChzZXR0aW5ncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1lbW9yeUdhbWUucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7fVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnlHYW1lO1xyXG4iLCJjb25zdCBDYXJkcyA9IHJlcXVpcmUoXCIuL0NhcmRzLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTWVtb3J5R2FtZUJvYXJkKHNldHRpbmdzKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwiI2Nvb2xcIjtcclxuXHJcbiAgICBsZXQgbnJPZlBhaXJzID0gc2V0dGluZ3MubnJPZlBhaXJzID8gc2V0dGluZ3MubnJPZlBhaXJzIDogNDtcclxuXHJcbiAgICBsZXQgY2FyZHMgPSBuZXcgQ2FyZHMobnJPZlBhaXJzKTtcclxuXHJcbiAgICBsZXQgc2NvcmUgPSAwO1xyXG5cclxuICAgIGxldCBnYW1lVGltZXIgPSAwO1xyXG5cclxuICAgIGxldCBhdHRlbXB0cyA9IDA7XHJcblxyXG4gICAgbGV0IGZpcnN0Q2FyZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgc2Vjb25kQ2FyZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBnYW1lVGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKHRpbWVyLCAxMDAwKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVMZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIE1lbW9yeSB3cmFwcGVyXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlXcmFwcGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVdyYXBwZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IG1lbW9yeVdyYXBwZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LXdyYXBwZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZW1vcnlXcmFwcGVyQ2xpY2tFdmVudCk7XHJcblxyXG4gICAgLy8gSGVhZGVyXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUhlYWRlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUhlYWRlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUhlYWRlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlIZWFkZXIgPSBtZW1vcnlIZWFkZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5SGVhZGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBwYW5lbFxyXG4gICAgbGV0IG1lbW9yeVBhbmVsVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYW5lbFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYW5lbERpdiAgICAgICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1wYW5lbFwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbEF0dGVtcHRzU3BhbiA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsVGltZVNwYW4gICAgID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxUaW1lU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsTWVzc2FnZVNwYW5cIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVBhbmVsRGl2KTtcclxuXHJcbiAgICAvLyBNZW1vcnkgY2FyZHNcclxuICAgIGxldCBtZW1veUNhcmRzVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUNhcmRzVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5Q2FyZHNGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlDYXJkc1RlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlDYXJkc0RpdiA9IG1lbW9yeUNhcmRzRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkc1wiKTtcclxuICAgIG1lbW9yeUNhcmRzRGl2LmFwcGVuZENoaWxkKGNhcmRzLmdldENhcmRzRnJhZygpKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5Q2FyZHNEaXYpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBjb250YWluZXJcclxuICAgIGxldCBtZW1vcnlDb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBtZW1vcnlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdGltZXIoKSB7XHJcbiAgICAgICAgZ2FtZVRpbWVyICs9IDE7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuLnRleHRDb250ZW50ID0gXCJBdHRlbXB0czogXCIgKyBhdHRlbXB0cztcclxuICAgICAgICBtZW1vcnlQYW5lbFRpbWVTcGFuLnRleHRDb250ZW50ID0gXCJUaW1lOiBcIiArIGdhbWVUaW1lciArIFwiIHNlY29uZHNcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtZW1vcnlXcmFwcGVyQ2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBpcyBjdXJyZW50bHkgY2hlY2tpbmcgYW5zd2VyIC0+IGV4aXQgZnVuY3Rpb25cclxuICAgICAgICAgKiAod2FpdGluZyBmb3IgdGltZXIgdG8gZmluaXNoKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChpc0NoZWNraW5nQW5zd2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbWdFbGVtID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIGxldCBhRWxlbSA9IGltZ0VsZW0ubm9kZU5hbWUgPT09IFwiSU1HXCIgPyBpbWdFbGVtLnBhcmVudE5vZGUgOiBpbWdFbGVtO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWUgPSBhRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIpO1xyXG5cclxuICAgICAgICBsZXQgY2FyZCA9IGNhcmRzLmdldENhcmQodmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoY2FyZCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5nZXRJc0ZsaXBwZWQoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuZmxpcCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChmaXJzdENhcmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0Q2FyZCA9IGNhcmQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlY29uZENhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGVja0Fuc3dlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrQW5zd2VyKCkge1xyXG4gICAgICAgIGlzQ2hlY2tpbmdBbnN3ZXIgPSB0cnVlO1xyXG5cclxuICAgICAgICBhdHRlbXB0cyArPSAxO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpcnN0Q2FyZC5nZXRWYWx1ZSgpWzBdID09PSBzZWNvbmRDYXJkLmdldFZhbHVlKClbMF0pIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5zZXRJc0NvbXBsZXRlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQ2FyZC5zZXRJc0NvbXBsZXRlKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5hZGRDbGFzcyhcIk1lbW9yeS1jYXJkLS1jb3JyZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQ2FyZC5hZGRDbGFzcyhcIk1lbW9yeS1jYXJkLS1jb3JyZWN0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3JlICs9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJZiBzY29yZSBpcyBlcXVhbCB0byBtYXhpbXVtIGFtb3VudCBvZiBwYWlycyAtPiB0aGUgZ2FtZSBpcyBjb21wbGV0ZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcmUgPT09IG5yT2ZQYWlycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZVRpbWVySW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeVBhbmVsTWVzc2FnZVNwYW4udGV4dENvbnRlbnQgPSBcIllvdSBjb21wbGV0ZWQgdGhlIGdhbWUhXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuZmxpcCgpO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQ2FyZC5mbGlwKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpcnN0Q2FyZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgc2Vjb25kQ2FyZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9LCAyMDAwKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnlHYW1lQm9hcmQ7XHJcbiJdfQ==
