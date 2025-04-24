/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(() => {

  "use strict";

  const initTablist = () => {

    // Classes, data attributes, states, and strings.

    const tabListClass = ".tablist";
    const tabListListClass = ".tablist__list";
    const tabListClassName = "tablist__tab";
    const tabListTabClass = `.${tabListClassName}`;
    const tabListDataDisableAnchor = "data-disable-anchor";
    const tabListDataVertical = "data-vertical";
    const tabListPanelClass = ".tablist__panel";
    const tabLists = document.querySelectorAll(tabListClass);
    const URLFragment = location.hash.slice(1);

    // Display which version is in use via console:

    console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

    // Set up all Tablists on page

    tabLists.forEach((list, e) => {

      const index = e + 1;

      list.setAttribute("id", `tablist-${index}`);

      const listContainer = list.querySelector(tabListListClass);

      listContainer.setAttribute("role", "tablist");

      if (list.hasAttribute(tabListDataVertical)) {

        listContainer.setAttribute("aria-orientation", "vertical");

      }

      // Get all tabs within tablist.

      const tabs = list.querySelectorAll(tabListTabClass);

      // Get all tabpanels within tablist.

      const panels = list.querySelectorAll(tabListPanelClass);

      // Array used to hold all panel IDs.

      const panelNames = [];

      // Prep each tab.

      tabs.forEach((tab) => {

        const tabID = tab.getAttribute("href").replace("#", "");

        // Push all panel ID's to array.

        panelNames.push(tabID);

        // Setup each tab.

        tab.parentElement.setAttribute("role", "presentation");
        tab.setAttribute("aria-controls", tabID);
        tab.setAttribute("id", `tab-${tabID}`);
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");

        // Highlight tab based on hash.

        if (tabID === URLFragment) {

          tab.setAttribute("aria-selected", "true");
          tab.removeAttribute("tabindex");

        }

        tab.addEventListener("click", (e) => {

          const panelID = tab.getAttribute("href").replace("#", "");

          tabs.forEach((tab) => {

            tab.setAttribute("aria-selected", "false");
            tab.setAttribute("tabindex", "-1");

          });

          // Hide any open panels

          const panels = tab.closest(tabListClass).querySelectorAll(tabListPanelClass);
          const panelTarget = tab.closest(tabListClass).querySelector(`#${panelID}`);

          panels.forEach((panel) => {

            panel.setAttribute("hidden", "");
            panel.removeAttribute("tabindex");

          });

          // Show selected panel

          panelTarget.removeAttribute("hidden");
          panelTarget.setAttribute("tabindex", "0");

          // Highlight selected tab

          tab.setAttribute("aria-selected", "true");
          tab.removeAttribute("tabindex");

          if (!tab.closest(tabListClass).hasAttribute(tabListDataDisableAnchor)) {

            history.pushState(null, null, `#${tabID}`);
    
          }

          e.preventDefault();

        });

        // Get tab links used in tablist.

        const tabLinks = list.querySelector(tabListListClass).querySelectorAll(tabListTabClass);

        tab.addEventListener("keydown", (e) => {

          // Check if the key pressed is an arrow key

          if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(e.key)) {

            e.preventDefault(); // Prevent default scrolling behavior when arrows keys clicked.

            // Get the index of the currently focused link

            let focusedIndex = Array.from(tabLinks).indexOf(document.activeElement);

            // Calculate the new index based on the arrow key pressed

            if (["ArrowLeft", "ArrowUp"].includes(e.key)) {

              focusedIndex = (focusedIndex - 1 + tabLinks.length) % tabLinks.length; // Move left

            } else if (["ArrowRight", "ArrowDown"].includes(e.key)) {

              focusedIndex = (focusedIndex + 1) % tabLinks.length; // Move right

            }

            // Focus and trigger event
    
            tabLinks[focusedIndex].focus();
            tabLinks[focusedIndex].click();

          }

        });

      });

      panels.forEach((panel) => {

        const panelID = panel.getAttribute("id");

        panel.setAttribute("aria-labelledby", `tab-${panelID}`);
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("hidden", "");
        panel.setAttribute("tabindex", "0");

        if (panelID === URLFragment) {

          panel.removeAttribute("hidden");

        }

      });

      if (!URLFragment || !panelNames.includes(URLFragment)) {

        tabs[0].setAttribute("aria-selected", "true");
        tabs[0].removeAttribute("tabindex");
    
        panels[0].removeAttribute("hidden");
        panels[0].setAttribute("tabindex", "0");

      }

    });

    // All TabList panels must have unique IDs. Check to see if duplicate ID's exist and alert developer.
    // Note: This function may not be needed. Instead, simply having functionality so dependent on ID, may make this moot.

    const allPanelID = [];
    const tabPanels = document.querySelectorAll(tabListPanelClass);

    tabPanels.forEach((panel) => {

      const panelID = panel.id;
      
      allPanelID.push(panelID);

    });

    allPanelID.forEach((element, index, array) => {

      // Check if the current element is equal to any subsequent element

      array.slice(index + 1).forEach((nextElement) => {

        if (element === nextElement) {

          console.log(`%c Warning: Duplicate Tablist ID found: #${element}. Tab panels must only contain unique ID values. `, "background: #ff0000; color: #fff");

        }

      });

    });

  }

  initTablist();

})();