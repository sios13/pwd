const Window = require("./Window.js");
const Icon = require("./Icon.js");
const Memory = require("./apps/Memory/MemoryGame.js");
const Chat = require("./apps/Chat/ChatStart.js");

function PWD(settings = {}) {

    initialize();

    /**
     * Initialize default behaviour/properties
     */
    function initialize() {
        this.container = document.createElement("main");

        document.querySelector(settings.container).appendChild(container);

        this.windows = [];

        this.icons = [];

        this.pwdWidth = 1300;

        this.pwdHeight = 800;

        this.windowsMadeCounter = 0;

        /**
         * The selected entity is the currently selected window or icon
         */
        this.selectedEntity = undefined;

        /**
         * Create the desktop icons
         */
        this.icons.push( new Icon({
            "iconText": "Memory small",
            "applicationName": "Memory",
            "xPos": 10,
            "yPos": 10,
            "iconImage": "cards.png",
            "windowSize": "small"
        }) );
        this.icons.push( new Icon({
            "iconText": "Memory medium",
            "applicationName": "Memory",
            "xPos": 10,
            "yPos": 120,
            "iconImage": "cards.png",
            "windowSize": "medium"
        }) );
        this.icons.push( new Icon({
            "iconText": "Memory big",
            "applicationName": "Memory",
            "xPos": 10,
            "yPos": 250,
            "iconImage": "cards.png",
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
    }

    function mouseupEvent(e) {
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
    }

    function clickEvent(e) {
        //e.preventDefault();
    }

    function dblclickEvent(e) {
        //e.preventDefault();

        for (let i = 0; i < icons.length; i++) {
            /**
             * if a doubleclick has been made on an icon -> launch the associated application
             */
            if (icons[i].getContainer().contains(e.target)) {
                launchApplication(icons[i]);
            }
        }
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

        this.windows.push(pwdWindow);

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
            this.selectedEntity.setIsDragging(true);
            /*
            let offsetX = e.clientX - selectedEntity.getContainer().offsetLeft;
            let offsetY = e.clientY - selectedEntity.getContainer().offsetTop;

            console.log(selectedEntity.getXPos() + " : " + offsetX);
            console.log(selectedEntity.getYPos() + " : " + offsetY);

            selectedEntity.updatePos(selectedEntity.getXPos() + offsetX, selectedEntity.getYPos() + offsetY);
            */

            /**
             * If mouse pointer is outside window -> do not update the position
             */
            if (e.clientX < 0 || e.clientX > pwdWidth || e.clientY < 0 || e.clientY > pwdHeight) {
                return;
            }

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

            this.selectedEntity.updatePos(selectedEntity.getXPos() + movementX, selectedEntity.getYPos() + movementY);
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;
