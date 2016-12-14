function Window() {
    this.container = initializeContainer();

    function initializeContainer() {
        let container = document.createElement("div");

        container.classList.add("PWD-window");

        container.addEventListener("mousemove", function() {
            console.log("asdasd");
        });

        return container;
    }

    function mouseDownEvent() {
        alert("asd");
    }
}

Window.prototype.getContainer = function() {
    return this.container;
}

module.exports = Window;
