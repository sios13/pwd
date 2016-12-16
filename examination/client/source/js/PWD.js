const Window = require("./Window.js");
const Icon = require("./Icon.js");
const Memory = require("./apps/Memory/MemoryGame.js");

function PWD(settings = {}) {
    let container = document.createElement("main");

    document.querySelector(settings.container).appendChild(container);

    let windows = [];

    let icons = [];

    let pwdWidth = 1300;

    let pwdHeight = 600;

    let windowsMadeCounter = 0;

    /**
     * Create the icons
     */
    icons.push( new Icon({
        "id": 0,
        "applicationName": "Memory",
        //"iconImage": "memory.png",
        "windowSize": "medium"
    }) );

    /**
     * Append the icons to the container
     */
    for (let i = 0; i < icons.length; i++) {
        container.appendChild(icons[i].getContainer());
    }

    addListeners.bind(this)();

    function addListeners() {
        window.addEventListener("mousedown", function(e) {
            e.preventDefault();

            /**
             * Make all windows inactive
             */
            for (let i = 0; i < windows.length; i++) {
                 windows[i].setIsActive(false);
            }

            /**
             * Iterate the windows
             */
            for (let i = 0; i < windows.length; i++) {
                /**
                 * If a mousedown has been made inside a window
                 */
                if (windows[i].getContainer().contains(e.target)) {
                    /**
                     * Make the window active
                     */
                    windows[i].setIsActive(true);

                    /**
                     * If a mousedown has been made on a top bar -> start dragging
                     */
                    let windowTopBarElem = windows[i].getContainer().querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", windowMoveEvent);
                    }
                }
            }

            /**
             * Deselect all icons
             */
            for (let i = 0; i < icons.length; i++) {
                icons[i].setIsSelected(false);
            }

            /**
             * Iterate the icons
             */
            for (let i = 0; i < icons.length; i++) {
                /**
                 * If a mousedown has been made on an icon -> mark it as selected
                 */
                if (icons[i].getContainer().contains(e.target)) {
                    icons[i].setIsSelected(true);
                }
            }
        });

        window.addEventListener("mouseup", function(e) {
            e.preventDefault();

            window.removeEventListener("mousemove", windowMoveEvent);
            /**
             * ALl windows stop dragging
             */
            for (let i = 0; i < windows.length; i++) {
                windows[i].setIsDragging(false);
            }

            console.log("up");
        });

        window.addEventListener("click", function(e) {
            e.preventDefault();
        });

        window.addEventListener("dblclick", function(e) {
            e.preventDefault();

            for (let i = 0; i < icons.length; i++) {
                /**
                 * if a doubleclick has been made on an icon -> launch the associated application
                 */
                if (icons[i].getContainer().contains(e.target)) {
                    launchApplication(icons[i]);
                }
            }
        });
    }

    function getNewWindowXPos() {

    }

    function getNewWindowYPos() {

    }

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let pwdWindow = new Window({
            "windowSize": iconObj.getWindowSize(),
            "name": iconObj.getApplicationName(),
            "xPos": (100 + 15 * windowsMadeCounter),
            "yPos": (20 + 30 * windowsMadeCounter)
        });

        windowsMadeCounter += 1;

        windows.push(pwdWindow);

        container.appendChild(pwdWindow.getContainer());

        if (iconObj.getApplicationName() === "Memory") {
            let memory = new Memory({
                "container": "#PWD-window_content-" + pwdWindow.getId()
            });
        }
    }

    /**
     * Update the position of the active window
     */
    function windowMoveEvent(e) {
        /**
         * Find the active window
         */
        let pwdWindow = undefined;

        for (let i = 0; i < windows.length; i++) {
            if (windows[i].getIsActive()) {
                pwdWindow = windows[i];
                break;
            }
        }

        /**
         * If a window is found -> update its position
         */
        if (pwdWindow) {
            pwdWindow.setIsDragging(true);

            let movementX = e.movementX;
            let movementY = e.movementY;

            if ((pwdWindow.getXPos() + movementX + pwdWindow.getWidth()) > pwdWidth) {
                movementX = 0;
            }

            if (pwdWindow.getXPos() + movementX < 0) {
                movementX = 0;
            }

            if ((pwdWindow.getYPos() + movementY + pwdWindow.getHeight()) > pwdHeight) {
                movementY = 0;
            }

            if (pwdWindow.getYPos() + movementY < 0) {
                movementY = 0;
            }

            pwdWindow.updatePos(movementX, movementY);
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;
