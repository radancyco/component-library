/*!

  Radancy Component Library: Tabs

  Contributor(s):
  Michael "Spell" Spellacy, Email: michael.spellacy@radancy.com, Twitter: @spellacy, GitHub: michaelspellacy
  Andrew Hill, Email: andrew.hill@radancy.com

  Dependencies: None

*/

(function() {

  // Display which Tab UI is in use via console:

  console.log('%c Tabs v1.0 in use. ', 'background: #6e00ee; color: #fff');

  // Commonly used Classes, Data Attributes, States, and Strings.

  var tabListClass = ".tablist";
  var tabListListClass = ".tablist__list";
  var tabListTabClass = ".tablist__tab";
  var tabListPanelClass = ".tablist__panel";

  // Get each Tab UI on page and begin prepping it. 

  var tabList = document.querySelectorAll(tabListClass);

  tabList.forEach(function(list){

    list.querySelector(tabListListClass).setAttribute("role", "tablist");

    var tabListTab = list.querySelectorAll(tabListTabClass);

    tabListTab.forEach(function(tab){

      var tabID = tab.getAttribute("href").replace("#", "");

      tab.parentElement.setAttribute("role", "presentation");
      tab.setAttribute("role", "tab");
      tab.setAttribute("id", "btn-" + tabID);
      tab.setAttribute("aria-selected", "false"); // come back to this later
      tab.setAttribute("aria-controls", tabID);
      tab.setAttribute("tabindex", "-1"); // come back to this later 

      tab.addEventListener("click", function(e) {

       // var index = j + 1;

       // toggleTabCordion(this, e.currentTarget, index);

       alert(this.id);

       e.preventDefault();

      });

      tab.addEventListener("keydown", function (e) {

        if (this.hasAttribute("aria-selected")) {

          var index = Array.prototype.indexOf.call(tabListTab, e.currentTarget);

          // Work out which key the user is pressing and calculate the new tab's index where appropriate

          // Left:	37, Up: 38, Right: 39, Down: 40

          if(tabVertical !== null) {

            // Move up, down, and right.

            var dir = e.which === 38 ? index - 1 : e.which === 40 ? index + 1 : e.which === 39 ? "right" : null;

            if (dir !== null) {

              // If the right key is pressed, move focus to the open panel, otherwise switch to the adjacent tab

              dir === "right" ? document.getElementById(e.currentTarget.id).nextElementSibling.focus() : tabListTab[dir] ? toggleTabCordion(tabListTab[dir], e.currentTarget, tabListTab[dir].getAttribute("data-button-count")) : void 0;

            }

          } else {

            var getReadingDirection = document.getElementsByTagName("html")[0];

            // Move left, right, and down.

            if (getReadingDirection.getAttribute("dir") === "rtl") {

              var dir = e.which === 39 ? index - 1 : e.which === 37 ? index + 1 : e.which === 40 ? "down" : null;

            } else {

              var dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? "down" : null;

            }

            if (dir !== null) {

              // If the down key is pressed, move focus to the open panel, otherwise switch to the adjacent tab

              dir === "down" ? document.getElementById(e.currentTarget.id).nextElementSibling.focus() : tabListTab[dir] ? toggleTabCordion(tabListTab[dir], e.currentTarget, tabListTab[dir].getAttribute("data-button-count")) : void 0;

            }

          }

        }

      });

    });

    var tabListPanel = list.querySelectorAll(tabListPanelClass);

    tabListPanel.forEach(function(panel){

      var tabID = panel.getAttribute("id");

      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-lebelledby", "btn-" + tabID);
      panel.setAttribute("tabindex", "-1"); // come back to this later 

    });

  });

  function toggleTab(thisButton, oldTab, thisButtonIndex) {

    // Normally, we would use ARIA as a CSS hook, but since we are
    // dealing with adding and removeing aria-expanded and aria-selected,
    // it is easier to include/target a class.

    var activeState = thisButton.parentNode.querySelectorAll(tabCordionActiveClass);

    if (!thisButton.classList.contains(tabCordionActiveState)) {

      activeState.forEach(function(activeButton){

        activeButton.classList.remove(tabCordionActiveState);
        activeButton.nextElementSibling.classList.remove(tabCordionExpandedState);
        activeButton.nextElementSibling.removeAttribute("tabindex");

        if (activeButton.hasAttribute("aria-selected")) {

          thisButton.focus(); // For arrow keys

          // Make the active tab focusable by the user (Tab key).

          thisButton.removeAttribute('tabindex');

          // Set the selected state

          activeButton.setAttribute("aria-selected", "false");
          activeButton.setAttribute("tabindex", "-1");
          activeButton.classList.remove(tabCordionActiveState);
          activeButton.nextElementSibling.classList.remove(tabCordionExpandedState);
          activeButton.nextElementSibling.removeAttribute("tabindex");
          thisButton.setAttribute("aria-selected", "true");
          thisButton.nextElementSibling.setAttribute("tabindex", -1);

        }

      });

      thisButton.classList.add(tabCordionActiveState);
      thisButton.nextElementSibling.classList.add(tabCordionExpandedState);

      // TODO: Have mobile panels be closed by default or when toggled on.
      // As it is now, panels will behave the same across smaller
      // and larger viewports.

      // Callback

      var tabCallBack = thisButton.parentNode.dataset.tabCallback;

      if(tabCallBack !== undefined) {

        contentTarget = thisButton.nextElementSibling.getAttribute("id");
        customCallback(contentTarget, tabCallBack);

      }

    }

    var tabListActive = thisButton.parentNode.getAttribute(tabCordionDataActive);

    // Append fragment to URL if data-tab-disable-url not present.
    // TODO: Investagte possible performance issue with History API.

    var tabDisableURL = thisButton.parentNode.getAttribute(tabCoprdionDataDisableURL);
    var selectedPanelID = thisButton.nextElementSibling.getAttribute("id");
    var targetPanel = document.getElementById(selectedPanelID)

    if(tabDisableURL === null) {

      history.replaceState(null, null, "#" + selectedPanelID);

    }

    // Change data-tab-active. This allows us to retain the selection on viewport resize.

    if(tabListActive !== null) {

      thisButton.parentNode.setAttribute(tabCordionDataActive, thisButtonIndex);
      thisButton.parentNode.setAttribute(tabCordionDataActiveChanged, "");

    }

  }







})();

