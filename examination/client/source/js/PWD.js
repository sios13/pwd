const Window = require("./Window.js");
const Icon = require("./Icon.js");
const Memory = require("./apps/Memory/MemoryGame.js");

function PWD(settings = {}) {
    let container = document.createElement("main");

    document.querySelector(settings.container).appendChild(container);

    let windows = [];

    let icons = [];

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
                let windowElem = windows[i].getContainer();

                /**
                 * If a mousedown has been made inside a window
                 */
                if (windowElem.contains(e.target)) {
                    /**
                     * Make the window active
                     */
                    windows[i].setIsActive(true);

                    /**
                     * If a mousedown has been made inside a top bar -> start dragging
                     */
                    let windowTopBarElem = windowElem.querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", windowMoveEvent);

                        windows[i].setIsDragging(true);
                    }
                }
            }
        });

        window.addEventListener("mouseup", function() {
            window.removeEventListener("mousemove", windowMoveEvent);
            /**
             * ALl windows stop dragging
             */
            for (let i = 0; i < windows.length; i++) {
                windows[i].setIsDragging(false);
            }

            console.log("up");
        });

        window.addEventListener("dblclick", function(e) {
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

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let pwdWindow = new Window({
            "windowSize": iconObj.getWindowSize(),
            "name": iconObj.getApplicationName()
        });

        windows.push(pwdWindow);

        container.appendChild(pwdWindow.getContainer());

        if (iconObj.getApplicationName() === "Memory") {
            let memory = new Memory({
                "container": "#pwd-window_content-" + pwdWindow.getId()
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
            pwdWindow.updatePos(e.movementX, e.movementY);
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;
