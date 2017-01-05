const Application = require("../../Application.js");

function Settings(settings = {}) {
    Application.call(this, {
       "api": settings.api
    });

    this.api.test();
}

Settings.prototype = Object.create(Application.prototype);
Settings.prototype.constructor = Settings;

module.exports = Settings;
