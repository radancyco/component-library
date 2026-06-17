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

  stepsBtn.forEach(function(button, index) {

    let dataTarget = button.getAttribute("href").replace("#", "");
    
    button.setAttribute("data-target", dataTarget);

    if (index == 0) {

      button.setAttribute("aria-current", "step");

    }

    if (index !== 0) {

      button.removeAttribute("href");

    }

  });

  stepsSection.forEach(function(section) {

    // section.classList.remove("active");

    var nextStep = document.createElement("button");

    nextStep.textContent = "Next";

    section.append(nextStep);

    nextStep.addEventListener("click", function() {





// Remove aria-aria-pressed, where found.

stepsBtn.forEach(function(button) {

  button.removeAttribute("aria-current");

});

// Remove active state from all sections.

stepsSection.forEach(function(section) {

  section.classList.remove("active");

});

// Get section and button targets

//let stepsBtnTarget = document.querySelector(".steps__btn[aria-controls=" + button.getAttribute("aria-controls") + "]");
let stepsSectionTarget = document.querySelector("#" + button.getAttribute("data-target"));

// Apply aria-pressed to selected step in navigation

//stepsBtnTarget.setAttribute("aria-current", "step");

// Load selected section

stepsSectionTarget.classList.add("active");
// stepsSectionTarget.setAttribute("tabindex", "-1");
// stepsSectionTarget.focus();

//});













    });

  });



})();
