/*!

  Radancy Component Library: Accordion Grid

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which Accordion Grid version in use via console:

  console.log("%c Accordion Grid v1.1 in use. ", "background: #6F00EF; color: #fff");

  // Commonly used Classes, Data Attributes, States, and Strings.

  var accGridButtonClass = ".accordion-grid__button";
  var accGridButtonId = "grid-button";
  var accGridClass = ".accordion-grid";
  var accGridCloseClass = "accordion-grid__close";
  var accGridCloseText = "Close";
  var accGridContentAreaId = "grid-content";
  var accGridContentClass = ".accordion-grid__content";
  var accGridDataActive = "data-accordion-grid-active";
  var accGridDataClose = "data-accordion-grid-disable-close";
  var accGridDataDisableURL = "data-accordion-grid-disable-url";
  var accGridDataExclude = "data-accordion-grid-exclude";
  var accGridDataLarge = "data-accordion-grid-large";
  var accGridDataMedium = "data-accordion-grid-medium";
  var accGridDisclosureId = "accordion-grid";
  var accGridFormatClass = "accordion-grid-format";
  var accGridButtonAll = document.querySelectorAll(accGridButtonClass);
  var accGridCallBackAll = document.querySelectorAll(".accordion-grid[data-accordion-grid-callback]");
  var accGridContentAll = document.querySelectorAll(accGridContentClass);
  var accGridDisclosuresAll = document.querySelectorAll(accGridClass);
  var accGridDelay = 500;

  // Grab the hash (fragment) from the URL, which we may need later.

  var URLFragment = window.location.hash.substr(1);

  // Create an array to store each Grid breakpoint in, which we will loop through later...

  var accGridDisclosureLarge = [];
  var accGridDisclosureMedium = [];

  // loop through each Grid...

  accGridDisclosuresAll.forEach(function(accGridItem, i){

    var accGridItemCount = i + 1;
    accGridItem.setAttribute("id", accGridDisclosureId + "-" + accGridItemCount);

    // Get each Grids medium and large breakpoints...

    var accGridLargeBreakpoint = accGridItem.getAttribute(accGridDataLarge);
    var accGridMediumBreakpoint = accGridItem.getAttribute(accGridDataMedium);

    // Store each breakpoint in array (created above) for later use by matchMedia.

    accGridDisclosureLarge.push(window.matchMedia(accGridLargeBreakpoint));
    accGridDisclosureMedium.push(window.matchMedia(accGridMediumBreakpoint));

  });

  // If URL fragment present with "grid-content"...

  if(URLFragment.indexOf(accGridContentAreaId) > -1) {

    // Parse fragment and pull grid and content ID number.
    // We will then target specific grid and reset data-accordion-grid-active with open value.

    var accGridFragment = URLFragment.split(/-/g).slice(2);
    var accGridSelected = parseInt(accGridFragment[0]);
    var accGridContentSelected = accGridFragment[1];
    var accGrid = document.getElementById(accGridDisclosureId + "-" + accGridSelected);

    // Reset data-accordion-grid-active

    accGrid.setAttribute(accGridDataActive, accGridContentSelected);

  }

  function accGridViewPort() {

    // Loop through each Grid...

    accGridDisclosuresAll.forEach(function(accGridItem, i){

      var accGridItemCount = i + 1;

      // Add Unique class to medium and large viewport widths.

      accGridItem.classList.add(accGridFormatClass);

      // Get each Grids child buttons and content

      var accGridButtonChild = accGridItem.querySelectorAll(accGridButtonClass);
      var accGridContentChild = accGridItem.querySelectorAll(accGridContentClass);

      // Begin looping though grids and altering DOM as each viewport is met.

      if (accGridDisclosureMedium[i].matches) {

        // Here we match the medium breakpoint with the min amount of grid items we want displayed...

        var accGridSize = parseInt(accGridItem.dataset.accordionGridMin);

      } else if (accGridDisclosureLarge[i].matches) {

        // Here we match the large breakpoint with the max amount of grid items we want displayed...

        var accGridSize = parseInt(accGridItem.dataset.accordionGridMax);

      } else {

        // It's a small viewport (mobile), so we can remove the special class.

        accGridItem.classList.remove(accGridFormatClass);

      }

      var accGridButtonCount = 1;
      var accGridContentCount = accGridSize + 1; // WHEN SCREEN SIZE CHANGES, CHANGE THIS NUMBER TO 3

      // Button Child

      accGridButtonChild.forEach(function(button, e){

        if (!button.hasAttribute(accGridDataExclude)) {

          var buttonCount = e + 1;

          // Rather than manipulate the DOM bu copying, creating, and appending elements, we can instead "reorder"
          // the layout via use of the CSS order property when conditions are met.

          // Buttons will contain an order of 1, 2, 3, 4 and so on.
          // To address accessibility concerns, we simply manage focus when button clicked.
          // Tabbing should be just fine, though we may need to include keyboard arrow function in future release.

          /*

            Example:

            <button style="order: 1"> ... </button>

            <div style="order: 3"> ... </div>

            <button stle="order: 2"> ... </button>

            <div style="order: 4"> ... </div>

            ...

          */

          if (accGridDisclosureLarge[i].matches || accGridDisclosureMedium[i].matches) {

            // var itemSize = parseInt(100 / accGridSize);
            // button.setAttribute("style", "order: " + accGridButtonCount + "; width: " + itemSize + "%;");

            // Note: Because spacing with margins is a problem for a dynamic layout such as this, we have to pull in
            // the computed margin value from CSS and apply calculation via inline style.

            var buttonStyle = window.getComputedStyle(button);
            var buttonMarginLeft = parseInt(buttonStyle.getPropertyValue("margin-left").replace("px", ""));
            var buttonMarginRight = parseInt(buttonStyle.getPropertyValue("margin-right").replace("px", ""));
            var buttonMarginTotal = buttonMarginLeft + buttonMarginRight;

            if (button.hasAttribute("data-accordion-grid-size")) {

              var temp = button.getAttribute("data-accordion-grid-size");

              button.setAttribute("style", "margin-right: " + buttonMarginRight + "px; margin-left: " + buttonMarginLeft + "px; order: " + accGridButtonCount + "; width: calc(100%/" + temp + " - " + buttonMarginTotal + "px);");

            } else {

              button.setAttribute("style", "margin-right: " + buttonMarginRight + "px; margin-left: " + buttonMarginLeft + "px; order: " + accGridButtonCount + "; width: calc(100%/" + accGridSize + " - " + buttonMarginTotal + "px);");

            }

            if (accGridButtonCount % accGridSize === 0) {

              accGridButtonCount += accGridSize;

            }

            accGridButtonCount++

          } else {

            // If it's a small (mobile) viewport, then all elements are simply stacked, so no need for inline style.

            button.removeAttribute("style");

          }

          // Add additional attributes for accessibility, etc.

          var accGridID = accGridItemCount + "-" + buttonCount;

          button.setAttribute ("id", accGridButtonId + "-" + accGridID);
          button.setAttribute ("aria-controls", accGridContentAreaId + "-" + accGridID);

          // Set active content

          var accGridCount = e + 1;
          var accGridSelected = parseInt(accGridItem.dataset.accordionGridActive);

          if (accGridCount === accGridSelected) {

            button.setAttribute("aria-expanded", "true");

          } else {

            button.setAttribute("aria-expanded", "false");

          }

        } // End accGridDataExclude

      });

      // Content Child

      accGridContentChild.forEach(function(content, e){

        if (!content.hasAttribute(accGridDataExclude)) {

          // Rather than manipulate the DOM bu copying, creating, and appending elements, we can instead "reorder"
          // the layout via use of the CSS order property when conditions are met.

          // Content will contain an order of 5, 6, 7, 8 and so on, making content appear as if they are under the buttons.

          var contentCount = e + 1;

          if (accGridDisclosureLarge[i].matches || accGridDisclosureMedium[i].matches) {

            if (content.previousElementSibling.hasAttribute("data-accordion-grid-size")) {

              content.setAttribute("style", "order: " + accGridContentCount + 1);

            } else {

              content.setAttribute("style", "order: " + accGridContentCount);

            }

            if (accGridContentCount % accGridSize === 0) {

              accGridContentCount += accGridSize;

            }

            accGridContentCount++

          } else {

            // If it's a small (mobile) viewport, then all elements are simply stacked, so need for inline style.

            content.removeAttribute("style");

          }

          // Add additional attributes for accessibility, etc.

          var accGridID = accGridItemCount + "-" + contentCount;

          content.setAttribute ("id", accGridContentAreaId + "-" + accGridID);

        } // End accGridDataExclude

      });

    });

  }

  // Add listner and initiate accGridViewPort function when viewport is resized.

  accGridDisclosureLarge.forEach(function(breakpoints){

    breakpoints.addListener(accGridViewPort);

  });

  // Add listner and initiate accGridViewPort function when viewport is resized.

  accGridDisclosureMedium.forEach(function(breakpoints){

    breakpoints.addListener(accGridViewPort);

  });

  // Initiate Grids on initial page load.

  accGridViewPort();

  // Button Event

  accGridButtonAll.forEach(function(button, e){

    // Button Toggle
    // TODO: Allow mobile to have multiple opens.

    button.addEventListener("click", function () {

      if (this.getAttribute("aria-expanded") === "false") {

        var accGridItemButtons = this.parentNode.querySelectorAll(accGridButtonClass);

        accGridItemButtons.forEach(function(buttons){

          if (!buttons.hasAttribute(accGridDataExclude)) {

            buttons.setAttribute("aria-expanded", "false");

          }

        });

        this.setAttribute("aria-expanded", "true");

        // Append fragment to URL if data-accordion-grid-disable-url not present.

        var accGridURLBypass = this.parentNode.getAttribute(accGridDataDisableURL);
        var selectedAccGridContentID = this.nextElementSibling.getAttribute("id");
        var targetContent = document.getElementById(selectedAccGridContentID);

        // On click, add or change data-accordion-grid-active value. Better to just add/change a data attribute script already lookig for.

        var accGridFragment = selectedAccGridContentID.split(/-/g).slice(2);
        var accGridContentSelected = accGridFragment[1];
        this.parentNode.setAttribute(accGridDataActive, accGridContentSelected)

        // if callback is present, then fire it off.

        var accGridCallBack = this.parentNode.dataset.accordionGridCallback;

        if(accGridCallBack !== undefined) {

          var contentTarget = this.nextElementSibling.getAttribute("id");
          customCallback(contentTarget, accGridCallBack);

        }

        if(accGridURLBypass === null) {

          history.pushState(null, null, "#" + selectedAccGridContentID);

        }

      }

    });

  });

  // Content Order

  accGridContentAll.forEach(function(content, e){

    // Close Button

    if(!content.parentNode.hasAttribute(accGridDataClose)) {

      var accGridCloseButton = document.createElement("button");
      accGridCloseButton.setAttribute("aria-label", accGridCloseText);
      accGridCloseButton.classList.add(accGridCloseClass);

      accGridCloseButton.addEventListener("click", function () {

        this.parentNode.previousElementSibling.setAttribute("aria-expanded", "false");
        this.parentNode.parentNode.removeAttribute(accGridDataActive);

      });

      content.prepend(accGridCloseButton);

    }

  });

  accGridCallBackAll.forEach(function(accgrid){

    var callBackFunction = accgrid.dataset.accordionGridCallback;
    var callBackContent = accgrid.querySelectorAll(accGridButtonClass + "[aria-expanded=true] + " + accGridContentClass);

    callBackContent.forEach(function(content){

      var contentTarget = content.getAttribute("id");
      customCallback(contentTarget, callBackFunction);

    });

  });

  // Custom callback with variable name. Accepts ID of content you will target.

  function customCallback(contentTarget, customCallBackName) {

    if (customCallBackName !== null) {

      window[customCallBackName](contentTarget);

    }

  }

  function scrollIntoPosition(button) {

    setTimeout(function(){

      // Scroll to grid position
      // TODO: Possibly remove this when scroll-margin-top is better supported in iOS

      // Get the element being accessed, in this case the button:

      var accGridContentTarget = button;

      setTimeout(function(){

        accGridContentTarget.focus();

      }, accGridDelay * 2);

    }, accGridDelay);

  }

  // Back Button

  window.onpopstate = function() {

    var contentFragment = window.location.hash.substr(1);

    if(contentFragment.indexOf(accGridContentAreaId) > -1) {

      // Parse fragment and pull grid and content ID number.
      // We will then target specific grid and reset data-accordion-grid-active with open value.

      var accGridFragment = contentFragment.split(/-/g).slice(2);
      var accGridSelected = parseInt(accGridFragment[0]);
      var accGridContentSelected = accGridFragment[1];
      var accgrid = document.getElementById(accGridDisclosureId + "-" + accGridSelected);

      // Reset data-accordion-grid-active

      accgrid.setAttribute(accGridDataActive, accGridContentSelected);

      accGridViewPort(); // HACK: Firing off entire grid again until we can build a small function to turn section on and off more simply.

      var selectedGridContent = document.getElementById(URLFragment);

      if (selectedGridContent) {

        var selectedGridButton = selectedGridContent.previousElementSibling;

        scrollIntoPosition(selectedGridButton);

      }

    }

  }

  // If hash exists, focus and scroll to it.

  if(URLFragment.indexOf(accGridContentAreaId) > -1) {

    // Focus and scroll to target content.

    var selectedGridContent = document.getElementById(URLFragment);

    if (selectedGridContent) {

      var selectedGridButton = selectedGridContent.previousElementSibling;

      scrollIntoPosition(selectedGridButton);

    }

  }

  // Add Grid Disclosure to Window Object so that it can be called again if needed.

  window.accGridViewPort = accGridViewPort;

})();

// Example Callback Function

function helloWorld(contentID) {

  var targetContent = document.getElementById(contentID);
  var message = document.createElement("p");
  message.innerHTML = "<strong>Hello World! The ID of this content area is <em> " + contentID + "</em>. You can use a callback to initiate a function within the disclosed content area on page load and reinitiate the same function on button click.</strong>";
  targetContent.append(message);

}
