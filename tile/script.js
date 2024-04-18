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

  var tileClass = ".tile";
  var tileItemClass = ".tile__item";
  var tileTriggerName = "tile__trigger";
  var tileTriggerClass = "." + tileTriggerName;
  var tileTriggerLabel = "Reveal Content";
  var tileState = "show";
  var dataTileOpen = "data-open-all";
  var tiles = document.querySelectorAll(tileClass);

  // For each component

  tiles.forEach(function(tile){

    var cards = tile.querySelectorAll(tileItemClass);

    cards.forEach(function(card){

      var tileButton = document.createElement("button");
      tileButton.setAttribute("aria-pressed", "false");
      tileButton.classList.add(tileTriggerName);
      tileButton.setAttribute("aria-label", tileTriggerLabel);
      card.prepend(tileButton);

      tileButton.addEventListener("click", function() {

        // Get all tile items and buttons

        var tileItems = this.closest(tileClass).querySelectorAll(tileItemClass);
        var tileButtons = this.closest(tileClass).querySelectorAll(tileTriggerClass);
        var tileItemParent = this.parentNode;

        if(tileItemParent.classList.contains(tileState)) {

          tileItemParent.classList.remove(tileState);
        
          this.setAttribute("aria-pressed", "false");

        } else { 

          // Remove class from all tile items

          if(!this.closest(tileClass).hasAttribute(dataTileOpen)) {

            tileItems.forEach(function(item) {

              item.classList.remove(tileState);

            });

            tileButtons.forEach(function(btn) {

              btn.setAttribute("aria-pressed", "false");

            });

          } 

          tileItemParent.classList.add(tileState);
          this.setAttribute("aria-pressed", "true");

        }

      });

    });

  });

})();