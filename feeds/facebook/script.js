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

  var facebookFeed = document.createElement("script");
  facebookFeed.setAttribute("src", "https://services.tmpwebeng.com/tmp-share/widget/js/facebook.js?user=radancyco");
  document.body.appendChild(facebookFeed);

})();