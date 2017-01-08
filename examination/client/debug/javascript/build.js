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
        /**
         * Look for background in local storage
         */
        if (localStorage.getItem("main_background")) {
            this.container.classList.add(localStorage.getItem("main_background"));
        } else {
            this.container.classList.add("main--background-3");
        }
        /**
         * Look for display resolution in local storage
         */
        if (localStorage.getItem("main_displayRes")) {
            this.container.classList.add(localStorage.getItem("main_displayRes"));
        } else {
            this.container.classList.add("main--displayRes-0");
        }

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

        /**
         * If a click has been made on the start button
         */
        if (target === "startButton") {
            e.preventDefault();

            this.start.classList.toggle("PWD-start--hide");

            return;
        }

        /**
         * If a click has been made on the clock button
         */
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
     * Bring the icon with the given index to the front of the icons array
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

    /**
     * The API is used by applications to communicate with the PWD
     */
    function getApi() {
        if (this.api instanceof MyAPI) {
            return this.api;
        }

        /**
         * The API is provided some settings
         */
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
    console.log("Closing Chat application...");

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

MemoryGame.prototype.close = function() {
    console.log("Closing Memory application...");
}

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

        if (localStorage.getItem("main_background") === "main--background-" + i) {
            formRadio.checked = true;
        }

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

        if (localStorage.getItem("main_displayRes") === "main--displayRes-" + i) {
            formRadio.checked = true;
        }

        let formSpan = document.createElement("span");

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

                localStorage.setItem("main_background", "main--background-" + i);
            }
        }

        let displayResInputs = this.displayResForm.querySelectorAll("input");

        for (let i = 0; i < displayResInputs.length; i++) {
            if (displayResInputs[i].checked) {
                this.api.setPwdDisplayResolution(i);

                localStorage.setItem("main_displayRes", "main--displayRes-" + i);
            }
        }
    }
}

Settings.prototype = Object.create(Application.prototype);
Settings.prototype.constructor = Settings;

Settings.prototype.close = function() {
    console.log("Closing Settings application...");
}

module.exports = Settings;

},{"../../Application.js":1}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwbGljYXRpb24uanMiLCJjbGllbnQvc291cmNlL2pzL0VudGl0eS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvTXlBUEkuanMiLCJjbGllbnQvc291cmNlL2pzL015V2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZUJvYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL1NldHRpbmdzL1NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNTJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBFdmVyeSBhcHBsaWNhdGlvbiBpbiB0aGUgUFdEIG11c3QgaW1wbGVtZW50IEFwcGxpY2F0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBBcHBsaWNhdGlvbihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLmFwaSA9IHNldHRpbmdzLmFwaSA/IHNldHRpbmdzLmFwaSA6IHVuZGVmaW5lZDtcclxufVxyXG5cclxuQXBwbGljYXRpb24ucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIldBUk5JTkchIEFwcGxpY2F0aW9uIG11c3QgaW1wbGVtZW50IGZ1bmN0aW9uIGNsb3NlLlwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBsaWNhdGlvbjtcclxuIiwiLyoqXHJcbiAqIFdpbmRvdyBhbmQgaWNvbiBpbmhlcml0cyBmcm9tIGVudGl0eVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVudGl0eShzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLndpZHRoID0gc2V0dGluZ3Mud2lkdGggPyBzZXR0aW5ncy53aWR0aCA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnhQb3MgPSBzZXR0aW5ncy54UG9zID8gc2V0dGluZ3MueFBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnlQb3MgPSBzZXR0aW5ncy55UG9zID8gc2V0dGluZ3MueVBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnpJbmRleCA9IHNldHRpbmdzLnpJbmRleCA/IHNldHRpbmdzLnpJbmRleCA6IDA7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBzZXR0aW5ncy5pc0RyYWdnaW5nID8gc2V0dGluZ3MuaXNEcmFnZ2luZyA6IGZhbHNlO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRYUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy54UG9zO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFlQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnlQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUudXBkYXRlUG9zID0gZnVuY3Rpb24oeFBvcywgeVBvcykge1xyXG4gICAgdGhpcy54UG9zID0geFBvcztcclxuICAgIHRoaXMueVBvcyA9IHlQb3M7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnNldElzRHJhZ2dpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2luZ1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdnaW5nXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldElzRHJhZ2dpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRHJhZ2dpbmc7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcInpJbmRleFwiOiBzZXR0aW5ncy56SW5kZXgsXHJcbiAgICAgICAgXCJpc1NlbGVjdGVkXCI6IHNldHRpbmdzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgXCJpc0RyYWdnaW5nXCI6IHNldHRpbmdzLmlzRHJhZ2dpbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaWNvblRleHQgICAgICAgID0gc2V0dGluZ3MuaWNvblRleHQgPyBzZXR0aW5ncy5pY29uVGV4dCA6IFwiTm8gaWNvbiB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy53aWR0aCAgICAgICAgICAgPSBzZXR0aW5ncy53aWR0aCA/IHNldHRpbmdzLndpZHRoIDogMTA7XHJcblxyXG4gICAgdGhpcy5oZWlnaHQgICAgICAgICAgPSBzZXR0aW5ncy5oZWlnaHQgPyBzZXR0aW5ncy5oZWlnaHQgOiAxMDtcclxuXHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA/IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5pY29uSW1hZ2UgICAgICAgPSBzZXR0aW5ncy5pY29uSW1hZ2UgPyBzZXR0aW5ncy5pY29uSW1hZ2UgOiBcImRlZmF1bHRJY29uLnBuZ1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSAgICAgID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcInNtYWxsXCI7XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBcIlwiO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyICAgICAgID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWljb25cIik7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICAgICAgbGV0IGljb25JbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGljb25JbWFnZUVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uSW1hZ2U7XHJcblxyXG4gICAgICAgIGxldCBpY29uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGljb25UZXh0LnRleHRDb250ZW50ID0gdGhpcy5pY29uVGV4dDtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25JbWFnZUVsZW0pO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uVGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJY29uIGluaGVyaXRzIGZyb20gRW50aXR5XHJcbiAqL1xyXG5JY29uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRW50aXR5LnByb3RvdHlwZSk7XHJcbkljb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSWNvbjtcclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG4vKipcclxuICogSWNvbnMgYXJlIHN1cHBvc2VkIHRvIGJlIGFsaWduZWQgaW4gYSBncmlkIHN5c3RlbS5cclxuICogVGhpcyBmdW5jdGlvbiBjb3JyZWN0cyB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBvZiB0aGUgaWNvbiwgbWFraW5nIGl0IGFsaWduIHRvIHRoZSBuZWFyZXN0IGdyaWRcclxuICovXHJcbkljb24ucHJvdG90eXBlLmNvcnJlY3RHcmlkUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMueFBvcyA9IHRoaXMueFBvcyAtIHRoaXMueFBvcyAlIDEwMDtcclxuICAgIHRoaXMueVBvcyA9IDUgKyB0aGlzLnlQb3MgLSB0aGlzLnlQb3MgJSAxMDA7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0QmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEljb25UZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uVGV4dDtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvbkltYWdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uSW1hZ2U7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLndpbmRvd1NpemU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcclxuIiwiLyoqXHJcbiAqIFRoZSBBUEkgaXMgYSB3YXkgZm9yIGFwcGxpY2F0aW9ucyB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBQV0RcclxuICovXHJcbmZ1bmN0aW9uIE15QVBJKHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMucHdkQ29udGFpbmVyID0gc2V0dGluZ3MucHdkQ29udGFpbmVyID8gc2V0dGluZ3MucHdkQ29udGFpbmVyIDogdW5kZWZpbmVkO1xyXG59XHJcblxyXG5NeUFQSS5wcm90b3R5cGUuc2V0UHdkQmFja2dyb3VuZCA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICBsZXQgcHJlZml4ID0gXCJtYWluLS1iYWNrZ3JvdW5kLVwiO1xyXG5cclxuICAgIE15QVBJLnByb3RvdHlwZS5yZW1vdmVDbGFzc2VzV2l0aFByZWZpeChwcmVmaXgsIHRoaXMucHdkQ29udGFpbmVyKTtcclxuXHJcbiAgICB0aGlzLnB3ZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHByZWZpeCArIGluZGV4KTtcclxufVxyXG5cclxuTXlBUEkucHJvdG90eXBlLnNldFB3ZERpc3BsYXlSZXNvbHV0aW9uID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIGxldCBwcmVmaXggPSBcIm1haW4tLWRpc3BsYXlSZXMtXCI7XHJcblxyXG4gICAgTXlBUEkucHJvdG90eXBlLnJlbW92ZUNsYXNzZXNXaXRoUHJlZml4KHByZWZpeCwgdGhpcy5wd2RDb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMucHdkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQocHJlZml4ICsgaW5kZXgpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGNsYXNzZXMgd2l0aCBwcmVmaXhcclxuICovXHJcbk15QVBJLnByb3RvdHlwZS5yZW1vdmVDbGFzc2VzV2l0aFByZWZpeCA9IGZ1bmN0aW9uKHByZWZpeCwgZWxlbSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtLmNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChlbGVtLmNsYXNzTGlzdFtpXS5pbmRleE9mKHByZWZpeCkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShlbGVtLmNsYXNzTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeUFQSTtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZShcIi4vRW50aXR5LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTXlXaW5kb3coc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcInpJbmRleFwiOiBzZXR0aW5ncy56SW5kZXgsXHJcbiAgICAgICAgXCJpc1NlbGVjdGVkXCI6IHNldHRpbmdzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgXCJpc0RyYWdnaW5nXCI6IHNldHRpbmdzLmlzRHJhZ2dpbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZCA/IHNldHRpbmdzLmlkIDogMDtcclxuXHJcbiAgICAvL3RoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogXCIjXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMudG9wQmFyVGV4dCA9IHNldHRpbmdzLnRvcEJhclRleHQgPyBzZXR0aW5ncy50b3BCYXJUZXh0IDogXCJObyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy50b3BCYXJJY29uID0gc2V0dGluZ3MudG9wQmFySWNvbiA/IHNldHRpbmdzLnRvcEJhckljb24gOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJtZWRpdW1cIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd1RvcEJhci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhckljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgd2luZG93VG9wQmFySWNvbi5zcmMgPSBcIi4vaW1hZ2UvXCIgKyB0aGlzLnRvcEJhckljb247XHJcbiAgICB3aW5kb3dUb3BCYXJJY29uLmFsdCA9IFwiVG9wIGJhciBpY29uXCI7XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhclNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHdpbmRvd1RvcEJhclNwYW4udGV4dENvbnRlbnQgPSB0aGlzLnRvcEJhclRleHQ7XHJcblxyXG4gICAgbGV0IHdpbmRvd01pbmltaXplRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHdpbmRvd01pbmltaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19taW5pbWl6ZVwiKTtcclxuICAgIHdpbmRvd01pbmltaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLW1pbnVzLXJvdW5kXCIpO1xyXG5cclxuICAgIHRoaXMud2luZG93UmVzaXplRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19yZXNpemVcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd0Nsb3NlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHdpbmRvd0Nsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19jbG9zZVwiKTtcclxuICAgIHdpbmRvd0Nsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWNsb3NlLXJvdW5kXCIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY29udGVudFwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLmlkKTtcclxuICAgIGlmICh0aGlzLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgIHdpbmRvd0NvbnRlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJfd3JhcHBlclwiKTtcclxuXHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFySWNvbik7XHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyU3Bhbik7XHJcblxyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dNaW5pbWl6ZUVsZW0pO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLndpbmRvd1Jlc2l6ZUVsZW0pO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dDbG9zZUVsZW0pO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcldyYXBwZXIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93Q29udGVudCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgYWxsIGNsYXNzZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImlvbi1hcnJvdy1leHBhbmRcIik7XHJcbiAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJpb24tYXJyb3ctc2hyaW5rXCIpO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwic21hbGxcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAyMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDMwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA0NTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1hcnJvdy1leHBhbmRcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDQwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gNjAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tYXJyb3ctc2hyaW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tXCIgKyB0aGlzLndpbmRvd1NpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0UG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgdGVzdCA9IHRoaXMuaWQgPCAxMCA/IFwiMFwiIDogXCJcIjtcclxuICAgICAgICB0ZXN0ICs9IHRoaXMuaWQ7XHJcblxyXG4gICAgICAgIHRoaXMueFBvcyA9ICgxMDArMjAwKnRlc3RbMF0gKyAxNSAqIHRoaXMuaWQpO1xyXG4gICAgICAgIHRoaXMueVBvcyA9ICgyMCArIDMwICogKHRoaXMuaWQgLSB0ZXN0WzBdKjEwKSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29ycmVjdFBvc2l0aW9uKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXaW5kb3cgaW5oZXJpdHMgZnJvbSBFbnRpdHlcclxuICovXHJcbk15V2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRW50aXR5LnByb3RvdHlwZSk7XHJcbk15V2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE15V2luZG93O1xyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLmdldE1pbmltaXplZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubWluaW1pemVkO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuc2V0TWluaW1pemVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMubWluaW1pemVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMubWluaW1pemVkKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1taW5pbWl6ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1pbmltaXplXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1tYXhpbWl6ZVwiKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1cIiArIHRoaXMud2luZG93U2l6ZSk7XHJcblxyXG4gICAgc3dpdGNoKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcIm1lZGl1bVwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwiYmlnXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJiaWdcIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJzbWFsbFwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXBwbGljYXRpb25PYmouY2xvc2UoKTtcclxufVxyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeVdpbmRvdztcclxuIiwiY29uc3QgTXlXaW5kb3cgPSByZXF1aXJlKFwiLi9NeVdpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IFBhbmVsID0gcmVxdWlyZShcIi4vUGFuZWwuanNcIik7XHJcbmNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4vQXBwbGljYXRpb24uanNcIik7XHJcbmNvbnN0IE15QVBJID0gcmVxdWlyZShcIi4vTXlBUEkuanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcbmNvbnN0IENoYXQgPSByZXF1aXJlKFwiLi9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzXCIpO1xyXG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2FwcHMvU2V0dGluZ3MvU2V0dGluZ3MuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG5cclxuICAgIGluaXRpYWxpemUoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgZGVmYXVsdCBiZWhhdmlvdXIvcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFwaSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd0NvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbGVtZW50c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1haW5cIik7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9vayBmb3IgYmFja2dyb3VuZCBpbiBsb2NhbCBzdG9yYWdlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibWFpbl9iYWNrZ3JvdW5kXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYWluX2JhY2tncm91bmRcIikpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtYWluLS1iYWNrZ3JvdW5kLTNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvb2sgZm9yIGRpc3BsYXkgcmVzb2x1dGlvbiBpbiBsb2NhbCBzdG9yYWdlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibWFpbl9kaXNwbGF5UmVzXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYWluX2Rpc3BsYXlSZXNcIikpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtYWluLS1kaXNwbGF5UmVzLTBcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5ocmVmID0gXCIjXCI7XHJcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9zdGFydEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0XCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnQuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydC0taGlkZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfdGl0bGUuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydF9fdGl0bGVcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydF90aXRsZS50ZXh0Q29udGVudCA9IFwiSGVqIVwiO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydF9fbWVzc2FnZVwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UudGV4dENvbnRlbnQgPSBcIk1hZGUgYnkgU2ltb24gw5ZzdGVyZGFobFwiO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0LmFwcGVuZENoaWxkKHRoaXMuc3RhcnRfdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuc3RhcnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydF9tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9ja0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2tCdXR0b24uaHJlZiA9IFwiI1wiO1xyXG4gICAgICAgIHRoaXMuY2xvY2tCdXR0b24uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfY2xvY2tCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNsb2NrQnV0dG9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrQnV0dG9uLnRleHRDb250ZW50ID0gZC5nZXRIb3VycygpICsgXCI6XCIgKyAoZC5nZXRNaW51dGVzKCkgPCAxMCA/IFwiMFwiICsgZC5nZXRNaW51dGVzKCkgOiBkLmdldE1pbnV0ZXMoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVDbG9ja0J1dHRvbigpO1xyXG5cclxuICAgICAgICBzZXRJbnRlcnZhbCh1cGRhdGVDbG9ja0J1dHRvbiwgMzAwMDApO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2tcIik7XHJcbiAgICAgICAgdGhpcy5jbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrLS1oaWRlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgdGhpcy5jbG9ja19iaWdDbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrX19iaWdUaW1lXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrX2RhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrX2RhdGUuY2xhc3NMaXN0LmFkZChcIlBXRC1jbG9ja19fZGF0ZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9jay5hcHBlbmRDaGlsZCh0aGlzLmNsb2NrX2JpZ0Nsb2NrKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tfZGF0ZSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNsb2NrKCkge1xyXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrLnRleHRDb250ZW50ID0gZC5nZXRIb3VycygpICsgXCI6XCIgKyAoZC5nZXRNaW51dGVzKCkgPCAxMCA/IFwiMFwiICsgZC5nZXRNaW51dGVzKCkgOiBkLmdldE1pbnV0ZXMoKSkgKyBcIjpcIiArIChkLmdldFNlY29uZHMoKSA8IDEwID8gXCIwXCIgKyBkLmdldFNlY29uZHMoKSA6IGQuZ2V0U2Vjb25kcygpKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtb250aE5hbWVzID0gW1wiSmFudWFyaVwiLCBcIkZlYnJ1YXJpXCIsIFwiTWFyc1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RpXCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrX2RhdGUudGV4dENvbnRlbnQgPSBcImRlbiBcIiArIGQuZ2V0RGF0ZSgpICsgXCIgXCIgKyBtb250aE5hbWVzW2QuZ2V0TW9udGgoKV0gKyBcIiBcIiArIGQuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldEludGVydmFsKHVwZGF0ZUNsb2NrLCAxMDAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLnBhbmVsc1dyYXBwZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxzV3JhcHBlclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0QnV0dG9uKTtcclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5hcHBlbmRDaGlsZCh0aGlzLnBhbmVsc1dyYXBwZXIpO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tCdXR0b24pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0KTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNsb2NrKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJvdHRvbUJhcik7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2V0dGluZ3MuY29udGFpbmVyKS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZSB0aGUgZGVza3RvcCBpY29uc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiTWVtb3J5IHNtYWxsXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcIm1lbW9yeUljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcInNtYWxsXCIsXHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZENvbG9yXCI6IFwicmdiKDE5MywxNTQsMTA3KVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBtZWRpdW1cIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTIwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcIm1lbW9yeUljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiLFxyXG4gICAgICAgICAgICBcImJhY2tncm91bmRDb2xvclwiOiBcInJnYigxOTMsMTU0LDEwNylcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgYmlnXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiTWVtb3J5XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDI1MCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJtZW1vcnlJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJiaWdcIixcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMTkzLDE1NCwxMDcpXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiQ2hhdFwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIkNoYXRcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMzUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcImNoYXRJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJTZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIlNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDQ1MCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJzZXR0aW5nc0ljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICAgICAgfSkgKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXBwZW5kIHRoZSBpY29ucyB0byB0aGUgY29udGFpbmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICAgICAgLy9sYXVuY2hBcHBsaWNhdGlvbih0aGlzLmljb25zWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbGF1bmNoQXBwbGljYXRpb24odGhpcy5pY29uc1szXSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZCBsaXN0ZW5lcnNcclxuICAgICAgICAgKi9cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd25FdmVudCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZXVwRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRibGNsaWNrXCIsIGRibGNsaWNrRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXZlbnQgZnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1vdXNlZG93bkV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGb3IgZXZlcnkgbW91c2Vkb3duIGV2ZW50IHdlIHdpbGwgYXR0ZW1wdCB0byBmaW5kIGEgbmV3IHRhcmdldFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBvbiBhIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBNeVdpbmRvdykge1xyXG4gICAgICAgICAgICBsZXQgcHdkV2luZG93ID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy53aW5kb3dzLmluZGV4T2YocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZWxlY3QgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzZWxlY3RXaW5kb3dQYW5lbEFwcChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRGVzZWxlY3QgaWNvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbnNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiB0YXJnZXQgaXMgdGhlIHdpbmRvdyB0b3AgYmFyIC0+IHNldCB0aGUgd2luZG93IGFzIGRyYWdUYXJnZXQgYW5kIGFkZCBtb3VzZW1vdmUgbGlzdGVuZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dUb3BCYXJFbGVtID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93VG9wQmFyRWxlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IHB3ZFdpbmRvdztcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIG9uIGEgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHt9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2UgZG93biBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBsZXQgaWNvbiA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGljb25zLmluZGV4T2YoaWNvbik7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU2V0IHRoZSBpY29uIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzZWxlY3RJY29uKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZXNlbGVjdCB0aGUgd2luZG93IGFuZCBhc3NvY2lhdGVkIHBhbmVsXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy53aW5kb3dzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZXQgdGhlIGljb24gYXMgZHJhZ1RhcmdldCBhbmQgYWRkIG1vdXNlbW92ZSBsaXN0ZW5lclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gaWNvbjtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbW91c2V1cEV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZmluZFRhcmdldChlLnRhcmdldCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhpZGUgY2xvY2sgaWYgbW91c2V1cCBoYXMgYmVlbiBtYWRlIG91dHNpZGUgY2xvY2sgYW5kIGNsb2NrQnV0dG9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCAhPT0gXCJjbG9ja1wiICYmIHRhcmdldCAhPT0gXCJjbG9ja0J1dHRvblwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jbG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJQV0QtY2xvY2stLWhpZGVcIikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvY2suY2xhc3NMaXN0LmFkZChcIlBXRC1jbG9jay0taGlkZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSGlkZSBzdGFydCBpZiBtb3VzZXVwIGhhcyBiZWVuIG1hZGUgb3V0c2lkZSBzdGFydCBhbmQgc3RhcnRCdXR0b25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0ICE9PSBcInN0YXJ0XCIgJiYgdGFyZ2V0ICE9PSBcInN0YXJ0QnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0LmNsYXNzTGlzdC5jb250YWlucyhcIlBXRC1zdGFydC0taGlkZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0LS1oaWRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIG1vdXNlIHVwIGhhcyBiZWVuIG1hZGUgb24gYSB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgTXlXaW5kb3cpIHtcclxuICAgICAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIHdpbmRvdyBpcyBiZWluZyBkcmFnZ2VkIC0+IHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQgaW5zdGFuY2VvZiBNeVdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIHB3ZFdpbmRvdy5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2V1cCBoYXMgYmVlbiBtYWRlIG9uIGEgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgbGV0IHBhbmVsID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wYW5lbHMuaW5kZXhPZihwYW5lbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcihcIlBhbmVsIHdhcyBub3QgZm91bmQuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHBhbmVsIGlzIHNlbGVjdGVkIC0+IGRlc2VsZWN0IGFuZCBtaW5pbWl6ZSB0aGUgYXNzb2NpYXRlZCB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1tpbmRleF0uZ2V0SXNTZWxlY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbaW5kZXhdLnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBwYW5lbCBpcyBkZXNlbGVjdGVkIC0+IHNlbGVjdCBhbmQgYnJpbmcgdXAgdGhlIGFzc29jaWF0ZWQgd2luZG93XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGFuZWxzW2luZGV4XS5nZXRJc1NlbGVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdFdpbmRvd1BhbmVsQXBwKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0TWluaW1pemVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2V1cCBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBsZXQgaWNvbiA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiB0aGUgaWNvbiBpcyBiZWluZyBkcmFnZ2VkIC0+IHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQgPT09IGljb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpY29uLnNldElzRHJhZ2dpbmcoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpY29uLmNvcnJlY3RHcmlkUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgaXMgYmVpbmcgZHJhZ2dlZCAtPiBzdG9wIGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdUYXJnZXQuc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1RhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdUYXJnZXQuY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZXNlbGVjdCB3aW5kb3csIHBhbmVsIGFuZCBpY29uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy53aW5kb3dzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmljb25zWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmljb25zWzBdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBzdGFydCBidXR0b25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0ID09PSBcInN0YXJ0QnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QudG9nZ2xlKFwiUFdELXN0YXJ0LS1oaWRlXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBjbG9jayBidXR0b25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0ID09PSBcImNsb2NrQnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbG9jay5jbGFzc0xpc3QudG9nZ2xlKFwiUFdELWNsb2NrLS1oaWRlXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIGEgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIE15V2luZG93KSB7XHJcbiAgICAgICAgICAgIGxldCBwd2RXaW5kb3cgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBjbG9zZSBidXR0b24gLT4gY2xvc2UgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd0Nsb3NlRGl2ID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19jbG9zZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dDbG9zZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZihwd2RXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNsb3NlV2luZG93KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gdGhlIHJlc2l6ZSBidXR0b24gLT4gcmVzaXplIHRoZSB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dSZXNpemVEaXYgPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3Jlc2l6ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dSZXNpemVEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93LnJlc2l6ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgbWluaW1pemUgYnV0dG9uIC0+IG1pbmltaXplIHRoZSB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dNaW5pbWl6ZURpdiA9IHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfbWluaW1pemVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93TWluaW1pemVEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93LnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cuc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gd2luZG93cy5pbmRleE9mKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbaW5kZXhdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIGEgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhbmVsID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGFuZWxzLmluZGV4T2YocGFuZWwpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAocGFuZWwuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0QtYm90dG9tQmFyX3BhbmVsX19jbG9zZVwiKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGNsb3NlV2luZG93KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkYmxjbGlja0V2ZW50KGUpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZmluZFRhcmdldChlLnRhcmdldCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgZGJsY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgbGV0IGljb24gPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTGF1bmNoIHRoZSBhcHBsaWNhdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGljb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxhdW5jaEFwcGxpY2F0aW9uKGljb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb3VzZW1vdmVFdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgdGhlcmUgaXMgYSBkcmFnIHRhcmdldCAtPiB1cGRhdGUgaXRzIHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ1RhcmdldCkge1xyXG4gICAgICAgICAgICBsZXQgZHJhZ1RhcmdldCA9IHRoaXMuZHJhZ1RhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGxldCBwd2RXaWR0aCA9IHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoO1xyXG4gICAgICAgICAgICBsZXQgcHdkSGVpZ2h0ID0gdGhpcy5jb250YWluZXIub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGN1cnNvclggPSBlLnBhZ2VYO1xyXG4gICAgICAgICAgICBsZXQgY3Vyc29yWSA9IGUucGFnZVk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRYID0gZS5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFkgPSBlLm1vdmVtZW50WTtcclxuXHJcbiAgICAgICAgICAgIGRyYWdUYXJnZXQuc2V0SXNEcmFnZ2luZyh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBtb3VzZSBwb2ludGVyIGlzIG91dHNpZGUgd2luZG93IC0+IGRvIG5vdCB1cGRhdGUgdGhlIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoY3Vyc29yWSArIDEwIDwgMCB8fCBjdXJzb3JZID4gcHdkSGVpZ2h0IC0gNDAgLSAxMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnNvclggKyAxMCA8IDAgfHwgY3Vyc29yWCA+IHB3ZFdpZHRoIC0gMTApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRyYWdUYXJnZXQudXBkYXRlUG9zKGRyYWdUYXJnZXQuZ2V0WFBvcygpICsgbW92ZW1lbnRYLCBkcmFnVGFyZ2V0LmdldFlQb3MoKSArIG1vdmVtZW50WSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SISBcIiArIG1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnJpbmcgdGhlIGljb24gd2l0aCB0aGUgZ2l2ZW4gaW5kZXggdG8gdGhlIGZyb250IG9mIHRoZSBpY29ucyBhcnJheVxyXG4gICAgICogQmVpbmcgaW4gZnJvbnQgb2YgdGhlIGFycmF5IG1lYW5zIFwic2VsZWN0ZWRcIlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RJY29uKGluZGV4KSB7XHJcbiAgICAgICAgbGV0IGljb25UZW1wID0gdGhpcy5pY29uc1tpbmRleF07XHJcblxyXG4gICAgICAgIHRoaXMuaWNvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucy51bnNoaWZ0KGljb25UZW1wKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVzZWxlY3QgdGhlIGxhc3QgYWN0aXZlIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5pY29uc1sxXSkge1xyXG4gICAgICAgICAgICB0aGlzLmljb25zWzFdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pY29uc1swXS5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnJpbmdzIHRoZSB3aW5kb3csIHBhbmVsIGFuZCBhcHBsaWNhdGlvbiB3aXRoIHRoZSBnaXZlbiBpbmRleCB0byB0aGUgZnJvbnQgb2YgdGhlaXIgcmVzcGVjdGl2ZSBhcnJheXNcclxuICAgICAqIEJlaW5nIGluIGZyb250IG9mIHRoZSBhcnJheSBtZWFucyBcInNlbGVjdGVkXCJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2VsZWN0V2luZG93UGFuZWxBcHAoaW5kZXgpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBsaWNhdGlvblRlbXAgPSB0aGlzLmFwcGxpY2F0aW9uc1tpbmRleF07XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnVuc2hpZnQoYXBwbGljYXRpb25UZW1wKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHdpbmRvd1RlbXAgPSB0aGlzLndpbmRvd3NbaW5kZXhdO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnVuc2hpZnQod2luZG93VGVtcCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLndpbmRvd3NbMV0pIHtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dzWzFdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhbmVsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHBhbmVsVGVtcCA9IHRoaXMucGFuZWxzW2luZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMudW5zaGlmdChwYW5lbFRlbXApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYW5lbHNbMV0pIHtcclxuICAgICAgICAgICAgdGhpcy5wYW5lbHNbMV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1swXS5zZXRJc1NlbGVjdGVkKHRydWUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHaXZlIHdpbmRvd3Mgei1pbmRleFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcHBsaWNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dzW2ldLmdldENvbnRhaW5lcigpLnN0eWxlLnpJbmRleCA9IHRoaXMuaWNvbnMubGVuZ3RoICsgdGhpcy5hcHBsaWNhdGlvbnMubGVuZ3RoIC0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1ha2Ugc3VyZSBzdGFydCwgY2xvY2sgYW5kIGJvdHRvbSBiYXIgYWx3YXlzIGlzIG9uIHRvcFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCB0b3BaSW5kZXggPSB0aGlzLmFwcGxpY2F0aW9ucy5sZW5ndGggKyB0aGlzLmljb25zLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydC5zdHlsZS56SW5kZXggPSB0b3BaSW5kZXggKyAxO1xyXG4gICAgICAgIHRoaXMuY2xvY2suc3R5bGUuekluZGV4ID0gdG9wWkluZGV4ICsgMTtcclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5zdHlsZS56SW5kZXggPSB0b3BaSW5kZXggKyAyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xvc2UgYSB3aW5kb3cgd2l0aCBhIGdpdmVuIGluZGV4XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNsb3NlV2luZG93KGluZGV4KSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FsbCB0aGUgY2xvc2UgZnVuY3Rpb24gaW1wbGVtZW50ZWQgYnkgZXZlcnkgYXBwbGljYXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uc1tpbmRleF0uY2xvc2UoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlIHRoZSB3aW5kb3cgYW5kIHBhbmVsIGZyb20gdGhlIERPTVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93c1tpbmRleF0uZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLndpbmRvd3NbaW5kZXhdLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNbaW5kZXhdLmdldENvbnRhaW5lcigpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5wYW5lbHNbaW5kZXhdLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlIHRoZSB3aW5kb3csIHBhbmVsIGFuZCBhcHBsaWNhdGlvbiBmcm9tIHRoZWlyIHJlc3BlY3RpdmUgYXJyYXlzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgdGhpcy5wYW5lbHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGVuIGEgcGFuZWwgaXMgcmVtb3ZlZCwgbWFrZSBzdXJlIHRoZSBvdGhlciBwYW5lbHMnIHdpZHRoIGlzIGNvcnJlY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICAgY2FsY3VsYXRlUGFuZWxzV2lkdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGEgZ2l2ZW4gdGFyZ2V0IGV4aXN0cyBpbiBhIHdpbmRvdywgcGFuZWwgb3IgaWNvblxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmaW5kVGFyZ2V0KHRhcmdldCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0QnV0dG9uLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwic3RhcnRCdXR0b25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0LmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwic3RhcnRcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb2NrQnV0dG9uLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2xvY2tCdXR0b25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb2NrLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2xvY2tcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIHdpbmRvd3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbiBhIHdpbmRvdyAtPiBtYXJrIHRoZSB3aW5kb3cgYW5kIHRoZSBwYW5lbCBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMud2luZG93c1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53aW5kb3dzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSBwYW5lbHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIGluIGEgcGFuZWwgLT4gbWFyayB0aGUgcGFuZWwgYW5kIHRoZSB3aW5kb3cgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYW5lbHNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIGljb25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb24gLT4gbWFyayB0aGUgaWNvbiBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWNvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZXJlIGlzIG5vIHRhcmdldCAtPiByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHdpZHRoIG9mIHRoZSBwYW5lbHMsIG1ha2luZyBzdXJlIGFsbCBwYW5lbHMgZml0IGluIHRoZSBib3R0b20gYmFyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVBhbmVsc1dpZHRoKCkge1xyXG4gICAgICAgIGxldCBwYW5lbFdpZHRoID0gMTg4ICogdGhpcy5wYW5lbHMubGVuZ3RoICsgMTAwO1xyXG5cclxuICAgICAgICBsZXQgcHdkV2lkdGggPSB0aGlzLmNvbnRhaW5lci5vZmZzZXRXaWR0aDtcclxuXHJcbiAgICAgICAgaWYgKHBhbmVsV2lkdGggPiBwd2RXaWR0aCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFuZWxFbGVtID0gdGhpcy5wYW5lbHNbaV0uZ2V0Q29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFuZWxFbGVtLnN0eWxlLndpZHRoID0gdGhpcy5wYW5lbHNXcmFwcGVyLm9mZnNldFdpZHRoIC8gdGhpcy5wYW5lbHMubGVuZ3RoIC0gOCArIFwicHhcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExhdW5jaCBhbiBhcHBsaWNhdGlvbiwgd2luZG93IGFuZCBwYW5lbCB1c2luZyB0aGUgbWV0YSBkYXRhIGluIGEgZ2l2ZW4gaWNvbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbGF1bmNoQXBwbGljYXRpb24oaWNvbk9iaikge1xyXG4gICAgICAgIGxldCBpZCA9IHRoaXMud2luZG93cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZSBhIG5ldyB3aW5kb3cgdG8gbGF1bmNoIHRoZSBhcHBsaWNhdGlvbiBpblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwd2RXaW5kb3cgPSBuZXcgTXlXaW5kb3coe1xyXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMud2luZG93Q291bnRlcixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IGljb25PYmouZ2V0V2luZG93U2l6ZSgpLFxyXG4gICAgICAgICAgICBcInRvcEJhclRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcInRvcEJhckljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKSxcclxuICAgICAgICAgICAgXCJ6SW5kZXhcIjogdGhpcy5pY29ucy5sZW5ndGgsXHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZENvbG9yXCIgOiBpY29uT2JqLmdldEJhY2tncm91bmRDb2xvcigpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93cy5wdXNoKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBldmVyeSB3aW5kb3cgdGhlcmUgaXMgYWxzbyBhIHBhbmVsIGluIHRoZSBib3R0b20gYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFBhbmVsID0gbmV3IFBhbmVsKHtcclxuICAgICAgICAgICAgXCJ0ZXh0XCI6IGljb25PYmouZ2V0SWNvblRleHQoKSxcclxuICAgICAgICAgICAgXCJpY29uXCI6IGljb25PYmouZ2V0SWNvbkltYWdlKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMucHVzaChwd2RQYW5lbCk7XHJcblxyXG4gICAgICAgIHRoaXMucGFuZWxzV3JhcHBlci5hcHBlbmRDaGlsZChwd2RQYW5lbC5nZXRDb250YWluZXIoKSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gYSBuZXcgcGFuZWwgaXMgbWFkZSwgbWFrZSBzdXJlIHdpZHRoIGlzIGNvcnJlY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBjYWxjdWxhdGVQYW5lbHNXaWR0aCgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgYXBwbGljYXRpb25OYW1lID0gaWNvbk9iai5nZXRBcHBsaWNhdGlvbk5hbWUoKTtcclxuXHJcbiAgICAgICAgbGV0IGFwcGxpY2F0aW9uT2JqID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAoYXBwbGljYXRpb25OYW1lID09PSBcIk1lbW9yeVwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IE1lbW9yeSh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLndpbmRvd0NvdW50ZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcHBsaWNhdGlvbk5hbWUgPT09IFwiQ2hhdFwiKSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uT2JqID0gbmV3IENoYXQoe1xyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJcIjogXCIjUFdELXdpbmRvd19jb250ZW50LVwiICsgdGhpcy53aW5kb3dDb3VudGVyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXBwbGljYXRpb25OYW1lID09PSBcIlNldHRpbmdzXCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgU2V0dGluZ3Moe1xyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJcIjogXCIjUFdELXdpbmRvd19jb250ZW50LVwiICsgdGhpcy53aW5kb3dDb3VudGVyLFxyXG4gICAgICAgICAgICAgICAgXCJhcGlcIjogZ2V0QXBpKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWFwcGxpY2F0aW9uT2JqIGluc3RhbmNlb2YgQXBwbGljYXRpb24pIHtcclxuICAgICAgICAgICAgZXJyb3IoXCJUaGUgYXBwbGljYXRpb24gaXMgbm90IGFuIGluc3RhbmNlIG9mIEFwcGxpY2F0aW9uLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnB1c2goYXBwbGljYXRpb25PYmopO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGVuIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIGhhcyBub3cgYmVlbiBtYWRlIC0+IG1ha2UgdGhlbSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNlbGVjdFdpbmRvd1BhbmVsQXBwKHRoaXMuYXBwbGljYXRpb25zLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd0NvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBBUEkgaXMgdXNlZCBieSBhcHBsaWNhdGlvbnMgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgUFdEXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldEFwaSgpIHtcclxuICAgICAgICBpZiAodGhpcy5hcGkgaW5zdGFuY2VvZiBNeUFQSSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcGk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgQVBJIGlzIHByb3ZpZGVkIHNvbWUgc2V0dGluZ3NcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFwaSA9IG5ldyBNeUFQSSh7XHJcbiAgICAgICAgICAgIFwicHdkQ29udGFpbmVyXCI6IHRoaXMuY29udGFpbmVyXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmFwaTtcclxuICAgIH1cclxufVxyXG5cclxuUFdELnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQV0Q7XHJcbiIsImZ1bmN0aW9uIFBhbmVsKHNldHRpbmdzID0ge30pIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICB0aGlzLnRleHQgPSBzZXR0aW5ncy50ZXh0ID8gc2V0dGluZ3MudGV4dCA6IFwibm8gdGV4dFwiO1xyXG5cclxuICAgIHRoaXMuaWNvbiA9IHNldHRpbmdzLmljb24gPyBzZXR0aW5ncy5pY29uIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHNldHRpbmdzLmlzU2VsZWN0ZWQgPyBzZXR0aW5ncy5pc1NlbGVjdGVkIDogZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuaHJlZiA9IFwiI1wiO1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxcIik7XHJcblxyXG4gICAgbGV0IGljb25FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIGljb25FbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbjtcclxuICAgIGljb25FbGVtLmFsdCA9IFwiSWNvblwiO1xyXG4gICAgaWNvbkVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxfX2ljb25cIik7XHJcblxyXG4gICAgbGV0IHNwYW5FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBzcGFuRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9fc3BhblwiKTtcclxuICAgIHNwYW5FbGVtLnRleHRDb250ZW50ID0gdGhpcy50ZXh0O1xyXG5cclxuICAgIGxldCBjbG9zZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIGNsb3NlRWxlbS5ocmVmID0gXCIjXCI7XHJcbiAgICBjbG9zZUVsZW0uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfcGFuZWxfX2Nsb3NlXCIpO1xyXG4gICAgY2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tY2xvc2Utcm91bmRcIik7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkVsZW0pO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc3BhbkVsZW0pO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoY2xvc2VFbGVtKTtcclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLmdldElzU2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWQ7XHJcbn1cclxuXHJcblBhbmVsLnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsO1xyXG4iLCJjb25zdCBQV0QgPSByZXF1aXJlKFwiLi9QV0QuanNcIik7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcHdkID0gbmV3IFBXRCh7XCJjb250YWluZXJcIjogXCJib2R5XCJ9KTtcclxufSk7XHJcbiIsImZ1bmN0aW9uIENoYXQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCJubyBjb250YWluZXJcIjtcclxuXHJcbiAgICB0aGlzLnVzZXJuYW1lID0gc2V0dGluZ3MudXNlcm5hbWUgPyBzZXR0aW5ncy51c2VybmFtZSA6IFwic2ltb25cIjtcclxuXHJcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiKTtcclxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIHNvY2tldE9wZW5FdmVudCk7XHJcbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBzb2NrZXRNZXNzYWdlRXZlbnQpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gTmFtZSBjaGFuZ2UgZGl2XHJcbiAgICBsZXQgbmFtZUNoYW5nZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBuYW1lQ2hhbmdlRGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0TmFtZUNoYW5nZVwiKTtcclxuXHJcbiAgICBsZXQgbmFtZUNoYW5nZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIG5hbWVDaGFuZ2VTcGFuLnRleHRDb250ZW50ID0gXCJVc2VybmFtZTogXCIgKyB0aGlzLnVzZXJuYW1lO1xyXG5cclxuICAgIGxldCBuYW1lQ2hhbmdlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIG5hbWVDaGFuZ2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5hbWVDaGFuZ2VFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIG5hbWVDaGFuZ2VCdXR0b24udGV4dENvbnRlbnQgPSBcIkNoYW5nZSBuYW1lXCI7XHJcblxyXG4gICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlU3Bhbik7XHJcbiAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VCdXR0b24pO1xyXG5cclxuICAgIGxldCBuYW1lQ2hhbmdlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcblxyXG4gICAgLy8gTWVzc2FnZXMgZGl2XHJcbiAgICBsZXQgbWVzc2FnZXNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbWVzc2FnZXNEaXYuY2xhc3NMaXN0LmFkZChcImNoYXRNZXNzYWdlc1wiKTtcclxuXHJcbiAgICAvLyBJbnB1dCBmb3JtXHJcbiAgICBsZXQgaW5wdXREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZnJvbVwiKTtcclxuICAgIGlucHV0RGl2LmNsYXNzTGlzdC5hZGQoXCJjaGF0SW5wdXRcIik7XHJcblxyXG4gICAgLy8gVGV4dGFyZWEgaW4gdGhlIGlucHV0IGRpdlxyXG4gICAgbGV0IGlucHV0RGl2X3RleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dF90ZXh0YXJlYVwiKTtcclxuICAgIGlucHV0RGl2X3RleHRhcmVhLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIGlucHV0RGl2X3RleHRhcmVhLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiV2FpdGluZyBmb3IgY29ubmVjdGlvbi4uLlwiKTtcclxuICAgIGlucHV0RGl2X3RleHRhcmVhLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0ZXh0YXJlYUV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgaW5wdXREaXYuYXBwZW5kQ2hpbGQoaW5wdXREaXZfdGV4dGFyZWEpO1xyXG5cclxuICAgIC8vIEJ1dHRvbiBpbiB0aGUgaW5wdXQgZGl2XHJcbiAgICBsZXQgaW5wdXREaXZfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBpbnB1dERpdl9idXR0b24uY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dF9idXR0b25cIik7XHJcbiAgICBpbnB1dERpdl9idXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBpbnB1dERpdl9idXR0b24udGV4dENvbnRlbnQgPSBcIlNlbmRcIjtcclxuICAgIGlucHV0RGl2LmFwcGVuZENoaWxkKGlucHV0RGl2X2J1dHRvbik7XHJcblxyXG4gICAgLy8gQ2hhdCB3cmFwcGVyXHJcbiAgICBsZXQgY2hhdFdyYXBwZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcImNoYXRXcmFwcGVyXCIpO1xyXG5cclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VEaXYpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVzc2FnZXNEaXYpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoaW5wdXREaXYpO1xyXG5cclxuICAgIC8vIENvbnRhaW5lciBkaXZcclxuICAgIGxldCBjb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBjb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNvY2tldE9wZW5FdmVudChlKSB7XHJcbiAgICAgICAgaW5wdXREaXZfdGV4dGFyZWEuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBpbnB1dERpdl90ZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBcIkVudGVyIG1lc3NhZ2VcIik7XHJcblxyXG4gICAgICAgIGlucHV0RGl2X2J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNvY2tldE1lc3NhZ2VFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnR5cGUgPT09IFwiaGVhcnRiZWF0XCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNoYXRNZXNzYWdlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi5jbGFzc0xpc3QuYWRkKFwiY2hhdE1lc3NhZ2VcIik7XHJcblxyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSBcIltcIiArIHJlc3BvbnNlLnR5cGUgKyBcIl0gXCI7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IHJlc3BvbnNlLnVzZXJuYW1lICsgXCI6IFwiO1xyXG4gICAgICAgIGNoYXRNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCArPSByZXNwb25zZS5kYXRhO1xyXG5cclxuICAgICAgICBtZXNzYWdlc0Rpdi5hcHBlbmRDaGlsZChjaGF0TWVzc2FnZVNwYW4pO1xyXG5cclxuICAgICAgICBtZXNzYWdlc0Rpdi5zY3JvbGxUb3AgPSBtZXNzYWdlc0Rpdi5zY3JvbGxIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbmFtZUNoYW5nZUV2ZW50KGUpIHtcclxuICAgICAgICBuYW1lQ2hhbmdlRGl2LnRleHRDb250ZW50ID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKG5hbWVDaGFuZ2VJbnB1dC52YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VJbnB1dCk7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgbmFtZUNoYW5nZUlucHV0LnZhbHVlID0gdGhpcy51c2VybmFtZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJuYW1lID0gbmFtZUNoYW5nZUlucHV0LnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjaGF0VXNlcm5hbWVcIiwgdGhpcy51c2VybmFtZSk7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlSW5wdXQudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgbmFtZUNoYW5nZVNwYW4udGV4dENvbnRlbnQgPSBcIlVzZXJuYW1lOiBcIiArIHRoaXMudXNlcm5hbWU7XHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZVNwYW4pO1xyXG5cclxuICAgICAgICAgICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlQnV0dG9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnV0dG9uRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGlucHV0RGl2X3RleHRhcmVhLnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIgfHwgdmFsdWUgPT09IFwiXFxuXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNdXN0IGVudGVyIGEgbWVzc2FnZSFcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dERpdl90ZXh0YXJlYS52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiIDogdmFsdWUsXHJcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdGhpcy51c2VybmFtZSxcclxuICAgICAgICAgICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRleHRhcmVhRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHByZXNzaW5nIGVudGVyIGFuZCBzaGlmdCBpcyBub3QgcHJlc3NlZCAtPiBjbGljayBidXR0b25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAxMyAmJiAhZS5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpbnB1dERpdl9idXR0b24uY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbkNoYXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcclxuIiwiY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vQXBwbGljYXRpb24uanNcIik7XHJcbmNvbnN0IENoYXQgPSByZXF1aXJlKFwiLi9DaGF0LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ2hhdFN0YXJ0KHNldHRpbmdzID0ge30pIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCJubyBjb250YWluZXJcIjtcclxuXHJcbiAgICB0aGlzLmNoYXRPYmogPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBXcmFwcGVyXHJcbiAgICBsZXQgY2hhdFdyYXBwZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcImNoYXRXcmFwcGVyXCIpO1xyXG5cclxuICAgIC8vIENoYXQgc3RhcnQgaGVhZGVyXHJcbiAgICBsZXQgY2hhdFN0YXJ0SGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNoYXRTdGFydEhlYWRlci5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0SGVhZGVyXCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdFN0YXJ0SGVhZGVyKTtcclxuXHJcbiAgICBsZXQgY2hhdFN0YXJ0SGVhZGVyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyU3Bhbi50ZXh0Q29udGVudCA9IFwiU1VQRVJDSEFUXCI7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXIuYXBwZW5kQ2hpbGQoY2hhdFN0YXJ0SGVhZGVyU3Bhbik7XHJcblxyXG4gICAgLy8gQ2hhdCBuYW1lIGlucHV0XHJcbiAgICBsZXQgY2hhdE5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIC8vIGZpeCB0byBtYWtlIGlucHV0IHNlbGVjdGFibGVcclxuICAgIGNoYXROYW1lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNsaWNrKCk7XHJcbiAgICB9KTtcclxuICAgIGNoYXROYW1lSW5wdXQuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgXCJFbnRlciBuYW1lIVwiKTtcclxuICAgIGNoYXROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZChcImNoYXRTdGFydE5hbWVJbnB1dFwiKTtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXROYW1lSW5wdXQpO1xyXG5cclxuICAgIC8vIENoYXQgbmFtZSBidXR0b25cclxuICAgIGxldCBjaGF0TmFtZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0TmFtZUJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XHJcbiAgICBjaGF0TmFtZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU3RhcnQgY2hhdHRpbmchXCI7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0TmFtZUJ1dHRvbik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyIGRpdlxyXG4gICAgbGV0IGNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIGNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBhIHVzZXJuYW1lIGV4aXN0cyBpbiBsb2NhbCBzdG9yYWdlIC0+IHN0YXJ0IGNoYXRcclxuICAgICAqL1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2hhdFVzZXJuYW1lXCIpKSB7XHJcbiAgICAgICAgc2V0dGluZ3MudXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNoYXRVc2VybmFtZVwiKTtcclxuXHJcbiAgICAgICAgY2hhdFdyYXBwZXJEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhdE9iaiA9IG5ldyBDaGF0KHNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBidXR0b25FdmVudCgpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBjaGF0TmFtZUlucHV0LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbnRlciBhIG5hbWUhXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjaGF0VXNlcm5hbWVcIiwgdmFsdWUpO1xyXG5cclxuICAgICAgICBzZXR0aW5ncy51c2VybmFtZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBjaGF0V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGF0T2JqID0gbmV3IENoYXQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGF0U3RhcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBsaWNhdGlvbi5wcm90b3R5cGUpO1xyXG5DaGF0U3RhcnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2hhdFN0YXJ0O1xyXG5cclxuQ2hhdFN0YXJ0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJDbG9zaW5nIENoYXQgYXBwbGljYXRpb24uLi5cIik7XHJcblxyXG4gICAgaWYgKHRoaXMuY2hhdE9iaikge1xyXG4gICAgICAgIHRoaXMuY2hhdE9iai5jbG9zZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXRTdGFydDtcclxuIiwiZnVuY3Rpb24gQ2FyZCh2YWx1ZSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICB0aGlzLmlzRmxpcHBlZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuaXNDb21wbGV0ZSA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgbGV0IGNhcmRUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q2FyZFRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IGNhcmRUZW1wbGF0ZUZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKGNhcmRUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICAvLyBUaGUgY2FyZEVsZW0gaXMgdGhlIGVsZW1lbnQgd3JhcHBpbmcgdGhlIHR3byBpbWFnZXNcclxuICAgIHRoaXMuY2FyZEVsZW0gPSBjYXJkVGVtcGxhdGVGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRcIik7XHJcbiAgICB0aGlzLmNhcmRFbGVtLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgdGhpcy52YWx1ZSk7XHJcblxyXG4gICAgLy8gVGhlIGNvdmVySW1hZ2UgaXMgdGhlIHF1ZXN0aW9uIG1hcmsgYWJvdmUgdGhlIGNhcmQgaW1hZ2VcclxuICAgIHRoaXMuY292ZXJJbWFnZSA9IHRoaXMuY2FyZEVsZW0ucXVlcnlTZWxlY3RvcihcIi5NZW1vcnktY2FyZF9iYWNrXCIpO1xyXG4gICAgdGhpcy5jb3ZlckltYWdlLnNyYyA9IFwiaW1hZ2UvTWVtb3J5L1wiICsgdGhpcy52YWx1ZVswXSArIFwiLnBuZ1wiO1xyXG5cclxuICAgIC8vIFRoZSBjYXJkSW1hZ2UgaXMgdGhlIGltYWdlIG9mIHRoZSBtZW1vcnkgY2FyZFxyXG4gICAgdGhpcy5jYXJkSW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LWNhcmRfZnJvbnRcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSB1bmlxdWUgdmFsdWUgZm9yIHRoaXMgY2FyZFxyXG4gKiBUaGUgY2FyZCBpZGVudGlmaWVyXHJcbiAqL1xyXG5DYXJkLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGbGlwcyB0aGUgY2FyZFxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZmxpcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMuaXNGbGlwcGVkKSB7XHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJNZW1vcnktY2FyZC0tZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5hZGQoXCJNZW1vcnktY2FyZC0tYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwiTWVtb3J5LWNhcmQtLWJhY2tmbGlwXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoXCJNZW1vcnktY2FyZC0tYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QuYWRkKFwiTWVtb3J5LWNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcIk1lbW9yeS1jYXJkLS1mbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRmxpcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmdldElzRmxpcHBlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNGbGlwcGVkO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5zZXRJc0NvbXBsZXRlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNDb21wbGV0ZSA9IHZhbHVlO1xyXG59XHJcblxyXG5DYXJkLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xyXG4gICAgdGhpcy5jYXJkRWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmdldENhcmRFbGVtID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYXJkRWxlbTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkO1xyXG4iLCJjb25zdCBDYXJkID0gcmVxdWlyZShcIi4vQ2FyZC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIENhcmRzKG5yT2ZDYXJkcykge1xyXG4gICAgdGhpcy5jYXJkcyA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSBjYXJkc1xyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG5yT2ZDYXJkcyArIDE7IGkrKykge1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDEpKTtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3IENhcmQoaSArIFwiXCIgKyAyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaHVmZmxlIHRoZSBjYXJkc1xyXG4gICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gdGhpcy5jYXJkcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICBsZXQgdGVtcCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgdGhpcy5jYXJkc1tpXSA9IHRoaXMuY2FyZHNbal07XHJcbiAgICAgICAgdGhpcy5jYXJkc1tqXSA9IHRlbXA7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBjYXJkIHdpdGggdGhlIGdpdmVuIHZhbHVlXHJcbiAqL1xyXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICBsZXQgY2FyZDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5jYXJkc1tpXS5nZXRWYWx1ZSgpID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBjYXJkID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIGZyYWdtZW50IGNvbnRhaW5pbmcgdGhlIGNhcmQgZGl2cyBhbmQgaW1hZ2VzXHJcbiAqL1xyXG5DYXJkcy5wcm90b3R5cGUuZ2V0Q2FyZHNGcmFnID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY2FyZHNGcmFnID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY2FyZEVsZW0gPSB0aGlzLmNhcmRzW2ldLmdldENhcmRFbGVtKCk7XHJcbiAgICAgICAgY2FyZHNGcmFnLmFwcGVuZENoaWxkKGNhcmRFbGVtKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZHNGcmFnO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmRzO1xyXG4iLCJjb25zdCBBcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi9BcHBsaWNhdGlvbi5qc1wiKTtcclxuY29uc3QgTWVtb3J5R2FtZUJvYXJkID0gcmVxdWlyZShcIi4vTWVtb3J5R2FtZUJvYXJkLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTWVtb3J5R2FtZShzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwiIzEyM1wiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgLy8gV3JhcHBlclxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V3JhcHBlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlXcmFwcGVyVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVdyYXBwZXJEaXYgPSBtZW1vcnlXcmFwcGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS13cmFwcGVyXCIpO1xyXG5cclxuICAgIC8vIEhlYWRlclxyXG4gICAgbGV0IG1lbW9yeUhlYWRlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlIZWFkZXJUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlIZWFkZXJGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlIZWFkZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyID0gbWVtb3J5SGVhZGVyRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUhlYWRlclwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5SGVhZGVyKTtcclxuXHJcbiAgICAvLyBQYWlyIGZvcm1cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybVRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpckZvcm1UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm0gPSBtZW1vcnlQYWlyRm9ybUZyYWcucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybVwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5UGFpckZvcm0pO1xyXG5cclxuICAgIC8vIFJhZGlvIGlucHV0c1xyXG4gICAgbGV0IG1lbW9yeVBhaXJSYWRpb1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZVwiKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSA4OyBpKyspIHtcclxuICAgICAgICBsZXQgbWVtb3J5UGFpclJhZGlvRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVtb3J5UGFpclJhZGlvVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyTGFiZWwgPSBtZW1vcnlQYWlyUmFkaW9GcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5UGFpclJhZGlvTGFiZWxcIik7XHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJSYWRpbyA9IG1lbW9yeVBhaXJMYWJlbC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhaXJMYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpICsgXCIgcGFpcnNcIikpO1xyXG4gICAgICAgIC8vIEZpeCB0byBtYWtlIHJhZGlvIGlucHV0cyBjbGlja2FibGVcclxuICAgICAgICBtZW1vcnlQYWlyTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1lbW9yeVBhaXJSYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFpckZvcm0uYXBwZW5kQ2hpbGQobWVtb3J5UGFpckxhYmVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGb3JtIGJ1dHRvblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b25GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyRm9ybUJ1dHRvblRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvbiA9IG1lbW9yeVBhaXJGb3JtQnV0dG9uRnJhZy5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xyXG4gICAgbWVtb3J5UGFpckZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQpO1xyXG5cclxuICAgIG1lbW9yeVBhaXJGb3JtLmFwcGVuZENoaWxkKG1lbW9yeVBhaXJGb3JtQnV0dG9uKTtcclxuXHJcbiAgICAvLyBDb250YWluZXJcclxuICAgIGxldCBtZW1vcnlDb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBtZW1vcnlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbWVtb3J5UGFpckZvcm1CdXR0b25FdmVudCgpIHtcclxuICAgICAgICBsZXQgbnJPZlBhaXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlQYWlyRm9ybSBpbnB1dDpjaGVja2VkXCIpLnZhbHVlO1xyXG5cclxuICAgICAgICBtZW1vcnlXcmFwcGVyRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgICAgIHNldHRpbmdzLm5yT2ZQYWlycyA9IHBhcnNlSW50KG5yT2ZQYWlycyk7XHJcbiAgICAgICAgbmV3IE1lbW9yeUdhbWVCb2FyZChzZXR0aW5ncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1lbW9yeUdhbWUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBsaWNhdGlvbi5wcm90b3R5cGUpO1xyXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1lbW9yeUdhbWU7XHJcblxyXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJDbG9zaW5nIE1lbW9yeSBhcHBsaWNhdGlvbi4uLlwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnlHYW1lO1xyXG4iLCJjb25zdCBDYXJkcyA9IHJlcXVpcmUoXCIuL0NhcmRzLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTWVtb3J5R2FtZUJvYXJkKHNldHRpbmdzKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IFwiI2Nvb2xcIjtcclxuXHJcbiAgICBsZXQgbnJPZlBhaXJzID0gc2V0dGluZ3MubnJPZlBhaXJzID8gc2V0dGluZ3MubnJPZlBhaXJzIDogNDtcclxuXHJcbiAgICBsZXQgY2FyZHMgPSBuZXcgQ2FyZHMobnJPZlBhaXJzKTtcclxuXHJcbiAgICBsZXQgc2NvcmUgPSAwO1xyXG5cclxuICAgIGxldCBnYW1lVGltZXIgPSAwO1xyXG5cclxuICAgIGxldCBhdHRlbXB0cyA9IDA7XHJcblxyXG4gICAgbGV0IGZpcnN0Q2FyZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgc2Vjb25kQ2FyZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBnYW1lVGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKHRpbWVyLCAxMDAwKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVMZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIE1lbW9yeSB3cmFwcGVyXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlclRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlXcmFwcGVyVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVdyYXBwZXJUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IG1lbW9yeVdyYXBwZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIuTWVtb3J5LXdyYXBwZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZW1vcnlXcmFwcGVyQ2xpY2tFdmVudCk7XHJcblxyXG4gICAgLy8gSGVhZGVyXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUhlYWRlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUhlYWRlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUhlYWRlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlIZWFkZXIgPSBtZW1vcnlIZWFkZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5SGVhZGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBwYW5lbFxyXG4gICAgbGV0IG1lbW9yeVBhbmVsVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYW5lbFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYW5lbERpdiAgICAgICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1wYW5lbFwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbEF0dGVtcHRzU3BhbiA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsVGltZVNwYW4gICAgID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFuZWxUaW1lU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsTWVzc2FnZVNwYW5cIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeVBhbmVsRGl2KTtcclxuXHJcbiAgICAvLyBNZW1vcnkgY2FyZHNcclxuICAgIGxldCBtZW1veUNhcmRzVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUNhcmRzVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5Q2FyZHNGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlDYXJkc1RlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlDYXJkc0RpdiA9IG1lbW9yeUNhcmRzRnJhZy5xdWVyeVNlbGVjdG9yKFwiLk1lbW9yeS1jYXJkc1wiKTtcclxuICAgIG1lbW9yeUNhcmRzRGl2LmFwcGVuZENoaWxkKGNhcmRzLmdldENhcmRzRnJhZygpKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5Q2FyZHNEaXYpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBjb250YWluZXJcclxuICAgIGxldCBtZW1vcnlDb250YWluZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICBtZW1vcnlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdGltZXIoKSB7XHJcbiAgICAgICAgZ2FtZVRpbWVyICs9IDE7XHJcblxyXG4gICAgICAgIG1lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuLnRleHRDb250ZW50ID0gXCJBdHRlbXB0czogXCIgKyBhdHRlbXB0cztcclxuICAgICAgICBtZW1vcnlQYW5lbFRpbWVTcGFuLnRleHRDb250ZW50ID0gXCJUaW1lOiBcIiArIGdhbWVUaW1lciArIFwiIHNlY29uZHNcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtZW1vcnlXcmFwcGVyQ2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBpcyBjdXJyZW50bHkgY2hlY2tpbmcgYW5zd2VyIC0+IGV4aXQgZnVuY3Rpb25cclxuICAgICAgICAgKiAod2FpdGluZyBmb3IgdGltZXIgdG8gZmluaXNoKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChpc0NoZWNraW5nQW5zd2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbWdFbGVtID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIGxldCBhRWxlbSA9IGltZ0VsZW0ubm9kZU5hbWUgPT09IFwiSU1HXCIgPyBpbWdFbGVtLnBhcmVudE5vZGUgOiBpbWdFbGVtO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWUgPSBhRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIpO1xyXG5cclxuICAgICAgICBsZXQgY2FyZCA9IGNhcmRzLmdldENhcmQodmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoY2FyZCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5nZXRJc0ZsaXBwZWQoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuZmxpcCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChmaXJzdENhcmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0Q2FyZCA9IGNhcmQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlY29uZENhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGVja0Fuc3dlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrQW5zd2VyKCkge1xyXG4gICAgICAgIGlzQ2hlY2tpbmdBbnN3ZXIgPSB0cnVlO1xyXG5cclxuICAgICAgICBhdHRlbXB0cyArPSAxO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpcnN0Q2FyZC5nZXRWYWx1ZSgpWzBdID09PSBzZWNvbmRDYXJkLmdldFZhbHVlKClbMF0pIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5zZXRJc0NvbXBsZXRlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQ2FyZC5zZXRJc0NvbXBsZXRlKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5hZGRDbGFzcyhcIk1lbW9yeS1jYXJkLS1jb3JyZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQ2FyZC5hZGRDbGFzcyhcIk1lbW9yeS1jYXJkLS1jb3JyZWN0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3JlICs9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJZiBzY29yZSBpcyBlcXVhbCB0byBtYXhpbXVtIGFtb3VudCBvZiBwYWlycyAtPiB0aGUgZ2FtZSBpcyBjb21wbGV0ZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcmUgPT09IG5yT2ZQYWlycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZVRpbWVySW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeVBhbmVsTWVzc2FnZVNwYW4udGV4dENvbnRlbnQgPSBcIllvdSBjb21wbGV0ZWQgdGhlIGdhbWUhXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuZmxpcCgpO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQ2FyZC5mbGlwKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpcnN0Q2FyZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgc2Vjb25kQ2FyZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9LCAyMDAwKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnlHYW1lQm9hcmQ7XHJcbiIsImNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4uLy4uL0FwcGxpY2F0aW9uLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gU2V0dGluZ3Moc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgQXBwbGljYXRpb24uY2FsbCh0aGlzLCB7XHJcbiAgICAgICBcImFwaVwiOiBzZXR0aW5ncy5hcGlcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy53aW5kb3dEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuY29udGFpbmVyKTtcclxuICAgIHRoaXMud2luZG93RGl2LmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc1dyYXBwZXJcIik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCYWNrZ3JvdW5kXHJcbiAgICAgKi9cclxuICAgIHRoaXMuYmFja2dyb3VuZFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB0aGlzLmJhY2tncm91bmRUaXRsZS50ZXh0Q29udGVudCA9IFwiQ2hhbmdlIGJhY2tncm91bmRcIjtcclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmRGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XHJcbiAgICB0aGlzLmJhY2tncm91bmRGb3JtLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc0JhY2tncm91bmRGb3JtXCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGZvcm1MYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICBmb3JtTGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwiYmFja2dyb3VuZEZvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XHJcblxyXG4gICAgICAgIGxldCBmb3JtUmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYWRpb1wiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJiYWNrZ3JvdW5kXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImJhY2tncm91bmRGb3JtXCIgKyB0aGlzLmNvbnRhaW5lciArIGkpO1xuXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1haW5fYmFja2dyb3VuZFwiKSA9PT0gXCJtYWluLS1iYWNrZ3JvdW5kLVwiICsgaSkge1xuICAgICAgICAgICAgZm9ybVJhZGlvLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBmb3JtSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGZvcm1JbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCIuL2ltYWdlL2JhY2tncm91bmRcIiArIGkgKyBcIl9zbWFsbC5qcGdcIik7XHJcbiAgICAgICAgZm9ybUltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkJhY2tncm91bmRcIik7XHJcblxyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtUmFkaW8pO1xyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtSW1hZ2UpO1xyXG5cclxuICAgICAgICB0aGlzLmJhY2tncm91bmRGb3JtLmFwcGVuZENoaWxkKGZvcm1MYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kVGl0bGUpO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJhY2tncm91bmRGb3JtKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgcmVzb2x1dGlvblxyXG4gICAgICovXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgdGhpcy5kaXNwbGF5UmVzVGl0bGUudGV4dENvbnRlbnQgPSBcIkNoYW5nZSBEaXNwbGF5IFJlc29sdXRpb25cIjtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XHJcbiAgICB0aGlzLmRpc3BsYXlSZXNGb3JtLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc0Rpc3BsYXlSZXNGb3JtXCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGZvcm1MYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICBmb3JtTGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwiZGlzcGxheVJlc0Zvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XHJcblxyXG4gICAgICAgIGxldCBmb3JtUmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYWRpb1wiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgaSk7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJkaXNwbGF5UmVzXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImRpc3BsYXlSZXNGb3JtXCIgKyB0aGlzLmNvbnRhaW5lciArIGkpO1xyXG5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYWluX2Rpc3BsYXlSZXNcIikgPT09IFwibWFpbi0tZGlzcGxheVJlcy1cIiArIGkpIHtcclxuICAgICAgICAgICAgZm9ybVJhZGlvLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZvcm1TcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblxyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtUmFkaW8pO1xyXG4gICAgICAgIGZvcm1MYWJlbC5hcHBlbmRDaGlsZChmb3JtU3Bhbik7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheVJlc0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5kaXNwbGF5UmVzV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXlSZXNUaXRsZSk7XHJcbiAgICB0aGlzLmRpc3BsYXlSZXNXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheVJlc0Zvcm0pO1xyXG5cclxuICAgIGxldCBzcGFucyA9IHRoaXMuZGlzcGxheVJlc1dyYXBwZXIucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcbiAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IFwiMTI4MHg3MjBcIjtcclxuICAgIHNwYW5zWzJdLnRleHRDb250ZW50ID0gXCIxNjAweDkwMFwiO1xyXG4gICAgc3BhbnNbM10udGV4dENvbnRlbnQgPSBcIjE5MjB4MTA4MFwiO1xyXG4gICAgc3BhbnNbNF0udGV4dENvbnRlbnQgPSBcIjI0NjB4MTQwMFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2F2ZSBidXR0b25cclxuICAgICAqL1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2V0dGluZ3NCdXR0b25cIik7XHJcbiAgICB0aGlzLnNhdmVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU2F2ZVwiO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzYXZlQnV0dG9uRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgdGhpcy5zZXR0aW5ncyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLnNldHRpbmdzLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc1wiKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzLmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZFdyYXBwZXIpO1xyXG4gICAgdGhpcy5zZXR0aW5ncy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIikpO1xyXG4gICAgdGhpcy5zZXR0aW5ncy5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXlSZXNXcmFwcGVyKTtcclxuICAgIHRoaXMuc2V0dGluZ3MuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpKTtcclxuXHJcbiAgICB0aGlzLndpbmRvd0Rpdi5hcHBlbmRDaGlsZCh0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMud2luZG93RGl2LmFwcGVuZENoaWxkKHRoaXMuc2F2ZUJ1dHRvbik7XHJcblxyXG4gICAgZnVuY3Rpb24gc2F2ZUJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhY2tncm91bmRcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgYmFja2dyb3VuZElucHV0cyA9IHRoaXMuYmFja2dyb3VuZEZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhY2tncm91bmRJbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGJhY2tncm91bmRJbnB1dHNbaV0uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcGkuc2V0UHdkQmFja2dyb3VuZChpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm1haW5fYmFja2dyb3VuZFwiLCBcIm1haW4tLWJhY2tncm91bmQtXCIgKyBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRpc3BsYXlSZXNJbnB1dHMgPSB0aGlzLmRpc3BsYXlSZXNGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwbGF5UmVzSW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5UmVzSW5wdXRzW2ldLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBpLnNldFB3ZERpc3BsYXlSZXNvbHV0aW9uKGkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibWFpbl9kaXNwbGF5UmVzXCIsIFwibWFpbi0tZGlzcGxheVJlcy1cIiArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5TZXR0aW5ncy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XHJcblNldHRpbmdzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNldHRpbmdzO1xyXG5cclxuU2V0dGluZ3MucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NpbmcgU2V0dGluZ3MgYXBwbGljYXRpb24uLi5cIik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XHJcbiJdfQ==
