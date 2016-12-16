function Icon(settings = {}) {
    this.id = settings.id;

    this.applicationName = settings.applicationName ? settings.applicationName : "";

    this.iconImage = settings.iconImage ? settings.iconImage : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "small";

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("div");
        container.classList.add("PWD-icon");
        container.setAttribute("data-iconid", this.id);

        let iconImageElem = document.createElement("img");
        iconImageElem.src = "./image/" + this.iconImage;

        container.appendChild(iconImageElem);

        return container;
    }
}

Icon.prototype.launchEvent = function() {

}

Icon.prototype.getApplicationName = function() {
    return this.applicationName;
}

Icon.prototype.getWindowSize = function() {
    return this.windowSize;
}

Icon.prototype.getId = function() {
    return this.id;
}

Icon.prototype.getContainer = function() {
    return this.container;
}

module.exports = Icon;
