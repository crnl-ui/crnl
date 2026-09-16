/* ============================================================
   sheet.js — shared behaviour for the sticker sheet
   ============================================================
   Three jobs:
   1. Render the cross-sheet navigation from one manifest (below), so
      adding a sheet is a one-line change.
   2. Resolve token values live out of getComputedStyle, so every value
      printed on the page is what the browser actually has — and re-resolve
      them when the theme or mode changes.
   3. Fill the handful of photographic slots from the demo content layer, so
      no name or asset path is typed into these pages (RULES §6).
   ============================================================ */
(function () {
  const SHEETS = [
    ['index.html',        'Overview'],
    ['01-color.html',     'Color'],
    ['02-type.html',      'Type'],
    ['03-space.html',     'Space & Layout'],
    ['04-buttons.html',   'Buttons'],
    ['05-surfaces.html',  'Surfaces'],
    ['06-cards.html',     'Cards & Tiles'],
    ['07-rows.html',      'Rows, Tags & Controls'],
    ['08-forms.html',     'Forms'],
    ['09-nav.html',       'Nav & Patterns'],
    ['10-tables.html',    'Tables'],
    ['11-ios.html',       'iOS / App'],
  ];

  /* ---------- Navigation ---------------------------------------------- */

  const here = location.pathname.split('/').pop() || 'index.html';

  /* A left rail rather than a top strip: twelve sheets do not fit on one line,
     and the rail has room to nest the current sheet's own sections under it —
     which is the navigation you actually want once a sheet is 70KB long.
     Below 1100px it becomes the horizontal strip again (RULES §9). */
  function renderNav() {
    const mount = document.querySelector('[data-sheet-nav]');
    if (!mount) return;
    document.body.classList.add('has-rail');
    /* The page markup is just <nav data-sheet-nav></nav> — the attribute is the
       mount point and the class is ours to add, so a sheet never has to know
       what the nav looks like. */
    mount.classList.add('sheet-nav');

    const inner = document.createElement('div');
    inner.className = 'sheet-nav-inner';

    const brand = document.createElement('a');
    brand.className = 'sheet-nav-brand';
    brand.href = 'index.html';
    brand.innerHTML =
      '<span class="labelBold30">Sticker Sheet</span>' +
      '<span class="labelRegular10 text-secondary">Every class, rendered live</span>';
    inner.appendChild(brand);

    for (const [href, label] of SHEETS) {
      const isHere = href === here;
      const a = document.createElement('a');
      a.className = 'sheet-nav-link labelRegular20' + (isHere ? ' is-active' : '');
      a.href = href;
      a.textContent = label;
      inner.appendChild(a);
      if (isHere) inner.appendChild(renderSections());
    }

    mount.appendChild(inner);
    spySections();
  }

  /* The sections of the sheet you are on, read off the page rather than
     listed a second time — a new section appears here by existing. */
  function renderSections() {
    const list = document.createElement('div');
    list.className = 'sheet-nav-sub';
    for (const section of document.querySelectorAll('main .sheet-section[id]')) {
      const heading = section.querySelector('h2');
      if (!heading) continue;
      const a = document.createElement('a');
      a.className = 'sheet-nav-sublink labelRegular10';
      a.href = '#' + section.id;
      a.textContent = heading.textContent.trim();
      a.dataset.section = section.id;
      list.appendChild(a);
    }
    return list;
  }

  /* Mark the section the reader is in. The rail is fixed, so this is the only
     way it tracks the page; below 1100px the sublinks are hidden and this is
     a no-op on a list nobody can see. */
  function spySections() {
    const links = [...document.querySelectorAll('[data-section]')];
    if (!links.length) return;
    const sections = links
      .map(a => document.getElementById(a.dataset.section))
      .filter(Boolean);

    const mark = () => {
      const line = window.innerHeight * 0.25;
      let current = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s;
      }
      for (const a of links) {
        a.classList.toggle('is-active', a.dataset.section === (current && current.id));
      }
      const active = document.querySelector('.sheet-nav-sublink.is-active');
      if (active) active.scrollIntoView({ block: 'nearest' });
    };

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; mark(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    mark();
  }

  /* ---------- Live token values ---------------------------------------- */

  /* Print what the browser resolved, not what the CSS source says: a token
     that aliases another (--bg-base → --org-base → #111) shows the colour
     that actually paints, and it re-reads on every theme / mode swap. */
  function resolveTokens() {
    const cs = getComputedStyle(document.documentElement);

    document.querySelectorAll('[data-token]').forEach(el => {
      const name = el.getAttribute('data-token');
      const value = cs.getPropertyValue(name).trim();
      const chip = el.querySelector('[data-token-chip]');
      const out  = el.querySelector('[data-token-value]');
      if (chip) {
        const prop = chip.getAttribute('data-token-chip') || 'background-color';
        chip.style.setProperty(prop, `var(${name})`);
      }
      if (out) out.textContent = value || '—';
    });

    /* A computed *used* value — the resolved px of a spacing or size token,
       after the responsive redefinitions have been applied. */
    document.querySelectorAll('[data-measure]').forEach(el => {
      const target = el.previousElementSibling || el.parentElement;
      if (!target) return;
      const prop = el.getAttribute('data-measure');
      el.textContent = getComputedStyle(target)[prop];
    });

    /* Live type metrics for the typography sheet. */
    document.querySelectorAll('[data-type-metrics]').forEach(el => {
      const sample = document.querySelector(
        '[data-type-sample="' + el.getAttribute('data-type-metrics') + '"]'
      );
      if (!sample) return;
      const s = getComputedStyle(sample);
      const px = n => Math.round(parseFloat(n) * 10) / 10;
      el.textContent = `${px(s.fontSize)}px / ${px(s.lineHeight)}px · ${s.fontWeight}`;
    });
  }

  /* ---------- Photographic slots --------------------------------------- */

  /* The only images on these sheets come from the demo content layer,
     never a path typed into the page (RULES §6). */
  function fillImages(ctx) {
    const brand = (ctx && ctx.brand) || null;
    if (!brand) return;
    const ids = []
      .concat(brand.media && brand.media.actionPhotos ? brand.media.actionPhotos : [])
      .concat(
        (brand.seatPreview && brand.seatPreview.close && brand.seatPreview.close.rows || [])
          .map(r => r.image)
      )
      .filter(Boolean);
    if (!ids.length) return;

    document.querySelectorAll('[data-demo-image]').forEach((el, i) => {
      const url = ContentLoader.asset(ids[i % ids.length]);
      if (!url) return;
      if (el.tagName === 'IMG') el.src = url;
      else el.style.backgroundImage = `url("${url}")`;
    });
  }

  /* ---------- Boot ------------------------------------------------------ */

  renderNav();
  resolveTokens();

  document.addEventListener('content-loaded', e => fillImages(e.detail));
  if (window.ContentLoader && ContentLoader.platform && ContentLoader.platform()) {
    ContentLoader.load().then(fillImages).catch(() => {});
  }

  new MutationObserver(() => setTimeout(resolveTokens, 0)).observe(
    document.documentElement,
    { attributes: true, attributeFilter: ['data-theme', 'data-mode', 'data-platform'] }
  );
  window.addEventListener('resize', () => resolveTokens());
})();
