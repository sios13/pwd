/**
 * Every application in the PWD must implement Application
 */
function Application(settings = {}) {
    this.api = settings.api ? settings.api : undefined;
}

Application.prototype.close = function() {
    console.log("WARNING! Application must implement function close.");
}

module.exports = Application;
