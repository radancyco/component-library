/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(() => {

  "use strict";

  const loadLanguagePack = (url, callback) => {

    // Install Language Pack.

    const getComponentLanguagePack = document.getElementById("component-library-language-pack");

    if (!getComponentLanguagePack) {

      const componentLanguagePack = document.createElement("script");

      componentLanguagePack.setAttribute("src", url);
      componentLanguagePack.setAttribute("id", "component-library-language-pack");
      componentLanguagePack.addEventListener("load", callback);

      document.head.appendChild(componentLanguagePack);

    } else {

      getComponentLanguagePack.addEventListener("load", callback);

    }

  };

  const initAccordion = () => {

    loadLanguagePack("https://services.tmpwebeng.com/component-library/language-pack.js", () => {

      // Display which version is in use via console:

      console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

      // Classes, data attributes, states, and strings.

      const accordionClass = ".accordion";
      const accordionCloseClassName = "accordion__close";
      const accordionCloseClass = `.${accordionCloseClassName}`;
      const accordionToggleClassName = "accordion__toggle";
      const accordionArrowClassName = "accordion__arrow";
      const accordionToggleClass = `.${accordionToggleClassName}`;
      const accordionToggleAllClass = ".accordion__toggle-all";
      const accordionHeadingClassName = "accordion__heading";
      const accordionPanelClass = ".accordion__panel";
      const accordionDataActiveState = "data-active";
      const accordionDataDefaultOpen = "data-open";
      const accordionDataOverlay = "data-overlay";
      const accordionDataCloseButton = "data-close";
      const accordionDataDisableAnchor = "data-disable-anchor";
      const accordionDataFixedHeight = "data-fixed-height";
      const accordionDataMultiOpen = "data-multiple";
      const accordionDataRemoveArrow = "data-remove-arrow";
      const accordions = document.querySelectorAll(accordionClass);
      const URLFragment = location.hash.slice(1);

      // Language

      const accordionCloseButtonLabel = window.accordionCloseButtonLabel;

      // Loop through and set up all accordions on the page.

      accordions.forEach((accordion, index) => {

        // Set unique ID on all accordions.

        accordion.setAttribute("id", `accordion-${index + 1}`);

        // Get all buttons within accordion.

        const accordionToggles = accordion.querySelectorAll(accordionToggleClass);

        // Get all panels within accordion.

        const accordionPanels = accordion.querySelectorAll(accordionPanelClass);

        // Set variable for selected button target.

        let expandedButton = null;

        // Get "Toggle All " button.

        const btnToggleAll = accordion.querySelector(accordionToggleAllClass);

        // Loop through each toggle button.

        accordionToggles.forEach(btn => {

          // Get button ID. Remember: ID's should always be unique.

          const buttonID = btn.getAttribute("id");

          // Set up each button.

          btn.setAttribute("aria-controls", `accordion-${buttonID}`);
          btn.setAttribute("aria-expanded", "false");

          // Add Toggle Arrow

          if (!accordion.hasAttribute(accordionDataRemoveArrow)) {

            const toggleState = document.createElement("span");

            toggleState.setAttribute("aria-hidden", "true");
            toggleState.classList.add(accordionArrowClassName);
            btn.append(toggleState);

          }

          // Handle button click.

          btn.addEventListener("click", () => {

            const isExpanded = btn.getAttribute("aria-expanded") === "true";

            if (!accordion.hasAttribute(accordionDataMultiOpen)) {

              accordionToggles.forEach(button => {

                button.setAttribute("aria-expanded", "false");

              });

            }

            btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");

            // Add "data-active" attribute on the parent accordion. Might be useful to achieve interesting UX.

            accordion.setAttribute(accordionDataActiveState, "");

            // If "Toggle All" button is present, then always set it to false.

            if (btnToggleAll) {

              btnToggleAll.setAttribute("aria-pressed", "false");

            }

            // Place focus on close button if present.

            if (accordion.hasAttribute(accordionDataCloseButton)) {

              btn.nextElementSibling.querySelector(accordionCloseClass).focus();

            }

            // Add URL Fragment to URL if not disabled.

            if (!accordion.hasAttribute(accordionDataDisableAnchor)) {

              history.pushState(null, null, `#${buttonID}`);

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

        // If "Toggle All" button is present...

        if (btnToggleAll) {

          btnToggleAll.setAttribute("aria-pressed", "false");

          if (!accordion.hasAttribute(accordionDataRemoveArrow)) {

            const toggleAllState = document.createElement("span");

            toggleAllState.setAttribute("aria-hidden", "true");
            toggleAllState.classList.add(accordionArrowClassName);
            btnToggleAll.append(toggleAllState);

          }

          // Toggle All Event

          btnToggleAll.addEventListener("click", function () {

            const isPressed = this.getAttribute("aria-pressed");

            this.setAttribute("aria-pressed", isPressed === "true" ? "false" : "true");

            // Get all accordion buttons and handle their state based on toggle button state.

            accordionToggles.forEach(btn => {

              btn.setAttribute("aria-expanded", isPressed === "true" ? "false" : "true");

            });

          });

        }

        // Loop through each panel.

        accordionPanels.forEach(panel => {

          // Set up each disclosure.

          const currentPanel = panel.previousElementSibling;

          let panelID;

          if (currentPanel.classList.contains(accordionHeadingClassName)) {

            panelID = currentPanel.querySelector(accordionToggleClass).getAttribute("id");

          } else {

            panelID = currentPanel.getAttribute("id");

          }

          panel.setAttribute("id", `accordion-${panelID}`);

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

            const closeButton = document.createElement("button");

            closeButton.setAttribute("aria-label", accordionCloseButtonLabel);
            closeButton.classList.add(accordionCloseClassName);

            closeButton.addEventListener("click", () => {

              const thisButton = panel.previousElementSibling;

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

      const buttonIDs = Array.from(document.querySelectorAll(accordionToggleClass)).map(btn => btn.id);

      buttonIDs.forEach((id, index) => {

        if (buttonIDs.indexOf(id, index + 1) !== -1) {

          console.warn(`%c Warning: Duplicate Accordion ID found: #${id}. Accordions must have unique ID values.`, "background: #ff0000; color: #fff");

        }

      });

    });

  };

  initAccordion();

})();