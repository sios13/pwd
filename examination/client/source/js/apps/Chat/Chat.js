function Chat(settings) {
    /**
     * Properties
     */
    let container = settings.container ? settings.container : "no container";

    let username = settings.username ? settings.username : "najssimon";

    let socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");
    //socket.addEventListener("open", socketOpenEvent);
    socket.addEventListener("message", socketMessageEvent);

    /**
     * Elements
     */
    // Chat wrapper
    let chatWrapperDiv = document.createElement("div");
    chatWrapperDiv.classList.add("chatWrapper");

    // Messages div
    let messagesDiv = document.createElement("div");
    messagesDiv.classList.add("chatMessages");
    chatWrapperDiv.appendChild(messagesDiv);

    // Input form
    let inputDiv = document.createElement("from");
    inputDiv.classList.add("chatInput");
    chatWrapperDiv.appendChild(inputDiv);

    // Textarea in the input div
    let inputDiv_textarea = document.createElement("textarea");
    inputDiv_textarea.classList.add("chatInput_textarea");
    // fix to make textarea selectable
    inputDiv_textarea.addEventListener("mousedown", function(e) {
        e.stopPropagation();
        this.click();
    });
    inputDiv.appendChild(inputDiv_textarea);

    // Button in the input div
    let inputDiv_button = document.createElement("button");
    inputDiv_button.addEventListener("click", buttonEvent);
    inputDiv_button.classList.add("chatInput_button");
    inputDiv_button.setAttribute("type", "button");
    inputDiv_button.textContent = "Send";
    inputDiv.appendChild(inputDiv_button);

    // Container div
    let containerDiv = document.querySelector(container);
    containerDiv.appendChild(chatWrapperDiv);

    /**
     * Functions
     */
    function socketOpenEvent(e) {
        //socket.send(JSON.stringify(data));
    }

    function socketMessageEvent(e) {
        let response = JSON.parse(e.data);
        console.log(response);

        let chatMessageSpan = document.createElement("span");
        chatMessageSpan.classList.add("chatMessage");

        chatMessageSpan.textContent += "[" + response.type + "] ";
        chatMessageSpan.textContent += response.username + ": ";
        chatMessageSpan.textContent += response.data;

        messagesDiv.appendChild(chatMessageSpan);
    }

    function buttonEvent(e) {
        let value = inputDiv_textarea.value;

        if (value === "") {
            console.log("Must enter a message!");

            return;
        }

        inputDiv_textarea.value = "";

        let data = {
            "type": "message",
            "data" : value,
            "username": username,
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        }

        socket.send(JSON.stringify(data));
    }
}

Chat.prototype.close = function() {
    socket.close();
}

module.exports = Chat;
