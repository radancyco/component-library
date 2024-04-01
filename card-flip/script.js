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
  var cardFlipCardClass = ".cardflip__item";
  var cardFlipTriggerName = "cardflip__trigger";
  var cardFlipTriggerClass = "." + cardFlipTriggerName;
  var cardFlipState = "show";
  var cardFlip = document.querySelectorAll(cardFlipClass);

  // Set up all Tablists on page

  cardFlip.forEach(function(card){

    var cardFlipCard = card.querySelectorAll(cardFlipCardClass);

    cardFlipCard.forEach(function(flip, x){

      var flipButton = document.createElement("button");
      flipButton.setAttribute("aria-pressed", "false");
      flipButton.classList.add(cardFlipTriggerName);
      flipButton.setAttribute("aria-label", "Show Content");

      flip.prepend(flipButton);

      flipButton.addEventListener("click", function() {

        // Get all card list items and buttons

        var cardItems = this.closest(cardFlipClass).querySelectorAll(cardFlipCardClass);
        var cardButtons = this.closest(cardFlipClass).querySelectorAll(cardFlipTriggerClass);

        if(this.parentNode.classList.contains(cardFlipState)) {

          this.parentNode.classList.remove(cardFlipState);
          this.setAttribute("aria-pressed", "false");

        } else { 

          // Remove class from all sibling divs

          if(this.closest(cardFlipClass).hasAttribute("data-toggle-all")) {

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