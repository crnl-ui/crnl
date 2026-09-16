/* ============================================================
   ds-loader.js
   ============================================================
   Loads the design-system stylesheets in the right order.

   Notes
   - This file owns the CSS load order; pages never hand-write <link> tags.
     See RULES §1. Everything that needs the list derives it from the `sheets`
     array below via scripts/lib/load-order.mjs.
   - Local pages get the individual stylesheets so an edit-and-reload loop needs
     no build step; deployed pages get the concatenated ds.css instead, with
     a fallback to the individual sheets if it is absent.
   - The base path is resolved from this script's own URL, so the system can be
     served from any directory or origin with no configuration.
   - Usage: <script src="../css/ds-loader.js"></script> (adjust the relative
     path to where the page lives).
   ============================================================ */
(function () {
  var script = document.currentScript;

  /* Local means "the sheets on disk are the truth" — inject them individually so
     `edit CSS → reload` needs no build step. Anything else takes the bundle.
     `[::1]` is localhost over IPv6 and browsers do reach the dev server on it;
     leaving it out meant a local page silently served a possibly stale bundle
     and CSS edits appeared not to take. */
  var isLocal =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname === '[::1]' ||
    location.hostname === '::1' ||
    location.protocol === 'file:';

  // Resolve the base path from this script's own URL, so a page at any depth
  // and a site served from any origin both find the sheets.
  var base = script.src.replace(/[^/]*$/, '');   // directory containing ds-loader.js

  /* ── Font-gate: hide body until icon + text fonts are ready ────────────
     Prevents the flash of raw icon names ("home", "sell", etc.) while
     Material Symbols is still fetching. Applies to every page that loads
     ds-loader.js. Reveals when the fonts have loaded or after a 2s
     safety timeout, whichever comes first. Opt out per-page by adding
     data-no-font-gate="true" on <html>. */
  var htmlEl = document.documentElement;
  if (!htmlEl.hasAttribute('data-no-font-gate')) {
    var gateStyle = document.createElement('style');
    gateStyle.textContent =
      /* Hide body while fonts load */
      'html.ds-fonts-loading body { opacity: 0; }' +
      'html:not(.ds-fonts-loading) body { transition: opacity 150ms ease-out; }' +
      /* Loading spinner — appears in center of viewport after a 400ms delay
         (fast loads never see it), fades in over 250ms, then spins until
         the gate lifts and it disappears with the .ds-fonts-loading class.
         Mid-gray color reads on both light and dark backdrops. */
      'html.ds-fonts-loading::before {' +
        'content: "";' +
        'position: fixed;' +
        'top: 50%; left: 50%;' +
        'width: 28px; height: 28px;' +
        'margin: -14px 0 0 -14px;' +
        'border: 2.5px solid rgba(128,128,128,0.22);' +
        'border-top-color: rgba(128,128,128,0.9);' +
        'border-radius: 50%;' +
        'z-index: 999999;' +
        'pointer-events: none;' +
        'opacity: 0;' +
        'animation:' +
          'ds-gate-spin 0.7s linear infinite,' +
          'ds-gate-fade-in 250ms 400ms forwards;' +
      '}' +
      '@keyframes ds-gate-spin { to { transform: rotate(360deg); } }' +
      '@keyframes ds-gate-fade-in { to { opacity: 1; } }';
    document.head.appendChild(gateStyle);
    htmlEl.classList.add('ds-fonts-loading');

    var reveal = function () { htmlEl.classList.remove('ds-fonts-loading'); };
    var fired = false;
    var revealOnce = function () { if (!fired) { fired = true; reveal(); } };

    // Safety timeout — hard ceiling in case Google Fonts is slow or fails.
    // 3s gives cold-cache CDN fetches enough time; anything longer just makes
    // the page feel broken. Fallback fonts are acceptable at that point.
    setTimeout(revealOnce, 3000);

    if (document.fonts && document.fonts.load) {
      // Gate ONLY on Material Symbols Rounded. When this font isn't loaded,
      // icons render as raw text ("home", "sell", "confirmation_number") which
      // is jarring. Inter and team display fonts have reasonable system
      // fallbacks (SF Pro / Segoe UI) so a brief fallback flash on those is
      // acceptable — waiting for them delays reveal on slow networks.
      //
      // Poll document.fonts.load() because it returns [] (empty) while the
      // Google Fonts stylesheet is still fetching — the @font-face isn't
      // declared yet. check() returns TRUE in that state (falls back to system),
      // which would lift the gate too early.
      var pollFonts = function () {
        document.fonts.load('16px "Material Symbols Rounded"').then(function (arr) {
          if (arr.length > 0 && arr.every(function (f) { return f.status === 'loaded'; })) {
            revealOnce();
          } else if (!fired) {
            setTimeout(pollFonts, 40);
          }
        }, function () {
          if (!fired) setTimeout(pollFonts, 40);
        });
      };
      pollFonts();
    } else {
      // Old browsers — short-delay reveal
      setTimeout(revealOnce, 300);
    }
  }

  var sheets = [
    'design-tokens-master.css',
    'themes.css',
    'spacing-tokens.css',
    'container-tokens.css',
    'border-effects-tokens.css',
    'fonts.css',
    'display-fonts.css',
    'text-styles-system.css',
    'icons.css',
    'card-components.css',
    'interactive-tokens.css',
    'button-components.css',
    'system-ui.css',
    'list-row-components.css',
    'table-components.css',
    'input-components.css',
    'tag-chip-components.css',
    'nav-components.css',
    'ios-nav-components.css',
    'web-footer-components.css',
    'product-patterns.css',
    'boilerplate.css',
    'platform-tokens.css'
  ];

  var injectSheets = function () {
    sheets.forEach(function (name) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = base + name;
      document.head.appendChild(link);
    });
  };

  /* Locally, inject the individual stylesheets — editing one and reloading has
     to work with no build step in between. Anywhere else, take the concatenated
     bundle: one request rather than 23, because this script is render-blocking
     and every <link> it injects waits on it. `npm run build:css-bundle` writes
     ds.css; it is gitignored.

     If the bundle is missing — a checkout that never ran the build, or a LAN
     address where isLocal is false — fall back to the individual sheets rather
     than rendering the page unstyled. */
  if (isLocal) {
    injectSheets();
  } else {
    var bundle = document.createElement('link');
    bundle.rel = 'stylesheet';
    bundle.href = base + 'ds.css';
    bundle.onerror = function () {
      bundle.remove();
      injectSheets();
    };
    document.head.appendChild(bundle);
  }

  /* ── Triple-tap → toggle device controls on mobile ── */
  var tapCount = 0;
  var tapTimer = null;
  document.addEventListener('click', function (e) {
    var ctrl = document.querySelector('.app-device-controls');
    if (!ctrl) return;

    /* Close on tap outside when open */
    if (ctrl.classList.contains('is-open') && !ctrl.contains(e.target)) {
      ctrl.classList.remove('is-open');
      return;
    }

    /* Triple-tap detection (mobile only) */
    if (window.innerWidth <= 500 && !ctrl.contains(e.target)) {
      tapCount++;
      if (tapCount === 1) {
        tapTimer = setTimeout(function () { tapCount = 0; }, 500);
      }
      if (tapCount >= 3) {
        clearTimeout(tapTimer);
        tapCount = 0;
        ctrl.classList.toggle('is-open');
      }
    }
  });
}());
