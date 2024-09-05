/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/


// Look to this as another potential layout scenario other than having content appear under the accordion button (search our jobs area)

// https://barclaysgst.runmytests.com/technology

// https://app.screencast.com/YHRx0VbkSnIup


(function() {

  "use strict";

  function initAccordion() {

    // Classes, data attributes, states, and strings.
  
    var accordionClass = ".accordion";
    var accordionButtonClassName = "accordion__button";
    var accordionButtonClass = "." + accordionButtonClassName;
    var accordionContentClass = ".accordion__content";
    var accordions = document.querySelectorAll(accordionClass);
    var URLFragment = location.hash.slice(1);

    // Display which version is in use via console:
  
    console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");
  
    // Set up all components on page
  
    accordions.forEach(function(acc, e){
  
      var index = e + 1;
  
      acc.setAttribute("id", "accordion-" + index);
  
      // Get all button within accordion.
  
      var buttons = acc.querySelectorAll(accordionButtonClass);
  
      // Get all disclosures within accordion.
  
      var disclosures = acc.querySelectorAll(accordionContentClass);
  
      // Array used to hold all panel IDs.
  
      var disclosureNames = [];
  
      // Prep each button.

      // <button class="disclosure--btn" aria-expanded="false" id="disclosure-btn-1" 
      // aria-controls="disclosure-content-1">Learn More</button>

      // <div class="disclosure--content" id="disclosure-content-1" role="group">

      // 
  
      buttons.forEach(function(btn){
  
        var buttonID = btn.getAttribute("id");
  
        // Push all button ID's to array.
  
        disclosureNames.push(buttonID);
  
        // Setup each btn.
  
        btn.setAttribute("aria-controls", "accordion-" + buttonID);
        btn.setAttribute("aria-expanded", "false");
        btn.nextElementSibling.setAttribute("id", "accordion-" + buttonID)
        btn.nextElementSibling.setAttribute("role", "group");
  
        // Highlight tab based on hash.
  
        if(buttonID === URLFragment) {
  
          btn.setAttribute("aria-expanded", "true");
  
        }
  
        btn.addEventListener("click", function(e) {
  
          var disclosureID = btn.getAttribute("id");
  
          buttons.forEach(function(btn){
  
              btn.setAttribute("aria-expanded", "false");
  
            });
  
            
  
            this.setAttribute("aria-expanded", "true");
  
           // if(!this.closest(tabListClass).hasAttribute(tabListDataDisableAnchor)) {
  
             // history.pushState(null, null, "#" + buttonID);
  
          //  }
  
        });
  
  
      });

  
      if(!URLFragment || !disclosureNames.includes(URLFragment)) {
  
        buttons[0].setAttribute("aria-expanded", "true");
  
      }
  
    });
  
    // All TabList panels must have unique IDs. Check to see if duplicate ID's exist and alert developer.
    // Note: This function may not be needed. Instead, simply having functionality so dependent on ID, may make this moot.
  
    var allPanelID = [];
    var tabPanels = document.querySelectorAll(accordionContentClass);
  
    tabPanels.forEach(function(panel){
  
      var panelID = panel.id;
  
      allPanelID.push(panelID);
  
    });
  
    allPanelID.forEach(function(element, index, array) {
  
      // Check if the current element is equal to any subsequent element
  
      array.slice(index + 1).forEach(function(nextElement) {
  
        if (element === nextElement) {
  
          console.log("%c Warning: Duplicate Accordion ID found: #" + element + ". Tab panels must only contain unique ID values. ", "background: #ff0000; color: #fff");
  
        }
  
      });
  
    });

  }

  initAccordion();

})();
