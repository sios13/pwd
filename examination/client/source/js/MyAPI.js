/**
 * The API is a way for applications to communicate with the PWD
 */
function MyAPI(settings = {}) {
    this.pwdContainer = settings.pwdContainer ? settings.pwdContainer : undefined;
}

MyAPI.prototype.setPwdBackground = function(index) {
    this.pwdContainer.className = "";

    this.pwdContainer.classList.add("main--background-" + index);
}

MyAPI.prototype.test = function() {
    console.log("api test");
}

module.exports = MyAPI;
