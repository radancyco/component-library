/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Bobby KC
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which version in use via console:

  console.log("%c{{ include.title }}%cv{{ include.version }}", "background: #2d2d2d; color: #fff; padding: 6px 10px; border-radius: 16px 0 0 16px; font-weight: 600;" , "background: #6e00ee; color: #fff; padding: 6px 10px; border-radius: 0 16px 16px 0; font-weight: 600;");

  var instagramFeed = document.createElement("script");
  instagramFeed.setAttribute("src", "https://services.tmpwebeng.com/tmp-share/widget/js/instagram-feed.js?user=wegmans&caption=n&count=6");
  document.body.appendChild(instagramFeed);

})();