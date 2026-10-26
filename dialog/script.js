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
      const dialogDataAriaDescription = "data-description";
      const dialogDataCaption = "data-caption";
      const dialogDataDescription = "data-audio-description";
      const dialogDataHeading = "data-enable-heading";
      const dialogDataHasHeading = "data-has-heading";
      const dialogDataHasContent = "data-has-content";
      const dialogDataHasIframe = "data-has-iframe";
      const dialogDataTranscriptFragment = "data-transcript-fragment";
      const dialogDataTranscriptFetch = "data-transcript-fetch";
      const dialogDataDisableAutoplay = "data-disable-autoplay";
      const dialogDataPoster = "data-poster";
      const dialogDataClass = "data-class";
      const dialogDataYoutubeShorts = "data-youtube-shorts";
      const dialogDataDynamicLabel = "data-dynamic-label";
      const dialogDataDynamicAlt = "data-dynamic-alt";
      const dialogDataAriaDialog = "data-aria-dialog";
      const dialogDataFullscreen = "data-fullscreen";
      const dialogDataInitialFocus = "data-initial-focus";
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
      const dialogTranscriptHeadingClassName = "dialog__transcript-heading";
      const dialogTranscriptContentClassName = "dialog__transcript-content";
      const dialogAssetClassName = "dialog__asset";
      const dialogMediaClassName = "dialog__media";

      // Labels come from language-pack.js's labelDialog* page-globals (loaded before this runs, one block per locale).

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

      // Infers a dialog's type from data-src, in order. "fetch" matches anything with a #fragment; anything else is an "element" id already on the page.

      const dialogTypeDetectors = [

        { type: "youtube", test: src => src.includes("youtube") },
        { type: "vimeo", test: src => src.includes("vimeo") },
        { type: "cloudflare", test: src => src.includes("cloudflarestream") },
        { type: "brightcove", test: src => src.includes("players.brightcove.net") },
        { type: "video", test: src => /\.(mp4|webm|ogv)($|[?#])/i.test(src) },
        { type: "fetch", test: src => src.includes("#") },

      ];

      // Shared by the "video" case and the preload warmer below, so both agree on MIME type per file extension.

      const videoMimeTypes = { mp4: "video/mp4", webm: "video/webm", ogv: "video/ogg" };

      // Counter for a dialog id when there's no label to slugify.

      let dialogInstanceId = 0;

      const detectDialogType = (src) => {

        return dialogTypeDetectors.find(({ test }) => test(src))?.type ?? "element";

      };

      // data-labelledby only counts as an accessible name if it resolves to a real id on the page; a dangling reference is treated as never authored.

      const hasResolvableLabelledby = (labelledby) => Boolean(labelledby && document.getElementById(labelledby));

      // Timestamp of the last dialog close, used by the click handler below. Works around a Chrome/Firefox bug, not our markup: https://issues.chromium.org/issues/425579196
      // and https://github.com/mdn/browser-compat-data/issues/30474. Safe to leave; dormant once both ship.

      let dialogLastClosedAt = 0;

      const destroyDialog = (dialog) => {

        // Escape/light-dismiss fires "cancel" first (calling this directly), then dialog.close() fires "close" (calling this again); this guard makes the
        // second call a no-op. command="close" only ever fires "close" once.

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

        // Restore body scroll. Native dialogs don't lock it themselves (unlike focus/inertness, free via top-layer), so we set/restore it ourselves.

        document.body.style.overflow = dialog.dialogPreviousBodyOverflow;

        if (dialog.dialogClassic) {

          // Classic (non-native) teardown: undo everything openClassicDialog set up (no native close() to do it for us).

          document.removeEventListener("keydown", dialog.dialogKeydownHandler);

          dialog.dialogInertedSiblings?.forEach(el => el.removeAttribute("inert"));

          dialog.dialogBackdrop?.remove();

          dialog.removeAttribute(dialogDataOpenState);

          dialog.dialogTriggerElement?.focus();

        } else {

          dialog.close();

        }

        // Wait for the close transition before removing the element, or it's torn out before the browser can animate it. A timeout backs up transitionend,
        // since discrete transitions (display/overlay) can fail to fire it.

        let removed = false;

        const finalizeRemoval = () => {

          if (removed) return;

          removed = true;

          // Reset iframe src to stop YouTube/Vimeo. Held off until now so the frame fades out with the dialog instead of blanking to black.

          dialog.querySelectorAll("iframe").forEach(iframe => {

            iframe.src = "";

          });

          // Restore moved-in source elements only once the dialog leaves the DOM; doing it earlier would pull content out mid-transition.

          dialog.dialogRestoreCallbacks?.forEach(restore => restore());

          dialog.remove();

        };

        dialog.addEventListener("transitionend", finalizeRemoval, { once: true });

        const transitionMs = parseFloat(getComputedStyle(dialog).transitionDuration) * 1000;

        setTimeout(finalizeRemoval, (Number.isFinite(transitionMs) ? transitionMs : 0) + 100);

      };

      // data-aria-dialog fallback: everything showModal() gives for free (positioning aside, handled in CSS), a plain role="dialog" div needs by
      // hand: backdrop, inertness (traps focus), scroll lock, Escape, focus return.

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

      // Moves a hidden source element's children (not the element itself, so its id/styling stay behind) into the dialog. Returns a fragment plus a restore function.

      const moveContentIntoDialog = (el) => {

        const children = Array.from(el.childNodes);
        const fragment = document.createDocumentFragment();

        fragment.append(...children);

        return { fragment, restore: () => el.append(...children) };

      };

      // Reads label/srclang/default off a track URL's own query string, for setups where only a single src can be authored, e.g. "video.vtt?label=English&srclang=en&default".
      // "default" is presence-only, like every other boolean attribute here. Returns the src with these three keys stripped so they don't leak into the VTT request.

      const parseTrackUrlMetadata = (src) => {

        const url = new URL(src);
        const params = url.searchParams;

        const label = params.get("label") ?? undefined;
        const srclang = params.get("srclang") ?? undefined;
        const isDefault = params.has("default");

        params.delete("label");
        params.delete("srclang");
        params.delete("default");

        return { src: url.toString(), label, srclang, isDefault };

      };

      // Parses a "src, label, srclang, default; ..." caption string into track descriptors, or a bare src URL carrying that metadata as query params.

      const parseCaptions = (value) => {

        return value.split(";").map(track => track.trim()).filter(Boolean).map(track => {

          let [trackSrc, trackLabel, srclang, defaultFlag] = track.split(",").map(field => field.trim());
          let isDefault = defaultFlag?.toLowerCase() === "default";

          if (trackLabel === undefined) ({ src: trackSrc, label: trackLabel, srclang, isDefault } = parseTrackUrlMetadata(trackSrc));

          return { src: trackSrc, label: trackLabel, srclang, default: isDefault };

        });

      };

      // Parses a single "src, label, srclang" description string into a track descriptor, or a bare src URL carrying that metadata as query params.

      const parseDescription = (value) => {

        let [trackSrc, trackLabel, srclang] = value.split(",").map(field => field.trim());

        if (trackLabel === undefined) ({ src: trackSrc, label: trackLabel, srclang } = parseTrackUrlMetadata(trackSrc));

        return { src: trackSrc, label: trackLabel, srclang };

      };

      // Turn heading text into a URL-safe slug for use as an id.

      const slugify = (value) => {

        return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

      };

      // EXPERIMENTAL (data-dynamic-label): looks up a YouTube/Vimeo title via oEmbed for the dialog/heading/alt text when no data-label is authored; falls back to "Video Player".

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

      // oEmbed has no "is this a Short" field, but a /shorts/ URL reports true (portrait) dimensions, while /watch?v= reports the wrong (landscape) size
      // for the same video. /shorts/ is safe to use unconditionally (non-Shorts still report correctly). Sets data-youtube-shorts for CSS; fails silently.

      const flagYoutubeShorts = async (dialog, src) => {

        try {

          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/shorts/${new URL(src).pathname.split("/").pop()}`)}&format=json`;
          const response = await fetch(oembedUrl);

          if (!response.ok) return;

          const data = await response.json();

          if (data.height > data.width) dialog.setAttribute(dialogDataYoutubeShorts, "");

        } catch {}

      };

      // Fetches a same-domain page and returns the children of the element matching its #fragment id. Shared by data-transcript-fetch and a data-src #fragment.

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

      // Loads a transcript (in-page element or fetched fragment) into a target node once; only the source's contents are copied, not the element itself.

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

      // Builds the full dialog structure (header/controls, transcript panel, asset), shared by video/youtube/vimeo (hasContent false) and element/iframe/fetch/fallback (hasContent true).

      const buildMediaDialog = (assetContent, { heading, label, labelledby, ariaDescription, hasDescription, transcriptFragment, transcriptFetch, classic, hasContent = false, hasIframe = false, closeLabel = dialogCloseLabel, customClass, restoreCallbacks = [] }) => {

        const titleText = label || dialogVideoLabel;
        const baseId = label ? slugify(label) : `dialog-${++dialogInstanceId}`;

        const dialog = document.createElement(classic ? "div" : "dialog");

        dialog.className = dialogClassName;
        dialog.id = baseId;

        if (customClass) dialog.classList.add(...customClass.split(/\s+/));

        if (classic) {

          dialog.setAttribute("role", "dialog");
          dialog.setAttribute("aria-modal", "true");

          // No tabindex here: we never focus the dialog itself, only content inside it (the close button, typically).

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

          // command="close" drives this (not a click listener), so it shares the same close path as Escape/light-dismiss, via the "close" listener below.

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

          // Loads the transcript now, while hidden, rather than on first toggle, so nothing new happens in the DOM when the user opens the panel.

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

        // Only one dialog is ever open at a time, so a fixed id is fine here. Set via textContent (never innerHTML) since this is author-supplied text.

        if (ariaDescription) {

          const descriptionEl = document.createElement("div");

          descriptionEl.id = "dialog-description";
          descriptionEl.hidden = true;
          descriptionEl.textContent = ariaDescription;

          dialog.append(descriptionEl);

          dialog.setAttribute("aria-describedby", descriptionEl.id);

        }

        if (hasContent) dialog.setAttribute(dialogDataHasContent, "");
        if (hasIframe) dialog.setAttribute(dialogDataHasIframe, "");

        dialog.dialogRestoreCallbacks = restoreCallbacks;

        return dialog;

      };

      // Create and show dialog dynamically based on type.

      const openDialog = (type, src, { label, labelledby, ariaDescription, dynamicLabel, caption, description, heading, transcriptFragment, transcriptFetch, disableAutoplay, poster, customClass, classic, fullscreen, initialFocus } = {}) => {

        const triggerElement = document.activeElement;

        let dialog;

        // A "fetch" type's data-labelledby may reference an id not yet on the page; trust it as-is, aria-labelledby resolves once the fetch inserts the element.

        const labelledbyOk = hasResolvableLabelledby(labelledby) || (type === "fetch" && Boolean(labelledby));

        if (!label && !labelledbyOk && !dynamicLabel) {

          // Failsafe: never open a dialog with no accessible name. An in-progress data-dynamic-label lookup may have resolved label already; dynamicLabel
          // is still checked for types that lookup doesn't support. Only fires when none of data-label/labelledby/dynamic-label were authored: a dev mistake.

          const headingId = `hdr-${slugify(dialogMissingNameHeadingLabel)}`;

          const heading = document.createElement("h1");

          heading.id = headingId;
          heading.textContent = dialogMissingNameHeadingLabel;

          const message = document.createElement("p");

          message.textContent = dialogMissingNameMessageLabel;

          const contentNode = document.createDocumentFragment();

          contentNode.append(heading, message);

          dialog = buildMediaDialog(contentNode, { label: dialogMissingNameHeadingLabel, labelledby: headingId, ariaDescription, classic, hasContent: true, customClass });

        } else switch (type) {

          case "video": {

            const video = document.createElement("video");

            video.controls = true;
            video.crossOrigin = "anonymous";

            if (poster) video.poster = poster;

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

            dialog = buildMediaDialog(video, { heading, label, labelledby, ariaDescription, hasDescription: Boolean(description), transcriptFragment, transcriptFetch, classic, customClass });

            break;

          }

          case "youtube": {

            const iframe = document.createElement("iframe");

            // Some videos (Shorts among others) ignore youtube.com's passive autoplay=1 and show a "Watch on YouTube" card instead of playing, even though the
            // same video autoplays fine elsewhere. youtube-nocookie.com honors an explicit IFrame API play command where youtube.com doesn't, so normalize
            // to it and request playback once the player's loaded.

            iframe.src = `https://www.youtube-nocookie.com${new URL(src).pathname}?autohide=1&cc_load_policy=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1`;
            iframe.allow = "autoplay; fullscreen";

            if (!disableAutoplay) {

              iframe.addEventListener("load", () => {

                iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: "" }), new URL(iframe.src).origin);

              });

            }

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, ariaDescription, transcriptFragment, transcriptFetch, classic, customClass });

            flagYoutubeShorts(dialog, src);

            break;

          }

          case "vimeo": {

            const iframe = document.createElement("iframe");
            const vimeoSrc = new URL(src);

            // An inline autoplay param (already in data-src) wins; only set ours if the author didn't specify one.

            if (!vimeoSrc.searchParams.has("autoplay")) vimeoSrc.searchParams.set("autoplay", disableAutoplay ? "0" : "1");

            iframe.src = vimeoSrc.toString();
            iframe.allow = "autoplay; fullscreen";
            iframe.allowFullscreen = true;

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, ariaDescription, transcriptFragment, transcriptFetch, classic, customClass });

            break;

          }

          case "cloudflare": {

            const iframe = document.createElement("iframe");

            // Unlike YouTube/Vimeo above, a Cloudflare Stream src often already has a query string, so autoplay must be joined with "&" rather than "?".

            const separator = src.includes("?") ? "&" : "?";

            iframe.src = `${src}${separator}autoplay=${disableAutoplay ? "false" : "true"}`;
            iframe.allow = "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen";
            iframe.allowFullscreen = true;

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, ariaDescription, transcriptFragment, transcriptFetch, classic, customClass });

            break;

          }

          case "brightcove": {

            const iframe = document.createElement("iframe");

            // Same reasoning as Cloudflare. "any" attempts autoplay with sound, falling back to muted only if blocked; the closest match available here.

            const separator = src.includes("?") ? "&" : "?";

            iframe.src = disableAutoplay ? src : `${src}${separator}autoplay=any`;
            iframe.allow = "encrypted-media; autoplay; fullscreen";
            iframe.allowFullscreen = true;

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, ariaDescription, transcriptFragment, transcriptFetch, classic, customClass });

            break;

          }

          case "iframe": {

            const iframe = document.createElement("iframe");

            iframe.src = src;
            iframe.title = label || dialogIframeFallbackLabel;
            iframe.classList.add(dialogMediaClassName);

            dialog = buildMediaDialog(iframe, { heading, label, labelledby, ariaDescription, transcriptFragment, transcriptFetch, classic, hasIframe: true, customClass });

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

            dialog = buildMediaDialog(placeholder, { heading, label, labelledby, ariaDescription, transcriptFragment, transcriptFetch, classic, hasContent: true, customClass });

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

            dialog = buildMediaDialog(contentNode, { heading, label, labelledby, ariaDescription, transcriptFragment, transcriptFetch, classic, hasContent: true, customClass, restoreCallbacks });

            break;

          }

        }

        if (fullscreen) dialog.setAttribute(dialogDataFullscreen, "");

        // data-initial-focus overrides the default close-button focus with any CSS selector, resolved against the dialog's own contents. Falls back to the
        // default (close button for classic, native showModal() default otherwise) when absent, invalid, or not matching anything inside the dialog.

        let initialFocusTarget = null;

        if (initialFocus) {

          try {

            initialFocusTarget = dialog.querySelector(initialFocus);

            if (!initialFocusTarget) console.error(`Dialog data-initial-focus selector "${initialFocus}" did not match any element in the dialog.`);

          } catch {

            console.error(`Dialog data-initial-focus selector "${initialFocus}" is not a valid CSS selector.`);

          }

        }

        if (classic) {

          const focusTarget = initialFocusTarget || dialog.querySelector(`.${dialogControlsCloseClassName}`);

          openClassicDialog(dialog, triggerElement, focusTarget);

        } else {

          dialog.addEventListener("cancel", (e) => {

            e.preventDefault(); // Prevent default to avoid exception in some browsers.

            destroyDialog(dialog);

          });

          dialog.addEventListener("close", () => destroyDialog(dialog));

          document.body.appendChild(dialog);

          // showModal() traps focus and makes the background inert for free, but doesn't lock body scroll; do that ourselves, same as the classic fallback.

          dialog.dialogPreviousBodyOverflow = document.body.style.overflow;
          document.body.style.overflow = "hidden";

          dialog.showModal();

          initialFocusTarget?.focus();

        }

        if (type === "video" && !disableAutoplay) dialog.querySelector("video")?.play();

      };

      // Loop through and set up all dialog triggers on the page.

      dialogTriggers.forEach(trigger => {

        trigger.setAttribute("aria-haspopup", "dialog");

        // href only works on <a> triggers (data-src works on every other trigger, typically <button>). <a> triggers also need role="button" plus manual
        // Enter/Space handling, since only native <button> gets that for free.

        const isAnchor = trigger.tagName === "A";

        if (isAnchor) {

          trigger.setAttribute("role", "button");

          if (trigger.hasAttribute(dialogDataSrc)) {

            console.error("data-src is not supported on <a> dialog triggers; use href instead.", trigger);

          }

        } else if (trigger.hasAttribute("href")) {

          console.error("href is not supported on this dialog trigger; use data-src instead (href is only supported on <a> triggers).", trigger);

        }

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
        const ariaDescription = trigger.getAttribute(dialogDataAriaDescription);
        const caption = trigger.getAttribute(dialogDataCaption);
        let description = trigger.getAttribute(dialogDataDescription);
        const heading = trigger.hasAttribute(dialogDataHeading);
        const transcriptFragment = trigger.getAttribute(dialogDataTranscriptFragment);
        let transcriptFetch = trigger.getAttribute(dialogDataTranscriptFetch);
        const disableAutoplay = trigger.hasAttribute(dialogDataDisableAutoplay) || prefersReducedMotion;
        const poster = trigger.getAttribute(dialogDataPoster);
        const customClass = trigger.getAttribute(dialogDataClass);
        const dynamicLabel = trigger.hasAttribute(dialogDataDynamicLabel);
        const classic = trigger.hasAttribute(dialogDataAriaDialog);
        const fullscreen = trigger.hasAttribute(dialogDataFullscreen);
        const initialFocus = trigger.getAttribute(dialogDataInitialFocus);
        const iframeSrc = trigger.getAttribute(dialogDataIframeSrc);
        const rawSrc = iframeSrc ?? (isAnchor ? trigger.getAttribute("href") : trigger.getAttribute(dialogDataSrc));

        // Defensive against CMS/template double-encoding query ampersands as &amp;. A literal &amp; is never valid otherwise, so this is safe to correct.

        let src = rawSrc?.replace(/&amp;/g, "&") ?? rawSrc;
        const type = iframeSrc ? "iframe" : detectDialogType(src);

        // Alternative to data-transcript-fetch/data-audio-description, for self-hosted video: both can be folded into data-src's own query string (transcript, src,
        // label, srclang), with fragment standing in for a literal #fragment (avoids %23-encoding). An explicit attribute always wins; this is only a fallback,
        // and recognized keys are stripped from src before the actual video request.

        if (type === "video") {

          const videoSrcUrl = new URL(src);
          const videoSrcParams = videoSrcUrl.searchParams;

          if (!transcriptFetch && videoSrcParams.has("transcript")) {

            const path = videoSrcParams.get("transcript");
            const fragment = videoSrcParams.get("fragment");

            transcriptFetch = fragment ? `${path}#${fragment}` : path;

          }

          if (!description && videoSrcParams.has("src")) {

            description = [videoSrcParams.get("src"), videoSrcParams.get("label"), videoSrcParams.get("srclang")].filter(v => v != null).join(", ");

          }

          ["transcript", "fragment", "src", "label", "srclang"].forEach(key => videoSrcParams.delete(key));

          src = videoSrcUrl.toString();

        }

        // EXPERIMENTAL (data-dynamic-label): kicks off the oEmbed lookup on load; the click handler waits on this before opening the dialog.

        let dynamicLabelReady = Promise.resolve();

        if (dynamicLabel && (type === "youtube" || type === "vimeo")) {

          dynamicLabelReady = fetchDynamicVideoTitle(type, src).then(title => {

            label = title;

            const img = trigger.querySelector(`img[${dialogDataDynamicAlt}]`);

            if (img) img.alt = `${title} ${dialogVideoSuffixLabel}`;

          });

        }

        // Warn if no accessible name is set and none is coming async; a "fetch" type's data-labelledby is trusted here too (see openDialog).

        if (!dynamicLabel && !label && !hasResolvableLabelledby(labelledby) && !(type === "fetch" && labelledby)) {

          console.error("Dialog trigger is missing an accessible name. Add data-label, data-labelledby (pointing to an id that exists on the page), or data-dynamic-label.", trigger);

        }

        // Warn if a "video" type trigger has no captions configured.

        if (type === "video" && !caption) {

          console.warn(`Warning: Please ensure that your video ("${src}") has captions available. If there is no spoken dialogue in the video, captions are still required.`, trigger);

        }

        // Warms the network for self-hosted video on real intent signal, rather than an unconditional rel=preload or waiting for the click. Only "video"; other
        // types are third-party iframe pages. A plain fetch (not <link rel=preload>) warms the same cache entry without the Preload API ever tracking it,
        // so it never trips Chrome's "preloaded but not used" warning, even once the video is genuinely opened and played right after.

        if (type === "video") {

          let warmed = false;

          const warmVideoPreload = () => {

            if (warmed) return;

            warmed = true;

            // mode/credentials must match the <video>'s crossOrigin="anonymous" below, or the cache entry won't be reused.

            fetch(src, { mode: "cors", credentials: "omit" }).catch(() => {});

          };

          ["pointerenter", "focus", "touchstart"].forEach(evt => trigger.addEventListener(evt, warmVideoPreload, { once: true, passive: true }));

        }

        // Handle trigger click. Native Enter on <a> already fires a real click; preventDefault stops it from following href.

        trigger.addEventListener("click", (e) => {

          if (isAnchor) e.preventDefault();

          // On touch devices, a dismissing tap can both light-dismiss the dialog (closedby="any") and deliver a synthesized click to the same trigger,
          // reopening it. A known Chrome/Firefox bug (leaks through to whatever's underneath): https://issues.chromium.org/issues/425579196. Ignoring a
          // click right after close covers it; a real second tap is always well outside this window. Remove once browsers fix this.

          if (Date.now() - dialogLastClosedAt < 500) return;

          dynamicLabelReady.then(() => {

            openDialog(type, src, { label, labelledby, ariaDescription, dynamicLabel, caption, description, heading, transcriptFragment, transcriptFetch, disableAutoplay, poster, customClass, classic, fullscreen, initialFocus });

          });

        });

        // role="button" gets Enter for free (an <a> already fires a native click on Enter), but not Space; wire that up per the ARIA APG button pattern.

        if (isAnchor) {

          trigger.addEventListener("keydown", (e) => {

            if (e.key !== " ") return;

            e.preventDefault();
            trigger.click();

          });

        }

      });

    });

  };

  initDialog();

})();
