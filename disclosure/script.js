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
  const disclosureHeadingClass = ".disclosure--heading";
  const disclosureDataDefaultOpen = "data-open";
  const disclosureDataEnableAnchor = "data-enable-anchor";
  const disclosureDataRemoveArrow = "data-remove-arrow";

  // Add Listener and other needed attributes to disclosure button

  disclosureButtons.forEach((button, index) => {

    const count = index + 1;

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

    if (button.closest(disclosureHeadingClass)) {

      // If button contains heading...

      button.closest(disclosureHeadingClass).nextElementSibling.setAttribute("id", thisContentID);

    } else {

      button.nextElementSibling.setAttribute("id", thisContentID);

    }

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

    // Open desired disclosure.

    if (button.hasAttribute(disclosureDataDefaultOpen)) {

      button.setAttribute("aria-expanded", "true");

    }

  });

  // Open selected disclosure via URL

  const url = document.location.href;
  const hash = url.split("#");
  const disclosureID = document.getElementById(hash[1]);

  if(disclosureID) {

    const disclosureTarget = document.querySelector(disclosureButtonClass + "#" + disclosureID.id);

    if (disclosureTarget) {

      disclosureTarget.setAttribute("aria-expanded", "true");
      disclosureTarget.focus();

    }

  }

})();
