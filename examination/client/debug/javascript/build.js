(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Icon(settings = {}) {
    this.id = settings.id;

    this.application = settings.application ? settings.application : "";

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

Icon.prototype.getId = function() {
    return this.id;
}

Icon.prototype.getContainer = function() {
    return this.container;
}

module.exports = Icon;

},{}],2:[function(require,module,exports){
const Window = require("./Window.js");
const Icon = require("./Icon.js");

function PWD() {
    this.container = new DocumentFragment();

    let windows = [];

    let newWindowXPos = 0;

    let newWindowYPos = 0;

    let icons = [];
/*
    for (let i = 0; i < 10; i++) {
        windows.push(new Window({"id": i, "xPos": getNewWindowXPos(), "yPos": getNewWindowYPos()}));
    }
*/
/*
    for (let i = 0; i < windows.length; i++) {
        this.container.appendChild(windows[i].getContainer());
    }
*/
    icons.push(new Icon({
        "id": 0,
        "application": "memory",
        //"iconImage": "memory.png",
        "windowSize": "medium"
    }));

    for (let i = 0; i < icons.length; i++) {
        this.container.appendChild(icons[i].getContainer());
    }

    addListeners.bind(this)();

    function addListeners() {
        window.addEventListener("mousedown", function(e) {
            let pwdWindow = getWindow(parseInt(e.target.getAttribute("data-windowid")));

            if (pwdWindow) {
                setActive(pwdWindow);

                let pwdWindowElem = pwdWindow.getContainer();

                window.addEventListener("mousemove", windowMoveEvent);
            }
        });

        window.addEventListener("mouseup", function() {
            window.removeEventListener("mousemove", windowMoveEvent);
            console.log("up");
        });

        window.addEventListener("dblclick", function(e) {
            let pwdIconDiv = e.target.parentNode;
            let pwdIconObj = getIcon(parseInt(pwdIconDiv.getAttribute("data-iconid")));

            launchApplication(pwdIconObj);
        });
    }

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let pwdWindow = new Window();

        this.container.appendChild(pwdWindow.getContainer());
    }

    /**
     * Returns the icon object with the given id
     */
    function getIcon(id) {
        for (let i = 0; i < icons.length; i++) {
            if (icons[i].getId() === id) {
                return icons[i];
            }
        }

        return undefined;
    }

    function windowMoveEvent(e) {
        let pwdWindow = getActiveWindow();

        if (pwdWindow) {
            pwdWindow.updatePos(e.movementX, e.movementY);
        }
    }

    /**
     * Returns the active window.
     * If no window is active -> return undefined
     */
    function getActiveWindow() {
        for (let i = 0; i < windows.length; i++) {
            if (windows[i].isActive()) {
                return windows[i];
            }
        }

        return undefined;
    }

    /**
     * Sets all the windows as inactive
     * Sets the given window as active
     */
    function setActive(pwdWindow) {
        for (let i = 0; i < windows.length; i++) {
            windows[i].setActive(false);
        }

        pwdWindow.setActive(true);
    }

    /**
     * Returns the window object with the given id
     */
    function getWindow(id) {
        for (let i = 0; i < windows.length; i++) {
            if (windows[i].getId() === id) {
                return windows[i];
            }
        }
    }

    function getNewWindowXPos() {
        newWindowXPos += 20;

        return newWindowXPos;
    }

    function getNewWindowYPos() {
        newWindowYPos += 20;

        return newWindowYPos;
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;

},{"./Icon.js":1,"./Window.js":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
const PWD = require("./PWD.js");

window.addEventListener("load", function() {
    let container = document.querySelector("main");

    let pwd = new PWD();

    container.appendChild(pwd.getContainer());
});

},{"./PWD.js":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvUFdELmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBJY29uKHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZDtcclxuXHJcbiAgICB0aGlzLmFwcGxpY2F0aW9uID0gc2V0dGluZ3MuYXBwbGljYXRpb24gPyBzZXR0aW5ncy5hcHBsaWNhdGlvbiA6IFwiXCI7XHJcblxyXG4gICAgdGhpcy5pY29uSW1hZ2UgPSBzZXR0aW5ncy5pY29uSW1hZ2UgPyBzZXR0aW5ncy5pY29uSW1hZ2UgOiBcImRlZmF1bHRJY29uLmljb1wiO1xyXG5cclxuICAgIHRoaXMud2luZG93U2l6ZSA9IHNldHRpbmdzLndpbmRvd1NpemUgPyBzZXR0aW5ncy53aW5kb3dTaXplIDogXCJzbWFsbFwiO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC1pY29uXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLWljb25pZFwiLCB0aGlzLmlkKTtcclxuXHJcbiAgICAgICAgbGV0IGljb25JbWFnZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGljb25JbWFnZUVsZW0uc3JjID0gXCIuL2ltYWdlL1wiICsgdGhpcy5pY29uSW1hZ2U7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpY29uSW1hZ2VFbGVtKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUubGF1bmNoRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxufVxyXG5cclxuSWNvbi5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcclxuIiwiY29uc3QgV2luZG93ID0gcmVxdWlyZShcIi4vV2luZG93LmpzXCIpO1xyXG5jb25zdCBJY29uID0gcmVxdWlyZShcIi4vSWNvbi5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFBXRCgpIHtcclxuICAgIHRoaXMuY29udGFpbmVyID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICBsZXQgd2luZG93cyA9IFtdO1xyXG5cclxuICAgIGxldCBuZXdXaW5kb3dYUG9zID0gMDtcclxuXHJcbiAgICBsZXQgbmV3V2luZG93WVBvcyA9IDA7XHJcblxyXG4gICAgbGV0IGljb25zID0gW107XHJcbi8qXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICB3aW5kb3dzLnB1c2gobmV3IFdpbmRvdyh7XCJpZFwiOiBpLCBcInhQb3NcIjogZ2V0TmV3V2luZG93WFBvcygpLCBcInlQb3NcIjogZ2V0TmV3V2luZG93WVBvcygpfSkpO1xyXG4gICAgfVxyXG4qL1xyXG4vKlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93c1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICB9XHJcbiovXHJcbiAgICBpY29ucy5wdXNoKG5ldyBJY29uKHtcclxuICAgICAgICBcImlkXCI6IDAsXHJcbiAgICAgICAgXCJhcHBsaWNhdGlvblwiOiBcIm1lbW9yeVwiLFxyXG4gICAgICAgIC8vXCJpY29uSW1hZ2VcIjogXCJtZW1vcnkucG5nXCIsXHJcbiAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgIH0pKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbnNbaV0uZ2V0Q29udGFpbmVyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3RlbmVycy5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IGdldFdpbmRvdyhwYXJzZUludChlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdpbmRvd2lkXCIpKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHdkV2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICBzZXRBY3RpdmUocHdkV2luZG93KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcHdkV2luZG93RWxlbSA9IHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB3aW5kb3dNb3ZlRXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgd2luZG93TW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGxldCBwd2RJY29uRGl2ID0gZS50YXJnZXQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgbGV0IHB3ZEljb25PYmogPSBnZXRJY29uKHBhcnNlSW50KHB3ZEljb25EaXYuZ2V0QXR0cmlidXRlKFwiZGF0YS1pY29uaWRcIikpKTtcclxuXHJcbiAgICAgICAgICAgIGxhdW5jaEFwcGxpY2F0aW9uKHB3ZEljb25PYmopO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoIGFuIGFwcGxpY2F0aW9uIHVzaW5nIHRoZSBtZXRhIGRhdGEgaW4gYSBnaXZlbiBpY29uIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsYXVuY2hBcHBsaWNhdGlvbihpY29uT2JqKSB7XHJcbiAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IG5ldyBXaW5kb3coKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHdkV2luZG93LmdldENvbnRhaW5lcigpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGljb24gb2JqZWN0IHdpdGggdGhlIGdpdmVuIGlkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldEljb24oaWQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpY29uc1tpXS5nZXRJZCgpID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGljb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHdpbmRvd01vdmVFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IGdldEFjdGl2ZVdpbmRvdygpO1xyXG5cclxuICAgICAgICBpZiAocHdkV2luZG93KSB7XHJcbiAgICAgICAgICAgIHB3ZFdpbmRvdy51cGRhdGVQb3MoZS5tb3ZlbWVudFgsIGUubW92ZW1lbnRZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBhY3RpdmUgd2luZG93LlxyXG4gICAgICogSWYgbm8gd2luZG93IGlzIGFjdGl2ZSAtPiByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldEFjdGl2ZVdpbmRvdygpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvd3NbaV0uaXNBY3RpdmUoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvd3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGFsbCB0aGUgd2luZG93cyBhcyBpbmFjdGl2ZVxyXG4gICAgICogU2V0cyB0aGUgZ2l2ZW4gd2luZG93IGFzIGFjdGl2ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRBY3RpdmUocHdkV2luZG93KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHdpbmRvd3NbaV0uc2V0QWN0aXZlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB3ZFdpbmRvdy5zZXRBY3RpdmUodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB3aW5kb3cgb2JqZWN0IHdpdGggdGhlIGdpdmVuIGlkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldFdpbmRvdyhpZCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAod2luZG93c1tpXS5nZXRJZCgpID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvd3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TmV3V2luZG93WFBvcygpIHtcclxuICAgICAgICBuZXdXaW5kb3dYUG9zICs9IDIwO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3V2luZG93WFBvcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXROZXdXaW5kb3dZUG9zKCkge1xyXG4gICAgICAgIG5ld1dpbmRvd1lQb3MgKz0gMjA7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdXaW5kb3dZUG9zO1xyXG4gICAgfVxyXG59XHJcblxyXG5QV0QucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBXRDtcclxuIiwiZnVuY3Rpb24gV2luZG93KHNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuaWQgPSBXaW5kb3cuaWQ7XHJcbiAgICBXaW5kb3cuaWQgKz0gMTtcclxuXHJcbiAgICB0aGlzLnhQb3MgPSBXaW5kb3cueFBvcztcclxuICAgIFdpbmRvdy54UG9zICs9IDIwO1xyXG5cclxuICAgIHRoaXMueVBvcyA9IFdpbmRvdy55UG9zO1xyXG4gICAgV2luZG93LnlQb3MgKz0gMjA7XHJcblxyXG4gICAgLy90aGlzLmlkID0gc2V0dGluZ3MuaWQgPyBzZXR0aW5ncy5pZCA6IDA7XHJcblxyXG4gICAgLy90aGlzLnhQb3MgPSBzZXR0aW5ncy54UG9zID8gc2V0dGluZ3MueFBvcyA6IDEwMDtcclxuXHJcbiAgICAvL3RoaXMueVBvcyA9IHNldHRpbmdzLnlQb3MgPyBzZXR0aW5ncy55UG9zIDogMTAwO1xyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yID8gc2V0dGluZ3MuYmFja2dyb3VuZENvbG9yIDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjE2Nzc3MjE1KS50b1N0cmluZygxNik7XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSBzZXR0aW5ncy5hY3RpdmUgPyBzZXR0aW5ncy5hY3RpdmUgOiB0cnVlO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gaW5pdGlhbGl6ZUNvbnRhaW5lci5iaW5kKHRoaXMpKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRhaW5lcigpIHtcclxuICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93XCIpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13aW5kb3dpZFwiLCB0aGlzLmlkKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNcIiArIHRoaXMuYmFja2dyb3VuZENvbG9yO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG5XaW5kb3cuaWQgPSAwO1xyXG5cclxuV2luZG93LnhQb3MgPSAyMDtcclxuXHJcbldpbmRvdy55UG9zID0gMjA7XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnVwZGF0ZVBvcyA9IGZ1bmN0aW9uKHhNb3ZlbWVudCwgeU1vdmVtZW50KSB7XHJcbiAgICB0aGlzLnhQb3MgKz0geE1vdmVtZW50O1xyXG4gICAgdGhpcy55UG9zICs9IHlNb3ZlbWVudDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy54UG9zICsgXCJweFwiO1xyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdGhpcy55UG9zICsgXCJweFwiO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoaXMgd2luZG93IGlzIGFjdGl2ZVxyXG4gKi9cclxuV2luZG93LnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1pbmFjdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tYWN0aXZlXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1pbmFjdGl2ZVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3c7XHJcbiIsImNvbnN0IFBXRCA9IHJlcXVpcmUoXCIuL1BXRC5qc1wiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcclxuXHJcbiAgICBsZXQgcHdkID0gbmV3IFBXRCgpO1xyXG5cclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwd2QuZ2V0Q29udGFpbmVyKCkpO1xyXG59KTtcclxuIl19
