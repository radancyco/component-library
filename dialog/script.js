// Helper to build the dialog HTML dynamically
const createDialog = (content) => {
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-label', 'Content Viewer');
  dialog.setAttribute("closedby", "any");
  dialog.innerHTML = `
    <button class="close-btn" aria-label="Close">&times;</button>
    <div class="fancybox-content">${content}</div>
  `;
  document.body.appendChild(dialog);
  return dialog;
};

// Helper to stop media and remove dialog
const destroyDialog = (dialog) => {
  // Pause HTML5 video and reset
  dialog.querySelectorAll('video').forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
  // Stop YouTube/Vimeo iframes by resetting src
  dialog.querySelectorAll('iframe').forEach(iframe => {
    iframe.src = '';
  });
  dialog.close();
  dialog.remove();
};

// Create and show dialog dynamically based on type
const openFancybox = (type, src) => {
  let content = '';
  switch (type) {
    case 'video':
      content = `
        <video controls autoplay>
          <source src="${src}" type="video/mp4">
        </video>`;
      break;
    case 'youtube':
      content = `<iframe src="${src}?autoplay=1&autohide=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1" allow="autoplay; fullscreen"></iframe>`;
      break;
    case 'vimeo':
      content = `<iframe src="${src}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      break;
    case 'element':
      const el = document.querySelector(src);
      if (el) content = el.innerHTML;
      break;
    default:
      content = `<p>Unsupported content type.</p>`;
  }

  const dialog = createDialog(content);

  // Handle closing via button or ESC
  const closeBtn = dialog.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => destroyDialog(dialog));
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault(); // Prevent default to avoid exception in some browsers
    destroyDialog(dialog);
  });
  dialog.addEventListener('close', () => destroyDialog(dialog));

  dialog.showModal();
};

// Attach to triggers
document.querySelectorAll('[data-fancybox-content]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    openFancybox(trigger.dataset.fancyboxContent, trigger.dataset.src);
  });
});
