/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which component is in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  var selectInternalClass = ".select-internal";
  var selectInternalLabelClass = ".select-internal__label";
  var selectInternalSelectClass = ".select-internal__select";
  var selectInternalOptionClass = ".select-internal__select option";
  var selectInternalContentClass = ".select-internal__content";
  var selectInternalDataCustomAriaLive = "data-aria-live";
  var selectInternal = document.querySelectorAll(selectInternalClass);
  var selectInternalLabel = document.querySelectorAll(selectInternalLabelClass);
  var selectInternalSelect = document.querySelectorAll(selectInternalSelectClass);
  var selectInternalState = "active";
  var selectInternalContentList = [];

  // On page load

  selectInternal.forEach(function(component) {

    // Check if "dynamic" Jump Menu is in use.

    if (component.hasAttribute("data-dynamic")) {

      var selectInternalContent = component.querySelectorAll(selectInternalContentClass);
      var selectInternalContentNth = component.querySelectorAll(selectInternalContentClass + ":nth-of-type(n + 2)");

      selectInternalContentNth.forEach(function(content) {

        content.setAttribute("hidden", "");

      });

      selectInternalContent.forEach(function(content, i) {

        var count = i + 1;

        // If custom ID present

        var contentID = content.hasAttribute("data-id") ? content.getAttribute("data-id"): "content-" + count;

        content.setAttribute("id", contentID);

        // Create option element

        var option = document.createElement("option");

        option.setAttribute("value", "#" + contentID);
        option.textContent = content.getAttribute("data-label");

        // Append each dynamic option.

        component.querySelector("select").appendChild(option);

      });

    }

  });

  var selectInternalOption = document.querySelectorAll(selectInternalOptionClass);

  selectInternalLabel.forEach(function(label, e) {

    // Apply "for" attribute to each label.

    label.setAttribute("for", "select-internal-" + (e + 1));

  });

  selectInternalSelect.forEach(function(select, e) {

    // Apply "id" to each select.

    select.setAttribute("id", "select-internal-" + (e + 1));

  });

  // Get all Job Menu options on page and push to array.

  selectInternalOption.forEach(function(option) {

    selectInternalContentList.push(option.getAttribute("value"));

  });

  function selectInternalSelectedState() {

    var selectInternalHash = location.hash || selectInternalContentList[0];

    if (!selectInternalHash) {

      return;
    
    }

    var selectInternalFragment = selectInternalHash.slice(1);

    // Check array against hash

    if (selectInternalContentList.includes(selectInternalHash)) {

      // If hash matches one of the array selections, load the selected content in hash
    
      var selectInternalSelected = document.getElementById(selectInternalFragment);
      var selectInternalContent = selectInternalSelected.closest(selectInternalClass).querySelectorAll(selectInternalContentClass);

      selectInternalContent.forEach(function(content) {
      
        content.setAttribute("hidden", "");

      });

      selectInternalSelected.removeAttribute("hidden");

      selectInternalOption.forEach(function(option) {

        var optionValue = option.getAttribute("value");

        if (location.hash === optionValue) {

          option.setAttribute("selected", "");
          option.closest(selectInternalClass).classList.add(selectInternalState);

        } else {

          option.removeAttribute("selected");

        }

      });

      // Update select dropdown

      var select = document.querySelector(selectInternalClass + " select");

      if (select) {

        select.value = selectInternalHash;

      }

    }

  }

  selectInternalSelectedState();

  // Hash change event listener
  
  window.addEventListener("hashchange", function() {

    selectInternalSelectedState();

    // When link is pressed, place programatic focus on selected content. This is useful if links are elsewhere on the page.
    // If this causes issues elsewhere on page when haschange is fired, let me know.

    var selectedContent = document.querySelector(selectInternalContentClass + ":not([hidden])");
    var selectedContentID = selectedContent.getAttribute("id");
    var URLHash = location.hash.slice(1);

    if(URLHash === selectedContentID) {

      selectedContent.setAttribute("tabindex", "-1");
      selectedContent.focus();

    }

  });

  selectInternalSelect.forEach(function(select) {

    select.addEventListener("change", function() {

      var selectInternalParent = this.closest(selectInternalClass);
      var selectInternalContent = selectInternalParent.querySelectorAll(selectInternalContentClass);

      // Send message to screen reader.

      var selectInternalAnnounce = selectInternalParent.querySelector("div[aria-live]");

      if(!selectInternalParent.hasAttribute(selectInternalDataCustomAriaLive)){

        selectInternalAnnounce.textContent = "Selected Content: " + this.options[this.selectedIndex].text; // TODO: Tokenize for i18n.

      }

      // Update hash in URL

      if (this.value === "") {

        var urlWithoutHash = window.location.href.split("#")[0];
        
        history.replaceState(null, null, urlWithoutHash);

        selectInternalAnnounce.textContent = "";

      } else {

        history.replaceState(null, null, this.value);

      }

      selectInternalContent.forEach(function(content) {

        content.setAttribute("hidden", "");

      });

      var selectInternalContentSelected = location.hash.slice(1);

      document.getElementById(selectInternalContentSelected).removeAttribute("hidden");

      // Set selected jump menu to active.

      selectInternal.forEach(function(menu) {

        menu.classList.remove(selectInternalState);

      });

      selectInternalParent.classList.add(selectInternalState);

    });

  });

  // Fix for some browsers not resetting the select index on page unload.

  window.addEventListener("beforeunload", function() {

    selectInternal.forEach(function(menu) {

      if (!menu.classList.contains(selectInternalState)) {

        menu.querySelector("select").selectedIndex = 0;

      }

    });

  });

})();