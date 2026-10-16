/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(() => {

  "use strict";

  // Display which Disclosure is in use via console:

  console.log("%c{{ include.title }}%cv{{ include.version }}", "background: #2d2d2d; color: #fff; padding: 6px 10px; border-radius: 16px 0 0 16px; font-weight: 600;" , "background: #6e00ee; color: #fff; padding: 6px 10px; border-radius: 0 16px 16px 0; font-weight: 600;");

  // Commonly used Classes, Data Attributes, States, Strings, etc.

  const disclosureButtonClass = ".disclosure--btn";
  const disclosureButtons = document.querySelectorAll(disclosureButtonClass);
  const disclosureArrowClassName = "disclosure--arrow";
  const disclosureContentClass = ".disclosure--content";
  const disclosureHeadingClass = ".disclosure--heading";
  const disclosureDataDefaultOpen = "data-open";
  const disclosureDataEnableAnchor = "data-enable-anchor";
  const disclosureDataLightDismiss = "data-light-dismiss";
  const disclosureDataRemoveArrow = "data-remove-arrow";

  // Light Dismiss: Disclosures that close on Escape, or when the user clicks or tabs to something that is not part of any disclosure.

  const allDisclosures = [];
  const lightDismissDisclosures = [];

  // Focus moves on pointerdown. Closing then would collapse content and shift the layout before the click lands, so pointer interactions are left to the click listener.

  let isPointerInteraction = false;

  const isInsideDisclosure = (disclosure, node) => disclosure.trigger.contains(node) || disclosure.content.contains(node);

  // Persistent and context disclosures hide the button on larger viewports, where content is always shown. They then behave as regular page content.

  const isDisclosureInteractive = (disclosure) => {

    const button = disclosure.button;

    return getComputedStyle(button).visibility === "visible" && button.getClientRects().length > 0;

  };

  const isDisclosureOpen = (disclosure) => disclosure.button.getAttribute("aria-expanded") === "true" && isDisclosureInteractive(disclosure);

  // Moving between disclosures leaves them open, so they do not behave like an accordion.

  const isInsideAnyDisclosure = (node) => allDisclosures.some((disclosure) => isDisclosureInteractive(disclosure) && isInsideDisclosure(disclosure, node));

  const closeDisclosure = (disclosure) => {

    disclosure.button.setAttribute("aria-expanded", "false");

  };

  const closeOpenDisclosures = () => {

    lightDismissDisclosures.filter(isDisclosureOpen).forEach(closeDisclosure);

  };

  // Add Listener and other needed attributes to disclosure button

  disclosureButtons.forEach((button, index) => {

    const count = index + 1;

    // Trigger is the heading wrapping the button, or the button itself.

    const trigger = button.closest(disclosureHeadingClass) || button;

    // Content must directly follow the trigger. If missing, skip this disclosure.

    const content = trigger.nextElementSibling;

    if (!content || !content.matches(disclosureContentClass)) {

      console.warn(`Disclosure: No ${disclosureContentClass} found directly after button.`, button);

      return;

    }

    button.setAttribute("aria-expanded", "false");

    let thisButtonID, thisContentID;

    if (button.hasAttribute("id")) {

      // Check for custom ID on button.

      thisButtonID = button.getAttribute("id");
      thisContentID = `${thisButtonID}-content`;

    } else {

      // Else, add dynamic ID.

      thisButtonID = `disclosure-btn-${count}`;
      thisContentID = `disclosure-content-${count}`;

    }

    // Set ID and aria-controls on button.

    button.setAttribute("id", thisButtonID);
    button.setAttribute("aria-controls", thisContentID);
    content.setAttribute("id", thisContentID);

    // If custom arrow not needed.

    if (!button.hasAttribute(disclosureDataRemoveArrow)) {

      const toggleState = document.createElement("span");
      toggleState.setAttribute("aria-hidden", "true");
      toggleState.classList.add(disclosureArrowClassName);
      button.append(toggleState);

    }

    button.addEventListener("click", () => {

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      
      button.setAttribute("aria-expanded", isExpanded ? "false" : "true");

      if (button.hasAttribute(disclosureDataEnableAnchor)) {

        history.pushState(null, null, `#${button.id}`);

      }

    });

    // Track all disclosures, and those with light dismiss enabled.

    const disclosure = { button, trigger, content };

    allDisclosures.push(disclosure);

    if (button.hasAttribute(disclosureDataLightDismiss)) {

      lightDismissDisclosures.push(disclosure);

    }

    // Open desired disclosure.

    if (button.hasAttribute(disclosureDataDefaultOpen)) {

      button.setAttribute("aria-expanded", "true");

    }

  });

  // Open selected disclosure via URL fragment, on load and whenever the fragment changes (e.g., in-page links).

  const openFromURLFragment = () => {

    const disclosureTarget = document.getElementById(location.hash.slice(1));

    if (disclosureTarget && disclosureTarget.matches(disclosureButtonClass)) {

      disclosureTarget.setAttribute("aria-expanded", "true");
      disclosureTarget.focus();

    }

  };

  openFromURLFragment();

  window.addEventListener("hashchange", openFromURLFragment);

  // Light Dismiss: Outside click, outside focus, and Escape key. Only added if a light dismiss disclosure is present.

  if (lightDismissDisclosures.length) {

    document.addEventListener("pointerdown", () => {

      isPointerInteraction = true;

    }, true);

    // Reset on click, or on keydown in case the pointer was dragged away and no click followed.

    ["click", "keydown"].forEach((type) => {

      document.addEventListener(type, () => {

        isPointerInteraction = false;

      }, true);

    });

    document.addEventListener("click", (event) => {

      if (!isInsideAnyDisclosure(event.target)) {

        closeOpenDisclosures();

      }

    });

    document.addEventListener("focusin", (event) => {

      if (!isPointerInteraction && !isInsideAnyDisclosure(event.target)) {

        closeOpenDisclosures();

      }

    });

    document.addEventListener("keydown", (event) => {

      if (event.key !== "Escape" || event.defaultPrevented) {

        return;

      }

      const openDisclosures = lightDismissDisclosures.filter(isDisclosureOpen);
      const focusedElement = document.activeElement;

      // Close the innermost open disclosure containing focus. Nested disclosures come later in document order, so the last match is the innermost.

      const currentDisclosure = openDisclosures.findLast((disclosure) => isInsideDisclosure(disclosure, focusedElement));

      if (currentDisclosure) {

        closeDisclosure(currentDisclosure);

        // Return focus to the button so it is not left inside hidden content.

        if (currentDisclosure.content.contains(focusedElement)) {

          currentDisclosure.button.focus();

        }

        // Prevent an enclosing dialog from also closing on the same key press.

        event.preventDefault();

      } else if (focusedElement === document.body && openDisclosures.length) {

        // Safari does not focus buttons on click, so focus may still be on the body after opening with a mouse.

        closeOpenDisclosures();

        event.preventDefault();

      }

    });

  }

})();
