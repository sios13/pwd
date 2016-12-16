function Window(settings = {}) {
    this.id = Window.id;
    Window.id += 1;

    this.xPos = Window.xPos;
    Window.xPos += 20;

    this.yPos = Window.yPos;
    Window.yPos += 20;

    //this.id = settings.id ? settings.id : 0;

    //this.xPos = settings.xPos ? settings.xPos : 100;

    //this.yPos = settings.yPos ? settings.yPos : 100;

    this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : Math.floor(Math.random()*16777215).toString(16);

    this.active = settings.active ? settings.active : true;

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("div");

        container.classList.add("PWD-window");

        container.setAttribute("data-windowid", this.id);

        container.style.left = this.xPos + "px";

        container.style.top = this.yPos + "px";

        container.style.backgroundColor = "#" + this.backgroundColor;

        return container;
    }
}

Window.id = 0;

Window.xPos = 20;

Window.yPos = 20;

Window.prototype.updatePos = function(xMovement, yMovement) {
    this.xPos += xMovement;
    this.yPos += yMovement;

    this.container.style.left = this.xPos + "px";
    this.container.style.top = this.yPos + "px";
}

Window.prototype.getId = function() {
    return this.id;
}

/**
 * Return true if this window is active
 */
Window.prototype.isActive = function() {
    return this.active;
}

Window.prototype.setActive = function(value) {
    this.active = value;

    if (this.active) {
        this.container.classList.remove("PWD-window--inactive");
        this.container.classList.add("PWD-window--active");
    } else {
        this.container.classList.remove("PWD-window--active");
        this.container.classList.add("PWD-window--inactive");
    }
}

Window.prototype.getContainer = function() {
    return this.container;
}

module.exports = Window;
