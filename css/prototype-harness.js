/* =============================================================================
   prototype-harness.js — review chrome for prototypes
   =============================================================================
   Injects the theme/mode switcher every prototype needs for review:

     • web mode (`data-platform="web"` or unset) → floating FAB, bottom-right
     • app mode (`data-platform="app"`)          → Dynamic Island pill controls

   ...plus an optional link to the same screen's other platform variant.

   WHY THIS EXISTS
   ---------------
   This chrome used to be pasted into every prototype: ~86 lines of CSS, ~30
   lines of markup and ~55 lines of JS per file. Because a worked example gets
   read as a model of how to build a screen, that made the review chrome — the
   least system-compliant code in the repo — the majority of what was read.
   A prototype now carries one script tag, and product markup is all that is
   left in it.

   The theme list is not written here: it is read from the loaded stylesheets,
   so a new theme in themes.css shows up in the switcher on its own.

   USAGE — include in <head>, immediately after ds-loader.js and BEFORE
   device-sync.js (which wires itself to the controls this script injects):

     <script src="../css/ds-loader.js"></script>
     <script src="../css/prototype-harness.js" data-native="index.native.html"></script>
     <script src="../css/device-sync.js"></script>

   Optional attributes on the script tag:
     data-native="index.native.html"  → adds a "View as App" link
     data-web="index.web.html"        → adds a "View as Web" link
     data-harness="off"               → skip injection entirely

   The same two switches as query params on the page URL, for an EMBEDDER — a
   tool that frames a template cannot reach the script tag's attributes:
     ?harness=off                     → skip injection entirely
     ?platformLink=off                → keep the team/mode control, drop the
                                        cross-platform link
     ?surfaces=show                   → outline any element sitting on a
                                        background identical to its own
                                        (RULES §2); they are warned about in
                                        the console either way
   The link is `position: fixed` to the viewport corner, so in a frame narrower
   than a laptop it lands on top of the phone instead of below it, and it points
   at a sibling file the embedder is not showing. It hides itself at ≤500px for
   real phones; the app-mode preview frame is 501px wide by design (the rounded
   -corner trick), which is exactly one pixel too many.

   Styles live in `css/platform-tokens.css` under PROTOTYPE REVIEW CHROME.
   ============================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------------
     THEMES and DISPLAY FACES — discovered from the loaded CSS, so adding a
     theme to themes.css or a face to display-fonts.css puts it in the switcher
     with no edit here. Cross-origin sheets throw on cssRules; those are skipped
     and FALLBACK_THEMES covers the case where every sheet is unreadable.
     --------------------------------------------------------------------------- */
  var FALLBACK_THEMES = [
    { value: '',       label: 'Base' },
    { value: 'ink',    label: 'Ink' },
    { value: 'signal', label: 'Signal' },
    { value: 'moss',   label: 'Moss' },
    { value: 'ember',  label: 'Ember' },
    { value: 'violet', label: 'Violet' },
  ];

  function titleCase(slug) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, function (m) { return m.toUpperCase(); });
  }

  /* Collect every value of `attr` that appears in an attribute selector across
     the loaded stylesheets, in document order, de-duplicated. */
  function discover(attr) {
    var re = new RegExp('\\[' + attr + '="([^"]+)"\\]', 'g');
    var seen = Object.create(null);
    var out = [];
    for (var i = 0; i < document.styleSheets.length; i++) {
      var rules;
      try { rules = document.styleSheets[i].cssRules; } catch (e) { continue; }
      if (!rules) continue;
      for (var j = 0; j < rules.length; j++) {
        var sel = rules[j].selectorText;
        if (!sel) continue;
        var m;
        re.lastIndex = 0;
        while ((m = re.exec(sel))) {
          if (!seen[m[1]]) { seen[m[1]] = 1; out.push({ value: m[1], label: titleCase(m[1]) }); }
        }
      }
    }
    return out;
  }

  var THEMES = null;
  function themes() {
    if (THEMES) return THEMES;
    var found = discover('data-theme');
    THEMES = found.length
      ? [{ value: '', label: 'Base' }].concat(found)
      : FALLBACK_THEMES;
    return THEMES;
  }

  var FACES = null;
  function faces() {
    if (FACES) return FACES;
    FACES = [{ value: '', label: 'Theme default' }].concat(discover('data-display-font'));
    return FACES;
  }


  var MODES = [
    { value: 'dark',  label: 'Dark' },
    { value: 'light', label: 'Light' },
  ];

  var K_THEME = 'template-theme';
  var K_MODE = 'template-mode';
  var K_FACE = 'template-display-font';

  var html = document.documentElement;
  var script =
    document.currentScript ||
    Array.prototype.slice
      .call(document.getElementsByTagName('script'))
      .filter(function (s) {
        return (s.src || '').indexOf('prototype-harness.js') !== -1;
      })
      .pop();

  /* dataset is authoring-time config; the query string is embed-time config for
     whoever is framing this page. Copied to a plain object so the overrides
     below can write to it — a script's dataset is a live DOMStringMap and
     assigning through it would rewrite the tag's attributes. */
  var cfg = {};
  var ds = (script && script.dataset) || {};
  for (var k in ds) cfg[k] = ds[k];

  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { params = null; }
  var param = function (name) { return params ? params.get(name) : null; };

  if (cfg.harness === 'off' || param('harness') === 'off') return;
  if (param('platformLink') === 'off') { cfg.native = ''; cfg.web = ''; }

  /* ---------- 1. Restore the last reviewed theme/mode, before first paint ----- */

  try {
    var savedTheme = localStorage.getItem(K_THEME);
    var savedMode = localStorage.getItem(K_MODE);
    var savedFace = localStorage.getItem(K_FACE);
    if (savedTheme) html.setAttribute('data-theme', savedTheme);
    if (savedMode) html.setAttribute('data-mode', savedMode);
    if (savedFace) html.setAttribute('data-display-font', savedFace);
  } catch (e) {
    /* private browsing — fall through to the markup's own attributes */
  }

  /* ---------- 2. Helpers ----------------------------------------------------- */

  function options(list, selected) {
    return list
      .map(function (o) {
        return (
          '<option value="' +
          o.value +
          '"' +
          (o.value === selected ? ' selected' : '') +
          '>' +
          o.label +
          '</option>'
        );
      })
      .join('');
  }

  function themeOptions(selected) {
    return options(themes(), selected);
  }

  function icon(name, cls) {
    return (
      '<span class="material-symbols-rounded' +
      (cls ? ' ' + cls : '') +
      '" aria-hidden="true">' +
      name +
      '</span>'
    );
  }

  function currentTheme() {
    return html.getAttribute('data-theme') || '';
  }

  function currentMode() {
    return html.getAttribute('data-mode') || 'dark';
  }

  function currentFace() {
    return html.getAttribute('data-display-font') || '';
  }

  function persist(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* nothing to do — the attribute is still applied for this session */
    }
  }

  function isApp() {
    return html.getAttribute('data-platform') === 'app';
  }

  /* ---------- 3. Web chrome — floating FAB ----------------------------------- */

  function buildWebChrome() {
    var link = cfg.native
      ? '<a class="template-fab-link labelBold10" href="' +
        cfg.native +
        '" target="_blank" rel="noopener">' +
        '<span>View as App</span>' +
        icon('phone_iphone') +
        '</a>'
      : cfg.web
        ? '<a class="template-fab-link labelBold10" href="' +
          cfg.web +
          '" target="_blank" rel="noopener">' +
          '<span>View as Web</span>' +
          icon('monitor') +
          '</a>'
        : '';

    var fab = document.createElement('div');
    fab.className = 'template-fab';
    fab.id = 'template-fab';
    fab.innerHTML =
      '<div class="template-fab-panel">' +
      '<label><span class="labelBold10">Theme</span>' +
      '<select id="theme-select" class="labelBold10" aria-label="Theme">' +
      themeOptions(currentTheme()) +
      '</select></label>' +
      '<label><span class="labelBold10">Mode</span>' +
      '<select id="mode-select" class="labelBold10" aria-label="Mode">' +
      options(MODES, currentMode()) +
      '</select></label>' +
      /* Only shown when display-fonts.css is loaded — faces() finds nothing
         otherwise and a one-option picker is worse than no picker. */
      (faces().length > 1
        ? '<label><span class="labelBold10">Display face</span>' +
          '<select id="face-select" class="labelBold10" aria-label="Display face">' +
          options(faces(), currentFace()) +
          '</select></label>'
        : '') +
      link +
      '</div>' +
      '<button class="template-fab-trigger" aria-label="Toggle prototype controls" aria-expanded="false">' +
      icon('tune') +
      '</button>';

    document.body.appendChild(fab);

    var trigger = fab.querySelector('.template-fab-trigger');
    var glyph = trigger.querySelector('.material-symbols-rounded');
    var themeSelect = fab.querySelector('#theme-select');
    var modeSelect = fab.querySelector('#mode-select');
    var faceSelect = fab.querySelector('#face-select');
    var closeTimer;

    function setOpen(open) {
      fab.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
      glyph.textContent = open ? 'close' : 'tune';
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        setOpen(false);
      }, 800);
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!fab.classList.contains('open'));
    });

    document.addEventListener('click', function (e) {
      if (!fab.contains(e.target) && fab.classList.contains('open')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && fab.classList.contains('open')) setOpen(false);
    });

    themeSelect.addEventListener('change', function () {
      html.setAttribute('data-theme', this.value);
      persist(K_THEME, this.value);
      scheduleClose();
    });

    modeSelect.addEventListener('change', function () {
      html.setAttribute('data-mode', this.value);
      persist(K_MODE, this.value);
      scheduleClose();
    });

    if (faceSelect) {
      faceSelect.addEventListener('change', function () {
        /* '' means "whatever the theme says" — the attribute has to come off,
           not be set empty, or [data-display-font=""] would match nothing and
           the theme's own ramp would still be overridden by specificity. */
        if (this.value) html.setAttribute('data-display-font', this.value);
        else html.removeAttribute('data-display-font');
        persist(K_FACE, this.value);
        scheduleClose();
      });
    }

    return function syncWeb() {
      themeSelect.value = currentTheme();
      modeSelect.value = currentMode();
      if (faceSelect) faceSelect.value = currentFace();
    };
  }

  /* ---------- 4. App chrome — Dynamic Island pill ---------------------------- */

  function buildAppChrome() {
    var box = document.createElement('div');
    box.className = 'app-device-controls';
    box.innerHTML =
      '<button class="mode-toggle" aria-label="Toggle light or dark mode">' +
      icon(currentMode() === 'dark' ? 'dark_mode' : 'light_mode') +
      '</button>' +
      '<label>' +
      '<span class="device-control-label"></span>' +
      icon('arrow_drop_down') +
      '<select aria-label="Team">' +
      themeOptions(currentTheme()) +
      '</select>' +
      '</label>';

    document.body.appendChild(box);

    var modeBtn = box.querySelector('.mode-toggle');
    var modeGlyph = modeBtn.querySelector('.material-symbols-rounded');
    var label = box.querySelector('.device-control-label');
    var select = box.querySelector('select');

    modeBtn.addEventListener('click', function () {
      var next = currentMode() === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-mode', next);
      persist(K_MODE, next);
    });

    select.addEventListener('change', function () {
      html.setAttribute('data-theme', this.value);
      persist(K_THEME, this.value);
    });

    if (cfg.web) {
      var a = document.createElement('a');
      a.className = 'template-platform-link labelBold10';
      a.href = cfg.web;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = icon('monitor') + '<span>View as Web</span>';
      document.body.appendChild(a);
    }

    return function syncApp() {
      var theme = currentTheme();
      select.value = theme;
      var match = themes().filter(function (t) {
        return t.value === theme;
      })[0];
      label.textContent = match ? match.label : (theme || 'Base');
      modeGlyph.textContent = currentMode() === 'dark' ? 'dark_mode' : 'light_mode';
    };
  }

  /* ---------- 5. Inject, then keep in sync with <html> ----------------------- */

  function setup() {
    // A template that still carries hand-written chrome keeps it — no doubles.
    if (document.getElementById('template-fab')) return;
    if (document.querySelector('.app-device-controls')) return;

    var sync = isApp() ? buildAppChrome() : buildWebChrome();
    sync();

    // Anything else that changes the theme (device-sync, content-loader, a
    // template's own controls) is reflected back into the switcher.
    new MutationObserver(sync).observe(html, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mode', 'data-display-font'],
    });
  }


  /* ==========================================================================
     Surface-on-surface guard (RULES §2)
     ==========================================================================
     "Never sit a solid surface on another solid surface." The rule is old; the
     mistake kept happening anyway, including on the sticker sheet whose job is
     to demonstrate surfaces. It is invisible by construction — a .surface-card
     on a --bg-surface parent looks like *nothing* at rest and only appears when
     you hover it, so the person building it sees a working component and the
     person reading the screen sees a blank box.

     A class-name check cannot find it: the parent is usually a page-local class
     that happens to set `background: var(--bg-surface)`, not a .surface-* class.
     So this compares what the browser actually painted.

     Fires once at load, warns in the console, and outlines the offenders when
     you pass ?surfaces=show. Never runs on a deployed page — it is part of the
     review chrome, and it is skipped along with the rest when harness=off. */
  function checkSurfaces() {
    var TRANSPARENT = /^(transparent|rgba\(0,\s*0,\s*0,\s*0\))$/;
    var painted = function (el) {
      var bg = getComputedStyle(el).backgroundColor;
      return TRANSPARENT.test(bg) ? null : bg;
    };

    /* The elements that are *supposed* to read as their own surface. A
       transparent-at-rest surface (.surface-ghost, .surface-section,
       .surface-wash*) is exempt by definition — inheriting the parent's
       background is the whole design. */
    var candidates = document.querySelectorAll(
      '[class*="surface-fill"],[class*="surface-border"],.surface-card,' +
      '.card-closed,.card-closed-interactive,.card-open-section,' +
      '.card-open-section-interactive,.tile,.event-row,.event-card'
    );

    var hits = [];
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (el.closest('[data-surface-on-surface]')) continue;  // documented exception
      var own = painted(el);
      if (!own) continue;                                     // transparent at rest — fine
      for (var p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
        var bg = painted(p);
        if (!bg) continue;                                    // keep walking past transparent wrappers
        if (bg === own) hits.push({ el: el, parent: p, bg: bg });
        break;                                                // only the nearest painted ancestor matters
      }
    }
    if (!hits.length) return;

    var show = param('surfaces') === 'show';
    console.warn(
      '[ds] ' + hits.length + ' element(s) sit on a background identical to their own — ' +
      'invisible until hovered (RULES §2, "never sit a solid surface on another solid surface"). ' +
      (show ? 'Outlined in red on the page.' : 'Re-open with ?surfaces=show to outline them.')
    );
    for (var h = 0; h < hits.length; h++) {
      var hit = hits[h];
      console.warn(
        '  ' + describe(hit.el) + '\n    sits on ' + describe(hit.parent) +
        '\n    both paint ' + hit.bg +
        '\n    fix: on a card use .surface-washNeutral, or .surface-section if it is a band of that card'
      );
      if (show) {
        hit.el.style.outline = '2px solid red';
        hit.el.style.outlineOffset = '-2px';
      }
    }
  }

  function describe(el) {
    var out = el.tagName.toLowerCase();
    if (el.id) out += '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      out += '.' + el.className.trim().split(/\s+/).join('.');
    }
    return out;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    setup();
    /* after a tick, so content-loader and any template renderer have painted */
    setTimeout(checkSurfaces, 0);
  }
})();
