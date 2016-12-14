const PWD = require("./PWD.js");

window.addEventListener("load", function() {
    let container = document.querySelector("main");

    let PWD = new PWD();

    container.appendChild(PWD.getContainer());
});
