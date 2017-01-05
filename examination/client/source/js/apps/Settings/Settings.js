const Application = require("../../Application.js");

function Settings(settings = {}) {
    Application.call(this, {
       "api": settings.api
    });

    this.container = settings.container ? settings.container : undefined;

    this.windowDiv = document.querySelector(this.container);
    this.windowDiv.classList.add("settings");

    this.api.setPwdBackground(0);
    this.api.setPwdBackground(1);
    this.api.setPwdBackground(2);
}

Settings.prototype = Object.create(Application.prototype);
Settings.prototype.constructor = Settings;

module.exports = Settings;
