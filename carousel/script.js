/*!

Radancy Component Library: Carousel

Contributor(s):
Michael "Spell" Spellacy

*/

(() => {

    "use strict";

    function createArrowButtons(carousel) {

        const previousButton = document.createElement('button');

        previousButton.className = 'carousel__prev';
        previousButton.setAttribute('aria-label', 'Previous Slide');
        previousButton.innerHTML = `<span class="fas fa-chevron-left" aria-hidden="true"></span>`; // InnerHTML is a secutiy risk, create node and insert.

        const nextButton = document.createElement('button');

        nextButton.className = 'carousel__next';
        nextButton.setAttribute('aria-label', 'Next Slide');
        nextButton.innerHTML = `<span class="fas fa-chevron-right" aria-hidden="true"></span>`;

        const carouselPlaceholderPrev = carousel.querySelector(".carousel__placeholder__prev");
        const carouselPlaceholderNext = carousel.querySelector(".carousel__placeholder__next");

        carouselPlaceholderPrev.appendChild(previousButton);
        carouselPlaceholderNext.appendChild(nextButton);

        return { previousButton, nextButton };

    }

    function createNavigationDots(carousel, slides, slidesVisible, goToSlide) {

        const nav = document.createElement('nav');
        const ul = document.createElement('ul');

        nav.className = 'carousel__nav';

        // Calculate number of "positions" for dots

        const dotCount = Math.max(slides.length - slidesVisible + 1, 1);

        Array.from({ length: dotCount }).forEach((_, i) => {
    
            const li = document.createElement('li');
            const button = document.createElement('button');
    
            button.setAttribute('aria-label', `Slide ${i + 1}`);

            if (i === 0) {
            
                button.setAttribute('aria-current', 'true');
    
            }

            button.addEventListener('click', () => goToSlide(i));

            li.appendChild(button);
            ul.appendChild(li);

        });

        nav.appendChild(ul);

        const carouselPlaceholderNav = carousel.querySelector(".carousel__placeholder__nav");

        carouselPlaceholderNav.appendChild(nav);

        return Array.from(ul.querySelectorAll('button'));

    }

    function hideNonVisibleSlides(slides, leftMostSlideIndex, slidesVisible) {

        slides.forEach(slide => {

            slide.setAttribute('aria-hidden', 'true');
            slide.querySelectorAll('a, button, select, input, textarea, [tabindex="0"]').forEach(el => {

                el.setAttribute('tabindex', '-1');

            });

        });

        const visibleIndex = Math.min(leftMostSlideIndex, slides.length - slidesVisible);
        const visibleSlide = slides[visibleIndex];

        if (visibleSlide) {

            visibleSlide.removeAttribute('aria-hidden');
            visibleSlide.querySelectorAll('a, button, select, input, textarea, [tabindex="-1"]').forEach(el => {

                el.removeAttribute('tabindex');

            });

        }

    }

    function updateLiveRegion(liveRegion, slides, leftMostSlideIndex, hasInteracted) {

        if (!hasInteracted || !liveRegion) {

            return;

        }

        const currentSlide = slides[leftMostSlideIndex];
        const slideName = currentSlide?.dataset.slideName || `Slide ${leftMostSlideIndex + 1}`;
    
        liveRegion.textContent = `${slideName}, Slide ${leftMostSlideIndex + 1} of ${slides.length}`;

    }

    /* ----------------------
    Carousel Initialization
    ---------------------- */

    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {

        let leftMostSlideIndex = 0;
        let hasInteracted = false;

        // -----------------------------
        // 1️⃣ Add carousel-level ARIA
        // -----------------------------

        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-roledescription', 'carousel');

        const label = carousel.dataset.carouselLabel;

        if (label) {

            carousel.setAttribute('aria-label', label);

        }

        carousel.removeAttribute('data-carousel-label');

        // -----------------------------
        // 2️⃣ Determine slides visible
        // -----------------------------

        let slidesVisible = 1;

        const slidesVisibleAttr = carousel.dataset.slidesVisible;

        if (slidesVisibleAttr) {

            const parsed = parseInt(slidesVisibleAttr, 10);

            if (!isNaN(parsed) && parsed > 0) {

                slidesVisible = parsed;

            }

        }

        // -----------------------------
        // 3️⃣ Add roles to slides and list
        // -----------------------------

        const slidesContainer = carousel.querySelector('.carousel__slides');

        if (!slidesContainer) {

            return;

        }

        slidesContainer.setAttribute('role', 'presentation');

        const slides = Array.from(slidesContainer.querySelectorAll('.carousel__slide'));

        slides.forEach(slide => {

            slide.setAttribute('role', 'presentation');

        });

        // ✅ Set container grid-auto-columns based on slidesVisible
        
        slidesContainer.style.gridAutoColumns = `${100 / slidesVisible}%`;

        if (!slides.length) {

            return;

        }

        // -----------------------------
        // 4️⃣ Create controls & navigation
        // -----------------------------

        const { previousButton, nextButton } = createArrowButtons(carousel);
        const slideDots = createNavigationDots(carousel, slides, slidesVisible, goToSlide);

        // -----------------------------
        // 5️⃣ Slide Functions
        // -----------------------------

        function goToSlide(nextIndex) {

            hasInteracted = true;

            // ✅ Ensure we never scroll past the last fully visible slide

            const maxIndex = slides.length - slidesVisible;

            nextIndex = Math.min(nextIndex, maxIndex);

            slidesContainer.scrollTo(
    
              (slidesContainer.offsetWidth / slidesVisible) * nextIndex, 0
            
            );

            slideDots.forEach(dot => {

                dot.removeAttribute('aria-current');

            });

            if (slideDots[nextIndex]) {

                slideDots[nextIndex].setAttribute('aria-current', 'true');

            }

            leftMostSlideIndex = nextIndex;
            hideNonVisibleSlides(slides, leftMostSlideIndex, slidesVisible);

            const liveRegion = carousel.querySelector('.carousel__msg');

            updateLiveRegion(liveRegion, slides, leftMostSlideIndex, hasInteracted);

        }

        function previousSlide() {

            if (leftMostSlideIndex > 0) {

                goToSlide(leftMostSlideIndex - 1);

            }

        }

        function nextSlide() {

            if (leftMostSlideIndex < slides.length - 1) {

                goToSlide(leftMostSlideIndex + 1);

            }

        }

        // -----------------------------
        // 6️⃣ Wire up button events
        // -----------------------------

        previousButton.addEventListener('click', previousSlide);
        nextButton.addEventListener('click', nextSlide);

        // -----------------------------
        // 🖐️ Swipe Detection (mobile touch) robust
        // -----------------------------

        let touchStartX = 0;
        let touchStartY = 0;
        const SWIPE_THRESHOLD = 50; // minimum px to trigger

        slidesContainer.addEventListener('touchstart', (e) => {

            if (e.touches.length !== 1) {

                return; // ignore multi-touch

            }

            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;

        }, { passive: true });

        slidesContainer.addEventListener('touchmove', (e) => {

            if (e.touches.length !== 1) {

                return;

            }

            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);

            // Only prevent vertical scroll if horizontal swipe is significant

            if (deltaX > deltaY && deltaX > 10) {

                e.preventDefault();

            }

        }, { passive: false });

        slidesContainer.addEventListener('touchend', (e) => {

            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;

            if (diff > SWIPE_THRESHOLD) {

                previousSlide(); // swipe right

            } else if (diff < -SWIPE_THRESHOLD) {

                nextSlide(); // swipe left

            }

        });

        // -----------------------------
        // 7️⃣ Initial visibility
        // -----------------------------

        hideNonVisibleSlides(slides, leftMostSlideIndex, slidesVisible);

    });

})();
