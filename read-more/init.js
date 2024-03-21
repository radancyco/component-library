/*!

  Radancy Component Library: Read More

  Contributor(s):
  Michael "Spell" Spellacy

  Dependencies: jQuery

*/

// Display which Read More version in use via console:

console.log("%c Read More v1.1 in use. ", "background: #6e00ee; color: #fff");

var $readMoreClass = $(".read-more");
var $readMoreContentClass = $(".read-more__content");
var readMoreDataBottom = "data-button-bottom";
var readMoreDataLabel = "data-button-label";

$readMoreClass.each(function( ) {

  var readMoreDataBottomAttr = $(this).attr(readMoreDataBottom);
  var readMoreDataLabelAttr = $(this).attr(readMoreDataLabel);

  if (typeof readMoreDataLabelAttr !== typeof undefined && readMoreDataLabelAttr !== false) {

    var label = readMoreDataLabelAttr;

  } else { 

    var label = "Read More";

  }

  var readMoreButton = "<button class='read-more__btn' aria-expanded='false'>" + label + " <span class='read-more__btn--icon' aria-hidden='true'></span></button>";

  if (typeof readMoreDataBottomAttr !== typeof undefined && readMoreDataBottomAttr !== false) {

    $(this).append(readMoreButton);

  } else {

    $(this).prepend(readMoreButton);

  }

});

var $readMoreBtnClass = $(".read-more__btn");

var $focusElms = "a, audio, button, input, select, video, *[tabindex]";

$readMoreContentClass.attr("aria-hidden", "true").find($focusElms).attr("tabindex", "-1");

$readMoreBtnClass.on("click", function() {

  toggleContent($(this));

});

function toggleContent(target) {

  target.attr("aria-expanded", function (i, attr) {

    return attr == "true" ? "false" : "true"

  });

  var attr = target.parent().attr(readMoreDataBottom);

  if (typeof attr !== typeof undefined && attr !== false) {

    var $parentTarget = target.prev();
    var $parentTargetAttr = target.prev().attr("tabindex");

  } else {

    var $parentTarget = target.next();
    var $parentTargetAttr = target.next().attr("tabindex");

  }

  if (typeof $parentTargetAttr !== typeof undefined && $parentTargetAttr !== false) {

    $parentTarget.removeAttr("tabindex").attr("aria-hidden", "true");
    $parentTarget.find($focusElms).attr("tabindex", "-1");

    if (typeof attr !== typeof undefined && attr !== false) {

      $("html, body").animate({scrollTop: $parentTarget.offset().top}, 0);

    }

  } else {

    $parentTarget.removeAttr("aria-hidden").attr("tabindex", "-1");

    if (typeof attr !== typeof undefined && attr !== false) {

      $parentTarget.focus();

    }

    $parentTarget.find($focusElms).attr("tabindex", "0");

  }

}
