/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

function initAccordion(url, callback) {

  "use strict";

  // Install Language Pack.

  var getComponentLanguagePack = document.getElementById("component-library-language-pack");

  if (getComponentLanguagePack === null) {

    callback();

  } else {

    var componentLanguagePack = document.createElement("script");

    componentLanguagePack.setAttribute("src", url);
    componentLanguagePack.setAttribute("id", "component-library-language-pack");
    componentLanguagePack.onreadystatechange = callback;
    componentLanguagePack.onload = callback;

    document.getElementsByTagName("head")[0].appendChild(componentLanguagePack);

  }

}

initAccordion("https://services.tmpwebeng.com/component-library/language-pack.js", function(){

  // Display which version is in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  // Classes, data attributes, states, and strings.

  var accordionClass = ".accordion";
  var accordionCloseClassName = "accordion__close";
  var accordionCloseClass = "." + accordionCloseClassName;
  var accordionButtonClassName = "accordion__button";
  var accordionIconClassName = "accordion__icon";
  var accordionButtonClass = "." + accordionButtonClassName;
  var accordionShowAllClass = ".accordion__show";
  var accordionHeadingClassName = "accordion__heading";
  var accordionPanelClass = ".accordion__panel";
  var accordionDataActiveState = "data-active";
  var accordionDataDefaultOpen = "data-open";
  var accordionDataCloseButton = "data-close-button";
  var accordionDataDisableAnchor = "data-disable-anchor";
  var accordionDataFixedHeight = "data-fixed-height";
  var accordionDataMultiExpand = "data-multi-expand";
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

        if (!accordion.hasAttribute(accordionDataMultiExpand)) {

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

      if (accordion.hasAttribute(accordionDataFixedHeight)) {

        // For scrollbale content, we need to add a role and accName and tabindex, so user can access panel. 
        // Firefox does this natively. If interactive content is present in panel, then these attributes are not really needed (but it probably does not hurt to keep them).

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