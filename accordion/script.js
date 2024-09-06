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
    var accordionDataDefaultOpen = "data-open";
    var accordionDataCloseButton = "data-close-button";
    var accordionDataDisableAnchor = "data-disable-anchor";
    var accordionDataFixedHeight = "data-fixed-height";
    var accordions = document.querySelectorAll(accordionClass);
    var URLFragment = location.hash.slice(1);

    // Display which version is in use via console:
  
    console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");
  
    // Set up all accordions on the page
  
    accordions.forEach(function(acc, e){

      // Set unique ID on all accordions.
  
      var index = e + 1;
  
      acc.setAttribute("id", "accordion-" + index);
  
      // Get all buttons within accordion.
  
      var buttons = acc.querySelectorAll(accordionButtonClass);
  
      // Get all disclosures within accordion.
  
      var panels = acc.querySelectorAll(accordionContentClass);
  
      // Set variable for slected button target

      var expandedButton = null;

      // Loop through each button

      buttons.forEach(function(btn) {

        var buttonID = btn.getAttribute("id");

        // Setup each button.

        btn.setAttribute("aria-controls", "accordion-" + buttonID);
        btn.setAttribute("aria-expanded", "false");

        // Click event for each button.

        btn.addEventListener("click", function() {

          // Get button ID.

          var disclosureID = btn.getAttribute("id");

          // Close all accordions before opening the clicked one.

          if(this.closest(accordionClass).hasAttribute("data-toggle")) {

            var  isExpanded = this.getAttribute("aria-expanded");
   
            if (isExpanded === "true") {

              // Close All Buttons

              buttons.forEach(function(btn) {

                btn.setAttribute("aria-expanded", "false");

              });
    
            } else {
    
              // Close All Buttons

              buttons.forEach(function(btn) {

                btn.setAttribute("aria-expanded", "false");

              });

              // Open Selected
    
              this.setAttribute("aria-expanded", "true");

            }
  
          } else {

            buttons.forEach(function(btn) {

              btn.setAttribute("aria-expanded", "false");

            });
    
            this.setAttribute("aria-expanded", "true");

          }

          // Handle history push if not disabled

          if (!this.closest(accordionClass).hasAttribute(accordionDataDisableAnchor)) {

            history.pushState(null, null, "#" + disclosureID);

          }

        });

        // Check the URL fragment or data attribute to set aria-expanded="true" only for one button

        if (buttonID === URLFragment) {

          expandedButton = btn; // Save this button matching the URL fragment

        } else if (btn.hasAttribute(accordionDataDefaultOpen)) {

          // If no button has matched the URL fragment, save the one with the default open attribute

          if (!expandedButton) {

            expandedButton = btn; // Save this button matching the URL fragment

          }

        }

      });

      // After all buttons are initialized, set aria-expanded="true" only for the relevant one

      if (expandedButton) {

        expandedButton.setAttribute("aria-expanded", "true");

      }

      // Loop through each disclosure.

      panels.forEach(function(panel){

         // Setup each disclosure.

         var panelID = panel.previousElementSibling.getAttribute("id");

         panel.setAttribute("id", "accordion-" + panelID);

         if(panel.closest(accordionClass).hasAttribute(accordionDataFixedHeight)) {

          panel.setAttribute("role", "region");
          panel.setAttribute("tabindex", "0");
          panel.setAttribute("aria-labelledby", panelID + " " + "accordion-" + panelID);

         }

    
        // Close Button

        if(panel.parentNode.hasAttribute(accordionDataCloseButton)) {

          var panelButton = document.createElement("button");
          panelButton.setAttribute("aria-label", accordionCloseButtonLabel);
          panelButton.classList.add(accordionCloseClassName);

          panelButton.addEventListener("click", function () {

            this.parentNode.previousElementSibling.setAttribute("aria-expanded", "false");

          });

          panel.prepend(panelButton);

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
