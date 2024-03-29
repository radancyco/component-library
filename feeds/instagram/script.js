/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Bobby KC
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which version in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  var instagramFeed = document.createElement("script");
  instagramFeed.setAttribute("src", "https://services.tmpwebeng.com/tmp-share/widget/js/instagram.js?user=wegmans&caption=n&count=6");
  document.body.appendChild(instagramFeed);

})();