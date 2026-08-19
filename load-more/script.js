/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(() => {

  "use strict";

  const initLoadMore = () => {

    // Display which version is in use via console:

    console.log("%c{{ include.title }}%cv{{ include.version }}", "background: #2d2d2d; color: #fff; padding: 6px 10px; border-radius: 16px 0 0 16px; font-weight: 600;" , "background: #6e00ee; color: #fff; padding: 6px 10px; border-radius: 0 16px 16px 0; font-weight: 600;");

    // Classes, data attributes, states, and strings.

    const loadMoreClass = ".load-more";
    const loadMoreItemClass = ".load-more__item";
    const loadMoreMsgClass = ".load-more__msg";
    const loadMoreBtnName = "load-more__btn";
    const loadMoreBtnTxt = "Load More";
    const loadMoreBtnFin = "All Done!";
    const loadMoreNewItemTxt = " new items have been loaded.";
    const loadMoreNewItemSingleTxt = " new item has been loaded.";
    const loadMoreComplete = "All content has been loaded.";
    const loadMoreDelay = 500;
    const loadMoreDefault = 3;
    const focusableSelectors = "a, audio, button, input, select, video";
    const loadMoreContainers = document.querySelectorAll(loadMoreClass);

    loadMoreContainers.forEach((container) => {

      const loadMoreShow = container.dataset.loadMoreShow ? parseInt(container.dataset.loadMoreShow) : loadMoreDefault;

      // Hide all items after nth item.

      const items = container.querySelectorAll(loadMoreItemClass);

      items.forEach((item, i) => {

        if (i >= loadMoreShow) {

          item.setAttribute("hidden", "");

        }

      });

      // Add button.

      const loadMoreBtn = document.createElement("button");

      loadMoreBtn.classList.add(loadMoreBtnName);
      loadMoreBtn.textContent = loadMoreBtnTxt;

      container.append(loadMoreBtn);

      // Button action: update message when items are displayed.

      loadMoreBtn.addEventListener("itemsDisplayed", (e) => {

        const totalCount = e.detail.totalCount;
        const hiddenItems = container.querySelectorAll(`${loadMoreItemClass}[hidden]`);
        const msg = container.querySelector(loadMoreMsgClass);

        if (!hiddenItems.length) {

          loadMoreBtn.disabled = true;
          loadMoreBtn.textContent = loadMoreBtnFin;

          if (msg) {

            if (totalCount === 1) {

              msg.innerHTML = totalCount + loadMoreNewItemSingleTxt + " " + loadMoreComplete;

            } else {

              msg.innerHTML = totalCount + loadMoreNewItemTxt + " " + loadMoreComplete;

            }

          }

        }

      });

      // Button click: reveal next batch of items.

      loadMoreBtn.addEventListener("click", () => {

        const hiddenItems = container.querySelectorAll(`${loadMoreItemClass}[hidden]`);
        const itemsToLoad = container.dataset.loadMoreShow ? parseInt(container.dataset.loadMoreShow) : loadMoreDefault;
        const itemsToReveal = Array.from(hiddenItems).slice(0, itemsToLoad);
        const msg = container.querySelector(loadMoreMsgClass);

        itemsToReveal.forEach((item) => {

          item.removeAttribute("hidden");

        });

        const totalItems = itemsToReveal.length;

        if (msg) {

          msg.innerHTML = totalItems + loadMoreNewItemTxt;

        }

        // Focus first focusable element within newly revealed items.

        let firstFocusable = null;

        for (const item of itemsToReveal) {

          firstFocusable = item.querySelector(focusableSelectors);

          if (firstFocusable) break;

        }

        if (firstFocusable) {

          firstFocusable.focus();

        }

        // Dispatch custom event.

        loadMoreBtn.dispatchEvent(new CustomEvent("itemsDisplayed", {

          detail: { totalCount: totalItems }
  
        }));

        // Remove message after delay.

        setTimeout(() => {

          document.querySelectorAll(loadMoreMsgClass).forEach((msgEl) => {

            msgEl.innerHTML = "";

          });

        }, loadMoreDelay);

      });

    });

  };

  initLoadMore();

})();
