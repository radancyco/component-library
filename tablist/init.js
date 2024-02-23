
/*!

  Radancy Component Library: Tablist

  Contributor(s): 
  Michael "Spell" Spellacy

  Dependencies: None

*/

(function() {

  "use strict";

  // Display which Tablist version is in use via console:

  console.log('%c Tablist v1.0 in use. ', 'background: #6e00ee; color: #fff');

  // Classes, data attributes, states, and strings.

  var tabListClass = ".tablist";
  var tabListListClass = ".tablist__list";
  var tabListClassName = "tablist__tab"
  var tabListTabClass = "." + tabListClassName;
  var tabListDataEnableURL = "data-enable-url"
  var tabListDataVertical = "data-vertical"
  var tabListPanelClass = ".tablist__panel";
  var tabLists = document.querySelectorAll(tabListClass);
  var URLFragment = location.hash.slice(1);

  // Set up all Tablists on page

  tabLists.forEach(function(list, e){

    var index = e + 1;

    list.setAttribute("id", "tablist-" + index);

    var listContainer = list.querySelector(tabListListClass);

    listContainer.setAttribute("role", "tablist");

    if(list.hasAttribute(tabListDataVertical)) {

      listContainer.setAttribute("aria-orientation", "vertical");

    }

    // Get all tabs within tablist.

    var tabs = list.querySelectorAll(tabListTabClass);

    // Get all tabpanels within tablist. 

    var panels = list.querySelectorAll(tabListPanelClass);

    // Array used to hold all panel IDs.

    var panelNames = [];
    
    // Prep each tab.

    tabs.forEach(function(tab){

      var tabID = tab.getAttribute("href").replace("#", "");

      // Push all panel ID's to array.

      panelNames.push(tabID);

      // Setup each tab.

      tab.parentElement.setAttribute("role", "presentation");
      tab.setAttribute("aria-controls", tabID);
      tab.setAttribute("id", "tab-" + tabID);
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");

      // Highlight tab based on hash.

      if(tabID === URLFragment) {

        tab.setAttribute("aria-selected", "true");
        tab.removeAttribute("tabindex");

      }

      tab.addEventListener("click", function(e) {

        var panelID = tab.getAttribute("href").replace("#", "");

         tabs.forEach(function(tab){
    
            tab.setAttribute("aria-selected", "false");
            tab.setAttribute("tabindex", "-1");

          });

          // Hide any open panels

          var panels = tab.closest(tabListClass).querySelectorAll(tabListPanelClass);
          var panelTarget = tab.closest(tabListClass).querySelector("#" + panelID);
  
          panels.forEach(function(panel){
    
            panel.setAttribute("hidden", "");
            panel.removeAttribute("tabindex");

          });

          // Show selected panel
    
          panelTarget.removeAttribute("hidden");
          panelTarget.setAttribute("tabindex", "0");

          // Highlight selected tab
        
          this.setAttribute("aria-selected", "true");
          this.removeAttribute("tabindex");

          // TODO: add hash tag support will need a data attribute to turn it on and history push. 

          if(this.closest(tabListClass).hasAttribute(tabListDataEnableURL)) {

            history.pushState(null, null, "#" + tabID);

          }

          e.preventDefault();

      });

      // Get tab links used in tablist.

      var tabLinks = list.querySelector(tabListListClass).querySelectorAll(tabListTabClass);

      tab.addEventListener("keydown", function(e) {
          
        // Check if the key pressed is an arrow key
                    
        if (e.key === "ArrowUp" || e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft") {
      
          e.preventDefault(); // Prevent default scrolling behavior when arrows keys clicked.
        
          // Get the index of the currently focused link
        
          var focusedIndex = Array.from(tabLinks).indexOf(document.activeElement);
            
          // Calculate the new index based on the arrow key pressed
        
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                        
            focusedIndex = (focusedIndex - 1 + tabLinks.length) % tabLinks.length; // Move left
                      
          } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                
            focusedIndex = (focusedIndex + 1) % tabLinks.length; // Move right
                
          }
            
          // Focus and trigger event
                
          tabLinks[focusedIndex].focus()
          tabLinks[focusedIndex].click();
                
        }
                  
      });

    });

    panels.forEach(function(panel){

      var panelID = panel.getAttribute("id");

      panel.setAttribute("aria-labelledby", "tab-" + panelID);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("hidden", "");
      panel.setAttribute("tabindex", "0");

      if(panelID === URLFragment) {

        panel.removeAttribute("hidden");

      }
    
    });

    if(!URLFragment || !panelNames.includes(URLFragment)) {

      tabs[0].setAttribute("aria-selected", "true");
      tabs[0].removeAttribute("tabindex");
      panels[0].removeAttribute("hidden");
      panels[0].setAttribute("tabindex", "0");

    }

  });
  
  // All TabList panels must have unique IDs. Check to see if duplicate ID's exist and alert developer. 
  // Note: This function may not be needed. Instead, simply having functionality so dependent on ID, may make this moot. 

  var allPanelID = [];
  var tabPanels = document.querySelectorAll(tabListPanelClass);

  tabPanels.forEach(function(panel){

    var panelID = panel.id;

    allPanelID.push(panelID);
  
  });

  allPanelID.forEach(function(element, index, array) {

    // Check if the current element is equal to any subsequent element

    array.slice(index + 1).forEach(function(nextElement) {

      if (element === nextElement) {

        console.log('%c Warning: Duplicate Tablist ID found: #' + element + ". Tab panels must only contain unique ID values. ", 'background: #ff0000; color: #fff');
      
      } 
  
    });

  });

})();