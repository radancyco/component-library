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
    var cardFlip = document.querySelectorAll(cardFlipClass);
  
    // Set up all Tablists on page
  
    cardFlip.forEach(function(card){


      var cardFlipCard = card.querySelectorAll(cardFlipCardClass);
  
      cardFlipCard.forEach(function(flip, x){

        var count = x + 1;

        var flipButton = document.createElement("button");
        flipButton.setAttribute("aria-pressed", "false");
        flipButton.classList.add("cardflip__trigger");
        

        if(count === 1) {

          flipButton.setAttribute("aria-label", "Open");

        } else {

          flipButton.setAttribute("aria-label", "Close");

        }

        flipButton.addEventListener("click", function() {

          var ariaExpanded = this.getAttribute("aria-pressed") === "true" || false;
  
          this.setAttribute("aria-pressed", !ariaExpanded);


 

            var siblingDivs = this.parentNode.parentNode.querySelectorAll(cardFlipCardClass); // Find sibling divs
            



            if(this.parentNode.classList.contains("active")) {

              this.parentNode.classList.remove('active');


            } else { 

              // Remove class from all sibling divs
              siblingDivs.forEach(function(sibling) {
                sibling.classList.remove('active');
              });

              this.parentNode.classList.add('active');

            }

                        

          

        });

        flip.prepend(flipButton);

      });
     
  
    });
  
  })();