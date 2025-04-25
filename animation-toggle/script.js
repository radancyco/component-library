/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

  Dependencies: None

*/

(() => {

  "use strict";

  const loadLanguagePack = (url, callback) => {

    // Install Language Pack.

    const getComponentLanguagePack = document.getElementById("component-library-language-pack");

    if (!getComponentLanguagePack) {

      const componentLanguagePack = document.createElement("script");

      componentLanguagePack.setAttribute("src", url);
      componentLanguagePack.setAttribute("id", "component-library-language-pack");
      componentLanguagePack.addEventListener("load", callback);

      document.head.appendChild(componentLanguagePack);

    } else {

      getComponentLanguagePack.addEventListener("load", callback);

    }

  };

  const initAnimationToggle = () => {

    loadLanguagePack("https://services.tmpwebeng.com/component-library/language-pack.js", () => {

      // Display which component in use via console:

      console.log("%c {{ include.title }} v{{ include.version }} in use. ", "background: #6e00ee; color: #fff");

      // Animation variables

      const animationBody = document.body;
      const atAudioDescriptionClassName = "animation-toggle__audio";
      const atClass = ".animation-toggle";
      const atCallback = document.querySelectorAll(`${atClass}[data-callback]`);
      const atCookieName = "AnimationPaused";
      const atDescriptionTrackClass = ".animation-toggle__track";
      const atEnabledClassName = "animation-enabled";
      const atPauseButtonClassName = "animation-toggle__pause";
      const atPauseButtonClass = `.${atPauseButtonClassName}`;
      const atVideoClass = ".animation-toggle__video";
      const atVideoControlsName = "animation-toggle__controls";
      const dataAudioDescriptionButton = "data-audio-description-button";
      const dataAutoplayDisable = "data-autoplay-disable";
      const dataDecorative = "data-decorative";
      const dataLoop = "data-loop";
      const dataPauseButton = "data-pause-button";
      const dataPoster = "data-poster";
      const getAnimationWrappers = document.querySelectorAll(atClass);
      const getBackgroundVideos = document.querySelectorAll(atVideoClass);

      // Language

      const atAudioDescriptionLabel = window.atAudioDescriptionLabel;
      const atPauseButtonLabel = window.atPauseButtonLabel;
      const atVideoLabel = window.atVideoLabel;

      // Used to retrieve cookie and pause video(s) if present.

      const getCookie = name => {

        const match = document.cookie.match(RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
        return match ? match[1] : null;

      };

      // Assign cookie to variable on page load.

      let animationPaused = getCookie(atCookieName);

      // Used to set and remove cookie.

      const setCookie = state => {

        document.cookie = `${atCookieName}=${state}; SameSite=None; Secure; path=/`;

      };

      // If animation disabled in OS settings and cookie is not present then force pause.

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

        if(animationPaused === null) {

          setCookie("true");

          animationPaused = getCookie(atCookieName);

        }

      }

      // For each animation wrapper...

      getAnimationWrappers.forEach(wrapper => {

        // Create control wrapper.

        const btnControls = document.createElement("div");

        btnControls.setAttribute("class", atVideoControlsName);

        // Prepend control wrapper to atClass.

        wrapper.prepend(btnControls);

        // Create pause button

        const btnPlayPause = document.createElement("button");

        // See if wrapper contains custom pause button value; use over default if true.

        btnPlayPause.setAttribute("aria-label", wrapper.hasAttribute(dataPauseButton) ? wrapper.getAttribute(dataPauseButton) : atPauseButtonLabel);

        // Add class to pause button.

        btnPlayPause.classList.add(atPauseButtonClassName);

        // Check to see if cookie is false or null.

        if(animationPaused === "false" || animationPaused === null) {

          btnPlayPause.setAttribute("aria-pressed", "false");

          animationBody.classList.add(atEnabledClassName);

        } else {

          btnPlayPause.setAttribute("aria-pressed", "true");

          animationBody.classList.remove(atEnabledClassName);

        }

        // Append pause button.

        btnControls.append(btnPlayPause);

        // Pause Toggle Event.

        btnPlayPause.addEventListener("click", function() {

          const getAtPauseButtonClass = document.querySelectorAll(atPauseButtonClass);
          const animationPauseToggles = getAtPauseButtonClass;

          if (this.getAttribute("aria-pressed") === "false") {

            animationBody.classList.remove(atEnabledClassName);

            setCookie("true");

            animationPauseToggles.forEach(button => {

              button.setAttribute("aria-pressed", "true");

            });

          } else {

            animationBody.classList.add(atEnabledClassName);

            setCookie("false");

            animationPauseToggles.forEach(button => {

              button.setAttribute("aria-pressed", "false");

            });

          }

          getBackgroundVideos.forEach(video => {

            if(!video.closest(atClass).querySelector(atPauseButtonClass).hasAttribute("disabled")) {

              const isPaused = video.closest(atClass).querySelector(atPauseButtonClass).getAttribute("aria-pressed");

              if(isPaused === "false") {

                video.play();

              } else {

                video.pause();

              }

            }

          });

          if(this.closest(atClass).hasAttribute("data-callback")) {

            const thisButton = this;
            const callBackFunction = this.closest(atClass).getAttribute("data-callback");

            customCallback(thisButton, callBackFunction);

          }

        });

        if (wrapper.querySelector("track") !== null) {

          const btnAudioDescription = document.createElement("button");

          btnAudioDescription.setAttribute("aria-label", wrapper.hasAttribute(dataAudioDescriptionButton) ? wrapper.getAttribute(dataAudioDescriptionButton) : atAudioDescriptionLabel);
          btnAudioDescription.setAttribute("aria-pressed", "false");
          btnAudioDescription.setAttribute("class", atAudioDescriptionClassName);

          btnControls.append(btnAudioDescription);

          btnAudioDescription.addEventListener("click", function () {

            const thisVideo = wrapper.querySelector(atVideoClass);
            const thisDescription = wrapper.querySelector(atDescriptionTrackClass);

            thisDescription.classList.toggle("active");

            const isPressed = this.getAttribute("aria-pressed") === "true";
            const track = thisVideo.textTracks ? thisVideo.textTracks[0] : null;

            if (!isPressed) {

              this.setAttribute("aria-pressed", "true");

              if (track) {

                track.mode = "hidden";

                track.oncuechange = function () {

                  const currentCue = this.activeCues[0];

                  if (currentCue) {

                    thisDescription.innerText = "";
                    thisDescription.appendChild(currentCue.getCueAsHTML());

                    const Message = thisDescription.textContent;
                    const msg = new SpeechSynthesisUtterance(Message);

                    window.speechSynthesis.speak(msg);

                  }

                };

              }

            } else {

              this.setAttribute("aria-pressed", "false");

              if (track) {

                track.oncuechange = null;

              }

              thisDescription.innerText = "";

              window.speechSynthesis.cancel();

            }

          });

        }

      });

      getBackgroundVideos.forEach((video, e) => {

        video.setAttribute("crossorigin", "anonymous")
        video.setAttribute("disableRemotePlayback", "");
        video.setAttribute("disablePictureInPicture", "");
        video.id = `animation-toggle-video-${e + 1}`;
        video.setAttribute("playsinline" , "");
        video.muted = true;

        video.load();

        if (animationBody.classList.contains(atEnabledClassName)) {

          if(!video.hasAttribute(dataAutoplayDisable)) {

            video.onloadeddata = () => {

              const playPromise = video.play();

              if (playPromise !== undefined) {

                playPromise.then(() => {

                  // Automatic playback started!

                }).catch(error => {

                  console.error('Playback error:', error);

                });

              }

            }

          }

        } else {

          if(video.hasAttribute(dataPoster)) {

            video.currentTime = video.getAttribute(dataPoster);

          }

        }

        if(video.hasAttribute(dataLoop)) {

          let iterations = 1;

          video.addEventListener("ended", () => {

            if (iterations < video.getAttribute(dataLoop)) {       

              video.currentTime = 0;
              video.play();
              iterations ++;

            } else {

              const toggleButton = video.closest(atClass).querySelector(atPauseButtonClass);

              if(toggleButton) {

                toggleButton.setAttribute("disabled", "");

              }

            }

          }, false);

        } else {

          video.setAttribute("loop" , "");

        }

        if(!video.hasAttribute("aria-label")) {

          video.setAttribute("aria-label", atVideoLabel);

        }

        if(video.hasAttribute(dataDecorative)) {

          video.setAttribute("aria-hidden", "true");
          video.setAttribute("tabindex", "-1");
          video.removeAttribute("aria-label");

        }

      });

      const customCallback = (thisButton, customCallBackName) => {

        if (customCallBackName !== null) {

          window[customCallBackName](thisButton);

        }

      };

      atCallback.forEach(callback => {

        const thisButton = callback.querySelector(atPauseButtonClass);
        const callBackFunction = callback.dataset.callback;

        customCallback(thisButton, callBackFunction);

      });

    });

  };

  initAnimationToggle();

})();

