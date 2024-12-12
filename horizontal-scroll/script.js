/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which version is in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  // Classes, data attributes, states, and strings.

  var scrollerClass = ".horizontal-scroll";
  var scrollers = document.querySelectorAll(scrollerClass);

  scrollers.forEach(function(scroll) {

    var hasInteractiveElements = scroll.querySelectorAll("a, button");

    // See if interactive elements exist. If they do, remove aria-label, role, and tabindex.

    if (hasInteractiveElements.length) {

        scroll.removeAttribute("aria-label");
        scroll.removeAttribute("role");
        scroll.removeAttribute("tabindex");

    }

  });

})();