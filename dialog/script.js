/*!

  Radancy Component Library: {{ include.title }}

  Contributor(s):
  Michael "Spell" Spellacy

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

  const initDialog = () => {

    loadLanguagePack("https://services.tmpwebeng.com/component-library/language-pack.js", () => {

      // Display which version is in use via console:

      console.log("%c{{ include.title }}%cv{{ include.version }}", "background: #2d2d2d; color: #fff; padding: 6px 10px; border-radius: 16px 0 0 16px; font-weight: 600;" , "background: #6e00ee; color: #fff; padding: 6px 10px; border-radius: 0 16px 16px 0; font-weight: 600;");

      // Classes, data attributes, states, and strings.

      const dialogTriggerClass = ".dialog";
      const dialogDataPlayButton = "data-play-button";
      const dialogPlayButtonClassName = "dialog__button";
      const dialogDataLabel = "data-dialog-label";
      const dialogDataLabelledby = "data-dialog-labelledby";
      const dialogDataCaption = "data-video-caption";
      const dialogDataDescription = "data-video-description";
      const dialogDataHeading = "data-dialog-heading";
      const dialogDataTranscriptId = "data-video-transcript-id";
      const dialogDataTranscriptUrl = "data-video-transcript-url";
      const dialogDataDisableAutoplay = "data-disable-autoplay";
      const dialogDataDynamicLabel = "data-dynamic-label";
      const dialogDataDynamicAlt = "data-dynamic-alt";
      const dialogDataClassic = "data-dialog-classic";
      const dialogDataSrc = "data-dialog-src";
      const dialogDataOpenState = "data-open";
      const dialogBackdropClassName = "dialog-backdrop";
      const mediaClassName = "media";
      const mediaPrimaryHeadingClassName = "media__primary-heading";
      const mediaHeaderClassName = "media__header";
      const mediaControlsClassName = "media__controls";
      const mediaControlsCloseClassName = "media__controls--close";
      const mediaControlsAudioDescriptionClassName = "media__controls--audio-description";
      const mediaControlsTranscriptClassName = "media__controls--transcript";
      const mediaContainerClassName = "media__container";
      const mediaContainerOpenState = "is-open";
      const mediaTranscriptClassName = "media__transcript";
      const mediaTranscriptHeadingClassName = "media__transcript--hdr";
      const mediaTranscriptContentClassName = "media__transcript--content";
      const mediaAssetClassName = "media__asset";
      const mediaContentClassName = "media__content";
      const mediaVideoClassName = "media__video";
      const dialogTriggers = document.querySelectorAll(dialogTriggerClass);

      // Terms/patterns used to infer a dialog's content type from data-dialog-src,
      // checked in order. Add new entries here as new source types need support —
      // anything that matches none of these is treated as an "element" id.

      const dialogTypeDetectors = [
        { type: "youtube", test: src => src.includes("youtube") },
        { type: "vimeo", test: src => src.includes("vimeo") },
        { type: "video", test: src => /\.(mp4|webm)($|[?#])/i.test(src) },
      ];

      // Running counter used to give a dialog an id when no label is available to slugify.

      let dialogInstanceId = 0;

      const detectDialogType = (src) => {

        return dialogTypeDetectors.find(({ test }) => test(src))?.type ?? "element";

      };

      const destroyDialog = (dialog) => {

        // Pause HTML5 video and reset.

        dialog.querySelectorAll("video").forEach(video => {

          video.pause();
          video.currentTime = 0;

          // Stop any in-progress audio-description narration.

          Array.from(video.textTracks).forEach(track => {

            if (track.kind === "descriptions") {

              track.oncuechange = null;
              track.mode = "disabled";

            }

          });

        });

        window.speechSynthesis?.cancel();

        // Stop YouTube/Vimeo iframes by resetting src.

        dialog.querySelectorAll("iframe").forEach(iframe => {

          iframe.src = "";

        });

        // Return any moved-in source elements to where they came from.

        dialog.dialogRestoreCallbacks?.forEach(restore => restore());

        if (dialog.dialogClassic) {

          // Classic (non-native) fallback teardown: undo everything openClassicDialog
          // set up, since there's no native close() to do it for us.

          document.removeEventListener("keydown", dialog.dialogKeydownHandler);

          dialog.dialogInertedSiblings?.forEach(el => el.removeAttribute("inert"));

          document.body.style.overflow = dialog.dialogPreviousBodyOverflow;

          dialog.dialogBackdrop?.remove();

          dialog.removeAttribute(dialogDataOpenState);

          dialog.dialogTriggerElement?.focus();

        } else {

          dialog.close();

        }

        // Wait for the CSS close transition to finish before removing the element,
        // otherwise it's torn out of the DOM before the browser can animate it out.
        // A timeout backs up transitionend, since discrete-property transitions
        // (display/overlay) can fail to fire it under some interaction sequences.

        let removed = false;

        const finalizeRemoval = () => {

          if (removed) return;

          removed = true;
          dialog.remove();

        };

        dialog.addEventListener("transitionend", finalizeRemoval, { once: true });

        const transitionMs = parseFloat(getComputedStyle(dialog).transitionDuration) * 1000;

        setTimeout(finalizeRemoval, (Number.isFinite(transitionMs) ? transitionMs : 0) + 100);

      };

      // data-dialog-classic fallback: everything <dialog>/showModal() gives us for
      // free (fixed/backdrop positioning aside, handled in CSS) that a plain
      // role="dialog" div needs done by hand — a backdrop element, background
      // inertness (this also traps focus inside, since inert elements can't be
      // focused), scroll lock, Escape support, and focus restored to the trigger.

      const openClassicDialog = (dialog, triggerElement, focusTarget) => {

        const backdrop = document.createElement("div");

        backdrop.className = dialogBackdropClassName;

        document.body.append(backdrop, dialog);

        const invertedSiblings = Array.from(document.body.children).filter(el => el !== dialog && el !== backdrop);

        invertedSiblings.forEach(el => el.setAttribute("inert", ""));

        dialog.dialogClassic = true;
        dialog.dialogBackdrop = backdrop;
        dialog.dialogInertedSiblings = invertedSiblings;
        dialog.dialogTriggerElement = triggerElement;
        dialog.dialogPreviousBodyOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        backdrop.addEventListener("click", () => destroyDialog(dialog));

        dialog.dialogKeydownHandler = (e) => {

          if (e.key === "Escape") destroyDialog(dialog);

        };

        document.addEventListener("keydown", dialog.dialogKeydownHandler);

        dialog.setAttribute(dialogDataOpenState, "");

        (focusTarget || dialog).focus();

      };

      // Move a hidden source element into the dialog; returns a function that restores it in place.

      const moveIntoDialog = (el) => {

        const anchor = document.createComment("");

        el.before(anchor);
        el.hidden = false;

        return () => {

          el.hidden = true;
          anchor.replaceWith(el);

        };

      };

      // Parse a "src, label, srclang, default; src, label, srclang" caption string into track descriptors.

      const parseCaptions = (value) => {

        return value.split(";").map(track => track.trim()).filter(Boolean).map(track => {

          const [trackSrc, trackLabel, srclang, defaultFlag] = track.split(",").map(field => field.trim());

          return { src: trackSrc, label: trackLabel, srclang, default: defaultFlag?.toLowerCase() === "default" };

        });

      };

      // Parse a single "src, label, srclang" description string into a track descriptor.

      const parseDescription = (value) => {

        const [trackSrc, trackLabel, srclang] = value.split(",").map(field => field.trim());

        return { src: trackSrc, label: trackLabel, srclang };

      };

      // Turn heading text into a URL-safe slug for use as an id.

      const slugify = (value) => {

        return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

      };

      // EXPERIMENTAL (data-dynamic-label): look up a YouTube/Vimeo video's real
      // title via its oEmbed endpoint, for use as the dialog/heading/alt text
      // when no data-dialog-label is authored. Falls back to a generic
      // "YouTube Video"/"Vimeo Video" placeholder on any failure.

      const fetchDynamicVideoTitle = async (type, src) => {

        const fallback = type === "youtube" ? "YouTube Video" : "Vimeo Video";

        try {

          const oembedUrl = type === "youtube"
            ? `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${new URL(src).pathname.split("/").pop()}`)}&format=json`
            : `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(src)}`;

          const response = await fetch(oembedUrl);

          if (!response.ok) return fallback;

          const data = await response.json();

          return data.title || fallback;

        } catch {

          return fallback;

        }

      };

      // Fetch a same-domain page and pull in the element matching its #fragment id.

      const fetchTranscriptFragment = async (url) => {

        const [path, id] = url.split("#");

        const response = await fetch(path);

        if (!response.ok || !id) return null;

        const html = await response.text();
        const fragmentDoc = new DOMParser().parseFromString(html, "text/html");
        const el = fragmentDoc.getElementById(id);

        return el ? document.importNode(el, true) : null;

      };

      // Give the transcript region a tabindex only when it has no focusable link of its own.

      const applyTranscriptTabindex = (transcriptTarget) => {

        if (transcriptTarget.querySelector("a")) {

          transcriptTarget.removeAttribute("tabindex");

        } else {

          transcriptTarget.setAttribute("tabindex", "0");

        }

      };

      // Load a transcript (from an in-page element or a fetched fragment) into a target node, once.

      const loadTranscriptOnce = (transcriptTarget, { transcript, transcriptUrl }, restoreCallbacks) => {

        if (transcript) {

          const transcriptEl = document.getElementById(transcript);

          if (transcriptEl) {

            restoreCallbacks.push(moveIntoDialog(transcriptEl));
            transcriptTarget.append(transcriptEl);

          } else {

            console.error(`Dialog transcript element with id "${transcript}" not found.`);

          }

          applyTranscriptTabindex(transcriptTarget);

          return;

        }

        const placeholder = document.createElement("p");

        placeholder.textContent = "Loading transcript…";

        transcriptTarget.append(placeholder);

        fetchTranscriptFragment(transcriptUrl).then(fragment => {

          if (fragment) {

            placeholder.replaceWith(fragment);

          } else {

            placeholder.textContent = "Transcript not found.";
            console.error(`Dialog transcript URL "${transcriptUrl}" did not resolve to a matching element.`);

          }

          applyTranscriptTabindex(transcriptTarget);

        }).catch(() => {

          placeholder.textContent = "Transcript failed to load.";
          console.error(`Dialog transcript URL "${transcriptUrl}" failed to load.`);

          applyTranscriptTabindex(transcriptTarget);

        });

      };

      // Wire up the audio-description toggle button: speech-synthesizes description cues, pausing/resuming the video.

      const attachAudioDescription = (video, controls) => {

        const audioDescBtn = document.createElement("button");

        audioDescBtn.setAttribute("aria-label", "Audio Description");
        audioDescBtn.className = mediaControlsAudioDescriptionClassName;
        audioDescBtn.setAttribute("aria-pressed", "false");

        audioDescBtn.addEventListener("click", () => {

          const descTrack = Array.from(video.textTracks).find(t => t.kind === "descriptions");

          if (!descTrack) return;

          const isPressed = audioDescBtn.getAttribute("aria-pressed") === "true";

          if (!isPressed) {

            audioDescBtn.setAttribute("aria-pressed", "true");

            descTrack.mode = "hidden";

            descTrack.oncuechange = () => {

              const currentCue = descTrack.activeCues[0];

              if (currentCue && !video.paused && !video.seeking) {

                const utterance = new SpeechSynthesisUtterance(currentCue.getCueAsHTML().textContent);

                video.pause();

                utterance.onend = () => {

                  if (video.isConnected) video.play();

                };

                window.speechSynthesis.speak(utterance);

              }

            };

          } else {

            audioDescBtn.setAttribute("aria-pressed", "false");

            descTrack.oncuechange = null;
            descTrack.mode = "disabled";

            window.speechSynthesis.cancel();

            video.play();

          }

        });

        controls.append(audioDescBtn);

      };

      // Build the full "media" dialog structure (header + controls, transcript panel, asset) —
      // shared by video/youtube/vimeo (assetClassName mediaAssetClassName) and element/default
      // (assetClassName mediaContentClassName, no video-specific decoration on the content itself).

      const buildMediaDialog = (assetContent, { heading, label, labelledby, hasDescription, transcript, transcriptUrl, classic, assetClassName = mediaAssetClassName, closeLabel = "Close Video", restoreCallbacks = [] }) => {

        const titleText = label || "Video";
        const baseId = label ? slugify(label) : `dialog-${++dialogInstanceId}`;

        const dialog = document.createElement(classic ? "div" : "dialog");

        dialog.className = mediaClassName;
        dialog.id = baseId;

        if (classic) {

          dialog.setAttribute("role", "dialog");
          dialog.setAttribute("aria-modal", "true");
          dialog.setAttribute("tabindex", "-1");

        } else {

          dialog.setAttribute("closedby", "any");

        }

        let h1;

        if (labelledby) {

          dialog.setAttribute("aria-labelledby", labelledby);

        } else if (heading) {

          dialog.setAttribute("aria-labelledby", `${baseId}-hdr`);

          h1 = document.createElement("h1");

          h1.id = `${baseId}-hdr`;
          h1.className = mediaPrimaryHeadingClassName;
          h1.textContent = titleText;

        } else {

          dialog.setAttribute("aria-label", titleText);

        }

        const header = document.createElement("header");

        header.className = mediaHeaderClassName;

        const controls = document.createElement("div");

        controls.className = mediaControlsClassName;

        const closeBtn = document.createElement("button");

        closeBtn.setAttribute("aria-label", closeLabel);
        closeBtn.className = mediaControlsCloseClassName;

        if (classic) {

          closeBtn.addEventListener("click", () => destroyDialog(dialog));

        } else {

          closeBtn.setAttribute("command", "close");
          closeBtn.setAttribute("commandfor", baseId);

          // closeBtn.addEventListener("click", () => destroyDialog(dialog));

        }

        controls.append(closeBtn);

        if (hasDescription && assetContent.tagName === "VIDEO") {

          attachAudioDescription(assetContent, controls);

        }

        const container = document.createElement("div");

        container.className = mediaContainerClassName;

        if (transcript || transcriptUrl) {

          const transcriptPanel = document.createElement("div");

          transcriptPanel.className = mediaTranscriptClassName;

          const h2 = document.createElement("h2");

          h2.id = `${baseId}--transcript`;
          h2.className = mediaTranscriptHeadingClassName;
          h2.textContent = "Transcript";

          const transcriptContent = document.createElement("div");

          transcriptContent.id = `${baseId}--transcript-content`;
          transcriptContent.className = mediaTranscriptContentClassName;
          transcriptContent.setAttribute("aria-labelledby", h2.id);
          transcriptContent.setAttribute("role", "region");

          transcriptPanel.append(h2, transcriptContent);
          container.append(transcriptPanel);

          const transcriptBtn = document.createElement("button");

          transcriptBtn.setAttribute("aria-label", "Video Transcript");
          transcriptBtn.className = mediaControlsTranscriptClassName;
          transcriptBtn.setAttribute("aria-expanded", "false");
          transcriptBtn.setAttribute("aria-controls", transcriptContent.id);

          let transcriptLoaded = false;

          transcriptBtn.addEventListener("click", () => {

            if (!transcriptLoaded) {

              transcriptLoaded = true;

              loadTranscriptOnce(transcriptContent, { transcript, transcriptUrl }, restoreCallbacks);

            }

            const isOpen = container.classList.toggle(mediaContainerOpenState);

            transcriptBtn.setAttribute("aria-expanded", String(isOpen));

          });

          controls.append(transcriptBtn);

        }

        if (h1) header.append(h1);

        header.append(controls);

        if (assetClassName === mediaAssetClassName) {

          assetContent.classList.add(mediaVideoClassName);

          if (assetContent.tagName === "VIDEO") {

            assetContent.setAttribute("aria-label", titleText);

          } else {

            assetContent.title = `${titleText} (Video)`;

          }

        }

        const asset = document.createElement("div");

        asset.className = assetClassName;
        asset.append(assetContent);

        container.append(asset);

        dialog.append(header, container);

        dialog.dialogRestoreCallbacks = restoreCallbacks;

        return dialog;

      };

      // Create and show dialog dynamically based on type.

      const openDialog = (type, src, { label, labelledby, caption, description, heading, transcript, transcriptUrl, disableAutoplay, classic } = {}) => {

        const triggerElement = document.activeElement;

        let dialog;

        switch (type) {

          case "video": {

            const video = document.createElement("video");

            video.controls = true;
            video.crossOrigin = "anonymous";

            const source = document.createElement("source");

            source.src = src;
            source.type = "video/mp4";

            video.append(source);

            if (caption) {

              parseCaptions(caption).forEach(({ src: trackSrc, label: trackLabel, srclang, default: isDefault }) => {

                const track = document.createElement("track");

                track.kind = "captions";
                track.src = trackSrc;
                track.label = trackLabel;
                track.srclang = srclang;
                track.default = isDefault;

                video.append(track);

              });

            }

            if (description) {

              const { src: trackSrc, label: trackLabel, srclang } = parseDescription(description);

              const track = document.createElement("track");

              track.kind = "descriptions";
              track.src = trackSrc;
              track.label = trackLabel;
              track.srclang = srclang;

              video.append(track);

            }

            dialog = buildMediaDialog(video, { heading, label, labelledby, hasDescription: Boolean(description), transcript, transcriptUrl, classic });

            break;

          }

          case "youtube": {

            const iframe = document.createElement("iframe");

            iframe.src = `${src}?autoplay=${disableAutoplay ? 0 : 1}&autohide=1&disablekb=1&cc_load_policy=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1`;
            iframe.allow = "autoplay; fullscreen";

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, transcript, transcriptUrl, classic });

            break;

          }

          case "vimeo": {

            const iframe = document.createElement("iframe");

            iframe.src = `${src}?autoplay=${disableAutoplay ? 0 : 1}`;
            iframe.allow = "autoplay; fullscreen";
            iframe.allowFullscreen = true;

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, transcript, transcriptUrl, classic });

            break;

          }

          case "element": {

            const el = document.getElementById(src);
            const restoreCallbacks = [];

            let contentNode;

            if (el) {

              restoreCallbacks.push(moveIntoDialog(el));
              contentNode = el;

            } else {

              contentNode = document.createElement("p");
              contentNode.textContent = "Content not found.";

            }

            dialog = buildMediaDialog(contentNode, { heading, label, labelledby, transcript, transcriptUrl, classic, assetClassName: mediaContentClassName, closeLabel: "Close", restoreCallbacks });

            break;

          }

          default: {

            const contentNode = document.createElement("p");

            contentNode.textContent = "Unsupported content type.";

            dialog = buildMediaDialog(contentNode, { heading, label, labelledby, classic, assetClassName: mediaContentClassName, closeLabel: "Close" });

          }

        }

        if (classic) {

          const focusTarget = dialog.querySelector(`.${mediaControlsCloseClassName}`);

          openClassicDialog(dialog, triggerElement, focusTarget);

        } else {

          dialog.addEventListener("cancel", (e) => {

            e.preventDefault(); // Prevent default to avoid exception in some browsers.

            destroyDialog(dialog);

          });

          dialog.addEventListener("close", () => destroyDialog(dialog));

          document.body.appendChild(dialog);

          dialog.showModal();

        }

        if (type === "video" && !disableAutoplay) dialog.querySelector("video")?.play();

      };

      // Loop through and set up all dialog triggers on the page.

      dialogTriggers.forEach(trigger => {

        trigger.setAttribute("aria-haspopup", "dialog");

        // Add play-button indicator, if requested.

        if (trigger.hasAttribute(dialogDataPlayButton)) {

          const playButton = document.createElement("span");

          playButton.className = dialogPlayButtonClassName;
          playButton.setAttribute("aria-hidden", "true");

          trigger.append(playButton);

        }

        // Read trigger configuration from its data attributes.

        let label = trigger.getAttribute(dialogDataLabel);

        const labelledby = trigger.getAttribute(dialogDataLabelledby);
        const caption = trigger.getAttribute(dialogDataCaption);
        const description = trigger.getAttribute(dialogDataDescription);
        const heading = trigger.hasAttribute(dialogDataHeading);
        const transcript = trigger.getAttribute(dialogDataTranscriptId);
        const transcriptUrl = trigger.getAttribute(dialogDataTranscriptUrl);
        const disableAutoplay = trigger.hasAttribute(dialogDataDisableAutoplay);
        const dynamicLabel = trigger.hasAttribute(dialogDataDynamicLabel);
        const classic = trigger.hasAttribute(dialogDataClassic);
        const type = detectDialogType(trigger.getAttribute(dialogDataSrc));

        // EXPERIMENTAL (data-dynamic-label): kick off the oEmbed title lookup on page
        // load; the trigger's click handler waits on this before opening the dialog.

        let dynamicLabelReady = Promise.resolve();

        if (dynamicLabel && (type === "youtube" || type === "vimeo")) {

          dynamicLabelReady = fetchDynamicVideoTitle(type, trigger.getAttribute(dialogDataSrc)).then(title => {

            label = title;

            const img = trigger.querySelector(`img[${dialogDataDynamicAlt}]`);

            if (img) img.alt = `${title} (Video)`;

          });

        }

        // Warn if the trigger has no accessible name and none is coming asynchronously.

        if (!dynamicLabel && !label && !labelledby) {

          console.error("Dialog trigger is missing an accessible name. Add data-dialog-label or data-dialog-labelledby.", trigger);

        }

        // Handle trigger click.

        trigger.addEventListener("click", () => {

          dynamicLabelReady.then(() => {

            openDialog(type, trigger.getAttribute(dialogDataSrc), { label, labelledby, caption, description, heading, transcript, transcriptUrl, disableAutoplay, classic });

          });

        });

      });

    });

  };

  initDialog();

})();
