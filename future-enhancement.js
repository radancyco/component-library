

/* =========================================================================
Horizontal scroll
========================================================================== */

// Found an interesting add-on that dev added to an HS on a site, where they are
// allowing user to press down and grab the contents of the scroller and move with
// their mouse. May make an interesting enhacement to the script eventually. 

$(document).ready(function () {

    let isDown = false;
    let startX;
    let scrollLeft;

    $(".horizontal-scroll").mousedown(function (e) {
        isDown = true;
        startX = e.pageX - $(this).offset().left;
        scrollLeft = $(this).scrollLeft();
    });

    $(".horizontal-scroll").mouseleave(function () {
        isDown = false;
    });

    $(".horizontal-scroll").mouseup(function () {
        isDown = false;
    });

    $(".horizontal-scroll").mousemove(function (e) {

        if (!isDown) return;

        e.preventDefault();

        let x = e.pageX - $(this).offset().left;
        let walk = (x - startX) * 2;

        $(this).scrollLeft(scrollLeft - walk);
    });
});
