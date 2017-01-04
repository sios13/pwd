const Window = require("./MyWindow.js");
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
         * Properties
         */
        this.windows = [];

        this.panels = [];

        this.icons = [];

        this.applications = [];

        this.pwdWidth = "1280px";

        this.pwdHeight = "720px";

        /**
         * Elements
         */
        this.container = document.createElement("main");

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

        this.bottomBar = document.createElement("div");
        this.bottomBar.classList.add("PWD-bottomBar");

        this.bottomBar.appendChild(this.startButton);
        this.bottomBar.appendChild(this.clockButton);

        this.container.appendChild(this.start);
        this.container.appendChild(this.clock);
        this.container.appendChild(this.bottomBar);
        this.container.style.width = this.pwdWidth;
        this.container.style.height = this.pwdHeight;

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

        /**
         * Append the icons to the container
         */
        for (let i = 0; i < this.icons.length; i++) {
            this.container.appendChild(this.icons[i].getContainer());
        }

        for (let i = 0; i < 35; i++) {
            launchApplication(this.icons[1]);
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

            if (!this.clock.classList.contains("PWD-clock--hide")) {
                this.clock.classList.add("PWD-clock--hide");
            }

            if (!this.start.classList.contains("PWD-start--hide")) {
                this.start.classList.add("PWD-start--hide");
            }

            return;
        }

        /**
         * If target is a window
         */
        if (this.target instanceof Window) {
            this.target.setIsDragging(false);

            window.removeEventListener("mousemove", entityMoveEvent);
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
            let width = parseInt(this.pwdWidth)*0.92/this.panels.length - 8;

            for (let i = 0; i < this.panels.length; i++) {
                this.panels[i].getContainer().style.width = width + "px";
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

        this.bottomBar.appendChild(pwdPanel.getContainer());

        /**
         * When a new panel is made, make sure width is correct
         */
        calculatePanelWidth();

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
