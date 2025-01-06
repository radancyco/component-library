/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Bobby KC
  Michael "Spell" Spellacy

  Dependencies: jQuery

*/

(function() {

  "use strict";

  // Display which version in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  var instagramFeed = document.createElement("script");
  instagramFeed.setAttribute("src", "https://services.tmpwebeng.com/tmp-share/widget/js/instagram.js?user=wegmans&count=6");
  document.body.appendChild(instagramFeed);

})();