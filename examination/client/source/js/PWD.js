const Window = require("./Window.js");

function PWD() {
    this.container = document.createElement("div");
    this.container.setAttribute("id", "PWD");

    let testWindow = new Window();

    this.container.appendChild(testWindow.getContainer());
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;
