/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy
  Connor Baba

*/

(() => {

  "use strict";

  // Display which version is in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  // Classes, data attributes, states, and strings.

  const scrollerClass = ".horizontal-scroll";
  const scrollers = document.querySelectorAll(scrollerClass);
  const dataWheelSupport = "data-wheel-support";

  scrollers.forEach((scroll) => {

    const scrollerAriaElement = scroll.querySelector('[data-aria-label-replace]');
    const scrollerAriaLabel = scrollerAriaElement?.getAttribute("data-aria-label-replace") ?? "";

    // CMS Editability Modification
    // Checks if label exists, and then replaces it with CMS value. When done, deletes junk element from DOM.

    if(scrollerAriaLabel) {

      scroll.setAttribute("aria-label", scrollerAriaLabel);
      scrollerAriaElement.remove();

    }
    
    var hasInteractiveElements = scroll.querySelectorAll("a, button, video, [tabindex='0'], [data-href*='facebook/videos'], iframe[src*='vimeo.com'], iframe[src*='youtube.com']");

    // See if interactive elements exist. If they do, remove aria-label, role, and tabindex.

    if (hasInteractiveElements.length) {

      ["aria-label", "role", "tabindex"].forEach(attr => scroll.removeAttribute(attr));

    }

    // Mousewheel Support

    if(scroll.hasAttribute(dataWheelSupport)) {

      // RTL Support

      const isRTL = document.dir === "rtl" || getComputedStyle(scroll).direction === "rtl";

      scroll.addEventListener("wheel", (event) => {
  
        if (document.activeElement === scroll || scroll.matches(":hover")) {
    
          event.preventDefault();
          
          scroll.scrollBy({ 
            
            left: isRTL ? -event.deltaY : event.deltaY, 
            behavior: "smooth" 
          
          });
  
        }

      }, { 
        
        passive: false 
      
      });

    }

  });

})();