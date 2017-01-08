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
    this.cardElem = cardTemplateFrag.querySelector(".memoryCard");
    this.cardElem.setAttribute("data-index", this.value);

    // The coverImage is the question mark above the card image
    this.coverImage = this.cardElem.querySelector(".memoryCard__back");
    this.coverImage.src = "image/Memory/" + this.value[0] + ".png";

    // The cardImage is the image of the memory card
    this.cardImage = this.cardElem.querySelector(".memoryCard__front");
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
        this.coverImage.classList.remove("memoryCard--flip");
        this.cardImage.classList.remove("memoryCard--flip");

        this.coverImage.classList.add("memoryCard--backflip");
        this.cardImage.classList.add("memoryCard--backflip");

        this.isFlipped = false;
    } else {
        this.coverImage.classList.remove("memoryCard--backflip");
        this.cardImage.classList.remove("memoryCard--backflip");

        this.coverImage.classList.add("memoryCard--flip");
        this.cardImage.classList.add("memoryCard--flip");

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
    let memoryWrapperDiv = document.querySelector(container);
    memoryWrapperDiv.classList.add("memoryWrapper");

    // Header
    let memoryHeaderTemplate = document.querySelector("#memoryHeaderTemplate");
    let memoryHeaderFrag = document.importNode(memoryHeaderTemplate.content, true);

    let memoryHeader = memoryHeaderFrag.querySelector(".memoryHeader");
    memoryWrapperDiv.appendChild(memoryHeader);

    // Pair form
    let memoryPairFormTemplate = document.querySelector("#memoryPairFormTemplate");
    let memoryPairFormFrag = document.importNode(memoryPairFormTemplate.content, true);

    let memoryPairForm = memoryPairFormFrag.querySelector(".memoryPairForm");
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

    /**
     * Functions
     */
    function memoryPairFormButtonEvent() {
        let nrOfPairs = document.querySelector(".memoryPairForm input:checked").value;

        memoryWrapperDiv.removeChild(memoryHeader);
        memoryWrapperDiv.removeChild(memoryPairForm);

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

    let gameTimer = -1;

    let attempts = 0;

    let firstCard = undefined;

    let secondCard = undefined;

    let isCheckingAnswer = false;

    let gameTimerInterval = setInterval(timer, 1000);

    /**
     * ELements
     */
    // Memory wrapper
    let memoryWrapperDiv = document.querySelector(container);
    memoryWrapperDiv.classList.add("memoryWrapper");
    memoryWrapperDiv.addEventListener("click", memoryWrapperClickEvent);

    // Header
    let memoryHeaderTemplate = document.querySelector("#memoryHeaderTemplate");
    let memoryHeaderFrag = document.importNode(memoryHeaderTemplate.content, true);

    let memoryHeader = memoryHeaderFrag.querySelector(".memoryHeader");
    memoryWrapperDiv.appendChild(memoryHeader);

    // Memory panel
    let memoryPanelTemplate = document.querySelector("#memoryPanelTemplate");
    let memoryPanelFrag = document.importNode(memoryPanelTemplate.content, true);

    let memoryPanelDiv          = memoryPanelFrag.querySelector(".memoryPanel");
    let memoryPanelAttemptsSpan = memoryPanelFrag.querySelector(".memoryPanel__attemptsSpan");
    let memoryPanelTimeSpan     = memoryPanelFrag.querySelector(".memoryPanel__timeSpan");
    let memoryPanelMessageSpan  = memoryPanelFrag.querySelector(".memoryPanel__messageSpan");
    memoryWrapperDiv.appendChild(memoryPanelDiv);

    // Memory cards
    let memoyCardsTemplate = document.querySelector("#memoryCardsTemplate");
    let memoryCardsFrag = document.importNode(memoryCardsTemplate.content, true);

    let memoryCardsDiv = memoryCardsFrag.querySelector(".memoryCards");
    memoryCardsDiv.appendChild(cards.getCardsFrag());
    memoryWrapperDiv.appendChild(memoryCardsDiv);

    timer();

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

                firstCard.addClass("memoryCard--correct");
                secondCard.addClass("memoryCard--correct");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwbGljYXRpb24uanMiLCJjbGllbnQvc291cmNlL2pzL0VudGl0eS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvTXlBUEkuanMiLCJjbGllbnQvc291cmNlL2pzL015V2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZUJvYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL1NldHRpbmdzL1NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNTJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIEV2ZXJ5IGFwcGxpY2F0aW9uIGluIHRoZSBQV0QgbXVzdCBpbXBsZW1lbnQgQXBwbGljYXRpb25cclxuICovXHJcbmZ1bmN0aW9uIEFwcGxpY2F0aW9uKHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuYXBpID0gc2V0dGluZ3MuYXBpID8gc2V0dGluZ3MuYXBpIDogdW5kZWZpbmVkO1xyXG59XHJcblxyXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiV0FSTklORyEgQXBwbGljYXRpb24gbXVzdCBpbXBsZW1lbnQgZnVuY3Rpb24gY2xvc2UuXCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcGxpY2F0aW9uO1xyXG4iLCIvKipcclxuICogV2luZG93IGFuZCBpY29uIGluaGVyaXRzIGZyb20gZW50aXR5XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gRW50aXR5KHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMud2lkdGggPSBzZXR0aW5ncy53aWR0aCA/IHNldHRpbmdzLndpZHRoIDogMTAwO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ID0gc2V0dGluZ3MuaGVpZ2h0ID8gc2V0dGluZ3MuaGVpZ2h0IDogMTAwO1xyXG5cclxuICAgIHRoaXMueFBvcyA9IHNldHRpbmdzLnhQb3MgPyBzZXR0aW5ncy54UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMueVBvcyA9IHNldHRpbmdzLnlQb3MgPyBzZXR0aW5ncy55UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMuekluZGV4ID0gc2V0dGluZ3MuekluZGV4ID8gc2V0dGluZ3MuekluZGV4IDogMDtcclxuXHJcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSBzZXR0aW5ncy5pc1NlbGVjdGVkID8gc2V0dGluZ3MuaXNTZWxlY3RlZCA6IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHNldHRpbmdzLmlzRHJhZ2dpbmcgPyBzZXR0aW5ncy5pc0RyYWdnaW5nIDogZmFsc2U7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLndpZHRoO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFhQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnhQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0WVBvcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueVBvcztcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS51cGRhdGVQb3MgPSBmdW5jdGlvbih4UG9zLCB5UG9zKSB7XHJcbiAgICB0aGlzLnhQb3MgPSB4UG9zO1xyXG4gICAgdGhpcy55UG9zID0geVBvcztcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldElzU2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWQ7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuc2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcImRyYWdnaW5nXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiZHJhZ2dpbmdcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0SXNEcmFnZ2luZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNEcmFnZ2luZztcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoXCIuL0VudGl0eS5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIEljb24oc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgRW50aXR5LmNhbGwodGhpcywge1xyXG4gICAgICAgIFwieFBvc1wiOiBzZXR0aW5ncy54UG9zLFxyXG4gICAgICAgIFwieVBvc1wiOiBzZXR0aW5ncy55UG9zLFxyXG4gICAgICAgIFwiekluZGV4XCI6IHNldHRpbmdzLnpJbmRleCxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pY29uVGV4dCAgICAgICAgPSBzZXR0aW5ncy5pY29uVGV4dCA/IHNldHRpbmdzLmljb25UZXh0IDogXCJObyBpY29uIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLndpZHRoICAgICAgICAgICA9IHNldHRpbmdzLndpZHRoID8gc2V0dGluZ3Mud2lkdGggOiAxMDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCAgICAgICAgICA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDEwO1xyXG5cclxuICAgIHRoaXMuYXBwbGljYXRpb25OYW1lID0gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lID8gc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lIDogXCJcIjtcclxuXHJcbiAgICB0aGlzLmljb25JbWFnZSAgICAgICA9IHNldHRpbmdzLmljb25JbWFnZSA/IHNldHRpbmdzLmljb25JbWFnZSA6IFwiZGVmYXVsdEljb24ucG5nXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplICAgICAgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwic21hbGxcIjtcclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgICAgICAgPSBpbml0aWFsaXplQ29udGFpbmVyLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RHcmlkUG9zaXRpb24oKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplQ29udGFpbmVyKCkge1xyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtaWNvblwiKTtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgICAgICBsZXQgaWNvbkltYWdlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgaWNvbkltYWdlRWxlbS5zcmMgPSBcIi4vaW1hZ2UvXCIgKyB0aGlzLmljb25JbWFnZTtcclxuXHJcbiAgICAgICAgbGV0IGljb25UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgaWNvblRleHQudGV4dENvbnRlbnQgPSB0aGlzLmljb25UZXh0O1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkltYWdlRWxlbSk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25UZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEljb24gaW5oZXJpdHMgZnJvbSBFbnRpdHlcclxuICovXHJcbkljb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuSWNvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJY29uO1xyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0QXBwbGljYXRpb25OYW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hcHBsaWNhdGlvbk5hbWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJY29ucyBhcmUgc3VwcG9zZWQgdG8gYmUgYWxpZ25lZCBpbiBhIGdyaWQgc3lzdGVtLlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGNvcnJlY3RzIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIG9mIHRoZSBpY29uLCBtYWtpbmcgaXQgYWxpZ24gdG8gdGhlIG5lYXJlc3QgZ3JpZFxyXG4gKi9cclxuSWNvbi5wcm90b3R5cGUuY29ycmVjdEdyaWRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy54UG9zID0gdGhpcy54UG9zIC0gdGhpcy54UG9zICUgMTAwO1xyXG4gICAgdGhpcy55UG9zID0gNSArIHRoaXMueVBvcyAtIHRoaXMueVBvcyAlIDEwMDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRCYWNrZ3JvdW5kQ29sb3IgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvblRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmljb25UZXh0O1xyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRJY29uSW1hZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmljb25JbWFnZTtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2luZG93U2l6ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xyXG4iLCIvKipcclxuICogVGhlIEFQSSBpcyBhIHdheSBmb3IgYXBwbGljYXRpb25zIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIFBXRFxyXG4gKi9cclxuZnVuY3Rpb24gTXlBUEkoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5wd2RDb250YWluZXIgPSBzZXR0aW5ncy5wd2RDb250YWluZXIgPyBzZXR0aW5ncy5wd2RDb250YWluZXIgOiB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbk15QVBJLnByb3RvdHlwZS5zZXRQd2RCYWNrZ3JvdW5kID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIGxldCBwcmVmaXggPSBcIm1haW4tLWJhY2tncm91bmQtXCI7XHJcblxyXG4gICAgTXlBUEkucHJvdG90eXBlLnJlbW92ZUNsYXNzZXNXaXRoUHJlZml4KHByZWZpeCwgdGhpcy5wd2RDb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMucHdkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQocHJlZml4ICsgaW5kZXgpO1xyXG59XHJcblxyXG5NeUFQSS5wcm90b3R5cGUuc2V0UHdkRGlzcGxheVJlc29sdXRpb24gPSBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgbGV0IHByZWZpeCA9IFwibWFpbi0tZGlzcGxheVJlcy1cIjtcclxuXHJcbiAgICBNeUFQSS5wcm90b3R5cGUucmVtb3ZlQ2xhc3Nlc1dpdGhQcmVmaXgocHJlZml4LCB0aGlzLnB3ZENvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5wd2RDb250YWluZXIuY2xhc3NMaXN0LmFkZChwcmVmaXggKyBpbmRleCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgY2xhc3NlcyB3aXRoIHByZWZpeFxyXG4gKi9cclxuTXlBUEkucHJvdG90eXBlLnJlbW92ZUNsYXNzZXNXaXRoUHJlZml4ID0gZnVuY3Rpb24ocHJlZml4LCBlbGVtKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW0uY2xhc3NMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0W2ldLmluZGV4T2YocHJlZml4KSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGVsZW0uY2xhc3NMaXN0W2ldKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15QVBJO1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNeVdpbmRvdyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgRW50aXR5LmNhbGwodGhpcywge1xyXG4gICAgICAgIFwieFBvc1wiOiBzZXR0aW5ncy54UG9zLFxyXG4gICAgICAgIFwieVBvc1wiOiBzZXR0aW5ncy55UG9zLFxyXG4gICAgICAgIFwiekluZGV4XCI6IHNldHRpbmdzLnpJbmRleCxcclxuICAgICAgICBcImlzU2VsZWN0ZWRcIjogc2V0dGluZ3MuaXNTZWxlY3RlZCxcclxuICAgICAgICBcImlzRHJhZ2dpbmdcIjogc2V0dGluZ3MuaXNEcmFnZ2luZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pZCA9IHNldHRpbmdzLmlkID8gc2V0dGluZ3MuaWQgOiAwO1xyXG5cclxuICAgIC8vdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBcIiNcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy50b3BCYXJUZXh0ID0gc2V0dGluZ3MudG9wQmFyVGV4dCA/IHNldHRpbmdzLnRvcEJhclRleHQgOiBcIk5vIHRleHRcIjtcclxuXHJcbiAgICB0aGlzLnRvcEJhckljb24gPSBzZXR0aW5ncy50b3BCYXJJY29uID8gc2V0dGluZ3MudG9wQmFySWNvbiA6IFwiZGVmYXVsdEljb24uaWNvXCI7XHJcblxyXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcIm1lZGl1bVwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG5cclxuICAgIGxldCB3aW5kb3dUb3BCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFySWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICB3aW5kb3dUb3BCYXJJY29uLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMudG9wQmFySWNvbjtcclxuICAgIHdpbmRvd1RvcEJhckljb24uYWx0ID0gXCJUb3AgYmFyIGljb25cIjtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgd2luZG93VG9wQmFyU3Bhbi50ZXh0Q29udGVudCA9IHRoaXMudG9wQmFyVGV4dDtcclxuXHJcbiAgICBsZXQgd2luZG93TWluaW1pemVFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB3aW5kb3dNaW5pbWl6ZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X21pbmltaXplXCIpO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tbWludXMtcm91bmRcIik7XHJcblxyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3Jlc2l6ZVwiKTtcclxuXHJcbiAgICBsZXQgd2luZG93Q2xvc2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB3aW5kb3dDbG9zZUVsZW0uaHJlZiA9IFwiI1wiO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X2Nsb3NlXCIpO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tY2xvc2Utcm91bmRcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd0NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93Q29udGVudC5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19jb250ZW50XCIpO1xyXG4gICAgd2luZG93Q29udGVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIlBXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMuaWQpO1xyXG4gICAgaWYgKHRoaXMuYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgd2luZG93Q29udGVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93X3RvcGJhcl93cmFwcGVyXCIpO1xyXG5cclxuICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJJY29uKTtcclxuICAgIHdpbmRvd1RvcEJhci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXJTcGFuKTtcclxuXHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcik7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd01pbmltaXplRWxlbSk7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMud2luZG93UmVzaXplRWxlbSk7XHJcbiAgICB3aW5kb3dUb3BCYXJXcmFwcGVyLmFwcGVuZENoaWxkKHdpbmRvd0Nsb3NlRWxlbSk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyV3JhcHBlcik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh3aW5kb3dDb250ZW50KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlbW92ZSBhbGwgY2xhc3Nlc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImlvbi1hcnJvdy1zaHJpbmtcIik7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tYXJyb3ctZXhwYW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAzMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDQ1MDtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYmlnXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gNDAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1hcnJvdy1zaHJpbmtcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1cIiArIHRoaXMud2luZG93U2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCB0ZXN0ID0gdGhpcy5pZCA8IDEwID8gXCIwXCIgOiBcIlwiO1xyXG4gICAgICAgIHRlc3QgKz0gdGhpcy5pZDtcclxuXHJcbiAgICAgICAgdGhpcy54UG9zID0gKDEwMCsyMDAqdGVzdFswXSArIDE1ICogdGhpcy5pZCk7XHJcbiAgICAgICAgdGhpcy55UG9zID0gKDIwICsgMzAgKiAodGhpcy5pZCAtIHRlc3RbMF0qMTApKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0UG9zaXRpb24oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFdpbmRvdyBpbmhlcml0cyBmcm9tIEVudGl0eVxyXG4gKi9cclxuTXlXaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbnRpdHkucHJvdG90eXBlKTtcclxuTXlXaW5kb3cucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTXlXaW5kb3c7XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuZ2V0TWluaW1pemVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5taW5pbWl6ZWQ7XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5zZXRNaW5pbWl6ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5taW5pbWl6ZWQgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5taW5pbWl6ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWF4aW1pemVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1pbmltaXplXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWluaW1pemVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tbWF4aW1pemVcIik7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLVwiICsgdGhpcy53aW5kb3dTaXplKTtcclxuXHJcbiAgICBzd2l0Y2godGhpcy53aW5kb3dTaXplKSB7XHJcbiAgICAgICAgY2FzZSBcInNtYWxsXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwibWVkaXVtXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJtZWRpdW1cIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJiaWdcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcInNtYWxsXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hcHBsaWNhdGlvbk9iai5jbG9zZSgpO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15V2luZG93O1xyXG4iLCJjb25zdCBNeVdpbmRvdyA9IHJlcXVpcmUoXCIuL015V2luZG93LmpzXCIpO1xyXG5jb25zdCBJY29uID0gcmVxdWlyZShcIi4vSWNvbi5qc1wiKTtcclxuY29uc3QgUGFuZWwgPSByZXF1aXJlKFwiLi9QYW5lbC5qc1wiKTtcclxuY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi9BcHBsaWNhdGlvbi5qc1wiKTtcclxuY29uc3QgTXlBUEkgPSByZXF1aXJlKFwiLi9NeUFQSS5qc1wiKTtcclxuY29uc3QgTWVtb3J5ID0gcmVxdWlyZShcIi4vYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qc1wiKTtcclxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoXCIuL2FwcHMvQ2hhdC9DaGF0U3RhcnQuanNcIik7XHJcbmNvbnN0IFNldHRpbmdzID0gcmVxdWlyZShcIi4vYXBwcy9TZXR0aW5ncy9TZXR0aW5ncy5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFBXRChzZXR0aW5ncyA9IHt9KSB7XHJcblxyXG4gICAgaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBkZWZhdWx0IGJlaGF2aW91ci9wcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvcGVydGllc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud2luZG93cyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmljb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYXBpID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdUYXJnZXQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93Q291bnRlciA9IDA7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEVsZW1lbnRzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWFpblwiKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBMb29rIGZvciBiYWNrZ3JvdW5kIGluIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYWluX2JhY2tncm91bmRcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1haW5fYmFja2dyb3VuZFwiKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1haW4tLWJhY2tncm91bmQtM1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9vayBmb3IgZGlzcGxheSByZXNvbHV0aW9uIGluIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYWluX2Rpc3BsYXlSZXNcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1haW5fZGlzcGxheVJlc1wiKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1haW4tLWRpc3BsYXlSZXMtMFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLmhyZWYgPSBcIiNcIjtcclxuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3N0YXJ0QnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0LmNsYXNzTGlzdC5hZGQoXCJQV0Qtc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0LS1oaWRlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0X3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgdGhpcy5zdGFydF90aXRsZS5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0X190aXRsZVwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X3RpdGxlLnRleHRDb250ZW50ID0gXCJIZWohXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRfbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfbWVzc2FnZS5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0X19tZXNzYWdlXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfbWVzc2FnZS50ZXh0Q29udGVudCA9IFwiTWFkZSBieSBTaW1vbiDDlnN0ZXJkYWhsXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydF90aXRsZSk7XHJcbiAgICAgICAgdGhpcy5zdGFydC5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0X21lc3NhZ2UpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgdGhpcy5jbG9ja0J1dHRvbi5ocmVmID0gXCIjXCI7XHJcbiAgICAgICAgdGhpcy5jbG9ja0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9jbG9ja0J1dHRvblwiKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlQ2xvY2tCdXR0b24oKSB7XHJcbiAgICAgICAgICAgIGxldCBkID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tCdXR0b24udGV4dENvbnRlbnQgPSBkLmdldEhvdXJzKCkgKyBcIjpcIiArIChkLmdldE1pbnV0ZXMoKSA8IDEwID8gXCIwXCIgKyBkLmdldE1pbnV0ZXMoKSA6IGQuZ2V0TWludXRlcygpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwZGF0ZUNsb2NrQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIHNldEludGVydmFsKHVwZGF0ZUNsb2NrQnV0dG9uLCAzMDAwMCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2suY2xhc3NMaXN0LmFkZChcIlBXRC1jbG9ja1wiKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2stLWhpZGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2tfYmlnQ2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2tfX2JpZ1RpbWVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2tfZGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2tfZGF0ZS5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrX19kYXRlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tfYmlnQ2xvY2spO1xyXG4gICAgICAgIHRoaXMuY2xvY2suYXBwZW5kQ2hpbGQodGhpcy5jbG9ja19kYXRlKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlQ2xvY2soKSB7XHJcbiAgICAgICAgICAgIGxldCBkID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tfYmlnQ2xvY2sudGV4dENvbnRlbnQgPSBkLmdldEhvdXJzKCkgKyBcIjpcIiArIChkLmdldE1pbnV0ZXMoKSA8IDEwID8gXCIwXCIgKyBkLmdldE1pbnV0ZXMoKSA6IGQuZ2V0TWludXRlcygpKSArIFwiOlwiICsgKGQuZ2V0U2Vjb25kcygpIDwgMTAgPyBcIjBcIiArIGQuZ2V0U2Vjb25kcygpIDogZC5nZXRTZWNvbmRzKCkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1vbnRoTmFtZXMgPSBbXCJKYW51YXJpXCIsIFwiRmVicnVhcmlcIiwgXCJNYXJzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVseVwiLCBcIkF1Z3VzdGlcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tfZGF0ZS50ZXh0Q29udGVudCA9IFwiZGVuIFwiICsgZC5nZXREYXRlKCkgKyBcIiBcIiArIG1vbnRoTmFtZXNbZC5nZXRNb250aCgpXSArIFwiIFwiICsgZC5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwodXBkYXRlQ2xvY2ssIDEwMDApO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMucGFuZWxzV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbHNXcmFwcGVyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmJvdHRvbUJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJcIik7XHJcblxyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmFwcGVuZENoaWxkKHRoaXMuc3RhcnRCdXR0b24pO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmFwcGVuZENoaWxkKHRoaXMucGFuZWxzV3JhcHBlcik7XHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuYXBwZW5kQ2hpbGQodGhpcy5jbG9ja0J1dHRvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc3RhcnQpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2xvY2spO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYm90dG9tQmFyKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZXR0aW5ncy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIHRoZSBkZXNrdG9wIGljb25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJNZW1vcnkgc21hbGxcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwibWVtb3J5SWNvbi5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwic21hbGxcIixcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMTkzLDE1NCwxMDcpXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiTWVtb3J5IG1lZGl1bVwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAxMjAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwibWVtb3J5SWNvbi5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCIsXHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZENvbG9yXCI6IFwicmdiKDE5MywxNTQsMTA3KVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBiaWdcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMjUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcIm1lbW9yeUljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcImJpZ1wiLFxyXG4gICAgICAgICAgICBcImJhY2tncm91bmRDb2xvclwiOiBcInJnYigxOTMsMTU0LDEwNylcIlxyXG4gICAgICAgIH0pICk7XHJcbiAgICAgICAgdGhpcy5pY29ucy5wdXNoKCBuZXcgSWNvbih7XHJcbiAgICAgICAgICAgIFwiaWNvblRleHRcIjogXCJDaGF0XCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiQ2hhdFwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAzNTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwiY2hhdEljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIlNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb25OYW1lXCI6IFwiU2V0dGluZ3NcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogNDUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcInNldHRpbmdzSWNvbi5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgICAgICB9KSApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcHBlbmQgdGhlIGljb25zIHRvIHRoZSBjb250YWluZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xyXG4gICAgICAgICAgICAvL2xhdW5jaEFwcGxpY2F0aW9uKHRoaXMuaWNvbnNbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9sYXVuY2hBcHBsaWNhdGlvbih0aGlzLmljb25zWzNdKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWRkIGxpc3RlbmVyc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlZG93bkV2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNldXBFdmVudCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tFdmVudCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgZGJsY2xpY2tFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCBmdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbW91c2Vkb3duRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBldmVyeSBtb3VzZWRvd24gZXZlbnQgd2Ugd2lsbCBhdHRlbXB0IHRvIGZpbmQgYSBuZXcgdGFyZ2V0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIG9uIGEgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIE15V2luZG93KSB7XHJcbiAgICAgICAgICAgIGxldCBwd2RXaW5kb3cgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZihwd2RXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNlbGVjdCB0aGUgd2luZG93LCBwYW5lbCBhbmQgYXBwbGljYXRpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNlbGVjdFdpbmRvd1BhbmVsQXBwKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZXNlbGVjdCBpY29uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pY29uc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pY29uc1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHRhcmdldCBpcyB0aGUgd2luZG93IHRvcCBiYXIgLT4gc2V0IHRoZSB3aW5kb3cgYXMgZHJhZ1RhcmdldCBhbmQgYWRkIG1vdXNlbW92ZSBsaXN0ZW5lclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd1RvcEJhckVsZW0gPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dUb3BCYXJFbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gcHdkV2luZG93O1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gYSBwYW5lbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYW5lbCkge31cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBtb3VzZSBkb3duIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIGxldCBpY29uID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gaWNvbnMuaW5kZXhPZihpY29uKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZXQgdGhlIGljb24gYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNlbGVjdEljb24oaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERlc2VsZWN0IHRoZSB3aW5kb3cgYW5kIGFzc29jaWF0ZWQgcGFuZWxcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNldCB0aGUgaWNvbiBhcyBkcmFnVGFyZ2V0IGFuZCBhZGQgbW91c2Vtb3ZlIGxpc3RlbmVyXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdUYXJnZXQgPSBpY29uO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb3VzZXVwRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSGlkZSBjbG9jayBpZiBtb3VzZXVwIGhhcyBiZWVuIG1hZGUgb3V0c2lkZSBjbG9jayBhbmQgY2xvY2tCdXR0b25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0ICE9PSBcImNsb2NrXCIgJiYgdGFyZ2V0ICE9PSBcImNsb2NrQnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcIlBXRC1jbG9jay0taGlkZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9jay5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrLS1oaWRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIaWRlIHN0YXJ0IGlmIG1vdXNldXAgaGFzIGJlZW4gbWFkZSBvdXRzaWRlIHN0YXJ0IGFuZCBzdGFydEJ1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgIT09IFwic3RhcnRcIiAmJiB0YXJnZXQgIT09IFwic3RhcnRCdXR0b25cIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhcnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiUFdELXN0YXJ0LS1oaWRlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0LmNsYXNzTGlzdC5hZGQoXCJQV0Qtc3RhcnQtLWhpZGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2UgdXAgaGFzIGJlZW4gbWFkZSBvbiBhIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBNeVdpbmRvdykge1xyXG4gICAgICAgICAgICBsZXQgcHdkV2luZG93ID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgd2luZG93IGlzIGJlaW5nIGRyYWdnZWQgLT4gc3RvcCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1RhcmdldCBpbnN0YW5jZW9mIE15V2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdUYXJnZXQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93LnNldElzRHJhZ2dpbmcoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBtb3VzZXVwIGhhcyBiZWVuIG1hZGUgb24gYSBwYW5lbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYW5lbCkge1xyXG4gICAgICAgICAgICBsZXQgcGFuZWwgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnBhbmVscy5pbmRleE9mKHBhbmVsKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yKFwiUGFuZWwgd2FzIG5vdCBmb3VuZC5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgcGFuZWwgaXMgc2VsZWN0ZWQgLT4gZGVzZWxlY3QgYW5kIG1pbmltaXplIHRoZSBhc3NvY2lhdGVkIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxzW2luZGV4XS5nZXRJc1NlbGVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbaW5kZXhdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1tpbmRleF0uc2V0TWluaW1pemVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHBhbmVsIGlzIGRlc2VsZWN0ZWQgLT4gc2VsZWN0IGFuZCBicmluZyB1cCB0aGUgYXNzb2NpYXRlZCB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wYW5lbHNbaW5kZXhdLmdldElzU2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0V2luZG93UGFuZWxBcHAoaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1swXS5zZXRNaW5pbWl6ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBtb3VzZXVwIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIGxldCBpY29uID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHRoZSBpY29uIGlzIGJlaW5nIGRyYWdnZWQgLT4gc3RvcCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1RhcmdldCA9PT0gaWNvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIGljb24uc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGljb24uY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBpcyBiZWluZyBkcmFnZ2VkIC0+IHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldC5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldC5jb3JyZWN0R3JpZFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERlc2VsZWN0IHdpbmRvdywgcGFuZWwgYW5kIGljb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbnNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gdGhlIHN0YXJ0IGJ1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IFwic3RhcnRCdXR0b25cIikge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0LmNsYXNzTGlzdC50b2dnbGUoXCJQV0Qtc3RhcnQtLWhpZGVcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gdGhlIGNsb2NrIGJ1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IFwiY2xvY2tCdXR0b25cIikge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC50b2dnbGUoXCJQV0QtY2xvY2stLWhpZGVcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gYSB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgTXlXaW5kb3cpIHtcclxuICAgICAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gdGhlIGNsb3NlIGJ1dHRvbiAtPiBjbG9zZSB0aGUgd2luZG93XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgd2luZG93Q2xvc2VEaXYgPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X2Nsb3NlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvd0Nsb3NlRGl2LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMud2luZG93cy5pbmRleE9mKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xvc2VXaW5kb3coaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgcmVzaXplIGJ1dHRvbiAtPiByZXNpemUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd1Jlc2l6ZURpdiA9IHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfcmVzaXplXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvd1Jlc2l6ZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cucmVzaXplKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBtaW5pbWl6ZSBidXR0b24gLT4gbWluaW1pemUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd01pbmltaXplRGl2ID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19taW5pbWl6ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dNaW5pbWl6ZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cuc2V0TWluaW1pemVkKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHB3ZFdpbmRvdy5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB3aW5kb3dzLmluZGV4T2YocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gYSBwYW5lbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYW5lbCkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFuZWwgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBwYW5lbHMuaW5kZXhPZihwYW5lbCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBjbG9zZSBidXR0b25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChwYW5lbC5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC1ib3R0b21CYXJfcGFuZWxfX2Nsb3NlXCIpLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VXaW5kb3coaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRibGNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBkYmxjbGljayBoYXMgYmVlbiBtYWRlIG9uIGFuIGljb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICBsZXQgaWNvbiA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBMYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgaWNvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGF1bmNoQXBwbGljYXRpb24oaWNvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1vdXNlbW92ZUV2ZW50KGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiB0aGVyZSBpcyBhIGRyYWcgdGFyZ2V0IC0+IHVwZGF0ZSBpdHMgcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGxldCBkcmFnVGFyZ2V0ID0gdGhpcy5kcmFnVGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IHB3ZFdpZHRoID0gdGhpcy5jb250YWluZXIub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgIGxldCBwd2RIZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3Vyc29yWCA9IGUucGFnZVg7XHJcbiAgICAgICAgICAgIGxldCBjdXJzb3JZID0gZS5wYWdlWTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFggPSBlLm1vdmVtZW50WDtcclxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WSA9IGUubW92ZW1lbnRZO1xyXG5cclxuICAgICAgICAgICAgZHJhZ1RhcmdldC5zZXRJc0RyYWdnaW5nKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIG1vdXNlIHBvaW50ZXIgaXMgb3V0c2lkZSB3aW5kb3cgLT4gZG8gbm90IHVwZGF0ZSB0aGUgcG9zaXRpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChjdXJzb3JZICsgMTAgPCAwIHx8IGN1cnNvclkgPiBwd2RIZWlnaHQgLSA0MCAtIDEwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3Vyc29yWCArIDEwIDwgMCB8fCBjdXJzb3JYID4gcHdkV2lkdGggLSAxMCkge1xyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnRYID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZHJhZ1RhcmdldC51cGRhdGVQb3MoZHJhZ1RhcmdldC5nZXRYUG9zKCkgKyBtb3ZlbWVudFgsIGRyYWdUYXJnZXQuZ2V0WVBvcygpICsgbW92ZW1lbnRZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IhIFwiICsgbWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCcmluZyB0aGUgaWNvbiB3aXRoIHRoZSBnaXZlbiBpbmRleCB0byB0aGUgZnJvbnQgb2YgdGhlIGljb25zIGFycmF5XHJcbiAgICAgKiBCZWluZyBpbiBmcm9udCBvZiB0aGUgYXJyYXkgbWVhbnMgXCJzZWxlY3RlZFwiXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNlbGVjdEljb24oaW5kZXgpIHtcclxuICAgICAgICBsZXQgaWNvblRlbXAgPSB0aGlzLmljb25zW2luZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmljb25zLnVuc2hpZnQoaWNvblRlbXApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXNlbGVjdCB0aGUgbGFzdCBhY3RpdmUgaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLmljb25zWzFdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWNvbnNbMV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmljb25zWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCcmluZ3MgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIGluZGV4IHRvIHRoZSBmcm9udCBvZiB0aGVpciByZXNwZWN0aXZlIGFycmF5c1xyXG4gICAgICogQmVpbmcgaW4gZnJvbnQgb2YgdGhlIGFycmF5IG1lYW5zIFwic2VsZWN0ZWRcIlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RXaW5kb3dQYW5lbEFwcChpbmRleCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFwcGxpY2F0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IGFwcGxpY2F0aW9uVGVtcCA9IHRoaXMuYXBwbGljYXRpb25zW2luZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMudW5zaGlmdChhcHBsaWNhdGlvblRlbXApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgd2luZG93VGVtcCA9IHRoaXMud2luZG93c1tpbmRleF07XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3MudW5zaGlmdCh3aW5kb3dUZW1wKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMud2luZG93c1sxXSkge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd3NbMV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0SXNTZWxlY3RlZCh0cnVlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcGFuZWxUZW1wID0gdGhpcy5wYW5lbHNbaW5kZXhdO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy51bnNoaWZ0KHBhbmVsVGVtcCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhbmVsc1sxXSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsc1sxXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGFuZWxzWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdpdmUgd2luZG93cyB6LWluZGV4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFwcGxpY2F0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuc3R5bGUuekluZGV4ID0gdGhpcy5pY29ucy5sZW5ndGggKyB0aGlzLmFwcGxpY2F0aW9ucy5sZW5ndGggLSBpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFrZSBzdXJlIHN0YXJ0LCBjbG9jayBhbmQgYm90dG9tIGJhciBhbHdheXMgaXMgb24gdG9wXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHRvcFpJbmRleCA9IHRoaXMuYXBwbGljYXRpb25zLmxlbmd0aCArIHRoaXMuaWNvbnMubGVuZ3RoO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0LnN0eWxlLnpJbmRleCA9IHRvcFpJbmRleCArIDE7XHJcbiAgICAgICAgdGhpcy5jbG9jay5zdHlsZS56SW5kZXggPSB0b3BaSW5kZXggKyAxO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLnN0eWxlLnpJbmRleCA9IHRvcFpJbmRleCArIDI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9zZSBhIHdpbmRvdyB3aXRoIGEgZ2l2ZW4gaW5kZXhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2xvc2VXaW5kb3coaW5kZXgpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxsIHRoZSBjbG9zZSBmdW5jdGlvbiBpbXBsZW1lbnRlZCBieSBldmVyeSBhcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zW2luZGV4XS5jbG9zZSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgdGhlIHdpbmRvdyBhbmQgcGFuZWwgZnJvbSB0aGUgRE9NXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5nZXRDb250YWluZXIoKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMud2luZG93c1tpbmRleF0uZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnBhbmVsc1tpbmRleF0uZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIGZyb20gdGhlaXIgcmVzcGVjdGl2ZSBhcnJheXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB0aGlzLnBhbmVscy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gYSBwYW5lbCBpcyByZW1vdmVkLCBtYWtlIHN1cmUgdGhlIG90aGVyIHBhbmVscycgd2lkdGggaXMgY29ycmVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICBjYWxjdWxhdGVQYW5lbHNXaWR0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgYSBnaXZlbiB0YXJnZXQgZXhpc3RzIGluIGEgd2luZG93LCBwYW5lbCBvciBpY29uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZpbmRUYXJnZXQodGFyZ2V0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRCdXR0b24uY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJzdGFydEJ1dHRvblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnQuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJzdGFydFwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2xvY2tCdXR0b24uY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjbG9ja0J1dHRvblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2xvY2suY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjbG9ja1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgd2luZG93c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIGluIGEgd2luZG93IC0+IG1hcmsgdGhlIHdpbmRvdyBhbmQgdGhlIHBhbmVsIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy53aW5kb3dzW2ldLmdldENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndpbmRvd3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGUgdGhlIHBhbmVsc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYW5lbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgaW4gYSBwYW5lbCAtPiBtYXJrIHRoZSBwYW5lbCBhbmQgdGhlIHdpbmRvdyBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxzW2ldLmdldENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhbmVsc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgaWNvbnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvbiAtPiBtYXJrIHRoZSBpY29uIGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pY29uc1tpXS5nZXRDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pY29uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlcmUgaXMgbm8gdGFyZ2V0IC0+IHJldHVybiB1bmRlZmluZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgd2lkdGggb2YgdGhlIHBhbmVscywgbWFraW5nIHN1cmUgYWxsIHBhbmVscyBmaXQgaW4gdGhlIGJvdHRvbSBiYXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlUGFuZWxzV2lkdGgoKSB7XHJcbiAgICAgICAgbGV0IHBhbmVsV2lkdGggPSAxODggKiB0aGlzLnBhbmVscy5sZW5ndGggKyAxMDA7XHJcblxyXG4gICAgICAgIGxldCBwd2RXaWR0aCA9IHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoO1xyXG5cclxuICAgICAgICBpZiAocGFuZWxXaWR0aCA+IHB3ZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYW5lbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYW5lbEVsZW0gPSB0aGlzLnBhbmVsc1tpXS5nZXRDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYW5lbEVsZW0uc3R5bGUud2lkdGggPSB0aGlzLnBhbmVsc1dyYXBwZXIub2Zmc2V0V2lkdGggLyB0aGlzLnBhbmVscy5sZW5ndGggLSA4ICsgXCJweFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoIGFuIGFwcGxpY2F0aW9uLCB3aW5kb3cgYW5kIHBhbmVsIHVzaW5nIHRoZSBtZXRhIGRhdGEgaW4gYSBnaXZlbiBpY29uIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsYXVuY2hBcHBsaWNhdGlvbihpY29uT2JqKSB7XHJcbiAgICAgICAgbGV0IGlkID0gdGhpcy53aW5kb3dzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIGEgbmV3IHdpbmRvdyB0byBsYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGluXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IG5ldyBNeVdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy53aW5kb3dDb3VudGVyLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogaWNvbk9iai5nZXRXaW5kb3dTaXplKCksXHJcbiAgICAgICAgICAgIFwidG9wQmFyVGV4dFwiOiBpY29uT2JqLmdldEljb25UZXh0KCksXHJcbiAgICAgICAgICAgIFwidG9wQmFySWNvblwiOiBpY29uT2JqLmdldEljb25JbWFnZSgpLFxyXG4gICAgICAgICAgICBcInpJbmRleFwiOiB0aGlzLmljb25zLmxlbmd0aCxcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIiA6IGljb25PYmouZ2V0QmFja2dyb3VuZENvbG9yKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnB1c2gocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHdkV2luZG93LmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIGV2ZXJ5IHdpbmRvdyB0aGVyZSBpcyBhbHNvIGEgcGFuZWwgaW4gdGhlIGJvdHRvbSBiYXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcHdkUGFuZWwgPSBuZXcgUGFuZWwoe1xyXG4gICAgICAgICAgICBcInRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcImljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy5wdXNoKHB3ZFBhbmVsKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNXcmFwcGVyLmFwcGVuZENoaWxkKHB3ZFBhbmVsLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2hlbiBhIG5ldyBwYW5lbCBpcyBtYWRlLCBtYWtlIHN1cmUgd2lkdGggaXMgY29ycmVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNhbGN1bGF0ZVBhbmVsc1dpZHRoKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBsaWNhdGlvbk5hbWUgPSBpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpO1xyXG5cclxuICAgICAgICBsZXQgYXBwbGljYXRpb25PYmogPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChhcHBsaWNhdGlvbk5hbWUgPT09IFwiTWVtb3J5XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgTWVtb3J5KHtcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI1BXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMud2luZG93Q291bnRlclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFwcGxpY2F0aW9uTmFtZSA9PT0gXCJDaGF0XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgQ2hhdCh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLndpbmRvd0NvdW50ZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcHBsaWNhdGlvbk5hbWUgPT09IFwiU2V0dGluZ3NcIikge1xyXG4gICAgICAgICAgICBhcHBsaWNhdGlvbk9iaiA9IG5ldyBTZXR0aW5ncyh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLndpbmRvd0NvdW50ZXIsXHJcbiAgICAgICAgICAgICAgICBcImFwaVwiOiBnZXRBcGkoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXBwbGljYXRpb25PYmogaW5zdGFuY2VvZiBBcHBsaWNhdGlvbikge1xyXG4gICAgICAgICAgICBlcnJvcihcIlRoZSBhcHBsaWNhdGlvbiBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgQXBwbGljYXRpb24uXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMucHVzaChhcHBsaWNhdGlvbk9iaik7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gd2luZG93LCBwYW5lbCBhbmQgYXBwbGljYXRpb24gaGFzIG5vdyBiZWVuIG1hZGUgLT4gbWFrZSB0aGVtIHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2VsZWN0V2luZG93UGFuZWxBcHAodGhpcy5hcHBsaWNhdGlvbnMubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93Q291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIEFQSSBpcyB1c2VkIGJ5IGFwcGxpY2F0aW9ucyB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBQV0RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QXBpKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFwaSBpbnN0YW5jZW9mIE15QVBJKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBBUEkgaXMgcHJvdmlkZWQgc29tZSBzZXR0aW5nc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYXBpID0gbmV3IE15QVBJKHtcclxuICAgICAgICAgICAgXCJwd2RDb250YWluZXJcIjogdGhpcy5jb250YWluZXJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpO1xyXG4gICAgfVxyXG59XHJcblxyXG5QV0QucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBXRDtcclxuIiwiZnVuY3Rpb24gUGFuZWwoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHRoaXMudGV4dCA9IHNldHRpbmdzLnRleHQgPyBzZXR0aW5ncy50ZXh0IDogXCJubyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy5pY29uID0gc2V0dGluZ3MuaWNvbiA/IHNldHRpbmdzLmljb24gOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5ocmVmID0gXCIjXCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbFwiKTtcclxuXHJcbiAgICBsZXQgaWNvbkVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgaWNvbkVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uO1xyXG4gICAgaWNvbkVsZW0uYWx0ID0gXCJJY29uXCI7XHJcbiAgICBpY29uRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9faWNvblwiKTtcclxuXHJcbiAgICBsZXQgc3BhbkVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHNwYW5FbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsX19zcGFuXCIpO1xyXG4gICAgc3BhbkVsZW0udGV4dENvbnRlbnQgPSB0aGlzLnRleHQ7XHJcblxyXG4gICAgbGV0IGNsb3NlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgY2xvc2VFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIGNsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9fY2xvc2VcIik7XHJcbiAgICBjbG9zZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1jbG9zZS1yb3VuZFwiKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uRWxlbSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzcGFuRWxlbSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9zZUVsZW0pO1xyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuZ2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZDtcclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFuZWw7XHJcbiIsImNvbnN0IFBXRCA9IHJlcXVpcmUoXCIuL1BXRC5qc1wiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBwd2QgPSBuZXcgUFdEKHtcImNvbnRhaW5lclwiOiBcImJvZHlcIn0pO1xyXG59KTtcclxuIiwiZnVuY3Rpb24gQ2hhdChzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIm5vIGNvbnRhaW5lclwiO1xyXG5cclxuICAgIHRoaXMudXNlcm5hbWUgPSBzZXR0aW5ncy51c2VybmFtZSA/IHNldHRpbmdzLnVzZXJuYW1lIDogXCJzaW1vblwiO1xyXG5cclxuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIpO1xyXG4gICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgc29ja2V0T3BlbkV2ZW50KTtcclxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHNvY2tldE1lc3NhZ2VFdmVudCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBOYW1lIGNoYW5nZSBkaXZcclxuICAgIGxldCBuYW1lQ2hhbmdlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG5hbWVDaGFuZ2VEaXYuY2xhc3NMaXN0LmFkZChcImNoYXROYW1lQ2hhbmdlXCIpO1xyXG5cclxuICAgIGxldCBuYW1lQ2hhbmdlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgbmFtZUNoYW5nZVNwYW4udGV4dENvbnRlbnQgPSBcIlVzZXJuYW1lOiBcIiArIHRoaXMudXNlcm5hbWU7XHJcblxyXG4gICAgbGV0IG5hbWVDaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgbmFtZUNoYW5nZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbmFtZUNoYW5nZUV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgbmFtZUNoYW5nZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQ2hhbmdlIG5hbWVcIjtcclxuXHJcbiAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VTcGFuKTtcclxuICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUJ1dHRvbik7XHJcblxyXG4gICAgbGV0IG5hbWVDaGFuZ2VJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAvLyBNZXNzYWdlcyBkaXZcclxuICAgIGxldCBtZXNzYWdlc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBtZXNzYWdlc0Rpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdE1lc3NhZ2VzXCIpO1xyXG5cclxuICAgIC8vIElucHV0IGZvcm1cclxuICAgIGxldCBpbnB1dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmcm9tXCIpO1xyXG4gICAgaW5wdXREaXYuY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dFwiKTtcclxuXHJcbiAgICAvLyBUZXh0YXJlYSBpbiB0aGUgaW5wdXQgZGl2XHJcbiAgICBsZXQgaW5wdXREaXZfdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XHJcbiAgICBpbnB1dERpdl90ZXh0YXJlYS5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X3RleHRhcmVhXCIpO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgXCJXYWl0aW5nIGZvciBjb25uZWN0aW9uLi4uXCIpO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRleHRhcmVhRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl90ZXh0YXJlYSk7XHJcblxyXG4gICAgLy8gQnV0dG9uIGluIHRoZSBpbnB1dCBkaXZcclxuICAgIGxldCBpbnB1dERpdl9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X2J1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi50ZXh0Q29udGVudCA9IFwiU2VuZFwiO1xyXG4gICAgaW5wdXREaXYuYXBwZW5kQ2hpbGQoaW5wdXREaXZfYnV0dG9uKTtcclxuXHJcbiAgICAvLyBDaGF0IHdyYXBwZXJcclxuICAgIGxldCBjaGF0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdFdyYXBwZXJcIik7XHJcblxyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZURpdik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZXNzYWdlc0Rpdik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChpbnB1dERpdik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyIGRpdlxyXG4gICAgbGV0IGNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIGNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc29ja2V0T3BlbkV2ZW50KGUpIHtcclxuICAgICAgICBpbnB1dERpdl90ZXh0YXJlYS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlucHV0RGl2X3RleHRhcmVhLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiRW50ZXIgbWVzc2FnZVwiKTtcclxuXHJcbiAgICAgICAgaW5wdXREaXZfYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc29ja2V0TWVzc2FnZUV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2UudHlwZSA9PT0gXCJoZWFydGJlYXRcIikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hhdE1lc3NhZ2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLmNsYXNzTGlzdC5hZGQoXCJjaGF0TWVzc2FnZVwiKTtcclxuXHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IFwiW1wiICsgcmVzcG9uc2UudHlwZSArIFwiXSBcIjtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gcmVzcG9uc2UudXNlcm5hbWUgKyBcIjogXCI7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IHJlc3BvbnNlLmRhdGE7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzRGl2LmFwcGVuZENoaWxkKGNoYXRNZXNzYWdlU3Bhbik7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzRGl2LnNjcm9sbFRvcCA9IG1lc3NhZ2VzRGl2LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBuYW1lQ2hhbmdlRXZlbnQoZSkge1xyXG4gICAgICAgIG5hbWVDaGFuZ2VEaXYudGV4dENvbnRlbnQgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAobmFtZUNoYW5nZUlucHV0LnZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUlucHV0KTtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlSW5wdXQudmFsdWUgPSB0aGlzLnVzZXJuYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBuYW1lQ2hhbmdlSW5wdXQudmFsdWU7XHJcblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNoYXRVc2VybmFtZVwiLCB0aGlzLnVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VJbnB1dC52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlU3Bhbi50ZXh0Q29udGVudCA9IFwiVXNlcm5hbWU6IFwiICsgdGhpcy51c2VybmFtZTtcclxuICAgICAgICAgICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlU3Bhbik7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VCdXR0b24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBidXR0b25FdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gaW5wdXREaXZfdGV4dGFyZWEudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCB2YWx1ZSA9PT0gXCJcXG5cIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk11c3QgZW50ZXIgYSBtZXNzYWdlIVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlucHV0RGl2X3RleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJkYXRhXCIgOiB2YWx1ZSxcclxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGV4dGFyZWFFdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgcHJlc3NpbmcgZW50ZXIgYW5kIHNoaWZ0IGlzIG5vdCBwcmVzc2VkIC0+IGNsaWNrIGJ1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzICYmICFlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlucHV0RGl2X2J1dHRvbi5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuQ2hhdC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xyXG4iLCJjb25zdCBBcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi9BcHBsaWNhdGlvbi5qc1wiKTtcclxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDaGF0U3RhcnQoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIm5vIGNvbnRhaW5lclwiO1xyXG5cclxuICAgIHRoaXMuY2hhdE9iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIFdyYXBwZXJcclxuICAgIGxldCBjaGF0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdFdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gQ2hhdCBzdGFydCBoZWFkZXJcclxuICAgIGxldCBjaGF0U3RhcnRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnRIZWFkZXJcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0U3RhcnRIZWFkZXIpO1xyXG5cclxuICAgIGxldCBjaGF0U3RhcnRIZWFkZXJTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXJTcGFuLnRleHRDb250ZW50ID0gXCJTVVBFUkNIQVRcIjtcclxuICAgIGNoYXRTdGFydEhlYWRlci5hcHBlbmRDaGlsZChjaGF0U3RhcnRIZWFkZXJTcGFuKTtcclxuXHJcbiAgICAvLyBDaGF0IG5hbWUgaW5wdXRcclxuICAgIGxldCBjaGF0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgLy8gZml4IHRvIG1ha2UgaW5wdXQgc2VsZWN0YWJsZVxyXG4gICAgY2hhdE5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgIH0pO1xyXG4gICAgY2hhdE5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBcIkVudGVyIG5hbWUhXCIpO1xyXG4gICAgY2hhdE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0TmFtZUlucHV0XCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdE5hbWVJbnB1dCk7XHJcblxyXG4gICAgLy8gQ2hhdCBuYW1lIGJ1dHRvblxyXG4gICAgbGV0IGNoYXROYW1lQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnROYW1lQnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBjaGF0dGluZyFcIjtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXROYW1lQnV0dG9uKTtcclxuXHJcbiAgICAvLyBDb250YWluZXIgZGl2XHJcbiAgICBsZXQgY29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIGEgdXNlcm5hbWUgZXhpc3RzIGluIGxvY2FsIHN0b3JhZ2UgLT4gc3RhcnQgY2hhdFxyXG4gICAgICovXHJcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjaGF0VXNlcm5hbWVcIikpIHtcclxuICAgICAgICBzZXR0aW5ncy51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2hhdFVzZXJuYW1lXCIpO1xyXG5cclxuICAgICAgICBjaGF0V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGF0T2JqID0gbmV3IENoYXQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGNoYXROYW1lSW5wdXQudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVudGVyIGEgbmFtZSFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNoYXRVc2VybmFtZVwiLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHNldHRpbmdzLnVzZXJuYW1lID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGNoYXRXcmFwcGVyRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICB0aGlzLmNoYXRPYmogPSBuZXcgQ2hhdChzZXR0aW5ncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNoYXRTdGFydC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XHJcbkNoYXRTdGFydC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDaGF0U3RhcnQ7XHJcblxyXG5DaGF0U3RhcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NpbmcgQ2hhdCBhcHBsaWNhdGlvbi4uLlwiKTtcclxuXHJcbiAgICBpZiAodGhpcy5jaGF0T2JqKSB7XHJcbiAgICAgICAgdGhpcy5jaGF0T2JqLmNsb3NlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhdFN0YXJ0O1xyXG4iLCJmdW5jdGlvbiBDYXJkKHZhbHVlKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICBsZXQgY2FyZFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDYXJkVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgY2FyZFRlbXBsYXRlRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUoY2FyZFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIC8vIFRoZSBjYXJkRWxlbSBpcyB0aGUgZWxlbWVudCB3cmFwcGluZyB0aGUgdHdvIGltYWdlc1xyXG4gICAgdGhpcy5jYXJkRWxlbSA9IGNhcmRUZW1wbGF0ZUZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlDYXJkXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIHRoaXMudmFsdWUpO1xyXG5cclxuICAgIC8vIFRoZSBjb3ZlckltYWdlIGlzIHRoZSBxdWVzdGlvbiBtYXJrIGFib3ZlIHRoZSBjYXJkIGltYWdlXHJcbiAgICB0aGlzLmNvdmVySW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q2FyZF9fYmFja1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zcmMgPSBcImltYWdlL01lbW9yeS9cIiArIHRoaXMudmFsdWVbMF0gKyBcIi5wbmdcIjtcclxuXHJcbiAgICAvLyBUaGUgY2FyZEltYWdlIGlzIHRoZSBpbWFnZSBvZiB0aGUgbWVtb3J5IGNhcmRcclxuICAgIHRoaXMuY2FyZEltYWdlID0gdGhpcy5jYXJkRWxlbS5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNhcmRfX2Zyb250XCIpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdW5pcXVlIHZhbHVlIGZvciB0aGlzIGNhcmRcclxuICogVGhlIGNhcmQgaWRlbnRpZmllclxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogRmxpcHMgdGhlIGNhcmRcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmlzRmxpcHBlZCkge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwibWVtb3J5Q2FyZC0tZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwibWVtb3J5Q2FyZC0tZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZC0tYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwibWVtb3J5Q2FyZC0tYmFja2ZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIm1lbW9yeUNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmQtLWZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuZ2V0SXNGbGlwcGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0ZsaXBwZWQ7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLnNldElzQ29tcGxldGUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gdmFsdWU7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKSB7XHJcbiAgICB0aGlzLmNhcmRFbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuZ2V0Q2FyZEVsZW0gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNhcmRFbGVtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmQ7XHJcbiIsImNvbnN0IENhcmQgPSByZXF1aXJlKFwiLi9DYXJkLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ2FyZHMobnJPZkNhcmRzKSB7XHJcbiAgICB0aGlzLmNhcmRzID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnJPZkNhcmRzICsgMTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMSkpO1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNodWZmbGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSB0aGlzLmNhcmRzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgIGxldCB0ZW1wID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2ldID0gdGhpcy5jYXJkc1tqXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2pdID0gdGVtcDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGNhcmQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIGxldCBjYXJkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmNhcmRzW2ldLmdldFZhbHVlKCkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGNhcmQgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgZnJhZ21lbnQgY29udGFpbmluZyB0aGUgY2FyZCBkaXZzIGFuZCBpbWFnZXNcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkc0ZyYWcgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjYXJkc0ZyYWcgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjYXJkRWxlbSA9IHRoaXMuY2FyZHNbaV0uZ2V0Q2FyZEVsZW0oKTtcclxuICAgICAgICBjYXJkc0ZyYWcuYXBwZW5kQ2hpbGQoY2FyZEVsZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkc0ZyYWc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZHM7XHJcbiIsImNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4uLy4uL0FwcGxpY2F0aW9uLmpzXCIpO1xyXG5jb25zdCBNZW1vcnlHYW1lQm9hcmQgPSByZXF1aXJlKFwiLi9NZW1vcnlHYW1lQm9hcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lKHNldHRpbmdzID0ge30pIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCIjMTIzXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBXcmFwcGVyXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcIm1lbW9yeVdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gSGVhZGVyXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUhlYWRlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUhlYWRlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUhlYWRlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlIZWFkZXIgPSBtZW1vcnlIZWFkZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5SGVhZGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG5cclxuICAgIC8vIFBhaXIgZm9ybVxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJGb3JtVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyRm9ybVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybSA9IG1lbW9yeVBhaXJGb3JtRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhaXJGb3JtXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlQYWlyRm9ybSk7XHJcblxyXG4gICAgLy8gUmFkaW8gaW5wdXRzXHJcbiAgICBsZXQgbWVtb3J5UGFpclJhZGlvVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJSYWRpb1RlbXBsYXRlXCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDg7IGkrKykge1xyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyUmFkaW9GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJMYWJlbCA9IG1lbW9yeVBhaXJSYWRpb0ZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlQYWlyUmFkaW9MYWJlbFwiKTtcclxuICAgICAgICBsZXQgbWVtb3J5UGFpclJhZGlvID0gbWVtb3J5UGFpckxhYmVsLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFpckxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGkgKyBcIiBwYWlyc1wiKSk7XHJcbiAgICAgICAgLy8gRml4IHRvIG1ha2UgcmFkaW8gaW5wdXRzIGNsaWNrYWJsZVxyXG4gICAgICAgIG1lbW9yeVBhaXJMYWJlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWVtb3J5UGFpclJhZGlvLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGkpO1xyXG5cclxuICAgICAgICBtZW1vcnlQYWlyRm9ybS5hcHBlbmRDaGlsZChtZW1vcnlQYWlyTGFiZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZvcm0gYnV0dG9uXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvbkZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uID0gbWVtb3J5UGFpckZvcm1CdXR0b25GcmFnLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XHJcbiAgICBtZW1vcnlQYWlyRm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWVtb3J5UGFpckZvcm1CdXR0b25FdmVudCk7XHJcblxyXG4gICAgbWVtb3J5UGFpckZvcm0uYXBwZW5kQ2hpbGQobWVtb3J5UGFpckZvcm1CdXR0b24pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IG5yT2ZQYWlycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5UGFpckZvcm0gaW5wdXQ6Y2hlY2tlZFwiKS52YWx1ZTtcclxuXHJcbiAgICAgICAgbWVtb3J5V3JhcHBlckRpdi5yZW1vdmVDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG4gICAgICAgIG1lbW9yeVdyYXBwZXJEaXYucmVtb3ZlQ2hpbGQobWVtb3J5UGFpckZvcm0pO1xyXG5cclxuICAgICAgICBzZXR0aW5ncy5uck9mUGFpcnMgPSBwYXJzZUludChuck9mUGFpcnMpO1xyXG5cclxuICAgICAgICBuZXcgTWVtb3J5R2FtZUJvYXJkKHNldHRpbmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuTWVtb3J5R2FtZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XHJcbk1lbW9yeUdhbWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWVtb3J5R2FtZTtcclxuXHJcbk1lbW9yeUdhbWUucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NpbmcgTWVtb3J5IGFwcGxpY2F0aW9uLi4uXCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWU7XHJcbiIsImNvbnN0IENhcmRzID0gcmVxdWlyZShcIi4vQ2FyZHMuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCIjY29vbFwiO1xyXG5cclxuICAgIGxldCBuck9mUGFpcnMgPSBzZXR0aW5ncy5uck9mUGFpcnMgPyBzZXR0aW5ncy5uck9mUGFpcnMgOiA0O1xyXG5cclxuICAgIGxldCBjYXJkcyA9IG5ldyBDYXJkcyhuck9mUGFpcnMpO1xyXG5cclxuICAgIGxldCBzY29yZSA9IDA7XHJcblxyXG4gICAgbGV0IGdhbWVUaW1lciA9IC0xO1xyXG5cclxuICAgIGxldCBhdHRlbXB0cyA9IDA7XHJcblxyXG4gICAgbGV0IGZpcnN0Q2FyZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgc2Vjb25kQ2FyZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBnYW1lVGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKHRpbWVyLCAxMDAwKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVMZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIE1lbW9yeSB3cmFwcGVyXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcIm1lbW9yeVdyYXBwZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZW1vcnlXcmFwcGVyQ2xpY2tFdmVudCk7XHJcblxyXG4gICAgLy8gSGVhZGVyXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUhlYWRlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUhlYWRlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUhlYWRlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlIZWFkZXIgPSBtZW1vcnlIZWFkZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5SGVhZGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBwYW5lbFxyXG4gICAgbGV0IG1lbW9yeVBhbmVsVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYW5lbFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYW5lbERpdiAgICAgICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhbmVsXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5UGFuZWxfX2F0dGVtcHRzU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbFRpbWVTcGFuICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhbmVsX190aW1lU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhbmVsX19tZXNzYWdlU3BhblwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5UGFuZWxEaXYpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBjYXJkc1xyXG4gICAgbGV0IG1lbW95Q2FyZHNUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q2FyZHNUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlDYXJkc0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUNhcmRzVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUNhcmRzRGl2ID0gbWVtb3J5Q2FyZHNGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q2FyZHNcIik7XHJcbiAgICBtZW1vcnlDYXJkc0Rpdi5hcHBlbmRDaGlsZChjYXJkcy5nZXRDYXJkc0ZyYWcoKSk7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUNhcmRzRGl2KTtcclxuXHJcbiAgICB0aW1lcigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHRpbWVyKCkge1xyXG4gICAgICAgIGdhbWVUaW1lciArPSAxO1xyXG5cclxuICAgICAgICBtZW1vcnlQYW5lbEF0dGVtcHRzU3Bhbi50ZXh0Q29udGVudCA9IFwiQXR0ZW1wdHM6IFwiICsgYXR0ZW1wdHM7XHJcbiAgICAgICAgbWVtb3J5UGFuZWxUaW1lU3Bhbi50ZXh0Q29udGVudCA9IFwiVGltZTogXCIgKyBnYW1lVGltZXIgKyBcIiBzZWNvbmRzXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWVtb3J5V3JhcHBlckNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgaXMgY3VycmVudGx5IGNoZWNraW5nIGFuc3dlciAtPiBleGl0IGZ1bmN0aW9uXHJcbiAgICAgICAgICogKHdhaXRpbmcgZm9yIHRpbWVyIHRvIGZpbmlzaClcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaXNDaGVja2luZ0Fuc3dlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW1nRWxlbSA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBsZXQgYUVsZW0gPSBpbWdFbGVtLm5vZGVOYW1lID09PSBcIklNR1wiID8gaW1nRWxlbS5wYXJlbnROb2RlIDogaW1nRWxlbTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0gYUVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNhcmQgPSBjYXJkcy5nZXRDYXJkKHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGNhcmQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuZ2V0SXNGbGlwcGVkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmZsaXAoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RDYXJkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdENhcmQgPSBjYXJkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRDYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tBbnN3ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja0Fuc3dlcigpIHtcclxuICAgICAgICBpc0NoZWNraW5nQW5zd2VyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgYXR0ZW1wdHMgKz0gMTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaXJzdENhcmQuZ2V0VmFsdWUoKVswXSA9PT0gc2Vjb25kQ2FyZC5nZXRWYWx1ZSgpWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuYWRkQ2xhc3MoXCJtZW1vcnlDYXJkLS1jb3JyZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQ2FyZC5hZGRDbGFzcyhcIm1lbW9yeUNhcmQtLWNvcnJlY3RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcmUgKz0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIHNjb3JlIGlzIGVxdWFsIHRvIG1heGltdW0gYW1vdW50IG9mIHBhaXJzIC0+IHRoZSBnYW1lIGlzIGNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChzY29yZSA9PT0gbnJPZlBhaXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChnYW1lVGltZXJJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5UGFuZWxNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCA9IFwiWW91IGNvbXBsZXRlZCB0aGUgZ2FtZSFcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5mbGlwKCk7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlyc3RDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBzZWNvbmRDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWVCb2FyZDtcclxuIiwiY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vQXBwbGljYXRpb24uanNcIik7XHJcblxyXG5mdW5jdGlvbiBTZXR0aW5ncyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBBcHBsaWNhdGlvbi5jYWxsKHRoaXMsIHtcclxuICAgICAgIFwiYXBpXCI6IHNldHRpbmdzLmFwaVxyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLndpbmRvd0RpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpO1xyXG4gICAgdGhpcy53aW5kb3dEaXYuY2xhc3NMaXN0LmFkZChcInNldHRpbmdzV3JhcHBlclwiKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJhY2tncm91bmRcclxuICAgICAqL1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZFRpdGxlLnRleHRDb250ZW50ID0gXCJDaGFuZ2UgYmFja2dyb3VuZFwiO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0uY2xhc3NMaXN0LmFkZChcInNldHRpbmdzQmFja2dyb3VuZEZvcm1cIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICBsZXQgZm9ybUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGZvcm1MYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJiYWNrZ3JvdW5kRm9ybVwiICsgdGhpcy5jb250YWluZXIgKyBpKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcm1SYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImJhY2tncm91bmRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiYmFja2dyb3VuZEZvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XG5cbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibWFpbl9iYWNrZ3JvdW5kXCIpID09PSBcIm1haW4tLWJhY2tncm91bmQtXCIgKyBpKSB7XG4gICAgICAgICAgICBmb3JtUmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZvcm1JbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgZm9ybUltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4vaW1hZ2UvYmFja2dyb3VuZFwiICsgaSArIFwiX3NtYWxsLmpwZ1wiKTtcclxuICAgICAgICBmb3JtSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiQmFja2dyb3VuZFwiKTtcclxuXHJcbiAgICAgICAgZm9ybUxhYmVsLmFwcGVuZENoaWxkKGZvcm1SYWRpbyk7XHJcbiAgICAgICAgZm9ybUxhYmVsLmFwcGVuZENoaWxkKGZvcm1JbWFnZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZEZvcm0uYXBwZW5kQ2hpbGQoZm9ybUxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJhY2tncm91bmRUaXRsZSk7XHJcbiAgICB0aGlzLmJhY2tncm91bmRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZEZvcm0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSByZXNvbHV0aW9uXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZGlzcGxheVJlc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIHRoaXMuZGlzcGxheVJlc1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB0aGlzLmRpc3BsYXlSZXNUaXRsZS50ZXh0Q29udGVudCA9IFwiQ2hhbmdlIERpc3BsYXkgUmVzb2x1dGlvblwiO1xyXG5cclxuICAgIHRoaXMuZGlzcGxheVJlc0Zvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIHRoaXMuZGlzcGxheVJlc0Zvcm0uY2xhc3NMaXN0LmFkZChcInNldHRpbmdzRGlzcGxheVJlc0Zvcm1cIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICBsZXQgZm9ybUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGZvcm1MYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJkaXNwbGF5UmVzRm9ybVwiICsgdGhpcy5jb250YWluZXIgKyBpKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcm1SYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImRpc3BsYXlSZXNcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiZGlzcGxheVJlc0Zvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XHJcblxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1haW5fZGlzcGxheVJlc1wiKSA9PT0gXCJtYWluLS1kaXNwbGF5UmVzLVwiICsgaSkge1xyXG4gICAgICAgICAgICBmb3JtUmFkaW8uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZm9ybVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgZm9ybUxhYmVsLmFwcGVuZENoaWxkKGZvcm1SYWRpbyk7XHJcbiAgICAgICAgZm9ybUxhYmVsLmFwcGVuZENoaWxkKGZvcm1TcGFuKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5UmVzRm9ybS5hcHBlbmRDaGlsZChmb3JtTGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheVJlc1RpdGxlKTtcclxuICAgIHRoaXMuZGlzcGxheVJlc1dyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5kaXNwbGF5UmVzRm9ybSk7XHJcblxyXG4gICAgbGV0IHNwYW5zID0gdGhpcy5kaXNwbGF5UmVzV3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcclxuICAgIHNwYW5zWzFdLnRleHRDb250ZW50ID0gXCIxMjgweDcyMFwiO1xyXG4gICAgc3BhbnNbMl0udGV4dENvbnRlbnQgPSBcIjE2MDB4OTAwXCI7XHJcbiAgICBzcGFuc1szXS50ZXh0Q29udGVudCA9IFwiMTkyMHgxMDgwXCI7XHJcbiAgICBzcGFuc1s0XS50ZXh0Q29udGVudCA9IFwiMjQ2MHgxNDAwXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTYXZlIGJ1dHRvblxyXG4gICAgICovXHJcbiAgICB0aGlzLnNhdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc0J1dHRvblwiKTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uLnRleHRDb250ZW50ID0gXCJTYXZlXCI7XHJcbiAgICB0aGlzLnNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNhdmVCdXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuc2V0dGluZ3MuY2xhc3NMaXN0LmFkZChcInNldHRpbmdzXCIpO1xyXG5cclxuICAgIHRoaXMuc2V0dGluZ3MuYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kV3JhcHBlcik7XHJcbiAgICB0aGlzLnNldHRpbmdzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoclwiKSk7XHJcbiAgICB0aGlzLnNldHRpbmdzLmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheVJlc1dyYXBwZXIpO1xyXG4gICAgdGhpcy5zZXR0aW5ncy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIikpO1xyXG5cclxuICAgIHRoaXMud2luZG93RGl2LmFwcGVuZENoaWxkKHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy53aW5kb3dEaXYuYXBwZW5kQ2hpbGQodGhpcy5zYXZlQnV0dG9uKTtcclxuXHJcbiAgICBmdW5jdGlvbiBzYXZlQnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFja2dyb3VuZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kSW5wdXRzID0gdGhpcy5iYWNrZ3JvdW5kRm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmFja2dyb3VuZElucHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYmFja2dyb3VuZElucHV0c1tpXS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwaS5zZXRQd2RCYWNrZ3JvdW5kKGkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibWFpbl9iYWNrZ3JvdW5kXCIsIFwibWFpbi0tYmFja2dyb3VuZC1cIiArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGlzcGxheVJlc0lucHV0cyA9IHRoaXMuZGlzcGxheVJlc0Zvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpc3BsYXlSZXNJbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGRpc3BsYXlSZXNJbnB1dHNbaV0uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcGkuc2V0UHdkRGlzcGxheVJlc29sdXRpb24oaSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtYWluX2Rpc3BsYXlSZXNcIiwgXCJtYWluLS1kaXNwbGF5UmVzLVwiICsgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblNldHRpbmdzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwbGljYXRpb24ucHJvdG90eXBlKTtcclxuU2V0dGluZ3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2V0dGluZ3M7XHJcblxyXG5TZXR0aW5ncy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2luZyBTZXR0aW5ncyBhcHBsaWNhdGlvbi4uLlwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcclxuIl19
