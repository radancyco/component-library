/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  function loadLanguagePack(url, callback) {

    // Install Language Pack.

    var getComponentLanguagePack = document.getElementById("component-library-language-pack");

    if (!getComponentLanguagePack) {

      var componentLanguagePack = document.createElement("script");

      componentLanguagePack.setAttribute("src", url);
      componentLanguagePack.setAttribute("id", "component-library-language-pack");
      componentLanguagePack.addEventListener("load", callback);

      document.head.appendChild(componentLanguagePack);

    } else {

      getComponentLanguagePack.addEventListener("load", callback);

    }

  }

  function initAccordion() {

    loadLanguagePack("https://services.tmpwebeng.com/component-library/language-pack.js", function(){

      // Display which version is in use via console:

      console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

      // Classes, data attributes, states, and strings.

      var accordionClass = ".accordion";
      var accordionCloseClassName = "accordion__close";
      var accordionCloseClass = "." + accordionCloseClassName;
      var accordionButtonClassName = "accordion__button";
      var accordionIconClassName = "accordion__icon";
      var accordionButtonClass = "." + accordionButtonClassName;
      var accordionHeadingClassName = "accordion__heading";
      var accordionPanelClass = ".accordion__panel";
      var accordionDataActiveState = "data-active";
      var accordionDataDefaultOpen = "data-open";
      var accordionDataOverlay = "data-overlay";
      var accordionDataCloseButton = "data-close";
      var accordionDataDisableAnchor = "data-disable-anchor";
      var accordionDataFixedHeight = "data-fixed-height";
      var accordionDataMultiOpen = "data-multiple";
      var accordions = document.querySelectorAll(accordionClass);
      var URLFragment = location.hash.slice(1);

      // Language

      var accordionCloseButtonLabel = window.accordionCloseButtonLabel;

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

          // Add Toggle Icon

          var toggleState = document.createElement("span");

          toggleState.setAttribute("aria-hidden", "true");
          toggleState.classList.add(accordionIconClassName);
          btn.append(toggleState);

          // Handle button click.

          btn.addEventListener("click", function() {

            var isExpanded = btn.getAttribute("aria-expanded") === "true";

            if (!accordion.hasAttribute(accordionDataMultiOpen)) {

              buttons.forEach(function(button) {

                button.setAttribute("aria-expanded", "false");

              });

            }

            btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");

            // Add "data-active" attribute on the parent accordion. Might be useful to achieve interesting UX.
      
            accordion.setAttribute(accordionDataActiveState, "");

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

            // Add "data-active" to parent.

            accordion.setAttribute(accordionDataActiveState, "");

            // Open targeted element.
            
            expandedButton = btn;

          }

        });

        if (expandedButton) { 
          
          expandedButton.setAttribute("aria-expanded", "true");

        }

        // Loop through each panel.

        panels.forEach(function(panel) {

          // Set up each disclosure.

          var currentPanel = panel.previousElementSibling;

          var panelID;

          if(currentPanel.classList.contains(accordionHeadingClassName)) {

            panelID = currentPanel.querySelector(accordionButtonClass).getAttribute("id");

          } else { 

            panelID = currentPanel.getAttribute("id");

          }

          panel.setAttribute("id", "accordion-" + panelID);

           // To better support scrolling and repositioned focus, the panels should have a proper role and accName.

          if (accordion.hasAttribute(accordionDataFixedHeight) || accordion.hasAttribute(accordionDataOverlay)) {

            panel.setAttribute("role", "region");
            panel.setAttribute("aria-labelledby", panelID);

          }

           // To better support inner-scrolling, the panels must be focusable.

          if (accordion.hasAttribute(accordionDataFixedHeight)) {

            panel.setAttribute("tabindex", "0");

          }

          // Add close button

          if (accordion.hasAttribute(accordionDataCloseButton)) {

            var closeButton = document.createElement("button");

            closeButton.setAttribute("aria-label", accordionCloseButtonLabel);
            closeButton.classList.add(accordionCloseClassName);

            closeButton.addEventListener("click", function() {

              var thisButton = panel.previousElementSibling;

              // Remove "data-active" attribute.

              accordion.removeAttribute(accordionDataActiveState);

              // Reset button state, move focus to button that initiated click.

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

    });

  }

  initAccordion();

})();