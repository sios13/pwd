const MemoryGame = require("./MemoryGame.js");

window.addEventListener("load", function() {
    let startGameButton = document.querySelector("#startGameButton");

    startGameButton.addEventListener("click", function() {
        let checkedInput = document.querySelector("#pairForm input:checked");

        if (checkedInput) {
            let inputValue = checkedInput.value;

            let gameBoard = document.querySelector("#gameBoard");

            gameBoard.textContent = "";

            let memoryGame = new MemoryGame({"nrOfPairs": parseInt(inputValue), "container": "#gameBoard"});
        }
    });
});
