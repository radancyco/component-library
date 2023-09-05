/*

	Radancy Component Library: CSS Animation

	Contributor(s):
	Drew Toth
	Michael "Spell" Spellacy

	Dependencies: jQuery

*/


(function () {

	// Grab the hash (fragment) from the URL.

	var URLFragment = location.hash.slice(1);

	// Create animation code button and container

	$(".animation-container").append("<button class='btn btn-code' aria-expanded='false'>View Code</button><div class='animation-code' role='region' tabindex='0'><pre><code class='slideLeft'/></pre></div>");

	$(".btn-code").on( "click", function() {

		$(this).attr("aria-expanded", function (i, attr) {

			return attr == "true" ? "false" : "true";

		});

	});

	// Setup code for first animation

	// Note: Randomize animation on page load.

	var $ele = $(".container .button");

	if(URLFragment) {

		var selectedAnimation = URLFragment;

	} else {
	
		var selectedAnimation = $ele.eq(Math.floor(Math.random()*($ele.length - 1))).attr("data-id");

	}

	$("#object").addClass(selectedAnimation); // Load Animation

	var selectedItem = $("a[data-id=" + selectedAnimation + "]");

	$(".animation-code pre code").load(selectedItem.attr("href")); // Load Associated Animated Code

	selectedItem.addClass("active"); // Highlight Associated Animated Code Button

	// Grab Sass from button link and insert into code window (.animation-code)

	// Hack to get back button to work. TODO: Revisit.
	
	$(window).on("popstate", function (e) {

        location.reload();

    });

	$(".button").on( "click", function() {

  		$("#object").removeClass().addClass($(this).attr("data-id"));
  		$(".animation-code pre code").load($(this).attr("href"));
  		$(".container").find(".button").removeClass("active");
  		$(this).addClass("active");

		history.pushState(null, null, "#" + $(this).attr("data-id"));

		return false;

	});

	// There may be some conditions where we want to manipulate our canvas for better viewing.

	var canvas = $(".animation-canvas").offset().top;
	var $window = $(window);

	function checkTopPosition() {

		if ($window.scrollTop() >= canvas ) {

			$("body").addClass("active");

		} else {

			$("body").removeClass("active");

		}

  	}

  	$window.on("scroll resize", checkTopPosition);
  	$window.trigger("scroll");

})();
