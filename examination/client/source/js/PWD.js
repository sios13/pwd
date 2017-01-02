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
        if (this.selectedEntity) {
            this.selectedEntity.setIsSelected(false);
        }

        this.selectedEntity = undefined;

        /**
         * Iterate the windows
         */
        for (let i = 0; i < this.windows.length; i++) {
            /**
             * If a mousedown has been made inside a window
             */
            if (this.windows[i].getContainer().contains(e.target)) {
                /**
                 * Mark the window as selected
                 */
                this.windows[i].setIsSelected(true);

                this.selectedEntity = windows[i];

                break;
            }
        }

        /**
         * Iterate the icons
         */
        for (let i = 0; i < this.icons.length; i++) {
            /**
             * If a mousedown has been made on an icon -> mark it as selected
             */
            if (this.icons[i].getContainer().contains(e.target)) {
                /**
                 * Mark the icon as selected
                 */
                this.icons[i].setIsSelected(true);

                this.selectedEntity = icons[i];

                break;
            }
        }

        if (selectedEntity) {
            /**
             * If a mousedown has been made on the selected entity
             */
            if (selectedEntity.getContainer().contains(e.target)) {
                /**
                 * Prevent default to avoid unwanted behaviour
                 */
                e.preventDefault();

                if (selectedEntity instanceof Icon) {
                    window.addEventListener("mousemove", entityMoveEvent);
                }

                if (selectedEntity instanceof Window) {
                    let windowTopBarElem = selectedEntity.getContainer().querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", entityMoveEvent);
                    }
                }
            }
        }
    }

    function mouseupEvent(e) {
        /**
         * If there is a selected entity -> remove the mousemove event and stop dragging
         */
        if (this.selectedEntity) {
            this.selectedEntity.setIsDragging(false);

            window.removeEventListener("mousemove", entityMoveEvent);

            /**
             * If an icon -> align the icon to the grid
             */
            if (this.selectedEntity instanceof Icon) {
                this.selectedEntity.correctGridPosition();
            }
        }

        console.log("up");
    }

    function clickEvent(e) {
        if (selectedEntity) {
            if (selectedEntity instanceof Window) {
                /**
                 * If a click has been made on the close button -> remove the window from the DOM
                 */
                let windowCloseDiv = this.selectedEntity.getContainer().querySelector(".PWD-window_close");

                if (windowCloseDiv.contains(e.target)) {
                    this.selectedEntity.close();
                    this.selectedEntity.getContainer().parentNode.removeChild(this.selectedEntity.getContainer());
                }
            }
        }
    }

    function dblclickEvent(e) {
        /**
         * Iterate the icons to see if a double click was made on an icon
         */
        for (let i = 0; i < this.icons.length; i++) {
            /**
             * if a doubleclick has been made on an icon -> launch the associated application
             */
            if (this.icons[i].getContainer().contains(e.target)) {
                launchApplication(this.icons[i]);
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

        this.container.appendChild(pwdWindow.getContainer());

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

        /**
         * Every window has a referencce to its application
         */
        pwdWindow.setApplicationObj(applicationObj);
    }

    /**
     * Update the position of the selected entity
     */
    function entityMoveEvent(e) {
        /**
         * If there is an active entity -> update its position
         */
        if (this.selectedEntity) {
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
            if (e.clientX < 0 || e.clientX > this.pwdWidth || e.clientY < 0 || e.clientY > this.pwdHeight) {
                return;
            }

            let movementX = e.movementX;
            let movementY = e.movementY;

            if ((this.selectedEntity.getXPos() + movementX + this.selectedEntity.getWidth()) > this.pwdWidth) {
                movementX = 0;
            }

            if (this.selectedEntity.getXPos() + movementX < 0) {
                movementX = 0;
            }

            if ((this.selectedEntity.getYPos() + movementY + this.selectedEntity.getHeight()) > this.pwdHeight) {
                movementY = 0;
            }

            if (this.selectedEntity.getYPos() + movementY < 0) {
                movementY = 0;
            }

            this.selectedEntity.updatePos(this.selectedEntity.getXPos() + movementX, this.selectedEntity.getYPos() + movementY);
        }
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;
