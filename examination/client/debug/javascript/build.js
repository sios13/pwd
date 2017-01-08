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

        this.isDblClick = false;

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
            localStorage.setItem("main_background", "main--background-3");
        }
        /**
         * Look for display resolution in local storage
         */
        if (localStorage.getItem("main_displayRes")) {
            this.container.classList.add(localStorage.getItem("main_displayRes"));
        } else {
            this.container.classList.add("main--displayRes-0");
            localStorage.setItem("main_displayRes", "main--displayRes-0");
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
            let date = new Date();

            this.clockButton.textContent = date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
        }

        updateClockButton();

        setInterval(updateClockButton.bind(this), 60000);

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
            let date = new Date();

            this.clock_bigClock.textContent = date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());

            let monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "July", "Augusti", "September", "Oktober", "November", "December"];

            this.clock_date.textContent = "den " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
        }

        setInterval(updateClock.bind(this), 1000);

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
            "windowSize": "medium"
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

        window.addEventListener("keydown", keydownEvent);
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
        if (target instanceof Panel) {
            return;
        }

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
             * If panel is not selected -> select and bring up the associated window
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
        if (this.isDblClick) {
            dblclickEvent(e);

            return;
        }

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

            let index = this.windows.indexOf(pwdWindow);

            selectWindowPanelApp(index);

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

        /**
         * Start the double click timer
         */
        this.isDblClick = true;

        setTimeout(function() {
            this.isDblClick = false;
        }, 500);
    }

    function dblclickEvent(e) {
        let target = findTarget(e.target);

        /**
         * If a dblclick has been made on an icon
         */
        if (target instanceof Icon) {
            e.preventDefault();

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

    function keydownEvent(e) {
        /**
         * Update position of selected window using the arrow key
         */
        if (this.windows[0]) {
            let pwdWindow = this.windows[0];

            /**
             * Move only if is selected and holding ctrl key
             */
            if (pwdWindow.getIsSelected() && e.ctrlKey) {
                let x = pwdWindow.getXPos();
                let y = pwdWindow.getYPos();

                let velocity = 10;

                if (e.keyCode === 37) {
                    // Left
                    x -= velocity;
                } else if (e.keyCode === 38) {
                    // Up
                    y -= velocity;
                } else if (e.keyCode === 39) {
                    // Right
                    x += velocity;
                } else if (e.keyCode === 40) {
                    // Down
                    y += velocity;
                }

                pwdWindow.updatePos(x, y);
            }
        }
    }

    /**
     * Handles error messages
     */
    function error(message) {
        console.log("ERROR! " + message);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwbGljYXRpb24uanMiLCJjbGllbnQvc291cmNlL2pzL0VudGl0eS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvTXlBUEkuanMiLCJjbGllbnQvc291cmNlL2pzL015V2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9QV0QuanMiLCJjbGllbnQvc291cmNlL2pzL1BhbmVsLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcHMvQ2hhdC9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL01lbW9yeS9DYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwcy9NZW1vcnkvTWVtb3J5R2FtZUJvYXJkLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBzL1NldHRpbmdzL1NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3A2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBFdmVyeSBhcHBsaWNhdGlvbiBpbiB0aGUgUFdEIG11c3QgaW1wbGVtZW50IEFwcGxpY2F0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBBcHBsaWNhdGlvbihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLmFwaSA9IHNldHRpbmdzLmFwaSA/IHNldHRpbmdzLmFwaSA6IHVuZGVmaW5lZDtcclxufVxyXG5cclxuQXBwbGljYXRpb24ucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIldBUk5JTkchIEFwcGxpY2F0aW9uIG11c3QgaW1wbGVtZW50IGZ1bmN0aW9uIGNsb3NlLlwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBsaWNhdGlvbjtcclxuIiwiLyoqXHJcbiAqIFdpbmRvdyBhbmQgaWNvbiBpbmhlcml0cyBmcm9tIGVudGl0eVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVudGl0eShzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLndpZHRoID0gc2V0dGluZ3Mud2lkdGggPyBzZXR0aW5ncy53aWR0aCA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmhlaWdodCA9IHNldHRpbmdzLmhlaWdodCA/IHNldHRpbmdzLmhlaWdodCA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnhQb3MgPSBzZXR0aW5ncy54UG9zID8gc2V0dGluZ3MueFBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnlQb3MgPSBzZXR0aW5ncy55UG9zID8gc2V0dGluZ3MueVBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnpJbmRleCA9IHNldHRpbmdzLnpJbmRleCA/IHNldHRpbmdzLnpJbmRleCA6IDA7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBzZXR0aW5ncy5pc0RyYWdnaW5nID8gc2V0dGluZ3MuaXNEcmFnZ2luZyA6IGZhbHNlO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRYUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy54UG9zO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldFlQb3MgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnlQb3M7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUudXBkYXRlUG9zID0gZnVuY3Rpb24oeFBvcywgeVBvcykge1xyXG4gICAgdGhpcy54UG9zID0geFBvcztcclxuICAgIHRoaXMueVBvcyA9IHlQb3M7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5zZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5nZXRJc1NlbGVjdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkO1xyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnNldElzRHJhZ2dpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2luZ1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdnaW5nXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmdldElzRHJhZ2dpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmlzRHJhZ2dpbmc7XHJcbn1cclxuXHJcbkVudGl0eS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKFwiLi9FbnRpdHkuanNcIik7XHJcblxyXG5mdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcInpJbmRleFwiOiBzZXR0aW5ncy56SW5kZXgsXHJcbiAgICAgICAgXCJpc1NlbGVjdGVkXCI6IHNldHRpbmdzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgXCJpc0RyYWdnaW5nXCI6IHNldHRpbmdzLmlzRHJhZ2dpbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaWNvblRleHQgICAgICAgID0gc2V0dGluZ3MuaWNvblRleHQgPyBzZXR0aW5ncy5pY29uVGV4dCA6IFwiTm8gaWNvbiB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy53aWR0aCAgICAgICAgICAgPSBzZXR0aW5ncy53aWR0aCA/IHNldHRpbmdzLndpZHRoIDogMTA7XHJcblxyXG4gICAgdGhpcy5oZWlnaHQgICAgICAgICAgPSBzZXR0aW5ncy5oZWlnaHQgPyBzZXR0aW5ncy5oZWlnaHQgOiAxMDtcclxuXHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA/IHNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5pY29uSW1hZ2UgICAgICAgPSBzZXR0aW5ncy5pY29uSW1hZ2UgPyBzZXR0aW5ncy5pY29uSW1hZ2UgOiBcImRlZmF1bHRJY29uLnBuZ1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSAgICAgID0gc2V0dGluZ3Mud2luZG93U2l6ZSA/IHNldHRpbmdzLndpbmRvd1NpemUgOiBcInNtYWxsXCI7XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgPyBzZXR0aW5ncy5iYWNrZ3JvdW5kQ29sb3IgOiBcIlwiO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyICAgICAgID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWljb25cIik7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICAgICAgbGV0IGljb25JbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGljb25JbWFnZUVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uSW1hZ2U7XHJcblxyXG4gICAgICAgIGxldCBpY29uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGljb25UZXh0LnRleHRDb250ZW50ID0gdGhpcy5pY29uVGV4dDtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb25JbWFnZUVsZW0pO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uVGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJY29uIGluaGVyaXRzIGZyb20gRW50aXR5XHJcbiAqL1xyXG5JY29uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRW50aXR5LnByb3RvdHlwZSk7XHJcbkljb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gSWNvbjtcclxuXHJcbkljb24ucHJvdG90eXBlLmdldEFwcGxpY2F0aW9uTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25OYW1lO1xyXG59XHJcblxyXG4vKipcclxuICogSWNvbnMgYXJlIHN1cHBvc2VkIHRvIGJlIGFsaWduZWQgaW4gYSBncmlkIHN5c3RlbS5cclxuICogVGhpcyBmdW5jdGlvbiBjb3JyZWN0cyB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBvZiB0aGUgaWNvbiwgbWFraW5nIGl0IGFsaWduIHRvIHRoZSBuZWFyZXN0IGdyaWRcclxuICovXHJcbkljb24ucHJvdG90eXBlLmNvcnJlY3RHcmlkUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMueFBvcyA9IHRoaXMueFBvcyAtIHRoaXMueFBvcyAlIDEwMDtcclxuICAgIHRoaXMueVBvcyA9IDUgKyB0aGlzLnlQb3MgLSB0aGlzLnlQb3MgJSAxMDA7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0QmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldEljb25UZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uVGV4dDtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0SWNvbkltYWdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uSW1hZ2U7XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLndpbmRvd1NpemU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcclxuIiwiLyoqXHJcbiAqIFRoZSBBUEkgaXMgYSB3YXkgZm9yIGFwcGxpY2F0aW9ucyB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBQV0RcclxuICovXHJcbmZ1bmN0aW9uIE15QVBJKHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMucHdkQ29udGFpbmVyID0gc2V0dGluZ3MucHdkQ29udGFpbmVyID8gc2V0dGluZ3MucHdkQ29udGFpbmVyIDogdW5kZWZpbmVkO1xyXG59XHJcblxyXG5NeUFQSS5wcm90b3R5cGUuc2V0UHdkQmFja2dyb3VuZCA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICBsZXQgcHJlZml4ID0gXCJtYWluLS1iYWNrZ3JvdW5kLVwiO1xyXG5cclxuICAgIE15QVBJLnByb3RvdHlwZS5yZW1vdmVDbGFzc2VzV2l0aFByZWZpeChwcmVmaXgsIHRoaXMucHdkQ29udGFpbmVyKTtcclxuXHJcbiAgICB0aGlzLnB3ZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHByZWZpeCArIGluZGV4KTtcclxufVxyXG5cclxuTXlBUEkucHJvdG90eXBlLnNldFB3ZERpc3BsYXlSZXNvbHV0aW9uID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIGxldCBwcmVmaXggPSBcIm1haW4tLWRpc3BsYXlSZXMtXCI7XHJcblxyXG4gICAgTXlBUEkucHJvdG90eXBlLnJlbW92ZUNsYXNzZXNXaXRoUHJlZml4KHByZWZpeCwgdGhpcy5wd2RDb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMucHdkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQocHJlZml4ICsgaW5kZXgpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGNsYXNzZXMgd2l0aCBwcmVmaXhcclxuICovXHJcbk15QVBJLnByb3RvdHlwZS5yZW1vdmVDbGFzc2VzV2l0aFByZWZpeCA9IGZ1bmN0aW9uKHByZWZpeCwgZWxlbSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtLmNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChlbGVtLmNsYXNzTGlzdFtpXS5pbmRleE9mKHByZWZpeCkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShlbGVtLmNsYXNzTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeUFQSTtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZShcIi4vRW50aXR5LmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gTXlXaW5kb3coc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIEVudGl0eS5jYWxsKHRoaXMsIHtcclxuICAgICAgICBcInhQb3NcIjogc2V0dGluZ3MueFBvcyxcclxuICAgICAgICBcInlQb3NcIjogc2V0dGluZ3MueVBvcyxcclxuICAgICAgICBcInpJbmRleFwiOiBzZXR0aW5ncy56SW5kZXgsXHJcbiAgICAgICAgXCJpc1NlbGVjdGVkXCI6IHNldHRpbmdzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgXCJpc0RyYWdnaW5nXCI6IHNldHRpbmdzLmlzRHJhZ2dpbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZCA/IHNldHRpbmdzLmlkIDogMDtcclxuXHJcbiAgICAvL3RoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogXCIjXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMudG9wQmFyVGV4dCA9IHNldHRpbmdzLnRvcEJhclRleHQgPyBzZXR0aW5ncy50b3BCYXJUZXh0IDogXCJObyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy50b3BCYXJJY29uID0gc2V0dGluZ3MudG9wQmFySWNvbiA/IHNldHRpbmdzLnRvcEJhckljb24gOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJtZWRpdW1cIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93XCIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICBsZXQgd2luZG93VG9wQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd1RvcEJhci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhckljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgd2luZG93VG9wQmFySWNvbi5zcmMgPSBcIi4vaW1hZ2UvXCIgKyB0aGlzLnRvcEJhckljb247XHJcbiAgICB3aW5kb3dUb3BCYXJJY29uLmFsdCA9IFwiVG9wIGJhciBpY29uXCI7XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhclNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHdpbmRvd1RvcEJhclNwYW4udGV4dENvbnRlbnQgPSB0aGlzLnRvcEJhclRleHQ7XHJcblxyXG4gICAgbGV0IHdpbmRvd01pbmltaXplRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgd2luZG93TWluaW1pemVFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHdpbmRvd01pbmltaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19taW5pbWl6ZVwiKTtcclxuICAgIHdpbmRvd01pbmltaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLW1pbnVzLXJvdW5kXCIpO1xyXG5cclxuICAgIHRoaXMud2luZG93UmVzaXplRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19yZXNpemVcIik7XHJcblxyXG4gICAgbGV0IHdpbmRvd0Nsb3NlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgd2luZG93Q2xvc2VFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIHdpbmRvd0Nsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd19jbG9zZVwiKTtcclxuICAgIHdpbmRvd0Nsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWNsb3NlLXJvdW5kXCIpO1xyXG5cclxuICAgIGxldCB3aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dfY29udGVudFwiKTtcclxuICAgIHdpbmRvd0NvbnRlbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLmlkKTtcclxuICAgIGlmICh0aGlzLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgIHdpbmRvd0NvbnRlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHdpbmRvd1RvcEJhcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd190b3BiYXJfd3JhcHBlclwiKTtcclxuXHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFySWNvbik7XHJcbiAgICB3aW5kb3dUb3BCYXIuYXBwZW5kQ2hpbGQod2luZG93VG9wQmFyU3Bhbik7XHJcblxyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dUb3BCYXIpO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dNaW5pbWl6ZUVsZW0pO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLndpbmRvd1Jlc2l6ZUVsZW0pO1xyXG4gICAgd2luZG93VG9wQmFyV3JhcHBlci5hcHBlbmRDaGlsZCh3aW5kb3dDbG9zZUVsZW0pO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHdpbmRvd1RvcEJhcldyYXBwZXIpO1xyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93Q29udGVudCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgYWxsIGNsYXNzZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImlvbi1hcnJvdy1leHBhbmRcIik7XHJcbiAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJpb24tYXJyb3ctc2hyaW5rXCIpO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwic21hbGxcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAyMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDMwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplRWxlbS5jbGFzc0xpc3QuYWRkKFwiaW9uLWFycm93LWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSA0NTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1hcnJvdy1leHBhbmRcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJpZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDQwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gNjAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFbGVtLmNsYXNzTGlzdC5hZGQoXCJpb24tYXJyb3ctc2hyaW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tXCIgKyB0aGlzLndpbmRvd1NpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0UG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgdGVzdCA9IHRoaXMuaWQgPCAxMCA/IFwiMFwiIDogXCJcIjtcclxuICAgICAgICB0ZXN0ICs9IHRoaXMuaWQ7XHJcblxyXG4gICAgICAgIHRoaXMueFBvcyA9ICgxMDArMjAwKnRlc3RbMF0gKyAxNSAqIHRoaXMuaWQpO1xyXG4gICAgICAgIHRoaXMueVBvcyA9ICgyMCArIDMwICogKHRoaXMuaWQgLSB0ZXN0WzBdKjEwKSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29ycmVjdFBvc2l0aW9uKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXaW5kb3cgaW5oZXJpdHMgZnJvbSBFbnRpdHlcclxuICovXHJcbk15V2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRW50aXR5LnByb3RvdHlwZSk7XHJcbk15V2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE15V2luZG93O1xyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLmdldE1pbmltaXplZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubWluaW1pemVkO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuc2V0TWluaW1pemVkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMubWluaW1pemVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMubWluaW1pemVkKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1taW5pbWl6ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1pbmltaXplXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1tYXhpbWl6ZVwiKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLW1heGltaXplXCIpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk15V2luZG93LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1cIiArIHRoaXMud2luZG93U2l6ZSk7XHJcblxyXG4gICAgc3dpdGNoKHRoaXMud2luZG93U2l6ZSkge1xyXG4gICAgICAgIGNhc2UgXCJzbWFsbFwiOlxyXG4gICAgICAgICAgICB0aGlzLndpbmRvd1NpemUgPSBcIm1lZGl1bVwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibWVkaXVtXCI6XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93U2l6ZSA9IFwiYmlnXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJiaWdcIjpcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dTaXplID0gXCJzbWFsbFwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG5NeVdpbmRvdy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXBwbGljYXRpb25PYmouY2xvc2UoKTtcclxufVxyXG5cclxuTXlXaW5kb3cucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeVdpbmRvdztcclxuIiwiY29uc3QgTXlXaW5kb3cgPSByZXF1aXJlKFwiLi9NeVdpbmRvdy5qc1wiKTtcclxuY29uc3QgSWNvbiA9IHJlcXVpcmUoXCIuL0ljb24uanNcIik7XHJcbmNvbnN0IFBhbmVsID0gcmVxdWlyZShcIi4vUGFuZWwuanNcIik7XHJcbmNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4vQXBwbGljYXRpb24uanNcIik7XHJcbmNvbnN0IE15QVBJID0gcmVxdWlyZShcIi4vTXlBUEkuanNcIik7XHJcbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoXCIuL2FwcHMvTWVtb3J5L01lbW9yeUdhbWUuanNcIik7XHJcbmNvbnN0IENoYXQgPSByZXF1aXJlKFwiLi9hcHBzL0NoYXQvQ2hhdFN0YXJ0LmpzXCIpO1xyXG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2FwcHMvU2V0dGluZ3MvU2V0dGluZ3MuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0Qoc2V0dGluZ3MgPSB7fSkge1xyXG5cclxuICAgIGluaXRpYWxpemUoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgZGVmYXVsdCBiZWhhdmlvdXIvcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFwaSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd0NvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmlzRGJsQ2xpY2sgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRWxlbWVudHNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvb2sgZm9yIGJhY2tncm91bmQgaW4gbG9jYWwgc3RvcmFnZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1haW5fYmFja2dyb3VuZFwiKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibWFpbl9iYWNrZ3JvdW5kXCIpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwibWFpbi0tYmFja2dyb3VuZC0zXCIpO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm1haW5fYmFja2dyb3VuZFwiLCBcIm1haW4tLWJhY2tncm91bmQtM1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9vayBmb3IgZGlzcGxheSByZXNvbHV0aW9uIGluIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYWluX2Rpc3BsYXlSZXNcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1haW5fZGlzcGxheVJlc1wiKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1haW4tLWRpc3BsYXlSZXMtMFwiKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtYWluX2Rpc3BsYXlSZXNcIiwgXCJtYWluLS1kaXNwbGF5UmVzLTBcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5ocmVmID0gXCIjXCI7XHJcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9zdGFydEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydC5jbGFzc0xpc3QuYWRkKFwiUFdELXN0YXJ0XCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnQuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydC0taGlkZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRfdGl0bGUuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydF9fdGl0bGVcIik7XHJcbiAgICAgICAgdGhpcy5zdGFydF90aXRsZS50ZXh0Q29udGVudCA9IFwiSGVqIVwiO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydF9fbWVzc2FnZVwiKTtcclxuICAgICAgICB0aGlzLnN0YXJ0X21lc3NhZ2UudGV4dENvbnRlbnQgPSBcIk1hZGUgYnkgU2ltb24gw5ZzdGVyZGFobFwiO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0LmFwcGVuZENoaWxkKHRoaXMuc3RhcnRfdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuc3RhcnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydF9tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9ja0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2tCdXR0b24uaHJlZiA9IFwiI1wiO1xyXG4gICAgICAgIHRoaXMuY2xvY2tCdXR0b24uY2xhc3NMaXN0LmFkZChcIlBXRC1ib3R0b21CYXJfY2xvY2tCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNsb2NrQnV0dG9uKCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrQnV0dG9uLnRleHRDb250ZW50ID0gZGF0ZS5nZXRIb3VycygpICsgXCI6XCIgKyAoZGF0ZS5nZXRNaW51dGVzKCkgPCAxMCA/IFwiMFwiICsgZGF0ZS5nZXRNaW51dGVzKCkgOiBkYXRlLmdldE1pbnV0ZXMoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVDbG9ja0J1dHRvbigpO1xyXG5cclxuICAgICAgICBzZXRJbnRlcnZhbCh1cGRhdGVDbG9ja0J1dHRvbi5iaW5kKHRoaXMpLCA2MDAwMCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2suY2xhc3NMaXN0LmFkZChcIlBXRC1jbG9ja1wiKTtcclxuICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2stLWhpZGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2tfYmlnQ2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLmNsb2NrX2JpZ0Nsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2tfX2JpZ1RpbWVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvY2tfZGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRoaXMuY2xvY2tfZGF0ZS5jbGFzc0xpc3QuYWRkKFwiUFdELWNsb2NrX19kYXRlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNsb2NrLmFwcGVuZENoaWxkKHRoaXMuY2xvY2tfYmlnQ2xvY2spO1xyXG4gICAgICAgIHRoaXMuY2xvY2suYXBwZW5kQ2hpbGQodGhpcy5jbG9ja19kYXRlKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlQ2xvY2soKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tfYmlnQ2xvY2sudGV4dENvbnRlbnQgPSBkYXRlLmdldEhvdXJzKCkgKyBcIjpcIiArIChkYXRlLmdldE1pbnV0ZXMoKSA8IDEwID8gXCIwXCIgKyBkYXRlLmdldE1pbnV0ZXMoKSA6IGRhdGUuZ2V0TWludXRlcygpKSArIFwiOlwiICsgKGRhdGUuZ2V0U2Vjb25kcygpIDwgMTAgPyBcIjBcIiArIGRhdGUuZ2V0U2Vjb25kcygpIDogZGF0ZS5nZXRTZWNvbmRzKCkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1vbnRoTmFtZXMgPSBbXCJKYW51YXJpXCIsIFwiRmVicnVhcmlcIiwgXCJNYXJzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVseVwiLCBcIkF1Z3VzdGlcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2tfZGF0ZS50ZXh0Q29udGVudCA9IFwiZGVuIFwiICsgZGF0ZS5nZXREYXRlKCkgKyBcIiBcIiArIG1vbnRoTmFtZXNbZGF0ZS5nZXRNb250aCgpXSArIFwiIFwiICsgZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwodXBkYXRlQ2xvY2suYmluZCh0aGlzKSwgMTAwMCk7XHJcblxyXG4gICAgICAgIHRoaXMucGFuZWxzV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5wYW5lbHNXcmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsc1dyYXBwZXJcIik7XHJcblxyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuYXBwZW5kQ2hpbGQodGhpcy5zdGFydEJ1dHRvbik7XHJcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuYXBwZW5kQ2hpbGQodGhpcy5wYW5lbHNXcmFwcGVyKTtcclxuICAgICAgICB0aGlzLmJvdHRvbUJhci5hcHBlbmRDaGlsZCh0aGlzLmNsb2NrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zdGFydCk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jbG9jayk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ib3R0b21CYXIpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNldHRpbmdzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgdGhlIGRlc2t0b3AgaWNvbnNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBzbWFsbFwiLFxyXG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uTmFtZVwiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJtZW1vcnlJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJzbWFsbFwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBtZWRpdW1cIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMTIwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcIm1lbW9yeUljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcIm1lZGl1bVwiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIk1lbW9yeSBiaWdcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJNZW1vcnlcIixcclxuICAgICAgICAgICAgXCJ4UG9zXCI6IDEwLFxyXG4gICAgICAgICAgICBcInlQb3NcIjogMjUwLFxyXG4gICAgICAgICAgICBcImljb25JbWFnZVwiOiBcIm1lbW9yeUljb24ucG5nXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93U2l6ZVwiOiBcImJpZ1wiXHJcbiAgICAgICAgfSkgKTtcclxuICAgICAgICB0aGlzLmljb25zLnB1c2goIG5ldyBJY29uKHtcclxuICAgICAgICAgICAgXCJpY29uVGV4dFwiOiBcIkNoYXRcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJDaGF0XCIsXHJcbiAgICAgICAgICAgIFwieFBvc1wiOiAxMCxcclxuICAgICAgICAgICAgXCJ5UG9zXCI6IDM1MCxcclxuICAgICAgICAgICAgXCJpY29uSW1hZ2VcIjogXCJjaGF0SWNvbi5wbmdcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgICAgICB9KSApO1xyXG4gICAgICAgIHRoaXMuaWNvbnMucHVzaCggbmV3IEljb24oe1xyXG4gICAgICAgICAgICBcImljb25UZXh0XCI6IFwiU2V0dGluZ3NcIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbk5hbWVcIjogXCJTZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICBcInhQb3NcIjogMTAsXHJcbiAgICAgICAgICAgIFwieVBvc1wiOiA0NTAsXHJcbiAgICAgICAgICAgIFwiaWNvbkltYWdlXCI6IFwic2V0dGluZ3NJY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogXCJtZWRpdW1cIlxyXG4gICAgICAgIH0pICk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFwcGVuZCB0aGUgaWNvbnMgdG8gdGhlIGNvbnRhaW5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmljb25zW2ldLmdldENvbnRhaW5lcigpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vbGF1bmNoQXBwbGljYXRpb24odGhpcy5pY29uc1sxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2xhdW5jaEFwcGxpY2F0aW9uKHRoaXMuaWNvbnNbM10pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGQgbGlzdGVuZXJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duRXZlbnQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2V1cEV2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0V2ZW50KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGtleWRvd25FdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCBmdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbW91c2Vkb3duRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBldmVyeSBtb3VzZWRvd24gZXZlbnQgd2Ugd2lsbCBhdHRlbXB0IHRvIGZpbmQgYSBuZXcgdGFyZ2V0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIG1vdXNlZG93biBoYXMgYmVlbiBtYWRlIG9uIGEgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIE15V2luZG93KSB7XHJcbiAgICAgICAgICAgIGxldCBwd2RXaW5kb3cgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZihwd2RXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNlbGVjdCB0aGUgd2luZG93LCBwYW5lbCBhbmQgYXBwbGljYXRpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNlbGVjdFdpbmRvd1BhbmVsQXBwKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZXNlbGVjdCBpY29uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pY29uc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pY29uc1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHRhcmdldCBpcyB0aGUgd2luZG93IHRvcCBiYXIgLT4gc2V0IHRoZSB3aW5kb3cgYXMgZHJhZ1RhcmdldCBhbmQgYWRkIG1vdXNlbW92ZSBsaXN0ZW5lclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd1RvcEJhckVsZW0gPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3RvcGJhclwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dUb3BCYXJFbGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gcHdkV2luZG93O1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgb24gYSBwYW5lbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYW5lbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIG1vdXNlIGRvd24gaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgbGV0IGljb24gPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBpY29ucy5pbmRleE9mKGljb24pO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNldCB0aGUgaWNvbiBhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2VsZWN0SWNvbihpbmRleCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRGVzZWxlY3QgdGhlIHdpbmRvdyBhbmQgYXNzb2NpYXRlZCBwYW5lbFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMud2luZG93c1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzWzBdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYW5lbHNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzWzBdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU2V0IHRoZSBpY29uIGFzIGRyYWdUYXJnZXQgYW5kIGFkZCBtb3VzZW1vdmUgbGlzdGVuZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IGljb247XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmVFdmVudCk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1vdXNldXBFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIaWRlIGNsb2NrIGlmIG1vdXNldXAgaGFzIGJlZW4gbWFkZSBvdXRzaWRlIGNsb2NrIGFuZCBjbG9ja0J1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgIT09IFwiY2xvY2tcIiAmJiB0YXJnZXQgIT09IFwiY2xvY2tCdXR0b25cIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2xvY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwiUFdELWNsb2NrLS1oaWRlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC5hZGQoXCJQV0QtY2xvY2stLWhpZGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhpZGUgc3RhcnQgaWYgbW91c2V1cCBoYXMgYmVlbiBtYWRlIG91dHNpZGUgc3RhcnQgYW5kIHN0YXJ0QnV0dG9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCAhPT0gXCJzdGFydFwiICYmIHRhcmdldCAhPT0gXCJzdGFydEJ1dHRvblwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGFydC5jbGFzc0xpc3QuY29udGFpbnMoXCJQV0Qtc3RhcnQtLWhpZGVcIikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQuY2xhc3NMaXN0LmFkZChcIlBXRC1zdGFydC0taGlkZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBtb3VzZSB1cCBoYXMgYmVlbiBtYWRlIG9uIGEgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIE15V2luZG93KSB7XHJcbiAgICAgICAgICAgIGxldCBwd2RXaW5kb3cgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSB3aW5kb3cgaXMgYmVpbmcgZHJhZ2dlZCAtPiBzdG9wIGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0IGluc3RhbmNlb2YgTXlXaW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cuc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlRXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIG1vdXNldXAgaGFzIGJlZW4gbWFkZSBvbiBhIHBhbmVsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIFBhbmVsKSB7XHJcbiAgICAgICAgICAgIGxldCBwYW5lbCA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMucGFuZWxzLmluZGV4T2YocGFuZWwpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHBhbmVsIGlzIHNlbGVjdGVkIC0+IGRlc2VsZWN0IGFuZCBtaW5pbWl6ZSB0aGUgYXNzb2NpYXRlZCB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsc1tpbmRleF0uZ2V0SXNTZWxlY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd3NbaW5kZXhdLnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBwYW5lbCBpcyBub3Qgc2VsZWN0ZWQgLT4gc2VsZWN0IGFuZCBicmluZyB1cCB0aGUgYXNzb2NpYXRlZCB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wYW5lbHNbaW5kZXhdLmdldElzU2VsZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0V2luZG93UGFuZWxBcHAoaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1swXS5zZXRNaW5pbWl6ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBtb3VzZXVwIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIGxldCBpY29uID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHRoZSBpY29uIGlzIGJlaW5nIGRyYWdnZWQgLT4gc3RvcCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1RhcmdldCA9PT0gaWNvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIGljb24uc2V0SXNEcmFnZ2luZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGljb24uY29ycmVjdEdyaWRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBpcyBiZWluZyBkcmFnZ2VkIC0+IHN0b3AgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldC5zZXRJc0RyYWdnaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0IGluc3RhbmNlb2YgSWNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldC5jb3JyZWN0R3JpZFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnVGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERlc2VsZWN0IHdpbmRvdywgcGFuZWwgYW5kIGljb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93c1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1swXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbnNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbnNbMF0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEYmxDbGljaykge1xyXG4gICAgICAgICAgICBkYmxjbGlja0V2ZW50KGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gdGhlIHN0YXJ0IGJ1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IFwic3RhcnRCdXR0b25cIikge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0LmNsYXNzTGlzdC50b2dnbGUoXCJQV0Qtc3RhcnQtLWhpZGVcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gdGhlIGNsb2NrIGJ1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IFwiY2xvY2tCdXR0b25cIikge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb2NrLmNsYXNzTGlzdC50b2dnbGUoXCJQV0QtY2xvY2stLWhpZGVcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gYSB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgTXlXaW5kb3cpIHtcclxuICAgICAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMud2luZG93cy5pbmRleE9mKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RXaW5kb3dQYW5lbEFwcChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIHRoZSBjbG9zZSBidXR0b24gLT4gY2xvc2UgdGhlIHdpbmRvd1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IHdpbmRvd0Nsb3NlRGl2ID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLnF1ZXJ5U2VsZWN0b3IoXCIuUFdELXdpbmRvd19jbG9zZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dDbG9zZURpdi5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZihwd2RXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNsb3NlV2luZG93KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBhIGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gdGhlIHJlc2l6ZSBidXR0b24gLT4gcmVzaXplIHRoZSB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dSZXNpemVEaXYgPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0Qtd2luZG93X3Jlc2l6ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dSZXNpemVEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93LnJlc2l6ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgbWluaW1pemUgYnV0dG9uIC0+IG1pbmltaXplIHRoZSB3aW5kb3dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCB3aW5kb3dNaW5pbWl6ZURpdiA9IHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yKFwiLlBXRC13aW5kb3dfbWluaW1pemVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93TWluaW1pemVEaXYuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcHdkV2luZG93LnNldE1pbmltaXplZCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cuc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gd2luZG93cy5pbmRleE9mKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbaW5kZXhdLnNldElzU2VsZWN0ZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBjbGljayBoYXMgYmVlbiBtYWRlIG9uIGEgcGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFuZWwpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhbmVsID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gcGFuZWxzLmluZGV4T2YocGFuZWwpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiB0aGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAocGFuZWwuZ2V0Q29udGFpbmVyKCkucXVlcnlTZWxlY3RvcihcIi5QV0QtYm90dG9tQmFyX3BhbmVsX19jbG9zZVwiKS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIGNsb3NlV2luZG93KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIGEgY2xpY2sgaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEljb24pIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3RhcnQgdGhlIGRvdWJsZSBjbGljayB0aW1lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaXNEYmxDbGljayA9IHRydWU7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNEYmxDbGljayA9IGZhbHNlO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGJsY2xpY2tFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGZpbmRUYXJnZXQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIGRibGNsaWNrIGhhcyBiZWVuIG1hZGUgb24gYW4gaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJY29uKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpY29uID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIExhdW5jaCB0aGUgYXBwbGljYXRpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBpY29uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsYXVuY2hBcHBsaWNhdGlvbihpY29uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbW91c2Vtb3ZlRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRoZXJlIGlzIGEgZHJhZyB0YXJnZXQgLT4gdXBkYXRlIGl0cyBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLmRyYWdUYXJnZXQpIHtcclxuICAgICAgICAgICAgbGV0IGRyYWdUYXJnZXQgPSB0aGlzLmRyYWdUYXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHdkV2lkdGggPSB0aGlzLmNvbnRhaW5lci5vZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgbGV0IHB3ZEhlaWdodCA9IHRoaXMuY29udGFpbmVyLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJzb3JYID0gZS5wYWdlWDtcclxuICAgICAgICAgICAgbGV0IGN1cnNvclkgPSBlLnBhZ2VZO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WCA9IGUubW92ZW1lbnRYO1xyXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRZID0gZS5tb3ZlbWVudFk7XHJcblxyXG4gICAgICAgICAgICBkcmFnVGFyZ2V0LnNldElzRHJhZ2dpbmcodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgbW91c2UgcG9pbnRlciBpcyBvdXRzaWRlIHdpbmRvdyAtPiBkbyBub3QgdXBkYXRlIHRoZSBwb3NpdGlvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKGN1cnNvclkgKyAxMCA8IDAgfHwgY3Vyc29yWSA+IHB3ZEhlaWdodCAtIDQwIC0gMTApIHtcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50WSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJzb3JYICsgMTAgPCAwIHx8IGN1cnNvclggPiBwd2RXaWR0aCAtIDEwKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudFggPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkcmFnVGFyZ2V0LnVwZGF0ZVBvcyhkcmFnVGFyZ2V0LmdldFhQb3MoKSArIG1vdmVtZW50WCwgZHJhZ1RhcmdldC5nZXRZUG9zKCkgKyBtb3ZlbWVudFkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBrZXlkb3duRXZlbnQoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwZGF0ZSBwb3NpdGlvbiBvZiBzZWxlY3RlZCB3aW5kb3cgdXNpbmcgdGhlIGFycm93IGtleVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLndpbmRvd3NbMF0pIHtcclxuICAgICAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IHRoaXMud2luZG93c1swXTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBNb3ZlIG9ubHkgaWYgaXMgc2VsZWN0ZWQgYW5kIGhvbGRpbmcgY3RybCBrZXlcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChwd2RXaW5kb3cuZ2V0SXNTZWxlY3RlZCgpICYmIGUuY3RybEtleSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHggPSBwd2RXaW5kb3cuZ2V0WFBvcygpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHkgPSBwd2RXaW5kb3cuZ2V0WVBvcygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB2ZWxvY2l0eSA9IDEwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTGVmdFxyXG4gICAgICAgICAgICAgICAgICAgIHggLT0gdmVsb2NpdHk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMzgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVcFxyXG4gICAgICAgICAgICAgICAgICAgIHkgLT0gdmVsb2NpdHk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMzkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBSaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIHggKz0gdmVsb2NpdHk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gNDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBEb3duXHJcbiAgICAgICAgICAgICAgICAgICAgeSArPSB2ZWxvY2l0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwd2RXaW5kb3cudXBkYXRlUG9zKHgsIHkpO1xyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgZXJyb3IgbWVzc2FnZXNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IhIFwiICsgbWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhIGdpdmVuIHRhcmdldCBleGlzdHMgaW4gYSB3aW5kb3csIHBhbmVsIG9yIGljb25cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZmluZFRhcmdldCh0YXJnZXQpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGFydEJ1dHRvbi5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInN0YXJ0QnV0dG9uXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGFydC5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInN0YXJ0XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9ja0J1dHRvbi5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNsb2NrQnV0dG9uXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9jay5jb250YWlucyh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNsb2NrXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSB3aW5kb3dzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGEgbW91c2Vkb3duIGhhcyBiZWVuIG1hZGUgaW4gYSB3aW5kb3cgLT4gbWFyayB0aGUgd2luZG93IGFuZCB0aGUgcGFuZWwgYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2luZG93c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlcmF0ZSB0aGUgcGFuZWxzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBpbiBhIHBhbmVsIC0+IG1hcmsgdGhlIHBhbmVsIGFuZCB0aGUgd2luZG93IGFzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYW5lbHNbaV0uZ2V0Q29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFuZWxzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlIHRoZSBpY29uc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSWYgYSBtb3VzZWRvd24gaGFzIGJlZW4gbWFkZSBvbiBhbiBpY29uIC0+IG1hcmsgdGhlIGljb24gYXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmljb25zW2ldLmdldENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmljb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGVyZSBpcyBubyB0YXJnZXQgLT4gcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCcmluZyB0aGUgaWNvbiB3aXRoIHRoZSBnaXZlbiBpbmRleCB0byB0aGUgZnJvbnQgb2YgdGhlIGljb25zIGFycmF5XHJcbiAgICAgKiBCZWluZyBpbiBmcm9udCBvZiB0aGUgYXJyYXkgbWVhbnMgXCJzZWxlY3RlZFwiXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNlbGVjdEljb24oaW5kZXgpIHtcclxuICAgICAgICBsZXQgaWNvblRlbXAgPSB0aGlzLmljb25zW2luZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5pY29ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmljb25zLnVuc2hpZnQoaWNvblRlbXApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXNlbGVjdCB0aGUgbGFzdCBhY3RpdmUgaWNvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLmljb25zWzFdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWNvbnNbMV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmljb25zWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCcmluZ3MgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIGluZGV4IHRvIHRoZSBmcm9udCBvZiB0aGVpciByZXNwZWN0aXZlIGFycmF5c1xyXG4gICAgICogQmVpbmcgaW4gZnJvbnQgb2YgdGhlIGFycmF5IG1lYW5zIFwic2VsZWN0ZWRcIlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RXaW5kb3dQYW5lbEFwcChpbmRleCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFwcGxpY2F0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IGFwcGxpY2F0aW9uVGVtcCA9IHRoaXMuYXBwbGljYXRpb25zW2luZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMudW5zaGlmdChhcHBsaWNhdGlvblRlbXApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgd2luZG93VGVtcCA9IHRoaXMud2luZG93c1tpbmRleF07XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3MudW5zaGlmdCh3aW5kb3dUZW1wKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMud2luZG93c1sxXSkge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd3NbMV0uc2V0SXNTZWxlY3RlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLndpbmRvd3NbMF0uc2V0SXNTZWxlY3RlZCh0cnVlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFuZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcGFuZWxUZW1wID0gdGhpcy5wYW5lbHNbaW5kZXhdO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy51bnNoaWZ0KHBhbmVsVGVtcCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhbmVsc1sxXSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsc1sxXS5zZXRJc1NlbGVjdGVkKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGFuZWxzWzBdLnNldElzU2VsZWN0ZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdpdmUgd2luZG93cyB6LWluZGV4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFwcGxpY2F0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd3NbaV0uZ2V0Q29udGFpbmVyKCkuc3R5bGUuekluZGV4ID0gdGhpcy5pY29ucy5sZW5ndGggKyB0aGlzLmFwcGxpY2F0aW9ucy5sZW5ndGggLSBpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFrZSBzdXJlIHN0YXJ0LCBjbG9jayBhbmQgYm90dG9tIGJhciBhbHdheXMgaXMgb24gdG9wXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHRvcFpJbmRleCA9IHRoaXMuYXBwbGljYXRpb25zLmxlbmd0aCArIHRoaXMuaWNvbnMubGVuZ3RoO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0LnN0eWxlLnpJbmRleCA9IHRvcFpJbmRleCArIDE7XHJcbiAgICAgICAgdGhpcy5jbG9jay5zdHlsZS56SW5kZXggPSB0b3BaSW5kZXggKyAxO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQmFyLnN0eWxlLnpJbmRleCA9IHRvcFpJbmRleCArIDI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9zZSBhIHdpbmRvdyB3aXRoIGEgZ2l2ZW4gaW5kZXhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2xvc2VXaW5kb3coaW5kZXgpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxsIHRoZSBjbG9zZSBmdW5jdGlvbiBpbXBsZW1lbnRlZCBieSBldmVyeSBhcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zW2luZGV4XS5jbG9zZSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgdGhlIHdpbmRvdyBhbmQgcGFuZWwgZnJvbSB0aGUgRE9NXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5nZXRDb250YWluZXIoKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMud2luZG93c1tpbmRleF0uZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVsc1tpbmRleF0uZ2V0Q29udGFpbmVyKCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnBhbmVsc1tpbmRleF0uZ2V0Q29udGFpbmVyKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZW1vdmUgdGhlIHdpbmRvdywgcGFuZWwgYW5kIGFwcGxpY2F0aW9uIGZyb20gdGhlaXIgcmVzcGVjdGl2ZSBhcnJheXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndpbmRvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB0aGlzLnBhbmVscy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gYSBwYW5lbCBpcyByZW1vdmVkLCBtYWtlIHN1cmUgdGhlIG90aGVyIHBhbmVscycgd2lkdGggaXMgY29ycmVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICBjYWxjdWxhdGVQYW5lbHNXaWR0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgd2lkdGggb2YgdGhlIHBhbmVscywgbWFraW5nIHN1cmUgYWxsIHBhbmVscyBmaXQgaW4gdGhlIGJvdHRvbSBiYXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlUGFuZWxzV2lkdGgoKSB7XHJcbiAgICAgICAgbGV0IHBhbmVsV2lkdGggPSAxODggKiB0aGlzLnBhbmVscy5sZW5ndGggKyAxMDA7XHJcblxyXG4gICAgICAgIGxldCBwd2RXaWR0aCA9IHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoO1xyXG5cclxuICAgICAgICBpZiAocGFuZWxXaWR0aCA+IHB3ZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYW5lbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYW5lbEVsZW0gPSB0aGlzLnBhbmVsc1tpXS5nZXRDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYW5lbEVsZW0uc3R5bGUud2lkdGggPSB0aGlzLnBhbmVsc1dyYXBwZXIub2Zmc2V0V2lkdGggLyB0aGlzLnBhbmVscy5sZW5ndGggLSA4ICsgXCJweFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoIGFuIGFwcGxpY2F0aW9uLCB3aW5kb3cgYW5kIHBhbmVsIHVzaW5nIHRoZSBtZXRhIGRhdGEgaW4gYSBnaXZlbiBpY29uIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsYXVuY2hBcHBsaWNhdGlvbihpY29uT2JqKSB7XHJcbiAgICAgICAgbGV0IGlkID0gdGhpcy53aW5kb3dzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIGEgbmV3IHdpbmRvdyB0byBsYXVuY2ggdGhlIGFwcGxpY2F0aW9uIGluXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IG5ldyBNeVdpbmRvdyh7XHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy53aW5kb3dDb3VudGVyLFxyXG4gICAgICAgICAgICBcIndpbmRvd1NpemVcIjogaWNvbk9iai5nZXRXaW5kb3dTaXplKCksXHJcbiAgICAgICAgICAgIFwidG9wQmFyVGV4dFwiOiBpY29uT2JqLmdldEljb25UZXh0KCksXHJcbiAgICAgICAgICAgIFwidG9wQmFySWNvblwiOiBpY29uT2JqLmdldEljb25JbWFnZSgpLFxyXG4gICAgICAgICAgICBcInpJbmRleFwiOiB0aGlzLmljb25zLmxlbmd0aCxcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIiA6IGljb25PYmouZ2V0QmFja2dyb3VuZENvbG9yKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnB1c2gocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHdkV2luZG93LmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIGV2ZXJ5IHdpbmRvdyB0aGVyZSBpcyBhbHNvIGEgcGFuZWwgaW4gdGhlIGJvdHRvbSBiYXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcHdkUGFuZWwgPSBuZXcgUGFuZWwoe1xyXG4gICAgICAgICAgICBcInRleHRcIjogaWNvbk9iai5nZXRJY29uVGV4dCgpLFxyXG4gICAgICAgICAgICBcImljb25cIjogaWNvbk9iai5nZXRJY29uSW1hZ2UoKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmVscy5wdXNoKHB3ZFBhbmVsKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lbHNXcmFwcGVyLmFwcGVuZENoaWxkKHB3ZFBhbmVsLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2hlbiBhIG5ldyBwYW5lbCBpcyBtYWRlLCBtYWtlIHN1cmUgd2lkdGggaXMgY29ycmVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNhbGN1bGF0ZVBhbmVsc1dpZHRoKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBhcHBsaWNhdGlvbk5hbWUgPSBpY29uT2JqLmdldEFwcGxpY2F0aW9uTmFtZSgpO1xyXG5cclxuICAgICAgICBsZXQgYXBwbGljYXRpb25PYmogPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChhcHBsaWNhdGlvbk5hbWUgPT09IFwiTWVtb3J5XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgTWVtb3J5KHtcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI1BXRC13aW5kb3dfY29udGVudC1cIiArIHRoaXMud2luZG93Q291bnRlclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFwcGxpY2F0aW9uTmFtZSA9PT0gXCJDaGF0XCIpIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25PYmogPSBuZXcgQ2hhdCh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLndpbmRvd0NvdW50ZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcHBsaWNhdGlvbk5hbWUgPT09IFwiU2V0dGluZ3NcIikge1xyXG4gICAgICAgICAgICBhcHBsaWNhdGlvbk9iaiA9IG5ldyBTZXR0aW5ncyh7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNQV0Qtd2luZG93X2NvbnRlbnQtXCIgKyB0aGlzLndpbmRvd0NvdW50ZXIsXHJcbiAgICAgICAgICAgICAgICBcImFwaVwiOiBnZXRBcGkoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXBwbGljYXRpb25PYmogaW5zdGFuY2VvZiBBcHBsaWNhdGlvbikge1xyXG4gICAgICAgICAgICBlcnJvcihcIlRoZSBhcHBsaWNhdGlvbiBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgQXBwbGljYXRpb24uXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMucHVzaChhcHBsaWNhdGlvbk9iaik7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gd2luZG93LCBwYW5lbCBhbmQgYXBwbGljYXRpb24gaGFzIG5vdyBiZWVuIG1hZGUgLT4gbWFrZSB0aGVtIHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2VsZWN0V2luZG93UGFuZWxBcHAodGhpcy5hcHBsaWNhdGlvbnMubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93Q291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIEFQSSBpcyB1c2VkIGJ5IGFwcGxpY2F0aW9ucyB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBQV0RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QXBpKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFwaSBpbnN0YW5jZW9mIE15QVBJKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBBUEkgaXMgcHJvdmlkZWQgc29tZSBzZXR0aW5nc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYXBpID0gbmV3IE15QVBJKHtcclxuICAgICAgICAgICAgXCJwd2RDb250YWluZXJcIjogdGhpcy5jb250YWluZXJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpO1xyXG4gICAgfVxyXG59XHJcblxyXG5QV0QucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBXRDtcclxuIiwiZnVuY3Rpb24gUGFuZWwoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHRoaXMudGV4dCA9IHNldHRpbmdzLnRleHQgPyBzZXR0aW5ncy50ZXh0IDogXCJubyB0ZXh0XCI7XHJcblxyXG4gICAgdGhpcy5pY29uID0gc2V0dGluZ3MuaWNvbiA/IHNldHRpbmdzLmljb24gOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gc2V0dGluZ3MuaXNTZWxlY3RlZCA/IHNldHRpbmdzLmlzU2VsZWN0ZWQgOiBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5ocmVmID0gXCIjXCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbFwiKTtcclxuXHJcbiAgICBsZXQgaWNvbkVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgaWNvbkVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uO1xyXG4gICAgaWNvbkVsZW0uYWx0ID0gXCJJY29uXCI7XHJcbiAgICBpY29uRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9faWNvblwiKTtcclxuXHJcbiAgICBsZXQgc3BhbkVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHNwYW5FbGVtLmNsYXNzTGlzdC5hZGQoXCJQV0QtYm90dG9tQmFyX3BhbmVsX19zcGFuXCIpO1xyXG4gICAgc3BhbkVsZW0udGV4dENvbnRlbnQgPSB0aGlzLnRleHQ7XHJcblxyXG4gICAgbGV0IGNsb3NlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgY2xvc2VFbGVtLmhyZWYgPSBcIiNcIjtcclxuICAgIGNsb3NlRWxlbS5jbGFzc0xpc3QuYWRkKFwiUFdELWJvdHRvbUJhcl9wYW5lbF9fY2xvc2VcIik7XHJcbiAgICBjbG9zZUVsZW0uY2xhc3NMaXN0LmFkZChcImlvbi1jbG9zZS1yb3VuZFwiKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uRWxlbSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzcGFuRWxlbSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9zZUVsZW0pO1xyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuZ2V0SXNTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZDtcclxufVxyXG5cclxuUGFuZWwucHJvdG90eXBlLnNldElzU2VsZWN0ZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc1NlbGVjdGVkID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5QYW5lbC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFuZWw7XHJcbiIsImNvbnN0IFBXRCA9IHJlcXVpcmUoXCIuL1BXRC5qc1wiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBwd2QgPSBuZXcgUFdEKHtcImNvbnRhaW5lclwiOiBcImJvZHlcIn0pO1xyXG59KTtcclxuIiwiZnVuY3Rpb24gQ2hhdChzZXR0aW5ncykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIm5vIGNvbnRhaW5lclwiO1xyXG5cclxuICAgIHRoaXMudXNlcm5hbWUgPSBzZXR0aW5ncy51c2VybmFtZSA/IHNldHRpbmdzLnVzZXJuYW1lIDogXCJzaW1vblwiO1xyXG5cclxuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIpO1xyXG4gICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgc29ja2V0T3BlbkV2ZW50KTtcclxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHNvY2tldE1lc3NhZ2VFdmVudCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBOYW1lIGNoYW5nZSBkaXZcclxuICAgIGxldCBuYW1lQ2hhbmdlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG5hbWVDaGFuZ2VEaXYuY2xhc3NMaXN0LmFkZChcImNoYXROYW1lQ2hhbmdlXCIpO1xyXG5cclxuICAgIGxldCBuYW1lQ2hhbmdlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgbmFtZUNoYW5nZVNwYW4udGV4dENvbnRlbnQgPSBcIlVzZXJuYW1lOiBcIiArIHRoaXMudXNlcm5hbWU7XHJcblxyXG4gICAgbGV0IG5hbWVDaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgbmFtZUNoYW5nZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbmFtZUNoYW5nZUV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgbmFtZUNoYW5nZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQ2hhbmdlIG5hbWVcIjtcclxuXHJcbiAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VTcGFuKTtcclxuICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUJ1dHRvbik7XHJcblxyXG4gICAgbGV0IG5hbWVDaGFuZ2VJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAvLyBNZXNzYWdlcyBkaXZcclxuICAgIGxldCBtZXNzYWdlc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBtZXNzYWdlc0Rpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdE1lc3NhZ2VzXCIpO1xyXG5cclxuICAgIC8vIElucHV0IGZvcm1cclxuICAgIGxldCBpbnB1dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmcm9tXCIpO1xyXG4gICAgaW5wdXREaXYuY2xhc3NMaXN0LmFkZChcImNoYXRJbnB1dFwiKTtcclxuXHJcbiAgICAvLyBUZXh0YXJlYSBpbiB0aGUgaW5wdXQgZGl2XHJcbiAgICBsZXQgaW5wdXREaXZfdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XHJcbiAgICBpbnB1dERpdl90ZXh0YXJlYS5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X3RleHRhcmVhXCIpO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgXCJXYWl0aW5nIGZvciBjb25uZWN0aW9uLi4uXCIpO1xyXG4gICAgaW5wdXREaXZfdGV4dGFyZWEuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRleHRhcmVhRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dERpdl90ZXh0YXJlYSk7XHJcblxyXG4gICAgLy8gQnV0dG9uIGluIHRoZSBpbnB1dCBkaXZcclxuICAgIGxldCBpbnB1dERpdl9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2hhdElucHV0X2J1dHRvblwiKTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgaW5wdXREaXZfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIGlucHV0RGl2X2J1dHRvbi50ZXh0Q29udGVudCA9IFwiU2VuZFwiO1xyXG4gICAgaW5wdXREaXYuYXBwZW5kQ2hpbGQoaW5wdXREaXZfYnV0dG9uKTtcclxuXHJcbiAgICAvLyBDaGF0IHdyYXBwZXJcclxuICAgIGxldCBjaGF0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdFdyYXBwZXJcIik7XHJcblxyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZURpdik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZXNzYWdlc0Rpdik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChpbnB1dERpdik7XHJcblxyXG4gICAgLy8gQ29udGFpbmVyIGRpdlxyXG4gICAgbGV0IGNvbnRhaW5lckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIGNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjaGF0V3JhcHBlckRpdik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc29ja2V0T3BlbkV2ZW50KGUpIHtcclxuICAgICAgICBpbnB1dERpdl90ZXh0YXJlYS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlucHV0RGl2X3RleHRhcmVhLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiRW50ZXIgbWVzc2FnZVwiKTtcclxuXHJcbiAgICAgICAgaW5wdXREaXZfYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc29ja2V0TWVzc2FnZUV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2UudHlwZSA9PT0gXCJoZWFydGJlYXRcIikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hhdE1lc3NhZ2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLmNsYXNzTGlzdC5hZGQoXCJjaGF0TWVzc2FnZVwiKTtcclxuXHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IFwiW1wiICsgcmVzcG9uc2UudHlwZSArIFwiXSBcIjtcclxuICAgICAgICBjaGF0TWVzc2FnZVNwYW4udGV4dENvbnRlbnQgKz0gcmVzcG9uc2UudXNlcm5hbWUgKyBcIjogXCI7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VTcGFuLnRleHRDb250ZW50ICs9IHJlc3BvbnNlLmRhdGE7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzRGl2LmFwcGVuZENoaWxkKGNoYXRNZXNzYWdlU3Bhbik7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzRGl2LnNjcm9sbFRvcCA9IG1lc3NhZ2VzRGl2LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBuYW1lQ2hhbmdlRXZlbnQoZSkge1xyXG4gICAgICAgIG5hbWVDaGFuZ2VEaXYudGV4dENvbnRlbnQgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAobmFtZUNoYW5nZUlucHV0LnZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUlucHV0KTtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VEaXYuYXBwZW5kQ2hpbGQobmFtZUNoYW5nZUJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlSW5wdXQudmFsdWUgPSB0aGlzLnVzZXJuYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBuYW1lQ2hhbmdlSW5wdXQudmFsdWU7XHJcblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNoYXRVc2VybmFtZVwiLCB0aGlzLnVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIG5hbWVDaGFuZ2VJbnB1dC52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlU3Bhbi50ZXh0Q29udGVudCA9IFwiVXNlcm5hbWU6IFwiICsgdGhpcy51c2VybmFtZTtcclxuICAgICAgICAgICAgbmFtZUNoYW5nZURpdi5hcHBlbmRDaGlsZChuYW1lQ2hhbmdlU3Bhbik7XHJcblxyXG4gICAgICAgICAgICBuYW1lQ2hhbmdlRGl2LmFwcGVuZENoaWxkKG5hbWVDaGFuZ2VCdXR0b24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBidXR0b25FdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gaW5wdXREaXZfdGV4dGFyZWEudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCB2YWx1ZSA9PT0gXCJcXG5cIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk11c3QgZW50ZXIgYSBtZXNzYWdlIVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlucHV0RGl2X3RleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJkYXRhXCIgOiB2YWx1ZSxcclxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGV4dGFyZWFFdmVudChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgcHJlc3NpbmcgZW50ZXIgYW5kIHNoaWZ0IGlzIG5vdCBwcmVzc2VkIC0+IGNsaWNrIGJ1dHRvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzICYmICFlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlucHV0RGl2X2J1dHRvbi5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuQ2hhdC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xyXG4iLCJjb25zdCBBcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi9BcHBsaWNhdGlvbi5qc1wiKTtcclxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBDaGF0U3RhcnQoc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGxldCBjb250YWluZXIgPSBzZXR0aW5ncy5jb250YWluZXIgPyBzZXR0aW5ncy5jb250YWluZXIgOiBcIm5vIGNvbnRhaW5lclwiO1xyXG5cclxuICAgIHRoaXMuY2hhdE9iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIFdyYXBwZXJcclxuICAgIGxldCBjaGF0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5jbGFzc0xpc3QuYWRkKFwiY2hhdFdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gQ2hhdCBzdGFydCBoZWFkZXJcclxuICAgIGxldCBjaGF0U3RhcnRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2hhdFN0YXJ0SGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnRIZWFkZXJcIik7XHJcbiAgICBjaGF0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChjaGF0U3RhcnRIZWFkZXIpO1xyXG5cclxuICAgIGxldCBjaGF0U3RhcnRIZWFkZXJTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBjaGF0U3RhcnRIZWFkZXJTcGFuLnRleHRDb250ZW50ID0gXCJTVVBFUkNIQVRcIjtcclxuICAgIGNoYXRTdGFydEhlYWRlci5hcHBlbmRDaGlsZChjaGF0U3RhcnRIZWFkZXJTcGFuKTtcclxuXHJcbiAgICAvLyBDaGF0IG5hbWUgaW5wdXRcclxuICAgIGxldCBjaGF0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgLy8gZml4IHRvIG1ha2UgaW5wdXQgc2VsZWN0YWJsZVxyXG4gICAgY2hhdE5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgIH0pO1xyXG4gICAgY2hhdE5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBcIkVudGVyIG5hbWUhXCIpO1xyXG4gICAgY2hhdE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKFwiY2hhdFN0YXJ0TmFtZUlucHV0XCIpO1xyXG4gICAgY2hhdFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoY2hhdE5hbWVJbnB1dCk7XHJcblxyXG4gICAgLy8gQ2hhdCBuYW1lIGJ1dHRvblxyXG4gICAgbGV0IGNoYXROYW1lQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjaGF0U3RhcnROYW1lQnV0dG9uXCIpO1xyXG4gICAgY2hhdE5hbWVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIGNoYXROYW1lQnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBjaGF0dGluZyFcIjtcclxuICAgIGNoYXRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGNoYXROYW1lQnV0dG9uKTtcclxuXHJcbiAgICAvLyBDb250YWluZXIgZGl2XHJcbiAgICBsZXQgY29udGFpbmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xyXG4gICAgY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIGEgdXNlcm5hbWUgZXhpc3RzIGluIGxvY2FsIHN0b3JhZ2UgLT4gc3RhcnQgY2hhdFxyXG4gICAgICovXHJcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjaGF0VXNlcm5hbWVcIikpIHtcclxuICAgICAgICBzZXR0aW5ncy51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2hhdFVzZXJuYW1lXCIpO1xyXG5cclxuICAgICAgICBjaGF0V3JhcHBlckRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNoYXRXcmFwcGVyRGl2KTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGF0T2JqID0gbmV3IENoYXQoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGNoYXROYW1lSW5wdXQudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVudGVyIGEgbmFtZSFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNoYXRVc2VybmFtZVwiLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHNldHRpbmdzLnVzZXJuYW1lID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGNoYXRXcmFwcGVyRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hhdFdyYXBwZXJEaXYpO1xyXG5cclxuICAgICAgICB0aGlzLmNoYXRPYmogPSBuZXcgQ2hhdChzZXR0aW5ncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNoYXRTdGFydC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XHJcbkNoYXRTdGFydC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDaGF0U3RhcnQ7XHJcblxyXG5DaGF0U3RhcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NpbmcgQ2hhdCBhcHBsaWNhdGlvbi4uLlwiKTtcclxuXHJcbiAgICBpZiAodGhpcy5jaGF0T2JqKSB7XHJcbiAgICAgICAgdGhpcy5jaGF0T2JqLmNsb3NlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhdFN0YXJ0O1xyXG4iLCJmdW5jdGlvbiBDYXJkKHZhbHVlKSB7XHJcbiAgICAvKipcclxuICAgICAqIFByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICBsZXQgY2FyZFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDYXJkVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgY2FyZFRlbXBsYXRlRnJhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUoY2FyZFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIC8vIFRoZSBjYXJkRWxlbSBpcyB0aGUgZWxlbWVudCB3cmFwcGluZyB0aGUgdHdvIGltYWdlc1xyXG4gICAgdGhpcy5jYXJkRWxlbSA9IGNhcmRUZW1wbGF0ZUZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlDYXJkXCIpO1xyXG4gICAgdGhpcy5jYXJkRWxlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIHRoaXMudmFsdWUpO1xyXG5cclxuICAgIC8vIFRoZSBjb3ZlckltYWdlIGlzIHRoZSBxdWVzdGlvbiBtYXJrIGFib3ZlIHRoZSBjYXJkIGltYWdlXHJcbiAgICB0aGlzLmNvdmVySW1hZ2UgPSB0aGlzLmNhcmRFbGVtLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q2FyZF9fYmFja1wiKTtcclxuICAgIHRoaXMuY292ZXJJbWFnZS5zcmMgPSBcImltYWdlL01lbW9yeS9cIiArIHRoaXMudmFsdWVbMF0gKyBcIi5wbmdcIjtcclxuXHJcbiAgICAvLyBUaGUgY2FyZEltYWdlIGlzIHRoZSBpbWFnZSBvZiB0aGUgbWVtb3J5IGNhcmRcclxuICAgIHRoaXMuY2FyZEltYWdlID0gdGhpcy5jYXJkRWxlbS5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNhcmRfX2Zyb250XCIpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdW5pcXVlIHZhbHVlIGZvciB0aGlzIGNhcmRcclxuICogVGhlIGNhcmQgaWRlbnRpZmllclxyXG4gKi9cclxuQ2FyZC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogRmxpcHMgdGhlIGNhcmRcclxuICovXHJcbkNhcmQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmlzRmxpcHBlZCkge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwibWVtb3J5Q2FyZC0tZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwibWVtb3J5Q2FyZC0tZmxpcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3ZlckltYWdlLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlDYXJkLS1iYWNrZmxpcFwiKTtcclxuICAgICAgICB0aGlzLmNhcmRJbWFnZS5jbGFzc0xpc3QuYWRkKFwibWVtb3J5Q2FyZC0tYmFja2ZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY292ZXJJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKFwibWVtb3J5Q2FyZC0tYmFja2ZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIm1lbW9yeUNhcmQtLWJhY2tmbGlwXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvdmVySW1hZ2UuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmQtLWZsaXBcIik7XHJcbiAgICAgICAgdGhpcy5jYXJkSW1hZ2UuY2xhc3NMaXN0LmFkZChcIm1lbW9yeUNhcmQtLWZsaXBcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaXNGbGlwcGVkID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuZ2V0SXNGbGlwcGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0ZsaXBwZWQ7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLnNldElzQ29tcGxldGUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5pc0NvbXBsZXRlID0gdmFsdWU7XHJcbn1cclxuXHJcbkNhcmQucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKSB7XHJcbiAgICB0aGlzLmNhcmRFbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxufVxyXG5cclxuQ2FyZC5wcm90b3R5cGUuZ2V0Q2FyZEVsZW0gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNhcmRFbGVtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmQ7XHJcbiIsImNvbnN0IENhcmQgPSByZXF1aXJlKFwiLi9DYXJkLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ2FyZHMobnJPZkNhcmRzKSB7XHJcbiAgICB0aGlzLmNhcmRzID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnJPZkNhcmRzICsgMTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkKGkgKyBcIlwiICsgMSkpO1xyXG4gICAgICAgIHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZChpICsgXCJcIiArIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNodWZmbGUgdGhlIGNhcmRzXHJcbiAgICAgKi9cclxuICAgIGZvciAobGV0IGkgPSB0aGlzLmNhcmRzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgIGxldCB0ZW1wID0gdGhpcy5jYXJkc1tpXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2ldID0gdGhpcy5jYXJkc1tqXTtcclxuICAgICAgICB0aGlzLmNhcmRzW2pdID0gdGVtcDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGNhcmQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIGxldCBjYXJkO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmNhcmRzW2ldLmdldFZhbHVlKCkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGNhcmQgPSB0aGlzLmNhcmRzW2ldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcmQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgZnJhZ21lbnQgY29udGFpbmluZyB0aGUgY2FyZCBkaXZzIGFuZCBpbWFnZXNcclxuICovXHJcbkNhcmRzLnByb3RvdHlwZS5nZXRDYXJkc0ZyYWcgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjYXJkc0ZyYWcgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjYXJkRWxlbSA9IHRoaXMuY2FyZHNbaV0uZ2V0Q2FyZEVsZW0oKTtcclxuICAgICAgICBjYXJkc0ZyYWcuYXBwZW5kQ2hpbGQoY2FyZEVsZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkc0ZyYWc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZHM7XHJcbiIsImNvbnN0IEFwcGxpY2F0aW9uID0gcmVxdWlyZShcIi4uLy4uL0FwcGxpY2F0aW9uLmpzXCIpO1xyXG5jb25zdCBNZW1vcnlHYW1lQm9hcmQgPSByZXF1aXJlKFwiLi9NZW1vcnlHYW1lQm9hcmQuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lKHNldHRpbmdzID0ge30pIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCIjMTIzXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICAvLyBXcmFwcGVyXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcIm1lbW9yeVdyYXBwZXJcIik7XHJcblxyXG4gICAgLy8gSGVhZGVyXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUhlYWRlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUhlYWRlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUhlYWRlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlIZWFkZXIgPSBtZW1vcnlIZWFkZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5SGVhZGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG5cclxuICAgIC8vIFBhaXIgZm9ybVxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJGb3JtVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyRm9ybVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybSA9IG1lbW9yeVBhaXJGb3JtRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhaXJGb3JtXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlQYWlyRm9ybSk7XHJcblxyXG4gICAgLy8gUmFkaW8gaW5wdXRzXHJcbiAgICBsZXQgbWVtb3J5UGFpclJhZGlvVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhaXJSYWRpb1RlbXBsYXRlXCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDg7IGkrKykge1xyXG4gICAgICAgIGxldCBtZW1vcnlQYWlyUmFkaW9GcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYWlyUmFkaW9UZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuXHJcbiAgICAgICAgbGV0IG1lbW9yeVBhaXJMYWJlbCA9IG1lbW9yeVBhaXJSYWRpb0ZyYWcucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlQYWlyUmFkaW9MYWJlbFwiKTtcclxuICAgICAgICBsZXQgbWVtb3J5UGFpclJhZGlvID0gbWVtb3J5UGFpckxhYmVsLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgbWVtb3J5UGFpckxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGkgKyBcIiBwYWlyc1wiKSk7XHJcbiAgICAgICAgLy8gRml4IHRvIG1ha2UgcmFkaW8gaW5wdXRzIGNsaWNrYWJsZVxyXG4gICAgICAgIG1lbW9yeVBhaXJMYWJlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWVtb3J5UGFpclJhZGlvLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGkpO1xyXG5cclxuICAgICAgICBtZW1vcnlQYWlyRm9ybS5hcHBlbmRDaGlsZChtZW1vcnlQYWlyTGFiZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZvcm0gYnV0dG9uXHJcbiAgICBsZXQgbWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5UGFpckZvcm1CdXR0b25UZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlQYWlyRm9ybUJ1dHRvbkZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeVBhaXJGb3JtQnV0dG9uVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeVBhaXJGb3JtQnV0dG9uID0gbWVtb3J5UGFpckZvcm1CdXR0b25GcmFnLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XHJcbiAgICBtZW1vcnlQYWlyRm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWVtb3J5UGFpckZvcm1CdXR0b25FdmVudCk7XHJcblxyXG4gICAgbWVtb3J5UGFpckZvcm0uYXBwZW5kQ2hpbGQobWVtb3J5UGFpckZvcm1CdXR0b24pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1lbW9yeVBhaXJGb3JtQnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgbGV0IG5yT2ZQYWlycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5UGFpckZvcm0gaW5wdXQ6Y2hlY2tlZFwiKS52YWx1ZTtcclxuXHJcbiAgICAgICAgbWVtb3J5V3JhcHBlckRpdi5yZW1vdmVDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG4gICAgICAgIG1lbW9yeVdyYXBwZXJEaXYucmVtb3ZlQ2hpbGQobWVtb3J5UGFpckZvcm0pO1xyXG5cclxuICAgICAgICBzZXR0aW5ncy5uck9mUGFpcnMgPSBwYXJzZUludChuck9mUGFpcnMpO1xyXG5cclxuICAgICAgICBuZXcgTWVtb3J5R2FtZUJvYXJkKHNldHRpbmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuTWVtb3J5R2FtZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XHJcbk1lbW9yeUdhbWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWVtb3J5R2FtZTtcclxuXHJcbk1lbW9yeUdhbWUucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NpbmcgTWVtb3J5IGFwcGxpY2F0aW9uLi4uXCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWU7XHJcbiIsImNvbnN0IENhcmRzID0gcmVxdWlyZShcIi4vQ2FyZHMuanNcIik7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlHYW1lQm9hcmQoc2V0dGluZ3MpIHtcclxuICAgIC8qKlxyXG4gICAgICogUHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBsZXQgY29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyID8gc2V0dGluZ3MuY29udGFpbmVyIDogXCIjY29vbFwiO1xyXG5cclxuICAgIGxldCBuck9mUGFpcnMgPSBzZXR0aW5ncy5uck9mUGFpcnMgPyBzZXR0aW5ncy5uck9mUGFpcnMgOiA0O1xyXG5cclxuICAgIGxldCBjYXJkcyA9IG5ldyBDYXJkcyhuck9mUGFpcnMpO1xyXG5cclxuICAgIGxldCBzY29yZSA9IDA7XHJcblxyXG4gICAgbGV0IGdhbWVUaW1lciA9IC0xO1xyXG5cclxuICAgIGxldCBhdHRlbXB0cyA9IDA7XHJcblxyXG4gICAgbGV0IGZpcnN0Q2FyZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgc2Vjb25kQ2FyZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgaXNDaGVja2luZ0Fuc3dlciA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBnYW1lVGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKHRpbWVyLCAxMDAwKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVMZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIC8vIE1lbW9yeSB3cmFwcGVyXHJcbiAgICBsZXQgbWVtb3J5V3JhcHBlckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcIm1lbW9yeVdyYXBwZXJcIik7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZW1vcnlXcmFwcGVyQ2xpY2tFdmVudCk7XHJcblxyXG4gICAgLy8gSGVhZGVyXHJcbiAgICBsZXQgbWVtb3J5SGVhZGVyVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUhlYWRlclRlbXBsYXRlXCIpO1xyXG4gICAgbGV0IG1lbW9yeUhlYWRlckZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUhlYWRlclRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlIZWFkZXIgPSBtZW1vcnlIZWFkZXJGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5SGVhZGVyXCIpO1xyXG4gICAgbWVtb3J5V3JhcHBlckRpdi5hcHBlbmRDaGlsZChtZW1vcnlIZWFkZXIpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBwYW5lbFxyXG4gICAgbGV0IG1lbW9yeVBhbmVsVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVBhbmVsVGVtcGxhdGVcIik7XHJcbiAgICBsZXQgbWVtb3J5UGFuZWxGcmFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZW1vcnlQYW5lbFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG5cclxuICAgIGxldCBtZW1vcnlQYW5lbERpdiAgICAgICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhbmVsXCIpO1xyXG4gICAgbGV0IG1lbW9yeVBhbmVsQXR0ZW1wdHNTcGFuID0gbWVtb3J5UGFuZWxGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5UGFuZWxfX2F0dGVtcHRzU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbFRpbWVTcGFuICAgICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhbmVsX190aW1lU3BhblwiKTtcclxuICAgIGxldCBtZW1vcnlQYW5lbE1lc3NhZ2VTcGFuICA9IG1lbW9yeVBhbmVsRnJhZy5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVBhbmVsX19tZXNzYWdlU3BhblwiKTtcclxuICAgIG1lbW9yeVdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQobWVtb3J5UGFuZWxEaXYpO1xyXG5cclxuICAgIC8vIE1lbW9yeSBjYXJkc1xyXG4gICAgbGV0IG1lbW95Q2FyZHNUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q2FyZHNUZW1wbGF0ZVwiKTtcclxuICAgIGxldCBtZW1vcnlDYXJkc0ZyYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lbW9yeUNhcmRzVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IG1lbW9yeUNhcmRzRGl2ID0gbWVtb3J5Q2FyZHNGcmFnLnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q2FyZHNcIik7XHJcbiAgICBtZW1vcnlDYXJkc0Rpdi5hcHBlbmRDaGlsZChjYXJkcy5nZXRDYXJkc0ZyYWcoKSk7XHJcbiAgICBtZW1vcnlXcmFwcGVyRGl2LmFwcGVuZENoaWxkKG1lbW9yeUNhcmRzRGl2KTtcclxuXHJcbiAgICB0aW1lcigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHRpbWVyKCkge1xyXG4gICAgICAgIGdhbWVUaW1lciArPSAxO1xyXG5cclxuICAgICAgICBtZW1vcnlQYW5lbEF0dGVtcHRzU3Bhbi50ZXh0Q29udGVudCA9IFwiQXR0ZW1wdHM6IFwiICsgYXR0ZW1wdHM7XHJcbiAgICAgICAgbWVtb3J5UGFuZWxUaW1lU3Bhbi50ZXh0Q29udGVudCA9IFwiVGltZTogXCIgKyBnYW1lVGltZXIgKyBcIiBzZWNvbmRzXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWVtb3J5V3JhcHBlckNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgaXMgY3VycmVudGx5IGNoZWNraW5nIGFuc3dlciAtPiBleGl0IGZ1bmN0aW9uXHJcbiAgICAgICAgICogKHdhaXRpbmcgZm9yIHRpbWVyIHRvIGZpbmlzaClcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaXNDaGVja2luZ0Fuc3dlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW1nRWxlbSA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBsZXQgYUVsZW0gPSBpbWdFbGVtLm5vZGVOYW1lID09PSBcIklNR1wiID8gaW1nRWxlbS5wYXJlbnROb2RlIDogaW1nRWxlbTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0gYUVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNhcmQgPSBjYXJkcy5nZXRDYXJkKHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGNhcmQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuZ2V0SXNGbGlwcGVkKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmZsaXAoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RDYXJkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdENhcmQgPSBjYXJkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRDYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tBbnN3ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja0Fuc3dlcigpIHtcclxuICAgICAgICBpc0NoZWNraW5nQW5zd2VyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgYXR0ZW1wdHMgKz0gMTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlzQ2hlY2tpbmdBbnN3ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaXJzdENhcmQuZ2V0VmFsdWUoKVswXSA9PT0gc2Vjb25kQ2FyZC5nZXRWYWx1ZSgpWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZENhcmQuc2V0SXNDb21wbGV0ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaXJzdENhcmQuYWRkQ2xhc3MoXCJtZW1vcnlDYXJkLS1jb3JyZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQ2FyZC5hZGRDbGFzcyhcIm1lbW9yeUNhcmQtLWNvcnJlY3RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcmUgKz0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIHNjb3JlIGlzIGVxdWFsIHRvIG1heGltdW0gYW1vdW50IG9mIHBhaXJzIC0+IHRoZSBnYW1lIGlzIGNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChzY29yZSA9PT0gbnJPZlBhaXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChnYW1lVGltZXJJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5UGFuZWxNZXNzYWdlU3Bhbi50ZXh0Q29udGVudCA9IFwiWW91IGNvbXBsZXRlZCB0aGUgZ2FtZSFcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0Q2FyZC5mbGlwKCk7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRDYXJkLmZsaXAoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlyc3RDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBzZWNvbmRDYXJkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUdhbWVCb2FyZDtcclxuIiwiY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKFwiLi4vLi4vQXBwbGljYXRpb24uanNcIik7XHJcblxyXG5mdW5jdGlvbiBTZXR0aW5ncyhzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBBcHBsaWNhdGlvbi5jYWxsKHRoaXMsIHtcclxuICAgICAgIFwiYXBpXCI6IHNldHRpbmdzLmFwaVxyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50c1xyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lciA/IHNldHRpbmdzLmNvbnRhaW5lciA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLndpbmRvd0RpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpO1xyXG4gICAgdGhpcy53aW5kb3dEaXYuY2xhc3NMaXN0LmFkZChcInNldHRpbmdzV3JhcHBlclwiKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJhY2tncm91bmRcclxuICAgICAqL1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZFRpdGxlLnRleHRDb250ZW50ID0gXCJDaGFuZ2UgYmFja2dyb3VuZFwiO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZEZvcm0uY2xhc3NMaXN0LmFkZChcInNldHRpbmdzQmFja2dyb3VuZEZvcm1cIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICBsZXQgZm9ybUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGZvcm1MYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJiYWNrZ3JvdW5kRm9ybVwiICsgdGhpcy5jb250YWluZXIgKyBpKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcm1SYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImJhY2tncm91bmRcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiYmFja2dyb3VuZEZvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XG5cbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibWFpbl9iYWNrZ3JvdW5kXCIpID09PSBcIm1haW4tLWJhY2tncm91bmQtXCIgKyBpKSB7XG4gICAgICAgICAgICBmb3JtUmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZvcm1JbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgZm9ybUltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4vaW1hZ2UvYmFja2dyb3VuZFwiICsgaSArIFwiX3NtYWxsLmpwZ1wiKTtcclxuICAgICAgICBmb3JtSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiQmFja2dyb3VuZFwiKTtcclxuXHJcbiAgICAgICAgZm9ybUxhYmVsLmFwcGVuZENoaWxkKGZvcm1SYWRpbyk7XHJcbiAgICAgICAgZm9ybUxhYmVsLmFwcGVuZENoaWxkKGZvcm1JbWFnZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZEZvcm0uYXBwZW5kQ2hpbGQoZm9ybUxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJhY2tncm91bmRUaXRsZSk7XHJcbiAgICB0aGlzLmJhY2tncm91bmRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZEZvcm0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSByZXNvbHV0aW9uXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZGlzcGxheVJlc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIHRoaXMuZGlzcGxheVJlc1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB0aGlzLmRpc3BsYXlSZXNUaXRsZS50ZXh0Q29udGVudCA9IFwiQ2hhbmdlIERpc3BsYXkgUmVzb2x1dGlvblwiO1xyXG5cclxuICAgIHRoaXMuZGlzcGxheVJlc0Zvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIHRoaXMuZGlzcGxheVJlc0Zvcm0uY2xhc3NMaXN0LmFkZChcInNldHRpbmdzRGlzcGxheVJlc0Zvcm1cIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICBsZXQgZm9ybUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGZvcm1MYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJkaXNwbGF5UmVzRm9ybVwiICsgdGhpcy5jb250YWluZXIgKyBpKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcm1SYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xyXG4gICAgICAgIGZvcm1SYWRpby5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBpKTtcclxuICAgICAgICBmb3JtUmFkaW8uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImRpc3BsYXlSZXNcIik7XHJcbiAgICAgICAgZm9ybVJhZGlvLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiZGlzcGxheVJlc0Zvcm1cIiArIHRoaXMuY29udGFpbmVyICsgaSk7XHJcblxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1haW5fZGlzcGxheVJlc1wiKSA9PT0gXCJtYWluLS1kaXNwbGF5UmVzLVwiICsgaSkge1xyXG4gICAgICAgICAgICBmb3JtUmFkaW8uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZm9ybVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgZm9ybUxhYmVsLmFwcGVuZENoaWxkKGZvcm1SYWRpbyk7XHJcbiAgICAgICAgZm9ybUxhYmVsLmFwcGVuZENoaWxkKGZvcm1TcGFuKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5UmVzRm9ybS5hcHBlbmRDaGlsZChmb3JtTGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlSZXNXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheVJlc1RpdGxlKTtcclxuICAgIHRoaXMuZGlzcGxheVJlc1dyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5kaXNwbGF5UmVzRm9ybSk7XHJcblxyXG4gICAgbGV0IHNwYW5zID0gdGhpcy5kaXNwbGF5UmVzV3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcclxuICAgIHNwYW5zWzFdLnRleHRDb250ZW50ID0gXCIxMjgweDcyMFwiO1xyXG4gICAgc3BhbnNbMl0udGV4dENvbnRlbnQgPSBcIjE2MDB4OTAwXCI7XHJcbiAgICBzcGFuc1szXS50ZXh0Q29udGVudCA9IFwiMTkyMHgxMDgwXCI7XHJcbiAgICBzcGFuc1s0XS50ZXh0Q29udGVudCA9IFwiMjQ2MHgxNDAwXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTYXZlIGJ1dHRvblxyXG4gICAgICovXHJcbiAgICB0aGlzLnNhdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5nc0J1dHRvblwiKTtcclxuICAgIHRoaXMuc2F2ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zYXZlQnV0dG9uLnRleHRDb250ZW50ID0gXCJTYXZlXCI7XHJcbiAgICB0aGlzLnNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNhdmVCdXR0b25FdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuc2V0dGluZ3MuY2xhc3NMaXN0LmFkZChcInNldHRpbmdzXCIpO1xyXG5cclxuICAgIHRoaXMuc2V0dGluZ3MuYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kV3JhcHBlcik7XHJcbiAgICB0aGlzLnNldHRpbmdzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoclwiKSk7XHJcbiAgICB0aGlzLnNldHRpbmdzLmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheVJlc1dyYXBwZXIpO1xyXG4gICAgdGhpcy5zZXR0aW5ncy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIikpO1xyXG5cclxuICAgIHRoaXMud2luZG93RGl2LmFwcGVuZENoaWxkKHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy53aW5kb3dEaXYuYXBwZW5kQ2hpbGQodGhpcy5zYXZlQnV0dG9uKTtcclxuXHJcbiAgICBmdW5jdGlvbiBzYXZlQnV0dG9uRXZlbnQoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFja2dyb3VuZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kSW5wdXRzID0gdGhpcy5iYWNrZ3JvdW5kRm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmFja2dyb3VuZElucHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYmFja2dyb3VuZElucHV0c1tpXS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwaS5zZXRQd2RCYWNrZ3JvdW5kKGkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibWFpbl9iYWNrZ3JvdW5kXCIsIFwibWFpbi0tYmFja2dyb3VuZC1cIiArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGlzcGxheVJlc0lucHV0cyA9IHRoaXMuZGlzcGxheVJlc0Zvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpc3BsYXlSZXNJbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGRpc3BsYXlSZXNJbnB1dHNbaV0uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcGkuc2V0UHdkRGlzcGxheVJlc29sdXRpb24oaSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtYWluX2Rpc3BsYXlSZXNcIiwgXCJtYWluLS1kaXNwbGF5UmVzLVwiICsgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblNldHRpbmdzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwbGljYXRpb24ucHJvdG90eXBlKTtcclxuU2V0dGluZ3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2V0dGluZ3M7XHJcblxyXG5TZXR0aW5ncy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2luZyBTZXR0aW5ncyBhcHBsaWNhdGlvbi4uLlwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcclxuIl19
