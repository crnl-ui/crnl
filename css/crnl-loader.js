/* ============================================================
   crnl-loader.js
   ============================================================
   Loads the design-system stylesheets in the right order.

   Notes
   - This file owns the CSS load order; pages never hand-write <link> tags.
     See RULES §1. Everything that needs the list derives it from the `sheets`
     array below via scripts/lib/load-order.mjs.
   - Local pages get the individual stylesheets so an edit-and-reload loop needs
     no build step; deployed pages get the concatenated crnl.css instead, with
     a fallback to the individual sheets if it is absent.
   - The base path is resolved from this script's own URL, so the system can be
     served from any directory or origin with no configuration.
   - Usage: <script src="../css/crnl-loader.js"></script> (adjust the relative
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
  var base = script.src.replace(/[^/]*$/, '');   // directory containing crnl-loader.js

  var htmlEl = document.documentElement;

  /* There used to be a font gate here: ~70 lines that hid <body> behind a
     spinner until Material Symbols had loaded, with a 3s timeout.

     It existed because an icon is a ligature over its own name, so an icon font
     on `font-display: swap` renders "home", "sell", "confirmation_number" as
     words until it arrives. Hiding the page was the workaround.

     The fix was `font-display: block` on that one @font-face (see
     ui-fonts.css) — the browser holds the icons invisible and paints the rest
     of the page immediately, which is what the gate was approximating badly.
     Self-hosting the font made the block period a few milliseconds instead of
     a CDN round trip. Both fonts now ship from fonts/, so a page renders the
     same offline as online, and `data-no-font-gate` is no longer read. */

  var sheets = [
    'reset.css',
    'design-tokens-master.css',
    'themes.css',
    'spacing-tokens.css',
    'container-tokens.css',
    'border-effects-tokens.css',
    'ui-fonts.css',
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

  /* ── Cascade layers ──────────────────────────────────────────────────────
     The system declares its own layers so that anything a consumer writes —
     unlayered, in their own stylesheet — beats all of it without a
     specificity fight and without !important. That is what makes the CSS
     ownable rather than merely forkable: unlayered styles always win over
     layered ones, whatever their specificity.

     Each entry is [layer name, index of the last sheet in it]. Defining the
     boundaries by position rather than by listing filenames twice means the
     groups are contiguous in load order by construction, so the relative
     precedence of any two sheets is exactly what it was before layers
     existed. A layer that skipped around the list would silently reorder the
     cascade.

     scripts/lib/load-order.mjs parses this, so the bundle builder wraps each
     sheet in the same layer this injects it into. Two copies of this list
     would be two cascades. */
  var layers = [
    ['reset',      1],   // 1     element defaults and the box-sizing reset
    ['tokens',     9],   // 2–9   colour, spacing, containers, borders, fonts
    ['primitives', 11],  // 10–11 the type scale and the icon system
    ['components', 22],  // 12–22 every component, incl. the surface ladder
    ['patterns',   23],  // 23    composite layouts above the component layer
    ['utilities',  24],  // 24    boilerplate: the utility scales
    ['platform',   25]   // 25    the web/app switch and the phone frame
  ];

  var layerOf = function (index) {
    for (var i = 0; i < layers.length; i++) {
      if (index < layers[i][1]) return 'crnl.' + layers[i][0];
    }
    return 'crnl.' + layers[layers.length - 1][0];
  };

  /* The layer order statement has to come first and name every layer, because
     a layer's position is fixed the first time it is mentioned. Declaring
     them all up front means the order does not depend on which sheet happens
     to load first. */
  var layerStatement = function () {
    return '@layer ' + layers.map(function (l) { return 'crnl.' + l[0]; }).join(', ') + ';';
  };

  /* @import rather than <link>, because the `layer` attribute on <link> is
     not supported anywhere yet, and @import url(…) layer(…) is supported
     everywhere @layer itself is. It serialises the requests, which is the
     cost of the local path — and the local path is the one where a round
     trip does not matter, because the files are on disk. */
  var injectSheets = function () {
    var style = document.createElement('style');
    style.textContent =
      layerStatement() + '\n' +
      sheets.map(function (name, i) {
        return "@import url('" + base + name + "') layer(" + layerOf(i) + ");";
      }).join('\n');
    document.head.appendChild(style);
  };

  /* Locally, inject the individual stylesheets — editing one and reloading has
     to work with no build step in between. Anywhere else, take the concatenated
     bundle: one request rather than 23, because this script is render-blocking
     and every <link> it injects waits on it. `npm run build:css-bundle` writes
     crnl.css; it is gitignored.

     If the bundle is missing — a checkout that never ran the build, or a LAN
     address where isLocal is false — fall back to the individual sheets rather
     than rendering the page unstyled. */
  if (isLocal) {
    injectSheets();
  } else {
    var bundle = document.createElement('link');
    bundle.rel = 'stylesheet';
    bundle.href = base + 'crnl.css';
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
