const Entity = require("./Entity.js");

function Window(settings = {}) {
    /**
     * Properties
     */
    Entity.call(this, {
        "xPos": settings.xPos,
        "yPos": settings.yPos,
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

    let windowMinimizeDiv = document.createElement("div");
    windowMinimizeDiv.classList.add("PWD-window_minimize");
    windowMinimizeDiv.classList.add("ion-minus-round");

    this.windowResizeDiv = document.createElement("div");
    this.windowResizeDiv.classList.add("PWD-window_resize");

    let windowCloseDiv = document.createElement("div");
    windowCloseDiv.classList.add("PWD-window_close");
    windowCloseDiv.classList.add("ion-close-round");

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
    windowTopBarWrapper.appendChild(windowMinimizeDiv);
    windowTopBarWrapper.appendChild(this.windowResizeDiv);
    windowTopBarWrapper.appendChild(windowCloseDiv);

    this.container.appendChild(windowTopBarWrapper);
    this.container.appendChild(windowContent);

    this.update = function() {
        /**
         * Remove all classes
         */
        this.windowResizeDiv.classList.remove("ion-arrow-expand");
        this.windowResizeDiv.classList.remove("ion-arrow-shrink");

        switch (this.windowSize) {
            case "small":
                this.width = 200;
                this.height = 300;
                this.windowResizeDiv.classList.add("ion-arrow-expand");
                break;
            case "medium":
                this.width = 300;
                this.height = 450;
                this.windowResizeDiv.classList.add("ion-arrow-expand");
                break;
            case "big":
                this.width = 400;
                this.height = 600;
                this.windowResizeDiv.classList.add("ion-arrow-shrink");
                break;
        }

        this.container.classList.add("PWD-window--" + this.windowSize);
    }

    this.update();
}

/**
 * Window inherits from Entity
 */
Window.prototype = Object.create(Entity.prototype);
Window.prototype.constructor = Window;

Window.prototype.getIsMinimized = function() {
    return this.minimized;
}

Window.prototype.setMinimized = function(value) {
    this.minimized = value;

    if (this.minimized) {
        this.container.classList.add("PWD-window--minimized");
    } else {
        this.container.classList.remove("PWD-window--minimized");
    }
}

Window.prototype.resize = function() {
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

Window.prototype.close = function() {
    this.applicationObj.close();
}

Window.prototype.getId = function() {
    return this.id;
}

module.exports = Window;
