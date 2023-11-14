/*!

  Radancy Component Library: Animation Toggle (Callback Example)

  Contributor(s):
  Michael "Spell" Spellacy

  Dependencies: Animation Toggle, Lottie

*/

// Reminder: Load your third-party framework before initiating this script. In this example, we are using Lottie.
// https://radancy.dev/component-library/animation-toggle/callback-lottie.json

var animation = lottie.loadAnimation({

  container: document.querySelector(".callback-example"),
  loop: true,
  autoplay: false,
  path: "https://radancy.dev/component-library/animation-toggle/callback-animation.json",
    
});
  
function toggleAfterEffects(thisButton) {
  
  var animationEnabled = document.body.classList.contains("animation-enabled");

  if (animationEnabled) {

    animation.play();

    // console.log("Total frames:", animation.totalFrames);
  
  } else { 

    // Optional: This if statement is only required if you need animation to show specifc frame on page load. If not needed, animation.pause() will suffice.

    if(thisButton.classList.contains("animation-pause")) {

      animation.pause();

    } else {

      animation.goToAndStop(110, true); 

    }

  }

  // Optional: Only use if you do not need animation to show specifc frame on page load.

  thisButton.addEventListener("click", function() {

    thisButton.classList.add("animation-pause");

  });
  
}