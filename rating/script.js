/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

    "use strict";
  
    // Display which Disclosure is in use via console:
  
    console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

    // Select all rating items

    const ratingItems = document.querySelectorAll(".rating__item");

    // Initial check for any checked input and set up event listeners

    ratingItems.forEach(function(ratingItem, index) {

        const input = ratingItem.querySelector("input[type='radio']");

        // If input is checked on load, apply selected classes

        if (input.checked) {

            applySelectedClasses(index);

        }

        // Add event listeners for change, hover, and focus

        input.addEventListener("change", function() {

            applySelectedClasses(index);

        });

        ratingItem.addEventListener("mouseenter", function() {

            applyActiveClasses(index);

        });

        ratingItem.addEventListener("focusin", function() {

            applyActiveClasses(index);

        });

        ratingItem.addEventListener("mouseleave", conditionalRemoveActiveClasses);
        ratingItem.addEventListener("focusout", conditionalRemoveActiveClasses);

    });

    // Function to add "selected" and "active" class up to the selected item

    function applySelectedClasses(currentIndex) {

        // First, clear all classes to reset the selection

        ratingItems.forEach(function(ratingItem, idx) {

            ratingItem.classList.remove("active", "selected");

            if (idx <= currentIndex) {

                ratingItem.classList.add("active", "selected");

            }

        });

    }

    // Function to temporarily add "active" class up to the current item on hover/focus

    function applyActiveClasses(currentIndex) {

        ratingItems.forEach(function(ratingItem, idx) {

            // Apply "active" only if idx is up to the current index

            // Preserve "selected" items even when applying "active"

            ratingItem.classList.toggle("active", idx <= currentIndex || ratingItem.classList.contains("selected"));

        });

    }

    // Function to remove "active" classes added by hover/focus if not "selected"

    function conditionalRemoveActiveClasses() {

        ratingItems.forEach(function(ratingItem) {

            if (!ratingItem.classList.contains("selected")) {

                ratingItem.classList.remove("active");

            }

        });

    }
  
})();