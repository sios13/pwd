const Window = require("./Window.js");
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
         * Elements
         */
        this.container = document.createElement("main");

        this.bottomBar = document.createElement("div");
        this.bottomBar.classList.add("PWD-bottomBar");

        this.container.appendChild(this.bottomBar);

        document.querySelector(settings.container).appendChild(this.container);

        /**
         * Properties
         */
        this.windows = [];

        this.panels = [];

        this.icons = [];

        this.applications = [];

        this.pwdWidth = 1300;

        this.pwdHeight = 700;

        /**
         * The target is...
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
        /**
         * For every mousedown event we will attempt to find a new selected entity
         */
        this.target = findTarget(e.target);

        /**
         * Deselect everything
         */
        for (let i = 0; i < this.windows.length; i++) {
            this.windows[i].setIsSelected(false);
        }

        for (let i = 0; i < this.panels.length; i++) {
            this.panels[i].setIsSelected(false);
        }

        for (let i = 0; i < this.icons.length; i++) {
            this.icons[i].setIsSelected(false);
        }

        /**
         * If target is a window
         */
        if (this.target instanceof Window) {
            /**
             * Set the window as selected
             */
            this.target.setIsSelected(true);

            /**
             * Mark the associated panel as selected
             */
            let index = windows.indexOf(this.target);

            this.panels[index].setIsSelected(true);

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
            if (this.target.getIsSelected() === true) {
                /**
                 * Set the window as deselected
                 */
                this.target.setIsSelected(false);

                /**
                 * Set the associated window as deselected
                 */
                let index = panels.indexOf(this.target);

                this.windows[index].setIsSelected(false);

                /**
                 * Minimize the window
                 */
                this.windows[index].setMinimized(true);
            } else {
                /**
                 * Set the panel as selected
                 */
                this.target.setIsSelected(true);

                /**
                 * Set the associated window as selected
                 */
                let index = panels.indexOf(this.target);

                this.windows[index].setIsSelected(true);
            }

            return;
        }

        /**
         * If target is an icon
         */
        if (this.target instanceof Icon) {
            /**
             * Set the icon as selected
             */
            this.target.setIsSelected(true);

            return;
        }

        // if (this.selectedEntity) {
        //     if (this.selectedEntity instanceof Icon) {
        //         window.addEventListener("mousemove", entityMoveEvent);
        //
        //         e.preventDefault();
        //     }
        //
        //     if (this.selectedEntity instanceof Window) {
        //         /**
        //          * Windows should only be draggable by the topbar
        //          */
        //         let windowTopBarElem = this.selectedEntity.getContainer().querySelector(".PWD-window_topbar");
        //
        //         if (windowTopBarElem.contains(e.target)) {
        //             window.addEventListener("mousemove", entityMoveEvent);
        //
        //             e.preventDefault();
        //         }
        //     }
        // }
    }

    function mouseupEvent(e) {
        if (this.target instanceof Window) {
            this.target.setIsDragging(false);

            window.removeEventListener("mousemove", entityMoveEvent);
        }

        if (this.target instanceof Icon) {
            this.target.setIsDragging(false);

            window.removeEventListener("mousemove", entityMoveEvent);

            this.target.correctGridPosition();
        }
        // if (this.selectedEntity) {
        //     /**
        //      * If the entity is dragging -> stop dragging
        //      */
        //     //if (this.selectedEntity.getIsDragging()) {
        //         this.selectedEntity.setIsDragging(false);
        //
        //         window.removeEventListener("mousemove", entityMoveEvent);
        //     //}
        //
        //     /**
        //      * If an icon -> align the icon to the grid
        //      */
        //     if (this.selectedEntity instanceof Icon) {
        //         this.selectedEntity.correctGridPosition();
        //     }
        // }

        console.log("up");
    }

    function clickEvent(e) {
        if (this.target instanceof Window) {
            /**
             * If a click has been made on the close button
             */
            let windowCloseDiv = this.target.getContainer().querySelector(".PWD-window_close");

            if (windowCloseDiv.contains(e.target)) {
                let index = this.windows.indexOf(this.target);

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
        // if (this.selectedEntity) {
        //     /**
        //      * If a click has been made in a window
        //      */
        //     if (this.selectedEntity instanceof Window) {
        //         let windowCloseDiv = this.selectedEntity.getContainer().querySelector(".PWD-window_close");
        //
        //         /**
        //          * If a click has been made on the close button
        //          */
        //         if (windowCloseDiv.contains(e.target)) {
        //             let index = this.windows.indexOf(this.selectedEntity);
        //
        //             /**
        //              * Call the close functionn implemented by every application
        //              */
        //             this.applications[index].close();
        //
        //             /**
        //              * Remove the window and panel from the DOM
        //              */
        //             this.windows[index].getContainer().parentNode.removeChild(this.windows[index].getContainer());
        //             this.panels[index].getContainer().parentNode.removeChild(this.panels[index].getContainer());
        //
        //             /**
        //              * Remove the window, panel and application from their respective arrays
        //              */
        //             this.windows.splice(index, 1);
        //             this.panels.splice(index, 1);
        //             this.applications.splice(index, 1);
        //
        //             this.selectedEntity = undefined;
        //
        //             return;
        //         }
        //
        //         let windowResizeDiv = this.selectedEntity.getContainer().querySelector(".PWD-window_resize");
        //
        //         /**
        //          * If a click has been made on the resize button -> resize the window
        //          */
        //         if (windowResizeDiv.contains(e.target)) {
        //             this.selectedEntity.resize();
        //
        //             return;
        //         }
        //
        //         let windowMinimizeDiv = this.selectedEntity.getContainer().querySelector(".PWD-window_minimize");
        //
        //         /**
        //          * If a click has been made on the minimize button
        //          */
        //         if (windowMinimizeDiv.contains(e.target)) {
        //             this.selectedEntity.setMinimized(true);
        //
        //             this.selectedEntity.setIsSelected(false);
        //
        //             let index = windows.indexOf(this.selectedEntity);
        //
        //             this.panels[index].setIsSelected(false);
        //
        //             return;
        //         }
        //     }
        // }
    }

    function dblclickEvent(e) {
        if (this.target instanceof Icon) {
            launchApplication(this.target);

            return;
        }
        // if (this.selectedEntity) {
        //     /**
        //      * if a doubleclick has been made on an icon -> launch the associated application
        //      */
        //     if (this.selectedEntity instanceof Icon) {
        //         launchApplication(this.selectedEntity);
        //     }
        // }
    }

    /**
     * Set the selected entity if the provided target exists inside an entity (window or icon)
     */
    function findTarget(target) {

        /**
         * We will now attempt to find the selected entity, iterating the windows, panels and icons
         */

        /**
         * Iterate the windows
         */
        for (let i = 0; i < this.windows.length; i++) {
            /**
             * If a mousedown has been made in a window -> mark the window and the panel as selected
             */
            if (this.windows[i].getContainer().contains(target)) {
                return this.windows[i];
                /*
                this.windows[i].setIsSelected(true);

                this.selectedEntity = windows[i];

                this.panels[i].setIsSelected(true);

                return;
                */
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
                /*
                if (this.windows[i].isMinimized()) {
                    this.windows[i].setMinimized(false);
                }

                if (this.windows[i].getIsSelected()) {
                    this.windows[i].setMinimized(true);
                }

                this.windows[i].setIsSelected(true);

                this.selectedEntity = windows[i];

                this.panels[i].setIsSelected(true);

                return;
                */
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
                /*
                this.icons[i].setIsSelected(true);

                this.selectedEntity = icons[i];

                return;
                */
            }
        }

        return undefined;

        /**
         * At this point we know a click was made outside any window, panel or icon so we can safely deselect the selected entity
         */
        /*
        if (this.selectedEntity) {
            if (this.selectedEntity instanceof Window) {
                let index = windows.indexOf(this.selectedEntity);

                this.windows[index].setIsSelected(false);

                this.panels[index].setIsSelected(false);
            }

            if (this.selectedEntity instanceof Icon) {
                this.selectedEntity.setIsSelected(false);
            }

            this.selectedEntity = undefined;
        }
        */
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
            "xPos": (100 + 15 * id),
            "yPos": (20 + 30 * id)
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

        this.bottomBar.appendChild(pwdPanel.getContainer());

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
     * Update the position of the selected entity
     */
    function entityMoveEvent(e) {
        /**
         * If there is an active entity -> update its position
         */
        //if (this.selectedEntity) {
            this.target.setIsDragging(true);
            /*
            let offsetX = e.clientX - selectedEntity.getContainer().offsetLeft;
            let offsetY = e.clientY - selectedEntity.getContainer().offsetTop;

            console.log(selectedEntity.getXPos() + " : " + offsetX);
            console.log(selectedEntity.getYPos() + " : " + offsetY);

            selectedEntity.updatePos(selectedEntity.getXPos() + offsetX, selectedEntity.getYPos() + offsetY);
            */

            if (!this.target.getContainer().querySelector(".PWD-window_topbar").contains(e.target)) {
                return;
            }

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
        //}
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;
