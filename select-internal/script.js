/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which component is in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  var inPageClass = ".in-page";
  var inPageLabelClass = ".in-page__label";
  var inPageSelectClass = ".in-page__select";
  var inPageOptionClass = ".in-page__select option";
  var inPageContentClass = ".in-page__content";
  var inPage = document.querySelectorAll(inPageClass);
  var inPageLabel = document.querySelectorAll(inPageLabelClass);
  var inPageSelect = document.querySelectorAll(inPageSelectClass);
  var inPageState = "active";
  var inPageContentList = [];

  // On page load

  inPage.forEach(function(component) {

    // Check if "dynamic" Jump Menu is in use.

    if (component.hasAttribute("data-in-page-dynamic")) {

      var inPageContent = component.querySelectorAll(inPageContentClass);
      var inPageContentNth = component.querySelectorAll(inPageContentClass + ":nth-of-type(n + 2)");

      inPageContentNth.forEach(function(content) {

        content.setAttribute("hidden", "");

      });

      inPageContent.forEach(function(content, i) {

        var count = i + 1;

        // If custom ID present

        var contentID = content.hasAttribute("data-in-page-id") ? content.getAttribute("data-in-page-id"): "content-" + count;

        content.setAttribute("id", contentID);

        // Create option element

        var option = document.createElement("option");

        option.setAttribute("value", "#" + contentID);
        option.textContent = content.getAttribute("data-in-page-name");

        var thisSelect = content.closest(inPageClass).getElementsByTagName("select")[0];

        // Append each dynamic option.

        thisSelect.appendChild(option);

      });

    }

  });

  var inPageOption = document.querySelectorAll(inPageOptionClass);

  inPageLabel.forEach(function(label, e) {

    // Apply "for" attribute to each label.

    label.setAttribute("for", "in-page-select-" + (e + 1));

  });

  inPageSelect.forEach(function(select, e) {

    // Apply "id" to each select.

    select.setAttribute("id", "in-page-select-" + (e + 1));

  });

  // Get all Job Menu options on page and push to array.

  inPageOption.forEach(function(option) {

    inPageContentList.push(option.getAttribute("value"));

  });

  function inPageSelectedState() {

    var inPageHash = location.hash || inPageContentList[0];

    if (!inPageHash) {

      return;
    
    }

    var inPageFragment = inPageHash.slice(1);

    // Check array against hash

    if (inPageContentList.includes(inPageHash)) {

      // If hash matches one of the array selections, load the selected content in hash
    
      var inPageSelected = document.getElementById(inPageFragment);
      var inPageContent = inPageSelected.closest(inPageClass).querySelectorAll(inPageContentClass);

      inPageContent.forEach(function(content) {
      
        content.setAttribute("hidden", "");

      });

      inPageSelected.removeAttribute("hidden");

      inPageOption.forEach(function(option) {

        var optionValue = option.getAttribute("value");

        if (location.hash === optionValue) {

          option.setAttribute("selected", "");
          option.closest(inPageClass).classList.add(inPageState);

        } else {

          option.removeAttribute("selected");

        }

      });

      // Update select dropdown

      var select = document.querySelector(inPageClass + " select");

      if (select) {

        select.value = inPageHash;

      }

    }

  }

  inPageSelectedState();

  // Hash change event listener

	window.addEventListener("hashchange", function() {

		inPageSelectedState();

		// When link is pressed, place programatic focus on selected content. This is useful if links are elsewhere on the page.
		// If this causes issues elsewhere on page when haschange is fired, let me know.

		var selectedContent = document.querySelector(inPageContentClass + ":not([hidden])");
    var selectedContentID = selectedContent.getAttribute("id");
    var URLHash = location.hash.slice(1);

    if(URLHash === selectedContentID) {

		  selectedContent.setAttribute("tabindex", "-1");
		  selectedContent.focus();

    }

	});

  inPageSelect.forEach(function(select) {

    select.addEventListener("change", function() {

      var inPageParent = this.closest(inPageClass);
      var inPageContent = inPageParent.querySelectorAll(inPageContentClass);

      // Send message to screen reader.

      if(!inPageParent.hasAttribute("data-in-page-aria-live")){

        var inPageAnnounce = inPageParent.querySelector("div[aria-live]");

        inPageAnnounce.textContent = "Selected Content: " + this.options[this.selectedIndex].text; // TODO: Tokenize for i18n.

      }

      // Update hash in URL

      history.replaceState(null, null, this.value);

      inPageContent.forEach(function(content) {

        content.setAttribute("hidden", "");

      });

      var inPageContentSelected = location.hash.slice(1);

      document.getElementById(inPageContentSelected).removeAttribute("hidden");

      // Set selected jump menu to active.

      inPage.forEach(function(menu) {

        menu.classList.remove(inPageState);

      });

      inPageParent.classList.add(inPageState);

    });

  });

  // Fix for some browsers not resetting the select index on page unload.

  window.addEventListener("beforeunload", function() {

    inPage.forEach(function(menu) {

      if (!menu.classList.contains(inPageState)) {

        menu.getElementsByTagName("select")[0].selectedIndex = 0;

      }

    });

  });

})();