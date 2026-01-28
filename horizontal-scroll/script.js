/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy
  Connor Baba

*/

(() => {

  "use strict";

  // Display which version is in use via console:

  console.log("%c{{ include.title }}%cv{{ include.version }}", "background: #2d2d2d; color: #fff; padding: 6px 10px; border-radius: 16px 0 0 16px; font-weight: 600;" , "background: #6e00ee; color: #fff; padding: 6px 10px; border-radius: 0 16px 16px 0; font-weight: 600;");

  // Classes, data attributes, states, and strings.

  const scrollerClass = ".horizontal-scroll";
  const scrollers = document.querySelectorAll(scrollerClass);

  scrollers.forEach((scroll) => {

    // CMS Editability Modification

    const scrollerAriaElement = scroll.querySelector('[data-aria-label-replace]');
    const scrollerAriaLabel = scrollerAriaElement?.getAttribute("data-aria-label-replace") ?? "";
  
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

    const isRTL = document.dir === "rtl" || getComputedStyle(scroll).direction === "rtl"; // RTL Support

    scroll.addEventListener("wheel", (event) => {
    
      const canScroll = scroll.scrollWidth > scroll.clientWidth;
    
      if (!canScroll) return; // nothing to scroll horizontally

      const isAtStart = scroll.scrollLeft === 0;
      const isAtEnd = scroll.scrollLeft + scroll.clientWidth >= scroll.scrollWidth;
      const scrollDelta = isRTL ? -event.deltaY : event.deltaY;

      // Only prevent default if there is actually room to scroll in that direction
    
      const shouldScroll = (scrollDelta < 0 && !isAtStart) || (scrollDelta > 0 && !isAtEnd);
    
      if (!shouldScroll) return; // allow normal vertical scroll

      event.preventDefault();
    
      scroll.scrollBy({ left: scrollDelta, behavior: "smooth" });
    
    }, { 
      
      passive: false 
    
    }); 

  });

})();