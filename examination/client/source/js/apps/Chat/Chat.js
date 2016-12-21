function Chat(settings) {
    /**
     * Properties
     */
    let container = settings.container ? settings.container : "no container";

    /**
     * Elements
     */
    let chatWrapperDiv = document.createElement("div");
    chatWrapperDiv.classList.add("chatWrapper");

    let messagesDiv = document.createElement("div");
    messagesDiv.classList.add("chatMessages");
    chatWrapperDiv.appendChild(messagesDiv);

    let inputDiv = document.createElement("div");
    inputDiv.classList.add("chatInput");
    chatWrapperDiv.appendChild(inputDiv);

    let containerDiv = document.querySelector(container);
    containerDiv.appendChild(chatWrapperDiv);

    /**
     * Functions
     */
    let socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");

    let data = {
        "type": "message",
        "data" : "HAHAHAH",
        "username": "najssimon",
        "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
    }

    socket.addEventListener("open", function(e) {
        socket.send(JSON.stringify(data));
    });

    socket.addEventListener("message", function(e) {
        let response = JSON.parse(e.data);
        console.log(response);

        let chatMessageSpan = document.createElement("span");
        chatMessageSpan.classList.add("chatMessage");

        chatMessageSpan.textContent += "[" + response.type + "] ";
        chatMessageSpan.textContent += response.username + ": ";
        chatMessageSpan.textContent += response.data;

        messagesDiv.appendChild(chatMessageSpan);
    });
}

module.exports = Chat;
