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

    this. backgroundColor = settings.backgroundColor ? settings.backgroundColor : "";

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

Icon.prototype.getBackgroundColor = function() {
    return this.backgroundColor;
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

        this.startButton = document.createElement("div");
        this.startButton.classList.add("PWD-bottomBar_startButton");

        this.bottomBar = document.createElement("div");
        this.bottomBar.classList.add("PWD-bottomBar");

        this.bottomBar.appendChild(this.startButton);

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
         * The target is a window, icon or panel
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
            "iconImage": "memoryIcon.png",
            "windowSize": "small"
        }) );
        this.icons.push( new Icon({
            "iconText": "Memory medium",
            "applicationName": "Memory",
            "xPos": 10,
            "yPos": 120,
            "iconImage": "memoryIcon.png",
            "windowSize": "medium",
            "backgroundColor": "rgb(193,154,107)"
        }) );
        this.icons.push( new Icon({
            "iconText": "Memory big",
            "applicationName": "Memory",
            "xPos": 10,
            "yPos": 250,
            "iconImage": "memoryIcon.png",
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

        if (this.target === undefined) {
            return;
        }

        /**
         * If target is a window
         */
        if (this.target instanceof Window) {
            let index = this.windows.indexOf(this.target);

            /**
             * Set the window as selected
             */
            selectEntity(this.panels[index], this.panels);

            /**
             * Mark the associated panel as selected
             */
            selectEntity(this.windows[index], this.windows);

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
            let index = this.panels.indexOf(this.target);

            /**
             * Set the panel as selected
             */
            selectEntity(this.panels[index], this.panels);

            /**
             * Set the associated window as selected
             */
            selectEntity(this.windows[index], this.windows);

            if (this.windows[0].getIsMinimized()) {
                /**
                 * Bring up the window
                 */
                this.windows[0].setMinimized(false);
            } else {
                /**
                 * Bring down the window
                 */
                /*
                this.windows[index].setMinimized(true);

                this.windows[index].setIsSelected(false);

                this.target.setIsSelected(false);
                */
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
            selectEntity(this.target, this.icons);

            window.addEventListener("mousemove", entityMoveEvent);

            e.preventDefault();

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

    function error(message) {
        console.log("ERROR! " + message);
    }

    /**
     * Selects a window, panel or icon
     * Brings it to the front of its array (position 0)
     */
    function selectEntity(entity, arr) {
        let index = arr.indexOf(entity);

        /**
         * If the entity exists in the array
         */
        if (index > -1) {
            /**
             * Remove the entity from the array
             */
            arr.splice(index, 1);

            /**
             * Add it to the front of the array
             */
            arr.unshift(entity);

            arr[0].setIsSelected(true);

            /**
             * The entities are given z-index
             */
            for (let i = 0; i < arr.length; i++) {
                arr[i].getContainer().style.zIndex = "" + arr.length - i;
            }

            /**
             * The bottom bar should always have the highest z-index
             */
            this.bottomBar.style.zIndex = "" + this.windows.length + this.icons.length;
        } else {
            error("selectEntity. Entity does not exist in array.");
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
            "yPos": (20 + 30 * id),
            "backgroundColor" : iconObj.getBackgroundColor()
        });

        this.windows.push(pwdWindow);

        selectEntity(pwdWindow, this.windows);

        this.container.appendChild(pwdWindow.getContainer());

        /**
         * For every window there is also a panel in the bottom bar
         */
        let pwdPanel = new Panel({
            "text": iconObj.getIconText(),
            "icon": iconObj.getIconImage()
        });

        this.panels.push(pwdPanel);

        selectEntity(pwdPanel, this.panels);

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
            /*
            if (!this.target.getContainer().querySelector(".PWD-window_topbar").contains(e.target)) {
                return;
            }
            */
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
    this.container = document.createElement("a");
    this.container.href = "#";
    this.container.classList.add("PWD-bottomBar_panel");

    let iconElem = document.createElement("img");
    iconElem.src = "./image/" + this.icon;
    iconElem.alt = "Icon";
    iconElem.classList.add("PWD-bottomBar_panel__icon");

    let spanElem = document.createElement("span");
    spanElem.classList.add("PWD-bottomBar_panel__span");
    spanElem.textContent = this.text;

    let closeElem = document.createElement("a");
    closeElem.href = "#";
    closeElem.classList.add("PWD-bottomBar_panel__close");
    closeElem.classList.add("ion-close-round");

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

    let windowMinimizeElem = document.createElement("a");
    windowMinimizeElem.href = "#";
    windowMinimizeElem.classList.add("PWD-window_minimize");
    windowMinimizeElem.classList.add("ion-minus-round");

    this.windowResizeElem = document.createElement("a");
    this.windowResizeElem.href = "#";
    this.windowResizeElem.classList.add("PWD-window_resize");

    let windowCloseElem = document.createElement("a");
    windowCloseElem.href = "#";
    windowCloseElem.classList.add("PWD-window_close");
    windowCloseElem.classList.add("ion-close-round");

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
    windowTopBarWrapper.appendChild(windowMinimizeElem);
    windowTopBarWrapper.appendChild(this.windowResizeElem);
    windowTopBarWrapper.appendChild(windowCloseElem);

    this.container.appendChild(windowTopBarWrapper);
    this.container.appendChild(windowContent);

    this.update = function() {
        /**
         * Remove all classes
         */
        this.windowResizeElem.classList.remove("ion-arrow-expand");
        this.windowResizeElem.classList.remove("ion-arrow-shrink");

        switch (this.windowSize) {
            case "small":
                this.width = 200;
                this.height = 300;
                this.windowResizeElem.classList.add("ion-arrow-expand");
                break;
            case "medium":
                this.width = 300;
                this.height = 450;
                this.windowResizeElem.classList.add("ion-arrow-expand");
                break;
            case "big":
                this.width = 400;
                this.height = 600;
                this.windowResizeElem.classList.add("ion-arrow-shrink");
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
        this.container.classList.remove("PWD-window--maximize");
        this.container.classList.add("PWD-window--minimize");
    } else {
        this.container.classList.remove("PWD-window--minimize");
        this.container.classList.add("PWD-window--maximize");

        setTimeout(e => {
            this.container.classList.remove("PWD-window--maximize");
        }, 500);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvRW50aXR5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9JY29uLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9DaGF0L0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0U3RhcnQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L0NhcmQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvTWVtb3J5L0NhcmRzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9NZW1vcnlHYW1lLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9NZW1vcnlHYW1lQm9hcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogV2luZG93IGFuZCBpY29uIGluaGVyaXRzIGZyb20gZW50aXR5XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gRW50aXR5KHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMud2lkdGggPSBzZXR0aW5ncy53aWR0aCA/IHNldHRpbmdzLndpZHRoIDogMTAwO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ID0gc2V0dGluZ3MuaGVpZ2h0ID8gc2V0dGluZ3MuaGVpZ2h0IDogMTAwO1xyXG5cclxuICAgIHRoaXMueFBvcyA9IHNldHRpbmdzLnhQb3MgPyBzZXR0aW5ncy54UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMueVBvcyA9IHNldHRpbmdzLnlQb3MgPyBzZXR0aW5ncy55UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHNldHRpbmdzLmlzU2VsZWN0ZWQgPyBzZXR0aW5ncy5pc1NlbGVjdGVkIDogZmFsc2U7XHJcblxyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gc2V0dGluZ3MuaXNEcmFnZ2luZyA/IHNldHRpbmdzLmlzRHJhZ2dpbmcgOiBmYWxzZTtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRXaWR0aCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5oZWlnaHQ7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0WFBvcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueFBvcztcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRZUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy55UG9zO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnVwZGF0ZVBvcyA9IGZ1bmN0aW9uKHhQb3MsIHlQb3MpIHtcclxuICAgIHRoaXMueFBvcyA9IHhQb3M7XHJcbiAgICB0aGlzLnlQb3MgPSB5UG9zO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuc2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5zZXRJc0RyYWdnaW5nID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiZHJhZ2dpbmdcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkcmFnZ2luZ1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRJc0RyYWdnaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0RyYWdnaW5nO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eTtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZShcIi4vRW50aXR5LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gSWNvbihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBFbnRpdHkuY2FsbCh0aGlzLCB7XHJcbiAgICAgICAgXCJ4UG9zXCI6IHNldHRpbmdzLnhQb3MsXHJcbiAgICAgICAgXCJ5UG9zXCI6IHNldHRpbmdzLnlQb3MsXHJcbiAgICAgICAgXCJpc1NlbGVjdGVkXCI6IHNldHRpbmdzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgXCJpc0RyYWdnaW5nXCI6IHNldHRpbmdzLmlzRHJhZ2dpbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaWNvblRleHQgICAgICAgID0gc2V0dGluZ3MuaWNvblRleHQgPyBzZXR0aW5ncy5pY29uVGV4dCA6IFwiTm8gaWNvbiB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy53aWR0aCAgICAgICAgICAgPSBzZXR0aW5ncy53aWR0aCA/IHNldHRpbmdzLndpZHRoIDogMTA7XHJcblxyXG4gICAgdGhpcy5oZWlnaHQgICAgICAgICAgPSBzZXR0aW5ncy5oZWlnaHQgPyBzZXR0aW5ncy5oZWlnaHQgOiAxMDtcclxuXHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA/IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5pY29uSW1hZ2UgICAgICAgPSBzZXR0aW5ncy5pY29uSW1hZ2UgPyBzZXR0aW5ncy5pY29uSW1hZ2UgOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSAgICAgID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcInNtYWxsXCI7XHJcblxyXG4gICAgdGhpcy4gYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogXCJcIjtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciAgICAgICA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1pY29uXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcblxyXG4gICAgICAgIGxldCBpY29uSW1hZ2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpY29uSW1hZ2VFbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbkltYWdlO1xyXG5cclxuICAgICAgICBsZXQgaWNvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBpY29uVGV4dC50ZXh0Q29udGVudCA9IHRoaXMuaWNvblRleHQ7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uSW1hZ2VFbGVtKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvblRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogSWNvbiBpbmhlcml0cyBmcm9tIEVudGl0eVxyXG4gKi9cclxuSWNvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVudGl0eS5wcm90b3R5cGUpO1xyXG5JY29uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEljb247XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRBcHBsaWNhdGlvbk5hbWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcGxpY2F0aW9uTmFtZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEljb25zIGFyZSBzdXBwb3NlZCB0byBiZSBhbGlnbmVkIGluIGEgZ3JpZCBzeXN0ZW0uXHJcbiAqIFRoaXMgZnVuY3Rpb24gY29ycmVjdHMgdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgb2YgdGhlIGljb24sIG1ha2luZyBpdCBhbGlnbiB0byB0aGUgbmVhcmVzdCBncmlkXHJcbiAqL1xyXG5JY29uLnByb3RvdHlwZS5jb3JyZWN0R3JpZFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnhQb3MgPSAxMCArIHRoaXMueFBvcyAtIHRoaXMueFBvcyAlIDEwMDtcclxuICAgIHRoaXMueVBvcyA9IDEwICsgdGhpcy55UG9zIC0gdGhpcy55UG9zICUgMTAwO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEJhY2tncm91bmRDb2xvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYmFja2dyb3VuZENvbG9yO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJY29uVGV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvblRleHQ7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEljb25JbWFnZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbkltYWdlO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aW5kb3dTaXplO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XHJcbiIsImNvbnN0IFdpbmRvdyA9IHJlcXVpcmUoXCIuL1dpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IFBhbmVsID0gcmVxdWlyZShcIi4vUGFuZWwuanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcbmNvbnN0IENoYXQgPSByZXF1aXJlKFwiLi9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gUFdEKHNldHRpbmdzID0ge30pIHtcclxuXHJcbiAgICBpbml0aWFsaXplKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGRlZmF1bHQgYmVoYXZpb3VyL3Byb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbGVtZW50c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1haW5cIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfc3RhcnRCdXR0b25cIik7XHJcblxyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuYXBwZW5kQ2hpbGQodGhpcy5zdGFydEJ1dHRvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYm90dG9tQmFyKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZXR0aW5ncy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvcGVydGllc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93cyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmljb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucHdkV2lkdGggPSAxMzAwO1xyXG5cclxuICAgICAgICB0aGlzLnB3ZEhlaWdodCA9IDcwMDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIHRhcmdldCBpcyBhIHdpbmRvdywgaWNvbiBvciBwYW5lbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgdGhlIGRlc2t0b3AgaWNvbnNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBzbWFsbFwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJtZW1vcnlJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJzbWFsbFwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBtZWRpdW1cIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTIwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcIm1lbW9yeUljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiLFxyXG4gICAgICAgICAgICBcImJhY2tncm91bmRDb2xvclwiOiBcInJnYigxOTMsMTU0LDEwNylcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgYmlnXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDI1MCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJtZW1vcnlJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJiaWdcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJDaGF0XCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiQ2hhdFwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAzNTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2hhdC5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgICAgICB9KSApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcHBlbmQgdGhlIGljb25zIHRvIHRoZSBjb250YWluZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGQgbGlzdGVuZXJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2V1cEV2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0V2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBkYmxjbGlja0V2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtb3VzZWRvd25FdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIGV2ZXJ5IG1vdXNlZG93biBldmVudCB3ZSB3aWxsIGF0dGVtcHQgdG8gZmluZCBhIG5ldyB0YXJnZXRcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXNlbGVjdCBldmVyeXRoaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dzW2ldLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmljb25zW2ldLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGEgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgV2luZG93KSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMud2luZG93cy5pbmRleE9mKHRoaXMudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZXQgdGhlIHdpbmRvdyBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2VsZWN0RW50aXR5KHRoaXMucGFuZWxzW2luZGV4XSwgdGhpcy5wYW5lbHMpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE1hcmsgdGhlIGFzc29jaWF0ZWQgcGFuZWwgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNlbGVjdEVudGl0eSh0aGlzLndpbmRvd3NbaW5kZXhdLCB0aGlzLndpbmRvd3MpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHRhcmdldCBpcyB0aGUgd2luZG93IHRvcCBiYXIgLT4gYWRkIG1vdXNlbW92ZSBsaXN0ZW5lclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd1RvcEJhckVsZW0gPSB0aGlzLnRhcmdldC5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfdG9wYmFyXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvd1RvcEJhckVsZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGEgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBQYW5lbCkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnBhbmVscy5pbmRleE9mKHRoaXMudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZXQgdGhlIHBhbmVsIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzZWxlY3RFbnRpdHkodGhpcy5wYW5lbHNbaW5kZXhdLCB0aGlzLnBhbmVscyk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU2V0IHRoZSBhc3NvY2lhdGVkIHdpbmRvdyBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2VsZWN0RW50aXR5KHRoaXMud2luZG93c1tpbmRleF0sIHRoaXMud2luZG93cyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy53aW5kb3dzWzBdLmdldElzTWluaW1pemVkKCkpIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQnJpbmcgdXAgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0TWluaW1pemVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQnJpbmcgZG93biB0aGUgd2luZG93XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbaW5kZXhdLnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbaW5kZXhdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZXQgdGhlIGljb24gYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNlbGVjdEVudGl0eSh0aGlzLnRhcmdldCwgdGhpcy5pY29ucyk7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb3VzZXVwRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCBpbnN0YW5jZW9mIFdpbmRvdykge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGVudGl0eU1vdmVFdmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0YXJnZXQgaXMgYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGlja0V2ZW50KGUpIHtcclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBXaW5kb3cpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSB0aGlzLnRhcmdldC5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfY2xvc2VcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93Q2xvc2VEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZih0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xvc2VXaW5kb3coaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgcmVzaXplIGJ1dHRvbiAtPiByZXNpemUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd1Jlc2l6ZURpdiA9IHRoaXMudGFyZ2V0LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19yZXNpemVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93UmVzaXplRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQucmVzaXplKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBtaW5pbWl6ZSBidXR0b25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dNaW5pbWl6ZURpdiA9IHRoaXMudGFyZ2V0LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19taW5pbWl6ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dNaW5pbWl6ZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB3aW5kb3dzLmluZGV4T2YodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGFuZWxzLmluZGV4T2YodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXQuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0QtYm90dG9tQmFyX3BhbmVsX19jbG9zZVwiKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGNsb3NlV2luZG93KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGJsY2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBMYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgaWNvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24odGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUiEgXCIgKyBtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlbGVjdHMgYSB3aW5kb3csIHBhbmVsIG9yIGljb25cclxuICAgICAqIEJyaW5ncyBpdCB0byB0aGUgZnJvbnQgb2YgaXRzIGFycmF5IChwb3NpdGlvbiAwKVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RFbnRpdHkoZW50aXR5LCBhcnIpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSBhcnIuaW5kZXhPZihlbnRpdHkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0aGUgZW50aXR5IGV4aXN0cyBpbiB0aGUgYXJyYXlcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVtb3ZlIHRoZSBlbnRpdHkgZnJvbSB0aGUgYXJyYXlcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEFkZCBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBhcnIudW5zaGlmdChlbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgYXJyWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogVGhlIGVudGl0aWVzIGFyZSBnaXZlbiB6LWluZGV4XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXJyW2ldLmdldENvbnRhaW5lcigpLnN0eWxlLnpJbmRleCA9IFwiXCIgKyBhcnIubGVuZ3RoIC0gaTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFRoZSBib3R0b20gYmFyIHNob3VsZCBhbHdheXMgaGF2ZSB0aGUgaGlnaGVzdCB6LWluZGV4XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmJvdHRvbUJhci5zdHlsZS56SW5kZXggPSBcIlwiICsgdGhpcy53aW5kb3dzLmxlbmd0aCArIHRoaXMuaWNvbnMubGVuZ3RoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9yKFwic2VsZWN0RW50aXR5LiBFbnRpdHkgZG9lcyBub3QgZXhpc3QgaW4gYXJyYXkuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENMb3NlIGEgd2luZG93IHdpdGggYSBnaXZlbiBpbmRleFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjbG9zZVdpbmRvdyhpbmRleCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhbGwgdGhlIGNsb3NlIGZ1bmN0aW9ubiBpbXBsZW1lbnRlZCBieSBldmVyeSBhcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zW2luZGV4XS5jbG9zZSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgdGhlIHdpbmRvdyBhbmQgcGFuZWwgZnJvbSB0aGUgRE9NXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5nZXRDb250YWluZXIoKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMud2luZG93c1tpbmRleF0uZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnBhbmVsc1tpbmRleF0uZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIGZyb20gdGhlaXIgcmVzcGVjdGl2ZSBhcnJheXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB0aGlzLnBhbmVscy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhIGdpdmVuIHRhcmdldCBleGlzdHMgaW4gYSB3aW5kb3csIHBhbmVsIG9yIGljb25cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZmluZFRhcmdldCh0YXJnZXQpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSB3aW5kb3dzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgaW4gYSB3aW5kb3cgLT4gbWFyayB0aGUgd2luZG93IGFuZCB0aGUgcGFuZWwgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2luZG93c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgcGFuZWxzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbiBhIHBhbmVsIC0+IG1hcmsgdGhlIHBhbmVsIGFuZCB0aGUgd2luZG93IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYW5lbHNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFuZWxzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSBpY29uc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uIC0+IG1hcmsgdGhlIGljb24gYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmljb25zW2ldLmdldENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmljb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGVyZSBpcyBubyB0YXJnZXQgLT4gcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggYW4gYXBwbGljYXRpb24gdXNpbmcgdGhlIG1ldGEgZGF0YSBpbiBhIGdpdmVuIGljb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxhdW5jaEFwcGxpY2F0aW9uKGljb25PYmopIHtcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLndpbmRvd3MubGVuZ3RoO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgYSBuZXcgd2luZG93IHRvIGxhdW5jaCB0aGUgYXBwbGljYXRpb24gaW5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gbmV3IFdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy53aW5kb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IGljb25PYmouZ2V0V2luZG93U2l6ZSgpLFxyXG4gICAgICAgICAgICBcInRvcEJhclRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcInRvcEJhckljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKSxcclxuICAgICAgICAgICAgXCJ4UG9zXCI6ICgxMDAgKyAxNSAqIGlkKSxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6ICgyMCArIDMwICogaWQpLFxyXG4gICAgICAgICAgICBcImJhY2tncm91bmRDb2xvclwiIDogaWNvbk9iai5nZXRCYWNrZ3JvdW5kQ29sb3IoKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3MucHVzaChwd2RXaW5kb3cpO1xyXG5cclxuICAgICAgICBzZWxlY3RFbnRpdHkocHdkV2luZG93LCB0aGlzLndpbmRvd3MpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGb3IgZXZlcnkgd2luZG93IHRoZXJlIGlzIGFsc28gYSBwYW5lbCBpbiB0aGUgYm90dG9tIGJhclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwd2RQYW5lbCA9IG5ldyBQYW5lbCh7XHJcbiAgICAgICAgICAgIFwidGV4dFwiOiBpY29uT2JqLmdldEljb25UZXh0KCksXHJcbiAgICAgICAgICAgIFwiaWNvblwiOiBpY29uT2JqLmdldEljb25JbWFnZSgpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGFuZWxzLnB1c2gocHdkUGFuZWwpO1xyXG5cclxuICAgICAgICBzZWxlY3RFbnRpdHkocHdkUGFuZWwsIHRoaXMucGFuZWxzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuYXBwZW5kQ2hpbGQocHdkUGFuZWwuZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24gYW5kIGFwcGVuZCBpdCB0byB0aGUgbmV3bHkgY3JlYXRlZCB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgYXBwbGljYXRpb25PYmogPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpID09PSBcIk1lbW9yeVwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IE1lbW9yeSh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyBpZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGljb25PYmouZ2V0QXBwbGljYXRpb25OYW1lKCkgPT09IFwiQ2hhdFwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IENoYXQoe1xyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJcIjogXCIjUFdELXdpbmRvd19jb250ZW50LVwiICsgaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucy5wdXNoKGFwcGxpY2F0aW9uT2JqKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIHNlbGVjdGVkIGVudGl0eVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBlbnRpdHlNb3ZlRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlbnRpdHkgLT4gdXBkYXRlIGl0cyBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vaWYgKHRoaXMuc2VsZWN0ZWRFbnRpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0SXNEcmFnZ2luZyh0cnVlKTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgbGV0IG9mZnNldFggPSBlLmNsaWVudFggLSBzZWxlY3RlZEVudGl0eS5nZXRDb250YWluZXIoKS5vZmZzZXRMZWZ0O1xyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIHNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpLm9mZnNldFRvcDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkRW50aXR5LmdldFhQb3MoKSArIFwiIDogXCIgKyBvZmZzZXRYKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRFbnRpdHkuZ2V0WVBvcygpICsgXCIgOiBcIiArIG9mZnNldFkpO1xyXG5cclxuICAgICAgICAgICAgc2VsZWN0ZWRFbnRpdHkudXBkYXRlUG9zKHNlbGVjdGVkRW50aXR5LmdldFhQb3MoKSArIG9mZnNldFgsIHNlbGVjdGVkRW50aXR5LmdldFlQb3MoKSArIG9mZnNldFkpO1xyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBpZiAoIXRoaXMudGFyZ2V0LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd190b3BiYXJcIikuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIG1vdXNlIHBvaW50ZXIgaXMgb3V0c2lkZSB3aW5kb3cgLT4gZG8gbm90IHVwZGF0ZSB0aGUgcG9zaXRpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChlLmNsaWVudFggPCAwIHx8IGUuY2xpZW50WCA+IHRoaXMucHdkV2lkdGggfHwgZS5jbGllbnRZIDwgMCB8fCBlLmNsaWVudFkgPiB0aGlzLnB3ZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRYID0gZS5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFkgPSBlLm1vdmVtZW50WTtcclxuXHJcbiAgICAgICAgICAgIGlmICgodGhpcy50YXJnZXQuZ2V0WFBvcygpICsgbW92ZW1lbnRYICsgdGhpcy50YXJnZXQuZ2V0V2lkdGgoKSkgPiB0aGlzLnB3ZFdpZHRoICYmIG1vdmVtZW50WCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldC5nZXRYUG9zKCkgKyBtb3ZlbWVudFggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFggPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKHRoaXMudGFyZ2V0LmdldFlQb3MoKSArIG1vdmVtZW50WSArIHRoaXMudGFyZ2V0LmdldEhlaWdodCgpKSA+IHRoaXMucHdkSGVpZ2h0ICYmIG1vdmVtZW50WSA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldC5nZXRZUG9zKCkgKyBtb3ZlbWVudFkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC51cGRhdGVQb3ModGhpcy50YXJnZXQuZ2V0WFBvcygpICsgbW92ZW1lbnRYLCB0aGlzLnRhcmdldC5nZXRZUG9zKCkgKyBtb3ZlbWVudFkpO1xyXG4gICAgICAgIC8vfVxyXG4gICAgfVxyXG59XHJcblxyXG5QV0QucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBXRDtcclxuIiwiZnVuY3Rpb24gUGFuZWwoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHRoaXMudGV4dCA9IHNldHRpbmdzLnRleHQgPyBzZXR0aW5ncy50ZXh0IDogXCJubyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy5pY29uID0gc2V0dGluZ3MuaWNvbiA/IHNldHRpbmdzLmljb24gOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5ocmVmID0gXCIjXCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbFwiKTtcclxuXHJcbiAgICBsZXQgaWNvbkVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgaWNvbkVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uO1xyXG4gICAgaWNvbkVsZW0uYWx0ID0gXCJJY29uXCI7XHJcbiAgICBpY29uRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9faWNvblwiKTtcclxuXHJcbiAgICBsZXQgc3BhbkVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHNwYW5FbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsX19zcGFuXCIpO1xyXG4gICAgc3BhbkVsZW0udGV4dENvbnRlbnQgPSB0aGlzLnRleHQ7XHJcblxyXG4gICAgbGV0IGNsb3NlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgY2xvc2VFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIGNsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9fY2xvc2VcIik7XHJcbiAgICBjbG9zZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1jbG9zZS1yb3VuZFwiKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uRWxlbSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzcGFuRWxlbSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9zZUVsZW0pO1xyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuZ2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZDtcclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFuZWw7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoXCIuL0VudGl0eS5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFdpbmRvdyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgRW50aXR5LmNhbGwodGhpcywge1xyXG4gICAgICAgIFwieFBvc1wiOiBzZXR0aW5ncy54UG9zLFxyXG4gICAgICAgIFwieVBvc1wiOiBzZXR0aW5ncy55UG9zLFxyXG4gICAgICAgIFwiaXNTZWxlY3RlZFwiOiBzZXR0aW5ncy5pc1NlbGVjdGVkLFxyXG4gICAgICAgIFwiaXNEcmFnZ2luZ1wiOiBzZXR0aW5ncy5pc0RyYWdnaW5nXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmlkID0gc2V0dGluZ3MuaWQgPyBzZXR0aW5ncy5pZCA6IDA7XHJcblxyXG4gICAgLy90aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IFwiI1wiICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjE2Nzc3MjE1KS50b1N0cmluZygxNik7XHJcbiAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLnRvcEJhclRleHQgPSBzZXR0aW5ncy50b3BCYXJUZXh0ID8gc2V0dGluZ3MudG9wQmFyVGV4dCA6IFwiTm8gdGV4dFwiO1xyXG5cclxuICAgIHRoaXMudG9wQmFySWNvbiA9IHNldHRpbmdzLnRvcEJhckljb24gPyBzZXR0aW5ncy50b3BCYXJJY29uIDogXCJkZWZhdWx0SWNvbi5pY29cIjtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwibWVkaXVtXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd1wiKTtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB3aW5kb3dUb3BCYXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfdG9wYmFyXCIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dUb3BCYXJJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIHdpbmRvd1RvcEJhckljb24uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy50b3BCYXJJY29uO1xyXG4gICAgd2luZG93VG9wQmFySWNvbi5hbHQgPSBcIlRvcCBiYXIgaWNvblwiO1xyXG5cclxuICAgIGxldCB3aW5kb3dUb3BCYXJTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB3aW5kb3dUb3BCYXJTcGFuLnRleHRDb250ZW50ID0gdGhpcy50b3BCYXJUZXh0O1xyXG5cclxuICAgIGxldCB3aW5kb3dNaW5pbWl6ZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIHdpbmRvd01pbmltaXplRWxlbS5ocmVmID0gXCIjXCI7XHJcbiAgICB3aW5kb3dNaW5pbWl6ZUVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfbWluaW1pemVcIik7XHJcbiAgICB3aW5kb3dNaW5pbWl6ZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1taW51cy1yb3VuZFwiKTtcclxuXHJcbiAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5ocmVmID0gXCIjXCI7XHJcbiAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfcmVzaXplXCIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dDbG9zZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIHdpbmRvd0Nsb3NlRWxlbS5ocmVmID0gXCIjXCI7XHJcbiAgICB3aW5kb3dDbG9zZUVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY2xvc2VcIik7XHJcbiAgICB3aW5kb3dDbG9zZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1jbG9zZS1yb3VuZFwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB3aW5kb3dDb250ZW50LmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2NvbnRlbnRcIik7XHJcbiAgICB3aW5kb3dDb250ZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIFwiUFdELXdpbmRvd19jb250ZW50LVwiICsgdGhpcy5pZCk7XHJcbiAgICBpZiAodGhpcy5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICB3aW5kb3dDb250ZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB3aW5kb3dUb3BCYXJXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd1RvcEJhcldyYXBwZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfdG9wYmFyX3dyYXBwZXJcIik7XHJcblxyXG4gICAgd2luZG93VG9wQmFyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhckljb24pO1xyXG4gICAgd2luZG93VG9wQmFyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhclNwYW4pO1xyXG5cclxuICAgIHdpbmRvd1RvcEJhcldyYXBwZXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyKTtcclxuICAgIHdpbmRvd1RvcEJhcldyYXBwZXIuYXBwZW5kQ2hpbGQod2luZG93TWluaW1pemVFbGVtKTtcclxuICAgIHdpbmRvd1RvcEJhcldyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy53aW5kb3dSZXNpemVFbGVtKTtcclxuICAgIHdpbmRvd1RvcEJhcldyYXBwZXIuYXBwZW5kQ2hpbGQod2luZG93Q2xvc2VFbGVtKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJXcmFwcGVyKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd0NvbnRlbnQpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlIGFsbCBjbGFzc2VzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJpb24tYXJyb3ctZXhwYW5kXCIpO1xyXG4gICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiaW9uLWFycm93LXNocmlua1wiKTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLndpbmRvd1NpemUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInNtYWxsXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAzMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1hcnJvdy1leHBhbmRcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1lZGl1bVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDMwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gNDUwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tYXJyb3ctZXhwYW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJiaWdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSA0MDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDYwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LXNocmlua1wiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLVwiICsgdGhpcy53aW5kb3dTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogV2luZG93IGluaGVyaXRzIGZyb20gRW50aXR5XHJcbiAqL1xyXG5XaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuV2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFdpbmRvdztcclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SXNNaW5pbWl6ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLm1pbmltaXplZDtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5zZXRNaW5pbWl6ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5taW5pbWl6ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5taW5pbWl6ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWF4aW1pemVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1pbmltaXplXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWluaW1pemVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWF4aW1pemVcIik7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1cIiArIHRoaXMud2luZG93U2l6ZSk7XHJcblxyXG4gICAgc3dpdGNoKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcIm1lZGl1bVwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwiYmlnXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJiaWdcIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJzbWFsbFwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uT2JqLmNsb3NlKCk7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvdztcclxuIiwiY29uc3QgUFdEID0gcmVxdWlyZShcIi4vUFdELmpzXCIpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHB3ZCA9IG5ldyBQV0Qoe1wiY29udGFpbmVyXCI6IFwiYm9keVwifSk7XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBDaGF0KHNldHRpbmdzKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwibm8gY29udGFpbmVyXCI7XHJcblxyXG4gICAgbGV0IHVzZXJuYW1lID0gc2V0dGluZ3MudXNlcm5hbWUgPyBzZXR0aW5ncy51c2VybmFtZSA6IFwibmFqc3NpbW9uXCI7XHJcblxyXG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIik7XHJcbiAgICAvL3NvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBzb2NrZXRPcGVuRXZlbnQpO1xyXG4gICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgc29ja2V0TWVzc2FnZUV2ZW50KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIENoYXQgd3JhcHBlclxyXG4gICAgbGV0IGNoYXRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0V3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBNZXNzYWdlcyBkaXZcclxuICAgIGxldCBtZXNzYWdlc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBtZXNzYWdlc0Rpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdE1lc3NhZ2VzXCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVzc2FnZXNEaXYpO1xyXG5cclxuICAgIC8vIElucHV0IGZvcm1cclxuICAgIGxldCBpbnB1dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmcm9tXCIpO1xyXG4gICAgaW5wdXREaXYuY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dFwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGlucHV0RGl2KTtcclxuXHJcbiAgICAvLyBUZXh0YXJlYSBpbiB0aGUgaW5wdXQgZGl2XHJcbiAgICBsZXQgaW5wdXREaXZfdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XHJcbiAgICBpbnB1dERpdl90ZXh0YXJlYS5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X3RleHRhcmVhXCIpO1xyXG4gICAgLy8gZml4IHRvIG1ha2UgdGV4dGFyZWEgc2VsZWN0YWJsZVxyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNsaWNrKCk7XHJcbiAgICB9KTtcclxuICAgIGlucHV0RGl2LmFwcGVuZENoaWxkKGlucHV0RGl2X3RleHRhcmVhKTtcclxuXHJcbiAgICAvLyBCdXR0b24gaW4gdGhlIGlucHV0IGRpdlxyXG4gICAgbGV0IGlucHV0RGl2X2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBpbnB1dERpdl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJ1dHRvbkV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRfYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XHJcbiAgICBpbnB1dERpdl9idXR0b24udGV4dENvbnRlbnQgPSBcIlNlbmRcIjtcclxuICAgIGlucHV0RGl2LmFwcGVuZENoaWxkKGlucHV0RGl2X2J1dHRvbik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyIGRpdlxyXG4gICAgbGV0IGNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIGNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgLypcclxuICAgIGZ1bmN0aW9uIHNvY2tldE9wZW5FdmVudChlKSB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgfVxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIHNvY2tldE1lc3NhZ2VFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgbGV0IGNoYXRNZXNzYWdlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi5jbGFzc0xpc3QuYWRkKFwiY2hhdE1lc3NhZ2VcIik7XHJcblxyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSBcIltcIiArIHJlc3BvbnNlLnR5cGUgKyBcIl0gXCI7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IHJlc3BvbnNlLnVzZXJuYW1lICsgXCI6IFwiO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSByZXNwb25zZS5kYXRhO1xyXG5cclxuICAgICAgICBtZXNzYWdlc0Rpdi5hcHBlbmRDaGlsZChjaGF0TWVzc2FnZVNwYW4pO1xyXG5cclxuICAgICAgICBtZXNzYWdlc0Rpdi5zY3JvbGxUb3AgPSBtZXNzYWdlc0Rpdi5zY3JvbGxIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnV0dG9uRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGlucHV0RGl2X3RleHRhcmVhLnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNdXN0IGVudGVyIGEgbWVzc2FnZSFcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dERpdl90ZXh0YXJlYS52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiIDogdmFsdWUsXHJcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNoYXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XHJcbiIsImNvbnN0IENoYXQgPSByZXF1aXJlKFwiLi9DaGF0LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ2hhdFN0YXJ0KHNldHRpbmdzKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwibm8gY29udGFpbmVyXCI7XHJcblxyXG4gICAgdGhpcy5jaGF0T2JqID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gV3JhcHBlclxyXG4gICAgbGV0IGNoYXRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0V3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBDaGF0IHN0YXJ0IGhlYWRlclxyXG4gICAgbGV0IGNoYXRTdGFydEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXIuY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydEhlYWRlclwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXRTdGFydEhlYWRlcik7XHJcblxyXG4gICAgbGV0IGNoYXRTdGFydEhlYWRlclNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIGNoYXRTdGFydEhlYWRlclNwYW4udGV4dENvbnRlbnQgPSBcIlNVUEVSQ0hBVFwiO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyLmFwcGVuZENoaWxkKGNoYXRTdGFydEhlYWRlclNwYW4pO1xyXG5cclxuICAgIC8vIENoYXQgbmFtZSBpbnB1dFxyXG4gICAgbGV0IGNoYXROYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAvLyBmaXggdG8gbWFrZSBpbnB1dCBzZWxlY3RhYmxlXHJcbiAgICBjaGF0TmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgICBjaGF0TmFtZUlucHV0LnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiRW50ZXIgbmFtZSEhIVwiKTtcclxuICAgIGNoYXROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydE5hbWVJbnB1dFwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXROYW1lSW5wdXQpO1xyXG5cclxuICAgIC8vIENoYXQgbmFtZSBidXR0b25cclxuICAgIGxldCBjaGF0TmFtZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0TmFtZUJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU3RhcnQgY2hhdHRpbmchISEhISEhIVwiO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdE5hbWVCdXR0b24pO1xyXG5cclxuICAgIC8vIENvbnRhaW5lciBkaXZcclxuICAgIGxldCBjb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBjb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGNoYXROYW1lSW5wdXQudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVudGVyIGEgbmFtZSFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXR0aW5ncy51c2VybmFtZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBjaGF0V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGF0T2JqID0gbmV3IENoYXQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGF0U3RhcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5jaGF0T2JqKSB7XHJcbiAgICAgICAgdGhpcy5jaGF0T2JqLmNsb3NlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhdFN0YXJ0O1xyXG4iLCJmdW5jdGlvbiBDYXJkKHZhbHVlKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICBsZXQgY2FyZFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDYXJkVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgY2FyZFRlbXBsYXRlRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUoY2FyZFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIC8vIFRoZSBjYXJkRWxlbSBpcyB0aGUgZWxlbWVudCB3cmFwcGluZyB0aGUgdHdvIGltYWdlc1xyXG4gICAgdGhpcy5jYXJkRWxlbSA9IGNhcmRUZW1wbGF0ZUZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktY2FyZFwiKTtcclxuICAgIHRoaXMuY2FyZEVsZW0uc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCB0aGlzLnZhbHVlKTtcclxuXHJcbiAgICAvLyBUaGUgY292ZXJJbWFnZSBpcyB0aGUgcXVlc3Rpb24gbWFyayBhYm92ZSB0aGUgY2FyZCBpbWFnZVxyXG4gICAgdGhpcy5jb3ZlckltYWdlID0gdGhpcy5jYXJkRWxlbS5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkX2JhY2tcIik7XHJcbiAgICB0aGlzLmNvdmVySW1hZ2Uuc3JjID0gXCJpbWFnZS9cIiArIHRoaXMudmFsdWVbMF0gKyBcIi5wbmdcIjtcclxuXHJcbiAgICAvLyBUaGUgY2FyZEltYWdlIGlzIHRoZSBpbWFnZSBvZiB0aGUgbWVtb3J5IGNhcmRcclxuICAgIHRoaXMuY2FyZEltYWdlID0gdGhpcy5jYXJkRWxlbS5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkX2Zyb250XCIpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdW5pcXVlIHZhbHVlIGZvciB0aGlzIGNhcmRcclxuICogVGhlIGNhcmQgaWRlbnRpZmllclxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogRmxpcHMgdGhlIGNhcmRcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmlzRmxpcHBlZCkge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRJc0ZsaXBwZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRmxpcHBlZDtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuc2V0SXNDb21wbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSB2YWx1ZTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcclxuICAgIHRoaXMuY2FyZEVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRDYXJkRWxlbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZEVsZW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZDtcclxuIiwiY29uc3QgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDYXJkcyhuck9mQ2FyZHMpIHtcclxuICAgIHRoaXMuY2FyZHMgPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuck9mQ2FyZHMgKyAxOyBpKyspIHtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAxKSk7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2h1ZmZsZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgbGV0IHRlbXAgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbaV0gPSB0aGlzLmNhcmRzW2pdO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbal0gPSB0ZW1wO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgY2FyZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZVxyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgbGV0IGNhcmQ7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FyZHNbaV0uZ2V0VmFsdWUoKSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgY2FyZCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBmcmFnbWVudCBjb250YWluaW5nIHRoZSBjYXJkIGRpdnMgYW5kIGltYWdlc1xyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmRzRnJhZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNhcmRzRnJhZyA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNhcmRFbGVtID0gdGhpcy5jYXJkc1tpXS5nZXRDYXJkRWxlbSgpO1xyXG4gICAgICAgIGNhcmRzRnJhZy5hcHBlbmRDaGlsZChjYXJkRWxlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmRzRnJhZztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkcztcclxuIiwiY29uc3QgTWVtb3J5R2FtZUJvYXJkID0gcmVxdWlyZShcIi4vTWVtb3J5R2FtZUJvYXJkLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTWVtb3J5R2FtZShzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIiMxMjNcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIFdyYXBwZXJcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVdyYXBwZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5V3JhcHBlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gbWVtb3J5V3JhcHBlckZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktd3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBIZWFkZXJcclxuICAgIGxldCBtZW1vcnlIZWFkZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5SGVhZGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5SGVhZGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUhlYWRlciA9IG1lbW9yeUhlYWRlckZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlIZWFkZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUhlYWRlcik7XHJcblxyXG4gICAgLy8gUGFpciBmb3JtXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1UZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJGb3JtVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtID0gbWVtb3J5UGFpckZvcm1GcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1cIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVBhaXJGb3JtKTtcclxuXHJcbiAgICAvLyBSYWRpbyBpbnB1dHNcclxuICAgIGxldCBtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpclJhZGlvVGVtcGxhdGVcIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gODsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJSYWRpb0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJSYWRpb1RlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgICAgICBsZXQgbWVtb3J5UGFpckxhYmVsID0gbWVtb3J5UGFpclJhZGlvRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhaXJSYWRpb0xhYmVsXCIpO1xyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyUmFkaW8gPSBtZW1vcnlQYWlyTGFiZWwucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBtZW1vcnlQYWlyTGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaSArIFwiIHBhaXJzXCIpKTtcclxuICAgICAgICAvLyBGaXggdG8gbWFrZSByYWRpbyBpbnB1dHMgY2xpY2thYmxlXHJcbiAgICAgICAgbWVtb3J5UGFpckxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtZW1vcnlQYWlyUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhaXJGb3JtLmFwcGVuZENoaWxkKG1lbW9yeVBhaXJMYWJlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRm9ybSBidXR0b25cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b24gPSBtZW1vcnlQYWlyRm9ybUJ1dHRvbkZyYWcucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcclxuICAgIG1lbW9yeVBhaXJGb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZW1vcnlQYWlyRm9ybUJ1dHRvbkV2ZW50KTtcclxuXHJcbiAgICBtZW1vcnlQYWlyRm9ybS5hcHBlbmRDaGlsZChtZW1vcnlQYWlyRm9ybUJ1dHRvbik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyXHJcbiAgICBsZXQgbWVtb3J5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IG5yT2ZQYWlycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm0gaW5wdXQ6Y2hlY2tlZFwiKS52YWx1ZTtcclxuXHJcbiAgICAgICAgbWVtb3J5V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICBzZXR0aW5ncy5uck9mUGFpcnMgPSBwYXJzZUludChuck9mUGFpcnMpO1xyXG4gICAgICAgIG5ldyBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge31cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5R2FtZTtcclxuIiwiY29uc3QgQ2FyZHMgPSByZXF1aXJlKFwiLi9DYXJkcy5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIE1lbW9yeUdhbWVCb2FyZChzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIiNjb29sXCI7XHJcblxyXG4gICAgbGV0IG5yT2ZQYWlycyA9IHNldHRpbmdzLm5yT2ZQYWlycyA/IHNldHRpbmdzLm5yT2ZQYWlycyA6IDQ7XHJcblxyXG4gICAgbGV0IGNhcmRzID0gbmV3IENhcmRzKG5yT2ZQYWlycyk7XHJcblxyXG4gICAgbGV0IHNjb3JlID0gMDtcclxuXHJcbiAgICBsZXQgZ2FtZVRpbWVyID0gMDtcclxuXHJcbiAgICBsZXQgYXR0ZW1wdHMgPSAwO1xyXG5cclxuICAgIGxldCBmaXJzdENhcmQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgbGV0IHNlY29uZENhcmQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgbGV0IGlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgZ2FtZVRpbWVySW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aW1lciwgMTAwMCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFTGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBNZW1vcnkgd3JhcHBlclxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V3JhcHBlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlXcmFwcGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJEaXYgPSBtZW1vcnlXcmFwcGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS13cmFwcGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWVtb3J5V3JhcHBlckNsaWNrRXZlbnQpO1xyXG5cclxuICAgIC8vIEhlYWRlclxyXG4gICAgbGV0IG1lbW9yeUhlYWRlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlIZWFkZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlIZWFkZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlIZWFkZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyID0gbWVtb3J5SGVhZGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUhlYWRlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5SGVhZGVyKTtcclxuXHJcbiAgICAvLyBNZW1vcnkgcGFuZWxcclxuICAgIGxldCBtZW1vcnlQYW5lbFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbFRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFuZWxUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFuZWxEaXYgICAgICAgICAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktcGFuZWxcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW4gPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbEF0dGVtcHRzU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbFRpbWVTcGFuICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsVGltZVNwYW5cIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxNZXNzYWdlU3BhbiAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlQYW5lbERpdik7XHJcblxyXG4gICAgLy8gTWVtb3J5IGNhcmRzXHJcbiAgICBsZXQgbWVtb3lDYXJkc1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDYXJkc1RlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUNhcmRzRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5Q2FyZHNUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5Q2FyZHNEaXYgPSBtZW1vcnlDYXJkc0ZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktY2FyZHNcIik7XHJcbiAgICBtZW1vcnlDYXJkc0Rpdi5hcHBlbmRDaGlsZChjYXJkcy5nZXRDYXJkc0ZyYWcoKSk7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUNhcmRzRGl2KTtcclxuXHJcbiAgICAvLyBNZW1vcnkgY29udGFpbmVyXHJcbiAgICBsZXQgbWVtb3J5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHRpbWVyKCkge1xyXG4gICAgICAgIGdhbWVUaW1lciArPSAxO1xyXG5cclxuICAgICAgICBtZW1vcnlQYW5lbEF0dGVtcHRzU3Bhbi50ZXh0Q29udGVudCA9IFwiQXR0ZW1wdHM6IFwiICsgYXR0ZW1wdHM7XHJcbiAgICAgICAgbWVtb3J5UGFuZWxUaW1lU3Bhbi50ZXh0Q29udGVudCA9IFwiVGltZTogXCIgKyBnYW1lVGltZXIgKyBcIiBzZWNvbmRzXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWVtb3J5V3JhcHBlckNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgaXMgY3VycmVudGx5IGNoZWNraW5nIGFuc3dlciAtPiBleGl0IGZ1bmN0aW9uXHJcbiAgICAgICAgICogKHdhaXRpbmcgZm9yIHRpbWVyIHRvIGZpbmlzaClcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaXNDaGVja2luZ0Fuc3dlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW1nRWxlbSA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBsZXQgYUVsZW0gPSBpbWdFbGVtLm5vZGVOYW1lID09PSBcIklNR1wiID8gaW1nRWxlbS5wYXJlbnROb2RlIDogaW1nRWxlbTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0gYUVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNhcmQgPSBjYXJkcy5nZXRDYXJkKHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGNhcmQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuZ2V0SXNGbGlwcGVkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmZsaXAoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RDYXJkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdENhcmQgPSBjYXJkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRDYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tBbnN3ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja0Fuc3dlcigpIHtcclxuICAgICAgICBpc0NoZWNraW5nQW5zd2VyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgYXR0ZW1wdHMgKz0gMTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaXJzdENhcmQuZ2V0VmFsdWUoKVswXSA9PT0gc2Vjb25kQ2FyZC5nZXRWYWx1ZSgpWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuYWRkQ2xhc3MoXCJNZW1vcnktY2FyZC0tY29ycmVjdFwiKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuYWRkQ2xhc3MoXCJNZW1vcnktY2FyZC0tY29ycmVjdFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29yZSArPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgc2NvcmUgaXMgZXF1YWwgdG8gbWF4aW11bSBhbW91bnQgb2YgcGFpcnMgLT4gdGhlIGdhbWUgaXMgY29tcGxldGVcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3JlID09PSBuck9mUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdhbWVUaW1lckludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ID0gXCJZb3UgY29tcGxldGVkIHRoZSBnYW1lIVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuZmxpcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaXJzdENhcmQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHNlY29uZENhcmQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5R2FtZUJvYXJkO1xyXG4iXX0=
