/*!

  Radancy Component Library: Spatial Navigator

  Contributor(s):
  Michael "Spell" Spellacy

*/

(() => {

  "use strict";

  // Timing, thresholds, and grid dimensions.

  const baseClass = "spatial-navigation";
  const readyDelayMs = 250;
  const dragThresholdPx = 10;
  const snapAccelThreshold = 100;
  const moveAccelThreshold = 1;
  const dragFriction = 0.985;
  const touchDragSpeed = 5;
  const mouseDragSpeed = 10;
  const resizeDebounceMs = 150;
  const gridCols = 3;
  const gridRows = 4;
  const landingCol = 1;
  const landingRow = 1;

  // Classes, selectors, ids, and data attributes this component reads or
  // writes, in one place. baseClass-derived rather than per-instance —
  // there's exactly one instantiation site in this file
  // (new BusinessAreas(baseClass)), so this is fixed in practice already.

  const businessAreasItemClassName = `${baseClass}__item`;
  const businessAreasItemActiveClassName = `${baseClass}__item--active`;
  const businessAreasNavClassName = `${baseClass}__nav`;
  const businessAreasNavItemClassName = `${baseClass}__nav__button`;
  const businessAreasNavItemMutedClassName = `${baseClass}__nav__button--disabled`;
  const businessAreasMouseDownClassName = `${baseClass}--mouse-down`;

  const businessAreasClass = `.${baseClass}`;
  const businessAreasOverflowClass = `.${baseClass}__overflow`;
  const businessAreasOverflowInnerClass = `.${baseClass}__overflow__inner`;
  const businessAreasItemClass = `.${businessAreasItemClassName}`;
  const businessAreasItemActiveClass = `.${businessAreasItemActiveClassName}`;
  const businessAreasNavItemClass = `.${businessAreasNavItemClassName}`;
  const businessAreasItemPreviewTitleClass = `.${baseClass}__item__preview__title`;
  const businessAreasItemPreviewCtaClass = `.${baseClass}__item__preview__cta`;
  const businessAreasItemTileClass = `.${baseClass}__item__tile`;
  const openDialogSelector = "dialog[open]";

  // Fixed element/aria-target ids — straight from the markup's own ids, not
  // derived from baseClass.

  const businessAreasNavLabelId = "spatial-navigation-nav-label";
  const businessAreasGridStatusId = "spatial-navigation-grid-status";
  const businessAreasGridStatusSelector = `#${businessAreasGridStatusId}`;

  // data-* attributes this component reads.

  const businessAreasDataKey = "data-spatial-navigation-key";
  const businessAreasDataGridCol = "data-grid-col";
  const businessAreasDataGridRow = "data-grid-row";

  // Single source of truth for the four directional nav buttons — used for
  // mouse-click movement, arrow-key movement, and edge-muting, instead of
  // three separate north/south/west/east branch chains. className is
  // precomputed once here rather than re-templated at every call site.

  const navDirections = [

    { suffix: "north", dx: 0, dy: 1, key: "ArrowUp", label: "Move Up In Grid", isMuted: (col, row, cols, rows) => row <= 0 },
    { suffix: "east", dx: -1, dy: 0, key: "ArrowRight", label: "Move Right In Grid", isMuted: (col, row, cols, rows) => col >= cols - 1 },
    { suffix: "south", dx: 0, dy: -1, key: "ArrowDown", label: "Move Down In Grid", isMuted: (col, row, cols, rows) => row >= rows - 1 },
    { suffix: "west", dx: 1, dy: 0, key: "ArrowLeft", label: "Move Left in Grid", isMuted: (col, row, cols, rows) => col <= 0 }

  ].map((direction) => ({ ...direction, className: `${businessAreasNavItemClassName}--${direction.suffix}` }));
  
  let gridInstance;

  // Loads the sitewide component-library language pack once, then runs the
  // callback. Shared across every component on a page, so the script tag
  // (and its "load" listener) only ever gets added the first time.

  const loadLanguagePack = (url, callback) => {

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

  // Generic helpers (no instance state).

  const isFinitePositive = (value) => typeof value === "number" && isFinite(value) && value > 0;

  const getRootRemPx = () => {

    const fontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);

    return isFinitePositive(fontSize) ? fontSize : 16;

  };

  const remToPx = (remValue) => remValue * getRootRemPx();

  const pxToRem = (pxValue) => {

    const px = typeof pxValue === "number" && isFinite(pxValue) ? pxValue : 0;

    return `${px / getRootRemPx()}rem`;

  };

  const clampNumber = (value, min, max) => {

    const next = (!isFinitePositive(value) && value !== 0) ? min : value;

    return Math.min(max, Math.max(min, next));

  };

  const getViewportSize = () => {

    let width = window.innerWidth || document.documentElement.clientWidth || 0;
    let height = window.innerHeight || document.documentElement.clientHeight || 0;
    const visual = window.visualViewport;

    if (visual) {

      if (isFinitePositive(visual.width)) {

        width = Math.min(width, visual.width);

      }

      if (isFinitePositive(visual.height)) {

        height = Math.min(height, visual.height);

      }

    }

    return {

      width: Math.max(1, width),
      height: Math.max(1, height)

    };

  };

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getNavMovementFromButton = (btn) => {

    if (!btn || !btn.classList) {

      return null;

    }

    const direction = navDirections.find((d) => btn.classList.contains(d.className));

    return direction ? { x: direction.dx, y: direction.dy } : null;

  };

  // Debounce must stay a `function` (not an arrow) so it can capture the
  // caller's own `this`/`arguments` via apply() when used as a raw listener.

  function debounce(fn, wait) {

    let timeoutId;

    return function debounced(...args) {

      const context = this;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(context, args), wait);

    };

  }

  const closestByClass = (el, className) => {

    let node = el;

    while (node && node.nodeType === 1) {

      if (node.classList && node.classList.contains(className)) {

        return node;

      }

      node = node.parentNode;

    }

    return null;

  };

  // Any element a developer might drop into a cell/dialog that needs its
  // own click, drag, or focus to work — not just <button>. Content areas
  // are open, so this can't be a fixed list of what's used today.

  const interactiveSelector = ["button", "a[href]", "input", "select", "textarea", "details", "summary", "audio", "video", "iframe", "[contenteditable]:not([contenteditable=\"false\"])", "[tabindex]:not([tabindex=\"-1\"])"].join(", ");

  const parseGridAttr = (el, name, fallback) => {

    const parsed = parseInt(el && el.getAttribute(name), 10);

    return isFinite(parsed) ? parsed : fallback;

  };

  const getKey = (cell) => cell && cell.getAttribute(businessAreasDataKey);

  const getLabel = (cell) => {

    const heading = cell && cell.querySelector(businessAreasItemPreviewTitleClass);

    return heading ? heading.textContent.replace(/\s+/g, " ").trim() : "";

  };

  const getTranslate = (el) => {

    if (!el) {

      return { x: 0, y: 0 };

    }

    const transform = window.getComputedStyle(el).transform;

    if (!transform || transform === "none") {

      return { x: 0, y: 0 };

    }

    let match = transform.match(/^matrix\(([^)]+)\)$/);

    if (match) {

      match = match[1].split(",");

      return { x: parseFloat(match[4]) || 0, y: parseFloat(match[5]) || 0 };

    }

    match = transform.match(/^matrix3d\(([^)]+)\)$/);

    if (match) {

      match = match[1].split(",");

      return { x: parseFloat(match[12]) || 0, y: parseFloat(match[13]) || 0 };

    }

    return { x: 0, y: 0 };

  };

  const isTypingTarget = (target) => target && target.matches && target.matches("input, textarea, select, [contenteditable='true']");

  const stopEvent = (event) => {

    event.preventDefault();

    if (event.stopImmediatePropagation) {

      event.stopImmediatePropagation();

    }

    event.stopPropagation();

  };

  // Drag/pan physics.

  class BusinessAreasDrag {

    constructor(main) {

      this.main = main;
      this.dragSpeed = touchDragSpeed;
      this._boundAnimate = () => this.animate();
      this._boundOnResize = () => this.onResize();
      this._boundStartDrag = (e) => this.startDrag(e);
      this._boundDrag = (e) => this.drag(e);
      this._boundEndDrag = (e) => this.endDrag(e);

      this.setDragStates();
      this.addEvents();

    }

    onResize() {

      this.dragging = false;
      this.hasDragged = false;
      this.acceleration = { x: 0, y: 0 };

      this.snap(this.dragChange, { instant: true });

    }

    setDragStates() {

      this.dragPos = { x: 0, y: 0 };
      this.dragStart = { x: 0, y: 0 };
      this.dragChange = { x: 0, y: 0 };
      this.acceleration = { x: 0, y: 0 };
      this.mouseStart = { x: 0, y: 0 };
      this.mouseChange = { x: 0, y: 0 };
      this.pointerPos = { x: 0, y: 0 };
      this.hasDragged = false;
      this.snapped = false;
      this.pendingActiveSnap = false;
      this.navSnapSpeed = 0;
      this.dragging = false;
      this._pendingSettleCallback = null;

    }

    startDrag(e) {

      // A second finger/pointer coming down mid-drag shouldn't restart
      // tracking from its position — stay locked to whichever pointer
      // started the drag until it's released.

      if (this.dragging) {

        return;

      }

      // Skip drag-initiation for presses starting on any interactive
      // element (buttons, links, form fields, custom tabindex widgets,
      // etc. — this content area is open for developers to put anything
      // in). preventDefault() here blocks the pointer's default action —
      // touch scrolling/text-selection for a touch or pen pointer, the
      // browser's default focus-shift for a mouse pointer (silently
      // breaking tap/click-to-focus on text inputs, selects, textareas).
      // None of that is needed for pan-dragging anyway; let interactive
      // elements handle their own activation and focus.

      if (e.target.closest(interactiveSelector)) {

        return;

      }

      e.preventDefault();

      this.main.getOffset();
      this.dragging = true;
      this.dragStart = { x: this.dragPos.x, y: this.dragPos.y };
      this.dragSpeed = e.pointerType === "touch" ? touchDragSpeed : mouseDragSpeed;

      this.mouseStart = {

        x: e.clientX,
        y: e.clientY - this.main.gridOffset

      };

      this.pointerPos = { x: this.mouseStart.x, y: this.mouseStart.y };

      this.main.overflow.setPointerCapture(e.pointerId);

    }

    drag(e) {

      // Updated unconditionally (not just while dragging) so a drag that
      // starts right now has an up-to-date position to diff against —
      // matches the always-on tracking pointer capture otherwise gives us
      // for free once a drag is underway.

      this.pointerPos = { x: e.clientX, y: e.clientY - this.main.gridOffset };

      if (!this.dragging) {

        return;

      }

      e.preventDefault();

      if (!this.checkIfThreshold(this.mouseChange, dragThresholdPx)) {

        this.hasDragged = true;
        this.snapped = false;

        this.main.parent.classList.add(businessAreasMouseDownClassName);
        this.main.removeActive();

      }

    }

    endDrag(e) {

      this.dragging = false;

      if (e && this.main.overflow.hasPointerCapture(e.pointerId)) {

        this.main.overflow.releasePointerCapture(e.pointerId);

      }

    }

    getCentreFromPan(pan) {

      const strideX = this.main.strideX || this.main.tileWidth || 1;
      const strideY = this.main.strideY || this.main.tileHeight || 1;

      return this.main.clampCell({

        x: isFinitePositive(strideX) ? Math.round(pan.x / strideX) : 0,
        y: isFinitePositive(strideY) ? Math.round(pan.y / strideY) : 0

      });

    }

    getNavSnapSpeed(fromPan, toPan) {

      const strideX = this.main.strideX || this.main.tileWidth;
      const strideY = this.main.strideY || this.main.tileHeight;
      const tileSteps = Math.max(

        isFinitePositive(strideX) ? Math.round(Math.abs(toPan.x - fromPan.x) / strideX) : 0,
        isFinitePositive(strideY) ? Math.round(Math.abs(toPan.y - fromPan.y) / strideY) : 0

      );

      return mouseDragSpeed * Math.max(1, tileSteps * 1.35);

    }

    applySnapNow(pan) {

      const clamped = this.main.clampPan(pan);
      const centre = this.getCentreFromPan(clamped);

      this.dragPos.x = clamped.x;
      this.dragPos.y = clamped.y;
      this.dragChange.x = clamped.x;
      this.dragChange.y = clamped.y;
      this.acceleration = { x: 0, y: 0 };
      this.snapped = true;
      this.pendingActiveSnap = false;
      this.navSnapSpeed = 0;

      this.main.moveTiles(clamped);
      this.main.makeActive(centre);

      // Every settle path lands here — drag release, click-to-snap,
      // nav-button coast, arrow-key/Tab instant snap — and any of them can
      // race against something else trying to scroll a descendant into
      // view right around the same moment: the browser's own native
      // scroll-into-view on Tab focus (unsuppressable), or a test/automation
      // tool's own "scroll element into view before interacting with it"
      // step before a click, or an AT's own navigation commands. Because
      // .spatial-navigation has overflow: hidden, it still counts as a
      // "scrolling box" per spec — so that attempt can set .spatial-navigation's
      // OWN internal scrollTop trying to reveal a stale pre-pan position,
      // even though nothing here ever means for it to scroll internally
      // (all movement is meant to happen only via the pan transform). That
      // stray scrollTop then throws off every getBoundingClientRect() read
      // afterwards — including this component's own — until something
      // resets it. resyncViewport() forces it back to 0, and also corrects
      // the outer page itself if the same kind of attempt scrolled that
      // instead.
      //
      // Called twice: once here, and once more after a double rAF, since
      // whatever triggered the stray scroll isn't guaranteed to have
      // resolved by the time this first call runs — when it lands after us
      // instead, it can clobber this correction. Two rAFs is the standard
      // way to wait until the browser has fully drained whatever it queued
      // on its own, so the second call is reliably the last word regardless
      // of that race.

      this.main.resyncViewport();

      requestAnimationFrame(() => {

        requestAnimationFrame(() => {

          this.main.resyncViewport();

        });

      });

      // Fires exactly when a pan actually settles (instantly, or once the
      // coast-to-stop animation crosses the snap threshold in animate()
      // below) — not on a fixed-delay guess, which previously fired before
      // the animated case had settled often enough that the live-region
      // announce silently no-op'd (no active cell yet).

      if (this._pendingSettleCallback) {

        const callback = this._pendingSettleCallback;

        this._pendingSettleCallback = null;
        callback();

      }

    }

    snap(target, options) {

      const centre = this.getCentreFromPan(target);
      const pan = this.main.panFromCell(centre);
      const fromPan = { x: this.dragPos.x, y: this.dragPos.y };

      this.dragChange.x = pan.x;
      this.dragChange.y = pan.y;
      this._pendingSettleCallback = options?.onSettle || null;

      if (options?.instant || prefersReducedMotion()) {

        this.applySnapNow(pan);

      } else {

        this.navSnapSpeed = this.getNavSnapSpeed(fromPan, pan);
        this.pendingActiveSnap = true;
        this.snapped = false;

      }

      this.main.parent.classList.remove(businessAreasMouseDownClassName);

    }

    checkIfThreshold(obj, threshold) {

      return Math.max(Math.abs(obj.x), Math.abs(obj.y)) < threshold;

    }

    getAcceleration() {

      this.acceleration = {

        x: this.dragChange.x - this.dragPos.x,
        y: this.dragChange.y - this.dragPos.y

      };

    }

    animate() {

      if (this.dragging) {

        this.mouseChange = {

          x: this.pointerPos.x - this.mouseStart.x,
          y: this.pointerPos.y - this.mouseStart.y

        };

        if (this.hasDragged) {

          this.dragChange = this.main.clampPan({

            x: this.dragStart.x - this.mouseChange.x,
            y: this.dragStart.y - this.mouseChange.y

          });

        }

        this.getAcceleration();

      } else if (!this.snapped) {

        if (this.pendingActiveSnap) {

          this.getAcceleration();

          if (this.checkIfThreshold(this.acceleration, snapAccelThreshold)) {

            this.applySnapNow({ x: this.dragChange.x, y: this.dragChange.y });

          }

        } else {

          const friction = prefersReducedMotion() ? 0 : dragFriction;

          if (friction) {

            this.acceleration.x *= friction;
            this.acceleration.y *= friction;

          }

          if (this.checkIfThreshold(this.acceleration, snapAccelThreshold)) {

            this.snapped = true;
            this.hasDragged = false;

            this.snap(this.dragPos);

          }

        }

      } else {

        this.getAcceleration();

      }

      if (!this.checkIfThreshold(this.acceleration, moveAccelThreshold)) {

        const speed = this.pendingActiveSnap && this.navSnapSpeed ? this.navSnapSpeed : this.dragSpeed;
        const nextPos = this.main.clampPan({

          x: this.dragPos.x + this.acceleration.x / speed,
          y: this.dragPos.y + this.acceleration.y / speed

        });

        this.dragPos.x = nextPos.x;
        this.dragPos.y = nextPos.y;

        this.main.moveTiles(this.dragPos);

      }

      this._rafId = window.requestAnimationFrame(this._boundAnimate);

    }

    addEvents() {

      const overflow = this.main.overflow;

      this.main.toResize.push(this._boundOnResize);

      if (!overflow) {

        return;

      }

      // Pointer Events unify mouse/touch/pen into one stream, and
      // setPointerCapture() (in startDrag) keeps pointerup/pointermove
      // arriving here even if the pointer leaves the element or the window
      // — no separate document-level listeners needed to catch a release
      // that happens outside overflow's bounds.

      overflow.addEventListener("pointerdown", this._boundStartDrag);
      overflow.addEventListener("pointermove", this._boundDrag);
      overflow.addEventListener("pointerup", this._boundEndDrag);
      overflow.addEventListener("pointercancel", this._boundEndDrag);

      this._rafId = window.requestAnimationFrame(this._boundAnimate);

    }

    destroy() {

      if (this._rafId) {

        cancelAnimationFrame(this._rafId);

      }

      const overflow = this.main.overflow;

      if (overflow) {

        overflow.removeEventListener("pointerdown", this._boundStartDrag);
        overflow.removeEventListener("pointermove", this._boundDrag);
        overflow.removeEventListener("pointerup", this._boundEndDrag);
        overflow.removeEventListener("pointercancel", this._boundEndDrag);

      }

    }

  }

  // The component.

  class BusinessAreas {

    constructor(dom) {

      this.base = dom;
      this.parent = document.querySelector(businessAreasClass);

      if (!this.parent) {

        return;

      }

      this.overflow = this.parent.querySelector(businessAreasOverflowClass);
      this.baseTileParent = this.parent.querySelector(businessAreasOverflowInnerClass);
      this.baseTiles = this.parent.querySelectorAll(businessAreasItemClass);
      this.navigationButtons = this.buildNavOverlay();
      this.status = this.parent.querySelector(businessAreasGridStatusSelector);
      this.toResize = [];
      this.ready = true;
      this._readyTimeoutId = null;
      this.columns = gridCols;
      this.rows = gridRows;
      this.tileWidth = 1;
      this.tileHeight = 1;
      this.strideX = 1;
      this.strideY = 1;

      // Accessibility state — first-class from construction, not bolted on.

      this.activeKey = null;
      this.keyboardManagedUntil = 0;
      this.lastAnnouncement = "";
      this._runtimeObserver = null;
      this._resizeObserver = null;

      // ResizeObserver only fires for this element's own box, and its
      // callback is already batched to the browser's render step — no
      // manual debounce needed. visualViewport has no such batching, and
      // fires independently of this element's box (on-screen-keyboard,
      // pinch-zoom), so it still needs the debounced path.

      this._boundOnResize = () => this.onResize();
      this._boundOnResizeDebounced = debounce(() => this.onResize(), resizeDebounceMs);
      this._boundTileClick = (e) => this.tileClick(e);
      this._boundGridFocusin = (e) => this.handleGridFocusin(e);
      this._boundGridKeydown = (e) => this.handleGridKeydown(e);

      if (!this.canInitialize()) {

        this._disabled = true;

        return;

      }

      this.makeGrid();
      this.toResize.push(() => this.resizeGrid());
      this.addEvents();

      this.drag = new BusinessAreasDrag(this);

      const landingPan = this.panFromCell({ x: landingCol, y: landingRow });

      this.drag.applySnapNow(landingPan);

      this.initAccessibility();

    }

    canInitialize() {

      return Boolean(this.overflow && this.baseTileParent && this.baseTiles.length > 0);

    }

    // Builds the directional nav overlay entirely in script — no static
    // markup, no innerHTML — and prepends it to .spatial-navigation ahead of
    // everything else already there. navDirections is the single source of
    // truth for which four buttons get built and what each one is labelled.

    buildNavOverlay() {

      const nav = document.createElement("nav");

      nav.classList.add(businessAreasNavClassName);
      nav.setAttribute("aria-label", "Spatial");
      nav.setAttribute("aria-describedby", businessAreasNavLabelId);

      const buttons = navDirections.map((direction) => {

        const button = document.createElement("button");

        button.classList.add(businessAreasNavItemClassName, direction.className);
        button.setAttribute("aria-label", direction.label);

        // Not in the Tab sequence: this fixed overlay doesn't move with
        // the pan, so it sits structurally apart from wherever focus
        // actually is in the grid — arrow keys already do the exact same
        // four-direction pan once focus is on any cell or CTA, so this
        // avoids redundant, awkwardly-placed tab stops without losing any
        // keyboard-equivalent functionality. Set once here at creation,
        // not per-sync — it never changes for the lifetime of the button.

        button.setAttribute("tabindex", "-1");

        nav.appendChild(button);

        return button;

      });

      this.parent.prepend(nav);

      return buttons;

    }

    getPageSizes() {

      const viewport = getViewportSize();

      this.width = viewport.width;
      this.height = viewport.height;

    }

    getOffset() {

      this.gridOffset = this.parent.getBoundingClientRect().top;

    }

    setHeight() {

      const rect = this.parent.getBoundingClientRect();
      const topOffset = Math.max(0, rect.top);
      const viewport = getViewportSize();

      let availableHeight = Math.max(viewport.height - topOffset, viewport.height * 0.65);

      if (!isFinitePositive(availableHeight)) {

        availableHeight = viewport.height;

      }

      this.parent.style.blockSize = `${availableHeight}px`;
      this.parent.style.minBlockSize = `${availableHeight}px`;
      this.gridHeight = this.parent.offsetHeight || availableHeight || viewport.height;

      if (!isFinitePositive(this.gridHeight)) {

        this.gridHeight = viewport.height;

      }

    }

    measureLayout() {

      const item = this.tiles && this.tiles[0];

      if (!item) {

        return;

      }

      const rect = item.getBoundingClientRect();

      this.tileWidth = isFinitePositive(rect.width) ? rect.width : remToPx(14.375);
      this.tileHeight = isFinitePositive(rect.height) ? rect.height : remToPx(23.625);

      const innerStyles = window.getComputedStyle(this.baseTileParent);
      const gapX = parseFloat(innerStyles.columnGap);
      const gapY = parseFloat(innerStyles.rowGap);

      this.gapX = isFinitePositive(gapX) || gapX === 0 ? gapX : 0;
      this.gapY = isFinitePositive(gapY) || gapY === 0 ? gapY : 0;
      this.strideX = this.tileWidth + this.gapX;
      this.strideY = this.tileHeight + this.gapY;

    }

    getVerticalOffsetPx() {

      if (!this.parent) {

        return 0;

      }

      const raw = window.getComputedStyle(this.parent).getPropertyValue("--ba-vertical-offset").trim();

      if (!raw) {

        return 0;

      }

      const value = parseFloat(raw);

      if (!isFinite(value)) {

        return 0;

      }

      return raw.indexOf("rem") !== -1 ? remToPx(value) : value;

    }

    getCameraOrigin() {

      const host = this.overflow.parentNode || this.parent;
      const rect = host.getBoundingClientRect();
      const width = isFinitePositive(rect.width) ? rect.width : this.width;
      const height = isFinitePositive(rect.height) ? rect.height : this.gridHeight;
      const offsetY = this.getVerticalOffsetPx();

      return {

        x: width / 2 - this.tileWidth / 2,
        y: height / 2 - this.tileHeight / 2 + offsetY

      };

    }

    clampCell(cell) {

      return {

        x: Math.round(clampNumber(cell.x, 0, this.columns - 1)),
        y: Math.round(clampNumber(cell.y, 0, this.rows - 1))

      };

    }

    panFromCell(cell) {

      const next = this.clampCell(cell);

      return { x: next.x * this.strideX, y: next.y * this.strideY };

    }

    clampPan(pan) {

      return {

        x: clampNumber(pan.x, 0, (this.columns - 1) * this.strideX),
        y: clampNumber(pan.y, 0, (this.rows - 1) * this.strideY)

      };

    }

    buildTileGrid() {

      this.tiles = Array.from(this.baseTiles);
      this.tileGrid = this.tiles.map((tile, i) => {

        tile.style.inlineSize = "";
        tile.style.blockSize = "";
        tile.style.transform = "";

        // Every cell is a focus target regardless of its content —
        // arrow-key navigation (see navigateByKeyboard) always lands on
        // the cell itself, not conditionally on whether it has a trigger.
        // The cell doesn't do anything on Enter/Space itself; its "See
        // more" button (one Tab press away) is what opens the dialog,
        // natively, via its own command/commandfor.

        if (tile.getAttribute("tabindex") !== "-1") {

          tile.setAttribute("tabindex", "-1");

        }

        return {

          x: parseGridAttr(tile, businessAreasDataGridCol, i % this.columns),
          y: parseGridAttr(tile, businessAreasDataGridRow, Math.floor(i / this.columns))

        };

      });

    }

    makeGrid() {

      this.getPageSizes();
      this.setHeight();
      this.buildTileGrid();
      this.measureLayout();
      this.getOffset();

    }

    resizeGrid() {

      let centre = { x: landingCol, y: landingRow };

      if (this.drag) {

        centre = this.drag.getCentreFromPan(this.drag.dragChange);

      }

      this.makeGrid();

      const pan = this.panFromCell(centre);

      this.moveTiles(pan);

      if (this.drag) {

        this.drag.applySnapNow(pan);

      }

    }

    moveTiles(pos) {

      const pan = this.clampPan(pos);
      const origin = this.getCameraOrigin();

      this.overflow.style.transform = `translate3d(${pxToRem(origin.x - pan.x)},${pxToRem(origin.y - pan.y)},0)`;

    }

    updateNavEdges(col, row) {

      this.navigationButtons.forEach((btn) => {

        const direction = navDirections.find((d) => btn.classList.contains(d.className));
        const muted = direction ? direction.isMuted(col, row, this.columns, this.rows) : false;

        btn.classList.toggle(businessAreasNavItemMutedClassName, muted);

        if (muted) {

          btn.setAttribute("aria-disabled", "true");

        } else {

          btn.removeAttribute("aria-disabled");

        }

      });

    }

    makeActive(centre) {

      const cell = this.clampCell(centre);

      this.tiles.forEach((tile, i) => {

        const active = this.tileGrid[i].x === cell.x && this.tileGrid[i].y === cell.y;

        tile.classList.toggle(businessAreasItemActiveClassName, active);

      });

      this.updateNavEdges(cell.x, cell.y);

    }

    removeActive() {

      this.tiles.forEach((tile) => tile.classList.remove(businessAreasItemActiveClassName));

    }

    getItemFromTarget(target) {

      return closestByClass(target, businessAreasItemClassName);

    }

    snapToPointer(pointer) {

      this.drag.dragging = false;
      this.drag.snapped = true;

      this.getOffset();

      this.drag.dragChange.x += pointer.clientX - this.width / 2;
      this.drag.dragChange.y += pointer.clientY - this.gridOffset - this.gridHeight / 2;

      this.drag.snap(this.drag.dragChange);

      this.scheduleReady();

    }

    scheduleReady() {

      clearTimeout(this._readyTimeoutId);

      this.ready = false;
      this._readyTimeoutId = setTimeout(() => {

        this.ready = true;

      }, readyDelayMs);

    }

    tileClick(e) {

      // Same reason as handleGridKeydown: the dialog lives inside a grid
      // cell, so a pointerup on its Close button still bubbles up here
      // too — ignore it while a dialog is open.

      if (this.drag.hasDragged || !this.ready || this.hasOpenDialog()) {

        return;

      }

      // Not e.target: this listener lives on overflow (see addEvents), and
      // startDrag() calls setPointerCapture() on it for almost any press
      // in the pannable area — capture retargets every subsequent pointer
      // event's target to the capturing element itself, so e.target here
      // is just "overflow", regardless of where the pointer actually was.
      // elementFromPoint reads the real element under the release point
      // instead.

      const item = this.getItemFromTarget(document.elementFromPoint(e.clientX, e.clientY));

      this.drag.dragging = false;
      this.drag.snapped = true;

      this.getOffset();
      this.scheduleReady();

      const position = item && this.getGridPositionForCell(item);

      if (position) {

        this.drag.snap(this.panFromCell(position));

        return;

      }

      this.snapToPointer(e);

    }

    // Single source of truth for "where is this cell in the grid" — reads
    // the fallback-aware position tileGrid already computed once in
    // buildTileGrid(), rather than re-deriving it (see the comment on
    // centerVisualCell() for what went wrong re-deriving it separately).

    getGridPositionForCell(cell) {

      const index = this.tiles.indexOf(cell);

      return index === -1 ? null : this.tileGrid[index];

    }

    // Returns the target cell's {x, y} grid position on a real move, or
    // false if nothing moved (already at that edge, or not ready yet).

    navMovement(x, y, options = {}) {

      if (!this.ready || (!x && !y)) {

        return false;

      }

      const current = this.drag.getCentreFromPan(this.drag.dragChange);
      const next = this.clampCell({ x: current.x - x, y: current.y - y });

      if (next.x === current.x && next.y === current.y) {

        return false;

      }

      this.drag.dragChange = this.panFromCell(next);
      this.drag.snap(this.drag.dragChange, { instant: !!options.instant, onSettle: options.onSettle });

      this.scheduleReady();

      return next;

    }

    // Shared by navClick and navigateByKeyboard: null if the button is
    // muted (at a grid edge) or doesn't map to a direction.

    getEnabledMovement(btn) {

      if (btn.getAttribute("aria-disabled") === "true") {

        return null;

      }

      return getNavMovementFromButton(btn);

    }

    navClick(btn, options) {

      const movement = this.getEnabledMovement(btn);

      if (!movement) {

        return;

      }

      this.navMovement(movement.x, movement.y, options);

    }

    getCellByGridPosition(col, row) {

      if (!this.tiles || !this.tileGrid) {

        return null;

      }

      const index = this.tileGrid.findIndex((pos) => pos.x === col && pos.y === row);

      return index === -1 ? null : this.tiles[index];

    }

    // Arrow-key panning (unlike a mouse click on a nav button) snaps
    // instantly rather than coasting, and moves real focus to the new
    // cell's trigger — otherwise the grid visually pans but focus is left
    // behind on whatever was previously focused, out of sync with what's
    // now on screen.

    navigateByKeyboard(btn) {

      const movement = this.getEnabledMovement(btn);

      if (!movement) {

        return;

      }

      const target = this.navMovement(movement.x, movement.y, { instant: true });

      if (!target) {

        return;

      }

      this.syncStateFromVisual({ announce: true, recenter: false });

      const cell = this.getCellByGridPosition(target.x, target.y);

      if (cell) {

        cell.focus({ preventScroll: true });

      }

    }

    onResize() {

      this.toResize.forEach((fn) => fn());

    }

    addEvents() {

      this._resizeObserver = new ResizeObserver(this._boundOnResize);
      this._resizeObserver.observe(this.parent);

      if (window.visualViewport) {

        window.visualViewport.addEventListener("resize", this._boundOnResizeDebounced);

      }

      // On overflow (not baseTileParent): startDrag()'s setPointerCapture()
      // retargets pointerup to whatever element captured the pointer, so a
      // listener on a descendant like baseTileParent would never see it
      // once a press has engaged capture — see the comment in tileClick()
      // for how it recovers the real click target.

      if (this.overflow) {

        this.overflow.addEventListener("pointerup", this._boundTileClick);

      }

      this._navButtonClickHandlers = [];

      this.navigationButtons.forEach((btn) => {

        // Announce once the pan has actually settled, not on a fixed
        // delay — the coast-to-stop animation's duration varies with
        // distance, and a guessed delay either fires too early (no active
        // cell yet, announce silently drops) or leaves a visible lag.

        const handler = () => {

          this.navClick(btn, {

            onSettle: () => this.syncStateFromVisual({ announce: true, recenter: false })

          });

        };

        this._navButtonClickHandlers.push({ btn, handler });
        btn.addEventListener("click", handler);

      });

    }

    destroy() {

      clearTimeout(this._readyTimeoutId);

      if (this.drag) {

        this.drag.destroy();

      }

      if (this._runtimeObserver) {

        this._runtimeObserver.disconnect();
        this._runtimeObserver = null;

      }

      if (this._resizeObserver) {

        this._resizeObserver.disconnect();
        this._resizeObserver = null;

      }

      if (window.visualViewport) {

        window.visualViewport.removeEventListener("resize", this._boundOnResizeDebounced);

      }

      if (this.overflow) {

        this.overflow.removeEventListener("pointerup", this._boundTileClick);

      }

      if (this._navButtonClickHandlers) {

        this._navButtonClickHandlers.forEach(({ btn, handler }) => btn.removeEventListener("click", handler));
        this._navButtonClickHandlers = [];

      }

      this.parent.removeEventListener("focusin", this._boundGridFocusin, true);
      this.parent.removeEventListener("keydown", this._boundGridKeydown, true);

    }

    // Accessibility: live region, focus management, keyboard, dialog.

    // Single entry point for the polite live region. Dedupes consecutive
    // identical messages so repeated moves/settles do not re-announce;
    // pass { force: true } to re-announce an identical string.
    // TODO: This still is not working the way I expect. -Spell

    announce(message, options = {}) {

      if (!this.status || !message) {

        return;

      }

      if (!options.force && message === this.lastAnnouncement) {

        return;

      }

      this.lastAnnouncement = message;
      this.status.textContent = message;

    }

    getActiveVisualTile() {

      return this.parent.querySelector(businessAreasItemActiveClass);

    }

    getActiveVisualKey() {

      return getKey(this.getActiveVisualTile());

    }

    // No further fallback needed here: getCellByKey() already falls back
    // to the first tile whenever any tiles exist, so a second fallback
    // lookup could only ever matter if there were none — in which case it
    // would return null too.

    resolveActiveCell() {

      return this.getActiveVisualTile() || this.getCellByKey(this.getActiveKey());

    }

    getActiveKey() {

      return this.activeKey || this.getActiveVisualKey() || "intro";

    }

    getCellByKey(key) {

      const cells = this.tiles || [];

      return cells.find((cell) => getKey(cell) === key) || cells[0] || null;

    }

    isBaseCell(cell) {

      return !!(cell && this.baseTileParent && this.baseTileParent.contains(cell));

    }

    // True while any of this component's native <dialog> elements is open.
    // showModal() already makes the rest of the page inert, so this is
    // only needed to stop our own grid-state sync from running
    // concurrently.

    hasOpenDialog() {

      return !!this.parent.querySelector(openDialogSelector);

    }

    repairActiveState(key, recenter) {

      if (this.hasOpenDialog()) {

        return;

      }

      const cell = this.resolveActiveCell() || this.getCellByKey(key || this.getActiveKey());

      if (!cell) {

        return;

      }

      this.activeKey = getKey(cell) || "intro";

      if (recenter) {

        this.centerVisualCell(cell);

      }

      this.syncGridState({ announce: false });

    }

    scheduleActiveStateRepair(key, recenter) {

      [60, 180, 420].forEach((delay) => {

        setTimeout(() => {

          if (key && this.getActiveKey() !== key) {

            return;

          }

          this.repairActiveState(key, recenter);

        }, delay);

      });

    }

    centerMeasuredCell(cell) {

      const tile = cell && cell.querySelector(businessAreasItemTileClass);

      if (!this.overflow || !tile) {

        return false;

      }

      const tileRect = tile.getBoundingClientRect();
      const rootRect = this.parent.getBoundingClientRect();

      if (!tileRect.width || !tileRect.height || !rootRect.width || !rootRect.height) {

        return false;

      }

      // No markKeyboardMovement() here — this is the same "keyboard focus
      // landed" case as centerVisualCell's main path (this is only its
      // fallback, for when the grid position can't be determined), and
      // that path snaps instantly for the same reason: see the comment on
      // its drag.snap() call.

      const current = getTranslate(this.overflow);
      const offsetY = this.getVerticalOffsetPx();
      const next = {

        x: current.x + (rootRect.left + rootRect.width / 2) - (tileRect.left + tileRect.width / 2),
        y: current.y + (rootRect.top + rootRect.height / 2 + offsetY) - (tileRect.top + tileRect.height / 2)

      };

      this.overflow.style.transform = `translate3d(${next.x}px,${next.y}px,0)`;

      return true;

    }

    centerVisualCell(cell) {

      if (!cell) {

        return this.centerMeasuredCell(cell);

      }

      // getGridPositionForCell() reuses tileGrid — the same fallback-aware
      // col/row data built once in buildTileGrid() — rather than
      // re-reading data-grid-col/row directly here. Cells don't need those
      // attributes explicitly set (DOM order already determines position);
      // a raw re-read with no fallback would silently drop to
      // centerMeasuredCell() instead, which sets the transform directly
      // without updating the drag engine's own dragPos/dragChange, leaving
      // it out of sync with where the grid actually is.

      const position = this.getGridPositionForCell(cell);

      if (!position) {

        return this.centerMeasuredCell(cell);

      }

      const target = this.panFromCell(position);

      if (
        this.drag.dragPos &&
        Math.abs(this.drag.dragPos.x - target.x) < 0.5 &&
        Math.abs(this.drag.dragPos.y - target.y) < 0.5 &&
        cell.classList.contains(businessAreasItemActiveClassName)
      ) {

        return true;

      }

      this.drag.dragging = false;
      this.drag.hasDragged = false;
      this.drag.acceleration = { x: 0, y: 0 };
      this.ready = true;

      this.parent.classList.remove(businessAreasMouseDownClassName);

      this.drag.snap(target, {

        // instant: keyboard focus (Tab or arrow keys) lands on the new
        // cell immediately, with no animation of its own — a coasting pan
        // here just means the highlighted/focused cell and the visible
        // content disagree for a beat while the grid catches up. Arrow-key
        // nav (navMovement) already snaps for the same reason; this brings
        // Tab-driven moves in line with it. Coasting is kept for the nav
        // buttons (navClick) and drag, where there's a mouse pointer's
        // continuous motion to stay visually connected to.
        //
        // No onSettle needed here for the stray-scrollTop correction this
        // used to carry (see resyncViewport()'s own comment) —
        // instant:true always resolves through applySnapNow()
        // synchronously, which now runs that correction itself for every
        // settle path, not just this one.

        instant: true

      });

      return true;

    }

    // See the comment in BusinessAreasDrag.applySnapNow() (its one call
    // site, run twice per settle) for what this corrects and why.

    resyncViewport() {

      this.parent.scrollTop = 0;
      this.parent.scrollLeft = 0;
      this.parent.scrollIntoView({

        block: "nearest",
        inline: "nearest",
        behavior: "auto"

      });

    }

    setActiveKey(key, options = {}) {

      const nextCell = options.cell || this.getCellByKey(key);

      if (!nextCell) {

        return false;

      }

      this.activeKey = getKey(nextCell) || "intro";

      if (options.visual !== false) {

        this.centerVisualCell(nextCell);

      }

      // classList.toggle() is idempotent (a no-op writes nothing to the
      // DOM); plain add()/remove() are not — they mutate even when the
      // token is already in the requested state. The grid is watched by a
      // MutationObserver (see observeRuntimeChanges), so a non-idempotent
      // write here re-triggers it on every call, including calls that
      // don't actually change which cell is active — a self-sustaining
      // loop that never settles.

      this.tiles.forEach((cell) => cell.classList.toggle(businessAreasItemActiveClassName, cell === nextCell));
      this.syncGridState(options);

      return true;

    }

    syncStateFromVisual(options = {}) {

      const visualTile = this.getActiveVisualTile();
      const visualKey = this.getActiveVisualKey();

      if (this.hasOpenDialog() && !options.force) {

        return false;

      }

      if (!visualKey) {

        return false;

      }

      const mergedOptions = { visual: true, ...options };

      if (options.recenter === false) {

        mergedOptions.visual = false;

      }

      if (visualTile) {

        mergedOptions.cell = visualTile;

      }

      this.activeKey = visualKey;

      return this.setActiveKey(visualKey, mergedOptions);

    }

    syncGridState(options = {}) {

      const activeCell = this.resolveActiveCell();
      const activeKey = getKey(activeCell) || this.getActiveKey();
      const activeLabel = getLabel(activeCell);

      if (this.hasOpenDialog() && !options.force) {

        return;

      }

      this.tiles.forEach((cell) => {

        const active = cell === activeCell;

        cell.classList.toggle(businessAreasItemActiveClassName, active);

        if (active) {

          // setAttribute() mutates even when the value is unchanged
          // (unlike classList.toggle()), and aria-current is watched by
          // the grid's MutationObserver — guard against rewriting an
          // already-correct value to avoid re-triggering it.

          if (cell.getAttribute("aria-current") !== "true") {

            cell.setAttribute("aria-current", "true");

          }

        } else {

          cell.removeAttribute("aria-current");

        }

      });

      if (activeLabel && options.announce === true) {

        if (activeKey === "intro") {

          this.announce("Business areas introduction active. Tab to the next business area or use the arrow keys to move spatially.");

        } else {

          this.announce(`${activeLabel} active. Press Enter or Space to open details, or Tab to its See more button.`);

        }

      }

    }

    // Map an arrow keypress to the matching directional nav button so
    // keyboard arrows pan the grid through the exact same path as the
    // buttons themselves.

    navButtonForKey(event) {

      const direction = navDirections.find((d) => d.key === event.key);

      if (!direction) {

        return null;

      }

      return Array.from(this.navigationButtons).find((button) => button.classList.contains(direction.className)) || null;

    }

    isGridInteractionTarget(target) {

      return this.overflow && target && (
        target === this.overflow ||
        target.closest?.(businessAreasItemClass)
      );

    }

    handleGridFocusin(event) {

      if (this.hasOpenDialog()) {

        return;

      }

      const cell = event.target.closest?.(businessAreasItemClass);

      if (!this.isBaseCell(cell)) {

        return;

      }

      const key = getKey(cell);

      if (!key || key === this.getActiveKey()) {

        this.syncGridState({ announce: false });

        return;

      }

      this.keyboardManagedUntil = Date.now() + 1200;

      this.setActiveKey(key, { announce: false, cell });
      this.scheduleActiveStateRepair(key, true);

    }

    handleGridKeydown(event) {

      // The dialog lives inside a grid cell now (not moved to <body>), so
      // this.parent — being an ancestor of an open dialog — stays
      // non-inert and this capture-phase listener would otherwise still
      // see keydowns from inside it (e.g. Enter on the Close button) and
      // hijack them.

      if (this.hasOpenDialog()) {

        return;

      }

      if (isTypingTarget(event.target)) {

        return;

      }

      const navButton = this.navButtonForKey(event);

      if (!navButton) {

        return;

      }

      // Enter/Space landing on the grid cell itself (the roving-tabindex
      // stop, not its "See more" button) is deliberately left to do
      // nothing here — a cell isn't a button, so nothing should suggest it
      // behaves like one. Tab from the cell to reach its "See more"
      // button, which opens the dialog natively via its own
      // command/commandfor.

      if (!this.isGridInteractionTarget(event.target) && event.target !== navButton && !navButton.contains(event.target)) {

        return;

      }

      stopEvent(event);
      this.navigateByKeyboard(navButton);

    }

    observeRuntimeChanges() {

      if (!this.overflow || !window.MutationObserver) {

        return;

      }

      let syncTimeout;

      const observer = new MutationObserver(() => {

        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {

          if (Date.now() < this.keyboardManagedUntil) {

            this.syncGridState({ announce: false });

            return;

          }

          this.syncStateFromVisual({ announce: false, recenter: false });

        }, 50);

      });

      observer.observe(this.overflow, {

        attributes: true,
        attributeFilter: ["aria-current", "class", "role", "style", "tabindex"],
        childList: true,
        subtree: true

      });

      this._runtimeObserver = observer;

    }

    initAccessibility() {

      this.parent.addEventListener("focusin", this._boundGridFocusin, true);
      this.parent.addEventListener("keydown", this._boundGridKeydown, true);

      this.observeRuntimeChanges();

      this.activeKey = "intro";

      this.setActiveKey("intro", { announce: false });
      this.scheduleActiveStateRepair("intro", false);

    }

  }

  // Bootstrap.

  function init() {

    if (!document.querySelector(businessAreasClass)) {

      return null;

    }

    if (gridInstance) {

      return gridInstance;

    }

    loadLanguagePack("https://services.tmpwebeng.com/component-library/language-pack.js", () => {

      // Display which version is in use via console.

      console.log("%c{{ include.title }}%cv{{ include.version }}", "background: #2d2d2d; color: #fff; padding: 6px 10px; border-radius: 16px 0 0 16px; font-weight: 600;", "background: #6e00ee; color: #fff; padding: 6px 10px; border-radius: 0 16px 16px 0; font-weight: 600;");

      const instance = new BusinessAreas(baseClass);

      if (instance && !instance._disabled) {

        gridInstance = instance;

      }

    });

    return gridInstance;

  }

  function destroy() {

    if (gridInstance) {

      gridInstance.destroy();
      gridInstance = null;

    }

  }

  document.addEventListener("DOMContentLoaded", init);

  window.capOneBusinessAreas = {init, destroy, getInstance: () => gridInstance };

})();
