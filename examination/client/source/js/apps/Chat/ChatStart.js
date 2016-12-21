function ChatStart(settings) {
    /**
     * Properties
     */
    let container = settings.container ? settings.container : "no container";

    /**
     * Elements
     */
    let chatWrapperDiv = document.createElement("div");
    chatWrapperDiv.classList.add("chatWrapper");

    let chatStartHeader = document.createElement("div");
    let chatStartHeaderSpan document.createElement("span");

    let chatNameInput = document.createElement("input");
    // fix to make input selectable
    chatNameInput.addEventListener("mousedown", function(e) {
        e.stopPropagation();
        this.click();
    });
    chatNameInput.setAttribute("placeholder", "Enter name!!!");
    chatNameInput.classList.add("chatStartNameInput");
    chatWrapperDiv.appendChild(chatNameInput);

    let chatNameButton = document.createElement("button");
    chatNameButton.addEventListener("click", buttonEvent);
    chatNameButton.classList.add("chatStartNameButton");
    chatNameButton.setAttribute("type", "button");
    chatNameButton.textContent = "Start chatting!!!!!!!!";
    chatWrapperDiv.appendChild(chatNameButton);

    let containerDiv = document.querySelector(container);
    containerDiv.appendChild(chatWrapperDiv);

    /**
     * Functions
     */
    function buttonEvent() {
        alert("asd");
    }
}

module.exports = ChatStart;
