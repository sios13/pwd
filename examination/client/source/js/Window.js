const Entity = require("./Entity.js");

function Window(settings = {}) {
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

    this.applicationObj = settings.applicationObj ? settings.applicationObj : undefined;

    this.container = initializeContainer.bind(this)();

    this.update = function() {
        switch (this.windowSize) {
            case "small":
                this.width = 200;
                this.height = 300;
                break;
            case "medium":
                this.width = 300;
                this.height = 450;
                break;
            case "big":
                this.width = 400;
                this.height = 600;
                break;
        }

        this.container.classList.add("PWD-window--" + this.windowSize);
    }

    function initializeContainer() {
        let container = document.createElement("div");
        container.classList.add("PWD-window");
        container.style.left = this.xPos + "px";
        container.style.top = this.yPos + "px";

        let windowTopBar = document.createElement("div");
        windowTopBar.classList.add("PWD-window_topbar");

        let windowTopBarIcon = document.createElement("img");
        windowTopBarIcon.src = "./image/" + this.topBarIcon;

        let windowTopBarSpan = document.createElement("span");
        windowTopBarSpan.textContent = this.topBarText;

        let windowMinimizeDiv = document.createElement("div");
        windowMinimizeDiv.classList.add("PWD-window_minimize");

        let windowResizeDiv = document.createElement("div");
        windowResizeDiv.classList.add("PWD-window_resize");

        let windowCloseDiv = document.createElement("div");
        windowCloseDiv.classList.add("PWD-window_close");

        let windowContent = document.createElement("div");
        windowContent.classList.add("PWD-window_content");
        windowContent.setAttribute("id", "PWD-window_content-" + this.id);
        if (this.backgroundColor) {
            windowContent.style.backgroundColor = this.backgroundColor;
        }

        windowTopBar.appendChild(windowTopBarIcon);
        windowTopBar.appendChild(windowTopBarSpan);

        container.appendChild(windowTopBar);
        container.appendChild(windowMinimizeDiv);
        container.appendChild(windowResizeDiv);
        container.appendChild(windowCloseDiv);
        container.appendChild(windowContent);

        return container;
    }
}

/**
 * Window inherits from Entity
 */
Window.prototype = Object.create(Entity.prototype);
Window.prototype.constructor = Window;

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

Window.prototype.setApplicationObj = function(applicationObj) {
    this.applicationObj = applicationObj;
}

Window.prototype.getId = function() {
    return this.id;
}

module.exports = Window;
