/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which component version in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  var readMoreClass = ".read-more";
  var readMoreContentClass = ".read-more__content";
  var readMoreButtonName = "read-more__btn";
  var readMoreButtonIconName = "read-more__icon";
  var readMoreButtonLabelName = "read-more__label";
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

    // Prep Content

    var readMoreContent = content.querySelector(readMoreContentClass);

    readMoreContent.setAttribute("aria-hidden", "true");

    // Set tabindex to all focusable elements in "read-more__content"

    focusableElements(readMoreContent, true);

    // Prep Disclosure

    var readMoreButton = document.createElement("button");

    readMoreButton.setAttribute("aria-expanded", "false");
    readMoreButton.setAttribute("class", readMoreButtonName);

    // Disclosure Label

    var readMoreLabel = document.createElement("span");
    readMoreLabel.setAttribute("class", readMoreButtonLabelName);

    // Disclosure Text

    if (content.hasAttribute(readMoreButtonLabel)) {

      readMoreLabel.textContent = content.getAttribute(readMoreButtonLabel);
    
    } else { 
    
      readMoreLabel.textContent = readMoreDefaultText;
    
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

      content.prepend(readMoreButton);

    }

    // Disclosure Event

    readMoreButton.addEventListener("click", function() {

      // Toggle aria-expanded

      var ariaExpanded = this.getAttribute("aria-expanded") === "true" || false;
  
      this.setAttribute("aria-expanded", !ariaExpanded);

      // Toggle Content

      var readMoreContent = this.parentElement.querySelector(readMoreContentClass);
  
      if (readMoreContent.hasAttribute("aria-hidden")) {

        readMoreContent.removeAttribute("aria-hidden")
        readMoreContent.setAttribute("tabindex", "-1");

        if(this.parentElement.hasAttribute(readMoreButtomPosition)) {
      
          readMoreContent.focus();

        }

        // Remove tabindex from all focusable elements in content.

        focusableElements(readMoreContent);

      } else {
  
        readMoreContent.removeAttribute("tabindex");
        readMoreContent.setAttribute("aria-hidden", "true");
      
        if(this.parentElement.hasAttribute(readMoreButtomPosition)) {
      
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