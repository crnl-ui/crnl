/* =============================================================================
   device-sync.js — "Link theme across screens" for app-mode prototypes
   =============================================================================
   Adds a link toggle to the floating Dynamic Island device controls
   (.app-device-controls). When ON, the selected theme + light/dark mode are
   shared across every open prototype screen on the same origin — change the
   theme on one tab and every other linked tab follows, live.

   Mechanism:
     • localStorage holds the shared theme/mode + the on/off flag
     • the `storage` event (fires in OTHER tabs on write) drives live sync
     • a MutationObserver on <html> persists the local selection when linked

   No markup changes needed per template — include this script and it wires
   itself to whatever .app-device-controls exists on the page. It also applies
   the shared theme synchronously at load, so there is no flash of the wrong one.

   Include AFTER crnl-loader.js:
     <script src="../css/device-sync.js"></script>
   ============================================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var THEME_ATTR = 'data-theme';
  var MODE_ATTR = 'data-mode';

  // localStorage keys (namespaced so they never collide with prototype data)
  var K_ON = 'crnl:link:on';
  var K_THEME = 'crnl:link:theme';
  var K_MODE = 'crnl:link:mode';

  // Is this document a screen a person can actually operate? Both a top-level tab
  // and an embedded-but-interactive iframe qualify — a page showing several screens
  // side by side is exactly when linking earns its keep.
  //
  // What doesn't qualify is a preview thumbnail: the docs-site templates gallery
  // renders each template as a scaled-down, `pointer-events: none`, `aria-hidden`
  // iframe. You can't touch its controls, so it shouldn't count toward the screen
  // tally or draw a toggle of its own.
  var isScreen = (function () {
    var frame;
    try {
      if (window.self === window.top) return true;
      frame = window.frameElement; // null when the embedding page is cross-origin
    } catch (e) { return false; }
    if (!frame) return false;      // can't inspect it — stay out rather than guess
    return isInteractiveFrame(frame);
  })();

  // ---------- storage helpers (private-mode safe) ----------
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function linked() { return read(K_ON) === '1'; }

  function currentTheme() { return html.getAttribute(THEME_ATTR); }
  function currentMode() { return html.getAttribute(MODE_ATTR); }

  // ---------- apply / persist ----------
  // Push the shared theme/mode onto this screen (only sets an attribute when it
  // actually differs, so the observer below never ping-pongs across tabs).
  function applyShared() {
    var t = read(K_THEME), m = read(K_MODE);
    if (t && html.getAttribute(THEME_ATTR) !== t) html.setAttribute(THEME_ATTR, t);
    if (m && html.getAttribute(MODE_ATTR) !== m) html.setAttribute(MODE_ATTR, m);
    reflectControls();
  }

  // Save this screen's current selection as the shared value (when linked).
  function persist() {
    if (!linked()) return;
    var t = currentTheme(), m = currentMode();
    if (t && read(K_THEME) !== t) write(K_THEME, t); // write only on real change → no storage-event loop
    if (m && read(K_MODE) !== m) write(K_MODE, m);
  }

  // ---------- EARLY: apply the shared theme before first paint ----------
  // Runs at script eval (document still parsing) so <html data-theme> is correct
  // before anything reads it on DOMContentLoaded — no wrong-theme flash.
  if (linked()) {
    var et = read(K_THEME), em = read(K_MODE);
    if (et) html.setAttribute(THEME_ATTR, et);
    if (em) html.setAttribute(MODE_ATTR, em);
  }

  // ---------- reflect state into the visible controls ----------
  function reflectControls() {
    var box = document.querySelector('.app-device-controls');
    if (!box) return;
    var t = currentTheme(), m = currentMode();
    var sel = box.querySelector('select');
    if (sel && t && sel.value !== t) sel.value = t;
    var lbl = box.querySelector('.device-control-label');
    if (lbl && sel && sel.options[sel.selectedIndex]) lbl.textContent = sel.options[sel.selectedIndex].text;
    var modeIcon = box.querySelector('.mode-toggle .material-symbols-rounded');
    if (modeIcon && m) modeIcon.textContent = m === 'dark' ? 'dark_mode' : 'light_mode';
  }

  function reflectLinkButton() {
    var btn = document.querySelector('.device-link-toggle');
    if (!btn) return;
    var on = linked();
    btn.classList.toggle('is-linked', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = on
      ? 'Theme & mode linked across open screens — click to unlink'
      : 'Link theme & mode across all open screens';
    var icon = btn.querySelector('.material-symbols-rounded');
    if (icon) icon.textContent = on ? 'link' : 'link_off';
  }

  // ---------- how many screens are on this page? ----------
  // Linking is only meaningful when the page shows more than one screen — font-lab
  // renders several templates side by side, and changing theme or mode in one should
  // carry to the rest. A template open on its own page has nothing to link to, so
  // the toggle stays hidden there.
  //
  // Deliberately scoped to the current page, not the browser: other tabs are ignored
  // entirely, so a lone template never grows a toggle just because another tab
  // happens to be open. (Linking still *syncs* across tabs once switched on — that
  // rides on localStorage below. This only governs when the control is offered.)
  function isInteractiveFrame(frame) {
    if (frame.getAttribute('aria-hidden') === 'true') return false;
    try {
      if (frame.ownerDocument.defaultView.getComputedStyle(frame).pointerEvents === 'none') return false;
    } catch (e) {}
    return true;
  }

  function screenCountOnPage() {
    var topDoc;
    try { topDoc = window.top.document; } catch (e) { return 1; } // cross-origin host — assume alone
    // The host page itself counts when it's a screen (a standalone template tab).
    var n = topDoc.querySelector('.app-device-controls') ? 1 : 0;
    var frames = topDoc.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      if (!isInteractiveFrame(frames[i])) continue; // preview thumbnail, not an operable screen
      try {
        var d = frames[i].contentDocument;
        if (d && d.querySelector('.app-device-controls')) n++;
      } catch (e) {} // cross-origin frame — not ours to count
    }
    return n;
  }

  // Show the toggle only once a second screen shares the page.
  function reflectLinkVisibility() {
    var btn = document.querySelector('.device-link-toggle');
    if (!btn) return;
    btn.style.display = screenCountOnPage() > 1 ? '' : 'none';
  }

  function setLinked(on) {
    write(K_ON, on ? '1' : '0');
    if (on) { // this screen becomes the source of truth the moment you link it
      write(K_THEME, currentTheme());
      write(K_MODE, currentMode());
    }
    reflectLinkButton();
  }

  // ---------- inject the link toggle into the device-controls pill ----------
  function injectStyles() {
    if (document.getElementById('crnl-device-sync-styles')) return;
    var css =
      '[data-platform="app"] .app-device-controls .device-link-toggle{' +
        'display:flex;align-items:center;justify-content:center;border:none;background:transparent;' +
        'cursor:pointer;padding:0 8px;height:100%;position:relative;color:var(--white-300);font-family:inherit;}' +
      '[data-platform="app"] .app-device-controls .device-link-toggle .material-symbols-rounded{font-size:16px;color:inherit;}' +
      '[data-platform="app"] .app-device-controls .device-link-toggle::before{content:"";position:absolute;left:0;' +
        'top:25%;height:50%;width:1px;background:var(--white-200);}' +
      '[data-platform="app"] .app-device-controls .device-link-toggle:hover{color:var(--white-1000);}' +
      '[data-platform="app"] .app-device-controls .device-link-toggle.is-linked{color:var(--white-1000);}' +
      '@media (max-width:500px){' +
        '[data-platform="app"] .app-device-controls .device-link-toggle{padding:0 12px!important;height:100%!important;color:var(--white-300)!important;}' +
        '[data-platform="app"] .app-device-controls .device-link-toggle .material-symbols-rounded{font-size:20px!important;}' +
        '[data-platform="app"] .app-device-controls .device-link-toggle.is-linked{color:var(--white-1000)!important;}}';
    var style = document.createElement('style');
    style.id = 'crnl-device-sync-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectButton() {
    if (!isScreen) return; // previews embedded in an iframe get no link affordance
    var box = document.querySelector('.app-device-controls');
    if (!box || box.querySelector('.device-link-toggle')) return;
    var btn = document.createElement('button');
    btn.style.display = 'none'; // revealed by reflectLinkVisibility once a peer exists
    btn.type = 'button';
    btn.className = 'device-link-toggle';
    btn.innerHTML = '<span class="material-symbols-rounded">link_off</span>';
    btn.addEventListener('click', function () { setLinked(!linked()); });
    box.appendChild(btn); // append (after the theme <label>) so the mode-toggle+label divider stays intact
  }

  // ---------- wire up on DOM ready ----------
  function setup() {
    injectStyles();
    injectButton();
    reflectControls();   // in case the early-apply above changed the theme before controls existed
    reflectLinkButton();

    // Sibling frames on a host page like font-lab may still be loading when this one
    // initialises, and can be added or removed later, so re-check rather than decide
    // once. The check is a cheap DOM query against the host document.
    reflectLinkVisibility();
    setInterval(reflectLinkVisibility, 1000);

    // Persist local changes (dropdown, mode toggle, or any attribute change) when linked.
    new MutationObserver(persist).observe(html, {
      attributes: true,
      attributeFilter: [THEME_ATTR, MODE_ATTR],
    });

    // Live cross-tab sync: react to writes from OTHER tabs.
    window.addEventListener('storage', function (e) {
      if (!e.key) return; // ignore localStorage.clear()
      if (e.key === K_ON) {
        reflectLinkButton();
        if (linked()) applyShared();
      } else if ((e.key === K_THEME || e.key === K_MODE) && linked()) {
        applyShared();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
