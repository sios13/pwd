(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
const Window = require("./Window.js");
const Icon = require("./Icon.js");

function PWD() {
    this.container = new DocumentFragment();

    let windows = [];

    let newWindowXPos = 0;

    let newWindowYPos = 0;

    for (let i = 0; i < 10; i++) {
        windows.push(new Window({"id": i, "xPos": getNewWindowXPos(), "yPos": getNewWindowYPos()}));
    }
/*
    for (let i = 0; i < windows.length; i++) {
        this.container.appendChild(windows[i].getContainer());
    }
*/
    let testIcon = new Icon({
        "application": "memory",
        //"iconImage": "memory.png",
        "windowSize": "medium"
    });

    this.container.appendChild(testIcon.getContainer());

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
function Window(settings) {
    this.id = settings.id ? settings.id : 0;

    this.xPos = settings.xPos ? settings.xPos : 100;

    this.yPos = settings.yPos ? settings.yPos : 100;

    this.backgroundColor = settings.backgroundColor ? settings.backgroundColor : Math.floor(Math.random()*16777215).toString(16);

    this.active = settings.active ? settings.active : true;

    this.container = initializeContainer.bind(this)();

    function initializeContainer() {
        let container = document.createElement("div");

        container.setAttribute("data-windowid", this.id);

        container.style.left = this.xPos + "px";

        container.style.top = this.yPos + "px";

        container.style.backgroundColor = "#" + this.backgroundColor;

        container.classList.add("PWD-window");

        return container;
    }
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvSWNvbi5qcyIsImNsaWVudC9zb3VyY2UvanMvUFdELmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gSWNvbihzZXR0aW5ncykge1xyXG4gICAgdGhpcy5hcHBsaWNhdGlvbiA9IHNldHRpbmdzLmFwcGxpY2F0aW9uID8gc2V0dGluZ3MuYXBwbGljYXRpb24gOiBcIlwiO1xyXG5cclxuICAgIHRoaXMuaWNvbkltYWdlID0gc2V0dGluZ3MuaWNvbkltYWdlID8gc2V0dGluZ3MuaWNvbkltYWdlIDogXCJkZWZhdWx0SWNvbi5pY29cIjtcclxuXHJcbiAgICB0aGlzLndpbmRvd1NpemUgPSBzZXR0aW5ncy53aW5kb3dTaXplID8gc2V0dGluZ3Mud2luZG93U2l6ZSA6IFwic21hbGxcIjtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICAgIGxldCBpY29uSW1hZ2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpY29uSW1hZ2VFbGVtLnNyYyA9IFwiLi9pbWFnZS9cIiArIHRoaXMuaWNvbkltYWdlO1xyXG5cclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbkltYWdlRWxlbSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbkljb24ucHJvdG90eXBlLmxhdW5jaEV2ZW50ID0gZnVuY3Rpb24oKSB7XHJcblxyXG59XHJcblxyXG5JY29uLnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xyXG4iLCJjb25zdCBXaW5kb3cgPSByZXF1aXJlKFwiLi9XaW5kb3cuanNcIik7XHJcbmNvbnN0IEljb24gPSByZXF1aXJlKFwiLi9JY29uLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gUFdEKCkge1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgIGxldCB3aW5kb3dzID0gW107XHJcblxyXG4gICAgbGV0IG5ld1dpbmRvd1hQb3MgPSAwO1xyXG5cclxuICAgIGxldCBuZXdXaW5kb3dZUG9zID0gMDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICB3aW5kb3dzLnB1c2gobmV3IFdpbmRvdyh7XCJpZFwiOiBpLCBcInhQb3NcIjogZ2V0TmV3V2luZG93WFBvcygpLCBcInlQb3NcIjogZ2V0TmV3V2luZG93WVBvcygpfSkpO1xyXG4gICAgfVxyXG4vKlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93c1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICB9XHJcbiovXHJcbiAgICBsZXQgdGVzdEljb24gPSBuZXcgSWNvbih7XHJcbiAgICAgICAgXCJhcHBsaWNhdGlvblwiOiBcIm1lbW9yeVwiLFxyXG4gICAgICAgIC8vXCJpY29uSW1hZ2VcIjogXCJtZW1vcnkucG5nXCIsXHJcbiAgICAgICAgXCJ3aW5kb3dTaXplXCI6IFwibWVkaXVtXCJcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRlc3RJY29uLmdldENvbnRhaW5lcigpKTtcclxuXHJcbiAgICBhZGRMaXN0ZW5lcnMuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGxldCBwd2RXaW5kb3cgPSBnZXRXaW5kb3cocGFyc2VJbnQoZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS13aW5kb3dpZFwiKSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHB3ZFdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgc2V0QWN0aXZlKHB3ZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHB3ZFdpbmRvd0VsZW0gPSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgd2luZG93TW92ZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gd2luZG93TW92ZUV2ZW50KGUpIHtcclxuICAgICAgICBsZXQgcHdkV2luZG93ID0gZ2V0QWN0aXZlV2luZG93KCk7XHJcblxyXG4gICAgICAgIGlmIChwd2RXaW5kb3cpIHtcclxuICAgICAgICAgICAgcHdkV2luZG93LnVwZGF0ZVBvcyhlLm1vdmVtZW50WCwgZS5tb3ZlbWVudFkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGFjdGl2ZSB3aW5kb3cuXHJcbiAgICAgKiBJZiBubyB3aW5kb3cgaXMgYWN0aXZlIC0+IHJldHVybiB1bmRlZmluZWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlV2luZG93KCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAod2luZG93c1tpXS5pc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgYWxsIHRoZSB3aW5kb3dzIGFzIGluYWN0aXZlXHJcbiAgICAgKiBTZXRzIHRoZSBnaXZlbiB3aW5kb3cgYXMgYWN0aXZlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldEFjdGl2ZShwd2RXaW5kb3cpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgd2luZG93c1tpXS5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHdkV2luZG93LnNldEFjdGl2ZSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHdpbmRvdyBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gaWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0V2luZG93KGlkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dzW2ldLmdldElkKCkgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXROZXdXaW5kb3dYUG9zKCkge1xyXG4gICAgICAgIG5ld1dpbmRvd1hQb3MgKz0gMjA7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdXaW5kb3dYUG9zO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldE5ld1dpbmRvd1lQb3MoKSB7XHJcbiAgICAgICAgbmV3V2luZG93WVBvcyArPSAyMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1dpbmRvd1lQb3M7XHJcbiAgICB9XHJcbn1cclxuXHJcblBXRC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUFdEO1xyXG4iLCJmdW5jdGlvbiBXaW5kb3coc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZCA/IHNldHRpbmdzLmlkIDogMDtcclxuXHJcbiAgICB0aGlzLnhQb3MgPSBzZXR0aW5ncy54UG9zID8gc2V0dGluZ3MueFBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnlQb3MgPSBzZXR0aW5ncy55UG9zID8gc2V0dGluZ3MueVBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gc2V0dGluZ3MuYWN0aXZlID8gc2V0dGluZ3MuYWN0aXZlIDogdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdpbmRvd2lkXCIsIHRoaXMuaWQpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI1wiICsgdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvd1wiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS51cGRhdGVQb3MgPSBmdW5jdGlvbih4TW92ZW1lbnQsIHlNb3ZlbWVudCkge1xyXG4gICAgdGhpcy54UG9zICs9IHhNb3ZlbWVudDtcclxuICAgIHRoaXMueVBvcyArPSB5TW92ZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGlzIHdpbmRvdyBpcyBhY3RpdmVcclxuICovXHJcbldpbmRvdy5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZTtcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5hY3RpdmUgPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0taW5hY3RpdmVcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3ctLWFjdGl2ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIlBXRC13aW5kb3ctLWFjdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0taW5hY3RpdmVcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV2luZG93O1xyXG4iLCJjb25zdCBQV0QgPSByZXF1aXJlKFwiLi9QV0QuanNcIik7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XHJcblxyXG4gICAgbGV0IHB3ZCA9IG5ldyBQV0QoKTtcclxuXHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocHdkLmdldENvbnRhaW5lcigpKTtcclxufSk7XHJcbiJdfQ==
