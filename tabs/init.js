(function() {

  // Display which Tablist version is in use via console:

  console.log('%c Tablist v1.0 in use. ', 'background: #6e00ee; color: #fff');

  // Classes, data attributes, states, and strings.

  var tabListClass = ".tablist";
  var tabListListClass = ".tablist__list";
  var tabListClassName = "tablist__tab"
  var tabListTabClass = "." + tabListClassName;
  var tabListPanelClass = ".tablist__panel"; 
  var tabLists = document.querySelectorAll(tabListClass);
  var URLFragment = location.hash.slice(1);

  // Set up all Tablists on page

  tabLists.forEach(function(list, e){

    index = e + 1;

    list.setAttribute("id", "tablist-" + index);

    list.querySelector(tabListListClass).setAttribute("role", "tablist");

    // Get all tabs within tablist and begin prepping them.

    var tabs = list.querySelectorAll(tabListTabClass);

    // Get all tabpanels within tablist and begin prepping them. 

    var panels = list.querySelectorAll(tabListPanelClass);

    var tabFragments = [];

    tabs.forEach(function(tab){

      var tabID = tab.getAttribute("href").replace("#", "");

      tab.parentElement.setAttribute("role", "presentation");
      tab.setAttribute("aria-controls", tabID);
      tab.setAttribute("id", "tab-" + tabID);
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");

      tabFragments.push(tabID);

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

          var panel = tab.closest(tabListClass).querySelector(".expanded");
          panel.classList.remove("expanded");
          var panelTarget = document.getElementById(panelID);

          panelTarget.classList.add("expanded");

          
        
          this.setAttribute("aria-selected", "true");
          this.removeAttribute("tabindex");

          // add hash tag support will need a data attribute to turn it on and history push. 

          e.preventDefault();

      });

    });

    panels.forEach(function(panel){

      var panelID = panel.getAttribute("id");

      panel.setAttribute("aria-labelledby", "tab-" + panelID);
      panel.setAttribute("role", "tabpanel");

      if(panelID === URLFragment) {

        panel.classList.add("expanded");

      }
    
    });

    if(!URLFragment || !tabFragments.includes(URLFragment)) {

      tabs[0].setAttribute("aria-selected", "true");
      tabs[0].removeAttribute("tabindex");
      panels[0].classList.add("expanded");

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