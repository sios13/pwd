const Window = require("./Window.js");
const Icon = require("./Icon.js");
const Memory = require("./apps/Memory/MemoryGame.js");
const Chat = require("./apps/Chat/ChatStart.js");

function PWD(settings = {}) {
    let container = document.createElement("main");

    document.querySelector(settings.container).appendChild(container);

    let windows = [];

    let icons = [];

    let pwdWidth = 1300;

    let pwdHeight = 800;

    let windowsMadeCounter = 0;

    /**
     * The selected entity is the currently selected window or icon
     */
    let selectedEntity = undefined;

    /**
     * Create the icons
     */
    icons.push( new Icon({
        "iconText": "Memory small",
        "applicationName": "Memory",
        "xPos": 10,
        "yPos": 10,
        "iconImage": "cards.png",
        "windowSize": "small"
    }) );
    icons.push( new Icon({
        "iconText": "Memory medium",
        "applicationName": "Memory",
        "xPos": 10,
        "yPos": 120,
        "iconImage": "cards.png",
        "windowSize": "medium"
    }) );
    icons.push( new Icon({
        "iconText": "Memory big",
        "applicationName": "Memory",
        "xPos": 10,
        "yPos": 250,
        "iconImage": "cards.png",
        "windowSize": "big"
    }) );
    icons.push( new Icon({
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
    for (let i = 0; i < icons.length; i++) {
        container.appendChild(icons[i].getContainer());
    }

    addListeners();

    function addListeners() {
        window.addEventListener("mousedown", function(e) {
            //e.preventDefault();

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
                     * Mark the window as selected
                     */
                    windows[i].setIsSelected(true);

                    selectedEntity = windows[i];

                    /**
                     * If a mousedown has been made on a top bar -> start dragging
                     */
                    let windowTopBarElem = windows[i].getContainer().querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", entityMoveEvent);
                    }

                    /**
                     * If a mousedown has been made on the close button -> remove the window from the DOM
                     */
                    let windowCloseDiv = windows[i].getContainer().querySelector(".PWD-window_close");

                    if (windowCloseDiv.contains(e.target)) {
                        windows[i].close();
                        windows[i].getContainer().parentNode.removeChild(windows[i].getContainer());
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

                    window.addEventListener("mousemove", entityMoveEvent);

                    break;
                }
            }
        });

        window.addEventListener("mouseup", function(e) {
            //e.preventDefault();

            /**
             * If there is a selected entity -> remove the mousemove event and stop dragging
             */
            if (selectedEntity) {
                selectedEntity.setIsDragging(false);

                window.removeEventListener("mousemove", entityMoveEvent);

                /**
                 * If an icon -> align the icon to the grid
                 */
                if (selectedEntity instanceof Icon) {
                    selectedEntity.correctGridPosition();
                }
            }

            console.log("up");
        });

        window.addEventListener("click", function(e) {
            //e.preventDefault();
        });

        window.addEventListener("dblclick", function(e) {
            //e.preventDefault();

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
        /**
         * Create a new window to launch the application in
         */
        let pwdWindow = new Window({
            "id": windowsMadeCounter,
            "windowSize": iconObj.getWindowSize(),
            "topBarText": iconObj.getIconText(),
            "topBarIcon": iconObj.getIconImage(),
            "xPos": (100 + 15 * windowsMadeCounter),
            "yPos": (20 + 30 * windowsMadeCounter)
        });

        windowsMadeCounter += 1;

        windows.push(pwdWindow);

        container.appendChild(pwdWindow.getContainer());

        /**
         * Start the application and append it to the newly created window
         */
        let applicationObj = undefined;

        if (iconObj.getApplicationName() === "Memory") {
            applicationObj = new Memory({
                "container": "#PWD-window_content-" + pwdWindow.getId()
            });
        } else if (iconObj.getApplicationName() === "Chat") {
            applicationObj = new Chat({
                "container": "#PWD-window_content-" + pwdWindow.getId()
            });
        }

        pwdWindow.setApplicationObj(applicationObj);
    }

    /**
     * Update the position of the active entity
     */
    function entityMoveEvent(e) {
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
