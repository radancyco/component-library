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
    var accordionCloseClass = "." + accordionCloseClassName;
    var accordionButtonClassName = "accordion__button";
    var accordionButtonClass = "." + accordionButtonClassName;
    var accordionPanelClass = ".accordion__panel";
    var accordionDataDefaultOpen = "data-open";
    var accordionDataCloseButton = "data-close-button";
    var accordionDataDisableAnchor = "data-disable-anchor";
    var accordionDataFixedHeight = "data-fixed-height";
    var accordions = document.querySelectorAll(accordionClass);
    var URLFragment = location.hash.slice(1);

    // Display which version is in use via console:

    console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

    // Loop through and set up all accordions on the page.

    accordions.forEach(function(accordion, index) {

      // Set unique ID on all accordions.

      accordion.setAttribute("id", "accordion-" + (index + 1));

      // Get all buttons within accordion.

      var buttons = accordion.querySelectorAll(accordionButtonClass);

      // Get all panels within accordion.
      
      var panels = accordion.querySelectorAll(accordionPanelClass);

      // Set variable for slected button target.

      var expandedButton = null;

      // Loop through each button.

      buttons.forEach(function(btn) {

        // Get button ID. Remember: ID's should always be unique.

        var buttonID = btn.getAttribute("id");

        // Set up each button.

        btn.setAttribute("aria-controls", "accordion-" + buttonID);
        btn.setAttribute("aria-expanded", "false");

        // Handle button click.

        btn.addEventListener("click", function() {

          var isExpanded = btn.getAttribute("aria-expanded") === "true";
          var isOpen = btn.closest(accordionClass).hasAttribute("data-open");

          buttons.forEach(function(button) {

            button.setAttribute("aria-expanded", "false");

          });

          btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");

          // Toggle the "data-open" attribute on the parent accordion. This is for future useage.
    
          if (isOpen) {
            
            accordion.removeAttribute(accordionDataDefaultOpen);
  
          } else {
            
            accordion.setAttribute(accordionDataDefaultOpen, "");
  
          }

          // Place focus on close button if present.

          if (accordion.hasAttribute(accordionDataCloseButton)) {

            btn.nextElementSibling.querySelector(accordionCloseClass).focus();

          }

          // Add URL Fragment to URL if not disabled.

          if (!accordion.hasAttribute(accordionDataDisableAnchor)) {

            history.pushState(null, null, "#" + buttonID);

          }

        });

        // Default open based on URL fragment or data-open attribute.

        if (buttonID === URLFragment || (!expandedButton && btn.hasAttribute(accordionDataDefaultOpen))) {
          
          expandedButton = btn;

        }

      });

      if (expandedButton) { 
        
        expandedButton.setAttribute("aria-expanded", "true");

      }

      // Loop through each panel.

      panels.forEach(function(panel) {

        // Set up each disclosure.

        var panelID = panel.previousElementSibling.getAttribute("id");

        panel.setAttribute("id", "accordion-" + panelID);

        if (accordion.hasAttribute(accordionDataFixedHeight)) {

          panel.setAttribute("role", "region");
          panel.setAttribute("tabindex", "0");
          panel.setAttribute("aria-labelledby", "accordion-" + panelID);

        }

        // Add close button

        if (accordion.hasAttribute(accordionDataCloseButton)) {

          var closeButton = document.createElement("button");

          closeButton.setAttribute("aria-label", accordionCloseButtonLabel);
          closeButton.classList.add(accordionCloseClassName);

          closeButton.addEventListener("click", function() {

            var thisButton = panel.previousElementSibling;

            thisButton.setAttribute("aria-expanded", "false");
            thisButton.focus();

          });

          panel.prepend(closeButton);

        }

      });

    });

    // Check for duplicate IDs and log a warning

    var buttonIDs = Array.prototype.map.call(document.querySelectorAll(accordionButtonClass), function(btn) {
  
      return btn.id;

    });

    buttonIDs.forEach(function(id, index) {

      if (buttonIDs.indexOf(id, index + 1) !== -1) {

        console.warn("%c Warning: Duplicate Accordion ID found: #" + id + ". Accordions must have unique ID values.", "background: #ff0000; color: #fff");

      }

    });

  }

  initAccordion();

})();