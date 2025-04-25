// Callback: Transparent Video (Intersection Observer)
// Learn More: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

function scrollObserver() {

    const sectionAnimation = document.querySelectorAll(".section-animation");
    const sectionAnimationVideoClass = ".section-animation__video";

    const sectionAnimationVideoScroll = (sections, observer) => {

        sections.forEach((section) => {

            if (section.isIntersecting) {

                // Target element is now in view

                const sectionTarget = section.target;
                const selectVideo = sectionTarget.querySelector(sectionAnimationVideoClass);

                const animationEnabled = document.body.classList.contains("animation-enabled");

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

    const observer = new IntersectionObserver(sectionAnimationVideoScroll, { 

        threshold: 1.0 

    });

    // Start observing each target element

    sectionAnimation.forEach((element) => {

        observer.observe(element);

    });

}