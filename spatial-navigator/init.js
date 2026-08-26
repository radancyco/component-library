/* =========================================================================
   Spatial navigator — bounded 3x4 draggable grid, accessible by default.
   Single module: drag/pan physics, keyboard navigation, live-region
   announcements, and the managed details dialog all live on one
   BusinessAreas instance. ES6+ throughout; targets evergreen browsers.
   ========================================================================= */
(() => {
    "use strict";

    const selector = ".business-areas";
    const baseClass = "business-areas";
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

    // Single source of truth for the four directional nav buttons — used for
    // mouse-click movement, arrow-key movement, and edge-muting, instead of
    // three separate north/south/west/east branch chains.
    const NAV_DIRECTIONS = [
        { suffix: "north", dx: 0, dy: 1, key: "ArrowUp", isMuted: (col, row, cols, rows) => row <= 0 },
        { suffix: "south", dx: 0, dy: -1, key: "ArrowDown", isMuted: (col, row, cols, rows) => row >= rows - 1 },
        { suffix: "west", dx: 1, dy: 0, key: "ArrowLeft", isMuted: (col, row, cols, rows) => col <= 0 },
        { suffix: "east", dx: -1, dy: 0, key: "ArrowRight", isMuted: (col, row, cols, rows) => col >= cols - 1 }
    ];

    let gridInstance;

    // ---- generic helpers (no instance state) ----------------------------

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

    const getNavMovementFromButton = (btn, base) => {
        if (!btn || !btn.classList) {
            return null;
        }

        const direction = NAV_DIRECTIONS.find((d) => btn.classList.contains(`${base}__nav--${d.suffix}`));
        return direction ? { x: direction.dx, y: direction.dy } : null;
    };

    const getPointer = (e) => {
        if (e.clientX != null) {
            return e;
        }
        const touch = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]);
        return touch || e;
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

    const isTouchEvent = (type) => type && type.indexOf("touch") === 0;

    const parseGridAttr = (el, name, fallback) => {
        const parsed = parseInt(el && el.getAttribute(name), 10);
        return isFinite(parsed) ? parsed : fallback;
    };

    const getKey = (cell) => cell && cell.getAttribute("data-business-area-key");

    const getLabel = (cell) => {
        const heading = cell && cell.querySelector(".business-areas__item__preview__title");
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

    // ---- drag/pan physics -------------------------------------------------

    class BusinessAreasDrag {
        constructor(main) {
            this.main = main;
            this.dragSpeed = touchDragSpeed;
            this._boundAnimate = () => this.animate();
            this._boundOnResize = () => this.onResize();
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
            this.hasDragged = false;
            this.snapped = false;
            this.pendingActiveSnap = false;
            this.navSnapSpeed = 0;
            this.dragging = false;
            this._pendingSettleCallback = null;
        }

        startDrag(e) {
            e.preventDefault();
            this.main.getOffset();
            this.dragging = true;
            this.dragStart = { x: this.dragPos.x, y: this.dragPos.y };

            const pointer = getPointer(e);
            this.dragSpeed = isTouchEvent(e.type) ? touchDragSpeed : mouseDragSpeed;

            this.mouseStart = {
                x: pointer.clientX,
                y: pointer.clientY - this.main.gridOffset
            };
        }

        drag(e) {
            if (!this.dragging) {
                return;
            }
            e.preventDefault();

            if (!this.checkIfThreshold(this.mouseChange, dragThresholdPx)) {
                this.hasDragged = true;
                this.snapped = false;
                this.main.parent.classList.add(`${this.main.base}--mouse-down`);
                this.main.removeActive();
            }
        }

        endDrag() {
            this.dragging = false;
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

            // Fires exactly when a pan actually settles (instantly, or once
            // the coast-to-stop animation crosses the snap threshold in
            // animate() below) — not on a fixed-delay guess, which previously
            // fired before the animated case had settled often enough that
            // the live-region announce silently no-op'd (no active cell yet).
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
            this._pendingSettleCallback = (options && options.onSettle) || null;

            if ((options && options.instant) || prefersReducedMotion()) {
                this.applySnapNow(pan);
            } else {
                this.navSnapSpeed = this.getNavSnapSpeed(fromPan, pan);
                this.pendingActiveSnap = true;
                this.snapped = false;
            }

            this.main.parent.classList.remove(`${this.main.base}--mouse-down`);
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
                    x: this.main.mouse.x - this.mouseStart.x,
                    y: this.main.mouse.y - this.mouseStart.y
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

            overflow.addEventListener("mousedown", (e) => this.startDrag(e));
            overflow.addEventListener("mousemove", (e) => this.drag(e));
            document.addEventListener("mouseup", () => this.endDrag());
            overflow.addEventListener("touchstart", (e) => this.startDrag(e), false);
            overflow.addEventListener("touchmove", (e) => this.drag(e), false);
            document.addEventListener("touchend", () => this.endDrag());

            this._rafId = window.requestAnimationFrame(this._boundAnimate);
        }

        destroy() {
            if (this._rafId) {
                cancelAnimationFrame(this._rafId);
            }
        }
    }

    // ---- the component ------------------------------------------------

    class BusinessAreas {
        constructor(dom) {
            this.base = dom;
            this.parent = document.querySelector(`.${this.base}`);
            if (!this.parent) {
                return;
            }

            this.overflow = this.parent.querySelector(`.${this.base}__overflow`);
            this.baseTileParent = this.parent.querySelector(`.${this.base}__overflow__inner`);
            this.baseTiles = this.parent.querySelectorAll(`.${this.base}__item`);
            this.navigationButtons = this.parent.querySelectorAll(`.${this.base}__nav__item`);
            this.status = this.parent.querySelector("#business-areas-grid-status");
            this.mouse = { x: 0, y: 0, zeroX: 0, zeroY: 0, normalX: 0, normalY: 0 };
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
            this.dropdownSelect = null;
            this.dropdownGo = null;
            this.keyboardManagedUntil = 0;
            this.keyboardMoveTimer = null;
            this.lastAnnouncement = "";
            this._runtimeObserver = null;
            this._resizeObserver = null;

            this._boundOnMouseMove = (e) => this.onMouseMove(e);
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

        onMouseMove(e) {
            const pointer = getPointer(e);
            this.mouse.x = pointer.clientX;
            this.mouse.y = pointer.clientY - this.gridOffset;
            this.mouse.zeroX = this.mouse.x - this.width / 2;
            this.mouse.zeroY = this.mouse.y - this.height / 2;
            this.mouse.normalX = this.mouse.zeroX / (this.width / 2);
            this.mouse.normalY = this.mouse.zeroY / (this.height / 2);
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

            this.parent.style.height = `${availableHeight}px`;
            this.parent.style.minHeight = `${availableHeight}px`;
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
                tile.style.width = "";
                tile.style.height = "";
                tile.style.transform = "";

                // Every cell is a focus target regardless of its content —
                // arrow-key navigation (see navigateByKeyboard) always lands
                // on the cell itself, not conditionally on whether it has a
                // trigger. A cell with a "See more" button is one Tab press
                // away from it; Enter/Space on the cell activates it directly
                // either way (see handleGridKeydown).
                if (tile.getAttribute("tabindex") !== "-1") {
                    tile.setAttribute("tabindex", "-1");
                }

                return {
                    x: parseGridAttr(tile, "data-grid-col", i % this.columns),
                    y: parseGridAttr(tile, "data-grid-row", Math.floor(i / this.columns))
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
                const direction = NAV_DIRECTIONS.find((d) => btn.classList.contains(`${this.base}__nav--${d.suffix}`));
                const muted = direction ? direction.isMuted(col, row, this.columns, this.rows) : false;

                btn.classList.toggle(`${this.base}__nav__item--muted`, muted);
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
                tile.classList.toggle(`${this.base}__item--active`, active);
            });
            this.updateNavEdges(cell.x, cell.y);
        }

        removeActive() {
            this.tiles.forEach((tile) => tile.classList.remove(`${this.base}__item--active`));
        }

        getItemFromTarget(target) {
            return closestByClass(target, `${this.base}__item`);
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
            // cell, so a mouseup on its Close button still bubbles to this
            // listener on baseTileParent — ignore it while a dialog is open.
            if (this.drag.hasDragged || !this.ready || this.hasOpenDialog()) {
                return;
            }

            const item = this.getItemFromTarget(e.target);

            this.drag.dragging = false;
            this.drag.snapped = true;
            this.getOffset();
            this.scheduleReady();

            const position = item && this.getGridPositionForCell(item);
            if (position) {
                this.drag.snap(this.panFromCell(position));
                return;
            }

            this.snapToPointer(getPointer(e));
        }

        // Single source of truth for "where is this cell in the grid" —
        // reads the fallback-aware position tileGrid already computed once
        // in buildTileGrid(), rather than re-deriving it (see the comment on
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

        navClick(btn, options) {
            if (btn.classList.contains(`${this.base}__nav__item--muted`) || btn.getAttribute("aria-disabled") === "true") {
                return;
            }

            const movement = getNavMovementFromButton(btn, this.base);
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
            if (btn.classList.contains(`${this.base}__nav__item--muted`) || btn.getAttribute("aria-disabled") === "true") {
                return;
            }

            const movement = getNavMovementFromButton(btn, this.base);
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
            window.addEventListener("touchmove", this._boundOnMouseMove, false);
            window.addEventListener("mousemove", this._boundOnMouseMove);

            this._resizeObserver = new ResizeObserver(this._boundOnResize);
            this._resizeObserver.observe(this.parent);

            if (window.visualViewport) {
                window.visualViewport.addEventListener("resize", this._boundOnResizeDebounced);
            }

            if (this.baseTileParent) {
                this.baseTileParent.addEventListener("mouseup", this._boundTileClick);
                this.baseTileParent.addEventListener("touchend", this._boundTileClick);
            }

            this.navigationButtons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    // Announce once the pan has actually settled, not on a
                    // fixed delay — the coast-to-stop animation's duration
                    // varies with distance, and a guessed delay either fires
                    // too early (no active cell yet, announce silently drops)
                    // or leaves a visible lag.
                    this.navClick(btn, {
                        onSettle: () => this.syncStateFromVisual({ announce: true, recenter: false })
                    });
                });
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
            window.removeEventListener("touchmove", this._boundOnMouseMove);
            window.removeEventListener("mousemove", this._boundOnMouseMove);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", this._boundOnResizeDebounced);
            }
            this.parent.removeEventListener("focusin", this._boundGridFocusin, true);
            this.parent.removeEventListener("keydown", this._boundGridKeydown, true);
        }

        // ---- accessibility: live region, focus management, keyboard, dialog --

        // Single entry point for the polite live region. Dedupes consecutive
        // identical messages so repeated moves/settles do not re-announce;
        // pass { force: true } to re-announce an identical string.
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
            return this.parent.querySelector(`.${this.base}__item--active`);
        }

        getActiveVisualKey() {
            return getKey(this.getActiveVisualTile());
        }

        resolveActiveCell() {
            return this.getActiveVisualTile() || this.getCellByKey(this.getActiveKey()) || this.getCellByKey("intro");
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

        // setAttribute() mutates even when the value is unchanged, and these
        // attributes are watched by the grid's MutationObserver (it's here to
        // catch drift from something external touching the grid) — write only
        // when a value has actually drifted, or every call re-triggers the
        // observer and this and the observer's callback loop forever.
        normaliseCollectionSemantics() {
            if (this.overflow) {
                if (this.overflow.getAttribute("aria-describedby") !== "business-areas-grid-instructions") {
                    this.overflow.setAttribute("aria-describedby", "business-areas-grid-instructions");
                }
                this.overflow.removeAttribute("aria-activedescendant");
                this.overflow.removeAttribute("aria-colcount");
                this.overflow.removeAttribute("aria-rowcount");
            }
        }

        getTriggerForCell(cell) {
            return cell && cell.querySelector(`.${this.base}__item__preview__cta`);
        }

        // True while any of this component's native <dialog> elements is open.
        // showModal() already makes the rest of the page inert, so this is only
        // needed to stop our own grid-state sync from running concurrently.
        hasOpenDialog() {
            return !!this.parent.querySelector("dialog[open]");
        }

        // Enter/Space on the active grid cell (not the button itself) and the
        // dropdown's Go button both need to open a dialog from script; a plain
        // click on a "See more" button never reaches this — the browser opens
        // it natively via the button's own command/commandfor attributes.
        activateCell(cell, options = {}) {
            const trigger = this.getTriggerForCell(cell);
            const label = getLabel(cell);

            if (!trigger) {
                this.announce(label ?
                    `${label} selected. Use the arrow keys to choose a business area with details.` :
                    "Use the arrow keys to choose a business area with details.");
                return false;
            }

            const dialogId = trigger.getAttribute("commandfor");
            const dialog = dialogId && document.getElementById(dialogId);

            if (!dialog || dialog.open) {
                return false;
            }

            if (options.focusBeforeOpen) {
                options.focusBeforeOpen.focus();
            }

            dialog.showModal();
            return true;
        }

        markKeyboardMovement() {
            this.parent.classList.add(`${this.base}--keyboard-moving`);
            window.clearTimeout(this.keyboardMoveTimer);
            this.keyboardMoveTimer = window.setTimeout(() => {
                this.parent.classList.remove(`${this.base}--keyboard-moving`);
            }, 260);
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
                window.setTimeout(() => {
                    if (key && this.getActiveKey() !== key) {
                        return;
                    }

                    this.repairActiveState(key, recenter);
                }, delay);
            });
        }

        centerMeasuredCell(cell) {
            const tile = cell && cell.querySelector(`.${this.base}__item__tile`);

            if (!this.overflow || !tile) {
                return false;
            }

            const tileRect = tile.getBoundingClientRect();
            const rootRect = this.parent.getBoundingClientRect();

            if (!tileRect.width || !tileRect.height || !rootRect.width || !rootRect.height) {
                return false;
            }

            this.markKeyboardMovement();
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

            // getGridPositionForCell() reuses tileGrid — the same fallback-
            // aware col/row data built once in buildTileGrid() — rather than
            // re-reading data-grid-col/row directly here. Cells don't need
            // those attributes explicitly set (DOM order already determines
            // position); a raw re-read with no fallback would silently drop
            // to centerMeasuredCell() instead, which sets the transform
            // directly without updating the drag engine's own dragPos/
            // dragChange, leaving it out of sync with where the grid
            // actually is.
            const position = this.getGridPositionForCell(cell);

            if (!position) {
                return this.centerMeasuredCell(cell);
            }

            const target = this.panFromCell(position);

            if (
                this.drag.dragPos &&
                Math.abs(this.drag.dragPos.x - target.x) < 0.5 &&
                Math.abs(this.drag.dragPos.y - target.y) < 0.5 &&
                cell.classList.contains(`${this.base}__item--active`)
            ) {
                return true;
            }

            this.drag.dragging = false;
            this.drag.hasDragged = false;
            this.drag.acceleration = { x: 0, y: 0 };
            this.ready = true;
            this.parent.classList.remove(`${this.base}--mouse-down`);

            this.markKeyboardMovement();
            this.drag.snap(target);

            return true;
        }

        setActiveKey(key, options) {
            const nextCell = (options && options.cell) || this.getCellByKey(key);

            if (!nextCell) {
                return false;
            }

            this.activeKey = getKey(nextCell) || "intro";

            if (!options || options.visual !== false) {
                this.centerVisualCell(nextCell);
            }

            // classList.toggle() is idempotent (a no-op writes nothing to the
            // DOM); plain add()/remove() are not — they mutate even when the
            // token is already in the requested state. The grid is watched by
            // a MutationObserver (see observeRuntimeChanges), so a non-idempotent
            // write here re-triggers it on every call, including calls that
            // don't actually change which cell is active — a self-sustaining
            // loop that never settles.
            this.tiles.forEach((cell) => cell.classList.toggle(`${this.base}__item--active`, cell === nextCell));
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

            const mergedOptions = Object.assign({ visual: true }, options);

            if (options.recenter === false) {
                mergedOptions.visual = false;
            }

            if (visualTile) {
                mergedOptions.cell = visualTile;
            }

            this.activeKey = visualKey;
            return this.setActiveKey(visualKey, mergedOptions);
        }

        syncGridState(options) {
            const activeCell = this.resolveActiveCell();
            const activeKey = getKey(activeCell) || this.getActiveKey();
            const activeLabel = getLabel(activeCell);

            if (this.hasOpenDialog() && (!options || !options.force)) {
                return;
            }

            this.normaliseCollectionSemantics();

            this.tiles.forEach((cell) => {
                const active = cell === activeCell;

                cell.classList.toggle(`${this.base}__item--active`, active);
                cell.removeAttribute("aria-selected");
                if (active) {
                    // setAttribute() mutates even when the value is unchanged
                    // (unlike classList.toggle()), and aria-current is watched
                    // by the grid's MutationObserver — guard against rewriting
                    // an already-correct value to avoid re-triggering it.
                    if (cell.getAttribute("aria-current") !== "true") {
                        cell.setAttribute("aria-current", "true");
                    }
                } else {
                    cell.removeAttribute("aria-current");
                }
            });

            this.navigationButtons.forEach((button) => {
                // Not in the Tab sequence: this fixed overlay doesn't move
                // with the pan, so it sits structurally apart from wherever
                // focus actually is in the grid — arrow keys already do the
                // exact same four-direction pan once focus is on any cell or
                // CTA, so this avoids redundant, awkwardly-placed tab stops
                // without losing any keyboard-equivalent functionality.
                button.setAttribute("tabindex", "-1");
            });

            if (activeLabel && options && options.announce === true) {
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
            const direction = NAV_DIRECTIONS.find((d) => d.key === event.key);
            if (!direction) {
                return null;
            }

            return Array.from(this.navigationButtons)
                .find((button) => button.classList.contains(`${this.base}__nav--${direction.suffix}`)) || null;
        }

        isGridInteractionTarget(target) {
            return this.overflow && target && (
                target === this.overflow ||
                (target.closest && target.closest(`.${this.base}__item`))
            );
        }

        handleGridFocusin(event) {
            if (this.hasOpenDialog()) {
                return;
            }

            const cell = event.target.closest && event.target.closest(`.${this.base}__item`);
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
            // this.parent — being an ancestor of an open dialog — stays non-inert
            // and this capture-phase listener would otherwise still see keydowns
            // from inside it (e.g. Enter on the Close button) and hijack them.
            if (this.hasOpenDialog()) {
                return;
            }

            if (isTypingTarget(event.target)) {
                return;
            }

            const navButton = this.navButtonForKey(event);
            if (navButton) {
                if (!this.isGridInteractionTarget(event.target) && event.target !== navButton && !navButton.contains(event.target)) {
                    return;
                }

                stopEvent(event);
                this.navigateByKeyboard(navButton);
                return;
            }

            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            // Enter/Space on a focused "See more" button is handled natively via
            // its own command/commandfor — this is only for Enter/Space landing
            // on the grid cell itself, the roving-tabindex stop.
            const activeCell = this.getCellByKey(this.getActiveKey());

            if (activeCell && this.isGridInteractionTarget(event.target)) {
                stopEvent(event);
                this.activateCell(activeCell);
            }
        }

        observeRuntimeChanges() {
            if (!this.overflow || !window.MutationObserver) {
                return;
            }

            let syncTimeout;
            const observer = new MutationObserver(() => {
                window.clearTimeout(syncTimeout);
                syncTimeout = window.setTimeout(() => {
                    if (Date.now() < this.keyboardManagedUntil) {
                        this.syncGridState({ announce: false });
                        return;
                    }

                    this.syncStateFromVisual({ announce: false, recenter: false });
                }, 50);
            });

            observer.observe(this.overflow, {
                attributes: true,
                attributeFilter: [
                    "aria-activedescendant",
                    "aria-colcount",
                    "aria-current",
                    "aria-rowcount",
                    "aria-selected",
                    "class",
                    "role",
                    "style",
                    "tabindex"
                ],
                childList: true,
                subtree: true
            });

            this._runtimeObserver = observer;
        }

        initAccessibility() {
            this.parent.addEventListener("focusin", this._boundGridFocusin, true);
            this.parent.addEventListener("keydown", this._boundGridKeydown, true);

            // this.bindBusinessAreaDropdown(); // temporarily disabled — see comment above bindBusinessAreaDropdown()
            this.observeRuntimeChanges();

            this.activeKey = "intro";
            this.setActiveKey("intro", { announce: false });
            this.scheduleActiveStateRepair("intro", false);
        }
    }

    // ---- bootstrap ------------------------------------------------------

    function init() {
        if (!document.querySelector(selector)) {
            return null;
        }
        if (gridInstance) {
            return gridInstance;
        }

        const instance = new BusinessAreas(baseClass);
        if (!instance || instance._disabled) {
            return null;
        }

        gridInstance = instance;
        return gridInstance;
    }

    function destroy() {
        if (gridInstance) {
            gridInstance.destroy();
            gridInstance = null;
        }
    }

    document.addEventListener("DOMContentLoaded", init);

    window.capOneBusinessAreas = {
        init,
        destroy,
        getInstance: () => gridInstance
    };
})();
