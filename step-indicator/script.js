/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which component is in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  // Basic functionality for multi-step navigation and form buttons

  let stepsBtn = document.querySelectorAll(".steps__btn");
  let stepsSection = document.querySelectorAll(".steps__section");

  stepsBtn.forEach(function(button) {

    button.addEventListener("click", function() {

      // Remove aria-aria-pressed, where found.

      stepsBtn.forEach(function(button) {

        button.setAttribute("aria-pressed", "false");

      });

      // Remove active state from all sections.

      stepsSection.forEach(function(section) {

        section.classList.remove("active");

      });

      // Get section and button targets

      let stepsBtnTarget = document.querySelector(".steps__btn[aria-controls=" + button.getAttribute("aria-controls") + "]");
      let stepsSectionTarget = document.querySelector("#" + button.getAttribute("aria-controls"));

      // Apply aria-pressed to selected step in navigation

      stepsBtnTarget.setAttribute("aria-pressed", "true");

      // Load selected section

      stepsSectionTarget.classList.add("active");
      stepsSectionTarget.setAttribute("tabindex", "-1");
      stepsSectionTarget.focus();

    });

  });

})();
