/* Ussher — Office reader, direction A: "Prayer book".  NOT part of Crnl.
   Renders USSHER.office for USSHER.calendar.today from the fixtures.
   All liturgical text comes from the fixture (lorem ipsum). The strings in UI
   below are app chrome only.
   Preview hooks: ?date=YYYY-MM-DD (day header only), ?officiant=priest|lay,
   ?pages=1, ?size=14..24. */
(function () {
  'use strict';
  var U = window.USSHER;
  var S = U.settings;
  var q = new URLSearchParams(location.search);

  var UI = {
    contents: 'Contents',
    reading: 'Reading',
    textSize: 'Text size',
    pages: 'Page numbers',
    appointed: 'Appointed',
    or: 'or',
    done: 'Done',
    roles: { officiant: 'Officiant', people: 'People' },
    form: 'Form for a',
    pt: 'pt'
  };

  /* ---------- state ---------- */
  var officiant = q.get('officiant') || S.officiant.value;
  var showPages = q.has('pages') ? q.get('pages') === '1' : S.showSourcePages.value;
  var size = +(q.get('size') || S.textSize.value);
  var choices = {};
  try { choices = JSON.parse(localStorage.getItem('ussher-a-choices') || '{}') || {}; } catch (e) { choices = {}; }
  function saveChoices() { try { localStorage.setItem('ussher-a-choices', JSON.stringify(choices)); } catch (e) { /* private mode */ } }

  /* ---------- tiny DOM helpers (literal class lists only) ---------- */
  function el(tag, classes, text) {
    var e = document.createElement(tag);
    if (classes) classes.forEach(function (c) { e.classList.add(c); });
    if (text != null) e.textContent = text;
    return e;
  }
  function add(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }
  function icon(name, sizeClass) { var i = el('span', ['icon', sizeClass], name); i.setAttribute('aria-hidden', 'true'); return i; }
  function words(slug) { return slug.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '); }

  var page = document.getElementById('page');
  var scroller = document.getElementById('scroll');

  /* ---------- page marks ---------- */
  var lastPage = null;
  function pageMark(host, src) {
    if (!src || src.page === lastPage) return;
    lastPage = src.page;
    var m = el('span', ['ra-pg'], String(src.page));
    m.setAttribute('aria-label', 'Page ' + src.page);
    host.insertBefore(m, host.firstChild);
  }

  /* A hard hyphen is not a line break: "Twenty-third" stays on one line. */
  function keepHyphens(node, text) {
    text.split(' ').forEach(function (w, i) {
      if (i) node.appendChild(document.createTextNode(' '));
      node.appendChild(w.indexOf('-') > 0 ? el('span', ['ra-nowrap'], w) : document.createTextNode(w));
    });
    return node;
  }

  /* ---------- day header ---------- */
  function renderHead(iso) {
    var d = U.day(iso || q.get('date') || U.calendar.today) || U.today();
    var old = page.querySelector('.ra-head');
    var head = el('header', ['ra-head']);
    add(head, el('p', ['ra-date'], U.formatDate(d.date) + ' · ' + U.titleCase(d.season)));
    if (d.holyDay) add(head, el('p', ['ra-holy'], d.holyDay.title));
    add(head, keepHyphens(el('p', ['ra-temporal']), d.temporalTitle));
    add(head, el('h1', ['ra-title'], U.office.title));
    if (old) page.replaceChild(head, old); else page.appendChild(head);
  }

  /* ---------- blocks ---------- */
  function prayerText(text, amen) {
    var p = el('p', null, text);
    if (amen) { p.appendChild(document.createTextNode(' ')); p.appendChild(el('span', ['ra-amen'], 'Amen.')); }
    return p;
  }
  function verses(list, numbered) {
    var frag = document.createDocumentFragment();
    list.forEach(function (v) {
      var verse = el('div', ['ra-verse']);
      var a = el('span', ['ra-half']);
      if (numbered) { var n = el('span', ['ra-vn'], String(v.n)); a.appendChild(n); }
      a.appendChild(document.createTextNode(v.a));
      add(verse, a, el('span', ['ra-half', 'ra-half-b'], v.b));
      frag.appendChild(verse);
    });
    return frag;
  }

  var render = {
    rubric: function (b, box) { add(box, el('p', ['ra-rubric'], b.text)); },
    sentence: function (b, box) {
      add(box, el('p', null, b.text), el('p', ['ra-cite'], b.citation));
    },
    prayer: function (b, box, ctx) {
      if (ctx.showTitle && b.title) { box.classList.add('ra-blk-titled'); add(box, el('h3', ['ra-ptitle'], b.title)); }
      if (b.when && b.when.officiant) {
        var opt = S.officiant.options.filter(function (o) { return o.id === b.when.officiant; })[0];
        var f = el('div', ['ra-form']);
        var tag = el('span', ['tag']);
        add(tag, el('span', ['labelBold10'], UI.form + ' ' + opt.title.toLowerCase()));
        add(box, add(f, tag));
      }
      add(box, prayerText(b.text, b.amen));
    },
    versicles: function (b, box) {
      var g = el('div', ['ra-vr']);
      b.lines.forEach(function (l, i) {
        var who = el('span', ['ra-vr-who'], UI.roles[l.speaker]);
        var said = el('span', l.speaker === 'people' ? ['ra-vr-people'] : ['ra-vr-off'], l.text);
        if (i && l.speaker === 'officiant') { who.classList.add('ra-vr-next'); said.classList.add('ra-vr-next'); }
        add(g, who, said);
      });
      add(box, g);
    },
    canticle: function (b, box, ctx) {
      if (!ctx.inChoice) add(box, el('h3', ['ra-ctitle'], b.title));
      add(box, verses(b.verses, false));
    },
    slot: function (b, box) { slot[b.fill](b, box); }
  };

  var slot = {
    psalms: function (b, box) {
      var ap = el('div', ['ra-appointed']);
      add(ap, add(el('span', ['tag']), el('span', ['labelBold10'], UI.appointed + ' · ' + b.appointed)));
      add(box, ap);
      b.psalms.forEach(function (ps) {
        var w = el('div', ['ra-psalm']);
        var h = el('h3', ['ra-psalm-h']);
        add(h, el('span', ['ra-psalm-no'], ps.title), document.createTextNode(' '), el('span', ['ra-psalm-inc'], ps.incipit));
        add(w, h, verses(ps.verses, true));
        add(box, w);
      });
    },
    'first-lesson': lesson,
    'second-lesson': lesson,
    'collect-of-the-day': function (b, box) {
      box.classList.add('ra-blk-titled');
      add(box, el('h3', ['ra-proper-t'], b.collect.title), prayerText(b.collect.text, b.collect.amen));
    }
  };

  function lesson(b, box) {
    var L = b.lesson;
    box.classList.add('ra-lesson');
    add(box, el('p', ['ra-lesson-cite'], L.citation));
    var meta = el('div', ['ra-meta']);
    add(meta, el('span', ['labelRegular10', 'text-secondary'], L.translationName));
    if (L.fallback && L.fallbackNote) {
      var n = el('p', ['ra-note']);
      add(n, icon('info', 'icon-100'), el('span', ['labelRegular10', 'text-secondary'], L.fallbackNote));
      add(meta, n);
    }
    add(box, meta);
    L.paragraphs.forEach(function (para) {
      var p = el('p');
      para.forEach(function (v, i) {
        var sv = el('span', ['ra-sv'], String(v.v));
        add(p, sv, document.createTextNode(v.text + (i < para.length - 1 ? ' ' : '')));
      });
      add(box, p);
    });
  }

  /* ---------- choice ---------- */
  function renderChoice(b, box, flash) {
    var mark = box.querySelector(':scope > .ra-pg');
    box.textContent = '';
    if (mark) box.appendChild(mark);
    var cur = choices[b.id] || b.default;
    var opt = b.options.filter(function (o) { return o.id === cur; })[0] || b.options[0];
    var type = opt.block.type;
    box.classList.toggle('ra-choice-sentence', type === 'sentence');
    var title = null;
    if (type !== 'sentence') {
      title = el('h3', [type === 'canticle' ? 'ra-ctitle' : 'ra-ptitle'], opt.title);
      if (flash) title.classList.add('ra-flash');
      add(box, title);
    }
    var row = el('div', ['ra-or-row']);
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Alternatives');
    b.options.forEach(function (o) {
      if (o.id === opt.id) return;
      var btn = el('button', ['ra-or', 'surface-ghost', 'scale-300'], UI.or + ' ' + o.title);
      btn.type = 'button';
      btn.dataset.choice = b.id; btn.dataset.option = o.id;
      btn.addEventListener('click', function () {
        choices[b.id] = o.id; saveChoices();
        var before = box.getBoundingClientRect().top;
        renderChoice(b, box, true);
        scroller.scrollTop += box.getBoundingClientRect().top - before;  /* keep the place */
        updatePosition();
      });
      add(row, btn);
    });
    var body = el('div', flash ? ['ra-fade'] : null);
    render[type](opt.block, body, { inChoice: true, showTitle: false });
    if (type === 'sentence') add(box, body, row); else add(box, row, body);
  }

  /* ---------- sections ---------- */
  var sectionEls = [];
  function titledCount(s) {
    return s.blocks.filter(function (b) {
      if (b.type === 'prayer') return !b.when || b.when.officiant === officiant;
      return b.type === 'slot' && b.fill === 'collect-of-the-day';
    }).length;
  }
  function renderOffice() {
    U.office.sections.forEach(function (s) {
      var sec = el('section', ['ra-sec']);
      sec.id = 'sec-' + s.id;
      var h = el('h2', ['ra-sec-h'], s.title);
      add(sec, h);
      var showTitle = titledCount(s) > 1;
      var first = true;
      s.blocks.forEach(function (b) {
        if (b.when && b.when.officiant && b.when.officiant !== officiant) return;
        var box = el('div', ['ra-blk']);
        box.dataset.block = b.id;
        if (b.type === 'choice') { box.classList.add('ra-choice'); renderChoice(b, box, false); }
        else render[b.type](b, box, { showTitle: showTitle });
        pageMark(first ? h : box, b.source);
        first = false;
        add(sec, box);
      });
      page.appendChild(sec);
      sectionEls.push({ s: s, el: sec });
    });
    var end = el('footer', ['ra-end']);
    add(end, el('p', ['ra-end-mark'], words(U.office.office)));
    var done = el('button', ['btn', 'btn-secondary', 'btn-300'], UI.done);
    add(page, add(end, done));
  }

  /* ---------- position: the nav title is the section you are in ---------- */
  var navTitle = document.getElementById('nav-title');
  var current = -1;
  function chromeH() { return document.getElementById('chrome-top').offsetHeight; }
  function updatePosition() {
    var line = scroller.getBoundingClientRect().top + chromeH() + 8;
    var idx = -1;
    sectionEls.forEach(function (x, i) { if (x.el.getBoundingClientRect().top <= line) idx = i; });
    /* The iOS idiom: the running head appears once the section's own heading
       has gone under the bar, so the name is never on screen twice. */
    var head = idx >= 0 ? sectionEls[idx].el.firstChild.getBoundingClientRect() : null;
    var shown = head && head.bottom < line - 4 ? idx : -1;
    if (idx !== current) { current = idx; markToc(); }
    if (shown !== navTitle.dataset.shown * 1 || navTitle.dataset.shown == null) {
      navTitle.dataset.shown = shown;
      navTitle.textContent = '';
      if (shown >= 0) navTitle.appendChild(el('span', ['ra-running'], sectionEls[shown].s.title));
    }
  }
  scroller.addEventListener('scroll', updatePosition, { passive: true });

  /* ---------- contents sheet ---------- */
  var toc = document.getElementById('toc');
  var tocRows = [];
  function firstPage(s) { return s.blocks[0] && s.blocks[0].source ? s.blocks[0].source.page : ''; }
  function renderToc() {
    document.getElementById('sheet-title').textContent = UI.contents;
    U.office.sections.forEach(function (s, i) {
      var row = el('button', ['list-row', 'surface-section']);
      row.type = 'button';
      var content = el('div', ['list-row-content']);
      var pair = el('div', ['list-row-text-pair']);
      var name = el('span', ['labelRegular30'], s.title);
      add(row, add(content, add(pair, name)));
      var tr = el('div', ['trailing', 'trailing-gap-sm']);
      var here = icon('bookmark', 'icon-200');
      var pg = el('span', ['labelRegular20', 'text-secondary', 'ra-toc-pg'], String(firstPage(s)));
      add(row, add(tr, here, pg));
      row.addEventListener('click', function () { jump(i); });
      toc.appendChild(row);
      tocRows.push({ row: row, name: name, here: here, pg: pg });
    });
    markToc();
  }
  function markToc() {
    tocRows.forEach(function (r, i) {
      var on = i === Math.max(current, 0);
      r.name.classList.toggle('labelBold30', on);
      r.name.classList.toggle('labelRegular30', !on);
      r.here.classList.toggle('ra-hide', !on);
      r.pg.classList.toggle('ra-hide', !showPages);
      if (on) r.row.setAttribute('aria-current', 'location'); else r.row.removeAttribute('aria-current');
    });
  }
  function jump(i) {
    U.closeModal('contents');
    var target = sectionEls[i].el;
    var top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - chromeH() + 4;
    scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
  document.getElementById('open-contents').addEventListener('click', function () { markToc(); U.openModal('contents'); });
  document.getElementById('close-contents').addEventListener('click', function () { U.closeModal('contents'); });

  /* ---------- reading controls ---------- */
  function applySize() {
    size = Math.min(S.textSize.max, Math.max(S.textSize.min, size));
    document.documentElement.style.setProperty('--ussher-reading-size', size + 'px');
    document.getElementById('size-value').textContent = size + ' ' + UI.pt;
    document.getElementById('size-down').classList.toggle('disabled', size <= S.textSize.min);
    document.getElementById('size-up').classList.toggle('disabled', size >= S.textSize.max);
  }
  function applyPages() {
    page.classList.toggle('ra-show-pages', showPages);
    document.getElementById('pages-switch').checked = showPages;
    markToc();
  }
  function renderControls() {
    document.getElementById('reading-label').textContent = UI.reading;
    document.getElementById('size-label').textContent = UI.textSize;
    document.getElementById('pages-label').textContent = UI.pages;
    document.getElementById('pages-book').textContent = S.book.options.filter(function (o) { return o.id === S.book.value; })[0].title;
    document.getElementById('size-down').addEventListener('click', function () { size -= 1; applySize(); });
    document.getElementById('size-up').addEventListener('click', function () { size += 1; applySize(); });
    document.getElementById('pages-switch').addEventListener('change', function (e) { showPages = e.target.checked; applyPages(); });
  }

  /* ---------- boot ---------- */
  renderHead();
  renderOffice();
  renderToc();
  renderControls();
  applySize();
  applyPages();
  U.measureChrome();
  updatePosition();
  window.USSHER.readerA = {
    jump: jump,
    previewDay: function (iso) { renderHead(iso); },
    setSize: function (n) { size = n; applySize(); }, choose: function (id, opt) { var b = document.querySelector('[data-option="' + opt + '"][data-choice="' + id + '"]'); if (b) b.click(); } };
})();
