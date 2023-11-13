/*!

  Radancy Component Library: Animation Toggle (Custom Function)

  Contributor(s):
  Michael "Spell" Spellacy

  Dependencies: Animation Toggle, Lottie

*/

// Reminder: Be sure to load your third-party framework before initiating this script. For this example, we are using Lottie.

var animation = lottie.loadAnimation({

    container: document.querySelector(".callback-example"),
    loop: true,
    autoplay: false,
    path: "https://radancy.dev/component-library/animation-toggle/callback-animation.json",
      
});
  
window.addEventListener("load", function() {

  var animationEnabled = document.body.classList.contains("animation-enabled");
    
  if (animationEnabled) {
  
    animation.play();
  
    // Use this to get your total frame count. You can use the most desirable frame in goToAndStop. For example: animation.goToAndStop(42, true);
      
    // var totalFrames = animation.totalFrames;
    // console.log("Total frames:", totalFrames);
    
  } else { 
    
    animation.goToAndStop(110, true);
  
  }
  
});

// Function defined in data-callback. For example: data-callback="pauseAfterEffects"

// Note: If you have a page with mixed looping animations (Video, SVG, etc.) you should add this callback to each Animation Toggle.
  
function pauseAfterEffects() {
  
  if (animation.isPaused) {
  
    animation.play();
      
  } else {
   
    animation.pause();
  
  }
  
}