/*

	Radancy Component Library: CSS Animation

	Contributor(s):
	Drew Toth
	Michael "Spell" Spellacy

	Dependencies: jQuery

*/


(function () {

	// Grab the hash from the URL.

	var URLFragment = location.hash.slice(1);

	// Create animation code button and container

	$(".css-animation__header").append("<button class='btn css-animation__button' aria-expanded='false'>View CSS</button><div aria-label='CSS' class='css-animation__code' role='region' tabindex='0'><pre><code class='slideLeft'/></pre></div>");

	$(".css-animation__button").on("click", function() {

		$(this).attr("aria-expanded", function (i, attr) {

			return attr == "true" ? "false" : "true";

		});

	});

	// Setup code for first (random) animation

	var $ele = $(".css-animation__label");

	if(URLFragment) {

		var selectedAnimation = URLFragment;

	} else {
	
		var selectedAnimation = $ele.eq(Math.floor(Math.random()*($ele.length - 1))).attr("data-animation-id");

	}

	$(".css-animation__object").addClass(selectedAnimation); // Load Selected Animation

	var selectedItem = $("a[data-animation-id=" + selectedAnimation + "]");

	$(".css-animation__code pre code").load(selectedItem.attr("href")); // Load Annimation Code

	selectedItem.addClass("active"); // Highlight Associated Animated Code Button

	// Grab Sass from button link and insert into code window (.css-animation__code)

	$(".css-animation__label").on( "click", function() {

		var activeAnimation = $(".css-animation__label.active").attr("data-animation-id"); // Get active element

  		$(".css-animation__object").removeClass(activeAnimation).addClass($(this).attr("data-animation-id"));
  		$(".css-animation__code pre code").load($(this).attr("href"));
  		$(".css-animation__list").find(".css-animation__label").removeClass("active");
  		$(this).addClass("active");

		// Update URL

		history.pushState(null, null, "#" + $(this).attr("data-animation-id"));

		// Copy URL

		let url = document.location.href;

		navigator.clipboard.writeText(url).then(function() {
	
			console.log("Copied!");

	  	}, function() {
	
		  console.log("Copy error");

	  	});

		return false;

	});

	// There may be some conditions where we want to manipulate our canvas for better viewing.

	var canvas = $(".css-animation__canvas").offset().top;
	var $window = $(window);

	function checkTopPosition() {

		if ($window.scrollTop() >= canvas ) {

			$("body").addClass("active");

		} else {

			$("body").removeClass("active");

		}

  	}

	// Hack to get back button to work. TODO: Revisit.
	
	$(window).on("popstate", function (e) {

		location.reload();
	
	});

  	$window.on("scroll resize", checkTopPosition);
  	$window.trigger("scroll");

})();
