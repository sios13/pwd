const Entity = require("./Entity.js");

function Window(settings = {}) {
    Entity.call(this, {
        "xPos": settings.xPos,
        "yPos": settings.yPos,
        "isSelected": settings.isSelected,
        "isDragging": settings.isDragging
    });

    this.id = settings.id ? settings.id : undefined;

    this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : Math.floor(Math.random()*16777215).toString(16);

    this.name = settings.name ? settings.name : "No name";

    this.icon = settings.icon ? settings.icon : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "medium";

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

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("div");
        container.classList.add("PWD-window");
        container.style.left = this.xPos + "px";
        container.style.top = this.yPos + "px";

        switch(this.windowSize) {
            case "small":
                container.classList.add("PWD-window--small");
                break;
            case "medium":
                container.classList.add("PWD-window--medium");
                break;
            case "big":
                container.classList.add("PWD-window--big");
                break;
        }

        let windowTopBar = document.createElement("div");
        windowTopBar.classList.add("PWD-window_topbar");

        let windowTopBarIcon = document.createElement("img");
        windowTopBarIcon.src = "./image/" + this.icon;

        let windowTopBarSpan = document.createElement("span");
        windowTopBarSpan.textContent = this.name;

        let windowContent = document.createElement("div");
        windowContent.classList.add("PWD-window_content");
        windowContent.setAttribute("id", "PWD-window_content-" + this.id);
        windowContent.style.backgroundColor = "#" + this.backgroundColor;

        windowTopBar.appendChild(windowTopBarIcon);
        windowTopBar.appendChild(windowTopBarSpan);

        container.appendChild(windowTopBar);
        container.appendChild(windowContent);

        return container;
    }
}

/**
 * Window inherits from Entity
 */
Window.prototype = Object.create(Entity.prototype);
Window.prototype.constructor = Window;

Window.prototype.getId = function() {
    return this.id;
}

module.exports = Window;
