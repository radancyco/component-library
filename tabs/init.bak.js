/*!

  Radancy Component Library: TabCordion

  Contributor(s):
  Michael "Spell" Spellacy, Email: michael.spellacy@radancy.com, Twitter: @spellacy, GitHub: michaelspellacy
  Andrew Hill, Email: andrew.hill@radancy.com

  Dependencies: None

*/

(function() {

  // Display which TabCordion is in use via console:

  console.log('%c Tablist v1.0 in use. ', 'background: #6e00ee; color: #fff');

  // Commonly used Classes, Data Attributes, States, and Strings.

  var tabListClass = ".tablist";
  var tabCordionButtonClass = ".tablist__tab";
  var tabCordionPanelClass = ".tab-tablist__panel";

  var tabCordionExpandedState = "expanded"; // figure out what this is
  var tabCordionDataActive = "data-tab-active";
  var tabCordionDataActiveChanged = "data-tab-active-changed";

  var tabCoprdionDataDisableURL = "data-tab-disable-url"; // come back to this. 
  var tabCordionDataVertical = "data-tab-vertical";


  // Grab the hash (fragment) from the URL.

  var URLFragment = location.hash.slice(1);

  // Get all TabLists on the page...

  var tabLists = document.querySelectorAll(tabListClass);

  // Create an array to store each TabCordions breakpoint in,
  // which we will loop through later...



  // loop through each TabCordion...



  // TabAccordion Toggle

  



    // Loop through each TabCordion

    tabLists.forEach(function(tabCordion, i){

        var tabListButton = tabCordion.querySelectorAll(tabCordionButtonClass);
        var tabListPanel = tabCordion.querySelectorAll(tabCordionPanelClass);
        var tabVertical = tabCordion.getAttribute(tabCordionDataVertical);
        var tabListActive = tabCordion.getAttribute(tabCordionDataActive);
        var tabListCount = i + 1;

        // Give each TabCordion a unique ID...

        tabCordion.setAttribute("id", "tab-accordion-" + tabListCount);

        // If TabCordion missing data-tab-active, add one with a value of 1
        // This is the default state. One panel must always be open.

        if(tabListActive === null) {

          tabCordion.setAttribute(tabCordionDataActive, "1");

        }

        // Check if URL has fragment with "tab-panel" in it.

        if(URLFragment.indexOf("tab-panel") > -1) {

          var tabFragment = URLFragment.split(/-/g).slice(2);
          var tabCordionSelected = parseInt(tabFragment[0]);
          var tabCordionPanelSelected = tabFragment[1];

          // If TabCordion index matches the selcted TabCordion,
          // then load selected content.

          if (tabListCount === tabCordionSelected) {

            var tabCordionTarget = document.getElementById("tab-accordion-" + tabCordionSelected.toString());

            // Selected tabcordion to target.

            if(!tabCordion.hasAttribute(tabCordionDataActiveChanged)) {

              tabCordionTarget.setAttribute(tabCordionDataActive, tabCordionPanelSelected);

            }

          }

        }

        // Now get selected active state for all other tabcordions and
        // when no page fragment is detected.

        var tabPanelSelected = tabCordion.getAttribute(tabCordionDataActive);

        tabListPanel.forEach(function(panel, j){

          var tabListItemCount = j + 1;

          panel.setAttribute("id", "tab-panel-" + tabListCount + "-" + tabListItemCount);

        });

        // Attach events and attributes to all tab buttons and panels.

        tabListButton.forEach(function(button, j){

          var tabListItemCount = j + 1;

          if(Number(tabListItemCount) === Number(tabPanelSelected)) {

            button.classList.add(tabCordionActiveState);
            button.nextElementSibling.classList.add(tabCordionExpandedState);
            button.nextElementSibling.setAttribute("tabindex", -1);

          }

          button.setAttribute("id", "tab-button-" + tabListCount + "-" + tabListItemCount);
          button.setAttribute("aria-controls", "tab-panel-" + tabListCount + "-" + tabListItemCount);
          button.setAttribute("data-button-count", tabListItemCount);
          button.addEventListener("click", function (e) {

            var index = j + 1;

            toggleTabCordion(this, e.currentTarget, index);

          });

          button.addEventListener("keydown", function (e) {

            if (this.hasAttribute("aria-selected")) {

              var index = Array.prototype.indexOf.call(tabListButton, e.currentTarget);

              // Work out which key the user is pressing and calculate the new tab's index where appropriate

              // Left:	37, Up: 38, Right: 39, Down: 40

              if(tabVertical !== null) {

                // Move up, down, and right.

                var dir = e.which === 38 ? index - 1 : e.which === 40 ? index + 1 : e.which === 39 ? "right" : null;

                if (dir !== null) {

                  // If the right key is pressed, move focus to the open panel, otherwise switch to the adjacent tab

                  dir === "right" ? document.getElementById(e.currentTarget.id).nextElementSibling.focus() : tabListButton[dir] ? toggleTabCordion(tabListButton[dir], e.currentTarget, tabListButton[dir].getAttribute("data-button-count")) : void 0;

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

                  dir === "down" ? document.getElementById(e.currentTarget.id).nextElementSibling.focus() : tabListButton[dir] ? toggleTabCordion(tabListButton[dir], e.currentTarget, tabListButton[dir].getAttribute("data-button-count")) : void 0;

                }

              }

            }

          });

        });

        // Begin looping though breakpoints and altering DOM as each of those viewports is resized/loaded.

        if (tabListBreakPoints[i].matches) {

          // Our Tab UI.

          tabCordion.setAttribute("role", "tablist");

          if(tabVertical !== null) {

            // Indicate orientation

            tabCordion.setAttribute("aria-orientation", "vertical");

          }

          // Our Tab UI buttons.

          tabListButton.forEach(function(button, j){

            var tabListItemCount = j + 1;

            button.setAttribute("aria-selected", "false");
            button.setAttribute("role", "tab");
            button.setAttribute("tabindex", -1);

            if(Number(tabListItemCount) === Number(tabPanelSelected)) {

              button.setAttribute("aria-selected", "true");
              button.removeAttribute("tabindex");

            }

          });

          // Our Tab UI panels.

          tabListPanel.forEach(function(panel, j){

            var tabListItemCount = j + 1;

            panel.setAttribute("role", "tabpanel");
            panel.setAttribute("aria-labelledby", "tab-button-" + tabListCount + "-" + tabListItemCount);

          });

        } else {

          // Our Accordion UI.

          tabCordion.removeAttribute("role");

          if(tabVertical !== null) {

            // Remove orientation

            tabCordion.removeAttribute("aria-orientation");

          }

          // Our Accordion UI buttons.



          // Our Accordion UI panels.

        }

     });


  // Initiate viewPortWidth function when viewport is resized.


  // Initiate tabLists on page load.

  // Callback OnLoad



  // Custom callback with variable name. Accepts ID of content you will target.



})();

// Example Callback Function (No need to copy this if you do not need it.)

