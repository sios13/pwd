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
    let prefix = "main--background-";

    MyAPI.prototype.removeClassesWithPrefix(prefix, this.pwdContainer);

    this.pwdContainer.classList.add(prefix + index);
}

MyAPI.prototype.setPwdDisplayResolution = function(index) {
    let prefix = "main--displayRes-";

    MyAPI.prototype.removeClassesWithPrefix(prefix, this.pwdContainer);

    this.pwdContainer.classList.add(prefix + index);
}

/**
 * Remove classes with prefix
 */
MyAPI.prototype.removeClassesWithPrefix = function(prefix, elem) {
    for (let i = 0; i < elem.classList.length; i++) {
        if (elem.classList[i].indexOf(prefix) !== -1) {
            elem.classList.remove(elem.classList[i]);
            break;
        }
    }
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
const MyWindow = require("./MyWindow.js");
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

        this.api = undefined;

        this.dragTarget = undefined;

        this.windowCounter = 0;

        /**
         * Elements
         */
        this.container = document.createElement("main");
        this.container.classList.add("main--background-3");
        this.container.classList.add("main--displayRes-0");

        this.startButton = document.createElement("a");
        this.startButton.href = "#";
        this.startButton.classList.add("PWD-bottomBar_startButton");

        this.start = document.createElement("div");
        this.start.classList.add("PWD-start");
        this.start.classList.add("PWD-start--hide");

        this.start_title = document.createElement("span");
        this.start_title.classList.add("PWD-start__title");
        this.start_title.textContent = "Hej!";

        this.start_message = document.createElement("span");
        this.start_message.classList.add("PWD-start__message");
        this.start_message.textContent = "Made by Simon Österdahl";

        this.start.appendChild(this.start_title);
        this.start.appendChild(this.start_message);

        this.clockButton = document.createElement("a");
        this.clockButton.href = "#";
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

        function updateClock() {
            let d = new Date();

            this.clock_bigClock.textContent = d.getHours() + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ":" + (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());

            let monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "July", "Augusti", "September", "Oktober", "November", "December"];

            this.clock_date.textContent = "den " + d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
        }

        setInterval(updateClock, 1000);

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

        for (let i = 0; i < 20; i++) {
            launchApplication(this.icons[1]);
        }

        //launchApplication(this.icons[3]);

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
        let target = findTarget(e.target);

        /**
         * If target is a window
         */
        if (target instanceof MyWindow) {
            let pwdWindow = target;

            let index = this.windows.indexOf(pwdWindow);

            // /**
            //  * Set the window as selected
            //  */
            // selectEntity(this.windows[index], this.windows);
            //
            // /**
            //  * Mark the associated panel as selected
            //  */
            // selectEntity(this.panels[index], this.panels);
            //
            // selectEntity(this.applications[index], this.applications);
            selectWindowPanelApp(index);

            /**
             * Deselect icon
             */
            if (this.icons[0]) {
                this.icons[0].setIsSelected(false);
            }

            /**
             * If target is the window top bar -> add mousemove listener
             */
            let windowTopBarElem = pwdWindow.getContainer().querySelector(".PWD-window_topbar");

            if (windowTopBarElem.contains(e.target)) {
                this.dragTarget = pwdWindow;

                window.addEventListener("mousemove", mousemoveEvent);

                e.preventDefault();
            }

            return;
        }

        /**
         * If target is a panel
         */
        if (target instanceof Panel) {}

        /**
         * If target is an icon
         */
        if (target instanceof Icon) {
            let icon = target;
            /**
             * Set the icon as selected
             */
            //selectEntity(icon, this.icons);
            let index = icons.indexOf(icon);

            selectIcon(index);

            /**
             * Deselect the window and associated panel
             */
            if (this.windows[0]) {
                this.windows[0].setIsSelected(false);

                this.panels[0].setIsSelected(false);
            }

            /**
             * Add mousemove listener
             */
            this.dragTarget = icon;

            window.addEventListener("mousemove", mousemoveEvent);

            e.preventDefault();

            return;
        }
    }

    function mouseupEvent(e) {
        let target = findTarget(e.target);

        /**
         * Hide clock if mouseup has been made outside clock and clockButton
         */
        if (target !== "clock" && target !== "clockButton") {
            if (!this.clock.classList.contains("PWD-clock--hide")) {
                this.clock.classList.add("PWD-clock--hide");
            }
        }

        /**
         * Hide start if mouseup has been made outside start and startButton
         */
        if (target !== "start" && target !== "startButton") {
            if (!this.start.classList.contains("PWD-start--hide")) {
                this.start.classList.add("PWD-start--hide");
            }
        }

        /**
         * If target is a window
         */
        if (target instanceof MyWindow) {
            let pwdWindow = target;

            /**
             * If a window is being dragged -> stop dragging
             */
            if (this.dragTarget instanceof MyWindow) {
                this.dragTarget = undefined;

                pwdWindow.setIsDragging(false);

                window.removeEventListener("mousemove", mousemoveEvent);
            }

            return;
        }

        /**
         * If target is a panel
         */
        if (target instanceof Panel) {
            let panel = target;

            let index = this.panels.indexOf(panel);

            if (index === -1) {
                error("Panel was not found.");

                return;
            }

            if (this.panels[index].getIsSelected()) {
                this.panels[index].setIsSelected(false);

                this.windows[index].setIsSelected(false);

                this.windows[index].setMinimized(true);

                return;
            } else {
                selectWindowPanelApp(index);

                this.windows[0].setMinimized(false);

                return;
            }
        }

        /**
         * If target is an icon
         */
        if (target instanceof Icon) {
            let icon = target;

            if (this.dragTarget instanceof Icon) {
                this.dragTarget = undefined;

                icon.setIsDragging(false);

                window.removeEventListener("mousemove", mousemoveEvent);

                icon.correctGridPosition();
            }

            return;
        }

        if (target === undefined) {
            /**
             * If something is being dragged -> stop dragging
             */
            if (this.dragTarget) {
                this.dragTarget.setIsDragging(false);

                if (this.dragTarget instanceof Icon) {
                    this.dragTarget.correctGridPosition();
                }

                this.dragTarget = undefined;

                window.removeEventListener("mousemove", mousemoveEvent);
            }

            /**
             * Deselect window, panel and icon
             */
            if (this.windows[0]) {
                this.windows[0].setIsSelected(false);
            }

            if (this.panels[0]) {
                this.panels[0].setIsSelected(false);
            }

            if (this.icons[0]) {
                this.icons[0].setIsSelected(false);
            }

            return;
        }
    }

    function clickEvent(e) {
        let target = findTarget(e.target);

        if (target === "startButton") {
            this.start.classList.toggle("PWD-start--hide");

            return;
        }

        if (target === "clockButton") {
            this.clock.classList.toggle("PWD-clock--hide");

            return;
        }

        if (target instanceof MyWindow) {
            let pwdWindow = target;

            /**
             * If a click has been made on the close button
             */
            let windowCloseDiv = pwdWindow.getContainer().querySelector(".PWD-window_close");

            if (windowCloseDiv.contains(e.target)) {
                let index = this.windows.indexOf(pwdWindow);

                closeWindow(index);

                return;
            }

            /**
             * If a click has been made on the resize button -> resize the window
             */
            let windowResizeDiv = pwdWindow.getContainer().querySelector(".PWD-window_resize");

            if (windowResizeDiv.contains(e.target)) {
                pwdWindow.resize();

                return;
            }

            /**
             * If a click has been made on the minimize button
             */
            let windowMinimizeDiv = pwdWindow.getContainer().querySelector(".PWD-window_minimize");

            if (windowMinimizeDiv.contains(e.target)) {
                pwdWindow.setMinimized(true);

                pwdWindow.setIsSelected(false);

                let index = windows.indexOf(pwdWindow);

                this.panels[index].setIsSelected(false);

                return;
            }
        }

        /**
         * If target is an icon
         */
        if (target instanceof Panel) {
            let panel = target;

            let index = panels.indexOf(panel);

            /**
             * If a click has been made on the close button
             */
            if (panel.getContainer().querySelector(".PWD-bottomBar_panel__close").contains(e.target)) {
                closeWindow(index);

                return;
            }
        }
    }

    function dblclickEvent(e) {
        let target = findTarget(e.target);

        /**
         * If target is an icon
         */
        if (target instanceof Icon) {
            let icon = target;

            /**
             * Launch the application associated with the icon
             */
            launchApplication(icon);

            return;
        }
    }

    function mousemoveEvent(e) {
        /**
         * If there is a drag target -> update its position
         */
        if (this.dragTarget) {
            let dragTarget = this.dragTarget;

            let pwdWidth = this.container.offsetWidth;
            let pwdHeight = this.container.offsetHeight;

            let cursorX = e.pageX;
            let cursorY = e.pageY;

            let movementX = e.movementX;
            let movementY = e.movementY;

            dragTarget.setIsDragging(true);

            /**
             * If mouse pointer is outside window -> do not update the position
             */
            if (cursorY + 10 < 0 || cursorY > pwdHeight - 40 - 10) {
                movementY = 0;
            }

            if (cursorX + 10 < 0 || cursorX > pwdWidth - 10) {
                movementX = 0;
            }

            dragTarget.updatePos(dragTarget.getXPos() + movementX, dragTarget.getYPos() + movementY);
        }
    }

    function error(message) {
        console.log("ERROR! " + message);
    }

    /**
     * Brings the icon with the given index to the front of the icons array
     * Being in front of the array means "selected"
     */
    function selectIcon(index) {
        let iconTemp = this.icons[index];

        this.icons.splice(index, 1);

        this.icons.unshift(iconTemp);

        /**
         * Deselect the last active icon
         */
        if (this.icons[1]) {
            this.icons[1].setIsSelected(false);
        }

        this.icons[0].setIsSelected(true);
    }

    /**
     * Brings the window, panel and application with the given index to the front of their respective arrays
     * Being in front of the array means "selected"
     */
    function selectWindowPanelApp(index) {
        /**
         * Application
         */
        let applicationTemp = this.applications[index];

        this.applications.splice(index, 1);

        this.applications.unshift(applicationTemp);

        /**
         * Window
         */
        let windowTemp = this.windows[index];

        this.windows.splice(index, 1);

        this.windows.unshift(windowTemp);

        if (this.windows[1]) {
            this.windows[1].setIsSelected(false);
        }

        this.windows[0].setIsSelected(true);

        /**
         * Panel
         */
        let panelTemp = this.panels[index];

        this.panels.splice(index, 1);

        this.panels.unshift(panelTemp);

        if (this.panels[1]) {
            this.panels[1].setIsSelected(false);
        }

        this.panels[0].setIsSelected(true);

        /**
         * Give windows z-index
         */
        for (let i = 0; i < this.applications.length; i++) {
            this.windows[i].getContainer().style.zIndex = this.icons.length + this.applications.length - i;
        }

        /**
         * Make sure start, clock and bottom bar always is on top
         */
        let topZIndex = this.applications.length + this.icons.length;

        this.start.style.zIndex = topZIndex + 1;
        this.clock.style.zIndex = topZIndex + 1;
        this.bottomBar.style.zIndex = topZIndex + 2;
    }

    /**
     * Close a window with a given index
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

    /**
     * Updates the width of the panels, making sure all panels fit in the bottom bar
     */
    function calculatePanelsWidth() {
        let panelWidth = 188 * this.panels.length + 100;

        let pwdWidth = this.container.offsetWidth;

        if (panelWidth > pwdWidth) {
            for (let i = 0; i < this.panels.length; i++) {
                let panelElem = this.panels[i].getContainer();

                panelElem.style.width = this.panelsWrapper.offsetWidth / this.panels.length - 8 + "px";
            }
        }
    }

    /**
     * Launch an application, window and panel using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let id = this.windows.length;

        /**
         * Create a new window to launch the application in
         */
        let pwdWindow = new MyWindow({
            "id": this.windowCounter,
            "windowSize": iconObj.getWindowSize(),
            "topBarText": iconObj.getIconText(),
            "topBarIcon": iconObj.getIconImage(),
            "zIndex": this.icons.length,
            "backgroundColor" : iconObj.getBackgroundColor()
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

        this.panelsWrapper.appendChild(pwdPanel.getContainer());

        /**
         * When a new panel is made, make sure width is correct
         */
        calculatePanelsWidth();

        /**
         * Start the application
         */
        let applicationName = iconObj.getApplicationName();

        let applicationObj = undefined;

        if (applicationName === "Memory") {
            applicationObj = new Memory({
                "container": "#PWD-window_content-" + this.windowCounter
            });
        } else if (applicationName === "Chat") {
            applicationObj = new Chat({
                "container": "#PWD-window_content-" + this.windowCounter
            });
        } else if (applicationName === "Settings") {
            applicationObj = new Settings({
                "container": "#PWD-window_content-" + this.windowCounter,
                "api": getApi()
            });
        }

        if (!applicationObj instanceof Application) {
            error("The application is not an instance of Application.");
        }

        this.applications.push(applicationObj);

        /**
         * When window, panel and application has now been made -> make them selected
         */
        selectWindowPanelApp(this.applications.length - 1);

        this.windowCounter++;
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

    this.username = settings.username ? settings.username : "simon";

    this.socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");
    //socket.addEventListener("open", socketOpenEvent);
    this.socket.addEventListener("message", socketMessageEvent);

    /**
     * Elements
     */
    // Name change div
    let nameChangeDiv = document.createElement("div");
    nameChangeDiv.classList.add("chatNameChange");

    let nameChangeSpan = document.createElement("span");
    nameChangeSpan.textContent = "Username: " + this.username;

    let nameChangeButton = document.createElement("button");
    nameChangeButton.addEventListener("click", nameChangeEvent.bind(this));
    nameChangeButton.textContent = "Change name";

    nameChangeDiv.appendChild(nameChangeSpan);
    nameChangeDiv.appendChild(nameChangeButton);

    let nameChangeInput = document.createElement("input");

    // Messages div
    let messagesDiv = document.createElement("div");
    messagesDiv.classList.add("chatMessages");

    // Input form
    let inputDiv = document.createElement("from");
    inputDiv.classList.add("chatInput");

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

    // Chat wrapper
    let chatWrapperDiv = document.createElement("div");
    chatWrapperDiv.classList.add("chatWrapper");

    chatWrapperDiv.appendChild(nameChangeDiv);
    chatWrapperDiv.appendChild(messagesDiv);
    chatWrapperDiv.appendChild(inputDiv);

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

        if (response.type === "heartbeat") {
            return;
        }

        let chatMessageSpan = document.createElement("span");
        chatMessageSpan.classList.add("chatMessage");

        chatMessageSpan.textContent += "[" + response.type + "] ";
        chatMessageSpan.textContent += response.username + ": ";
        chatMessageSpan.textContent += response.data;

        messagesDiv.appendChild(chatMessageSpan);

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function nameChangeEvent(e) {
        nameChangeDiv.textContent = "";

        if (nameChangeInput.value === "") {
            nameChangeDiv.appendChild(nameChangeInput);

            nameChangeDiv.appendChild(nameChangeButton);

            nameChangeInput.value = this.username;
        } else {
            this.username = nameChangeInput.value;

            localStorage.setItem("chatUsername", this.username);

            nameChangeInput.value = "";

            nameChangeSpan.textContent = "Username: " + this.username;
            nameChangeDiv.appendChild(nameChangeSpan);

            nameChangeDiv.appendChild(nameChangeButton);
        }
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
            "username": this.username,
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        }

        this.socket.send(JSON.stringify(data));
    }
}

Chat.prototype.close = function() {
    debugger;
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
     * If a username exists in local storage -> start chat
     */
    if (localStorage.getItem("chatUsername")) {
        settings.username = localStorage.getItem("chatUsername");

        chatWrapperDiv.parentNode.removeChild(chatWrapperDiv);

        this.chatObj = new Chat(settings);
    }

    /**
     * Functions
     */
    function buttonEvent() {
        let value = chatNameInput.value;

        if (value === "") {
            console.log("Enter a name!");
        }

        localStorage.setItem("chatUsername", value);

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
    this.coverImage.src = "image/Memory/" + this.value[0] + ".png";

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
    this.windowDiv.classList.add("settingsWrapper");

    /**
     * Background
     */
    this.backgroundWrapper = document.createElement("div");

    this.backgroundTitle = document.createElement("span");
    this.backgroundTitle.textContent = "Change background";

    this.backgroundForm = document.createElement("form");
    this.backgroundForm.classList.add("settingsBackgroundForm");

    for (let i = 0; i < 6; i++) {
        let formLabel = document.createElement("label");
        formLabel.setAttribute("for", "backgroundForm" + this.container + i);

        let formRadio = document.createElement("input");
        formRadio.setAttribute("type", "radio");
        formRadio.setAttribute("value", i);
        formRadio.setAttribute("name", "background");
        formRadio.setAttribute("id", "backgroundForm" + this.container + i);

        let formImage = document.createElement("img");
        formImage.setAttribute("src", "./image/background" + i + "_small.jpg");
        formImage.setAttribute("alt", "Background");

        formLabel.appendChild(formRadio);
        formLabel.appendChild(formImage);

        this.backgroundForm.appendChild(formLabel);
    };

    this.backgroundWrapper.appendChild(this.backgroundTitle);
    this.backgroundWrapper.appendChild(this.backgroundForm);

    /**
     * Display resolution
     */
    this.displayResWrapper = document.createElement("div");

    this.displayResTitle = document.createElement("span");
    this.displayResTitle.textContent = "Change Display Resolution";

    this.displayResForm = document.createElement("form");
    this.displayResForm.classList.add("settingsDisplayResForm");

    for (let i = 0; i < 4; i++) {
        let formLabel = document.createElement("label");
        formLabel.setAttribute("for", "displayResForm" + this.container + i);

        let formRadio = document.createElement("input");
        formRadio.setAttribute("type", "radio");
        formRadio.setAttribute("value", i);
        formRadio.setAttribute("name", "displayRes");
        formRadio.setAttribute("id", "displayResForm" + this.container + i);

        let formSpan = document.createElement("span");
        formSpan.textContent = "asdasdasdasd";

        formLabel.appendChild(formRadio);
        formLabel.appendChild(formSpan);

        this.displayResForm.appendChild(formLabel);
    };

    this.displayResWrapper.appendChild(this.displayResTitle);
    this.displayResWrapper.appendChild(this.displayResForm);

    let spans = this.displayResWrapper.querySelectorAll("span");
    spans[1].textContent = "1280x720";
    spans[2].textContent = "1600x900";
    spans[3].textContent = "1920x1080";
    spans[4].textContent = "2460x1400";

    /**
     * Save button
     */
    this.saveButton = document.createElement("button");
    this.saveButton.classList.add("settingsButton");
    this.saveButton.setAttribute("type", "button");
    this.saveButton.textContent = "Save";
    this.saveButton.addEventListener("click", saveButtonEvent.bind(this));

    this.settings = document.createElement("div");
    this.settings.classList.add("settings");

    this.settings.appendChild(this.backgroundWrapper);
    this.settings.appendChild(document.createElement("hr"));
    this.settings.appendChild(this.displayResWrapper);
    this.settings.appendChild(document.createElement("hr"));

    this.windowDiv.appendChild(this.settings);
    this.windowDiv.appendChild(this.saveButton);

    function saveButtonEvent() {
        /**
         * Background
         */
        let backgroundInputs = this.backgroundForm.querySelectorAll("input");

        for (let i = 0; i < backgroundInputs.length; i++) {
            if (backgroundInputs[i].checked) {
                this.api.setPwdBackground(i);
            }
        }

        let displayResInputs = this.displayResForm.querySelectorAll("input");

        for (let i = 0; i < displayResInputs.length; i++) {
            if (displayResInputs[i].checked) {
                this.api.setPwdDisplayResolution(i);
            }
        }
    }
}

Settings.prototype = Object.create(Application.prototype);
Settings.prototype.constructor = Settings;

module.exports = Settings;

},{"../../Application.js":1}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwbGljYXRpb24uanMiLCJjbGllbnQvc291cmNlL2pzL0VudGl0eS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvTXlBUEkuanMiLCJjbGllbnQvc291cmNlL2pzL015V2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZUJvYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL1NldHRpbmdzL1NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIEV2ZXJ5IGFwcGxpY2F0aW9uIGluIHRoZSBQV0QgbXVzdCBpbXBsZW1lbnQgQXBwbGljYXRpb25cclxuICovXHJcbmZ1bmN0aW9uIEFwcGxpY2F0aW9uKHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuYXBpID0gc2V0dGluZ3MuYXBpID8gc2V0dGluZ3MuYXBpIDogdW5kZWZpbmVkO1xyXG59XHJcblxyXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiV0FSTklORyEgQXBwbGljYXRpb24gbXVzdCBpbXBsZW1lbnQgZnVuY3Rpb24gY2xvc2UuXCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcGxpY2F0aW9uO1xyXG4iLCIvKipcclxuICogV2luZG93IGFuZCBpY29uIGluaGVyaXRzIGZyb20gZW50aXR5XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gRW50aXR5KHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMud2lkdGggPSBzZXR0aW5ncy53aWR0aCA/IHNldHRpbmdzLndpZHRoIDogMTAwO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ID0gc2V0dGluZ3MuaGVpZ2h0ID8gc2V0dGluZ3MuaGVpZ2h0IDogMTAwO1xyXG5cclxuICAgIHRoaXMueFBvcyA9IHNldHRpbmdzLnhQb3MgPyBzZXR0aW5ncy54UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMueVBvcyA9IHNldHRpbmdzLnlQb3MgPyBzZXR0aW5ncy55UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMuekluZGV4ID0gc2V0dGluZ3MuekluZGV4ID8gc2V0dGluZ3MuekluZGV4IDogMDtcclxuXHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSBzZXR0aW5ncy5pc1NlbGVjdGVkID8gc2V0dGluZ3MuaXNTZWxlY3RlZCA6IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHNldHRpbmdzLmlzRHJhZ2dpbmcgPyBzZXR0aW5ncy5pc0RyYWdnaW5nIDogZmFsc2U7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLndpZHRoO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFhQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnhQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0WVBvcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueVBvcztcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS51cGRhdGVQb3MgPSBmdW5jdGlvbih4UG9zLCB5UG9zKSB7XHJcbiAgICB0aGlzLnhQb3MgPSB4UG9zO1xyXG4gICAgdGhpcy55UG9zID0geVBvcztcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldElzU2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWQ7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuc2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcImRyYWdnaW5nXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiZHJhZ2dpbmdcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNEcmFnZ2luZztcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoXCIuL0VudGl0eS5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIEljb24oc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgRW50aXR5LmNhbGwodGhpcywge1xyXG4gICAgICAgIFwieFBvc1wiOiBzZXR0aW5ncy54UG9zLFxyXG4gICAgICAgIFwieVBvc1wiOiBzZXR0aW5ncy55UG9zLFxyXG4gICAgICAgIFwiekluZGV4XCI6IHNldHRpbmdzLnpJbmRleCxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pY29uVGV4dCAgICAgICAgPSBzZXR0aW5ncy5pY29uVGV4dCA/IHNldHRpbmdzLmljb25UZXh0IDogXCJObyBpY29uIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLndpZHRoICAgICAgICAgICA9IHNldHRpbmdzLndpZHRoID8gc2V0dGluZ3Mud2lkdGggOiAxMDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCAgICAgICAgICA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDEwO1xyXG5cclxuICAgIHRoaXMuYXBwbGljYXRpb25OYW1lID0gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lID8gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lIDogXCJcIjtcclxuXHJcbiAgICB0aGlzLmljb25JbWFnZSAgICAgICA9IHNldHRpbmdzLmljb25JbWFnZSA/IHNldHRpbmdzLmljb25JbWFnZSA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplICAgICAgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwic21hbGxcIjtcclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgICAgICAgPSBpbml0aWFsaXplQ29udGFpbmVyLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RHcmlkUG9zaXRpb24oKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplQ29udGFpbmVyKCkge1xyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtaWNvblwiKTtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgICAgICBsZXQgaWNvbkltYWdlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgaWNvbkltYWdlRWxlbS5zcmMgPSBcIi4vaW1hZ2UvXCIgKyB0aGlzLmljb25JbWFnZTtcclxuXHJcbiAgICAgICAgbGV0IGljb25UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgaWNvblRleHQudGV4dENvbnRlbnQgPSB0aGlzLmljb25UZXh0O1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkltYWdlRWxlbSk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25UZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEljb24gaW5oZXJpdHMgZnJvbSBFbnRpdHlcclxuICovXHJcbkljb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuSWNvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJY29uO1xyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0QXBwbGljYXRpb25OYW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hcHBsaWNhdGlvbk5hbWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJY29ucyBhcmUgc3VwcG9zZWQgdG8gYmUgYWxpZ25lZCBpbiBhIGdyaWQgc3lzdGVtLlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGNvcnJlY3RzIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIG9mIHRoZSBpY29uLCBtYWtpbmcgaXQgYWxpZ24gdG8gdGhlIG5lYXJlc3QgZ3JpZFxyXG4gKi9cclxuSWNvbi5wcm90b3R5cGUuY29ycmVjdEdyaWRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy54UG9zID0gdGhpcy54UG9zIC0gdGhpcy54UG9zICUgMTAwO1xyXG4gICAgdGhpcy55UG9zID0gNSArIHRoaXMueVBvcyAtIHRoaXMueVBvcyAlIDEwMDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRCYWNrZ3JvdW5kQ29sb3IgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvblRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmljb25UZXh0O1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJY29uSW1hZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmljb25JbWFnZTtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2luZG93U2l6ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xyXG4iLCIvKipcclxuICogVGhlIEFQSSBpcyBhIHdheSBmb3IgYXBwbGljYXRpb25zIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIFBXRFxyXG4gKi9cclxuZnVuY3Rpb24gTXlBUEkoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5wd2RDb250YWluZXIgPSBzZXR0aW5ncy5wd2RDb250YWluZXIgPyBzZXR0aW5ncy5wd2RDb250YWluZXIgOiB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbk15QVBJLnByb3RvdHlwZS5zZXRQd2RCYWNrZ3JvdW5kID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIGxldCBwcmVmaXggPSBcIm1haW4tLWJhY2tncm91bmQtXCI7XHJcblxyXG4gICAgTXlBUEkucHJvdG90eXBlLnJlbW92ZUNsYXNzZXNXaXRoUHJlZml4KHByZWZpeCwgdGhpcy5wd2RDb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMucHdkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQocHJlZml4ICsgaW5kZXgpO1xyXG59XHJcblxyXG5NeUFQSS5wcm90b3R5cGUuc2V0UHdkRGlzcGxheVJlc29sdXRpb24gPSBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgbGV0IHByZWZpeCA9IFwibWFpbi0tZGlzcGxheVJlcy1cIjtcclxuXHJcbiAgICBNeUFQSS5wcm90b3R5cGUucmVtb3ZlQ2xhc3Nlc1dpdGhQcmVmaXgocHJlZml4LCB0aGlzLnB3ZENvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5wd2RDb250YWluZXIuY2xhc3NMaXN0LmFkZChwcmVmaXggKyBpbmRleCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgY2xhc3NlcyB3aXRoIHByZWZpeFxyXG4gKi9cclxuTXlBUEkucHJvdG90eXBlLnJlbW92ZUNsYXNzZXNXaXRoUHJlZml4ID0gZnVuY3Rpb24ocHJlZml4LCBlbGVtKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW0uY2xhc3NMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0W2ldLmluZGV4T2YocHJlZml4KSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGVsZW0uY2xhc3NMaXN0W2ldKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15QVBJO1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNeVdpbmRvdyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgRW50aXR5LmNhbGwodGhpcywge1xyXG4gICAgICAgIFwieFBvc1wiOiBzZXR0aW5ncy54UG9zLFxyXG4gICAgICAgIFwieVBvc1wiOiBzZXR0aW5ncy55UG9zLFxyXG4gICAgICAgIFwiekluZGV4XCI6IHNldHRpbmdzLnpJbmRleCxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIC8vdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBcIiNcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy50b3BCYXJUZXh0ID0gc2V0dGluZ3MudG9wQmFyVGV4dCA/IHNldHRpbmdzLnRvcEJhclRleHQgOiBcIk5vIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLnRvcEJhckljb24gPSBzZXR0aW5ncy50b3BCYXJJY29uID8gc2V0dGluZ3MudG9wQmFySWNvbiA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcIm1lZGl1bVwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgIGxldCB3aW5kb3dUb3BCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFySWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICB3aW5kb3dUb3BCYXJJY29uLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMudG9wQmFySWNvbjtcclxuICAgIHdpbmRvd1RvcEJhckljb24uYWx0ID0gXCJUb3AgYmFyIGljb25cIjtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgd2luZG93VG9wQmFyU3Bhbi50ZXh0Q29udGVudCA9IHRoaXMudG9wQmFyVGV4dDtcclxuXHJcbiAgICBsZXQgd2luZG93TWluaW1pemVFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB3aW5kb3dNaW5pbWl6ZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X21pbmltaXplXCIpO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tbWludXMtcm91bmRcIik7XHJcblxyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3Jlc2l6ZVwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93Q2xvc2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB3aW5kb3dDbG9zZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2Nsb3NlXCIpO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tY2xvc2Utcm91bmRcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd0NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93Q29udGVudC5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19jb250ZW50XCIpO1xyXG4gICAgd2luZG93Q29udGVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIlBXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMuaWQpO1xyXG4gICAgaWYgKHRoaXMuYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgd2luZG93Q29udGVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhcl93cmFwcGVyXCIpO1xyXG5cclxuICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJJY29uKTtcclxuICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJTcGFuKTtcclxuXHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcik7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd01pbmltaXplRWxlbSk7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMud2luZG93UmVzaXplRWxlbSk7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd0Nsb3NlRWxlbSk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyV3JhcHBlcik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh3aW5kb3dDb250ZW50KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlbW92ZSBhbGwgY2xhc3Nlc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImlvbi1hcnJvdy1zaHJpbmtcIik7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tYXJyb3ctZXhwYW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAzMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDQ1MDtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1hcnJvdy1zaHJpbmtcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1cIiArIHRoaXMud2luZG93U2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCB0ZXN0ID0gdGhpcy5pZCA8IDEwID8gXCIwXCIgOiBcIlwiO1xyXG4gICAgICAgIHRlc3QgKz0gdGhpcy5pZDtcclxuXHJcbiAgICAgICAgdGhpcy54UG9zID0gKDEwMCsyMDAqdGVzdFswXSArIDE1ICogdGhpcy5pZCk7XHJcbiAgICAgICAgdGhpcy55UG9zID0gKDIwICsgMzAgKiAodGhpcy5pZCAtIHRlc3RbMF0qMTApKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0UG9zaXRpb24oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFdpbmRvdyBpbmhlcml0cyBmcm9tIEVudGl0eVxyXG4gKi9cclxuTXlXaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuTXlXaW5kb3cucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTXlXaW5kb3c7XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuZ2V0TWluaW1pemVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5taW5pbWl6ZWQ7XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5zZXRNaW5pbWl6ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5taW5pbWl6ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5taW5pbWl6ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWF4aW1pemVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1pbmltaXplXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWluaW1pemVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWF4aW1pemVcIik7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLVwiICsgdGhpcy53aW5kb3dTaXplKTtcclxuXHJcbiAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgY2FzZSBcInNtYWxsXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwibWVkaXVtXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJiaWdcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcInNtYWxsXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hcHBsaWNhdGlvbk9iai5jbG9zZSgpO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15V2luZG93O1xyXG4iLCJjb25zdCBNeVdpbmRvdyA9IHJlcXVpcmUoXCIuL015V2luZG93LmpzXCIpO1xyXG5jb25zdCBJY29uID0gcmVxdWlyZShcIi4vSWNvbi5qc1wiKTtcclxuY29uc3QgUGFuZWwgPSByZXF1aXJlKFwiLi9QYW5lbC5qc1wiKTtcclxuY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi9BcHBsaWNhdGlvbi5qc1wiKTtcclxuY29uc3QgTXlBUEkgPSByZXF1aXJlKFwiLi9NeUFQSS5qc1wiKTtcclxuY29uc3QgTWVtb3J5ID0gcmVxdWlyZShcIi4vYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qc1wiKTtcclxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoXCIuL2FwcHMvQ2hhdC9DaGF0U3RhcnQuanNcIik7XHJcbmNvbnN0IFNldHRpbmdzID0gcmVxdWlyZShcIi4vYXBwcy9TZXR0aW5ncy9TZXR0aW5ncy5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFBXRChzZXR0aW5ncyA9IHt9KSB7XHJcblxyXG4gICAgaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBkZWZhdWx0IGJlaGF2aW91ci9wcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvcGVydGllc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93cyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmljb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYXBpID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdUYXJnZXQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93Q291bnRlciA9IDA7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEVsZW1lbnRzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWFpblwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwibWFpbi0tYmFja2dyb3VuZC0zXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtYWluLS1kaXNwbGF5UmVzLTBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLmhyZWYgPSBcIiNcIjtcclxuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3N0YXJ0QnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0LmNsYXNzTGlzdC5hZGQoXCJQV0Qtc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0LS1oaWRlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0X3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgdGhpcy5zdGFydF90aXRsZS5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0X190aXRsZVwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X3RpdGxlLnRleHRDb250ZW50ID0gXCJIZWohXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRfbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfbWVzc2FnZS5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0X19tZXNzYWdlXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfbWVzc2FnZS50ZXh0Q29udGVudCA9IFwiTWFkZSBieSBTaW1vbiDDlnN0ZXJkYWhsXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydF90aXRsZSk7XHJcbiAgICAgICAgdGhpcy5zdGFydC5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0X21lc3NhZ2UpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgdGhpcy5jbG9ja0J1dHRvbi5ocmVmID0gXCIjXCI7XHJcbiAgICAgICAgdGhpcy5jbG9ja0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9jbG9ja0J1dHRvblwiKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlQ2xvY2tCdXR0b24oKSB7XHJcbiAgICAgICAgICAgIGxldCBkID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tCdXR0b24udGV4dENvbnRlbnQgPSBkLmdldEhvdXJzKCkgKyBcIjpcIiArIChkLmdldE1pbnV0ZXMoKSA8IDEwID8gXCIwXCIgKyBkLmdldE1pbnV0ZXMoKSA6IGQuZ2V0TWludXRlcygpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwZGF0ZUNsb2NrQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIHNldEludGVydmFsKHVwZGF0ZUNsb2NrQnV0dG9uLCAzMDAwMCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2suY2xhc3NMaXN0LmFkZChcIlBXRC1jbG9ja1wiKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2stLWhpZGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2tfYmlnQ2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2tfX2JpZ1RpbWVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2tfZGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2tfZGF0ZS5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrX19kYXRlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tfYmlnQ2xvY2spO1xyXG4gICAgICAgIHRoaXMuY2xvY2suYXBwZW5kQ2hpbGQodGhpcy5jbG9ja19kYXRlKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlQ2xvY2soKSB7XHJcbiAgICAgICAgICAgIGxldCBkID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tfYmlnQ2xvY2sudGV4dENvbnRlbnQgPSBkLmdldEhvdXJzKCkgKyBcIjpcIiArIChkLmdldE1pbnV0ZXMoKSA8IDEwID8gXCIwXCIgKyBkLmdldE1pbnV0ZXMoKSA6IGQuZ2V0TWludXRlcygpKSArIFwiOlwiICsgKGQuZ2V0U2Vjb25kcygpIDwgMTAgPyBcIjBcIiArIGQuZ2V0U2Vjb25kcygpIDogZC5nZXRTZWNvbmRzKCkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1vbnRoTmFtZXMgPSBbXCJKYW51YXJpXCIsIFwiRmVicnVhcmlcIiwgXCJNYXJzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVseVwiLCBcIkF1Z3VzdGlcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tfZGF0ZS50ZXh0Q29udGVudCA9IFwiZGVuIFwiICsgZC5nZXREYXRlKCkgKyBcIiBcIiArIG1vbnRoTmFtZXNbZC5nZXRNb250aCgpXSArIFwiIFwiICsgZC5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwodXBkYXRlQ2xvY2ssIDEwMDApO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMucGFuZWxzV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbHNXcmFwcGVyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmJvdHRvbUJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJcIik7XHJcblxyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmFwcGVuZENoaWxkKHRoaXMuc3RhcnRCdXR0b24pO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmFwcGVuZENoaWxkKHRoaXMucGFuZWxzV3JhcHBlcik7XHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuYXBwZW5kQ2hpbGQodGhpcy5jbG9ja0J1dHRvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc3RhcnQpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2xvY2spO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYm90dG9tQmFyKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZXR0aW5ncy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIHRoZSBkZXNrdG9wIGljb25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgc21hbGxcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwibWVtb3J5SWNvbi5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwic21hbGxcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgbWVkaXVtXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDEyMCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJtZW1vcnlJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIixcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMTkzLDE1NCwxMDcpXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiTWVtb3J5IGJpZ1wiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAyNTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwibWVtb3J5SWNvbi5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwiYmlnXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiQ2hhdFwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIkNoYXRcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMzUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcImNoYXQucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIlNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiU2V0dGluZ3NcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogNDUwLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIlxyXG4gICAgICAgIH0pICk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFwcGVuZCB0aGUgaWNvbnMgdG8gdGhlIGNvbnRhaW5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmljb25zW2ldLmdldENvbnRhaW5lcigpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xyXG4gICAgICAgICAgICBsYXVuY2hBcHBsaWNhdGlvbih0aGlzLmljb25zWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbGF1bmNoQXBwbGljYXRpb24odGhpcy5pY29uc1szXSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZCBsaXN0ZW5lcnNcclxuICAgICAgICAgKi9cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd25FdmVudCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZXVwRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRibGNsaWNrXCIsIGRibGNsaWNrRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXZlbnQgZnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1vdXNlZG93bkV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGb3IgZXZlcnkgbW91c2Vkb3duIGV2ZW50IHdlIHdpbGwgYXR0ZW1wdCB0byBmaW5kIGEgbmV3IHRhcmdldFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGEgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIE15V2luZG93KSB7XHJcbiAgICAgICAgICAgIGxldCBwd2RXaW5kb3cgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZihwd2RXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgLy8gLyoqXHJcbiAgICAgICAgICAgIC8vICAqIFNldCB0aGUgd2luZG93IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgIC8vICAqL1xyXG4gICAgICAgICAgICAvLyBzZWxlY3RFbnRpdHkodGhpcy53aW5kb3dzW2luZGV4XSwgdGhpcy53aW5kb3dzKTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gLyoqXHJcbiAgICAgICAgICAgIC8vICAqIE1hcmsgdGhlIGFzc29jaWF0ZWQgcGFuZWwgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgLy8gICovXHJcbiAgICAgICAgICAgIC8vIHNlbGVjdEVudGl0eSh0aGlzLnBhbmVsc1tpbmRleF0sIHRoaXMucGFuZWxzKTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gc2VsZWN0RW50aXR5KHRoaXMuYXBwbGljYXRpb25zW2luZGV4XSwgdGhpcy5hcHBsaWNhdGlvbnMpO1xyXG4gICAgICAgICAgICBzZWxlY3RXaW5kb3dQYW5lbEFwcChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRGVzZWxlY3QgaWNvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbnNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiB0YXJnZXQgaXMgdGhlIHdpbmRvdyB0b3AgYmFyIC0+IGFkZCBtb3VzZW1vdmUgbGlzdGVuZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dUb3BCYXJFbGVtID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93VG9wQmFyRWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IHB3ZFdpbmRvdztcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0YXJnZXQgaXMgYSBwYW5lbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYW5lbCkge31cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBsZXQgaWNvbiA9IHRhcmdldDtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNldCB0aGUgaWNvbiBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLy9zZWxlY3RFbnRpdHkoaWNvbiwgdGhpcy5pY29ucyk7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGljb25zLmluZGV4T2YoaWNvbik7XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RJY29uKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZXNlbGVjdCB0aGUgd2luZG93IGFuZCBhc3NvY2lhdGVkIHBhbmVsXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy53aW5kb3dzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBBZGQgbW91c2Vtb3ZlIGxpc3RlbmVyXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdUYXJnZXQgPSBpY29uO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb3VzZXVwRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSGlkZSBjbG9jayBpZiBtb3VzZXVwIGhhcyBiZWVuIG1hZGUgb3V0c2lkZSBjbG9jayBhbmQgY2xvY2tCdXR0b25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0ICE9PSBcImNsb2NrXCIgJiYgdGFyZ2V0ICE9PSBcImNsb2NrQnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcIlBXRC1jbG9jay0taGlkZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrLS1oaWRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIaWRlIHN0YXJ0IGlmIG1vdXNldXAgaGFzIGJlZW4gbWFkZSBvdXRzaWRlIHN0YXJ0IGFuZCBzdGFydEJ1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgIT09IFwic3RhcnRcIiAmJiB0YXJnZXQgIT09IFwic3RhcnRCdXR0b25cIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhcnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiUFdELXN0YXJ0LS1oaWRlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0LmNsYXNzTGlzdC5hZGQoXCJQV0Qtc3RhcnQtLWhpZGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBNeVdpbmRvdykge1xyXG4gICAgICAgICAgICBsZXQgcHdkV2luZG93ID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgd2luZG93IGlzIGJlaW5nIGRyYWdnZWQgLT4gc3RvcCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1RhcmdldCBpbnN0YW5jZW9mIE15V2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdUYXJnZXQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93LnNldElzRHJhZ2dpbmcoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGEgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgbGV0IHBhbmVsID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wYW5lbHMuaW5kZXhPZihwYW5lbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcihcIlBhbmVsIHdhcyBub3QgZm91bmQuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxzW2luZGV4XS5nZXRJc1NlbGVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbaW5kZXhdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1tpbmRleF0uc2V0TWluaW1pemVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdFdpbmRvd1BhbmVsQXBwKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0TWluaW1pemVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRhcmdldCBpcyBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgbGV0IGljb24gPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIGljb24uc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGljb24uY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBpcyBiZWluZyBkcmFnZ2VkIC0+IHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldC5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldC5jb3JyZWN0R3JpZFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERlc2VsZWN0IHdpbmRvdywgcGFuZWwgYW5kIGljb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbnNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICBpZiAodGFyZ2V0ID09PSBcInN0YXJ0QnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QudG9nZ2xlKFwiUFdELXN0YXJ0LS1oaWRlXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gXCJjbG9ja0J1dHRvblwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2suY2xhc3NMaXN0LnRvZ2dsZShcIlBXRC1jbG9jay0taGlkZVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBNeVdpbmRvdykge1xyXG4gICAgICAgICAgICBsZXQgcHdkV2luZG93ID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X2Nsb3NlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvd0Nsb3NlRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy53aW5kb3dzLmluZGV4T2YocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjbG9zZVdpbmRvdyhpbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSByZXNpemUgYnV0dG9uIC0+IHJlc2l6ZSB0aGUgd2luZG93XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93UmVzaXplRGl2ID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19yZXNpemVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93UmVzaXplRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93LnJlc2l6ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgbWluaW1pemUgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93TWluaW1pemVEaXYgPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X21pbmltaXplXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvd01pbmltaXplRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93LnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cuc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gd2luZG93cy5pbmRleE9mKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbaW5kZXhdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGFyZ2V0IGlzIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgbGV0IHBhbmVsID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGFuZWxzLmluZGV4T2YocGFuZWwpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAocGFuZWwuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0QtYm90dG9tQmFyX3BhbmVsX19jbG9zZVwiKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGNsb3NlV2luZG93KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGJsY2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0YXJnZXQgaXMgYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIGxldCBpY29uID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIExhdW5jaCB0aGUgYXBwbGljYXRpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBpY29uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsYXVuY2hBcHBsaWNhdGlvbihpY29uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbW91c2Vtb3ZlRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRoZXJlIGlzIGEgZHJhZyB0YXJnZXQgLT4gdXBkYXRlIGl0cyBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQpIHtcclxuICAgICAgICAgICAgbGV0IGRyYWdUYXJnZXQgPSB0aGlzLmRyYWdUYXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHdkV2lkdGggPSB0aGlzLmNvbnRhaW5lci5vZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgbGV0IHB3ZEhlaWdodCA9IHRoaXMuY29udGFpbmVyLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJzb3JYID0gZS5wYWdlWDtcclxuICAgICAgICAgICAgbGV0IGN1cnNvclkgPSBlLnBhZ2VZO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WCA9IGUubW92ZW1lbnRYO1xyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRZID0gZS5tb3ZlbWVudFk7XHJcblxyXG4gICAgICAgICAgICBkcmFnVGFyZ2V0LnNldElzRHJhZ2dpbmcodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgbW91c2UgcG9pbnRlciBpcyBvdXRzaWRlIHdpbmRvdyAtPiBkbyBub3QgdXBkYXRlIHRoZSBwb3NpdGlvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKGN1cnNvclkgKyAxMCA8IDAgfHwgY3Vyc29yWSA+IHB3ZEhlaWdodCAtIDQwIC0gMTApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJzb3JYICsgMTAgPCAwIHx8IGN1cnNvclggPiBwd2RXaWR0aCAtIDEwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFggPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkcmFnVGFyZ2V0LnVwZGF0ZVBvcyhkcmFnVGFyZ2V0LmdldFhQb3MoKSArIG1vdmVtZW50WCwgZHJhZ1RhcmdldC5nZXRZUG9zKCkgKyBtb3ZlbWVudFkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUiEgXCIgKyBtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJyaW5ncyB0aGUgaWNvbiB3aXRoIHRoZSBnaXZlbiBpbmRleCB0byB0aGUgZnJvbnQgb2YgdGhlIGljb25zIGFycmF5XHJcbiAgICAgKiBCZWluZyBpbiBmcm9udCBvZiB0aGUgYXJyYXkgbWVhbnMgXCJzZWxlY3RlZFwiXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNlbGVjdEljb24oaW5kZXgpIHtcclxuICAgICAgICBsZXQgaWNvblRlbXAgPSB0aGlzLmljb25zW2luZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmljb25zLnVuc2hpZnQoaWNvblRlbXApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXNlbGVjdCB0aGUgbGFzdCBhY3RpdmUgaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLmljb25zWzFdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWNvbnNbMV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmljb25zWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCcmluZ3MgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIGluZGV4IHRvIHRoZSBmcm9udCBvZiB0aGVpciByZXNwZWN0aXZlIGFycmF5c1xyXG4gICAgICogQmVpbmcgaW4gZnJvbnQgb2YgdGhlIGFycmF5IG1lYW5zIFwic2VsZWN0ZWRcIlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RXaW5kb3dQYW5lbEFwcChpbmRleCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFwcGxpY2F0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IGFwcGxpY2F0aW9uVGVtcCA9IHRoaXMuYXBwbGljYXRpb25zW2luZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMudW5zaGlmdChhcHBsaWNhdGlvblRlbXApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgd2luZG93VGVtcCA9IHRoaXMud2luZG93c1tpbmRleF07XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3MudW5zaGlmdCh3aW5kb3dUZW1wKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMud2luZG93c1sxXSkge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd3NbMV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0SXNTZWxlY3RlZCh0cnVlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcGFuZWxUZW1wID0gdGhpcy5wYW5lbHNbaW5kZXhdO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy51bnNoaWZ0KHBhbmVsVGVtcCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhbmVsc1sxXSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsc1sxXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGFuZWxzWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdpdmUgd2luZG93cyB6LWluZGV4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFwcGxpY2F0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuc3R5bGUuekluZGV4ID0gdGhpcy5pY29ucy5sZW5ndGggKyB0aGlzLmFwcGxpY2F0aW9ucy5sZW5ndGggLSBpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFrZSBzdXJlIHN0YXJ0LCBjbG9jayBhbmQgYm90dG9tIGJhciBhbHdheXMgaXMgb24gdG9wXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHRvcFpJbmRleCA9IHRoaXMuYXBwbGljYXRpb25zLmxlbmd0aCArIHRoaXMuaWNvbnMubGVuZ3RoO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0LnN0eWxlLnpJbmRleCA9IHRvcFpJbmRleCArIDE7XHJcbiAgICAgICAgdGhpcy5jbG9jay5zdHlsZS56SW5kZXggPSB0b3BaSW5kZXggKyAxO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLnN0eWxlLnpJbmRleCA9IHRvcFpJbmRleCArIDI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9zZSBhIHdpbmRvdyB3aXRoIGEgZ2l2ZW4gaW5kZXhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2xvc2VXaW5kb3coaW5kZXgpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxsIHRoZSBjbG9zZSBmdW5jdGlvbm4gaW1wbGVtZW50ZWQgYnkgZXZlcnkgYXBwbGljYXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uc1tpbmRleF0uY2xvc2UoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlIHRoZSB3aW5kb3cgYW5kIHBhbmVsIGZyb20gdGhlIERPTVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93c1tpbmRleF0uZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLndpbmRvd3NbaW5kZXhdLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNbaW5kZXhdLmdldENvbnRhaW5lcigpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5wYW5lbHNbaW5kZXhdLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlIHRoZSB3aW5kb3csIHBhbmVsIGFuZCBhcHBsaWNhdGlvbiBmcm9tIHRoZWlyIHJlc3BlY3RpdmUgYXJyYXlzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgdGhpcy5wYW5lbHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGVuIGEgcGFuZWwgaXMgcmVtb3ZlZCwgbWFrZSBzdXJlIHRoZSBvdGhlciBwYW5lbHMnIHdpZHRoIGlzIGNvcnJlY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICAgY2FsY3VsYXRlUGFuZWxXaWR0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgYSBnaXZlbiB0YXJnZXQgZXhpc3RzIGluIGEgd2luZG93LCBwYW5lbCBvciBpY29uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZpbmRUYXJnZXQodGFyZ2V0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRCdXR0b24uY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJzdGFydEJ1dHRvblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnQuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJzdGFydFwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2xvY2tCdXR0b24uY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjbG9ja0J1dHRvblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2xvY2suY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjbG9ja1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgd2luZG93c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIGluIGEgd2luZG93IC0+IG1hcmsgdGhlIHdpbmRvdyBhbmQgdGhlIHBhbmVsIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy53aW5kb3dzW2ldLmdldENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndpbmRvd3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIHBhbmVsc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYW5lbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgaW4gYSBwYW5lbCAtPiBtYXJrIHRoZSBwYW5lbCBhbmQgdGhlIHdpbmRvdyBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxzW2ldLmdldENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhbmVsc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgaWNvbnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvbiAtPiBtYXJrIHRoZSBpY29uIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pY29uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlcmUgaXMgbm8gdGFyZ2V0IC0+IHJldHVybiB1bmRlZmluZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgd2lkdGggb2YgdGhlIHBhbmVscywgbWFraW5nIHN1cmUgYWxsIHBhbmVscyBmaXQgaW4gdGhlIGJvdHRvbSBiYXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlUGFuZWxzV2lkdGgoKSB7XHJcbiAgICAgICAgbGV0IHBhbmVsV2lkdGggPSAxODggKiB0aGlzLnBhbmVscy5sZW5ndGggKyAxMDA7XHJcblxyXG4gICAgICAgIGxldCBwd2RXaWR0aCA9IHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoO1xyXG5cclxuICAgICAgICBpZiAocGFuZWxXaWR0aCA+IHB3ZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYW5lbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYW5lbEVsZW0gPSB0aGlzLnBhbmVsc1tpXS5nZXRDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYW5lbEVsZW0uc3R5bGUud2lkdGggPSB0aGlzLnBhbmVsc1dyYXBwZXIub2Zmc2V0V2lkdGggLyB0aGlzLnBhbmVscy5sZW5ndGggLSA4ICsgXCJweFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoIGFuIGFwcGxpY2F0aW9uLCB3aW5kb3cgYW5kIHBhbmVsIHVzaW5nIHRoZSBtZXRhIGRhdGEgaW4gYSBnaXZlbiBpY29uIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsYXVuY2hBcHBsaWNhdGlvbihpY29uT2JqKSB7XHJcbiAgICAgICAgbGV0IGlkID0gdGhpcy53aW5kb3dzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIGEgbmV3IHdpbmRvdyB0byBsYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGluXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IG5ldyBNeVdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy53aW5kb3dDb3VudGVyLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogaWNvbk9iai5nZXRXaW5kb3dTaXplKCksXHJcbiAgICAgICAgICAgIFwidG9wQmFyVGV4dFwiOiBpY29uT2JqLmdldEljb25UZXh0KCksXHJcbiAgICAgICAgICAgIFwidG9wQmFySWNvblwiOiBpY29uT2JqLmdldEljb25JbWFnZSgpLFxyXG4gICAgICAgICAgICBcInpJbmRleFwiOiB0aGlzLmljb25zLmxlbmd0aCxcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIiA6IGljb25PYmouZ2V0QmFja2dyb3VuZENvbG9yKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnB1c2gocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHdkV2luZG93LmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIGV2ZXJ5IHdpbmRvdyB0aGVyZSBpcyBhbHNvIGEgcGFuZWwgaW4gdGhlIGJvdHRvbSBiYXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcHdkUGFuZWwgPSBuZXcgUGFuZWwoe1xyXG4gICAgICAgICAgICBcInRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcImljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy5wdXNoKHB3ZFBhbmVsKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNXcmFwcGVyLmFwcGVuZENoaWxkKHB3ZFBhbmVsLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2hlbiBhIG5ldyBwYW5lbCBpcyBtYWRlLCBtYWtlIHN1cmUgd2lkdGggaXMgY29ycmVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNhbGN1bGF0ZVBhbmVsc1dpZHRoKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBsaWNhdGlvbk5hbWUgPSBpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpO1xyXG5cclxuICAgICAgICBsZXQgYXBwbGljYXRpb25PYmogPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChhcHBsaWNhdGlvbk5hbWUgPT09IFwiTWVtb3J5XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgTWVtb3J5KHtcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI1BXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMud2luZG93Q291bnRlclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFwcGxpY2F0aW9uTmFtZSA9PT0gXCJDaGF0XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgQ2hhdCh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLndpbmRvd0NvdW50ZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcHBsaWNhdGlvbk5hbWUgPT09IFwiU2V0dGluZ3NcIikge1xyXG4gICAgICAgICAgICBhcHBsaWNhdGlvbk9iaiA9IG5ldyBTZXR0aW5ncyh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLndpbmRvd0NvdW50ZXIsXHJcbiAgICAgICAgICAgICAgICBcImFwaVwiOiBnZXRBcGkoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXBwbGljYXRpb25PYmogaW5zdGFuY2VvZiBBcHBsaWNhdGlvbikge1xyXG4gICAgICAgICAgICBlcnJvcihcIlRoZSBhcHBsaWNhdGlvbiBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgQXBwbGljYXRpb24uXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMucHVzaChhcHBsaWNhdGlvbk9iaik7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gd2luZG93LCBwYW5lbCBhbmQgYXBwbGljYXRpb24gaGFzIG5vdyBiZWVuIG1hZGUgLT4gbWFrZSB0aGVtIHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2VsZWN0V2luZG93UGFuZWxBcHAodGhpcy5hcHBsaWNhdGlvbnMubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93Q291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEFwaSgpIHtcclxuICAgICAgICBpZiAodGhpcy5hcGkgaW5zdGFuY2VvZiBNeUFQSSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcGk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFwaSA9IG5ldyBNeUFQSSh7XHJcbiAgICAgICAgICAgIFwicHdkQ29udGFpbmVyXCI6IHRoaXMuY29udGFpbmVyXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmFwaTtcclxuICAgIH1cclxufVxyXG5cclxuUFdELnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQV0Q7XHJcbiIsImZ1bmN0aW9uIFBhbmVsKHNldHRpbmdzID0ge30pIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICB0aGlzLnRleHQgPSBzZXR0aW5ncy50ZXh0ID8gc2V0dGluZ3MudGV4dCA6IFwibm8gdGV4dFwiO1xyXG5cclxuICAgIHRoaXMuaWNvbiA9IHNldHRpbmdzLmljb24gPyBzZXR0aW5ncy5pY29uIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHNldHRpbmdzLmlzU2VsZWN0ZWQgPyBzZXR0aW5ncy5pc1NlbGVjdGVkIDogZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuaHJlZiA9IFwiI1wiO1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxcIik7XHJcblxyXG4gICAgbGV0IGljb25FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIGljb25FbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbjtcclxuICAgIGljb25FbGVtLmFsdCA9IFwiSWNvblwiO1xyXG4gICAgaWNvbkVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxfX2ljb25cIik7XHJcblxyXG4gICAgbGV0IHNwYW5FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBzcGFuRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9fc3BhblwiKTtcclxuICAgIHNwYW5FbGVtLnRleHRDb250ZW50ID0gdGhpcy50ZXh0O1xyXG5cclxuICAgIGxldCBjbG9zZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIGNsb3NlRWxlbS5ocmVmID0gXCIjXCI7XHJcbiAgICBjbG9zZUVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxfX2Nsb3NlXCIpO1xyXG4gICAgY2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tY2xvc2Utcm91bmRcIik7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkVsZW0pO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc3BhbkVsZW0pO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoY2xvc2VFbGVtKTtcclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLmdldElzU2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWQ7XHJcbn1cclxuXHJcblBhbmVsLnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsO1xyXG4iLCJjb25zdCBQV0QgPSByZXF1aXJlKFwiLi9QV0QuanNcIik7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcHdkID0gbmV3IFBXRCh7XCJjb250YWluZXJcIjogXCJib2R5XCJ9KTtcclxufSk7XHJcbiIsImZ1bmN0aW9uIENoYXQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCJubyBjb250YWluZXJcIjtcclxuXHJcbiAgICB0aGlzLnVzZXJuYW1lID0gc2V0dGluZ3MudXNlcm5hbWUgPyBzZXR0aW5ncy51c2VybmFtZSA6IFwic2ltb25cIjtcclxuXHJcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiKTtcclxuICAgIC8vc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIHNvY2tldE9wZW5FdmVudCk7XHJcbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBzb2NrZXRNZXNzYWdlRXZlbnQpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gTmFtZSBjaGFuZ2UgZGl2XHJcbiAgICBsZXQgbmFtZUNoYW5nZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBuYW1lQ2hhbmdlRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0TmFtZUNoYW5nZVwiKTtcclxuXHJcbiAgICBsZXQgbmFtZUNoYW5nZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIG5hbWVDaGFuZ2VTcGFuLnRleHRDb250ZW50ID0gXCJVc2VybmFtZTogXCIgKyB0aGlzLnVzZXJuYW1lO1xyXG5cclxuICAgIGxldCBuYW1lQ2hhbmdlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIG5hbWVDaGFuZ2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5hbWVDaGFuZ2VFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIG5hbWVDaGFuZ2VCdXR0b24udGV4dENvbnRlbnQgPSBcIkNoYW5nZSBuYW1lXCI7XHJcblxyXG4gICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlU3Bhbik7XHJcbiAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VCdXR0b24pO1xyXG5cclxuICAgIGxldCBuYW1lQ2hhbmdlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcblxyXG4gICAgLy8gTWVzc2FnZXMgZGl2XHJcbiAgICBsZXQgbWVzc2FnZXNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbWVzc2FnZXNEaXYuY2xhc3NMaXN0LmFkZChcImNoYXRNZXNzYWdlc1wiKTtcclxuXHJcbiAgICAvLyBJbnB1dCBmb3JtXHJcbiAgICBsZXQgaW5wdXREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZnJvbVwiKTtcclxuICAgIGlucHV0RGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRcIik7XHJcblxyXG4gICAgLy8gVGV4dGFyZWEgaW4gdGhlIGlucHV0IGRpdlxyXG4gICAgbGV0IGlucHV0RGl2X3RleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dF90ZXh0YXJlYVwiKTtcclxuICAgIC8vIGZpeCB0byBtYWtlIHRleHRhcmVhIHNlbGVjdGFibGVcclxuICAgIGlucHV0RGl2X3RleHRhcmVhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl90ZXh0YXJlYSk7XHJcblxyXG4gICAgLy8gQnV0dG9uIGluIHRoZSBpbnB1dCBkaXZcclxuICAgIGxldCBpbnB1dERpdl9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X2J1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLnRleHRDb250ZW50ID0gXCJTZW5kXCI7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl9idXR0b24pO1xyXG5cclxuICAgIC8vIENoYXQgd3JhcHBlclxyXG4gICAgbGV0IGNoYXRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0V3JhcHBlclwiKTtcclxuXHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlRGl2KTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lc3NhZ2VzRGl2KTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGlucHV0RGl2KTtcclxuXHJcbiAgICAvLyBDb250YWluZXIgZGl2XHJcbiAgICBsZXQgY29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICAvKlxyXG4gICAgZnVuY3Rpb24gc29ja2V0T3BlbkV2ZW50KGUpIHtcclxuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gc29ja2V0TWVzc2FnZUV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2UudHlwZSA9PT0gXCJoZWFydGJlYXRcIikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hhdE1lc3NhZ2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLmNsYXNzTGlzdC5hZGQoXCJjaGF0TWVzc2FnZVwiKTtcclxuXHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IFwiW1wiICsgcmVzcG9uc2UudHlwZSArIFwiXSBcIjtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gcmVzcG9uc2UudXNlcm5hbWUgKyBcIjogXCI7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IHJlc3BvbnNlLmRhdGE7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzRGl2LmFwcGVuZENoaWxkKGNoYXRNZXNzYWdlU3Bhbik7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzRGl2LnNjcm9sbFRvcCA9IG1lc3NhZ2VzRGl2LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBuYW1lQ2hhbmdlRXZlbnQoZSkge1xyXG4gICAgICAgIG5hbWVDaGFuZ2VEaXYudGV4dENvbnRlbnQgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAobmFtZUNoYW5nZUlucHV0LnZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUlucHV0KTtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlSW5wdXQudmFsdWUgPSB0aGlzLnVzZXJuYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBuYW1lQ2hhbmdlSW5wdXQudmFsdWU7XHJcblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNoYXRVc2VybmFtZVwiLCB0aGlzLnVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VJbnB1dC52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlU3Bhbi50ZXh0Q29udGVudCA9IFwiVXNlcm5hbWU6IFwiICsgdGhpcy51c2VybmFtZTtcclxuICAgICAgICAgICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlU3Bhbik7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VCdXR0b24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBidXR0b25FdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gaW5wdXREaXZfdGV4dGFyZWEudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk11c3QgZW50ZXIgYSBtZXNzYWdlIVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlucHV0RGl2X3RleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJkYXRhXCIgOiB2YWx1ZSxcclxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGF0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XHJcbiIsImNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4uLy4uL0FwcGxpY2F0aW9uLmpzXCIpO1xyXG5jb25zdCBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIENoYXRTdGFydChzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwibm8gY29udGFpbmVyXCI7XHJcblxyXG4gICAgdGhpcy5jaGF0T2JqID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gV3JhcHBlclxyXG4gICAgbGV0IGNoYXRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0V3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBDaGF0IHN0YXJ0IGhlYWRlclxyXG4gICAgbGV0IGNoYXRTdGFydEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXIuY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydEhlYWRlclwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXRTdGFydEhlYWRlcik7XHJcblxyXG4gICAgbGV0IGNoYXRTdGFydEhlYWRlclNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIGNoYXRTdGFydEhlYWRlclNwYW4udGV4dENvbnRlbnQgPSBcIlNVUEVSQ0hBVFwiO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyLmFwcGVuZENoaWxkKGNoYXRTdGFydEhlYWRlclNwYW4pO1xyXG5cclxuICAgIC8vIENoYXQgbmFtZSBpbnB1dFxyXG4gICAgbGV0IGNoYXROYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAvLyBmaXggdG8gbWFrZSBpbnB1dCBzZWxlY3RhYmxlXHJcbiAgICBjaGF0TmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgICBjaGF0TmFtZUlucHV0LnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiRW50ZXIgbmFtZSEhIVwiKTtcclxuICAgIGNoYXROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydE5hbWVJbnB1dFwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXROYW1lSW5wdXQpO1xyXG5cclxuICAgIC8vIENoYXQgbmFtZSBidXR0b25cclxuICAgIGxldCBjaGF0TmFtZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0TmFtZUJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU3RhcnQgY2hhdHRpbmchISEhISEhIVwiO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdE5hbWVCdXR0b24pO1xyXG5cclxuICAgIC8vIENvbnRhaW5lciBkaXZcclxuICAgIGxldCBjb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBjb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgYSB1c2VybmFtZSBleGlzdHMgaW4gbG9jYWwgc3RvcmFnZSAtPiBzdGFydCBjaGF0XHJcbiAgICAgKi9cclxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNoYXRVc2VybmFtZVwiKSkge1xyXG4gICAgICAgIHNldHRpbmdzLnVzZXJuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjaGF0VXNlcm5hbWVcIik7XHJcblxyXG4gICAgICAgIGNoYXRXcmFwcGVyRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICB0aGlzLmNoYXRPYmogPSBuZXcgQ2hhdChzZXR0aW5ncyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gY2hhdE5hbWVJbnB1dC52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW50ZXIgYSBuYW1lIVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY2hhdFVzZXJuYW1lXCIsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgc2V0dGluZ3MudXNlcm5hbWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgY2hhdFdyYXBwZXJEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhdE9iaiA9IG5ldyBDaGF0KHNldHRpbmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuQ2hhdFN0YXJ0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwbGljYXRpb24ucHJvdG90eXBlKTtcclxuQ2hhdFN0YXJ0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENoYXRTdGFydDtcclxuXHJcbkNoYXRTdGFydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmNoYXRPYmopIHtcclxuICAgICAgICB0aGlzLmNoYXRPYmouY2xvc2UoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGF0U3RhcnQ7XHJcbiIsImZ1bmN0aW9uIENhcmQodmFsdWUpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIGxldCBjYXJkVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUNhcmRUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBjYXJkVGVtcGxhdGVGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShjYXJkVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gVGhlIGNhcmRFbGVtIGlzIHRoZSBlbGVtZW50IHdyYXBwaW5nIHRoZSB0d28gaW1hZ2VzXHJcbiAgICB0aGlzLmNhcmRFbGVtID0gY2FyZFRlbXBsYXRlRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIHRoaXMudmFsdWUpO1xyXG5cclxuICAgIC8vIFRoZSBjb3ZlckltYWdlIGlzIHRoZSBxdWVzdGlvbiBtYXJrIGFib3ZlIHRoZSBjYXJkIGltYWdlXHJcbiAgICB0aGlzLmNvdmVySW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRfYmFja1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zcmMgPSBcImltYWdlL01lbW9yeS9cIiArIHRoaXMudmFsdWVbMF0gKyBcIi5wbmdcIjtcclxuXHJcbiAgICAvLyBUaGUgY2FyZEltYWdlIGlzIHRoZSBpbWFnZSBvZiB0aGUgbWVtb3J5IGNhcmRcclxuICAgIHRoaXMuY2FyZEltYWdlID0gdGhpcy5jYXJkRWxlbS5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkX2Zyb250XCIpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdW5pcXVlIHZhbHVlIGZvciB0aGlzIGNhcmRcclxuICogVGhlIGNhcmQgaWRlbnRpZmllclxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogRmxpcHMgdGhlIGNhcmRcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmlzRmxpcHBlZCkge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRJc0ZsaXBwZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRmxpcHBlZDtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuc2V0SXNDb21wbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSB2YWx1ZTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcclxuICAgIHRoaXMuY2FyZEVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRDYXJkRWxlbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZEVsZW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZDtcclxuIiwiY29uc3QgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDYXJkcyhuck9mQ2FyZHMpIHtcclxuICAgIHRoaXMuY2FyZHMgPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuck9mQ2FyZHMgKyAxOyBpKyspIHtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAxKSk7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2h1ZmZsZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgbGV0IHRlbXAgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbaV0gPSB0aGlzLmNhcmRzW2pdO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbal0gPSB0ZW1wO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgY2FyZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZVxyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgbGV0IGNhcmQ7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FyZHNbaV0uZ2V0VmFsdWUoKSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgY2FyZCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBmcmFnbWVudCBjb250YWluaW5nIHRoZSBjYXJkIGRpdnMgYW5kIGltYWdlc1xyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmRzRnJhZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNhcmRzRnJhZyA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNhcmRFbGVtID0gdGhpcy5jYXJkc1tpXS5nZXRDYXJkRWxlbSgpO1xyXG4gICAgICAgIGNhcmRzRnJhZy5hcHBlbmRDaGlsZChjYXJkRWxlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmRzRnJhZztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkcztcclxuIiwiY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vQXBwbGljYXRpb24uanNcIik7XHJcbmNvbnN0IE1lbW9yeUdhbWVCb2FyZCA9IHJlcXVpcmUoXCIuL01lbW9yeUdhbWVCb2FyZC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIE1lbW9yeUdhbWUoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIiMxMjNcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIFdyYXBwZXJcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVdyYXBwZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5V3JhcHBlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gbWVtb3J5V3JhcHBlckZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktd3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBIZWFkZXJcclxuICAgIGxldCBtZW1vcnlIZWFkZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5SGVhZGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5SGVhZGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUhlYWRlciA9IG1lbW9yeUhlYWRlckZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlIZWFkZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUhlYWRlcik7XHJcblxyXG4gICAgLy8gUGFpciBmb3JtXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1UZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJGb3JtVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtID0gbWVtb3J5UGFpckZvcm1GcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1cIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVBhaXJGb3JtKTtcclxuXHJcbiAgICAvLyBSYWRpbyBpbnB1dHNcclxuICAgIGxldCBtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpclJhZGlvVGVtcGxhdGVcIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gODsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJSYWRpb0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJSYWRpb1RlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgICAgICBsZXQgbWVtb3J5UGFpckxhYmVsID0gbWVtb3J5UGFpclJhZGlvRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhaXJSYWRpb0xhYmVsXCIpO1xyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyUmFkaW8gPSBtZW1vcnlQYWlyTGFiZWwucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBtZW1vcnlQYWlyTGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaSArIFwiIHBhaXJzXCIpKTtcclxuICAgICAgICAvLyBGaXggdG8gbWFrZSByYWRpbyBpbnB1dHMgY2xpY2thYmxlXHJcbiAgICAgICAgbWVtb3J5UGFpckxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtZW1vcnlQYWlyUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhaXJGb3JtLmFwcGVuZENoaWxkKG1lbW9yeVBhaXJMYWJlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRm9ybSBidXR0b25cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b24gPSBtZW1vcnlQYWlyRm9ybUJ1dHRvbkZyYWcucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcclxuICAgIG1lbW9yeVBhaXJGb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZW1vcnlQYWlyRm9ybUJ1dHRvbkV2ZW50KTtcclxuXHJcbiAgICBtZW1vcnlQYWlyRm9ybS5hcHBlbmRDaGlsZChtZW1vcnlQYWlyRm9ybUJ1dHRvbik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyXHJcbiAgICBsZXQgbWVtb3J5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IG5yT2ZQYWlycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm0gaW5wdXQ6Y2hlY2tlZFwiKS52YWx1ZTtcclxuXHJcbiAgICAgICAgbWVtb3J5V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICBzZXR0aW5ncy5uck9mUGFpcnMgPSBwYXJzZUludChuck9mUGFpcnMpO1xyXG4gICAgICAgIG5ldyBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5NZW1vcnlHYW1lLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwbGljYXRpb24ucHJvdG90eXBlKTtcclxuTWVtb3J5R2FtZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNZW1vcnlHYW1lO1xyXG5cclxuTWVtb3J5R2FtZS5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHt9XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWU7XHJcbiIsImNvbnN0IENhcmRzID0gcmVxdWlyZShcIi4vQ2FyZHMuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCIjY29vbFwiO1xyXG5cclxuICAgIGxldCBuck9mUGFpcnMgPSBzZXR0aW5ncy5uck9mUGFpcnMgPyBzZXR0aW5ncy5uck9mUGFpcnMgOiA0O1xyXG5cclxuICAgIGxldCBjYXJkcyA9IG5ldyBDYXJkcyhuck9mUGFpcnMpO1xyXG5cclxuICAgIGxldCBzY29yZSA9IDA7XHJcblxyXG4gICAgbGV0IGdhbWVUaW1lciA9IDA7XHJcblxyXG4gICAgbGV0IGF0dGVtcHRzID0gMDtcclxuXHJcbiAgICBsZXQgZmlyc3RDYXJkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGxldCBzZWNvbmRDYXJkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGxldCBpc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XHJcblxyXG4gICAgbGV0IGdhbWVUaW1lckludGVydmFsID0gc2V0SW50ZXJ2YWwodGltZXIsIDEwMDApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRUxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gTWVtb3J5IHdyYXBwZXJcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVdyYXBwZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5V3JhcHBlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gbWVtb3J5V3JhcHBlckZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktd3JhcHBlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1lbW9yeVdyYXBwZXJDbGlja0V2ZW50KTtcclxuXHJcbiAgICAvLyBIZWFkZXJcclxuICAgIGxldCBtZW1vcnlIZWFkZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5SGVhZGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5SGVhZGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUhlYWRlciA9IG1lbW9yeUhlYWRlckZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlIZWFkZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUhlYWRlcik7XHJcblxyXG4gICAgLy8gTWVtb3J5IHBhbmVsXHJcbiAgICBsZXQgbWVtb3J5UGFuZWxUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbEZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhbmVsVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhbmVsRGl2ICAgICAgICAgID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LXBhbmVsXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW5cIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxUaW1lU3BhbiAgICAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbFRpbWVTcGFuXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsTWVzc2FnZVNwYW4gID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxNZXNzYWdlU3BhblwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5UGFuZWxEaXYpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBjYXJkc1xyXG4gICAgbGV0IG1lbW95Q2FyZHNUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q2FyZHNUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlDYXJkc0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUNhcmRzVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUNhcmRzRGl2ID0gbWVtb3J5Q2FyZHNGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRzXCIpO1xyXG4gICAgbWVtb3J5Q2FyZHNEaXYuYXBwZW5kQ2hpbGQoY2FyZHMuZ2V0Q2FyZHNGcmFnKCkpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlDYXJkc0Rpdik7XHJcblxyXG4gICAgLy8gTWVtb3J5IGNvbnRhaW5lclxyXG4gICAgbGV0IG1lbW9yeUNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeUNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChtZW1vcnlXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0aW1lcigpIHtcclxuICAgICAgICBnYW1lVGltZXIgKz0gMTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW4udGV4dENvbnRlbnQgPSBcIkF0dGVtcHRzOiBcIiArIGF0dGVtcHRzO1xyXG4gICAgICAgIG1lbW9yeVBhbmVsVGltZVNwYW4udGV4dENvbnRlbnQgPSBcIlRpbWU6IFwiICsgZ2FtZVRpbWVyICsgXCIgc2Vjb25kc1wiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVdyYXBwZXJDbGlja0V2ZW50KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGlzIGN1cnJlbnRseSBjaGVja2luZyBhbnN3ZXIgLT4gZXhpdCBmdW5jdGlvblxyXG4gICAgICAgICAqICh3YWl0aW5nIGZvciB0aW1lciB0byBmaW5pc2gpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKGlzQ2hlY2tpbmdBbnN3ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGltZ0VsZW0gPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGFFbGVtID0gaW1nRWxlbS5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGltZ0VsZW0ucGFyZW50Tm9kZSA6IGltZ0VsZW07XHJcblxyXG4gICAgICAgIGxldCB2YWx1ZSA9IGFFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIik7XHJcblxyXG4gICAgICAgIGxldCBjYXJkID0gY2FyZHMuZ2V0Q2FyZCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmIChjYXJkKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXJkLmdldElzRmxpcHBlZCgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY2FyZC5mbGlwKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0Q2FyZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RDYXJkID0gY2FyZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kQ2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQW5zd2VyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tBbnN3ZXIoKSB7XHJcbiAgICAgICAgaXNDaGVja2luZ0Fuc3dlciA9IHRydWU7XHJcblxyXG4gICAgICAgIGF0dGVtcHRzICs9IDE7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlyc3RDYXJkLmdldFZhbHVlKClbMF0gPT09IHNlY29uZENhcmQuZ2V0VmFsdWUoKVswXSkge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLmFkZENsYXNzKFwiTWVtb3J5LWNhcmQtLWNvcnJlY3RcIik7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLmFkZENsYXNzKFwiTWVtb3J5LWNhcmQtLWNvcnJlY3RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcmUgKz0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIHNjb3JlIGlzIGVxdWFsIHRvIG1heGltdW0gYW1vdW50IG9mIHBhaXJzIC0+IHRoZSBnYW1lIGlzIGNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChzY29yZSA9PT0gbnJPZlBhaXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChnYW1lVGltZXJJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5UGFuZWxNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCA9IFwiWW91IGNvbXBsZXRlZCB0aGUgZ2FtZSFcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5mbGlwKCk7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlyc3RDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBzZWNvbmRDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWVCb2FyZDtcclxuIiwiY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vQXBwbGljYXRpb24uanNcIik7XHJcblxyXG5mdW5jdGlvbiBTZXR0aW5ncyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBBcHBsaWNhdGlvbi5jYWxsKHRoaXMsIHtcclxuICAgICAgIFwiYXBpXCI6IHNldHRpbmdzLmFwaVxyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLndpbmRvd0RpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpO1xyXG4gICAgdGhpcy53aW5kb3dEaXYuY2xhc3NMaXN0LmFkZChcInNldHRpbmdzV3JhcHBlclwiKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJhY2tncm91bmRcclxuICAgICAqL1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZFRpdGxlLnRleHRDb250ZW50ID0gXCJDaGFuZ2UgYmFja2dyb3VuZFwiO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0uY2xhc3NMaXN0LmFkZChcInNldHRpbmdzQmFja2dyb3VuZEZvcm1cIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICBsZXQgZm9ybUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGZvcm1MYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJiYWNrZ3JvdW5kRm9ybVwiICsgdGhpcy5jb250YWluZXIgKyBpKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcm1SYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImJhY2tncm91bmRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiYmFja2dyb3VuZEZvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XHJcblxyXG4gICAgICAgIGxldCBmb3JtSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGZvcm1JbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCIuL2ltYWdlL2JhY2tncm91bmRcIiArIGkgKyBcIl9zbWFsbC5qcGdcIik7XHJcbiAgICAgICAgZm9ybUltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkJhY2tncm91bmRcIik7XHJcblxyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtUmFkaW8pO1xyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtSW1hZ2UpO1xyXG5cclxuICAgICAgICB0aGlzLmJhY2tncm91bmRGb3JtLmFwcGVuZENoaWxkKGZvcm1MYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kVGl0bGUpO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJhY2tncm91bmRGb3JtKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgcmVzb2x1dGlvblxyXG4gICAgICovXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgdGhpcy5kaXNwbGF5UmVzVGl0bGUudGV4dENvbnRlbnQgPSBcIkNoYW5nZSBEaXNwbGF5IFJlc29sdXRpb25cIjtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XHJcbiAgICB0aGlzLmRpc3BsYXlSZXNGb3JtLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc0Rpc3BsYXlSZXNGb3JtXCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGZvcm1MYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICBmb3JtTGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwiZGlzcGxheVJlc0Zvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XHJcblxyXG4gICAgICAgIGxldCBmb3JtUmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYWRpb1wiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJkaXNwbGF5UmVzXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImRpc3BsYXlSZXNGb3JtXCIgKyB0aGlzLmNvbnRhaW5lciArIGkpO1xyXG5cclxuICAgICAgICBsZXQgZm9ybVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBmb3JtU3Bhbi50ZXh0Q29udGVudCA9IFwiYXNkYXNkYXNkYXNkXCI7XHJcblxyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtUmFkaW8pO1xyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtU3Bhbik7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheVJlc0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5kaXNwbGF5UmVzV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXlSZXNUaXRsZSk7XHJcbiAgICB0aGlzLmRpc3BsYXlSZXNXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheVJlc0Zvcm0pO1xyXG5cclxuICAgIGxldCBzcGFucyA9IHRoaXMuZGlzcGxheVJlc1dyYXBwZXIucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcbiAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IFwiMTI4MHg3MjBcIjtcclxuICAgIHNwYW5zWzJdLnRleHRDb250ZW50ID0gXCIxNjAweDkwMFwiO1xyXG4gICAgc3BhbnNbM10udGV4dENvbnRlbnQgPSBcIjE5MjB4MTA4MFwiO1xyXG4gICAgc3BhbnNbNF0udGV4dENvbnRlbnQgPSBcIjI0NjB4MTQwMFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2F2ZSBidXR0b25cclxuICAgICAqL1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2V0dGluZ3NCdXR0b25cIik7XHJcbiAgICB0aGlzLnNhdmVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU2F2ZVwiO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzYXZlQnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgdGhpcy5zZXR0aW5ncyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLnNldHRpbmdzLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc1wiKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzLmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZFdyYXBwZXIpO1xyXG4gICAgdGhpcy5zZXR0aW5ncy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIikpO1xyXG4gICAgdGhpcy5zZXR0aW5ncy5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXlSZXNXcmFwcGVyKTtcclxuICAgIHRoaXMuc2V0dGluZ3MuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpKTtcclxuXHJcbiAgICB0aGlzLndpbmRvd0Rpdi5hcHBlbmRDaGlsZCh0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMud2luZG93RGl2LmFwcGVuZENoaWxkKHRoaXMuc2F2ZUJ1dHRvbik7XHJcblxyXG4gICAgZnVuY3Rpb24gc2F2ZUJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhY2tncm91bmRcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgYmFja2dyb3VuZElucHV0cyA9IHRoaXMuYmFja2dyb3VuZEZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhY2tncm91bmRJbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGJhY2tncm91bmRJbnB1dHNbaV0uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcGkuc2V0UHdkQmFja2dyb3VuZChpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRpc3BsYXlSZXNJbnB1dHMgPSB0aGlzLmRpc3BsYXlSZXNGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwbGF5UmVzSW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5UmVzSW5wdXRzW2ldLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBpLnNldFB3ZERpc3BsYXlSZXNvbHV0aW9uKGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5TZXR0aW5ncy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XHJcblNldHRpbmdzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNldHRpbmdzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcclxuIl19
