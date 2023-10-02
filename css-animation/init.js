/*

	Radancy Component Library: CSS Animation

	Contributor(s):
	Drew Toth
	Michael "Spell" Spellacy

	Dependencies: jQuery

*/


(function () {

	var $cssAnimationHeader = $(".css-animation__header");
	var $cssAnimationLabel =  $(".css-animation__label");
	var $cssAnimationObject = $(".css-animation__object");
	var $cssAnimationCanvas = $(".css-animation__canvas");
	var $cssAnimationList = $(".css-animation__list");
	var $cssAnimationMsg = $(".css-animation__msg");
	var activeClass = "active";

	// Grab the hash from the URL.

	var URLFragment = location.hash.slice(1);

	// Create animation code button and container

	$cssAnimationHeader.append("<button class='btn css-animation__button' aria-expanded='false'>View CSS</button><div aria-label='CSS' class='css-animation__code' role='region' tabindex='0'><pre><code class='slideLeft'/></pre></div>");

	var $cssAnimationButton = $(".css-animation__button");
	var $cssAnimationCode = $(".css-animation__code");
	var $cssAnimationCodeTarget = $cssAnimationCode.find("code");
	
	$cssAnimationButton.on("click", function() {

		$(this).attr("aria-expanded", function (i, attr) {

			return attr == "true" ? "false" : "true";

		});

	});

	// Setup code for first (random) animation

	if(URLFragment) {

		var selectedAnimation = URLFragment;

	} else {
	
		var selectedAnimation = $cssAnimationLabel.eq(Math.floor(Math.random()*($cssAnimationLabel.length - 1))).attr("data-animation-id");

	}

	$cssAnimationObject.addClass(selectedAnimation); // Load Selected Animation

	var selectedItem = $(".css-animation__label[data-animation-id=" + selectedAnimation + "]");

	$cssAnimationCodeTarget.load(selectedItem.attr("href")); // Load Annimation Code

	selectedItem.addClass(activeClass); // Highlight Associated Animated Code Button

	// Always remove animation class when animation complete. 

	$cssAnimationObject.on("animationend", function(){	
	  
		document.querySelector('.css-animation__object').className = "css-animation__object";

		$cssAnimationMsg.text("");

	});

	// Grab Sass from button link and insert into code window (.css-animation__code)

	$cssAnimationLabel.on( "click", function() {

		$cssAnimationObject.addClass($(this).attr("data-animation-id"));
		$cssAnimationCodeTarget.load($(this).attr("href"));
  		$cssAnimationList.find(".css-animation__label").removeClass(activeClass);
  		$(this).addClass(activeClass);

		// Update URL

		history.pushState(null, null, "#" + $(this).attr("data-animation-id"));

		// Copy URL

		let url = document.location.href;

		navigator.clipboard.writeText(url).then(function() {
	
			$cssAnimationMsg.text("Link Copied");

	  	}, function() {
	
			$cssAnimationMsg.text("Copy Error");

	  	});

		return false;

	});

	// There may be some conditions where we want to manipulate our canvas for better viewing.

	var canvas = $cssAnimationCanvas.offset().top;
	var $window = $(window);

	function checkTopPosition() {

		if ($window.scrollTop() >= canvas ) {

			$("body").addClass(activeClass);

		} else {

			$("body").removeClass(activeClass);

		}

  	}

	// Hack to get back button to work. TODO: Revisit.
	
	$(window).on("popstate", function (e) {

		location.reload();
	
	});

  	$window.on("scroll resize", checkTopPosition);
  	$window.trigger("scroll");

})();
