(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Window = require("./Window.js");

function PWD() {
    this.container = new DocumentFragment();

    let windows = [];

    let newWindowXPos = 0;

    let newWindowYPos = 0;

    for (let i = 0; i < 10; i++) {
        windows.push(new Window({"id": i, "xPos": getNewWindowXPos(), "yPos": getNewWindowYPos()}));
    }

    for (let i = 0; i < windows.length; i++) {
        this.container.appendChild(windows[i].getContainer());
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
    }

    function windowMoveEvent(e) {
        let pwdWindow = getActiveWindow();

        if (pwdWindow) {
            //pwdWindowElem = getContainer();

            pwdWindow.updatePos(e.movementX, e.movementY);

            //console.log(e.movementX);
            //pwdWindow.setXPos(pwdWindow.getXPos() + e.movementX);
            //pwdWindow.setYPos(pwdWindow.getYPos() + e.movementY);

            //let pwdWindowElem = pwdWindow.getContainer();

            //console.log(pwdWindowElem.style.left);

            //console.log(e.clientX2 - (e.clientX - pwdWindow.getContainer().offsetLeft));
            //console.log(e.clientX - (e.clientX - pwdWindow.getContainer().offsetLeft));
            //pwdWindow.setXPos( e.clientX - (e.clientX - pwdWindow.getContainer().offsetLeft) );
            //pwdWindow.setYPos( e.clientY - (e.clientY - pwdWindow.getContainer().offsetTop) );
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

},{"./Window.js":2}],2:[function(require,module,exports){
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

        //alert(this.backgroundColor);

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

Window.prototype.setXPos = function(xPos) {
    this.yPos = xPos + "px";
}

Window.prototype.setYPos = function(yPos) {
    this.yPos = yPos + "px";
}

Window.prototype.getXPos = function() {
    return this.xPos;
}

Window.prototype.getYPos = function() {
    return this.yPos;
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

},{}],3:[function(require,module,exports){
const PWD = require("./PWD.js");

window.addEventListener("load", function() {
    let container = document.querySelector("main");

    let pwd = new PWD();

    container.appendChild(pwd.getContainer());
});

},{"./PWD.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUFdELmpzIiwiY2xpZW50L3NvdXJjZS9qcy9XaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBXaW5kb3cgPSByZXF1aXJlKFwiLi9XaW5kb3cuanNcIik7XHJcblxyXG5mdW5jdGlvbiBQV0QoKSB7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgbGV0IHdpbmRvd3MgPSBbXTtcclxuXHJcbiAgICBsZXQgbmV3V2luZG93WFBvcyA9IDA7XHJcblxyXG4gICAgbGV0IG5ld1dpbmRvd1lQb3MgPSAwO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICAgIHdpbmRvd3MucHVzaChuZXcgV2luZG93KHtcImlkXCI6IGksIFwieFBvc1wiOiBnZXROZXdXaW5kb3dYUG9zKCksIFwieVBvc1wiOiBnZXROZXdXaW5kb3dZUG9zKCl9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQod2luZG93c1tpXS5nZXRDb250YWluZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXJzLmJpbmQodGhpcykoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBsZXQgcHdkV2luZG93ID0gZ2V0V2luZG93KHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtd2luZG93aWRcIikpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwd2RXaW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIHNldEFjdGl2ZShwd2RXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwd2RXaW5kb3dFbGVtID0gcHdkV2luZG93LmdldENvbnRhaW5lcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHdpbmRvd01vdmVFdmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB3aW5kb3dNb3ZlRXZlbnQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHdpbmRvd01vdmVFdmVudChlKSB7XHJcbiAgICAgICAgbGV0IHB3ZFdpbmRvdyA9IGdldEFjdGl2ZVdpbmRvdygpO1xyXG5cclxuICAgICAgICBpZiAocHdkV2luZG93KSB7XHJcbiAgICAgICAgICAgIC8vcHdkV2luZG93RWxlbSA9IGdldENvbnRhaW5lcigpO1xyXG5cclxuICAgICAgICAgICAgcHdkV2luZG93LnVwZGF0ZVBvcyhlLm1vdmVtZW50WCwgZS5tb3ZlbWVudFkpO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhlLm1vdmVtZW50WCk7XHJcbiAgICAgICAgICAgIC8vcHdkV2luZG93LnNldFhQb3MocHdkV2luZG93LmdldFhQb3MoKSArIGUubW92ZW1lbnRYKTtcclxuICAgICAgICAgICAgLy9wd2RXaW5kb3cuc2V0WVBvcyhwd2RXaW5kb3cuZ2V0WVBvcygpICsgZS5tb3ZlbWVudFkpO1xyXG5cclxuICAgICAgICAgICAgLy9sZXQgcHdkV2luZG93RWxlbSA9IHB3ZFdpbmRvdy5nZXRDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocHdkV2luZG93RWxlbS5zdHlsZS5sZWZ0KTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZS5jbGllbnRYMiAtIChlLmNsaWVudFggLSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkub2Zmc2V0TGVmdCkpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGUuY2xpZW50WCAtIChlLmNsaWVudFggLSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkub2Zmc2V0TGVmdCkpO1xyXG4gICAgICAgICAgICAvL3B3ZFdpbmRvdy5zZXRYUG9zKCBlLmNsaWVudFggLSAoZS5jbGllbnRYIC0gcHdkV2luZG93LmdldENvbnRhaW5lcigpLm9mZnNldExlZnQpICk7XHJcbiAgICAgICAgICAgIC8vcHdkV2luZG93LnNldFlQb3MoIGUuY2xpZW50WSAtIChlLmNsaWVudFkgLSBwd2RXaW5kb3cuZ2V0Q29udGFpbmVyKCkub2Zmc2V0VG9wKSApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGFjdGl2ZSB3aW5kb3cuXHJcbiAgICAgKiBJZiBubyB3aW5kb3cgaXMgYWN0aXZlIC0+IHJldHVybiB1bmRlZmluZWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlV2luZG93KCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAod2luZG93c1tpXS5pc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgYWxsIHRoZSB3aW5kb3dzIGFzIGluYWN0aXZlXHJcbiAgICAgKiBTZXRzIHRoZSBnaXZlbiB3aW5kb3cgYXMgYWN0aXZlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldEFjdGl2ZShwd2RXaW5kb3cpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgd2luZG93c1tpXS5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHdkV2luZG93LnNldEFjdGl2ZSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHdpbmRvdyBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gaWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0V2luZG93KGlkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dzW2ldLmdldElkKCkgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXROZXdXaW5kb3dYUG9zKCkge1xyXG4gICAgICAgIG5ld1dpbmRvd1hQb3MgKz0gMjA7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdXaW5kb3dYUG9zO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldE5ld1dpbmRvd1lQb3MoKSB7XHJcbiAgICAgICAgbmV3V2luZG93WVBvcyArPSAyMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1dpbmRvd1lQb3M7XHJcbiAgICB9XHJcbn1cclxuXHJcblBXRC5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUFdEO1xyXG4iLCJmdW5jdGlvbiBXaW5kb3coc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuaWQgPSBzZXR0aW5ncy5pZCA/IHNldHRpbmdzLmlkIDogMDtcclxuXHJcbiAgICB0aGlzLnhQb3MgPSBzZXR0aW5ncy54UG9zID8gc2V0dGluZ3MueFBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLnlQb3MgPSBzZXR0aW5ncy55UG9zID8gc2V0dGluZ3MueVBvcyA6IDEwMDtcclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA/IHNldHRpbmdzLmJhY2tncm91bmRDb2xvciA6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gc2V0dGluZ3MuYWN0aXZlID8gc2V0dGluZ3MuYWN0aXZlIDogdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGluaXRpYWxpemVDb250YWluZXIuYmluZCh0aGlzKSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb250YWluZXIoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdpbmRvd2lkXCIsIHRoaXMuaWQpO1xyXG5cclxuICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IHRoaXMueFBvcyArIFwicHhcIjtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IHRoaXMueVBvcyArIFwicHhcIjtcclxuXHJcbiAgICAgICAgLy9hbGVydCh0aGlzLmJhY2tncm91bmRDb2xvcik7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNcIiArIHRoaXMuYmFja2dyb3VuZENvbG9yO1xyXG5cclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIlBXRC13aW5kb3dcIik7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUudXBkYXRlUG9zID0gZnVuY3Rpb24oeE1vdmVtZW50LCB5TW92ZW1lbnQpIHtcclxuICAgIHRoaXMueFBvcyArPSB4TW92ZW1lbnQ7XHJcbiAgICB0aGlzLnlQb3MgKz0geU1vdmVtZW50O1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSB0aGlzLnhQb3MgKyBcInB4XCI7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0aGlzLnlQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuc2V0WFBvcyA9IGZ1bmN0aW9uKHhQb3MpIHtcclxuICAgIHRoaXMueVBvcyA9IHhQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuc2V0WVBvcyA9IGZ1bmN0aW9uKHlQb3MpIHtcclxuICAgIHRoaXMueVBvcyA9IHlQb3MgKyBcInB4XCI7XHJcbn1cclxuXHJcbldpbmRvdy5wcm90b3R5cGUuZ2V0WFBvcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueFBvcztcclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRZUG9zID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy55UG9zO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoaXMgd2luZG93IGlzIGFjdGl2ZVxyXG4gKi9cclxuV2luZG93LnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlO1xyXG59XHJcblxyXG5XaW5kb3cucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJQV0Qtd2luZG93LS1pbmFjdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiUFdELXdpbmRvdy0tYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiUFdELXdpbmRvdy0tYWN0aXZlXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJQV0Qtd2luZG93LS1pbmFjdGl2ZVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuV2luZG93LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3c7XHJcbiIsImNvbnN0IFBXRCA9IHJlcXVpcmUoXCIuL1BXRC5qc1wiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcclxuXHJcbiAgICBsZXQgcHdkID0gbmV3IFBXRCgpO1xyXG5cclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwd2QuZ2V0Q29udGFpbmVyKCkpO1xyXG59KTtcclxuIl19
