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
     * The selected entity is the currently selected window or icon
     */
    let selectedEntity = undefined;

    /**
     * Create the icons
     */
    icons.push( new Icon({
        //"id": 0,
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

            if (selectedEntity) {
                selectedEntity.setIsSelected(false);
            }

            selectedEntity = undefined;

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
                    windows[i].setIsSelected(true);

                    selectedEntity = windows[i];

                    /**
                     * If a mousedown has been made on a top bar -> start dragging
                     */
                    let windowTopBarElem = windows[i].getContainer().querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", windowMoveEvent);
                    }

                    break;
                }
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

                    selectedEntity = icons[i];

                    window.addEventListener("mousemove", windowMoveEvent);

                    break;
                }
            }
        });

        window.addEventListener("mouseup", function(e) {
            e.preventDefault();

            /**
             * If there is an active entity -> remove the mousemove event and stop dragging
             */
            if (selectedEntity) {
                window.removeEventListener("mousemove", windowMoveEvent);

                selectedEntity.setIsDragging(false);
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
            "id": windowsMadeCounter,
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
     * Update the position of the active entity
     */
    function windowMoveEvent(e) {
        /**
         * If there is an active entity -> update its position
         */
        if (selectedEntity) {
            selectedEntity.setIsDragging(true);

            let movementX = e.movementX;
            let movementY = e.movementY;

            if ((selectedEntity.getXPos() + movementX + selectedEntity.getWidth()) > pwdWidth) {
                movementX = 0;
            }

            if (selectedEntity.getXPos() + movementX < 0) {
                movementX = 0;
            }

            if ((selectedEntity.getYPos() + movementY + selectedEntity.getHeight()) > pwdHeight) {
                movementY = 0;
            }

            if (selectedEntity.getYPos() + movementY < 0) {
                movementY = 0;
            }

            selectedEntity.updatePos(movementX, movementY);
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;
