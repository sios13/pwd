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

    this.iconImage       = settings.iconImage ? settings.iconImage : "defaultIcon.png";

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
            "windowSize": "small",
            "backgroundColor": "rgb(193,154,107)"
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
            "windowSize": "big",
            "backgroundColor": "rgb(193,154,107)"
        }) );
        this.icons.push( new Icon({
            "iconText": "Chat",
            "applicationName": "Chat",
            "xPos": 10,
            "yPos": 350,
            "iconImage": "chatIcon.png",
            "windowSize": "medium"
        }) );
        this.icons.push( new Icon({
            "iconText": "Settings",
            "applicationName": "Settings",
            "xPos": 10,
            "yPos": 450,
            "iconImage": "settingsIcon.png",
            "windowSize": "medium"
        }) );

        /**
         * Append the icons to the container
         */
        for (let i = 0; i < this.icons.length; i++) {
            this.container.appendChild(this.icons[i].getContainer());
        }

        for (let i = 0; i < 5; i++) {
            //launchApplication(this.icons[1]);
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
         * If a mousedown has been made on a window
         */
        if (target instanceof MyWindow) {
            let pwdWindow = target;

            let index = this.windows.indexOf(pwdWindow);

            /**
             * Select the window, panel and application
             */
            selectWindowPanelApp(index);

            /**
             * Deselect icon
             */
            if (this.icons[0]) {
                this.icons[0].setIsSelected(false);
            }

            /**
             * If target is the window top bar -> set the window as dragTarget and add mousemove listener
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
         * If a mousedown has been made on a panel
         */
        if (target instanceof Panel) {}

        /**
         * If a mouse down has been made on an icon
         */
        if (target instanceof Icon) {
            let icon = target;

            let index = icons.indexOf(icon);

            /**
             * Set the icon as selected
             */
            selectIcon(index);

            /**
             * Deselect the window and associated panel
             */
            if (this.windows[0]) {
                this.windows[0].setIsSelected(false);
            }

            if (this.panels[0]) {
                this.panels[0].setIsSelected(false);
            }

            /**
             * Set the icon as dragTarget and add mousemove listener
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
         * If a mouse up has been made on a window
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
         * If a mouseup has been made on a panel
         */
        if (target instanceof Panel) {
            let panel = target;

            let index = this.panels.indexOf(panel);

            if (index === -1) {
                error("Panel was not found.");

                return;
            }

            /**
             * If panel is selected -> deselect and minimize the associated window
             */
            if (this.panels[index].getIsSelected()) {
                this.panels[index].setIsSelected(false);

                this.windows[index].setIsSelected(false);

                this.windows[index].setMinimized(true);

                return;
            }

            /**
             * If panel is deselected -> select and bring up the associated window
             */
            if (!this.panels[index].getIsSelected()) {
                selectWindowPanelApp(index);

                this.windows[0].setMinimized(false);

                return;
            }
        }

        /**
         * If a mouseup has been made on an icon
         */
        if (target instanceof Icon) {
            let icon = target;

            /**
             * If the icon is being dragged -> stop dragging
             */
            if (this.dragTarget === icon) {
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
            e.preventDefault();

            this.start.classList.toggle("PWD-start--hide");

            return;
        }

        if (target === "clockButton") {
            e.preventDefault();

            this.clock.classList.toggle("PWD-clock--hide");

            return;
        }

        /**
         * If a click has been made on a window
         */
        if (target instanceof MyWindow) {
            let pwdWindow = target;

            /**
             * If a click has been made on the close button -> close the window
             */
            let windowCloseDiv = pwdWindow.getContainer().querySelector(".PWD-window_close");

            if (windowCloseDiv.contains(e.target)) {
                e.preventDefault();

                let index = this.windows.indexOf(pwdWindow);

                closeWindow(index);

                return;
            }

            /**
             * If a click has been made on the resize button -> resize the window
             */
            let windowResizeDiv = pwdWindow.getContainer().querySelector(".PWD-window_resize");

            if (windowResizeDiv.contains(e.target)) {
                e.preventDefault();

                pwdWindow.resize();

                return;
            }

            /**
             * If a click has been made on the minimize button -> minimize the window
             */
            let windowMinimizeDiv = pwdWindow.getContainer().querySelector(".PWD-window_minimize");

            if (windowMinimizeDiv.contains(e.target)) {
                e.preventDefault();

                pwdWindow.setMinimized(true);

                pwdWindow.setIsSelected(false);

                let index = windows.indexOf(pwdWindow);

                this.panels[index].setIsSelected(false);

                return;
            }
        }

        /**
         * If a click has been made on a panel
         */
        if (target instanceof Panel) {
            e.preventDefault();

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

        /**
         * If a click has been made on an icon
         */
        if (target instanceof Icon) {
            e.preventDefault();
        }
    }

    function dblclickEvent(e) {
        let target = findTarget(e.target);

        /**
         * If a dblclick has been made on an icon
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
         * Call the close function implemented by every application
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
         calculatePanelsWidth();
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
    this.socket.addEventListener("open", socketOpenEvent);
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
    inputDiv_textarea.disabled = true;
    inputDiv_textarea.setAttribute("placeholder", "Waiting for connection...");
    inputDiv_textarea.addEventListener("keyup", textareaEvent.bind(this));
    inputDiv.appendChild(inputDiv_textarea);

    // Button in the input div
    let inputDiv_button = document.createElement("button");
    inputDiv_button.addEventListener("click", buttonEvent.bind(this));
    inputDiv_button.classList.add("chatInput_button");
    inputDiv_button.setAttribute("type", "button");
    inputDiv_button.disabled = true;
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
    function socketOpenEvent(e) {
        inputDiv_textarea.disabled = false;
        inputDiv_textarea.setAttribute("placeholder", "Enter message");

        inputDiv_button.disabled = false;
    }

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

        if (value === "" || value === "\n") {
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

    function textareaEvent(e) {
        /**
         * If pressing enter and shift is not pressed -> click button
         */
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();

            inputDiv_button.click();
        }
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
    chatNameInput.setAttribute("placeholder", "Enter name!");
    chatNameInput.classList.add("chatStartNameInput");
    chatWrapperDiv.appendChild(chatNameInput);

    // Chat name button
    let chatNameButton = document.createElement("button");
    chatNameButton.addEventListener("click", buttonEvent.bind(this));
    chatNameButton.classList.add("chatStartNameButton");
    chatNameButton.setAttribute("type", "button");
    chatNameButton.textContent = "Start chatting!";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwbGljYXRpb24uanMiLCJjbGllbnQvc291cmNlL2pzL0VudGl0eS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvTXlBUEkuanMiLCJjbGllbnQvc291cmNlL2pzL015V2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZUJvYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL1NldHRpbmdzL1NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBFdmVyeSBhcHBsaWNhdGlvbiBpbiB0aGUgUFdEIG11c3QgaW1wbGVtZW50IEFwcGxpY2F0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBBcHBsaWNhdGlvbihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLmFwaSA9IHNldHRpbmdzLmFwaSA/IHNldHRpbmdzLmFwaSA6IHVuZGVmaW5lZDtcclxufVxyXG5cclxuQXBwbGljYXRpb24ucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIldBUk5JTkchIEFwcGxpY2F0aW9uIG11c3QgaW1wbGVtZW50IGZ1bmN0aW9uIGNsb3NlLlwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBsaWNhdGlvbjtcclxuIiwiLyoqXHJcbiAqIFdpbmRvdyBhbmQgaWNvbiBpbmhlcml0cyBmcm9tIGVudGl0eVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVudGl0eShzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLndpZHRoID0gc2V0dGluZ3Mud2lkdGggPyBzZXR0aW5ncy53aWR0aCA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnhQb3MgPSBzZXR0aW5ncy54UG9zID8gc2V0dGluZ3MueFBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnlQb3MgPSBzZXR0aW5ncy55UG9zID8gc2V0dGluZ3MueVBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnpJbmRleCA9IHNldHRpbmdzLnpJbmRleCA/IHNldHRpbmdzLnpJbmRleCA6IDA7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBzZXR0aW5ncy5pc0RyYWdnaW5nID8gc2V0dGluZ3MuaXNEcmFnZ2luZyA6IGZhbHNlO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRYUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy54UG9zO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFlQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnlQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUudXBkYXRlUG9zID0gZnVuY3Rpb24oeFBvcywgeVBvcykge1xyXG4gICAgdGhpcy54UG9zID0geFBvcztcclxuICAgIHRoaXMueVBvcyA9IHlQb3M7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnNldElzRHJhZ2dpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2luZ1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdnaW5nXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldElzRHJhZ2dpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRHJhZ2dpbmc7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcInpJbmRleFwiOiBzZXR0aW5ncy56SW5kZXgsXHJcbiAgICAgICAgXCJpc1NlbGVjdGVkXCI6IHNldHRpbmdzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgXCJpc0RyYWdnaW5nXCI6IHNldHRpbmdzLmlzRHJhZ2dpbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaWNvblRleHQgICAgICAgID0gc2V0dGluZ3MuaWNvblRleHQgPyBzZXR0aW5ncy5pY29uVGV4dCA6IFwiTm8gaWNvbiB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy53aWR0aCAgICAgICAgICAgPSBzZXR0aW5ncy53aWR0aCA/IHNldHRpbmdzLndpZHRoIDogMTA7XHJcblxyXG4gICAgdGhpcy5oZWlnaHQgICAgICAgICAgPSBzZXR0aW5ncy5oZWlnaHQgPyBzZXR0aW5ncy5oZWlnaHQgOiAxMDtcclxuXHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA/IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5pY29uSW1hZ2UgICAgICAgPSBzZXR0aW5ncy5pY29uSW1hZ2UgPyBzZXR0aW5ncy5pY29uSW1hZ2UgOiBcImRlZmF1bHRJY29uLnBuZ1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSAgICAgID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcInNtYWxsXCI7XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBcIlwiO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyICAgICAgID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWljb25cIik7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICAgICAgbGV0IGljb25JbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGljb25JbWFnZUVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uSW1hZ2U7XHJcblxyXG4gICAgICAgIGxldCBpY29uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGljb25UZXh0LnRleHRDb250ZW50ID0gdGhpcy5pY29uVGV4dDtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25JbWFnZUVsZW0pO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uVGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJY29uIGluaGVyaXRzIGZyb20gRW50aXR5XHJcbiAqL1xyXG5JY29uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRW50aXR5LnByb3RvdHlwZSk7XHJcbkljb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSWNvbjtcclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG4vKipcclxuICogSWNvbnMgYXJlIHN1cHBvc2VkIHRvIGJlIGFsaWduZWQgaW4gYSBncmlkIHN5c3RlbS5cclxuICogVGhpcyBmdW5jdGlvbiBjb3JyZWN0cyB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBvZiB0aGUgaWNvbiwgbWFraW5nIGl0IGFsaWduIHRvIHRoZSBuZWFyZXN0IGdyaWRcclxuICovXHJcbkljb24ucHJvdG90eXBlLmNvcnJlY3RHcmlkUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMueFBvcyA9IHRoaXMueFBvcyAtIHRoaXMueFBvcyAlIDEwMDtcclxuICAgIHRoaXMueVBvcyA9IDUgKyB0aGlzLnlQb3MgLSB0aGlzLnlQb3MgJSAxMDA7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0QmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEljb25UZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uVGV4dDtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvbkltYWdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uSW1hZ2U7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLndpbmRvd1NpemU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcclxuIiwiLyoqXHJcbiAqIFRoZSBBUEkgaXMgYSB3YXkgZm9yIGFwcGxpY2F0aW9ucyB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBQV0RcclxuICovXHJcbmZ1bmN0aW9uIE15QVBJKHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMucHdkQ29udGFpbmVyID0gc2V0dGluZ3MucHdkQ29udGFpbmVyID8gc2V0dGluZ3MucHdkQ29udGFpbmVyIDogdW5kZWZpbmVkO1xyXG59XHJcblxyXG5NeUFQSS5wcm90b3R5cGUuc2V0UHdkQmFja2dyb3VuZCA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICBsZXQgcHJlZml4ID0gXCJtYWluLS1iYWNrZ3JvdW5kLVwiO1xyXG5cclxuICAgIE15QVBJLnByb3RvdHlwZS5yZW1vdmVDbGFzc2VzV2l0aFByZWZpeChwcmVmaXgsIHRoaXMucHdkQ29udGFpbmVyKTtcclxuXHJcbiAgICB0aGlzLnB3ZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHByZWZpeCArIGluZGV4KTtcclxufVxyXG5cclxuTXlBUEkucHJvdG90eXBlLnNldFB3ZERpc3BsYXlSZXNvbHV0aW9uID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIGxldCBwcmVmaXggPSBcIm1haW4tLWRpc3BsYXlSZXMtXCI7XHJcblxyXG4gICAgTXlBUEkucHJvdG90eXBlLnJlbW92ZUNsYXNzZXNXaXRoUHJlZml4KHByZWZpeCwgdGhpcy5wd2RDb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMucHdkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQocHJlZml4ICsgaW5kZXgpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGNsYXNzZXMgd2l0aCBwcmVmaXhcclxuICovXHJcbk15QVBJLnByb3RvdHlwZS5yZW1vdmVDbGFzc2VzV2l0aFByZWZpeCA9IGZ1bmN0aW9uKHByZWZpeCwgZWxlbSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtLmNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChlbGVtLmNsYXNzTGlzdFtpXS5pbmRleE9mKHByZWZpeCkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShlbGVtLmNsYXNzTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeUFQSTtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZShcIi4vRW50aXR5LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTXlXaW5kb3coc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcInpJbmRleFwiOiBzZXR0aW5ncy56SW5kZXgsXHJcbiAgICAgICAgXCJpc1NlbGVjdGVkXCI6IHNldHRpbmdzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgXCJpc0RyYWdnaW5nXCI6IHNldHRpbmdzLmlzRHJhZ2dpbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZCA/IHNldHRpbmdzLmlkIDogMDtcclxuXHJcbiAgICAvL3RoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogXCIjXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMudG9wQmFyVGV4dCA9IHNldHRpbmdzLnRvcEJhclRleHQgPyBzZXR0aW5ncy50b3BCYXJUZXh0IDogXCJObyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy50b3BCYXJJY29uID0gc2V0dGluZ3MudG9wQmFySWNvbiA/IHNldHRpbmdzLnRvcEJhckljb24gOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJtZWRpdW1cIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd1RvcEJhci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhckljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgd2luZG93VG9wQmFySWNvbi5zcmMgPSBcIi4vaW1hZ2UvXCIgKyB0aGlzLnRvcEJhckljb247XHJcbiAgICB3aW5kb3dUb3BCYXJJY29uLmFsdCA9IFwiVG9wIGJhciBpY29uXCI7XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhclNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHdpbmRvd1RvcEJhclNwYW4udGV4dENvbnRlbnQgPSB0aGlzLnRvcEJhclRleHQ7XHJcblxyXG4gICAgbGV0IHdpbmRvd01pbmltaXplRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHdpbmRvd01pbmltaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19taW5pbWl6ZVwiKTtcclxuICAgIHdpbmRvd01pbmltaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLW1pbnVzLXJvdW5kXCIpO1xyXG5cclxuICAgIHRoaXMud2luZG93UmVzaXplRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19yZXNpemVcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd0Nsb3NlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHdpbmRvd0Nsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19jbG9zZVwiKTtcclxuICAgIHdpbmRvd0Nsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWNsb3NlLXJvdW5kXCIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY29udGVudFwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLmlkKTtcclxuICAgIGlmICh0aGlzLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgIHdpbmRvd0NvbnRlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJfd3JhcHBlclwiKTtcclxuXHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFySWNvbik7XHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyU3Bhbik7XHJcblxyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dNaW5pbWl6ZUVsZW0pO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLndpbmRvd1Jlc2l6ZUVsZW0pO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dDbG9zZUVsZW0pO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcldyYXBwZXIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93Q29udGVudCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgYWxsIGNsYXNzZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImlvbi1hcnJvdy1leHBhbmRcIik7XHJcbiAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJpb24tYXJyb3ctc2hyaW5rXCIpO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwic21hbGxcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAyMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDMwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA0NTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1hcnJvdy1leHBhbmRcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDQwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gNjAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tYXJyb3ctc2hyaW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tXCIgKyB0aGlzLndpbmRvd1NpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0UG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgdGVzdCA9IHRoaXMuaWQgPCAxMCA/IFwiMFwiIDogXCJcIjtcclxuICAgICAgICB0ZXN0ICs9IHRoaXMuaWQ7XHJcblxyXG4gICAgICAgIHRoaXMueFBvcyA9ICgxMDArMjAwKnRlc3RbMF0gKyAxNSAqIHRoaXMuaWQpO1xyXG4gICAgICAgIHRoaXMueVBvcyA9ICgyMCArIDMwICogKHRoaXMuaWQgLSB0ZXN0WzBdKjEwKSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29ycmVjdFBvc2l0aW9uKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXaW5kb3cgaW5oZXJpdHMgZnJvbSBFbnRpdHlcclxuICovXHJcbk15V2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRW50aXR5LnByb3RvdHlwZSk7XHJcbk15V2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE15V2luZG93O1xyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLmdldE1pbmltaXplZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubWluaW1pemVkO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuc2V0TWluaW1pemVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMubWluaW1pemVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMubWluaW1pemVkKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1taW5pbWl6ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1pbmltaXplXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1tYXhpbWl6ZVwiKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1cIiArIHRoaXMud2luZG93U2l6ZSk7XHJcblxyXG4gICAgc3dpdGNoKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcIm1lZGl1bVwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwiYmlnXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJiaWdcIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJzbWFsbFwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXBwbGljYXRpb25PYmouY2xvc2UoKTtcclxufVxyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeVdpbmRvdztcclxuIiwiY29uc3QgTXlXaW5kb3cgPSByZXF1aXJlKFwiLi9NeVdpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IFBhbmVsID0gcmVxdWlyZShcIi4vUGFuZWwuanNcIik7XHJcbmNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4vQXBwbGljYXRpb24uanNcIik7XHJcbmNvbnN0IE15QVBJID0gcmVxdWlyZShcIi4vTXlBUEkuanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcbmNvbnN0IENoYXQgPSByZXF1aXJlKFwiLi9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzXCIpO1xyXG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2FwcHMvU2V0dGluZ3MvU2V0dGluZ3MuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG5cclxuICAgIGluaXRpYWxpemUoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgZGVmYXVsdCBiZWhhdmlvdXIvcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFwaSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd0NvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbGVtZW50c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1haW5cIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1haW4tLWJhY2tncm91bmQtM1wiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwibWFpbi0tZGlzcGxheVJlcy0wXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5ocmVmID0gXCIjXCI7XHJcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9zdGFydEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0XCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnQuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydC0taGlkZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfdGl0bGUuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydF9fdGl0bGVcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydF90aXRsZS50ZXh0Q29udGVudCA9IFwiSGVqIVwiO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydF9fbWVzc2FnZVwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UudGV4dENvbnRlbnQgPSBcIk1hZGUgYnkgU2ltb24gw5ZzdGVyZGFobFwiO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0LmFwcGVuZENoaWxkKHRoaXMuc3RhcnRfdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuc3RhcnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydF9tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9ja0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2tCdXR0b24uaHJlZiA9IFwiI1wiO1xyXG4gICAgICAgIHRoaXMuY2xvY2tCdXR0b24uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfY2xvY2tCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNsb2NrQnV0dG9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrQnV0dG9uLnRleHRDb250ZW50ID0gZC5nZXRIb3VycygpICsgXCI6XCIgKyAoZC5nZXRNaW51dGVzKCkgPCAxMCA/IFwiMFwiICsgZC5nZXRNaW51dGVzKCkgOiBkLmdldE1pbnV0ZXMoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVDbG9ja0J1dHRvbigpO1xyXG5cclxuICAgICAgICBzZXRJbnRlcnZhbCh1cGRhdGVDbG9ja0J1dHRvbiwgMzAwMDApO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2tcIik7XHJcbiAgICAgICAgdGhpcy5jbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrLS1oaWRlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgdGhpcy5jbG9ja19iaWdDbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrX19iaWdUaW1lXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrX2RhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrX2RhdGUuY2xhc3NMaXN0LmFkZChcIlBXRC1jbG9ja19fZGF0ZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9jay5hcHBlbmRDaGlsZCh0aGlzLmNsb2NrX2JpZ0Nsb2NrKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tfZGF0ZSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNsb2NrKCkge1xyXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrLnRleHRDb250ZW50ID0gZC5nZXRIb3VycygpICsgXCI6XCIgKyAoZC5nZXRNaW51dGVzKCkgPCAxMCA/IFwiMFwiICsgZC5nZXRNaW51dGVzKCkgOiBkLmdldE1pbnV0ZXMoKSkgKyBcIjpcIiArIChkLmdldFNlY29uZHMoKSA8IDEwID8gXCIwXCIgKyBkLmdldFNlY29uZHMoKSA6IGQuZ2V0U2Vjb25kcygpKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtb250aE5hbWVzID0gW1wiSmFudWFyaVwiLCBcIkZlYnJ1YXJpXCIsIFwiTWFyc1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RpXCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrX2RhdGUudGV4dENvbnRlbnQgPSBcImRlbiBcIiArIGQuZ2V0RGF0ZSgpICsgXCIgXCIgKyBtb250aE5hbWVzW2QuZ2V0TW9udGgoKV0gKyBcIiBcIiArIGQuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldEludGVydmFsKHVwZGF0ZUNsb2NrLCAxMDAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLnBhbmVsc1dyYXBwZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxzV3JhcHBlclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0QnV0dG9uKTtcclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5hcHBlbmRDaGlsZCh0aGlzLnBhbmVsc1dyYXBwZXIpO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tCdXR0b24pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0KTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNsb2NrKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJvdHRvbUJhcik7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZSB0aGUgZGVza3RvcCBpY29uc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiTWVtb3J5IHNtYWxsXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcIm1lbW9yeUljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcInNtYWxsXCIsXHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZENvbG9yXCI6IFwicmdiKDE5MywxNTQsMTA3KVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBtZWRpdW1cIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTIwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcIm1lbW9yeUljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiLFxyXG4gICAgICAgICAgICBcImJhY2tncm91bmRDb2xvclwiOiBcInJnYigxOTMsMTU0LDEwNylcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgYmlnXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDI1MCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJtZW1vcnlJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJiaWdcIixcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMTkzLDE1NCwxMDcpXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiQ2hhdFwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIkNoYXRcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMzUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcImNoYXRJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJTZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIlNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDQ1MCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJzZXR0aW5nc0ljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICAgICAgfSkgKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXBwZW5kIHRoZSBpY29ucyB0byB0aGUgY29udGFpbmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICAgICAgLy9sYXVuY2hBcHBsaWNhdGlvbih0aGlzLmljb25zWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbGF1bmNoQXBwbGljYXRpb24odGhpcy5pY29uc1szXSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZCBsaXN0ZW5lcnNcclxuICAgICAgICAgKi9cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd25FdmVudCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZXVwRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRibGNsaWNrXCIsIGRibGNsaWNrRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXZlbnQgZnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1vdXNlZG93bkV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGb3IgZXZlcnkgbW91c2Vkb3duIGV2ZW50IHdlIHdpbGwgYXR0ZW1wdCB0byBmaW5kIGEgbmV3IHRhcmdldFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBvbiBhIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBNeVdpbmRvdykge1xyXG4gICAgICAgICAgICBsZXQgcHdkV2luZG93ID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy53aW5kb3dzLmluZGV4T2YocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZWxlY3QgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzZWxlY3RXaW5kb3dQYW5lbEFwcChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRGVzZWxlY3QgaWNvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbnNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiB0YXJnZXQgaXMgdGhlIHdpbmRvdyB0b3AgYmFyIC0+IHNldCB0aGUgd2luZG93IGFzIGRyYWdUYXJnZXQgYW5kIGFkZCBtb3VzZW1vdmUgbGlzdGVuZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dUb3BCYXJFbGVtID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93VG9wQmFyRWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IHB3ZFdpbmRvdztcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIG9uIGEgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHt9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2UgZG93biBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBsZXQgaWNvbiA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGljb25zLmluZGV4T2YoaWNvbik7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU2V0IHRoZSBpY29uIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzZWxlY3RJY29uKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZXNlbGVjdCB0aGUgd2luZG93IGFuZCBhc3NvY2lhdGVkIHBhbmVsXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy53aW5kb3dzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZXQgdGhlIGljb24gYXMgZHJhZ1RhcmdldCBhbmQgYWRkIG1vdXNlbW92ZSBsaXN0ZW5lclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gaWNvbjtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbW91c2V1cEV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZmluZFRhcmdldChlLnRhcmdldCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhpZGUgY2xvY2sgaWYgbW91c2V1cCBoYXMgYmVlbiBtYWRlIG91dHNpZGUgY2xvY2sgYW5kIGNsb2NrQnV0dG9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCAhPT0gXCJjbG9ja1wiICYmIHRhcmdldCAhPT0gXCJjbG9ja0J1dHRvblwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jbG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJQV0QtY2xvY2stLWhpZGVcIikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2suY2xhc3NMaXN0LmFkZChcIlBXRC1jbG9jay0taGlkZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSGlkZSBzdGFydCBpZiBtb3VzZXVwIGhhcyBiZWVuIG1hZGUgb3V0c2lkZSBzdGFydCBhbmQgc3RhcnRCdXR0b25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0ICE9PSBcInN0YXJ0XCIgJiYgdGFyZ2V0ICE9PSBcInN0YXJ0QnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0LmNsYXNzTGlzdC5jb250YWlucyhcIlBXRC1zdGFydC0taGlkZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0LS1oaWRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIG1vdXNlIHVwIGhhcyBiZWVuIG1hZGUgb24gYSB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgTXlXaW5kb3cpIHtcclxuICAgICAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIHdpbmRvdyBpcyBiZWluZyBkcmFnZ2VkIC0+IHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQgaW5zdGFuY2VvZiBNeVdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIHB3ZFdpbmRvdy5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2V1cCBoYXMgYmVlbiBtYWRlIG9uIGEgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgbGV0IHBhbmVsID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wYW5lbHMuaW5kZXhPZihwYW5lbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcihcIlBhbmVsIHdhcyBub3QgZm91bmQuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHBhbmVsIGlzIHNlbGVjdGVkIC0+IGRlc2VsZWN0IGFuZCBtaW5pbWl6ZSB0aGUgYXNzb2NpYXRlZCB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1tpbmRleF0uZ2V0SXNTZWxlY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbaW5kZXhdLnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBwYW5lbCBpcyBkZXNlbGVjdGVkIC0+IHNlbGVjdCBhbmQgYnJpbmcgdXAgdGhlIGFzc29jaWF0ZWQgd2luZG93XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGFuZWxzW2luZGV4XS5nZXRJc1NlbGVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdFdpbmRvd1BhbmVsQXBwKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0TWluaW1pemVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2V1cCBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBsZXQgaWNvbiA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiB0aGUgaWNvbiBpcyBiZWluZyBkcmFnZ2VkIC0+IHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQgPT09IGljb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpY29uLnNldElzRHJhZ2dpbmcoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpY29uLmNvcnJlY3RHcmlkUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgaXMgYmVpbmcgZHJhZ2dlZCAtPiBzdG9wIGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdUYXJnZXQuc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1RhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdUYXJnZXQuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZXNlbGVjdCB3aW5kb3csIHBhbmVsIGFuZCBpY29uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy53aW5kb3dzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmljb25zWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmljb25zWzBdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gXCJzdGFydEJ1dHRvblwiKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQuY2xhc3NMaXN0LnRvZ2dsZShcIlBXRC1zdGFydC0taGlkZVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IFwiY2xvY2tCdXR0b25cIikge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC50b2dnbGUoXCJQV0QtY2xvY2stLWhpZGVcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gYSB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgTXlXaW5kb3cpIHtcclxuICAgICAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gdGhlIGNsb3NlIGJ1dHRvbiAtPiBjbG9zZSB0aGUgd2luZG93XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X2Nsb3NlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvd0Nsb3NlRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMud2luZG93cy5pbmRleE9mKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xvc2VXaW5kb3coaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgcmVzaXplIGJ1dHRvbiAtPiByZXNpemUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd1Jlc2l6ZURpdiA9IHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfcmVzaXplXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvd1Jlc2l6ZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cucmVzaXplKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBtaW5pbWl6ZSBidXR0b24gLT4gbWluaW1pemUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd01pbmltaXplRGl2ID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19taW5pbWl6ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dNaW5pbWl6ZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cuc2V0TWluaW1pemVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHB3ZFdpbmRvdy5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB3aW5kb3dzLmluZGV4T2YocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gYSBwYW5lbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYW5lbCkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFuZWwgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBwYW5lbHMuaW5kZXhPZihwYW5lbCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBjbG9zZSBidXR0b25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChwYW5lbC5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC1ib3R0b21CYXJfcGFuZWxfX2Nsb3NlXCIpLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VXaW5kb3coaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRibGNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBkYmxjbGljayBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBsZXQgaWNvbiA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBMYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgaWNvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24oaWNvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1vdXNlbW92ZUV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0aGVyZSBpcyBhIGRyYWcgdGFyZ2V0IC0+IHVwZGF0ZSBpdHMgcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGxldCBkcmFnVGFyZ2V0ID0gdGhpcy5kcmFnVGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IHB3ZFdpZHRoID0gdGhpcy5jb250YWluZXIub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgIGxldCBwd2RIZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3Vyc29yWCA9IGUucGFnZVg7XHJcbiAgICAgICAgICAgIGxldCBjdXJzb3JZID0gZS5wYWdlWTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFggPSBlLm1vdmVtZW50WDtcclxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WSA9IGUubW92ZW1lbnRZO1xyXG5cclxuICAgICAgICAgICAgZHJhZ1RhcmdldC5zZXRJc0RyYWdnaW5nKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIG1vdXNlIHBvaW50ZXIgaXMgb3V0c2lkZSB3aW5kb3cgLT4gZG8gbm90IHVwZGF0ZSB0aGUgcG9zaXRpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChjdXJzb3JZICsgMTAgPCAwIHx8IGN1cnNvclkgPiBwd2RIZWlnaHQgLSA0MCAtIDEwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3Vyc29yWCArIDEwIDwgMCB8fCBjdXJzb3JYID4gcHdkV2lkdGggLSAxMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRYID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZHJhZ1RhcmdldC51cGRhdGVQb3MoZHJhZ1RhcmdldC5nZXRYUG9zKCkgKyBtb3ZlbWVudFgsIGRyYWdUYXJnZXQuZ2V0WVBvcygpICsgbW92ZW1lbnRZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IhIFwiICsgbWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCcmluZ3MgdGhlIGljb24gd2l0aCB0aGUgZ2l2ZW4gaW5kZXggdG8gdGhlIGZyb250IG9mIHRoZSBpY29ucyBhcnJheVxyXG4gICAgICogQmVpbmcgaW4gZnJvbnQgb2YgdGhlIGFycmF5IG1lYW5zIFwic2VsZWN0ZWRcIlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RJY29uKGluZGV4KSB7XHJcbiAgICAgICAgbGV0IGljb25UZW1wID0gdGhpcy5pY29uc1tpbmRleF07XHJcblxyXG4gICAgICAgIHRoaXMuaWNvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucy51bnNoaWZ0KGljb25UZW1wKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVzZWxlY3QgdGhlIGxhc3QgYWN0aXZlIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5pY29uc1sxXSkge1xyXG4gICAgICAgICAgICB0aGlzLmljb25zWzFdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pY29uc1swXS5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnJpbmdzIHRoZSB3aW5kb3csIHBhbmVsIGFuZCBhcHBsaWNhdGlvbiB3aXRoIHRoZSBnaXZlbiBpbmRleCB0byB0aGUgZnJvbnQgb2YgdGhlaXIgcmVzcGVjdGl2ZSBhcnJheXNcclxuICAgICAqIEJlaW5nIGluIGZyb250IG9mIHRoZSBhcnJheSBtZWFucyBcInNlbGVjdGVkXCJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2VsZWN0V2luZG93UGFuZWxBcHAoaW5kZXgpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBsaWNhdGlvblRlbXAgPSB0aGlzLmFwcGxpY2F0aW9uc1tpbmRleF07XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnVuc2hpZnQoYXBwbGljYXRpb25UZW1wKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHdpbmRvd1RlbXAgPSB0aGlzLndpbmRvd3NbaW5kZXhdO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnVuc2hpZnQod2luZG93VGVtcCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLndpbmRvd3NbMV0pIHtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dzWzFdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhbmVsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHBhbmVsVGVtcCA9IHRoaXMucGFuZWxzW2luZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMudW5zaGlmdChwYW5lbFRlbXApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYW5lbHNbMV0pIHtcclxuICAgICAgICAgICAgdGhpcy5wYW5lbHNbMV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1swXS5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHaXZlIHdpbmRvd3Mgei1pbmRleFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcHBsaWNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dzW2ldLmdldENvbnRhaW5lcigpLnN0eWxlLnpJbmRleCA9IHRoaXMuaWNvbnMubGVuZ3RoICsgdGhpcy5hcHBsaWNhdGlvbnMubGVuZ3RoIC0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1ha2Ugc3VyZSBzdGFydCwgY2xvY2sgYW5kIGJvdHRvbSBiYXIgYWx3YXlzIGlzIG9uIHRvcFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCB0b3BaSW5kZXggPSB0aGlzLmFwcGxpY2F0aW9ucy5sZW5ndGggKyB0aGlzLmljb25zLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydC5zdHlsZS56SW5kZXggPSB0b3BaSW5kZXggKyAxO1xyXG4gICAgICAgIHRoaXMuY2xvY2suc3R5bGUuekluZGV4ID0gdG9wWkluZGV4ICsgMTtcclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5zdHlsZS56SW5kZXggPSB0b3BaSW5kZXggKyAyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xvc2UgYSB3aW5kb3cgd2l0aCBhIGdpdmVuIGluZGV4XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNsb3NlV2luZG93KGluZGV4KSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FsbCB0aGUgY2xvc2UgZnVuY3Rpb24gaW1wbGVtZW50ZWQgYnkgZXZlcnkgYXBwbGljYXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uc1tpbmRleF0uY2xvc2UoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlIHRoZSB3aW5kb3cgYW5kIHBhbmVsIGZyb20gdGhlIERPTVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93c1tpbmRleF0uZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLndpbmRvd3NbaW5kZXhdLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNbaW5kZXhdLmdldENvbnRhaW5lcigpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5wYW5lbHNbaW5kZXhdLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlIHRoZSB3aW5kb3csIHBhbmVsIGFuZCBhcHBsaWNhdGlvbiBmcm9tIHRoZWlyIHJlc3BlY3RpdmUgYXJyYXlzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgdGhpcy5wYW5lbHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGVuIGEgcGFuZWwgaXMgcmVtb3ZlZCwgbWFrZSBzdXJlIHRoZSBvdGhlciBwYW5lbHMnIHdpZHRoIGlzIGNvcnJlY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICAgY2FsY3VsYXRlUGFuZWxzV2lkdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGEgZ2l2ZW4gdGFyZ2V0IGV4aXN0cyBpbiBhIHdpbmRvdywgcGFuZWwgb3IgaWNvblxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmaW5kVGFyZ2V0KHRhcmdldCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0QnV0dG9uLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwic3RhcnRCdXR0b25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0LmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwic3RhcnRcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb2NrQnV0dG9uLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2xvY2tCdXR0b25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb2NrLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2xvY2tcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIHdpbmRvd3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbiBhIHdpbmRvdyAtPiBtYXJrIHRoZSB3aW5kb3cgYW5kIHRoZSBwYW5lbCBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMud2luZG93c1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53aW5kb3dzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSBwYW5lbHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIGluIGEgcGFuZWwgLT4gbWFyayB0aGUgcGFuZWwgYW5kIHRoZSB3aW5kb3cgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYW5lbHNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIGljb25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb24gLT4gbWFyayB0aGUgaWNvbiBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWNvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZXJlIGlzIG5vIHRhcmdldCAtPiByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHdpZHRoIG9mIHRoZSBwYW5lbHMsIG1ha2luZyBzdXJlIGFsbCBwYW5lbHMgZml0IGluIHRoZSBib3R0b20gYmFyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVBhbmVsc1dpZHRoKCkge1xyXG4gICAgICAgIGxldCBwYW5lbFdpZHRoID0gMTg4ICogdGhpcy5wYW5lbHMubGVuZ3RoICsgMTAwO1xyXG5cclxuICAgICAgICBsZXQgcHdkV2lkdGggPSB0aGlzLmNvbnRhaW5lci5vZmZzZXRXaWR0aDtcclxuXHJcbiAgICAgICAgaWYgKHBhbmVsV2lkdGggPiBwd2RXaWR0aCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFuZWxFbGVtID0gdGhpcy5wYW5lbHNbaV0uZ2V0Q29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFuZWxFbGVtLnN0eWxlLndpZHRoID0gdGhpcy5wYW5lbHNXcmFwcGVyLm9mZnNldFdpZHRoIC8gdGhpcy5wYW5lbHMubGVuZ3RoIC0gOCArIFwicHhcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExhdW5jaCBhbiBhcHBsaWNhdGlvbiwgd2luZG93IGFuZCBwYW5lbCB1c2luZyB0aGUgbWV0YSBkYXRhIGluIGEgZ2l2ZW4gaWNvbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbGF1bmNoQXBwbGljYXRpb24oaWNvbk9iaikge1xyXG4gICAgICAgIGxldCBpZCA9IHRoaXMud2luZG93cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZSBhIG5ldyB3aW5kb3cgdG8gbGF1bmNoIHRoZSBhcHBsaWNhdGlvbiBpblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwd2RXaW5kb3cgPSBuZXcgTXlXaW5kb3coe1xyXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMud2luZG93Q291bnRlcixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IGljb25PYmouZ2V0V2luZG93U2l6ZSgpLFxyXG4gICAgICAgICAgICBcInRvcEJhclRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcInRvcEJhckljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKSxcclxuICAgICAgICAgICAgXCJ6SW5kZXhcIjogdGhpcy5pY29ucy5sZW5ndGgsXHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZENvbG9yXCIgOiBpY29uT2JqLmdldEJhY2tncm91bmRDb2xvcigpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93cy5wdXNoKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBldmVyeSB3aW5kb3cgdGhlcmUgaXMgYWxzbyBhIHBhbmVsIGluIHRoZSBib3R0b20gYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFBhbmVsID0gbmV3IFBhbmVsKHtcclxuICAgICAgICAgICAgXCJ0ZXh0XCI6IGljb25PYmouZ2V0SWNvblRleHQoKSxcclxuICAgICAgICAgICAgXCJpY29uXCI6IGljb25PYmouZ2V0SWNvbkltYWdlKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMucHVzaChwd2RQYW5lbCk7XHJcblxyXG4gICAgICAgIHRoaXMucGFuZWxzV3JhcHBlci5hcHBlbmRDaGlsZChwd2RQYW5lbC5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gYSBuZXcgcGFuZWwgaXMgbWFkZSwgbWFrZSBzdXJlIHdpZHRoIGlzIGNvcnJlY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBjYWxjdWxhdGVQYW5lbHNXaWR0aCgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgYXBwbGljYXRpb25OYW1lID0gaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKTtcclxuXHJcbiAgICAgICAgbGV0IGFwcGxpY2F0aW9uT2JqID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAoYXBwbGljYXRpb25OYW1lID09PSBcIk1lbW9yeVwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IE1lbW9yeSh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLndpbmRvd0NvdW50ZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcHBsaWNhdGlvbk5hbWUgPT09IFwiQ2hhdFwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IENoYXQoe1xyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJcIjogXCIjUFdELXdpbmRvd19jb250ZW50LVwiICsgdGhpcy53aW5kb3dDb3VudGVyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXBwbGljYXRpb25OYW1lID09PSBcIlNldHRpbmdzXCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgU2V0dGluZ3Moe1xyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJcIjogXCIjUFdELXdpbmRvd19jb250ZW50LVwiICsgdGhpcy53aW5kb3dDb3VudGVyLFxyXG4gICAgICAgICAgICAgICAgXCJhcGlcIjogZ2V0QXBpKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWFwcGxpY2F0aW9uT2JqIGluc3RhbmNlb2YgQXBwbGljYXRpb24pIHtcclxuICAgICAgICAgICAgZXJyb3IoXCJUaGUgYXBwbGljYXRpb24gaXMgbm90IGFuIGluc3RhbmNlIG9mIEFwcGxpY2F0aW9uLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnB1c2goYXBwbGljYXRpb25PYmopO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGVuIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIGhhcyBub3cgYmVlbiBtYWRlIC0+IG1ha2UgdGhlbSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNlbGVjdFdpbmRvd1BhbmVsQXBwKHRoaXMuYXBwbGljYXRpb25zLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd0NvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBcGkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBpIGluc3RhbmNlb2YgTXlBUEkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hcGkgPSBuZXcgTXlBUEkoe1xyXG4gICAgICAgICAgICBcInB3ZENvbnRhaW5lclwiOiB0aGlzLmNvbnRhaW5lclxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5hcGk7XHJcbiAgICB9XHJcbn1cclxuXHJcblBXRC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUFdEO1xyXG4iLCJmdW5jdGlvbiBQYW5lbChzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgdGhpcy50ZXh0ID0gc2V0dGluZ3MudGV4dCA/IHNldHRpbmdzLnRleHQgOiBcIm5vIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLmljb24gPSBzZXR0aW5ncy5pY29uID8gc2V0dGluZ3MuaWNvbiA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSBzZXR0aW5ncy5pc1NlbGVjdGVkID8gc2V0dGluZ3MuaXNTZWxlY3RlZCA6IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmhyZWYgPSBcIiNcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsXCIpO1xyXG5cclxuICAgIGxldCBpY29uRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICBpY29uRWxlbS5zcmMgPSBcIi4vaW1hZ2UvXCIgKyB0aGlzLmljb247XHJcbiAgICBpY29uRWxlbS5hbHQgPSBcIkljb25cIjtcclxuICAgIGljb25FbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsX19pY29uXCIpO1xyXG5cclxuICAgIGxldCBzcGFuRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgc3BhbkVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxfX3NwYW5cIik7XHJcbiAgICBzcGFuRWxlbS50ZXh0Q29udGVudCA9IHRoaXMudGV4dDtcclxuXHJcbiAgICBsZXQgY2xvc2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICBjbG9zZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgY2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsX19jbG9zZVwiKTtcclxuICAgIGNsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWNsb3NlLXJvdW5kXCIpO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25FbGVtKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNwYW5FbGVtKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGNsb3NlRWxlbSk7XHJcbn1cclxuXHJcblBhbmVsLnByb3RvdHlwZS5nZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkO1xyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuc2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcblBhbmVsLnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbDtcclxuIiwiY29uc3QgUFdEID0gcmVxdWlyZShcIi4vUFdELmpzXCIpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHB3ZCA9IG5ldyBQV0Qoe1wiY29udGFpbmVyXCI6IFwiYm9keVwifSk7XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBDaGF0KHNldHRpbmdzKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwibm8gY29udGFpbmVyXCI7XHJcblxyXG4gICAgdGhpcy51c2VybmFtZSA9IHNldHRpbmdzLnVzZXJuYW1lID8gc2V0dGluZ3MudXNlcm5hbWUgOiBcInNpbW9uXCI7XHJcblxyXG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIik7XHJcbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBzb2NrZXRPcGVuRXZlbnQpO1xyXG4gICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgc29ja2V0TWVzc2FnZUV2ZW50KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIE5hbWUgY2hhbmdlIGRpdlxyXG4gICAgbGV0IG5hbWVDaGFuZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbmFtZUNoYW5nZURpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdE5hbWVDaGFuZ2VcIik7XHJcblxyXG4gICAgbGV0IG5hbWVDaGFuZ2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBuYW1lQ2hhbmdlU3Bhbi50ZXh0Q29udGVudCA9IFwiVXNlcm5hbWU6IFwiICsgdGhpcy51c2VybmFtZTtcclxuXHJcbiAgICBsZXQgbmFtZUNoYW5nZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBuYW1lQ2hhbmdlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBuYW1lQ2hhbmdlRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBuYW1lQ2hhbmdlQnV0dG9uLnRleHRDb250ZW50ID0gXCJDaGFuZ2UgbmFtZVwiO1xyXG5cclxuICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZVNwYW4pO1xyXG4gICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlQnV0dG9uKTtcclxuXHJcbiAgICBsZXQgbmFtZUNoYW5nZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG5cclxuICAgIC8vIE1lc3NhZ2VzIGRpdlxyXG4gICAgbGV0IG1lc3NhZ2VzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG1lc3NhZ2VzRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0TWVzc2FnZXNcIik7XHJcblxyXG4gICAgLy8gSW5wdXQgZm9ybVxyXG4gICAgbGV0IGlucHV0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZyb21cIik7XHJcbiAgICBpbnB1dERpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0XCIpO1xyXG5cclxuICAgIC8vIFRleHRhcmVhIGluIHRoZSBpbnB1dCBkaXZcclxuICAgIGxldCBpbnB1dERpdl90ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcclxuICAgIGlucHV0RGl2X3RleHRhcmVhLmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRfdGV4dGFyZWFcIik7XHJcbiAgICBpbnB1dERpdl90ZXh0YXJlYS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBpbnB1dERpdl90ZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBcIldhaXRpbmcgZm9yIGNvbm5lY3Rpb24uLi5cIik7XHJcbiAgICBpbnB1dERpdl90ZXh0YXJlYS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGV4dGFyZWFFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGlucHV0RGl2LmFwcGVuZENoaWxkKGlucHV0RGl2X3RleHRhcmVhKTtcclxuXHJcbiAgICAvLyBCdXR0b24gaW4gdGhlIGlucHV0IGRpdlxyXG4gICAgbGV0IGlucHV0RGl2X2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBpbnB1dERpdl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJ1dHRvbkV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRfYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XHJcbiAgICBpbnB1dERpdl9idXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLnRleHRDb250ZW50ID0gXCJTZW5kXCI7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl9idXR0b24pO1xyXG5cclxuICAgIC8vIENoYXQgd3JhcHBlclxyXG4gICAgbGV0IGNoYXRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0V3JhcHBlclwiKTtcclxuXHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlRGl2KTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lc3NhZ2VzRGl2KTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGlucHV0RGl2KTtcclxuXHJcbiAgICAvLyBDb250YWluZXIgZGl2XHJcbiAgICBsZXQgY29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzb2NrZXRPcGVuRXZlbnQoZSkge1xyXG4gICAgICAgIGlucHV0RGl2X3RleHRhcmVhLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgaW5wdXREaXZfdGV4dGFyZWEuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgXCJFbnRlciBtZXNzYWdlXCIpO1xyXG5cclxuICAgICAgICBpbnB1dERpdl9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzb2NrZXRNZXNzYWdlRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS50eXBlID09PSBcImhlYXJ0YmVhdFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjaGF0TWVzc2FnZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4uY2xhc3NMaXN0LmFkZChcImNoYXRNZXNzYWdlXCIpO1xyXG5cclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gXCJbXCIgKyByZXNwb25zZS50eXBlICsgXCJdIFwiO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSByZXNwb25zZS51c2VybmFtZSArIFwiOiBcIjtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gcmVzcG9uc2UuZGF0YTtcclxuXHJcbiAgICAgICAgbWVzc2FnZXNEaXYuYXBwZW5kQ2hpbGQoY2hhdE1lc3NhZ2VTcGFuKTtcclxuXHJcbiAgICAgICAgbWVzc2FnZXNEaXYuc2Nyb2xsVG9wID0gbWVzc2FnZXNEaXYuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5hbWVDaGFuZ2VFdmVudChlKSB7XHJcbiAgICAgICAgbmFtZUNoYW5nZURpdi50ZXh0Q29udGVudCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChuYW1lQ2hhbmdlSW5wdXQudmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlSW5wdXQpO1xyXG5cclxuICAgICAgICAgICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VJbnB1dC52YWx1ZSA9IHRoaXMudXNlcm5hbWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IG5hbWVDaGFuZ2VJbnB1dC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY2hhdFVzZXJuYW1lXCIsIHRoaXMudXNlcm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgbmFtZUNoYW5nZUlucHV0LnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VTcGFuLnRleHRDb250ZW50ID0gXCJVc2VybmFtZTogXCIgKyB0aGlzLnVzZXJuYW1lO1xyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VTcGFuKTtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1dHRvbkV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dERpdl90ZXh0YXJlYS52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiIHx8IHZhbHVlID09PSBcIlxcblwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTXVzdCBlbnRlciBhIG1lc3NhZ2UhXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5wdXREaXZfdGV4dGFyZWEudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIiA6IHZhbHVlLFxyXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHRoaXMudXNlcm5hbWUsXHJcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZXh0YXJlYUV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBwcmVzc2luZyBlbnRlciBhbmQgc2hpZnQgaXMgbm90IHByZXNzZWQgLT4gY2xpY2sgYnV0dG9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMgJiYgIWUuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaW5wdXREaXZfYnV0dG9uLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5DaGF0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XHJcbiIsImNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4uLy4uL0FwcGxpY2F0aW9uLmpzXCIpO1xyXG5jb25zdCBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIENoYXRTdGFydChzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwibm8gY29udGFpbmVyXCI7XHJcblxyXG4gICAgdGhpcy5jaGF0T2JqID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gV3JhcHBlclxyXG4gICAgbGV0IGNoYXRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0V3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBDaGF0IHN0YXJ0IGhlYWRlclxyXG4gICAgbGV0IGNoYXRTdGFydEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXIuY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydEhlYWRlclwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXRTdGFydEhlYWRlcik7XHJcblxyXG4gICAgbGV0IGNoYXRTdGFydEhlYWRlclNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIGNoYXRTdGFydEhlYWRlclNwYW4udGV4dENvbnRlbnQgPSBcIlNVUEVSQ0hBVFwiO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyLmFwcGVuZENoaWxkKGNoYXRTdGFydEhlYWRlclNwYW4pO1xyXG5cclxuICAgIC8vIENoYXQgbmFtZSBpbnB1dFxyXG4gICAgbGV0IGNoYXROYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAvLyBmaXggdG8gbWFrZSBpbnB1dCBzZWxlY3RhYmxlXHJcbiAgICBjaGF0TmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgICBjaGF0TmFtZUlucHV0LnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiRW50ZXIgbmFtZSFcIik7XHJcbiAgICBjaGF0TmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnROYW1lSW5wdXRcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0TmFtZUlucHV0KTtcclxuXHJcbiAgICAvLyBDaGF0IG5hbWUgYnV0dG9uXHJcbiAgICBsZXQgY2hhdE5hbWVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJ1dHRvbkV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydE5hbWVCdXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24udGV4dENvbnRlbnQgPSBcIlN0YXJ0IGNoYXR0aW5nIVwiO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdE5hbWVCdXR0b24pO1xyXG5cclxuICAgIC8vIENvbnRhaW5lciBkaXZcclxuICAgIGxldCBjb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBjb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgYSB1c2VybmFtZSBleGlzdHMgaW4gbG9jYWwgc3RvcmFnZSAtPiBzdGFydCBjaGF0XHJcbiAgICAgKi9cclxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNoYXRVc2VybmFtZVwiKSkge1xyXG4gICAgICAgIHNldHRpbmdzLnVzZXJuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjaGF0VXNlcm5hbWVcIik7XHJcblxyXG4gICAgICAgIGNoYXRXcmFwcGVyRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICB0aGlzLmNoYXRPYmogPSBuZXcgQ2hhdChzZXR0aW5ncyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gY2hhdE5hbWVJbnB1dC52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW50ZXIgYSBuYW1lIVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY2hhdFVzZXJuYW1lXCIsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgc2V0dGluZ3MudXNlcm5hbWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgY2hhdFdyYXBwZXJEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhdE9iaiA9IG5ldyBDaGF0KHNldHRpbmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuQ2hhdFN0YXJ0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwbGljYXRpb24ucHJvdG90eXBlKTtcclxuQ2hhdFN0YXJ0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENoYXRTdGFydDtcclxuXHJcbkNoYXRTdGFydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmNoYXRPYmopIHtcclxuICAgICAgICB0aGlzLmNoYXRPYmouY2xvc2UoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGF0U3RhcnQ7XHJcbiIsImZ1bmN0aW9uIENhcmQodmFsdWUpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgdGhpcy5pc0ZsaXBwZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIGxldCBjYXJkVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUNhcmRUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBjYXJkVGVtcGxhdGVGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShjYXJkVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gVGhlIGNhcmRFbGVtIGlzIHRoZSBlbGVtZW50IHdyYXBwaW5nIHRoZSB0d28gaW1hZ2VzXHJcbiAgICB0aGlzLmNhcmRFbGVtID0gY2FyZFRlbXBsYXRlRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIHRoaXMudmFsdWUpO1xyXG5cclxuICAgIC8vIFRoZSBjb3ZlckltYWdlIGlzIHRoZSBxdWVzdGlvbiBtYXJrIGFib3ZlIHRoZSBjYXJkIGltYWdlXHJcbiAgICB0aGlzLmNvdmVySW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRfYmFja1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zcmMgPSBcImltYWdlL01lbW9yeS9cIiArIHRoaXMudmFsdWVbMF0gKyBcIi5wbmdcIjtcclxuXHJcbiAgICAvLyBUaGUgY2FyZEltYWdlIGlzIHRoZSBpbWFnZSBvZiB0aGUgbWVtb3J5IGNhcmRcclxuICAgIHRoaXMuY2FyZEltYWdlID0gdGhpcy5jYXJkRWxlbS5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkX2Zyb250XCIpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdW5pcXVlIHZhbHVlIGZvciB0aGlzIGNhcmRcclxuICogVGhlIGNhcmQgaWRlbnRpZmllclxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogRmxpcHMgdGhlIGNhcmRcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmlzRmxpcHBlZCkge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIk1lbW9yeS1jYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0ZsaXBwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRJc0ZsaXBwZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRmxpcHBlZDtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuc2V0SXNDb21wbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzQ29tcGxldGUgPSB2YWx1ZTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcclxuICAgIHRoaXMuY2FyZEVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5nZXRDYXJkRWxlbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZEVsZW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZDtcclxuIiwiY29uc3QgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDYXJkcyhuck9mQ2FyZHMpIHtcclxuICAgIHRoaXMuY2FyZHMgPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuck9mQ2FyZHMgKyAxOyBpKyspIHtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAxKSk7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2h1ZmZsZSB0aGUgY2FyZHNcclxuICAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgbGV0IHRlbXAgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbaV0gPSB0aGlzLmNhcmRzW2pdO1xyXG4gICAgICAgIHRoaXMuY2FyZHNbal0gPSB0ZW1wO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgY2FyZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZVxyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgbGV0IGNhcmQ7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FyZHNbaV0uZ2V0VmFsdWUoKSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgY2FyZCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBmcmFnbWVudCBjb250YWluaW5nIHRoZSBjYXJkIGRpdnMgYW5kIGltYWdlc1xyXG4gKi9cclxuQ2FyZHMucHJvdG90eXBlLmdldENhcmRzRnJhZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNhcmRzRnJhZyA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNhcmRFbGVtID0gdGhpcy5jYXJkc1tpXS5nZXRDYXJkRWxlbSgpO1xyXG4gICAgICAgIGNhcmRzRnJhZy5hcHBlbmRDaGlsZChjYXJkRWxlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmRzRnJhZztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkcztcclxuIiwiY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vQXBwbGljYXRpb24uanNcIik7XHJcbmNvbnN0IE1lbW9yeUdhbWVCb2FyZCA9IHJlcXVpcmUoXCIuL01lbW9yeUdhbWVCb2FyZC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIE1lbW9yeUdhbWUoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIiMxMjNcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIFdyYXBwZXJcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVdyYXBwZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5V3JhcHBlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gbWVtb3J5V3JhcHBlckZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktd3JhcHBlclwiKTtcclxuXHJcbiAgICAvLyBIZWFkZXJcclxuICAgIGxldCBtZW1vcnlIZWFkZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5SGVhZGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5SGVhZGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUhlYWRlciA9IG1lbW9yeUhlYWRlckZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlIZWFkZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUhlYWRlcik7XHJcblxyXG4gICAgLy8gUGFpciBmb3JtXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1UZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJGb3JtVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtID0gbWVtb3J5UGFpckZvcm1GcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1cIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVBhaXJGb3JtKTtcclxuXHJcbiAgICAvLyBSYWRpbyBpbnB1dHNcclxuICAgIGxldCBtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpclJhZGlvVGVtcGxhdGVcIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gODsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJSYWRpb0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJSYWRpb1RlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgICAgICBsZXQgbWVtb3J5UGFpckxhYmVsID0gbWVtb3J5UGFpclJhZGlvRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhaXJSYWRpb0xhYmVsXCIpO1xyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyUmFkaW8gPSBtZW1vcnlQYWlyTGFiZWwucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBtZW1vcnlQYWlyTGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaSArIFwiIHBhaXJzXCIpKTtcclxuICAgICAgICAvLyBGaXggdG8gbWFrZSByYWRpbyBpbnB1dHMgY2xpY2thYmxlXHJcbiAgICAgICAgbWVtb3J5UGFpckxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtZW1vcnlQYWlyUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhaXJGb3JtLmFwcGVuZENoaWxkKG1lbW9yeVBhaXJMYWJlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRm9ybSBidXR0b25cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b24gPSBtZW1vcnlQYWlyRm9ybUJ1dHRvbkZyYWcucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcclxuICAgIG1lbW9yeVBhaXJGb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZW1vcnlQYWlyRm9ybUJ1dHRvbkV2ZW50KTtcclxuXHJcbiAgICBtZW1vcnlQYWlyRm9ybS5hcHBlbmRDaGlsZChtZW1vcnlQYWlyRm9ybUJ1dHRvbik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyXHJcbiAgICBsZXQgbWVtb3J5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgbWVtb3J5Q29udGFpbmVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IG5yT2ZQYWlycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm0gaW5wdXQ6Y2hlY2tlZFwiKS52YWx1ZTtcclxuXHJcbiAgICAgICAgbWVtb3J5V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1lbW9yeVdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICBzZXR0aW5ncy5uck9mUGFpcnMgPSBwYXJzZUludChuck9mUGFpcnMpO1xyXG4gICAgICAgIG5ldyBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5NZW1vcnlHYW1lLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwbGljYXRpb24ucHJvdG90eXBlKTtcclxuTWVtb3J5R2FtZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNZW1vcnlHYW1lO1xyXG5cclxuTWVtb3J5R2FtZS5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHt9XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWU7XHJcbiIsImNvbnN0IENhcmRzID0gcmVxdWlyZShcIi4vQ2FyZHMuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCIjY29vbFwiO1xyXG5cclxuICAgIGxldCBuck9mUGFpcnMgPSBzZXR0aW5ncy5uck9mUGFpcnMgPyBzZXR0aW5ncy5uck9mUGFpcnMgOiA0O1xyXG5cclxuICAgIGxldCBjYXJkcyA9IG5ldyBDYXJkcyhuck9mUGFpcnMpO1xyXG5cclxuICAgIGxldCBzY29yZSA9IDA7XHJcblxyXG4gICAgbGV0IGdhbWVUaW1lciA9IDA7XHJcblxyXG4gICAgbGV0IGF0dGVtcHRzID0gMDtcclxuXHJcbiAgICBsZXQgZmlyc3RDYXJkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGxldCBzZWNvbmRDYXJkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGxldCBpc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XHJcblxyXG4gICAgbGV0IGdhbWVUaW1lckludGVydmFsID0gc2V0SW50ZXJ2YWwodGltZXIsIDEwMDApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRUxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gTWVtb3J5IHdyYXBwZXJcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVdyYXBwZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5V3JhcHBlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlXcmFwcGVyRGl2ID0gbWVtb3J5V3JhcHBlckZyYWcucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktd3JhcHBlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1lbW9yeVdyYXBwZXJDbGlja0V2ZW50KTtcclxuXHJcbiAgICAvLyBIZWFkZXJcclxuICAgIGxldCBtZW1vcnlIZWFkZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5SGVhZGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5SGVhZGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUhlYWRlciA9IG1lbW9yeUhlYWRlckZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlIZWFkZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUhlYWRlcik7XHJcblxyXG4gICAgLy8gTWVtb3J5IHBhbmVsXHJcbiAgICBsZXQgbWVtb3J5UGFuZWxUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbEZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhbmVsVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhbmVsRGl2ICAgICAgICAgID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LXBhbmVsXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW5cIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxUaW1lU3BhbiAgICAgPSBtZW1vcnlQYW5lbEZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYW5lbFRpbWVTcGFuXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsTWVzc2FnZVNwYW4gID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxNZXNzYWdlU3BhblwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5UGFuZWxEaXYpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBjYXJkc1xyXG4gICAgbGV0IG1lbW95Q2FyZHNUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q2FyZHNUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlDYXJkc0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUNhcmRzVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUNhcmRzRGl2ID0gbWVtb3J5Q2FyZHNGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRzXCIpO1xyXG4gICAgbWVtb3J5Q2FyZHNEaXYuYXBwZW5kQ2hpbGQoY2FyZHMuZ2V0Q2FyZHNGcmFnKCkpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlDYXJkc0Rpdik7XHJcblxyXG4gICAgLy8gTWVtb3J5IGNvbnRhaW5lclxyXG4gICAgbGV0IG1lbW9yeUNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeUNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChtZW1vcnlXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0aW1lcigpIHtcclxuICAgICAgICBnYW1lVGltZXIgKz0gMTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFuZWxBdHRlbXB0c1NwYW4udGV4dENvbnRlbnQgPSBcIkF0dGVtcHRzOiBcIiArIGF0dGVtcHRzO1xyXG4gICAgICAgIG1lbW9yeVBhbmVsVGltZVNwYW4udGV4dENvbnRlbnQgPSBcIlRpbWU6IFwiICsgZ2FtZVRpbWVyICsgXCIgc2Vjb25kc1wiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVdyYXBwZXJDbGlja0V2ZW50KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGlzIGN1cnJlbnRseSBjaGVja2luZyBhbnN3ZXIgLT4gZXhpdCBmdW5jdGlvblxyXG4gICAgICAgICAqICh3YWl0aW5nIGZvciB0aW1lciB0byBmaW5pc2gpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKGlzQ2hlY2tpbmdBbnN3ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGltZ0VsZW0gPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGFFbGVtID0gaW1nRWxlbS5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGltZ0VsZW0ucGFyZW50Tm9kZSA6IGltZ0VsZW07XHJcblxyXG4gICAgICAgIGxldCB2YWx1ZSA9IGFFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIik7XHJcblxyXG4gICAgICAgIGxldCBjYXJkID0gY2FyZHMuZ2V0Q2FyZCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmIChjYXJkKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXJkLmdldElzRmxpcHBlZCgpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY2FyZC5mbGlwKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0Q2FyZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RDYXJkID0gY2FyZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kQ2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQW5zd2VyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tBbnN3ZXIoKSB7XHJcbiAgICAgICAgaXNDaGVja2luZ0Fuc3dlciA9IHRydWU7XHJcblxyXG4gICAgICAgIGF0dGVtcHRzICs9IDE7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpc0NoZWNraW5nQW5zd2VyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlyc3RDYXJkLmdldFZhbHVlKClbMF0gPT09IHNlY29uZENhcmQuZ2V0VmFsdWUoKVswXSkge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLnNldElzQ29tcGxldGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLmFkZENsYXNzKFwiTWVtb3J5LWNhcmQtLWNvcnJlY3RcIik7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLmFkZENsYXNzKFwiTWVtb3J5LWNhcmQtLWNvcnJlY3RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcmUgKz0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIHNjb3JlIGlzIGVxdWFsIHRvIG1heGltdW0gYW1vdW50IG9mIHBhaXJzIC0+IHRoZSBnYW1lIGlzIGNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChzY29yZSA9PT0gbnJPZlBhaXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChnYW1lVGltZXJJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5UGFuZWxNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCA9IFwiWW91IGNvbXBsZXRlZCB0aGUgZ2FtZSFcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5mbGlwKCk7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlyc3RDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBzZWNvbmRDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWVCb2FyZDtcclxuIiwiY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vQXBwbGljYXRpb24uanNcIik7XHJcblxyXG5mdW5jdGlvbiBTZXR0aW5ncyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBBcHBsaWNhdGlvbi5jYWxsKHRoaXMsIHtcclxuICAgICAgIFwiYXBpXCI6IHNldHRpbmdzLmFwaVxyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLndpbmRvd0RpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpO1xyXG4gICAgdGhpcy53aW5kb3dEaXYuY2xhc3NMaXN0LmFkZChcInNldHRpbmdzV3JhcHBlclwiKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJhY2tncm91bmRcclxuICAgICAqL1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZFRpdGxlLnRleHRDb250ZW50ID0gXCJDaGFuZ2UgYmFja2dyb3VuZFwiO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0uY2xhc3NMaXN0LmFkZChcInNldHRpbmdzQmFja2dyb3VuZEZvcm1cIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICBsZXQgZm9ybUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGZvcm1MYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJiYWNrZ3JvdW5kRm9ybVwiICsgdGhpcy5jb250YWluZXIgKyBpKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcm1SYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImJhY2tncm91bmRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiYmFja2dyb3VuZEZvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XHJcblxyXG4gICAgICAgIGxldCBmb3JtSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGZvcm1JbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCIuL2ltYWdlL2JhY2tncm91bmRcIiArIGkgKyBcIl9zbWFsbC5qcGdcIik7XHJcbiAgICAgICAgZm9ybUltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkJhY2tncm91bmRcIik7XHJcblxyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtUmFkaW8pO1xyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtSW1hZ2UpO1xyXG5cclxuICAgICAgICB0aGlzLmJhY2tncm91bmRGb3JtLmFwcGVuZENoaWxkKGZvcm1MYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kVGl0bGUpO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJhY2tncm91bmRGb3JtKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgcmVzb2x1dGlvblxyXG4gICAgICovXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgdGhpcy5kaXNwbGF5UmVzVGl0bGUudGV4dENvbnRlbnQgPSBcIkNoYW5nZSBEaXNwbGF5IFJlc29sdXRpb25cIjtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XHJcbiAgICB0aGlzLmRpc3BsYXlSZXNGb3JtLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc0Rpc3BsYXlSZXNGb3JtXCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGZvcm1MYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICBmb3JtTGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwiZGlzcGxheVJlc0Zvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XHJcblxyXG4gICAgICAgIGxldCBmb3JtUmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYWRpb1wiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJkaXNwbGF5UmVzXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImRpc3BsYXlSZXNGb3JtXCIgKyB0aGlzLmNvbnRhaW5lciArIGkpO1xyXG5cclxuICAgICAgICBsZXQgZm9ybVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBmb3JtU3Bhbi50ZXh0Q29udGVudCA9IFwiYXNkYXNkYXNkYXNkXCI7XHJcblxyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtUmFkaW8pO1xyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtU3Bhbik7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheVJlc0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5kaXNwbGF5UmVzV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXlSZXNUaXRsZSk7XHJcbiAgICB0aGlzLmRpc3BsYXlSZXNXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheVJlc0Zvcm0pO1xyXG5cclxuICAgIGxldCBzcGFucyA9IHRoaXMuZGlzcGxheVJlc1dyYXBwZXIucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcbiAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IFwiMTI4MHg3MjBcIjtcclxuICAgIHNwYW5zWzJdLnRleHRDb250ZW50ID0gXCIxNjAweDkwMFwiO1xyXG4gICAgc3BhbnNbM10udGV4dENvbnRlbnQgPSBcIjE5MjB4MTA4MFwiO1xyXG4gICAgc3BhbnNbNF0udGV4dENvbnRlbnQgPSBcIjI0NjB4MTQwMFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2F2ZSBidXR0b25cclxuICAgICAqL1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2V0dGluZ3NCdXR0b25cIik7XHJcbiAgICB0aGlzLnNhdmVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU2F2ZVwiO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzYXZlQnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgdGhpcy5zZXR0aW5ncyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLnNldHRpbmdzLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc1wiKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzLmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZFdyYXBwZXIpO1xyXG4gICAgdGhpcy5zZXR0aW5ncy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIikpO1xyXG4gICAgdGhpcy5zZXR0aW5ncy5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXlSZXNXcmFwcGVyKTtcclxuICAgIHRoaXMuc2V0dGluZ3MuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpKTtcclxuXHJcbiAgICB0aGlzLndpbmRvd0Rpdi5hcHBlbmRDaGlsZCh0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMud2luZG93RGl2LmFwcGVuZENoaWxkKHRoaXMuc2F2ZUJ1dHRvbik7XHJcblxyXG4gICAgZnVuY3Rpb24gc2F2ZUJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhY2tncm91bmRcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgYmFja2dyb3VuZElucHV0cyA9IHRoaXMuYmFja2dyb3VuZEZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhY2tncm91bmRJbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGJhY2tncm91bmRJbnB1dHNbaV0uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcGkuc2V0UHdkQmFja2dyb3VuZChpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRpc3BsYXlSZXNJbnB1dHMgPSB0aGlzLmRpc3BsYXlSZXNGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwbGF5UmVzSW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5UmVzSW5wdXRzW2ldLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBpLnNldFB3ZERpc3BsYXlSZXNvbHV0aW9uKGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5TZXR0aW5ncy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XHJcblNldHRpbmdzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNldHRpbmdzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcclxuIl19
