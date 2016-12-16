function Icon(settings) {
    this.application = settings.application ? settings.application : "";

    this.iconImage = settings.iconImage ? settings.iconImage : "defaultIcon.ico";

    this.windowSize = settings.windowSize ? settings.windowSize : "small";

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("div");

        let iconImageElem = document.createElement("img");
        iconImageElem.src = "./image/" + this.iconImage;

        container.appendChild(iconImageElem);

        return container;
    }
}

Icon.prototype.launchEvent = function() {

}

Icon.prototype.getContainer = function() {
    return this.container;
}

module.exports = Icon;
