/**
 * The API is a way for applications to communicate with the PWD
 */
function MyAPI() {
    console.log("API constructor");
}

MyAPI.prototype.changeBackground = function() {
    
}

MyAPI.prototype.test = function() {
    console.log("api test");
}

module.exports = MyAPI;
