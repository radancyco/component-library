/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

  "use strict";

  // Display which component in use via console:

  console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

  var selectExternalClass = ".select-external";
  var selectExternalLabelClass = ".select-external__label";
  var selectExternalSelectClass = ".select-external__select";
  var selectExternalBtnClass = ".select-external__btn";
  var selectExternalLabel = document.querySelectorAll(selectExternalLabelClass);
  var selectExternalSelect = document.querySelectorAll(selectExternalSelectClass);
  var selectExternalBtn = document.querySelectorAll(selectExternalBtnClass);

  selectExternalLabel.forEach(function(label, e){

    label.setAttribute("for", "select-external-" + (e + 1));

  });

  selectExternalSelect.forEach(function(select, e){

    select.setAttribute("id", "select-external-" + (e + 1));

  });

  selectExternalBtn.forEach(function(button){

    button.addEventListener("click", function () {

      var selectExternalSelected = this.closest(selectExternalClass).getElementsByTagName("select")[0];

      location.href = selectExternalSelected.value;

    });

  });

})();
