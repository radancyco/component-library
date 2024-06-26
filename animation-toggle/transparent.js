// Callback: Transparent Video (Intersection Observer)
// Learn More: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

function scrollObserver() {

    var sectionAnimation = document.querySelectorAll(".section-animation");
    var sectionAnimationVideoClass = ".section-animation__video";

    function sectionAnimationVideoScroll(sections, observer) {

        sections.forEach(function(section){

            if (section.isIntersecting) {

                // Target element is now in view

                var sectionTarget = section.target;
                var selectVideo = sectionTarget.querySelector(sectionAnimationVideoClass);

                var animationEnabled = document.body.classList.contains("animation-enabled");

                if (animationEnabled) {

                    selectVideo.play();

                } else {

                    selectVideo.pause();

                }

                // Stop observing once the element is in view (if needed)

                observer.unobserve(sectionTarget);

            }

        });

    }

    // Create an Intersection Observer instance

    var observer = new IntersectionObserver(sectionAnimationVideoScroll, { 

        threshold: 1.0 

    });

    // Start observing each target element

    sectionAnimation.forEach(function(element){

        observer.observe(element);

    });

}