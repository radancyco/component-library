/*!

  Radancy Component Library: Instagram Feed

  Contributor(s):
  Bobby KC
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which version in use via console:

  console.log("%c Instagram Feed v1.0 in use. ", "background: #6e00ee; color: #fff");

  var instagramFeed = document.createElement("script");
  instagramFeed.setAttribute("src", "https://services.tmpwebeng.com/tmp-share/widget/js/instagram.js?user=wegmans&caption=n&count=6");
  document.body.appendChild(instagramFeed);
  
  var instagramContainer = document.getElementById("tmp-instagram-feed");
  
  if (instagramContainer) {
    
    if (!instagramContainer.children.length) {
      
      instagramContainer.classList.add("no-feed-available");
      instagramContainer.innerText = "Sorry, no feed content is available. Please reach out to Radancy for support.";
      
    }
    
  }

})();