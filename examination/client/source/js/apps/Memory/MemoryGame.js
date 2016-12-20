const Cards = require("./Cards.js");

function MemoryGame(config) {
    /**
     * Properties
     */
    let nrOfPairs = config.nrOfPairs ? config.nrOfPairs : 4;

    let container = config.container ? config.container : "#cool";

    let cards = new Cards(this.nrOfPairs);

    let score = 0;

    let gameTimer = 0;

    let attempts = 0;

    let firstCard = "";

    let secondCard = "";

    let isCheckingAnswer = false;

    //let memoryWrapperDiv = document.createElement("div");
    //memoryWrapperDiv.classList.add("Memory-wrapper");

    /**
     * ELements
     */
    //let memoryWrapperTemplate = document.querySelector("#memoryWrapperTemplate");
    //let memoryWrapperFrag = document.importNode(memoryWrapperTemplate.content, true);

    //this.memoryWrapperDiv = memoryWrapperFrag.querySelector(".Memory-cards");
    //this.memoryWrapperDiv.addEventListener("click", memoryWrapperClickEvent);

    let memoryPanelTemplate = document.querySelector("#memoryPanelTemplate");
    let memoryPanelFrag = document.importNode(memoryPanelTemplate, true);

    let memoryPanelDiv          = memoryPanelFrag.querySelector(".Memory-panel");
    let memoryPanelAttemptsSpan = memoryPanelFrag.querySelector("#memoryPanelAttemptsSpan");
    let memoryPanelTimeSpan     = memoryPanelFrag.querySelector("#memoryPanelTimeSpan");
    let memoryPanelMessageSpan  = memoryPanelFrag.querySelector("#memoryPanelMessageSpan");

    let memoyCardsTemplate = document.querySelector("#memoryCardsTemplate");
    let memoryCardsFrag = document.importNode(memoryCardsTemplate.content, true);

    let memoryCardsDiv = memoryCardsFrag.querySelector(".Memory-cards");
    /*
    this.memoryPanel = document.createElement("div");
    this.memoryPanel.classList.add("Memory-panel");

    this.memoryCards = document.createElement("div");
    this.memoryCards.classList.add("Memory-cards");
    */
    /*
    switch(this.nrOfPairs) {
        case 1:
        case 2:
            this.memoryCards.classList.add("Memory-cards--width-240");
            break;
        case 3:
        case 4:
            this.memoryCards.classList.add("Memory-cards--width-360");
            break;
        case 5:
        case 6:
            this.memoryCards.classList.add("Memory-cards--width-480");
            break;
        case 7:
        case 8:
            this.memoryCards.classList.add("Memory-cards--width-600");
            break;
    }
    */
    this.memoryCards.appendChild(this.cards.getCardsFrag());

    //memoryWrapperDiv.appendChild(this.memoryPanel);
    //memoryWrapperDiv.appendChild(this.memoryCards);

    let memoryContainerDiv = document.querySelector(container);
    memoryContainerDiv.appendChild(memoryPanel);
    memoryContainerDiv.appendChild(memoryCards);
    //memoryContainerDiv.appendChild(memoryWrapperDiv);

    this.gameTimerInterval = setInterval(timer), 1000);

    function timer() {
        this.gameTimer++;

        this.memoryPanel.textContent = "";
        this.memoryPanel.appendChild(document.createTextNode("Attempts: "));
        this.memoryPanel.appendChild(document.createTextNode(this.attempts));
        this.memoryPanel.appendChild(document.createElement("br"));
        this.memoryPanel.appendChild(document.createTextNode("Time: "));
        this.memoryPanel.appendChild(document.createTextNode(this.gameTimer));
        this.memoryPanel.appendChild(document.createTextNode(" secounds"));
        this.memoryPanel.appendChild(document.createElement("br"));
        //this.memoryPanel.textContent = "Time: " + this.gameTimer + ", Attempts: " + this.attempts;
    }

    function memoryWrapperClickEvent(e) {
        e.preventDefault();

        let imgElem = e.target;

        let aElem = imgElem.nodeName === "IMG" ? imgElem.parentNode : imgElem;

        let value = aElem.getAttribute("data-index");

        let card = this.cards.getCard(value);

        if (card) {
            if (card.getIsFlipped() === false && this.isCheckingAnswer === false) {
                card.flip();

                if (this.firstCard === "") {
                    this.firstCard = card;
                } else {
                    this.secondCard = card;

                    this.checkAnswer();
                }
            }
        }
    }
}

MemoryGame.prototype.checkAnswer = function() {
    this.isCheckingAnswer = true;

    setTimeout(function() {
        this.attempts++;

        if (this.firstCard.getValue()[0] === this.secondCard.getValue()[0]) {
            this.firstCard.setIsComplete(true);
            this.secondCard.setIsComplete(true);

            this.firstCard.addClass("Memory-card--correct");
            this.secondCard.addClass("Memory-card--correct");

            this.score++;

            if (this.score === this.nrOfPairs) {
                clearInterval(this.gameTimerInterval);
                this.memoryPanel.textContent = "You completed the game!"
                this.memoryPanel.appendChild(document.createElement("br"));
                this.memoryPanel.textContent += "Attempts: " + this.attempts;
                this.memoryPanel.appendChild(document.createElement("br"));
                this.memoryPanel.textContent += "Time: " + this.gameTimer + " seconds";
            }
        } else {
            this.firstCard.flip();
            this.secondCard.flip();
        }

        this.firstCard = "";
        this.secondCard = "";

        this.isCheckingAnswer = false;
    }.bind(this), 2000);
}

module.exports = MemoryGame;
