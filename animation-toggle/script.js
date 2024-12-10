/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

  Dependencies: None

*/

(function() {

  "use strict";

  function loadLanguagePack(url, callback) {

    // Install Language Pack.

    var getComponentLanguagePack = document.getElementById("component-library-language-pack");

    if (!getComponentLanguagePack) {

      var componentLanguagePack = document.createElement("script");

      componentLanguagePack.setAttribute("src", url);
      componentLanguagePack.setAttribute("id", "component-library-language-pack");
      componentLanguagePack.addEventListener("load", callback);

      document.head.appendChild(componentLanguagePack);

    } else {

      getComponentLanguagePack.addEventListener("load", callback);

    }

  }

  function initAnimationToggle() {

    loadLanguagePack("https://services.tmpwebeng.com/component-library/language-pack.js", function(){

    // Display which component in use via console:

    console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

    // Animation variables

    var animationBody = document.body;
    var atAudioDescriptionClassName = "animation-toggle__audio";
    var atClass = ".animation-toggle";
    var atCallback = document.querySelectorAll(atClass + "[data-callback]");
    var atCookieName = "AnimationPaused";
    var atDescriptionTrackClass = ".animation-toggle__track";
    var atEnabledClassName = "animation-enabled";
    var atPauseButtonClassName = "animation-toggle__pause";
    var atPauseButtonClass = "." + atPauseButtonClassName;
    var atVideoClass = ".animation-toggle__video";
    var atVideoControlsName = "animation-toggle__controls";
    var dataAudioDescriptionButton = "data-audio-description-button";
    var dataAutoplayDisable = "data-autoplay-disable";
    var dataDecorative = "data-decorative";
    var dataLoop = "data-loop";
    var dataPauseButton = "data-pause-button";
    var dataPoster = "data-poster";
    var getAnimationWrappers = document.querySelectorAll(atClass);
    var getBackgroundVideos = document.querySelectorAll(atVideoClass);

    // Language

    var atAudioDescriptionLabel = window.atAudioDescriptionLabel;
    var atPauseButtonLabel = window.atPauseButtonLabel;
    var atVideoLabel = window.atVideoLabel;

    // Used to retrieve cookie and pause video(s) if present.

    function getCookie(name) {

      var match = document.cookie.match(RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
      return match ? match[1] : null;

    }

    // Assign cookie to variable on page load.

    var animationPaused = getCookie(atCookieName);

    // Used to set and remove cookie.

    function setCookie(state) {

      document.cookie = atCookieName + "=" + state + "; SameSite=None; Secure; path=/";

    }

    // If animation disabled in OS settings and cookie is not present then force pause.

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

      if(animationPaused === null) {

        setCookie("true");

        var animationPaused = getCookie(atCookieName);

      }

    }

    // For each animation wrapper...

    getAnimationWrappers.forEach(function(wrapper){

      // Create control wrapper.

      var btnControls = document.createElement("div");

      btnControls.setAttribute("class", atVideoControlsName);

      // Prepend control wrapper to atClass.

      wrapper.prepend(btnControls);

      // Create pause button

      var btnPlayPause = document.createElement("button");

      // See if wrapper contains custom pause button value; use over default if true.

      if(wrapper.hasAttribute(dataPauseButton)) {

        btnPlayPause.setAttribute("aria-label", wrapper.getAttribute(dataPauseButton));

      } else {

        btnPlayPause.setAttribute("aria-label", atPauseButtonLabel);

      }

      // Add class to pause button.

      btnPlayPause.classList.add(atPauseButtonClassName);

      // Check to see if cookie is false or null.

      if(animationPaused === "false" || animationPaused === null) {

        // Set aria-pressed to false.

        btnPlayPause.setAttribute("aria-pressed", "false");

        // Remove animation enabled class from body.

        animationBody.classList.add(atEnabledClassName);

      } else {

        // Set aria-pressed to true.

        btnPlayPause.setAttribute("aria-pressed", "true");

        // Add animation enabled class to body.

        animationBody.classList.remove(atEnabledClassName);

      }

      // Append pause button.

      btnControls.append(btnPlayPause);

      // Pause Toggle Event.

      btnPlayPause.addEventListener("click", function() {

        var getAtPauseButtonClass = document.querySelectorAll(atPauseButtonClass);
        var animationPauseToggles = getAtPauseButtonClass;

        if (this.getAttribute("aria-pressed") === "false") {

          // Remove animation enabled class from body.

          animationBody.classList.remove(atEnabledClassName);

          // Set cookie to true.

          setCookie("true");

          // Get all pause buttons on page and set them to true.

          animationPauseToggles.forEach(function(button){

            button.setAttribute("aria-pressed", "true");

          });

        } else {

          // Add animation enabled class to body.

          animationBody.classList.add(atEnabledClassName);

          // Set cookie to false.

          setCookie("false");

          // Get all pause buttons on page and set them to false.

          animationPauseToggles.forEach(function(button){

            button.setAttribute("aria-pressed", "false");

          });

        }

        // Toggle Video Playback

        getBackgroundVideos.forEach(function(video){

          if(!video.closest(atClass).querySelector(atPauseButtonClass).hasAttribute("disabled")) {

            var isPaused = video.closest(atClass).querySelector(atPauseButtonClass).getAttribute("aria-pressed");

            if(isPaused === "false") {

              video.play();

            } else {

              video.pause();

            }

          }

        });

        if(this.closest(atClass).hasAttribute("data-callback")) {

          var thisButton = this;
          var callBackFunction = this.closest(atClass).getAttribute("data-callback");

          customCallback(thisButton, callBackFunction);

        }

      });

      if (wrapper.querySelector("track") !== null) {

        // Create audio description button. Please note this is an experimental feature.

        var btnAudioDescription = document.createElement("button");

        btnAudioDescription.setAttribute("aria-label", atAudioDescriptionLabel);
        btnAudioDescription.setAttribute("aria-pressed", "false");
        btnAudioDescription.setAttribute("class", atAudioDescriptionClassName);

        // See if wrapper contains custom audio description button value; use over default if true.

        if(wrapper.hasAttribute(dataAudioDescriptionButton)) {

          btnAudioDescription.setAttribute("aria-label", wrapper.getAttribute(dataAudioDescriptionButton));

        } else {

          btnAudioDescription.setAttribute("aria-label", atAudioDescriptionLabel);

        }

        // Append Audio Description Button.

        btnControls.append(btnAudioDescription);

        // Audio Description Toggle Event

        // TODO: Look into this further at https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/SpeechSynthesisUtterance

        btnAudioDescription.addEventListener("click", function() {

          var thisVideo = wrapper.querySelector(atVideoClass);
          var thisDescription = wrapper.querySelector(atDescriptionTrackClass);

          thisDescription.classList.toggle("active");

          if (this.getAttribute("aria-pressed") === "false") {

            this.setAttribute("aria-pressed", "true");

            if (thisVideo.textTracks) {

              var track = thisVideo.textTracks[0];

              track.mode = "hidden";
              track.oncuechange = function() {

                var currentCue = this.activeCues[0];

                console.log(currentCue);

                if (currentCue) {

                  thisDescription.innerText = "";
                  thisDescription.appendChild(currentCue.getCueAsHTML());

                  var Message = thisDescription.textContent;
                  var msg = new SpeechSynthesisUtterance(Message);

                  window.speechSynthesis.speak(msg);

                }

              }

            }

          } else {

            this.setAttribute("aria-pressed", "false");

            // HACK: Need to figure out a way to disable or stop cue. Currently looping through cue and sending nothing to div. Grr.

            if (thisVideo.textTracks) {

              var track = thisVideo.textTracks[0];

              track.mode = "hidden";
              track.oncuechange = function() {

                var currentCue = this.activeCues[0];

                console.log(currentCue);

                if (currentCue) {
    
                  thisDescription.innerText = "";

                }

              }

            }

            window.speechSynthesis.cancel();

          }

        });

      }

    });

    // Loop through each video...

    getBackgroundVideos.forEach(function(video, e){

      // Add initial attributes.

      video.setAttribute("crossorigin", "anonymous")
      video.setAttribute("disableRemotePlayback", "");
      video.setAttribute("disablePictureInPicture", "");
      video.id = "animation-toggle-video-" + (e + 1);
      video.setAttribute("playsinline" , "");
      video.muted = true;

      // Some browsers require videos to be loaded before they can play, especially iOS in low power mode, where videos may appear blank if not preloaded.

      video.load();

      // If animation class on body exists...

      if (animationBody.classList.contains(atEnabledClassName)) {

        // Play video.

        if(!video.hasAttribute(dataAutoplayDisable)) {

          video.onloadeddata = function() {

            var playPromise = video.play();
        
            if (playPromise !== undefined) {

              playPromise.then(function() {
              
              // Automatic playback started!
              // Show playing UI.
              
              }).catch(function(error) {
              
                // Auto-play was prevented
                // Show paused UI.

                console.error('Playback error:', error);
            
              });
          
            }

          }
        
        }

      } else {

        // If video has poster...

        if(video.hasAttribute(dataPoster)) {

          video.currentTime = video.getAttribute(dataPoster);

        }

      }

      if(video.hasAttribute(dataLoop)) {

        var iterations = 1;

        video.addEventListener("ended", function () {

          // Number of times to loop video.

          if (iterations < video.getAttribute(dataLoop)) {       

            video.currentTime = 0;
            video.play();
            iterations ++;

          } else {

            // See if toggle button exists. If so, disable it when loop completes.

            var toggleButton = video.closest(atClass).querySelector(atPauseButtonClass);

            if(toggleButton) {

              toggleButton.setAttribute("disabled", "");

            }

          }

        }, false);

      } else {

        video.setAttribute("loop" , "");

      }

      // If aria-label does not exist on video element, add default. 

      if(!video.hasAttribute("aria-label")) {

        video.setAttribute("aria-label", atVideoLabel);

      }

      // If video is decorative 

      if(video.hasAttribute(dataDecorative)) {

        video.setAttribute("aria-hidden", "true");
        video.setAttribute("tabindex", "-1");
        video.removeAttribute("aria-label");

      }

    });

    // Callback Function

    function customCallback(thisButton, customCallBackName) {

      if (customCallBackName !== null) {

        window[customCallBackName](thisButton);

      }

    }

    // Initiate Callback on page load.

    atCallback.forEach(function(callback){

      var thisButton = callback.querySelector(atPauseButtonClass);
      var callBackFunction = callback.dataset.callback;

      customCallback(thisButton, callBackFunction);

    });

    });

  }

  initAnimationToggle();

})();

