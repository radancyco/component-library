// Example: Callback (After Effects)

// Check if Lottie library is present

if (typeof lottie !== "undefined") {

  var callBackTarget = document.querySelector(".callback-example");
  var callBackAnimation = callBackTarget.getAttribute("data-animation-path");

  var animation = lottie.loadAnimation({

    container: callBackTarget,
    loop: true,
    autoplay: false,
    path: callBackAnimation,
    
  });

} else {

  console.log("%c Lottie library is not loaded. Please include the library before using it. ", "background: #FF0000; color: #fff");

}
  
function toggleAfterEffects(thisButton) {

  if (typeof lottie !== "undefined") {
  
    var animationEnabled = document.body.classList.contains("animation-enabled");

    if (animationEnabled) {

      animation.play();

      // console.log("Total frames:", animation.totalFrames);
  
    } else { 

      setTimeout(function(){

        // Optional: This if statement is only required if animation is needed to show specific frame on page load. If not needed, animation.pause() will suffice.
        // TODO: The timeout is needed to give the script a moment for class to be added before the if statement fires. Without it, the animation fires goToAndStop

        if(thisButton.classList.contains("animation-pause")) {

          animation.pause();

        } else {

          var defaultFrame = Number(callBackTarget.getAttribute("data-animation-pause"));

          animation.goToAndStop(defaultFrame, true); 

        }

      }, 10);

    }

  }

  // Optional: Only use if you do not need animation to show specific frame on page load.

  thisButton.addEventListener("click", function() {

    thisButton.classList.add("animation-pause");

  });
  
}