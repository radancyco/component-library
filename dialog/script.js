
let dialogInstanceId = 0;

// Generic dialog wrapper used for the "element" and "default" content types

const createDialog = (contentNode, { label, labelledby } = {}) => {

  const dialog = document.createElement("dialog");

  if (labelledby) {

    dialog.setAttribute("aria-labelledby", labelledby);

  } else if (label) {

    dialog.setAttribute("aria-label", label);

  } else {

    dialog.setAttribute("aria-label", "Content Viewer");

  }

  dialog.setAttribute("closedby", "any");

  const closeBtn = document.createElement("button");

  closeBtn.autofocus = true;
  closeBtn.className = "close-btn";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "X";

  closeBtn.addEventListener("click", () => destroyDialog(dialog));

  const contentWrapper = document.createElement("div");

  contentWrapper.className = "dialog-content";
  contentWrapper.append(contentNode);

  dialog.append(closeBtn, contentWrapper);

  return dialog;

};

const destroyDialog = (dialog) => {

  // Pause HTML5 video and reset

  dialog.querySelectorAll("video").forEach(video => {

    video.pause();
    video.currentTime = 0;

    // Stop any in-progress audio-description narration

    Array.from(video.textTracks).forEach(track => {

      if (track.kind === "descriptions") {

        track.oncuechange = null;
        track.mode = "disabled";

      }

    });

  });

  window.speechSynthesis?.cancel();

  // Stop YouTube/Vimeo iframes by resetting src

  dialog.querySelectorAll("iframe").forEach(iframe => {

    iframe.src = "";

  });

  // Return any moved-in source elements to where they came from

  dialog.dialogRestoreCallbacks?.forEach(restore => restore());

  dialog.close();

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

// Move a hidden source element into the dialog; returns a function that restores it in place

const moveIntoDialog = (el) => {

  const anchor = document.createComment("");

  el.before(anchor);
  el.hidden = false;

  return () => {

    el.hidden = true;
    anchor.replaceWith(el);

  };

};

// Parse a "src, label, srclang, default; src, label, srclang" caption string into track descriptors

const parseCaptions = (value) => {

  return value.split(";").map(track => track.trim()).filter(Boolean).map(track => {

    const [trackSrc, trackLabel, srclang, defaultFlag] = track.split(",").map(field => field.trim());

    return { src: trackSrc, label: trackLabel, srclang, default: defaultFlag?.toLowerCase() === "default" };

  });

};

// Parse a single "src, label, srclang" description string into a track descriptor

const parseDescription = (value) => {

  const [trackSrc, trackLabel, srclang] = value.split(",").map(field => field.trim());

  return { src: trackSrc, label: trackLabel, srclang };

};

// Turn heading text into a URL-safe slug for use as an id

const slugify = (value) => {

  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

};

// Fetch a same-domain page and pull in the element matching its #fragment id

const fetchTranscriptFragment = async (url) => {

  const [path, id] = url.split("#");

  const response = await fetch(path);

  if (!response.ok || !id) return null;

  const html = await response.text();
  const fragmentDoc = new DOMParser().parseFromString(html, "text/html");
  const el = fragmentDoc.getElementById(id);

  return el ? document.importNode(el, true) : null;

};

// Give the transcript region a tabindex only when it has no focusable link of its own

const applyTranscriptTabindex = (transcriptTarget) => {

  if (transcriptTarget.querySelector("a")) {

    transcriptTarget.removeAttribute("tabindex");

  } else {

    transcriptTarget.setAttribute("tabindex", "0");

  }

};

// Load a transcript (from an in-page element or a fetched fragment) into a target node, once

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

// Wire up the audio-description toggle button: speech-synthesizes description cues, pausing/resuming the video

const attachAudioDescription = (video, controls) => {

  const audioDescBtn = document.createElement("button");

  audioDescBtn.setAttribute("aria-label", "Audio Description");
  audioDescBtn.className = "media__controls--audio-description";
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

// Build the full "media" dialog structure (header + controls, transcript panel, asset) for video/youtube/vimeo

const buildMediaDialog = (media, { heading, label, hasDescription, transcript, transcriptUrl }) => {

  const restoreCallbacks = [];
  const titleText = label || "Video";
  const baseId = label ? slugify(label) : `dialog-${++dialogInstanceId}`;

  const dialog = document.createElement("dialog");

  dialog.className = "media";
  dialog.id = baseId;
  dialog.setAttribute("closedby", "any");

  let h1;

  if (heading) {

    dialog.setAttribute("aria-labelledby", `${baseId}-hdr`);

    h1 = document.createElement("h1");

    h1.id = `${baseId}-hdr`;
    h1.className = "media__primary-heading";
    h1.textContent = titleText;

  } else {

    dialog.setAttribute("aria-label", titleText);

  }

  const header = document.createElement("header");

  header.className = "media__header";

  const controls = document.createElement("div");

  controls.className = "media__controls";

  const closeBtn = document.createElement("button");

  closeBtn.setAttribute("aria-label", "Close Video");
  closeBtn.className = "media__controls--close";
  closeBtn.setAttribute("command", "close");
  closeBtn.setAttribute("commandfor", baseId);

  // closeBtn.addEventListener("click", () => destroyDialog(dialog));

  controls.append(closeBtn);

  if (hasDescription && media.tagName === "VIDEO") {

    attachAudioDescription(media, controls);

  }

  const container = document.createElement("div");

  container.className = "media__container";

  if (transcript || transcriptUrl) {

    const transcriptPanel = document.createElement("div");

    transcriptPanel.className = "media__transcript";

    const h2 = document.createElement("h2");

    h2.id = `${baseId}--transcript`;
    h2.className = "media__transcript--hdr";
    h2.textContent = "Transcript";

    const transcriptContent = document.createElement("div");

    transcriptContent.id = `${baseId}--transcript-content`;
    transcriptContent.className = "media__transcript--content";
    transcriptContent.setAttribute("aria-labelledby", h2.id);
    transcriptContent.setAttribute("role", "region");

    transcriptPanel.append(h2, transcriptContent);
    container.append(transcriptPanel);

    const transcriptBtn = document.createElement("button");

    transcriptBtn.setAttribute("aria-label", "Video Transcript");
    transcriptBtn.className = "media__controls--transcript";
    transcriptBtn.setAttribute("aria-expanded", "false");
    transcriptBtn.setAttribute("aria-controls", transcriptContent.id);

    let transcriptLoaded = false;

    transcriptBtn.addEventListener("click", () => {

      if (!transcriptLoaded) {

        transcriptLoaded = true;

        loadTranscriptOnce(transcriptContent, { transcript, transcriptUrl }, restoreCallbacks);

      }

      const isOpen = container.classList.toggle("is-open");

      transcriptBtn.setAttribute("aria-expanded", String(isOpen));

    });

    controls.append(transcriptBtn);

  }

  if (h1) header.append(h1);

  header.append(controls);

  media.classList.add("media__video");

  if (media.tagName === "VIDEO") {

    media.setAttribute("aria-label", titleText);

  } else {

    media.title = titleText;

  }

  const asset = document.createElement("div");

  asset.className = "media__asset";
  asset.append(media);

  container.append(asset);

  dialog.append(header, container);

  dialog.dialogRestoreCallbacks = restoreCallbacks;

  return dialog;

};

// Create and show dialog dynamically based on type

const openDialog = (type, src, { label, labelledby, caption, description, heading, transcript, transcriptUrl, disableAutoplay } = {}) => {

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

      dialog = buildMediaDialog(video, { heading, label, hasDescription: Boolean(description), transcript, transcriptUrl });

      break;

    }

    case "youtube": {

      const iframe = document.createElement("iframe");

      iframe.src = `${src}?autoplay=${disableAutoplay ? 0 : 1}&autohide=1&disablekb=1&cc_load_policy=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1`;
      iframe.allow = "autoplay; fullscreen";

      dialog = buildMediaDialog(iframe, { heading, label, transcript, transcriptUrl });

      break;

    }

    case "vimeo": {

      const iframe = document.createElement("iframe");

      iframe.src = `${src}?autoplay=${disableAutoplay ? 0 : 1}`;
      iframe.allow = "autoplay; fullscreen";
      iframe.allowFullscreen = true;

      dialog = buildMediaDialog(iframe, { heading, label, transcript, transcriptUrl });

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

      dialog = createDialog(contentNode, { label, labelledby });
      dialog.dialogRestoreCallbacks = restoreCallbacks;

      break;

    }

    default: {

      const contentNode = document.createElement("p");

      contentNode.textContent = "Unsupported content type.";

      dialog = createDialog(contentNode, { label, labelledby });

    }

  }

  dialog.addEventListener("cancel", (e) => {

    e.preventDefault(); // Prevent default to avoid exception in some browsers

    destroyDialog(dialog);

  });

  dialog.addEventListener("close", () => destroyDialog(dialog));

  document.body.appendChild(dialog);

  dialog.showModal();

  if (type === "video" && !disableAutoplay) dialog.querySelector("video")?.play();

};

// Attach to triggers

document.querySelectorAll(".dialog").forEach(trigger => {

  trigger.setAttribute("aria-haspopup", "dialog");

  const label = trigger.dataset.dialogLabel;
  const labelledby = trigger.dataset.dialogLabelledby;
  const caption = trigger.dataset.videoCaption;
  const description = trigger.dataset.videoDescription;
  const heading = trigger.hasAttribute("data-dialog-heading");
  const transcript = trigger.dataset.videoTranscriptId;
  const transcriptUrl = trigger.dataset.videoTranscriptUrl;
  const disableAutoplay = trigger.hasAttribute("data-disable-autoplay");

  if (!label && !labelledby) {

    console.error("Dialog trigger is missing an accessible name. Add data-dialog-label or data-dialog-labelledby.", trigger);

  }

  trigger.addEventListener("click", () => {

    openDialog(trigger.dataset.dialogType, trigger.dataset.dialogSrc, { label, labelledby, caption, description, heading, transcript, transcriptUrl, disableAutoplay });

  });

});
