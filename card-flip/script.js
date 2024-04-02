/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which version is in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  // Classes, data attributes, states, and strings.

  var cardFlipClass = ".cardflip";
  var cardFlipItemClass = ".cardflip__item";
  var cardFlipTriggerName = "cardflip__trigger";
  var cardFlipTriggerClass = "." + cardFlipTriggerName;
  var cardFlipTriggerLabel = "Reveal Content";
  var cardFlipState = "show";
  var dataCardFlipToggle = "data-toggle-cards";
  var cardFlip = document.querySelectorAll(cardFlipClass);

  // Set up all Tablists on page

  cardFlip.forEach(function(card){

    var cardFlipCard = card.querySelectorAll(cardFlipItemClass);

    cardFlipCard.forEach(function(flip, x){

      var flipButton = document.createElement("button");
      flipButton.setAttribute("aria-pressed", "false");
      flipButton.classList.add(cardFlipTriggerName);
      flipButton.setAttribute("aria-label", cardFlipTriggerLabel);

      flip.prepend(flipButton);

      flipButton.addEventListener("click", function() {

        // Get all card items and buttons

        var cardItems = this.closest(cardFlipClass).querySelectorAll(cardFlipItemClass);
        var cardButtons = this.closest(cardFlipClass).querySelectorAll(cardFlipTriggerClass);
        var cardItemParent = this.parentNode;

        if(cardItemParent.classList.contains(cardFlipState)) {

          cardItemParent.classList.remove(cardFlipState);
          this.setAttribute("aria-pressed", "false");

        } else { 

          // Remove class from all card items

          if(this.closest(cardFlipClass).hasAttribute(dataCardFlipToggle)) {

            cardItems.forEach(function(item) {

              item.classList.remove(cardFlipState);

            });

            cardButtons.forEach(function(btn) {

              btn.setAttribute("aria-pressed", "false");

            });

          } 

          this.parentNode.classList.add(cardFlipState);
          this.setAttribute("aria-pressed", "true");

        }

      });

    });

  });

})();