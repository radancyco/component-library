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

    } else if (typeof componentLibraryLanguagePackLoaded !== "undefined") {

      callback();

    } else {

      getComponentLanguagePack.addEventListener("load", callback);

    }

  };

  const initDialog = () => {

    loadLanguagePack("https://services.tmpwebeng.com/component-library/language-pack.js", () => {

      // Display which version is in use via console:

      {% include version.html %}

      // Classes, data attributes, states, and strings.

      const dialogTriggerClass = ".dialog-trigger";
      const dialogDataPlayButton = "data-play-button";
      const dialogTriggerPlayClassName = "dialog-trigger__play";
      const dialogDataLabel = "data-label";
      const dialogDataLabelledby = "data-labelledby";
      const dialogDataCaption = "data-caption";
      const dialogDataDescription = "data-audio-description";
      const dialogDataHeading = "data-enable-heading";
      const dialogDataHasHeading = "data-has-heading";
      const dialogDataHasContent = "data-has-content";
      const dialogDataTranscriptFragment = "data-transcript-fragment";
      const dialogDataTranscriptFetch = "data-transcript-fetch";
      const dialogDataDisableAutoplay = "data-disable-autoplay";
      const dialogDataYoutubeShorts = "data-youtube-shorts";
      const dialogDataDynamicLabel = "data-dynamic-label";
      const dialogDataDynamicAlt = "data-dynamic-alt";
      const dialogDataAriaDialog = "data-aria-dialog";
      const dialogDataFullscreen = "data-fullscreen";
      const dialogDataSrc = "data-src";
      const dialogDataIframeSrc = "data-iframe-src";
      const dialogDataOpenState = "data-open";
      const dialogBackdropClassName = "dialog-backdrop";
      const dialogClassName = "dialog";
      const dialogHeadingClassName = "dialog__heading";
      const dialogHeaderClassName = "dialog__header";
      const dialogControlsClassName = "dialog__controls";
      const dialogControlsBtnClassName = "dialog__controls__btn";
      const dialogControlsCloseClassName = "dialog__controls__btn--close";
      const dialogControlsAudioDescriptionClassName = "dialog__controls__btn--audio-description";
      const dialogControlsTranscriptClassName = "dialog__controls__btn--transcript";
      const dialogContainerClassName = "dialog__container";
      const dialogContainerOpenState = "transcript-open";
      const dialogTranscriptClassName = "dialog__transcript";
      const dialogTranscriptHeadingClassName = "dialog__transcript--hdr";
      const dialogTranscriptContentClassName = "dialog__transcript--content";
      const dialogAssetClassName = "dialog__asset";
      const dialogMediaClassName = "dialog__media";

      // Labels — values come from language-pack.js's labelDialog* page-globals
      // (loaded before this runs; one "// Dialog" var block per locale).

      const dialogCloseLabel = labelDialogClose;
      const dialogAudioDescriptionLabel = labelDialogAudioDescription;
      const dialogTranscriptHeadingLabel = labelDialogTranscriptHeading;
      const dialogTranscriptButtonLabel = labelDialogTranscriptButton;
      const dialogVideoLabel = labelDialogVideo;
      const dialogVideoSuffixLabel = labelDialogVideoSuffix;
      const dialogTranscriptNotFoundLabel = labelDialogTranscriptNotFound;
      const dialogTranscriptFailedLabel = labelDialogTranscriptFailed;
      const dialogContentNotFoundLabel = labelDialogContentNotFound;
      const dialogLoadingContentLabel = labelDialogLoadingContent;
      const dialogContentFailedLabel = labelDialogContentFailed;
      const dialogMissingNameHeadingLabel = labelDialogMissingNameHeading;
      const dialogMissingNameMessageLabel = labelDialogMissingNameMessage;
      const dialogVideoFallbackLabel = labelDialogVideoFallback;
      const dialogIframeFallbackLabel = labelDialogIframeFallback;

      const dialogTriggers = document.querySelectorAll(dialogTriggerClass);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Infers a dialog's type from data-src, checked in order. "fetch" catches
      // anything left carrying a #fragment (a URL + the id of an element within
      // it); anything left over is an "element" id already on the page.

      const dialogTypeDetectors = [

        { type: "youtube", test: src => src.includes("youtube") },
        { type: "vimeo", test: src => src.includes("vimeo") },
        { type: "cloudflare", test: src => src.includes("cloudflarestream") },
        { type: "brightcove", test: src => src.includes("players.brightcove.net") },
        { type: "video", test: src => /\.(mp4|webm|ogv)($|[?#])/i.test(src) },
        { type: "fetch", test: src => src.includes("#") },

      ];

      // Shared by the "video" case and the preload warmer below, so both
      // agree on MIME type per file extension.

      const videoMimeTypes = { mp4: "video/mp4", webm: "video/webm", ogv: "video/ogg" };

      // Counter for a dialog id when there's no label to slugify.

      let dialogInstanceId = 0;

      const detectDialogType = (src) => {

        return dialogTypeDetectors.find(({ test }) => test(src))?.type ?? "element";

      };

      // data-labelledby only counts as an accessible name if it resolves to a
      // real id on the page — a dangling reference is treated as if it were
      // never authored at all.

      const hasResolvableLabelledby = (labelledby) => Boolean(labelledby && document.getElementById(labelledby));

      // Timestamp of the last dialog close — see the click handler below for
      // why. Works around a Chrome/Firefox bug, not our markup:
      // https://issues.chromium.org/issues/425579196 (Chrome fix slated v154;
      // Firefox: https://github.com/mdn/browser-compat-data/issues/30474, no
      // fix date yet). Goes dormant once both ship — safe to leave in place.

      let dialogLastClosedAt = 0;

      const destroyDialog = (dialog) => {

        // Escape/light-dismiss fire "cancel" first, which calls this directly,
        // then dialog.close() fires "close", calling this again — this guard
        // makes the second call a no-op. command="close" only ever fires
        // "close", so it never double-hits in the first place.

        if (dialog.dialogDestroyed) return;

        dialog.dialogDestroyed = true;
        dialogLastClosedAt = Date.now();

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

        // Restore body scroll — native dialogs don't lock it themselves
        // (unlike focus/inertness, free via top-layer), so we set/restore
        // it ourselves for both paths.

        document.body.style.overflow = dialog.dialogPreviousBodyOverflow;

        if (dialog.dialogClassic) {

          // Classic (non-native) fallback teardown: undo everything openClassicDialog
          // set up, since there's no native close() to do it for us.

          document.removeEventListener("keydown", dialog.dialogKeydownHandler);

          dialog.dialogInertedSiblings?.forEach(el => el.removeAttribute("inert"));

          dialog.dialogBackdrop?.remove();

          dialog.removeAttribute(dialogDataOpenState);

          dialog.dialogTriggerElement?.focus();

        } else {

          dialog.close();

        }

        // Wait for the close transition before removing the element, or it's
        // torn out before the browser can animate it. A timeout backs up
        // transitionend, since discrete transitions (display/overlay) can
        // fail to fire it.

        let removed = false;

        const finalizeRemoval = () => {

          if (removed) return;

          removed = true;

          // Reset iframe src to stop YouTube/Vimeo — held off until now (not
          // done eagerly above) so the frame fades out with the dialog
          // instead of blanking to black immediately.

          dialog.querySelectorAll("iframe").forEach(iframe => {

            iframe.src = "";

          });

          // Restore moved-in source elements only now that the dialog is
          // actually leaving the DOM — any earlier pulls content out during
          // the still-visible close transition.

          dialog.dialogRestoreCallbacks?.forEach(restore => restore());

          dialog.remove();

        };

        dialog.addEventListener("transitionend", finalizeRemoval, { once: true });

        const transitionMs = parseFloat(getComputedStyle(dialog).transitionDuration) * 1000;

        setTimeout(finalizeRemoval, (Number.isFinite(transitionMs) ? transitionMs : 0) + 100);

      };

      // data-aria-dialog fallback: everything showModal() gives free
      // (positioning aside, handled in CSS) that a plain role="dialog" div
      // needs by hand — backdrop, background inertness (also traps focus),
      // scroll lock, Escape, and focus restored to the trigger.

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

      // Moves a hidden source element's children (not the element itself, so
      // its id and any page styling stay behind) into the dialog. Returns a
      // fragment to insert, plus a function that restores the children in place.

      const moveContentIntoDialog = (el) => {

        const children = Array.from(el.childNodes);
        const fragment = document.createDocumentFragment();

        fragment.append(...children);

        return { fragment, restore: () => el.append(...children) };

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

      // EXPERIMENTAL (data-dynamic-label): looks up a YouTube/Vimeo video's
      // real title via oEmbed, for the dialog/heading/alt text when no
      // data-label is authored. Falls back to "Video Player" on failure.

      const fetchDynamicVideoTitle = async (type, src) => {

        try {

          const oembedUrl = type === "youtube"? `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${new URL(src).pathname.split("/").pop()}`)}&format=json`: `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(src)}`;

          const response = await fetch(oembedUrl);

          if (!response.ok) return dialogVideoFallbackLabel;

          const data = await response.json();

          return data.title || dialogVideoFallbackLabel;

        } catch {

          return dialogVideoFallbackLabel;

        }

      };

      // oEmbed has no "is this a Short" field, but a /shorts/ URL query
      // reports true (portrait) dimensions for one — /watch?v= silently
      // reports the wrong (landscape) size for the same video, confirmed by
      // testing both. /shorts/ is safe to use unconditionally (non-Shorts
      // still report correctly). Sets data-youtube-shorts for CSS; fails
      // silently since this is cosmetic.

      const flagYoutubeShorts = async (dialog, src) => {

        try {

          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/shorts/${new URL(src).pathname.split("/").pop()}`)}&format=json`;
          const response = await fetch(oembedUrl);

          if (!response.ok) return;

          const data = await response.json();

          if (data.height > data.width) dialog.setAttribute(dialogDataYoutubeShorts, "");

        } catch {}

      };

      // Fetches a same-domain page and returns the children of the element
      // matching its #fragment id (not the element itself, so its id/styling
      // stay behind). Shared by data-transcript-fetch and a data-src #fragment.

      const fetchRemoteFragment = async (url) => {

        const [path, id] = url.split("#");

        const response = await fetch(path);

        if (!response.ok || !id) return null;

        const html = await response.text();
        const fragmentDoc = new DOMParser().parseFromString(html, "text/html");
        const el = fragmentDoc.getElementById(id);

        return el ? Array.from(el.childNodes, node => document.importNode(node, true)) : null;

      };

      // Give the transcript region a tabindex only when it has no focusable link of its own.

      const applyTranscriptTabindex = (transcriptTarget) => {

        if (transcriptTarget.querySelector("a")) {

          transcriptTarget.removeAttribute("tabindex");

        } else {

          transcriptTarget.setAttribute("tabindex", "0");

        }

      };

      // Loads a transcript (in-page element or fetched fragment) into a
      // target node once — only the source's contents are copied in, not
      // the source element itself.

      const loadTranscriptOnce = (transcriptTarget, { transcriptFragment, transcriptFetch }) => {

        if (transcriptFragment) {

          const transcriptEl = document.getElementById(transcriptFragment);

          if (transcriptEl) {

            transcriptTarget.append(...Array.from(transcriptEl.childNodes, node => node.cloneNode(true)));

          } else {

            console.error(`Dialog transcript element with id "${transcriptFragment}" not found.`);

          }

          applyTranscriptTabindex(transcriptTarget);

          return;

        }

        const placeholder = document.createElement("p");

        placeholder.textContent = dialogLoadingContentLabel;

        transcriptTarget.append(placeholder);

        fetchRemoteFragment(transcriptFetch).then(nodes => {

          if (nodes) {

            placeholder.replaceWith(...nodes);

          } else {

            placeholder.textContent = dialogTranscriptNotFoundLabel;
            console.error(`Dialog transcript URL "${transcriptFetch}" did not resolve to a matching element.`);

          }

          applyTranscriptTabindex(transcriptTarget);

        }).catch(() => {

          placeholder.textContent = dialogTranscriptFailedLabel;
          console.error(`Dialog transcript URL "${transcriptFetch}" failed to load.`);

          applyTranscriptTabindex(transcriptTarget);

        });

      };

      // Wires the audio-description toggle: speech-synthesizes cues, pausing/resuming the video.

      const attachAudioDescription = (video, controls) => {

        const audioDescBtn = document.createElement("button");

        audioDescBtn.setAttribute("aria-label", dialogAudioDescriptionLabel);
        audioDescBtn.className = `${dialogControlsBtnClassName} ${dialogControlsAudioDescriptionClassName}`;
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

      // Builds the full dialog structure (header/controls, transcript panel,
      // asset) — shared by video/youtube/vimeo (hasContent false) and
      // element/iframe/fetch/fallback (hasContent true, no video decoration
      // on the content).

      const buildMediaDialog = (assetContent, { heading, label, labelledby, hasDescription, transcriptFragment, transcriptFetch, classic, hasContent = false, closeLabel = dialogCloseLabel, restoreCallbacks = [] }) => {

        const titleText = label || dialogVideoLabel;
        const baseId = label ? slugify(label) : `dialog-${++dialogInstanceId}`;

        const dialog = document.createElement(classic ? "div" : "dialog");

        dialog.className = dialogClassName;
        dialog.id = baseId;

        if (classic) {

          dialog.setAttribute("role", "dialog");
          dialog.setAttribute("aria-modal", "true");

          // No tabindex here — we never apply focus to the dialog element
          // itself, only to content inside it (the close button, typically).

        } else {

          dialog.setAttribute("closedby", "any");

        }

        let h1;

        if (heading) {

          dialog.setAttribute(dialogDataHasHeading, "");

          h1 = document.createElement("h1");

          h1.id = `hdr-${baseId}`;
          h1.className = dialogHeadingClassName;
          h1.textContent = titleText;

        }

        if (labelledby) {

          dialog.setAttribute("aria-labelledby", labelledby);

        } else if (heading) {

          dialog.setAttribute("aria-labelledby", `hdr-${baseId}`);

        } else {

          dialog.setAttribute("aria-label", titleText);

        }

        const header = document.createElement("div");

        header.className = dialogHeaderClassName;

        const controls = document.createElement("div");

        controls.className = dialogControlsClassName;

        const closeBtn = document.createElement("button");

        closeBtn.setAttribute("aria-label", closeLabel);
        closeBtn.className = `${dialogControlsBtnClassName} ${dialogControlsCloseClassName}`;

        if (classic) {

          closeBtn.addEventListener("click", () => destroyDialog(dialog));

        } else {

          closeBtn.setAttribute("command", "close");
          closeBtn.setAttribute("commandfor", baseId);

          // command="close" drives this rather than a click listener calling
          // destroyDialog directly, so it shares the same close path as
          // Escape/light-dismiss — all three go through the "close" listener below.

        }

        controls.append(closeBtn);

        if (hasDescription && assetContent.tagName === "VIDEO") {

          attachAudioDescription(assetContent, controls);

        }

        const container = document.createElement("div");

        container.className = dialogContainerClassName;

        if (transcriptFragment || transcriptFetch) {

          const transcriptPanel = document.createElement("div");

          transcriptPanel.className = dialogTranscriptClassName;

          const h2 = document.createElement("h2");

          h2.id = `${baseId}--transcript`;
          h2.className = dialogTranscriptHeadingClassName;
          h2.textContent = dialogTranscriptHeadingLabel;

          const transcriptContent = document.createElement("div");

          transcriptContent.id = `${baseId}--transcript-content`;
          transcriptContent.className = dialogTranscriptContentClassName;
          transcriptContent.setAttribute("aria-labelledby", h2.id);
          transcriptContent.setAttribute("role", "region");

          transcriptPanel.append(h2, transcriptContent);
          container.append(transcriptPanel);

          // Loads the transcript now, while the dialog is still hidden,
          // rather than on first toggle — so nothing new happens in the DOM
          // when the user actually opens the panel.

          loadTranscriptOnce(transcriptContent, { transcriptFragment, transcriptFetch });

          const transcriptBtn = document.createElement("button");

          transcriptBtn.setAttribute("aria-label", dialogTranscriptButtonLabel);
          transcriptBtn.className = `${dialogControlsBtnClassName} ${dialogControlsTranscriptClassName}`;
          transcriptBtn.setAttribute("aria-expanded", "false");
          transcriptBtn.setAttribute("aria-controls", transcriptContent.id);

          transcriptBtn.addEventListener("click", () => {

            const isOpen = container.classList.toggle(dialogContainerOpenState);

            transcriptBtn.setAttribute("aria-expanded", String(isOpen));

          });

          controls.append(transcriptBtn);

        }

        if (h1) header.append(h1);

        header.append(controls);

        if (!hasContent) {

          assetContent.classList.add(dialogMediaClassName);

          if (assetContent.tagName === "VIDEO") {

            assetContent.setAttribute("aria-label", `${titleText} ${dialogVideoSuffixLabel}`);

          } else {

            assetContent.title = `${titleText} ${dialogVideoSuffixLabel}`;

          }

        }

        const asset = document.createElement("div");

        asset.className = dialogAssetClassName;
        asset.append(assetContent);

        container.append(asset);

        dialog.append(header, container);

        if (hasContent) dialog.setAttribute(dialogDataHasContent, "");

        dialog.dialogRestoreCallbacks = restoreCallbacks;

        return dialog;

      };

      // Create and show dialog dynamically based on type.

      const openDialog = (type, src, { label, labelledby, dynamicLabel, caption, description, heading, transcriptFragment, transcriptFetch, disableAutoplay, classic, fullscreen } = {}) => {

        const triggerElement = document.activeElement;

        let dialog;

        // A "fetch" type's data-labelledby may reference an id only present
        // in the content being fetched, not yet on this page — trust it
        // as-is rather than delay the dialog's open on the network request;
        // aria-labelledby resolves lazily once the fetch inserts the real element.

        const labelledbyOk = hasResolvableLabelledby(labelledby) || (type === "fetch" && Boolean(labelledby));

        if (!label && !labelledbyOk && !dynamicLabel) {

          // Failsafe: never open a dialog with no accessible name. By now, an
          // in-progress data-dynamic-label lookup has already resolved label
          // — but dynamicLabel is still checked in case that lookup wasn't
          // supported for this type. Only fires when none of data-label,
          // data-labelledby, or data-dynamic-label were authored — a
          // developer mistake, not something an end user can hit.

          const contentNode = document.createElement("p");

          contentNode.textContent = dialogMissingNameMessageLabel;

          dialog = buildMediaDialog(contentNode, { label: dialogMissingNameHeadingLabel, classic, hasContent: true });

        } else switch (type) {

          case "video": {

            const video = document.createElement("video");

            video.controls = true;
            video.crossOrigin = "anonymous";

            const source = document.createElement("source");
            const extension = src.match(/\.(mp4|webm|ogv)($|[?#])/i)?.[1].toLowerCase();

            source.src = src;
            source.type = videoMimeTypes[extension] ?? "video/mp4";

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

            dialog = buildMediaDialog(video, { heading, label, labelledby, hasDescription: Boolean(description), transcriptFragment, transcriptFetch, classic });

            break;

          }

          case "youtube": {

            const iframe = document.createElement("iframe");

            // Some videos (Shorts among others) ignore youtube.com's passive
            // autoplay=1 param and show a "Watch on YouTube" card instead of
            // playing, even though the same video autoplays fine elsewhere.
            // youtube-nocookie.com honors an explicit IFrame API play command
            // where youtube.com doesn't — confirmed by testing both domains
            // identically — so normalize to it and request playback as a
            // command once the player's loaded.

            iframe.src = `https://www.youtube-nocookie.com${new URL(src).pathname}?autohide=1&disablekb=1&cc_load_policy=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1`;
            iframe.allow = "autoplay; fullscreen";

            if (!disableAutoplay) {

              iframe.addEventListener("load", () => {

                iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: "" }), new URL(iframe.src).origin);

              });

            }

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, transcriptFragment, transcriptFetch, classic });

            flagYoutubeShorts(dialog, src);

            break;

          }

          case "vimeo": {

            const iframe = document.createElement("iframe");

            iframe.src = `${src}?autoplay=${disableAutoplay ? 0 : 1}`;
            iframe.allow = "autoplay; fullscreen";
            iframe.allowFullscreen = true;

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, transcriptFragment, transcriptFetch, classic });

            break;

          }

          case "cloudflare": {

            const iframe = document.createElement("iframe");

            // Unlike the YouTube/Vimeo embed URLs above, a Cloudflare Stream src
            // often already carries its own query string (poster, title, etc.),
            // so autoplay has to be joined with "&" rather than assuming "?".

            const separator = src.includes("?") ? "&" : "?";

            iframe.src = `${src}${separator}autoplay=${disableAutoplay ? "false" : "true"}`;
            iframe.allow = "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen";
            iframe.allowFullscreen = true;

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, transcriptFragment, transcriptFetch, classic });

            break;

          }

          case "brightcove": {

            const iframe = document.createElement("iframe");

            // Same reasoning as Cloudflare: join autoplay with "&" if a query
            // string is present. "any" attempts autoplay with sound, falling
            // back to muted only if blocked — the closest match to autoplay
            // elsewhere here.

            const separator = src.includes("?") ? "&" : "?";

            iframe.src = disableAutoplay ? src : `${src}${separator}autoplay=any`;
            iframe.allow = "encrypted-media; autoplay; fullscreen";
            iframe.allowFullscreen = true;

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, transcriptFragment, transcriptFetch, classic });

            break;

          }

          case "iframe": {

            const iframe = document.createElement("iframe");

            iframe.src = src;
            iframe.title = label || dialogIframeFallbackLabel;
            iframe.classList.add(dialogMediaClassName);

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, transcriptFragment, transcriptFetch, classic, hasContent: true });

            break;

          }

          case "fetch": {

            const placeholder = document.createElement("p");

            placeholder.textContent = dialogLoadingContentLabel;

            fetchRemoteFragment(src).then(nodes => {

              if (nodes) {

                placeholder.replaceWith(...nodes);

              } else {

                placeholder.textContent = dialogContentNotFoundLabel;
                console.error(`Dialog content URL "${src}" did not resolve to a matching element.`);

              }

            }).catch(() => {

              placeholder.textContent = dialogContentFailedLabel;
              console.error(`Dialog content URL "${src}" failed to load.`);

            });

            dialog = buildMediaDialog(placeholder, { heading, label, labelledby, transcriptFragment, transcriptFetch, classic, hasContent: true });

            break;

          }

          case "element": {

            const el = document.getElementById(src);
            const restoreCallbacks = [];

            let contentNode;

            if (el) {

              const { fragment, restore } = moveContentIntoDialog(el);

              restoreCallbacks.push(restore);
              contentNode = fragment;

            } else {

              contentNode = document.createElement("p");
              contentNode.textContent = dialogContentNotFoundLabel;

            }

            dialog = buildMediaDialog(contentNode, { heading, label, labelledby, transcriptFragment, transcriptFetch, classic, hasContent: true, restoreCallbacks });

            break;

          }

        }

        if (fullscreen) dialog.setAttribute(dialogDataFullscreen, "");

        if (classic) {

          const focusTarget = dialog.querySelector(`.${dialogControlsCloseClassName}`);

          openClassicDialog(dialog, triggerElement, focusTarget);

        } else {

          dialog.addEventListener("cancel", (e) => {

            e.preventDefault(); // Prevent default to avoid exception in some browsers.

            destroyDialog(dialog);

          });

          dialog.addEventListener("close", () => destroyDialog(dialog));

          document.body.appendChild(dialog);

          // showModal() traps focus and makes the background inert for free,
          // but doesn't lock body scroll — do that ourselves, same as the
          // classic fallback below.

          dialog.dialogPreviousBodyOverflow = document.body.style.overflow;
          document.body.style.overflow = "hidden";

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

          playButton.className = dialogTriggerPlayClassName;
          playButton.setAttribute("aria-hidden", "true");

          trigger.append(playButton);

        }

        // Read trigger configuration from its data attributes.

        let label = trigger.getAttribute(dialogDataLabel);

        const labelledby = trigger.getAttribute(dialogDataLabelledby);
        const caption = trigger.getAttribute(dialogDataCaption);
        const description = trigger.getAttribute(dialogDataDescription);
        const heading = trigger.hasAttribute(dialogDataHeading);
        const transcriptFragment = trigger.getAttribute(dialogDataTranscriptFragment);
        const transcriptFetch = trigger.getAttribute(dialogDataTranscriptFetch);
        const disableAutoplay = trigger.hasAttribute(dialogDataDisableAutoplay) || prefersReducedMotion;
        const dynamicLabel = trigger.hasAttribute(dialogDataDynamicLabel);
        const classic = trigger.hasAttribute(dialogDataAriaDialog);
        const fullscreen = trigger.hasAttribute(dialogDataFullscreen);
        const iframeSrc = trigger.getAttribute(dialogDataIframeSrc);
        const src = iframeSrc ?? trigger.getAttribute(dialogDataSrc);
        const type = iframeSrc ? "iframe" : detectDialogType(src);

        // EXPERIMENTAL (data-dynamic-label): kicks off the oEmbed lookup on
        // load; the click handler waits on this before opening the dialog.

        let dynamicLabelReady = Promise.resolve();

        if (dynamicLabel && (type === "youtube" || type === "vimeo")) {

          dynamicLabelReady = fetchDynamicVideoTitle(type, trigger.getAttribute(dialogDataSrc)).then(title => {

            label = title;

            const img = trigger.querySelector(`img[${dialogDataDynamicAlt}]`);

            if (img) img.alt = `${title} ${dialogVideoSuffixLabel}`;

          });

        }

        // Warn if the trigger has no accessible name and none is coming asynchronously.
        // A "fetch" type's data-labelledby is trusted here too — see openDialog.

        if (!dynamicLabel && !label && !hasResolvableLabelledby(labelledby) && !(type === "fetch" && labelledby)) {

          console.error("Dialog trigger is missing an accessible name. Add data-label, data-labelledby (pointing to an id that exists on the page), or data-dynamic-label.", trigger);

        }

        // Warn if a "video" type trigger has no captions configured.

        if (type === "video" && !caption) {

          console.warn(`Warning: Please ensure that your video ("${trigger.getAttribute(dialogDataSrc)}") has captions available. If there is no spoken dialogue in the video, captions are still required.`, trigger);

        }

        // Warms the network for self-hosted video files on real intent
        // signal, rather than an unconditional rel=preload or waiting for
        // the click. Only "video" — other types are third-party iframe
        // pages. Uses as="fetch" not as="video": Chrome accepts "video" but
        // never actually preloads it (silent no-op) —
        // https://issues.chromium.org/issues/40671675. "fetch" still lands
        // in the same cache a <video> read reuses.

        if (type === "video") {

          let warmed = false;

          const warmVideoPreload = () => {

            if (warmed) return;

            warmed = true;

            const videoSrc = trigger.getAttribute(dialogDataSrc);
            const extension = videoSrc.match(/\.(mp4|webm|ogv)($|[?#])/i)?.[1].toLowerCase();

            const link = document.createElement("link");

            link.rel = "preload";
            link.as = "fetch";
            link.href = videoSrc;
            link.type = videoMimeTypes[extension] ?? "video/mp4";
            link.crossOrigin = "anonymous"; // Must match the <video>'s crossOrigin below, or the cache entry won't be reused.

            document.head.append(link);

          };

          ["pointerenter", "focus", "touchstart"].forEach(evt => trigger.addEventListener(evt, warmVideoPreload, { once: true, passive: true }));

        }

        // Handle trigger click.

        trigger.addEventListener("click", () => {

          // On touch devices, a dismissing tap can both light-dismiss the
          // dialog (closedby="any") AND deliver a synthesized click to this
          // same trigger underneath it, reopening the dialog the same
          // gesture just closed — a known Chrome/Firefox bug (leaks through
          // to whatever's underneath, not just this trigger):
          // https://issues.chromium.org/issues/425579196. Ignoring a click
          // right after close covers the common case; a real second tap is
          // always well outside this window.
          // Note-to-self: remove once browsers fix this.

          if (Date.now() - dialogLastClosedAt < 500) return;

          dynamicLabelReady.then(() => {

            openDialog(type, src, { label, labelledby, dynamicLabel, caption, description, heading, transcriptFragment, transcriptFetch, disableAutoplay, classic, fullscreen });

          });

        });

      });

    });

  };

  initDialog();

})();
