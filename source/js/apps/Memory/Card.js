function Card(value) {
    /**
     * Properties
     */
    this.value = value;

    this.isFlipped = false;

    this.isComplete = false;

    /**
     * Elements
     */
    let cardTemplate = document.querySelector("#memoryCardTemplate");
    let cardTemplateFrag = document.importNode(cardTemplate.content, true);

    // The cardElem is the element wrapping the two images
    this.cardElem = cardTemplateFrag.querySelector(".memoryCard");
    this.cardElem.setAttribute("data-index", this.value);

    // The coverImage is the question mark above the card image
    this.coverImage = this.cardElem.querySelector(".memoryCard__back");
    this.coverImage.src = "image/Memory/" + this.value[0] + ".png";

    // The cardImage is the image of the memory card
    this.cardImage = this.cardElem.querySelector(".memoryCard__front");
}

/**
 * Returns the unique value for this card
 * The card identifier
 */
Card.prototype.getValue = function() {
    return this.value;
}

/**
 * Flips the card
 */
Card.prototype.flip = function() {
    if (this.isFlipped) {
        this.coverImage.classList.remove("memoryCard--flip");
        this.cardImage.classList.remove("memoryCard--flip");

        this.coverImage.classList.add("memoryCard--backflip");
        this.cardImage.classList.add("memoryCard--backflip");

        this.isFlipped = false;
    } else {
        this.coverImage.classList.remove("memoryCard--backflip");
        this.cardImage.classList.remove("memoryCard--backflip");

        this.coverImage.classList.add("memoryCard--flip");
        this.cardImage.classList.add("memoryCard--flip");

        this.isFlipped = true;
    }
}

Card.prototype.getIsFlipped = function() {
    return this.isFlipped;
}

Card.prototype.setIsComplete = function(value) {
    this.isComplete = value;
}

Card.prototype.addClass = function(className) {
    this.cardElem.classList.add(className);
}

Card.prototype.getCardElem = function() {
    return this.cardElem;
}

module.exports = Card;
