/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

    "use strict";
  
    // Display which Disclosure is in use via console:
  
    console.log("%c{{ include.title }}%cv{{ include.version }}", "background: #2d2d2d; color: #fff; padding: 6px 10px; border-radius: 16px 0 0 16px; font-weight: 600;" , "background: #6e00ee; color: #fff; padding: 6px 10px; border-radius: 0 16px 16px 0; font-weight: 600;");

    // Select all rating items

    var ratingItems = document.querySelectorAll(".rating__item");

    // Initial check for any checked input and set up event listeners

    ratingItems.forEach(function(ratingItem, index) {

        var input = ratingItem.querySelector("input[type='radio']");

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

        ratingItems.forEach(function(ratingItem, index) {

            ratingItem.classList.remove("active", "selected");

            if (index <= currentIndex) {

                ratingItem.classList.add("active", "selected");

            }

        });

    }

    // Function to temporarily add "active" class up to the current item on hover/focus

    function applyActiveClasses(currentIndex) {

        ratingItems.forEach(function(ratingItem, index) {

            // Apply "active" only if index is up to the current index

            // Preserve "selected" items even when applying "active"

            ratingItem.classList.toggle("active", index <= currentIndex || ratingItem.classList.contains("selected"));

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