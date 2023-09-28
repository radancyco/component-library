(function() {

  // Display which Tab UI version is in use via console:

  console.log('%c Tablist v1.0 in use. ', 'background: #6e00ee; color: #fff');

  // Commonly used Classes, Data Attributes, States, and Strings.

  var tabListClass = ".tablist";
  var tabListListClass = ".tablist__list";
  var tabListClassName = "tablist__tab"
  var tabListTabClass = "." + tabListClassName;
  var tabListPanelClass = ".tablist__panel";

  // Get all Tablists on the page and begin prepping them. 

  var tabLists = document.querySelectorAll(tabListClass);

  tabLists.forEach(function(list){

    list.querySelector(tabListListClass).setAttribute("role", "tablist");

    // Get all tabs within tablist and begin prepping them.

    var tabs = list.querySelectorAll(tabListTabClass);

    tabs.forEach(function(tab){

      var tabID = tab.getAttribute("href").replace("#", "");

      tab.parentElement.setAttribute("role", "presentation");
      tab.setAttribute("aria-controls", tabID);
      tab.setAttribute("aria-selected", "false"); // come back to this later
      tab.setAttribute("id", "tab-" + tabID);
      tab.setAttribute("role", "tab");
      tab.setAttribute("tabindex", "-1"); // come back to this later 

    });

    // Get all tabpanels within tablist and begin prepping them. 

    var panels = list.querySelectorAll(tabListPanelClass);

    panels.forEach(function(panel){

      var panelID = panel.getAttribute("id");

      panel.setAttribute("aria-labelledby", "tab-" + panelID);
      panel.setAttribute("role", "tabpanel");

    });

  });

})();