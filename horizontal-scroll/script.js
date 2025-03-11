/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy
  Connor Baba

*/

(function() {

  "use strict";

  // Display which version is in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  // Classes, data attributes, states, and strings.

  var scrollerClass = ".horizontal-scroll";
  var scrollers = document.querySelectorAll(scrollerClass);

  scrollers.forEach(function(scroll) {

    //cms editability modification

    var scrollerAriaElement = scroll.querySelector('[data-aria-label-replace');
    var scrollerAriaLabel = scrollerAriaElement ? scrollerAriaElement.getAttribute('data-aria-label-replace') : "";

    //checks if label exists, and then replaces it with cms value. When done, deletes junk element from DOM.

    if(scrollerAriaLabel) {

      scroll.setAttribute("aria-label", scrollerAriaLabel);
      scrollerAriaElement.remove();

    }

    //end cms editability modification
    
     var hasInteractiveElements = scroll.querySelectorAll("a, button, video, [tabindex='0'], [data-href*='facebook/videos'], iframe[src*='vimeo.com'], iframe[src*='youtube.com']");

    // See if interactive elements exist. If they do, remove aria-label, role, and tabindex.

    if (hasInteractiveElements.length) {

        scroll.removeAttribute("aria-label");
        scroll.removeAttribute("role");
        scroll.removeAttribute("tabindex");

    }

  });

})();