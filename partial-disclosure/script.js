/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which component version in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  var readMoreClass = ".partial-disclosure";
  var readMoreContentClass = ".partial-disclosure__content";
  var readMoreButtonName = "partial-disclosure__btn";
  var readMoreButtonIconName = "partial-disclosure__icon";
  var readMoreButtonLabelName = "partial-disclosure__label";
  var readMoreButtomPosition = "data-button-bottom";
  var readMoreButtonLabel = "data-button-label";
  var readMoreDefaultText = "Read More";
  var readMore = document.querySelectorAll(readMoreClass);
  var focusElms = ["a", "audio", "area", "button", "*[contenteditable]", "details", "input", "iframe", "object", "select", "summary", "textarea", "video", "*[tabindex]"];

  function focusableElements(target, tabindex) {

    // Loop through each selector in the focusElms array
    
    focusElms.forEach(function(selector) {
      
      // Get all elements matching the current selector within the content area.
  
      var elements = target.querySelectorAll(selector);
  
      // Loop through each matching element
  
      elements.forEach(function(el) {
  
        // Set the tabindex attribute to -1

        if(tabindex === true) {
  
          el.setAttribute("tabindex", "-1");

        } else {

          el.removeAttribute("tabindex");

        }
  
      });

    });

  }
  
  // Set up and loop through all Read More components on page

  readMore.forEach(function(content){

    // Get custom trigger if it exists.

    var customReadMoreBtn = content.querySelector(".partial-disclosure__trigger");

    // Prep Content

    var readMoreContent = content.querySelector(readMoreContentClass);

    readMoreContent.setAttribute("aria-hidden", "true");

    // Set tabindex to all focusable elements in "partial-disclosure__content"

    focusableElements(readMoreContent, true);

    // Prep Disclosure

    var readMoreButton = document.createElement("button");

    readMoreButton.setAttribute("aria-expanded", "false");

    // Tracking

    readMoreButton.setAttribute("data-custom-event", "true");
    readMoreButton.setAttribute("data-custom-category", "Component");
    readMoreButton.setAttribute("data-custom-label", "{{ include.title }} v{{ include.version }}");

    if(!customReadMoreBtn) {

      readMoreButton.setAttribute("class", readMoreButtonName);

    }

    // Disclosure Label

    var readMoreLabel = document.createElement("span");
    readMoreLabel.setAttribute("class", readMoreButtonLabelName);

    // Disclosure Text

    if (content.hasAttribute(readMoreButtonLabel)) {

      readMoreLabel.textContent = content.getAttribute(readMoreButtonLabel);
    
    } else { 

      if(customReadMoreBtn) {
    
        var customReadMoreTxt = customReadMoreBtn.textContent;
  
        readMoreLabel.textContent = customReadMoreTxt;
        customReadMoreBtn.textContent = "";
  
      } else {
    
        readMoreLabel.textContent = readMoreDefaultText;

      }
    
    }

    // Disclosure Icon

    var readMoreButtonIcon = document.createElement("span");
    readMoreButtonIcon.setAttribute("aria-hidden", "true");
    readMoreButtonIcon.setAttribute("class", readMoreButtonIconName);

    readMoreButton.append(readMoreLabel);
    readMoreButton.append(readMoreButtonIcon);

    if (content.hasAttribute(readMoreButtomPosition)) {

      content.append(readMoreButton);

    } else {

      if(customReadMoreBtn) {

        customReadMoreBtn.append(readMoreButton);

      } else {

        content.prepend(readMoreButton);

      }

    }

    // Disclosure Event

    readMoreButton.addEventListener("click", function() {

      // Toggle aria-expanded

      var ariaExpanded = this.getAttribute("aria-expanded") === "true" || false;
  
      this.setAttribute("aria-expanded", !ariaExpanded);

      // Toggle Content

      var readMoreContent = this.closest(readMoreClass).querySelector(readMoreContentClass);
  
      if (readMoreContent.hasAttribute("aria-hidden")) {

        readMoreContent.removeAttribute("aria-hidden")
        readMoreContent.setAttribute("tabindex", "-1");

        if(this.closest(readMoreClass).hasAttribute(readMoreButtomPosition)) {
      
          readMoreContent.focus();

        }

        // Remove tabindex from all focusable elements in content.

        focusableElements(readMoreContent);

      } else {
  
        readMoreContent.removeAttribute("tabindex");
        readMoreContent.setAttribute("aria-hidden", "true");
      
        if(this.closest(readMoreClass).hasAttribute(readMoreButtomPosition)) {
      
          readMoreContent.scrollIntoView({ 
            
            behavior: "smooth", 
            block: "start" 
          
          });

        }

        // Set tabindex on all focusable elements in content.

        focusableElements(readMoreContent, true);

      } 

    });

  });

})();