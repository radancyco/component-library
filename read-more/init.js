/*!

  Radancy Component Library: Read More

  Contributor(s):
  Michael "Spell" Spellacy

  Dependencies: jQuery

*/

// Display which Grid version in use via console:

console.log('%c Read More v1.0 in use. ', 'background: #6e00ee; color: #fff');

$(".read-more").append("<button class='read-more__btn' aria-expanded='false'>Read More <span class='read-more__btn--icon' aria-hidden='true'></span></button>");

var $focusElms = "a, audio, button, input, select, video, *[tabindex]";

$(".read-more__content").attr("aria-hidden", "true").find($focusElms).attr("tabindex", "-1");

$(".read-more__btn").on("click", function() {

  $(this).attr("aria-expanded", function (i, attr) {

    return attr == "true" ? "false" : "true"

  });

  var $parentTarget = $(this).prev();
  var $parentTargetAttr = $(this).prev().attr("tabindex");

  if (typeof $parentTargetAttr !== typeof undefined && $parentTargetAttr !== false) {

    $parentTarget.removeAttr("tabindex").attr("aria-hidden", "true");
    $parentTarget.find($focusElms).attr("tabindex", "-1");

    $("html, body").animate({scrollTop: $parentTarget.offset().top}, 0);

  } else {

    $parentTarget.removeAttr("aria-hidden").attr("tabindex", "-1").focus();
    $parentTarget.find($focusElms).attr("tabindex", "0");

  }

});
