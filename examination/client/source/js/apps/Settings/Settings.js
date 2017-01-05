const Application = require("../../Application.js");

function Settings(settings = {}) {
    Application.call(this, {
       "api": settings.api
    });

    /**
     * Elements
     */
    this.container = settings.container ? settings.container : undefined;

    this.windowDiv = document.querySelector(this.container);
    this.windowDiv.classList.add("settings");

    /**
     * Background
     */
    this.backgroundForm = document.createElement("form");
    this.backgroundForm.classList.add("settingsBackgroundForm");

    for (let i = 0; i < 6; i++) {
        let formLabel = document.createElement("label");
        formLabel.setAttribute("for", "backgroundForm" + i);

        let formRadio = document.createElement("input");
        formRadio.setAttribute("type", "radio");
        formRadio.setAttribute("value", i);
        formRadio.setAttribute("name", "background");
        formRadio.setAttribute("id", "backgroundForm" + i);

        let formImage = document.createElement("img");
        formImage.setAttribute("src", "./image/0.png");
        formImage.setAttribute("alt", "Background");

        formLabel.appendChild(formRadio);
        formLabel.appendChild(formImage);

        this.backgroundForm.appendChild(formLabel);
    };

    this.windowDiv.appendChild(this.backgroundForm);

    this.api.setPwdBackground(0);
    this.api.setPwdBackground(1);
    this.api.setPwdBackground(2);
}

Settings.prototype = Object.create(Application.prototype);
Settings.prototype.constructor = Settings;

module.exports = Settings;
