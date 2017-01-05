(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Every application in the PWD must implement Application
 */
function Application(settings = {}) {
    this.api = settings.api ? settings.api : undefined;
}

Application.prototype.close = function() {
    console.log("WARNING! Application must implement function close.");
}

module.exports = Application;

},{}],2:[function(require,module,exports){
/**
 * Window and icon inherits from entity
 */

function Entity(settings = {}) {
    this.width = settings.width ? settings.width : 100;

    this.height = settings.height ? settings.height : 100;

    this.xPos = settings.xPos ? settings.xPos : 100;

    this.yPos = settings.yPos ? settings.yPos : 100;

    this.zIndex = settings.zIndex ? settings.zIndex : 0;

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

},{}],3:[function(require,module,exports){
const Entity = require("./Entity.js");

function Icon(settings = {}) {
    Entity.call(this, {
        "xPos": settings.xPos,
        "yPos": settings.yPos,
        "zIndex": settings.zIndex,
        "isSelected": settings.isSelected,
        "isDragging": settings.isDragging
    });

    this.iconText        = settings.iconText ? settings.iconText : "No icon text";

    this.width           = settings.width ? settings.width : 10;

    this.height          = settings.height ? settings.height : 10;

    this.applicationName = settings.applicationName ? settings.applicationName : "";

    this.iconImage       = settings.iconImage ? settings.iconImage : "defaultIcon.ico";

    this.windowSize      = settings.windowSize ? settings.windowSize : "small";

    this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : "";

    this.container       = initializeContainer.bind(this)();

    this.correctGridPosition();

    function initializeContainer() {
        let container = document.createElement("a");
        container.setAttribute("href", "#");
        container.classList.add("PWD-icon");
        container.style.left = this.xPos + "px";
        container.style.top = this.yPos + "px";
        container.style.zIndex = this.zIndex;

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
    this.xPos = this.xPos - this.xPos % 100;
    this.yPos = 5 + this.yPos - this.yPos % 100;

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

},{"./Entity.js":2}],4:[function(require,module,exports){
/**
 * The API is a way for applications to communicate with the PWD
 */
function MyAPI(settings = {}) {
    this.pwdContainer = settings.pwdContainer ? settings.pwdContainer : undefined;
}

MyAPI.prototype.setPwdBackground = function(index) {
    this.pwdContainer.className = "";

    this.pwdContainer.classList.add("main--background-" + index);
}

MyAPI.prototype.test = function() {
    console.log("api test");
}

module.exports = MyAPI;

},{}],5:[function(require,module,exports){
const Entity = require("./Entity.js");

function MyWindow(settings = {}) {
    /**
     * Properties
     */
    Entity.call(this, {
        "xPos": settings.xPos,
        "yPos": settings.yPos,
        "zIndex": settings.zIndex,
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

    this.correctPosition = function() {
        let test = this.id < 10 ? "0" : "";
        test += this.id;

        this.xPos = (100+200*test[0] + 15 * this.id);
        this.yPos = (20 + 30 * (this.id - test[0]*10));

        this.container.style.left = this.xPos + "px";
        this.container.style.top = this.yPos + "px";
    }

    this.correctPosition();
}

/**
 * Window inherits from Entity
 */
MyWindow.prototype = Object.create(Entity.prototype);
MyWindow.prototype.constructor = MyWindow;

MyWindow.prototype.getMinimized = function() {
    return this.minimized;
}

MyWindow.prototype.setMinimized = function(value) {
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

MyWindow.prototype.resize = function() {
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

MyWindow.prototype.close = function() {
    this.applicationObj.close();
}

MyWindow.prototype.getId = function() {
    return this.id;
}

module.exports = MyWindow;

},{"./Entity.js":2}],6:[function(require,module,exports){
const Window = require("./MyWindow.js");
const Icon = require("./Icon.js");
const Panel = require("./Panel.js");
const Application = require("./Application.js");
const MyAPI = require("./MyAPI.js");
const Memory = require("./apps/Memory/MemoryGame.js");
const Chat = require("./apps/Chat/ChatStart.js");
const Settings = require("./apps/Settings/Settings.js");

function PWD(settings = {}) {

    initialize();

    /**
     * Initialize default behaviour/properties
     */
    function initialize() {
        /**
         * Properties
         */
        this.windows = [];

        this.panels = [];

        this.icons = [];

        this.applications = [];

        this.pwdWidth = "1600px";

        this.pwdHeight = "900px";

        this.api = undefined;

        /**
         * Elements
         */
        this.container = document.createElement("main");
        this.container.style.width = this.pwdWidth;
        this.container.style.height = this.pwdHeight;

        this.startButton = document.createElement("a");
        this.startButton.classList.add("PWD-bottomBar_startButton");

        this.start = document.createElement("div");
        this.start.classList.add("PWD-start");
        this.start.classList.add("PWD-start--hide");

        this.start_message = document.createElement("span");
        this.start_message.classList.add("PWD-start__message");
        this.start_message.textContent = "Hej!";

        this.start.appendChild(this.start_message);

        this.clockButton = document.createElement("a");
        this.clockButton.classList.add("PWD-bottomBar_clockButton");

        function updateClockButton() {
            let d = new Date();

            this.clockButton.textContent = d.getHours() + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
        }

        updateClockButton();

        setInterval(updateClockButton, 30000);

        this.clock = document.createElement("div");
        this.clock.classList.add("PWD-clock");
        this.clock.classList.add("PWD-clock--hide");

        this.clock_bigClock = document.createElement("span");
        this.clock_bigClock.classList.add("PWD-clock__bigTime");

        this.clock_date = document.createElement("span");
        this.clock_date.classList.add("PWD-clock__date");

        this.clock.appendChild(this.clock_bigClock);
        this.clock.appendChild(this.clock_date);

        function updateClockBig() {
            let d = new Date();

            this.clock_bigClock.textContent = d.getHours() + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ":" + (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());

            let monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "July", "Augusti", "September", "Oktober", "November", "December"];

            this.clock_date.textContent = "den " + d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
        }

        setInterval(updateClockBig, 1000);

        this.panelsWrapper = document.createElement("div");
        this.panelsWrapper.classList.add("PWD-bottomBar_panelsWrapper");

        this.bottomBar = document.createElement("div");
        this.bottomBar.classList.add("PWD-bottomBar");

        this.bottomBar.appendChild(this.startButton);
        this.bottomBar.appendChild(this.panelsWrapper);
        this.bottomBar.appendChild(this.clockButton);

        this.container.appendChild(this.start);
        this.container.appendChild(this.clock);
        this.container.appendChild(this.bottomBar);

        document.querySelector(settings.container).appendChild(this.container);

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
        this.icons.push( new Icon({
            "iconText": "Settings",
            "applicationName": "Settings",
            "xPos": 10,
            "yPos": 450,
            "windowSize": "medium"
        }) );

        /**
         * Append the icons to the container
         */
        for (let i = 0; i < this.icons.length; i++) {
            this.container.appendChild(this.icons[i].getContainer());
        }

        for (let i = 0; i < 4; i++) {
            //launchApplication(this.icons[1]);
        }

        launchApplication(this.icons[4]);

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
         * If target is a window
         */
        if (this.target instanceof Window) {
            let index = this.windows.indexOf(this.target);

            /**
             * Set the window as selected
             */
            selectEntity(this.windows[index], this.windows);

            /**
             * Mark the associated panel as selected
             */
            selectEntity(this.panels[index], this.panels);

            /**
             * Deselect icon
             */
            if (this.icons[0]) {
                this.icons[0].setIsSelected(false);
            }

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

        }

        /**
         * If target is an icon
         */
        if (this.target instanceof Icon) {
            /**
             * Set the icon as selected
             */
            selectEntity(this.target, this.icons);

            /**
             * Deselect the window and associated panel
             */
            if (this.windows[0]) {
                this.windows[0].setIsSelected(false);

                this.panels[0].setIsSelected(false);
            }

            window.addEventListener("mousemove", entityMoveEvent);

            e.preventDefault();

            return;
        }
    }

    function mouseupEvent(e) {
        let targetTemp = findTarget(e.target);

        if (this.target !== "clock" && this.target !== "clockButton") {
            if (!this.clock.classList.contains("PWD-clock--hide")) {
                this.clock.classList.add("PWD-clock--hide");
            }
        }

        if (this.target !== "start" && this.target !== "startButton") {
            if (!this.start.classList.contains("PWD-start--hide")) {
                this.start.classList.add("PWD-start--hide");
            }
        }

        /**
         * If target is a window
         */
        if (this.target instanceof Window) {
            this.target.setIsDragging(false);

            window.removeEventListener("mousemove", entityMoveEvent);
        }

        if (targetTemp === undefined) {
            /**
             * Deselect everything
             */
            if (this.windows[0]) {
                this.windows[0].setIsSelected(false);

                this.panels[0].setIsSelected(false);
            }

            if (this.icons[0]) {
                this.icons[0].setIsSelected(false);
            }

            return;
        }

        /**
         * If target is a panel
         */
        if (this.target instanceof Panel) {
            let index = this.panels.indexOf(this.target);

            if (this.panels[index].getIsSelected()) {
                this.panels[index].setIsSelected(false);

                this.windows[index].setIsSelected(false);

                this.windows[index].setMinimized(true);

                return;
            } else {
                /**
                 * Set the panel as selected
                 */
                selectEntity(this.panels[index], this.panels);

                /**
                 * Mark the associated window as selected
                 */
                selectEntity(this.windows[index], this.windows);

                this.windows[0].setMinimized(false);
            }
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
        if (this.target === "startButton") {
            this.start.classList.toggle("PWD-start--hide");

            return;
        }

        if (this.target === "clockButton") {
            this.clock.classList.toggle("PWD-clock--hide");

            return;
        }

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

            /**
             * Deselect the last active entity
             */
            if (arr[1]) {
                arr[1].setIsSelected(false);
            }

            /**
             * Select the new entity
             */
            arr[0].setIsSelected(true);

            /**
             * The entities are given z-index
             */
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] instanceof Icon) {
                    arr[i].getContainer().style.zIndex = arr.length - i;
                } else {
                    arr[i].getContainer().style.zIndex = this.icons.length + arr.length - i;
                }
            }

            /**
             * The bottom bar, start and clock should always have the highest z-index
             */
            this.bottomBar.style.zIndex = this.windows.length + this.icons.length + 2;
            this.start.style.zIndex = this.windows.length + this.icons.length + 1;
            this.clock.style.zIndex = this.windows.length + this.icons.length + 1;
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

        /**
         * When a panel is removed, make sure the other panels' width is correct
         */
         calculatePanelWidth();
    }

    /**
     * Check if a given target exists in a window, panel or icon
     */
    function findTarget(target) {
        if (this.startButton.contains(target)) {
            return "startButton";
        }

        if (this.start.contains(target)) {
            return "start";
        }

        if (this.clockButton.contains(target)) {
            return "clockButton";
        }

        if (this.clock.contains(target)) {
            return "clock";
        }

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

    function calculatePanelWidth() {
        if (188 * this.panels.length + 100 > parseInt(this.pwdWidth)) {
            for (let i = 0; i < this.panels.length; i++) {
                this.panels[i].getContainer().style.width = this.panelsWrapper.offsetWidth / this.panels.length - 8 + "px";
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
            "zIndex": this.icons.length,
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

        this.panelsWrapper.appendChild(pwdPanel.getContainer());

        /**
         * When a new panel is made, make sure width is correct
         */
        calculatePanelWidth();

        /**
         * Start the application and append it to the newly created window
         */
        let applicationName = iconObj.getApplicationName();

        let applicationObj = undefined;

        if (applicationName === "Memory") {
            applicationObj = new Memory({
                "container": "#PWD-window_content-" + id
            });
        } else if (applicationName === "Chat") {
            applicationObj = new Chat({
                "container": "#PWD-window_content-" + id
            });
        } else if (applicationName === "Settings") {
            applicationObj = new Settings({
                "container": "#PWD-window_content-" + id,
                "api": getApi()
            });
        }

        if (!applicationObj instanceof Application) {
            error("The application is not an instance of Application.");
        }

        this.applications.push(applicationObj);
    }

    function getApi() {
        if (this.api instanceof MyAPI) {
            return this.api;
        }

        this.api = new MyAPI({
            "pwdContainer": this.container
        });

        return this.api;
    }

    /**
     * Update the position of the selected target
     */
    function entityMoveEvent(e) {
        /**
         * If there is an active entity -> update its position
         */
        if (this.target) {
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
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;

},{"./Application.js":1,"./Icon.js":3,"./MyAPI.js":4,"./MyWindow.js":5,"./Panel.js":7,"./apps/Chat/ChatStart.js":10,"./apps/Memory/MemoryGame.js":13,"./apps/Settings/Settings.js":15}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
const PWD = require("./PWD.js");

window.addEventListener("load", function() {
    let pwd = new PWD({"container": "body"});
});

},{"./PWD.js":6}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
const Application = require("../../Application.js");
const Chat = require("./Chat.js");

function ChatStart(settings = {}) {
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

ChatStart.prototype = Object.create(Application.prototype);
ChatStart.prototype.constructor = ChatStart;

ChatStart.prototype.close = function() {
    if (this.chatObj) {
        this.chatObj.close();
    }
}

module.exports = ChatStart;

},{"../../Application.js":1,"./Chat.js":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./Card.js":11}],13:[function(require,module,exports){
const Application = require("../../Application.js");
const MemoryGameBoard = require("./MemoryGameBoard.js");

function MemoryGame(settings = {}) {
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

MemoryGame.prototype = Object.create(Application.prototype);
MemoryGame.prototype.constructor = MemoryGame;

MemoryGame.prototype.close = function() {}

module.exports = MemoryGame;

},{"../../Application.js":1,"./MemoryGameBoard.js":14}],14:[function(require,module,exports){
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

},{"./Cards.js":12}],15:[function(require,module,exports){
const Application = require("../../Application.js");

function Settings(settings = {}) {
    Application.call(this, {
       "api": settings.api
    });

    /**
     * Elements
     */
    this.container = settings.container ? settings.container : undefined;

    this.windowDiv = document.querySelector(this.container);
    this.windowDiv.classList.add("settings");

    /**
     * Background
     */
    this.backgroundForm = document.createElement("form");
    this.backgroundForm.classList.add("settingsBackgroundForm");

    for (let i = 0; i < 6; i++) {
        let formLabel = document.createElement("label");
        formLabel.setAttribute("for", "backgroundForm" + i);

        let formRadio = document.createElement("input");
        formRadio.setAttribute("type", "radio");
        formRadio.setAttribute("value", i);
        formRadio.setAttribute("name", "background");
        formRadio.setAttribute("id", "backgroundForm" + i);

        let formImage = document.createElement("img");
        formImage.setAttribute("src", "./image/0.png");
        formImage.setAttribute("alt", "Background");

        formLabel.appendChild(formRadio);
        formLabel.appendChild(formImage);

        this.backgroundForm.appendChild(formLabel);
    };

    this.windowDiv.appendChild(this.backgroundForm);

    this.api.setPwdBackground(0);
    this.api.setPwdBackground(1);
    this.api.setPwdBackground(2);
}

Settings.prototype = Object.create(Application.prototype);
Settings.prototype.constructor = Settings;

module.exports = Settings;

},{"../../Application.js":1}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwbGljYXRpb24uanMiLCJjbGllbnQvc291cmNlL2pzL0VudGl0eS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvTXlBUEkuanMiLCJjbGllbnQvc291cmNlL2pzL015V2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZUJvYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL1NldHRpbmdzL1NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzd0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogRXZlcnkgYXBwbGljYXRpb24gaW4gdGhlIFBXRCBtdXN0IGltcGxlbWVudCBBcHBsaWNhdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gQXBwbGljYXRpb24oc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5hcGkgPSBzZXR0aW5ncy5hcGkgPyBzZXR0aW5ncy5hcGkgOiB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJXQVJOSU5HISBBcHBsaWNhdGlvbiBtdXN0IGltcGxlbWVudCBmdW5jdGlvbiBjbG9zZS5cIik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwbGljYXRpb247XHJcbiIsIi8qKlxyXG4gKiBXaW5kb3cgYW5kIGljb24gaW5oZXJpdHMgZnJvbSBlbnRpdHlcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbnRpdHkoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy53aWR0aCA9IHNldHRpbmdzLndpZHRoID8gc2V0dGluZ3Mud2lkdGggOiAxMDA7XHJcblxyXG4gICAgdGhpcy5oZWlnaHQgPSBzZXR0aW5ncy5oZWlnaHQgPyBzZXR0aW5ncy5oZWlnaHQgOiAxMDA7XHJcblxyXG4gICAgdGhpcy54UG9zID0gc2V0dGluZ3MueFBvcyA/IHNldHRpbmdzLnhQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy55UG9zID0gc2V0dGluZ3MueVBvcyA/IHNldHRpbmdzLnlQb3MgOiAxMDA7XHJcblxyXG4gICAgdGhpcy56SW5kZXggPSBzZXR0aW5ncy56SW5kZXggPyBzZXR0aW5ncy56SW5kZXggOiAwO1xyXG5cclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHNldHRpbmdzLmlzU2VsZWN0ZWQgPyBzZXR0aW5ncy5pc1NlbGVjdGVkIDogZmFsc2U7XHJcblxyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gc2V0dGluZ3MuaXNEcmFnZ2luZyA/IHNldHRpbmdzLmlzRHJhZ2dpbmcgOiBmYWxzZTtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRXaWR0aCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5oZWlnaHQ7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0WFBvcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueFBvcztcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRZUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy55UG9zO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnVwZGF0ZVBvcyA9IGZ1bmN0aW9uKHhQb3MsIHlQb3MpIHtcclxuICAgIHRoaXMueFBvcyA9IHhQb3M7XHJcbiAgICB0aGlzLnlQb3MgPSB5UG9zO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuc2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5zZXRJc0RyYWdnaW5nID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiZHJhZ2dpbmdcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkcmFnZ2luZ1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRJc0RyYWdnaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0RyYWdnaW5nO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eTtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZShcIi4vRW50aXR5LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gSWNvbihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBFbnRpdHkuY2FsbCh0aGlzLCB7XHJcbiAgICAgICAgXCJ4UG9zXCI6IHNldHRpbmdzLnhQb3MsXHJcbiAgICAgICAgXCJ5UG9zXCI6IHNldHRpbmdzLnlQb3MsXHJcbiAgICAgICAgXCJ6SW5kZXhcIjogc2V0dGluZ3MuekluZGV4LFxyXG4gICAgICAgIFwiaXNTZWxlY3RlZFwiOiBzZXR0aW5ncy5pc1NlbGVjdGVkLFxyXG4gICAgICAgIFwiaXNEcmFnZ2luZ1wiOiBzZXR0aW5ncy5pc0RyYWdnaW5nXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmljb25UZXh0ICAgICAgICA9IHNldHRpbmdzLmljb25UZXh0ID8gc2V0dGluZ3MuaWNvblRleHQgOiBcIk5vIGljb24gdGV4dFwiO1xyXG5cclxuICAgIHRoaXMud2lkdGggICAgICAgICAgID0gc2V0dGluZ3Mud2lkdGggPyBzZXR0aW5ncy53aWR0aCA6IDEwO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ICAgICAgICAgID0gc2V0dGluZ3MuaGVpZ2h0ID8gc2V0dGluZ3MuaGVpZ2h0IDogMTA7XHJcblxyXG4gICAgdGhpcy5hcHBsaWNhdGlvbk5hbWUgPSBzZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgPyBzZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgOiBcIlwiO1xyXG5cclxuICAgIHRoaXMuaWNvbkltYWdlICAgICAgID0gc2V0dGluZ3MuaWNvbkltYWdlID8gc2V0dGluZ3MuaWNvbkltYWdlIDogXCJkZWZhdWx0SWNvbi5pY29cIjtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgICAgICA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJzbWFsbFwiO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogXCJcIjtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciAgICAgICA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1pY29uXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnpJbmRleCA9IHRoaXMuekluZGV4O1xyXG5cclxuICAgICAgICBsZXQgaWNvbkltYWdlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgaWNvbkltYWdlRWxlbS5zcmMgPSBcIi4vaW1hZ2UvXCIgKyB0aGlzLmljb25JbWFnZTtcclxuXHJcbiAgICAgICAgbGV0IGljb25UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgaWNvblRleHQudGV4dENvbnRlbnQgPSB0aGlzLmljb25UZXh0O1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkltYWdlRWxlbSk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25UZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEljb24gaW5oZXJpdHMgZnJvbSBFbnRpdHlcclxuICovXHJcbkljb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuSWNvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJY29uO1xyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0QXBwbGljYXRpb25OYW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hcHBsaWNhdGlvbk5hbWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJY29ucyBhcmUgc3VwcG9zZWQgdG8gYmUgYWxpZ25lZCBpbiBhIGdyaWQgc3lzdGVtLlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGNvcnJlY3RzIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIG9mIHRoZSBpY29uLCBtYWtpbmcgaXQgYWxpZ24gdG8gdGhlIG5lYXJlc3QgZ3JpZFxyXG4gKi9cclxuSWNvbi5wcm90b3R5cGUuY29ycmVjdEdyaWRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy54UG9zID0gdGhpcy54UG9zIC0gdGhpcy54UG9zICUgMTAwO1xyXG4gICAgdGhpcy55UG9zID0gNSArIHRoaXMueVBvcyAtIHRoaXMueVBvcyAlIDEwMDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRCYWNrZ3JvdW5kQ29sb3IgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvblRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmljb25UZXh0O1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJY29uSW1hZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmljb25JbWFnZTtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2luZG93U2l6ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xyXG4iLCIvKipcclxuICogVGhlIEFQSSBpcyBhIHdheSBmb3IgYXBwbGljYXRpb25zIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIFBXRFxyXG4gKi9cclxuZnVuY3Rpb24gTXlBUEkoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5wd2RDb250YWluZXIgPSBzZXR0aW5ncy5wd2RDb250YWluZXIgPyBzZXR0aW5ncy5wd2RDb250YWluZXIgOiB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbk15QVBJLnByb3RvdHlwZS5zZXRQd2RCYWNrZ3JvdW5kID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIHRoaXMucHdkQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiXCI7XHJcblxyXG4gICAgdGhpcy5wd2RDb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1haW4tLWJhY2tncm91bmQtXCIgKyBpbmRleCk7XHJcbn1cclxuXHJcbk15QVBJLnByb3RvdHlwZS50ZXN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImFwaSB0ZXN0XCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15QVBJO1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNeVdpbmRvdyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgRW50aXR5LmNhbGwodGhpcywge1xyXG4gICAgICAgIFwieFBvc1wiOiBzZXR0aW5ncy54UG9zLFxyXG4gICAgICAgIFwieVBvc1wiOiBzZXR0aW5ncy55UG9zLFxyXG4gICAgICAgIFwiekluZGV4XCI6IHNldHRpbmdzLnpJbmRleCxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIC8vdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBcIiNcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy50b3BCYXJUZXh0ID0gc2V0dGluZ3MudG9wQmFyVGV4dCA/IHNldHRpbmdzLnRvcEJhclRleHQgOiBcIk5vIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLnRvcEJhckljb24gPSBzZXR0aW5ncy50b3BCYXJJY29uID8gc2V0dGluZ3MudG9wQmFySWNvbiA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcIm1lZGl1bVwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgIGxldCB3aW5kb3dUb3BCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFySWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICB3aW5kb3dUb3BCYXJJY29uLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMudG9wQmFySWNvbjtcclxuICAgIHdpbmRvd1RvcEJhckljb24uYWx0ID0gXCJUb3AgYmFyIGljb25cIjtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgd2luZG93VG9wQmFyU3Bhbi50ZXh0Q29udGVudCA9IHRoaXMudG9wQmFyVGV4dDtcclxuXHJcbiAgICBsZXQgd2luZG93TWluaW1pemVFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB3aW5kb3dNaW5pbWl6ZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X21pbmltaXplXCIpO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tbWludXMtcm91bmRcIik7XHJcblxyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3Jlc2l6ZVwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93Q2xvc2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB3aW5kb3dDbG9zZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2Nsb3NlXCIpO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tY2xvc2Utcm91bmRcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd0NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93Q29udGVudC5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19jb250ZW50XCIpO1xyXG4gICAgd2luZG93Q29udGVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIlBXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMuaWQpO1xyXG4gICAgaWYgKHRoaXMuYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgd2luZG93Q29udGVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhcl93cmFwcGVyXCIpO1xyXG5cclxuICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJJY29uKTtcclxuICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJTcGFuKTtcclxuXHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcik7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd01pbmltaXplRWxlbSk7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMud2luZG93UmVzaXplRWxlbSk7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd0Nsb3NlRWxlbSk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyV3JhcHBlcik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh3aW5kb3dDb250ZW50KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlbW92ZSBhbGwgY2xhc3Nlc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImlvbi1hcnJvdy1zaHJpbmtcIik7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tYXJyb3ctZXhwYW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAzMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDQ1MDtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1hcnJvdy1zaHJpbmtcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1cIiArIHRoaXMud2luZG93U2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCB0ZXN0ID0gdGhpcy5pZCA8IDEwID8gXCIwXCIgOiBcIlwiO1xyXG4gICAgICAgIHRlc3QgKz0gdGhpcy5pZDtcclxuXHJcbiAgICAgICAgdGhpcy54UG9zID0gKDEwMCsyMDAqdGVzdFswXSArIDE1ICogdGhpcy5pZCk7XHJcbiAgICAgICAgdGhpcy55UG9zID0gKDIwICsgMzAgKiAodGhpcy5pZCAtIHRlc3RbMF0qMTApKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0UG9zaXRpb24oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFdpbmRvdyBpbmhlcml0cyBmcm9tIEVudGl0eVxyXG4gKi9cclxuTXlXaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuTXlXaW5kb3cucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTXlXaW5kb3c7XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuZ2V0TWluaW1pemVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5taW5pbWl6ZWQ7XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5zZXRNaW5pbWl6ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5taW5pbWl6ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5taW5pbWl6ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWF4aW1pemVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1pbmltaXplXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWluaW1pemVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWF4aW1pemVcIik7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLVwiICsgdGhpcy53aW5kb3dTaXplKTtcclxuXHJcbiAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgY2FzZSBcInNtYWxsXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwibWVkaXVtXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJiaWdcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcInNtYWxsXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hcHBsaWNhdGlvbk9iai5jbG9zZSgpO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15V2luZG93O1xyXG4iLCJjb25zdCBXaW5kb3cgPSByZXF1aXJlKFwiLi9NeVdpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IFBhbmVsID0gcmVxdWlyZShcIi4vUGFuZWwuanNcIik7XHJcbmNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4vQXBwbGljYXRpb24uanNcIik7XHJcbmNvbnN0IE15QVBJID0gcmVxdWlyZShcIi4vTXlBUEkuanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcbmNvbnN0IENoYXQgPSByZXF1aXJlKFwiLi9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzXCIpO1xyXG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2FwcHMvU2V0dGluZ3MvU2V0dGluZ3MuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG5cclxuICAgIGluaXRpYWxpemUoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgZGVmYXVsdCBiZWhhdmlvdXIvcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnB3ZFdpZHRoID0gXCIxNjAwcHhcIjtcclxuXHJcbiAgICAgICAgdGhpcy5wd2RIZWlnaHQgPSBcIjkwMHB4XCI7XG5cbiAgICAgICAgdGhpcy5hcGkgPSB1bmRlZmluZWQ7XG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbGVtZW50c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1haW5cIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSB0aGlzLnB3ZFdpZHRoO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IHRoaXMucHdkSGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9zdGFydEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0XCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnQuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydC0taGlkZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydF9tZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgdGhpcy5zdGFydF9tZXNzYWdlLmNsYXNzTGlzdC5hZGQoXCJQV0Qtc3RhcnRfX21lc3NhZ2VcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydF9tZXNzYWdlLnRleHRDb250ZW50ID0gXCJIZWohXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydF9tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9ja0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2tCdXR0b24uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfY2xvY2tCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNsb2NrQnV0dG9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrQnV0dG9uLnRleHRDb250ZW50ID0gZC5nZXRIb3VycygpICsgXCI6XCIgKyAoZC5nZXRNaW51dGVzKCkgPCAxMCA/IFwiMFwiICsgZC5nZXRNaW51dGVzKCkgOiBkLmdldE1pbnV0ZXMoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVDbG9ja0J1dHRvbigpO1xyXG5cclxuICAgICAgICBzZXRJbnRlcnZhbCh1cGRhdGVDbG9ja0J1dHRvbiwgMzAwMDApO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2tcIik7XHJcbiAgICAgICAgdGhpcy5jbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrLS1oaWRlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgdGhpcy5jbG9ja19iaWdDbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrX19iaWdUaW1lXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrX2RhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrX2RhdGUuY2xhc3NMaXN0LmFkZChcIlBXRC1jbG9ja19fZGF0ZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9jay5hcHBlbmRDaGlsZCh0aGlzLmNsb2NrX2JpZ0Nsb2NrKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tfZGF0ZSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNsb2NrQmlnKCkge1xyXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrLnRleHRDb250ZW50ID0gZC5nZXRIb3VycygpICsgXCI6XCIgKyAoZC5nZXRNaW51dGVzKCkgPCAxMCA/IFwiMFwiICsgZC5nZXRNaW51dGVzKCkgOiBkLmdldE1pbnV0ZXMoKSkgKyBcIjpcIiArIChkLmdldFNlY29uZHMoKSA8IDEwID8gXCIwXCIgKyBkLmdldFNlY29uZHMoKSA6IGQuZ2V0U2Vjb25kcygpKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtb250aE5hbWVzID0gW1wiSmFudWFyaVwiLCBcIkZlYnJ1YXJpXCIsIFwiTWFyc1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RpXCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrX2RhdGUudGV4dENvbnRlbnQgPSBcImRlbiBcIiArIGQuZ2V0RGF0ZSgpICsgXCIgXCIgKyBtb250aE5hbWVzW2QuZ2V0TW9udGgoKV0gKyBcIiBcIiArIGQuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldEludGVydmFsKHVwZGF0ZUNsb2NrQmlnLCAxMDAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLnBhbmVsc1dyYXBwZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxzV3JhcHBlclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0QnV0dG9uKTtcclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5hcHBlbmRDaGlsZCh0aGlzLnBhbmVsc1dyYXBwZXIpO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tCdXR0b24pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0KTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNsb2NrKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJvdHRvbUJhcik7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSB0YXJnZXQgaXMgYSB3aW5kb3csIGljb24gb3IgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRhcmdldCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIHRoZSBkZXNrdG9wIGljb25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgc21hbGxcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwibWVtb3J5SWNvbi5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwic21hbGxcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgbWVkaXVtXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDEyMCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJtZW1vcnlJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIixcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMTkzLDE1NCwxMDcpXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiTWVtb3J5IGJpZ1wiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAyNTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwibWVtb3J5SWNvbi5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwiYmlnXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiQ2hhdFwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIkNoYXRcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMzUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcImNoYXQucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIlNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiU2V0dGluZ3NcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogNDUwLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIlxyXG4gICAgICAgIH0pICk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFwcGVuZCB0aGUgaWNvbnMgdG8gdGhlIGNvbnRhaW5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmljb25zW2ldLmdldENvbnRhaW5lcigpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vbGF1bmNoQXBwbGljYXRpb24odGhpcy5pY29uc1sxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsYXVuY2hBcHBsaWNhdGlvbih0aGlzLmljb25zWzRdKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWRkIGxpc3RlbmVyc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlZG93bkV2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNldXBFdmVudCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tFdmVudCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgZGJsY2xpY2tFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCBmdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbW91c2Vkb3duRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBldmVyeSBtb3VzZWRvd24gZXZlbnQgd2Ugd2lsbCBhdHRlbXB0IHRvIGZpbmQgYSBuZXcgdGFyZ2V0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGEgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgV2luZG93KSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMud2luZG93cy5pbmRleE9mKHRoaXMudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZXQgdGhlIHdpbmRvdyBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2VsZWN0RW50aXR5KHRoaXMud2luZG93c1tpbmRleF0sIHRoaXMud2luZG93cyk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTWFyayB0aGUgYXNzb2NpYXRlZCBwYW5lbCBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2VsZWN0RW50aXR5KHRoaXMucGFuZWxzW2luZGV4XSwgdGhpcy5wYW5lbHMpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERlc2VsZWN0IGljb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmljb25zWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmljb25zWzBdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgdGFyZ2V0IGlzIHRoZSB3aW5kb3cgdG9wIGJhciAtPiBhZGQgbW91c2Vtb3ZlIGxpc3RlbmVyXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93VG9wQmFyRWxlbSA9IHRoaXMudGFyZ2V0LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93VG9wQmFyRWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGVudGl0eU1vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0YXJnZXQgaXMgYSBwYW5lbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCBpbnN0YW5jZW9mIFBhbmVsKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZXQgdGhlIGljb24gYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNlbGVjdEVudGl0eSh0aGlzLnRhcmdldCwgdGhpcy5pY29ucyk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRGVzZWxlY3QgdGhlIHdpbmRvdyBhbmQgYXNzb2NpYXRlZCBwYW5lbFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMud2luZG93c1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzWzBdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzWzBdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb3VzZXVwRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXRUZW1wID0gZmluZFRhcmdldChlLnRhcmdldCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCAhPT0gXCJjbG9ja1wiICYmIHRoaXMudGFyZ2V0ICE9PSBcImNsb2NrQnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcIlBXRC1jbG9jay0taGlkZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrLS1oaWRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgIT09IFwic3RhcnRcIiAmJiB0aGlzLnRhcmdldCAhPT0gXCJzdGFydEJ1dHRvblwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGFydC5jbGFzc0xpc3QuY29udGFpbnMoXCJQV0Qtc3RhcnQtLWhpZGVcIikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydC0taGlkZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGEgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgV2luZG93KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldElzRHJhZ2dpbmcoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZW50aXR5TW92ZUV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRUZW1wID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERlc2VsZWN0IGV2ZXJ5dGhpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbnNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhIHBhbmVsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wYW5lbHMuaW5kZXhPZih0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYW5lbHNbaW5kZXhdLmdldElzU2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbaW5kZXhdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1tpbmRleF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5zZXRNaW5pbWl6ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBTZXQgdGhlIHBhbmVsIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHNlbGVjdEVudGl0eSh0aGlzLnBhbmVsc1tpbmRleF0sIHRoaXMucGFuZWxzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIE1hcmsgdGhlIGFzc29jaWF0ZWQgd2luZG93IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHNlbGVjdEVudGl0eSh0aGlzLndpbmRvd3NbaW5kZXhdLCB0aGlzLndpbmRvd3MpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1swXS5zZXRNaW5pbWl6ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0YXJnZXQgaXMgYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlbnRpdHlNb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGlja0V2ZW50KGUpIHtcclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgPT09IFwic3RhcnRCdXR0b25cIikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0LmNsYXNzTGlzdC50b2dnbGUoXCJQV0Qtc3RhcnQtLWhpZGVcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgPT09IFwiY2xvY2tCdXR0b25cIikge1xyXG4gICAgICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC50b2dnbGUoXCJQV0QtY2xvY2stLWhpZGVcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBXaW5kb3cpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSB0aGlzLnRhcmdldC5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfY2xvc2VcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93Q2xvc2VEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZih0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xvc2VXaW5kb3coaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgcmVzaXplIGJ1dHRvbiAtPiByZXNpemUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd1Jlc2l6ZURpdiA9IHRoaXMudGFyZ2V0LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19yZXNpemVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93UmVzaXplRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQucmVzaXplKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBtaW5pbWl6ZSBidXR0b25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dNaW5pbWl6ZURpdiA9IHRoaXMudGFyZ2V0LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19taW5pbWl6ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dNaW5pbWl6ZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB3aW5kb3dzLmluZGV4T2YodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGFuZWxzLmluZGV4T2YodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXQuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0QtYm90dG9tQmFyX3BhbmVsX19jbG9zZVwiKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGNsb3NlV2luZG93KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGJsY2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBMYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgaWNvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24odGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUiEgXCIgKyBtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlbGVjdHMgYSB3aW5kb3csIHBhbmVsIG9yIGljb25cclxuICAgICAqIEJyaW5ncyBpdCB0byB0aGUgZnJvbnQgb2YgaXRzIGFycmF5IChwb3NpdGlvbiAwKVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RFbnRpdHkoZW50aXR5LCBhcnIpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSBhcnIuaW5kZXhPZihlbnRpdHkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0aGUgZW50aXR5IGV4aXN0cyBpbiB0aGUgYXJyYXlcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVtb3ZlIHRoZSBlbnRpdHkgZnJvbSB0aGUgYXJyYXlcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEFkZCBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBhcnIudW5zaGlmdChlbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERlc2VsZWN0IHRoZSBsYXN0IGFjdGl2ZSBlbnRpdHlcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChhcnJbMV0pIHtcclxuICAgICAgICAgICAgICAgIGFyclsxXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNlbGVjdCB0aGUgbmV3IGVudGl0eVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgYXJyWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogVGhlIGVudGl0aWVzIGFyZSBnaXZlbiB6LWluZGV4XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycltpXSBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJbaV0uZ2V0Q29udGFpbmVyKCkuc3R5bGUuekluZGV4ID0gYXJyLmxlbmd0aCAtIGk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFycltpXS5nZXRDb250YWluZXIoKS5zdHlsZS56SW5kZXggPSB0aGlzLmljb25zLmxlbmd0aCArIGFyci5sZW5ndGggLSBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogVGhlIGJvdHRvbSBiYXIsIHN0YXJ0IGFuZCBjbG9jayBzaG91bGQgYWx3YXlzIGhhdmUgdGhlIGhpZ2hlc3Qgei1pbmRleFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5ib3R0b21CYXIuc3R5bGUuekluZGV4ID0gdGhpcy53aW5kb3dzLmxlbmd0aCArIHRoaXMuaWNvbnMubGVuZ3RoICsgMjtcclxuICAgICAgICAgICAgdGhpcy5zdGFydC5zdHlsZS56SW5kZXggPSB0aGlzLndpbmRvd3MubGVuZ3RoICsgdGhpcy5pY29ucy5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICB0aGlzLmNsb2NrLnN0eWxlLnpJbmRleCA9IHRoaXMud2luZG93cy5sZW5ndGggKyB0aGlzLmljb25zLmxlbmd0aCArIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3IoXCJzZWxlY3RFbnRpdHkuIEVudGl0eSBkb2VzIG5vdCBleGlzdCBpbiBhcnJheS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ0xvc2UgYSB3aW5kb3cgd2l0aCBhIGdpdmVuIGluZGV4XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNsb3NlV2luZG93KGluZGV4KSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FsbCB0aGUgY2xvc2UgZnVuY3Rpb25uIGltcGxlbWVudGVkIGJ5IGV2ZXJ5IGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnNbaW5kZXhdLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlbW92ZSB0aGUgd2luZG93IGFuZCBwYW5lbCBmcm9tIHRoZSBET01cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3NbaW5kZXhdLmdldENvbnRhaW5lcigpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy53aW5kb3dzW2luZGV4XS5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIHRoaXMucGFuZWxzW2luZGV4XS5nZXRDb250YWluZXIoKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMucGFuZWxzW2luZGV4XS5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlbW92ZSB0aGUgd2luZG93LCBwYW5lbCBhbmQgYXBwbGljYXRpb24gZnJvbSB0aGVpciByZXNwZWN0aXZlIGFycmF5c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHRoaXMucGFuZWxzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2hlbiBhIHBhbmVsIGlzIHJlbW92ZWQsIG1ha2Ugc3VyZSB0aGUgb3RoZXIgcGFuZWxzJyB3aWR0aCBpcyBjb3JyZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgIGNhbGN1bGF0ZVBhbmVsV2lkdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGEgZ2l2ZW4gdGFyZ2V0IGV4aXN0cyBpbiBhIHdpbmRvdywgcGFuZWwgb3IgaWNvblxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmaW5kVGFyZ2V0KHRhcmdldCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0QnV0dG9uLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwic3RhcnRCdXR0b25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0LmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwic3RhcnRcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb2NrQnV0dG9uLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2xvY2tCdXR0b25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb2NrLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2xvY2tcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIHdpbmRvd3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbiBhIHdpbmRvdyAtPiBtYXJrIHRoZSB3aW5kb3cgYW5kIHRoZSBwYW5lbCBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMud2luZG93c1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53aW5kb3dzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSBwYW5lbHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIGluIGEgcGFuZWwgLT4gbWFyayB0aGUgcGFuZWwgYW5kIHRoZSB3aW5kb3cgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYW5lbHNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIGljb25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb24gLT4gbWFyayB0aGUgaWNvbiBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWNvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZXJlIGlzIG5vIHRhcmdldCAtPiByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVQYW5lbFdpZHRoKCkge1xyXG4gICAgICAgIGlmICgxODggKiB0aGlzLnBhbmVscy5sZW5ndGggKyAxMDAgPiBwYXJzZUludCh0aGlzLnB3ZFdpZHRoKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5nZXRDb250YWluZXIoKS5zdHlsZS53aWR0aCA9IHRoaXMucGFuZWxzV3JhcHBlci5vZmZzZXRXaWR0aCAvIHRoaXMucGFuZWxzLmxlbmd0aCAtIDggKyBcInB4XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggYW4gYXBwbGljYXRpb24gdXNpbmcgdGhlIG1ldGEgZGF0YSBpbiBhIGdpdmVuIGljb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxhdW5jaEFwcGxpY2F0aW9uKGljb25PYmopIHtcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLndpbmRvd3MubGVuZ3RoO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgYSBuZXcgd2luZG93IHRvIGxhdW5jaCB0aGUgYXBwbGljYXRpb24gaW5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gbmV3IFdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy53aW5kb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IGljb25PYmouZ2V0V2luZG93U2l6ZSgpLFxyXG4gICAgICAgICAgICBcInRvcEJhclRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcInRvcEJhckljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKSxcclxuICAgICAgICAgICAgXCJ6SW5kZXhcIjogdGhpcy5pY29ucy5sZW5ndGgsXHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZENvbG9yXCIgOiBpY29uT2JqLmdldEJhY2tncm91bmRDb2xvcigpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93cy5wdXNoKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgIHNlbGVjdEVudGl0eShwd2RXaW5kb3csIHRoaXMud2luZG93cyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBldmVyeSB3aW5kb3cgdGhlcmUgaXMgYWxzbyBhIHBhbmVsIGluIHRoZSBib3R0b20gYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFBhbmVsID0gbmV3IFBhbmVsKHtcclxuICAgICAgICAgICAgXCJ0ZXh0XCI6IGljb25PYmouZ2V0SWNvblRleHQoKSxcclxuICAgICAgICAgICAgXCJpY29uXCI6IGljb25PYmouZ2V0SWNvbkltYWdlKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMucHVzaChwd2RQYW5lbCk7XHJcblxyXG4gICAgICAgIHNlbGVjdEVudGl0eShwd2RQYW5lbCwgdGhpcy5wYW5lbHMpO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1dyYXBwZXIuYXBwZW5kQ2hpbGQocHdkUGFuZWwuZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGVuIGEgbmV3IHBhbmVsIGlzIG1hZGUsIG1ha2Ugc3VyZSB3aWR0aCBpcyBjb3JyZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2FsY3VsYXRlUGFuZWxXaWR0aCgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24gYW5kIGFwcGVuZCBpdCB0byB0aGUgbmV3bHkgY3JlYXRlZCB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgYXBwbGljYXRpb25OYW1lID0gaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKTtcclxuXHJcbiAgICAgICAgbGV0IGFwcGxpY2F0aW9uT2JqID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAoYXBwbGljYXRpb25OYW1lID09PSBcIk1lbW9yeVwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IE1lbW9yeSh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyBpZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFwcGxpY2F0aW9uTmFtZSA9PT0gXCJDaGF0XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgQ2hhdCh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyBpZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFwcGxpY2F0aW9uTmFtZSA9PT0gXCJTZXR0aW5nc1wiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IFNldHRpbmdzKHtcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI1BXRC13aW5kb3dfY29udGVudC1cIiArIGlkLFxyXG4gICAgICAgICAgICAgICAgXCJhcGlcIjogZ2V0QXBpKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWFwcGxpY2F0aW9uT2JqIGluc3RhbmNlb2YgQXBwbGljYXRpb24pIHtcclxuICAgICAgICAgICAgZXJyb3IoXCJUaGUgYXBwbGljYXRpb24gaXMgbm90IGFuIGluc3RhbmNlIG9mIEFwcGxpY2F0aW9uLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnB1c2goYXBwbGljYXRpb25PYmopO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEFwaSgpIHtcclxuICAgICAgICBpZiAodGhpcy5hcGkgaW5zdGFuY2VvZiBNeUFQSSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcGk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFwaSA9IG5ldyBNeUFQSSh7XHJcbiAgICAgICAgICAgIFwicHdkQ29udGFpbmVyXCI6IHRoaXMuY29udGFpbmVyXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmFwaTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIHNlbGVjdGVkIHRhcmdldFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBlbnRpdHlNb3ZlRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlbnRpdHkgLT4gdXBkYXRlIGl0cyBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRJc0RyYWdnaW5nKHRydWUpO1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IGUuY2xpZW50WCAtIHNlbGVjdGVkRW50aXR5LmdldENvbnRhaW5lcigpLm9mZnNldExlZnQ7XHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRZID0gZS5jbGllbnRZIC0gc2VsZWN0ZWRFbnRpdHkuZ2V0Q29udGFpbmVyKCkub2Zmc2V0VG9wO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRFbnRpdHkuZ2V0WFBvcygpICsgXCIgOiBcIiArIG9mZnNldFgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZEVudGl0eS5nZXRZUG9zKCkgKyBcIiA6IFwiICsgb2Zmc2V0WSk7XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RlZEVudGl0eS51cGRhdGVQb3Moc2VsZWN0ZWRFbnRpdHkuZ2V0WFBvcygpICsgb2Zmc2V0WCwgc2VsZWN0ZWRFbnRpdHkuZ2V0WVBvcygpICsgb2Zmc2V0WSk7XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGlmICghdGhpcy50YXJnZXQuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3RvcGJhclwiKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgbW91c2UgcG9pbnRlciBpcyBvdXRzaWRlIHdpbmRvdyAtPiBkbyBub3QgdXBkYXRlIHRoZSBwb3NpdGlvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKGUuY2xpZW50WCA8IDAgfHwgZS5jbGllbnRYID4gdGhpcy5wd2RXaWR0aCB8fCBlLmNsaWVudFkgPCAwIHx8IGUuY2xpZW50WSA+IHRoaXMucHdkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFggPSBlLm1vdmVtZW50WDtcclxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WSA9IGUubW92ZW1lbnRZO1xyXG5cclxuICAgICAgICAgICAgaWYgKCh0aGlzLnRhcmdldC5nZXRYUG9zKCkgKyBtb3ZlbWVudFggKyB0aGlzLnRhcmdldC5nZXRXaWR0aCgpKSA+IHRoaXMucHdkV2lkdGggJiYgbW92ZW1lbnRYID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRYID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0LmdldFhQb3MoKSArIG1vdmVtZW50WCA8IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgodGhpcy50YXJnZXQuZ2V0WVBvcygpICsgbW92ZW1lbnRZICsgdGhpcy50YXJnZXQuZ2V0SGVpZ2h0KCkpID4gdGhpcy5wd2RIZWlnaHQgJiYgbW92ZW1lbnRZID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0LmdldFlQb3MoKSArIG1vdmVtZW50WSA8IDApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnVwZGF0ZVBvcyh0aGlzLnRhcmdldC5nZXRYUG9zKCkgKyBtb3ZlbWVudFgsIHRoaXMudGFyZ2V0LmdldFlQb3MoKSArIG1vdmVtZW50WSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5QV0QucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBXRDtcclxuIiwiZnVuY3Rpb24gUGFuZWwoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHRoaXMudGV4dCA9IHNldHRpbmdzLnRleHQgPyBzZXR0aW5ncy50ZXh0IDogXCJubyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy5pY29uID0gc2V0dGluZ3MuaWNvbiA/IHNldHRpbmdzLmljb24gOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5ocmVmID0gXCIjXCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbFwiKTtcclxuXHJcbiAgICBsZXQgaWNvbkVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgaWNvbkVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uO1xyXG4gICAgaWNvbkVsZW0uYWx0ID0gXCJJY29uXCI7XHJcbiAgICBpY29uRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9faWNvblwiKTtcclxuXHJcbiAgICBsZXQgc3BhbkVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHNwYW5FbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsX19zcGFuXCIpO1xyXG4gICAgc3BhbkVsZW0udGV4dENvbnRlbnQgPSB0aGlzLnRleHQ7XHJcblxyXG4gICAgbGV0IGNsb3NlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgY2xvc2VFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIGNsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9fY2xvc2VcIik7XHJcbiAgICBjbG9zZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1jbG9zZS1yb3VuZFwiKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uRWxlbSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzcGFuRWxlbSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9zZUVsZW0pO1xyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuZ2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZDtcclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFuZWw7XHJcbiIsImNvbnN0IFBXRCA9IHJlcXVpcmUoXCIuL1BXRC5qc1wiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBwd2QgPSBuZXcgUFdEKHtcImNvbnRhaW5lclwiOiBcImJvZHlcIn0pO1xyXG59KTtcclxuIiwiZnVuY3Rpb24gQ2hhdChzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIm5vIGNvbnRhaW5lclwiO1xyXG5cclxuICAgIGxldCB1c2VybmFtZSA9IHNldHRpbmdzLnVzZXJuYW1lID8gc2V0dGluZ3MudXNlcm5hbWUgOiBcIm5hanNzaW1vblwiO1xyXG5cclxuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIpO1xyXG4gICAgLy9zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgc29ja2V0T3BlbkV2ZW50KTtcclxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHNvY2tldE1lc3NhZ2VFdmVudCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBDaGF0IHdyYXBwZXJcclxuICAgIGxldCBjaGF0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdFdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gTWVzc2FnZXMgZGl2XHJcbiAgICBsZXQgbWVzc2FnZXNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbWVzc2FnZXNEaXYuY2xhc3NMaXN0LmFkZChcImNoYXRNZXNzYWdlc1wiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lc3NhZ2VzRGl2KTtcclxuXHJcbiAgICAvLyBJbnB1dCBmb3JtXHJcbiAgICBsZXQgaW5wdXREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZnJvbVwiKTtcclxuICAgIGlucHV0RGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChpbnB1dERpdik7XHJcblxyXG4gICAgLy8gVGV4dGFyZWEgaW4gdGhlIGlucHV0IGRpdlxyXG4gICAgbGV0IGlucHV0RGl2X3RleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dF90ZXh0YXJlYVwiKTtcclxuICAgIC8vIGZpeCB0byBtYWtlIHRleHRhcmVhIHNlbGVjdGFibGVcclxuICAgIGlucHV0RGl2X3RleHRhcmVhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl90ZXh0YXJlYSk7XHJcblxyXG4gICAgLy8gQnV0dG9uIGluIHRoZSBpbnB1dCBkaXZcclxuICAgIGxldCBpbnB1dERpdl9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X2J1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLnRleHRDb250ZW50ID0gXCJTZW5kXCI7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl9idXR0b24pO1xyXG5cclxuICAgIC8vIENvbnRhaW5lciBkaXZcclxuICAgIGxldCBjb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBjb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIC8qXHJcbiAgICBmdW5jdGlvbiBzb2NrZXRPcGVuRXZlbnQoZSkge1xyXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgIH1cclxuICAgICovXHJcbiAgICBmdW5jdGlvbiBzb2NrZXRNZXNzYWdlRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGxldCBjaGF0TWVzc2FnZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4uY2xhc3NMaXN0LmFkZChcImNoYXRNZXNzYWdlXCIpO1xyXG5cclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gXCJbXCIgKyByZXNwb25zZS50eXBlICsgXCJdIFwiO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSByZXNwb25zZS51c2VybmFtZSArIFwiOiBcIjtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gcmVzcG9uc2UuZGF0YTtcclxuXHJcbiAgICAgICAgbWVzc2FnZXNEaXYuYXBwZW5kQ2hpbGQoY2hhdE1lc3NhZ2VTcGFuKTtcclxuXHJcbiAgICAgICAgbWVzc2FnZXNEaXYuc2Nyb2xsVG9wID0gbWVzc2FnZXNEaXYuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1dHRvbkV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dERpdl90ZXh0YXJlYS52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTXVzdCBlbnRlciBhIG1lc3NhZ2UhXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5wdXREaXZfdGV4dGFyZWEudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIiA6IHZhbHVlLFxyXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLFxyXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGF0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xyXG4iLCJjb25zdCBBcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi9BcHBsaWNhdGlvbi5qc1wiKTtcclxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDaGF0U3RhcnQoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIm5vIGNvbnRhaW5lclwiO1xyXG5cclxuICAgIHRoaXMuY2hhdE9iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIFdyYXBwZXJcclxuICAgIGxldCBjaGF0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdFdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gQ2hhdCBzdGFydCBoZWFkZXJcclxuICAgIGxldCBjaGF0U3RhcnRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnRIZWFkZXJcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0U3RhcnRIZWFkZXIpO1xyXG5cclxuICAgIGxldCBjaGF0U3RhcnRIZWFkZXJTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXJTcGFuLnRleHRDb250ZW50ID0gXCJTVVBFUkNIQVRcIjtcclxuICAgIGNoYXRTdGFydEhlYWRlci5hcHBlbmRDaGlsZChjaGF0U3RhcnRIZWFkZXJTcGFuKTtcclxuXHJcbiAgICAvLyBDaGF0IG5hbWUgaW5wdXRcclxuICAgIGxldCBjaGF0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgLy8gZml4IHRvIG1ha2UgaW5wdXQgc2VsZWN0YWJsZVxyXG4gICAgY2hhdE5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgIH0pO1xyXG4gICAgY2hhdE5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBcIkVudGVyIG5hbWUhISFcIik7XHJcbiAgICBjaGF0TmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnROYW1lSW5wdXRcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0TmFtZUlucHV0KTtcclxuXHJcbiAgICAvLyBDaGF0IG5hbWUgYnV0dG9uXHJcbiAgICBsZXQgY2hhdE5hbWVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJ1dHRvbkV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydE5hbWVCdXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24udGV4dENvbnRlbnQgPSBcIlN0YXJ0IGNoYXR0aW5nISEhISEhISFcIjtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXROYW1lQnV0dG9uKTtcclxuXHJcbiAgICAvLyBDb250YWluZXIgZGl2XHJcbiAgICBsZXQgY29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBidXR0b25FdmVudCgpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBjaGF0TmFtZUlucHV0LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbnRlciBhIG5hbWUhXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0dGluZ3MudXNlcm5hbWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgY2hhdFdyYXBwZXJEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhdE9iaiA9IG5ldyBDaGF0KHNldHRpbmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuQ2hhdFN0YXJ0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwbGljYXRpb24ucHJvdG90eXBlKTtcclxuQ2hhdFN0YXJ0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENoYXRTdGFydDtcclxuXHJcbkNoYXRTdGFydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmNoYXRPYmopIHtcclxuICAgICAgICB0aGlzLmNoYXRPYmouY2xvc2UoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGF0U3RhcnQ7XHJcbiIsImZ1bmN0aW9uIENhcmQodmFsdWUpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIGxldCBjYXJkVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUNhcmRUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBjYXJkVGVtcGxhdGVGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShjYXJkVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gVGhlIGNhcmRFbGVtIGlzIHRoZSBlbGVtZW50IHdyYXBwaW5nIHRoZSB0d28gaW1hZ2VzXHJcbiAgICB0aGlzLmNhcmRFbGVtID0gY2FyZFRlbXBsYXRlRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIHRoaXMudmFsdWUpO1xyXG5cclxuICAgIC8vIFRoZSBjb3ZlckltYWdlIGlzIHRoZSBxdWVzdGlvbiBtYXJrIGFib3ZlIHRoZSBjYXJkIGltYWdlXHJcbiAgICB0aGlzLmNvdmVySW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRfYmFja1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zcmMgPSBcImltYWdlL1wiICsgdGhpcy52YWx1ZVswXSArIFwiLnBuZ1wiO1xyXG5cclxuICAgIC8vIFRoZSBjYXJkSW1hZ2UgaXMgdGhlIGltYWdlIG9mIHRoZSBtZW1vcnkgY2FyZFxyXG4gICAgdGhpcy5jYXJkSW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRfZnJvbnRcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSB1bmlxdWUgdmFsdWUgZm9yIHRoaXMgY2FyZFxyXG4gKiBUaGUgY2FyZCBpZGVudGlmaWVyXHJcbiAqL1xyXG5DYXJkLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGbGlwcyB0aGUgY2FyZFxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZmxpcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMuaXNGbGlwcGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJNZW1vcnktY2FyZC0tYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmdldElzRmxpcHBlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNGbGlwcGVkO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5zZXRJc0NvbXBsZXRlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNDb21wbGV0ZSA9IHZhbHVlO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xyXG4gICAgdGhpcy5jYXJkRWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmdldENhcmRFbGVtID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYXJkRWxlbTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkO1xyXG4iLCJjb25zdCBDYXJkID0gcmVxdWlyZShcIi4vQ2FyZC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIENhcmRzKG5yT2ZDYXJkcykge1xyXG4gICAgdGhpcy5jYXJkcyA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSBjYXJkc1xyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG5yT2ZDYXJkcyArIDE7IGkrKykge1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDEpKTtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaHVmZmxlIHRoZSBjYXJkc1xyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gdGhpcy5jYXJkcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICBsZXQgdGVtcCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgdGhpcy5jYXJkc1tpXSA9IHRoaXMuY2FyZHNbal07XHJcbiAgICAgICAgdGhpcy5jYXJkc1tqXSA9IHRlbXA7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBjYXJkIHdpdGggdGhlIGdpdmVuIHZhbHVlXHJcbiAqL1xyXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICBsZXQgY2FyZDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5jYXJkc1tpXS5nZXRWYWx1ZSgpID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBjYXJkID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIGZyYWdtZW50IGNvbnRhaW5pbmcgdGhlIGNhcmQgZGl2cyBhbmQgaW1hZ2VzXHJcbiAqL1xyXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZHNGcmFnID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY2FyZHNGcmFnID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY2FyZEVsZW0gPSB0aGlzLmNhcmRzW2ldLmdldENhcmRFbGVtKCk7XHJcbiAgICAgICAgY2FyZHNGcmFnLmFwcGVuZENoaWxkKGNhcmRFbGVtKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZHNGcmFnO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmRzO1xyXG4iLCJjb25zdCBBcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi9BcHBsaWNhdGlvbi5qc1wiKTtcclxuY29uc3QgTWVtb3J5R2FtZUJvYXJkID0gcmVxdWlyZShcIi4vTWVtb3J5R2FtZUJvYXJkLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTWVtb3J5R2FtZShzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwiIzEyM1wiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gV3JhcHBlclxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V3JhcHBlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlXcmFwcGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJEaXYgPSBtZW1vcnlXcmFwcGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS13cmFwcGVyXCIpO1xyXG5cclxuICAgIC8vIEhlYWRlclxyXG4gICAgbGV0IG1lbW9yeUhlYWRlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlIZWFkZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlIZWFkZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlIZWFkZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyID0gbWVtb3J5SGVhZGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUhlYWRlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5SGVhZGVyKTtcclxuXHJcbiAgICAvLyBQYWlyIGZvcm1cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybVRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpckZvcm1UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm0gPSBtZW1vcnlQYWlyRm9ybUZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybVwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5UGFpckZvcm0pO1xyXG5cclxuICAgIC8vIFJhZGlvIGlucHV0c1xyXG4gICAgbGV0IG1lbW9yeVBhaXJSYWRpb1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZVwiKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSA4OyBpKyspIHtcclxuICAgICAgICBsZXQgbWVtb3J5UGFpclJhZGlvRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpclJhZGlvVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyTGFiZWwgPSBtZW1vcnlQYWlyUmFkaW9GcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5UGFpclJhZGlvTGFiZWxcIik7XHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJSYWRpbyA9IG1lbW9yeVBhaXJMYWJlbC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhaXJMYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpICsgXCIgcGFpcnNcIikpO1xyXG4gICAgICAgIC8vIEZpeCB0byBtYWtlIHJhZGlvIGlucHV0cyBjbGlja2FibGVcclxuICAgICAgICBtZW1vcnlQYWlyTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1lbW9yeVBhaXJSYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFpckZvcm0uYXBwZW5kQ2hpbGQobWVtb3J5UGFpckxhYmVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGb3JtIGJ1dHRvblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b25GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvbiA9IG1lbW9yeVBhaXJGb3JtQnV0dG9uRnJhZy5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xyXG4gICAgbWVtb3J5UGFpckZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQpO1xyXG5cclxuICAgIG1lbW9yeVBhaXJGb3JtLmFwcGVuZENoaWxkKG1lbW9yeVBhaXJGb3JtQnV0dG9uKTtcclxuXHJcbiAgICAvLyBDb250YWluZXJcclxuICAgIGxldCBtZW1vcnlDb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBtZW1vcnlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbWVtb3J5UGFpckZvcm1CdXR0b25FdmVudCgpIHtcclxuICAgICAgICBsZXQgbnJPZlBhaXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybSBpbnB1dDpjaGVja2VkXCIpLnZhbHVlO1xyXG5cclxuICAgICAgICBtZW1vcnlXcmFwcGVyRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgICAgIHNldHRpbmdzLm5yT2ZQYWlycyA9IHBhcnNlSW50KG5yT2ZQYWlycyk7XHJcbiAgICAgICAgbmV3IE1lbW9yeUdhbWVCb2FyZChzZXR0aW5ncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1lbW9yeUdhbWUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBsaWNhdGlvbi5wcm90b3R5cGUpO1xyXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1lbW9yeUdhbWU7XHJcblxyXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge31cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5R2FtZTtcclxuIiwiY29uc3QgQ2FyZHMgPSByZXF1aXJlKFwiLi9DYXJkcy5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIE1lbW9yeUdhbWVCb2FyZChzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIiNjb29sXCI7XHJcblxyXG4gICAgbGV0IG5yT2ZQYWlycyA9IHNldHRpbmdzLm5yT2ZQYWlycyA/IHNldHRpbmdzLm5yT2ZQYWlycyA6IDQ7XHJcblxyXG4gICAgbGV0IGNhcmRzID0gbmV3IENhcmRzKG5yT2ZQYWlycyk7XHJcblxyXG4gICAgbGV0IHNjb3JlID0gMDtcclxuXHJcbiAgICBsZXQgZ2FtZVRpbWVyID0gMDtcclxuXHJcbiAgICBsZXQgYXR0ZW1wdHMgPSAwO1xyXG5cclxuICAgIGxldCBmaXJzdENhcmQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgbGV0IHNlY29uZENhcmQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgbGV0IGlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgZ2FtZVRpbWVySW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aW1lciwgMTAwMCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFTGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBNZW1vcnkgd3JhcHBlclxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V3JhcHBlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlXcmFwcGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJEaXYgPSBtZW1vcnlXcmFwcGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS13cmFwcGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWVtb3J5V3JhcHBlckNsaWNrRXZlbnQpO1xyXG5cclxuICAgIC8vIEhlYWRlclxyXG4gICAgbGV0IG1lbW9yeUhlYWRlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlIZWFkZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlIZWFkZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlIZWFkZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyID0gbWVtb3J5SGVhZGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUhlYWRlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5SGVhZGVyKTtcclxuXHJcbiAgICAvLyBNZW1vcnkgcGFuZWxcclxuICAgIGxldCBtZW1vcnlQYW5lbFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbFRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFuZWxUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFuZWxEaXYgICAgICAgICAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktcGFuZWxcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW4gPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbEF0dGVtcHRzU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbFRpbWVTcGFuICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsVGltZVNwYW5cIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxNZXNzYWdlU3BhbiAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlQYW5lbERpdik7XHJcblxyXG4gICAgLy8gTWVtb3J5IGNhcmRzXHJcbiAgICBsZXQgbWVtb3lDYXJkc1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDYXJkc1RlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUNhcmRzRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5Q2FyZHNUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5Q2FyZHNEaXYgPSBtZW1vcnlDYXJkc0ZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktY2FyZHNcIik7XHJcbiAgICBtZW1vcnlDYXJkc0Rpdi5hcHBlbmRDaGlsZChjYXJkcy5nZXRDYXJkc0ZyYWcoKSk7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUNhcmRzRGl2KTtcclxuXHJcbiAgICAvLyBNZW1vcnkgY29udGFpbmVyXHJcbiAgICBsZXQgbWVtb3J5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHRpbWVyKCkge1xyXG4gICAgICAgIGdhbWVUaW1lciArPSAxO1xyXG5cclxuICAgICAgICBtZW1vcnlQYW5lbEF0dGVtcHRzU3Bhbi50ZXh0Q29udGVudCA9IFwiQXR0ZW1wdHM6IFwiICsgYXR0ZW1wdHM7XHJcbiAgICAgICAgbWVtb3J5UGFuZWxUaW1lU3Bhbi50ZXh0Q29udGVudCA9IFwiVGltZTogXCIgKyBnYW1lVGltZXIgKyBcIiBzZWNvbmRzXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWVtb3J5V3JhcHBlckNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgaXMgY3VycmVudGx5IGNoZWNraW5nIGFuc3dlciAtPiBleGl0IGZ1bmN0aW9uXHJcbiAgICAgICAgICogKHdhaXRpbmcgZm9yIHRpbWVyIHRvIGZpbmlzaClcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaXNDaGVja2luZ0Fuc3dlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW1nRWxlbSA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBsZXQgYUVsZW0gPSBpbWdFbGVtLm5vZGVOYW1lID09PSBcIklNR1wiID8gaW1nRWxlbS5wYXJlbnROb2RlIDogaW1nRWxlbTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0gYUVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNhcmQgPSBjYXJkcy5nZXRDYXJkKHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGNhcmQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuZ2V0SXNGbGlwcGVkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmZsaXAoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RDYXJkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdENhcmQgPSBjYXJkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRDYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tBbnN3ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja0Fuc3dlcigpIHtcclxuICAgICAgICBpc0NoZWNraW5nQW5zd2VyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgYXR0ZW1wdHMgKz0gMTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaXJzdENhcmQuZ2V0VmFsdWUoKVswXSA9PT0gc2Vjb25kQ2FyZC5nZXRWYWx1ZSgpWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuYWRkQ2xhc3MoXCJNZW1vcnktY2FyZC0tY29ycmVjdFwiKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuYWRkQ2xhc3MoXCJNZW1vcnktY2FyZC0tY29ycmVjdFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29yZSArPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgc2NvcmUgaXMgZXF1YWwgdG8gbWF4aW11bSBhbW91bnQgb2YgcGFpcnMgLT4gdGhlIGdhbWUgaXMgY29tcGxldGVcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3JlID09PSBuck9mUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdhbWVUaW1lckludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ID0gXCJZb3UgY29tcGxldGVkIHRoZSBnYW1lIVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuZmxpcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaXJzdENhcmQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHNlY29uZENhcmQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5R2FtZUJvYXJkO1xyXG4iLCJjb25zdCBBcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi9BcHBsaWNhdGlvbi5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFNldHRpbmdzKHNldHRpbmdzID0ge30pIHtcclxuICAgIEFwcGxpY2F0aW9uLmNhbGwodGhpcywge1xyXG4gICAgICAgXCJhcGlcIjogc2V0dGluZ3MuYXBpXHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMud2luZG93RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcik7XHJcbiAgICB0aGlzLndpbmRvd0Rpdi5jbGFzc0xpc3QuYWRkKFwic2V0dGluZ3NcIik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCYWNrZ3JvdW5kXHJcbiAgICAgKi9cclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0uY2xhc3NMaXN0LmFkZChcInNldHRpbmdzQmFja2dyb3VuZEZvcm1cIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICBsZXQgZm9ybUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGZvcm1MYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJiYWNrZ3JvdW5kRm9ybVwiICsgaSk7XHJcblxyXG4gICAgICAgIGxldCBmb3JtUmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYWRpb1wiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJiYWNrZ3JvdW5kXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImJhY2tncm91bmRGb3JtXCIgKyBpKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcm1JbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgZm9ybUltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4vaW1hZ2UvMC5wbmdcIik7XHJcbiAgICAgICAgZm9ybUltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkJhY2tncm91bmRcIik7XHJcblxyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtUmFkaW8pO1xyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtSW1hZ2UpO1xyXG5cclxuICAgICAgICB0aGlzLmJhY2tncm91bmRGb3JtLmFwcGVuZENoaWxkKGZvcm1MYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMud2luZG93RGl2LmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZEZvcm0pO1xyXG5cclxuICAgIHRoaXMuYXBpLnNldFB3ZEJhY2tncm91bmQoMCk7XHJcbiAgICB0aGlzLmFwaS5zZXRQd2RCYWNrZ3JvdW5kKDEpO1xyXG4gICAgdGhpcy5hcGkuc2V0UHdkQmFja2dyb3VuZCgyKTtcclxufVxyXG5cclxuU2V0dGluZ3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBsaWNhdGlvbi5wcm90b3R5cGUpO1xyXG5TZXR0aW5ncy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXR0aW5ncztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XHJcbiJdfQ==
