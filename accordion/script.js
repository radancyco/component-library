/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  function initAccordion() {

    // Classes, data attributes, states, and strings.
  
    var accordionClass = ".accordion";
    var accordionCloseButtonLabel = "Close";
    var accordionCloseClassName = "accordion__close";
    var accordionButtonClassName = "accordion__button";
    var accordionButtonClass = "." + accordionButtonClassName;
    var accordionContentClass = ".accordion__content";
    var accordionDataDefaultOpen = "data-open-state";
    var accordionDataCloseButton = "data-close-button";
    var accordionDataDisableAnchor = "data-disable-anchor";
    var accordions = document.querySelectorAll(accordionClass);
    var URLFragment = location.hash.slice(1);

    // Display which version is in use via console:
  
    console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");
  
    // Set up all components on page
  
    accordions.forEach(function(acc, e){
  
      var index = e + 1;
  
      acc.setAttribute("id", "accordion-" + index);
  
      // Get all buttons within accordion.
  
      var buttons = acc.querySelectorAll(accordionButtonClass);
  
      // Get all disclosures within accordion.
  
      var contents = acc.querySelectorAll(accordionContentClass);
  
      // Array used to hold all accordion IDs. We will need these later.
  
      var disclosureNames = [];
  
      // Prep each button.

      var urlFragmentMatched = false;
  
      buttons.forEach(function(btn){
  
        var buttonID = btn.getAttribute("id");
  
        // Push all button ID's to array.
  
        disclosureNames.push(buttonID);
  
        // Setup each button.
  
        btn.setAttribute("aria-controls", "accordion-" + buttonID);
        btn.setAttribute("aria-expanded", "false");

        // Setup each discosure.

        btn.nextElementSibling.setAttribute("id", "accordion-" + buttonID)
        btn.nextElementSibling.setAttribute("role", "group");
  
        // Highlight tab based on hash or if specicic accordion item is opened.
   
        if (buttonID === URLFragment) {

          btn.setAttribute("aria-expanded", "true");

          urlFragmentMatched = true; 

        } 

        if(!URLFragment) {

          if(btn.hasAttribute(accordionDataDefaultOpen || !urlFragmentMatched)) {

            btn.setAttribute("aria-expanded", "true");

          }

        }

        // Do stuff when button is clicked.
  
        btn.addEventListener("click", function(e) {
  
          var disclosureID = btn.getAttribute("id");

          // Set any open accordion to closed.
  
          buttons.forEach(function(btn){
  
            btn.setAttribute("aria-expanded", "false");
  
          });

          // Open accordion
  
          this.setAttribute("aria-expanded", "true");

          // Disable default behavior of anchoring if data-disable-anchor present.
  
          if(!this.closest(accordionClass).hasAttribute(accordionDataDisableAnchor)) {
  
             history.pushState(null, null, "#" + disclosureID);
  
          }
  
        });
  
      });

      contents.forEach(function(content){
    
        // Close Button

        if(content.parentNode.hasAttribute(accordionDataCloseButton)) {

          var contentButton = document.createElement("button");
          contentButton.setAttribute("aria-label", accordionCloseButtonLabel);
          contentButton.classList.add(accordionCloseClassName);

          contentButton.addEventListener("click", function () {

            this.parentNode.previousElementSibling.setAttribute("aria-expanded", "false");

          });

          content.prepend(contentButton);

        }

      });
  
    });
  
    // All accordions must have unique IDs. Check to see if duplicate ID's exist and alert developer.
    // Note: This function may not be needed. Instead, simply having functionality so dependent on ID, may make this moot.
  
    var allButtonID = [];
    var accordionButtons = document.querySelectorAll(accordionButtonClass);
  
    accordionButtons.forEach(function(btn){
  
      var buttonID = btn.id;
  
      allButtonID.push(buttonID);
  
    });
  
    allButtonID.forEach(function(element, index, array) {
  
      // Check if the current element is equal to any subsequent element
  
      array.slice(index + 1).forEach(function(nextElement) {
  
        if (element === nextElement) {
  
          console.log("%c Warning: Duplicate Accordion ID found: #" + element + ". Accordions must only contain unique ID values. ", "background: #ff0000; color: #fff");
  
        }
  
      });
  
    });

  }

  initAccordion();

})();
