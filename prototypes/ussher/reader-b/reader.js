/* Ussher reader, direction B — renders USSHER.office from the fixtures.
   All prayed, scriptural and rubric text comes from the fixture (lorem ipsum).
   The only strings typed here are UI labels. Classes are literal lists only. */
(function () {
  var U = window.USSHER;
  var params = new URLSearchParams(location.search);
  var UI = {
    choose: 'Choose one',
    officiant: 'Officiant',
    appointed: 'Appointed',
    amen: 'Amen.',
    contents: 'Contents',
    reading: 'Reading',
    textSize: 'Text size',
    pages: 'Source page numbers',
    pagesSub: 'Mark where the printed page turns',
    page: 'p.',
    now: 'Now',
    end: 'End of the office',
    top: 'Back to top',
    of: 'of',
    holyDay: 'Holy day',
    roles: { officiant: 'Officiant', people: 'People' }
  };

  var state = {
    officiant: U.settings.officiant.value,
    pages: params.has('pages') ? params.get('pages') === '1' : !!U.settings.showSourcePages.value,
    size: U.settings.textSize.value,
    choices: {}
  };
  var dayIso = params.get('date') || U.calendar.today;
  var day = U.day(dayIso) || U.today();

  var page = document.getElementById('page');
  var scroller = document.getElementById('scroll');
  var lastPage = null;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/^the\s+/, '').replace(/[^a-z]/g, ''); }
  function two(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- page marks ---------- */
  function pageMark(flow, src) {
    if (!state.pages || !src || src.page == null || src.page === lastPage) return;
    lastPage = src.page;
    var m = el('div', 'ussb-pagemark');
    m.appendChild(el('span', 'ussb-label', UI.page + ' ' + src.page));
    flow.appendChild(m);
  }

  /* ---------- blocks ---------- */
  function textP(text, amen) {
    var p = el('p', 'ussb-text', text);
    if (amen) { p.appendChild(document.createTextNode(' ')); p.appendChild(el('span', 'ussb-amen', UI.amen)); }
    return p;
  }
  function rubric(b) { return el('p', 'ussb-rubric', b.text); }
  function sentence(b) {
    var f = el('figure', 'ussb-sentence');
    f.appendChild(el('blockquote', 'ussb-sentence-text', b.text));
    f.appendChild(el('figcaption', 'ussb-cite', b.citation));
    return f;
  }
  function prayer(b, sectionTitle) {
    var d = el('div', 'ussb-prayer');
    if (b.title && norm(b.title) !== norm(sectionTitle) && !b.when) d.appendChild(el('p', 'ussb-prayer-title', b.title));
    d.appendChild(textP(b.text, b.amen));
    return d;
  }
  function versicles(b) {
    var d = el('div', 'ussb-vr');
    b.lines.forEach(function (l) {
      var row = el('div', 'ussb-vr-line');
      if (l.speaker === 'people') row.classList.add('is-people');
      row.appendChild(el('span', 'ussb-vr-role', UI.roles[l.speaker] || l.speaker));
      row.appendChild(el('p', 'ussb-text', l.text));
      d.appendChild(row);
    });
    return d;
  }
  function verse(v, numbered) {
    var d = el('div', 'ussb-verse');
    if (numbered) d.appendChild(el('span', 'ussb-vno', String(v.n)));
    var body = el('div', 'ussb-text');
    body.appendChild(el('span', 'ussb-half-a', v.a));
    if (v.b) body.appendChild(el('span', 'ussb-half-b', v.b));
    d.appendChild(body);
    return d;
  }
  function canticle(b) {
    var d = el('div', 'ussb-cant');
    if (b.title) d.appendChild(el('h3', 'ussb-cant-title', b.title));
    var vs = el('div', 'ussb-verses');
    b.verses.forEach(function (v) { vs.appendChild(verse(v, false)); });
    d.appendChild(vs);
    return d;
  }
  function psalms(b) {
    var d = el('div', 'ussb-psalms');
    if (b.appointed) {
      var a = el('p', 'ussb-appointed');
      a.appendChild(el('span', 'ussb-label', UI.appointed));
      a.appendChild(el('span', 'ussb-cite', b.appointed));
      a.classList.add('ussb-psalms-appointed');
      d.appendChild(a);
    }
    b.psalms.forEach(function (ps) {
      var p = el('div', 'ussb-psalm');
      var h = el('div', 'ussb-psalm-head');
      h.appendChild(el('h3', 'ussb-psalm-title', ps.title));
      if (ps.incipit) h.appendChild(el('span', 'ussb-incipit', ps.incipit));
      p.appendChild(h);
      var vs = el('div', 'ussb-verses');
      ps.verses.forEach(function (v) { vs.appendChild(verse(v, true)); });
      p.appendChild(vs);
      d.appendChild(p);
    });
    return d;
  }
  function lesson(b) {
    var L = b.lesson, d = el('div', 'ussb-lesson ussb-flow');
    var head = el('div', 'ussb-lesson-head');
    head.appendChild(el('h3', 'ussb-lesson-cite', L.citation));
    var tr = el('div', 'ussb-lesson-tr');
    var tag = el('span', 'tag'); tag.appendChild(el('span', 'labelBold10', L.translation));
    tr.appendChild(tag);
    tr.appendChild(el('span', 'ussb-tr-name', L.translationName));
    head.appendChild(tr);
    d.appendChild(head);
    if (L.fallback && L.fallbackNote) {
      var n = el('div', 'ussb-note');
      n.appendChild(el('span', 'icon icon-100 icon-outlined', 'info'));
      n.appendChild(el('p', 'ussb-note-text', L.fallbackNote));
      d.appendChild(n);
    }
    var prose = el('div', 'ussb-prose');
    L.paragraphs.forEach(function (para) {
      var p = el('p', 'ussb-text');
      para.forEach(function (v, i) {
        if (i) p.appendChild(document.createTextNode(' '));
        p.appendChild(el('sup', 'ussb-vsup', String(v.v)));
        p.appendChild(document.createTextNode(v.text));
      });
      prose.appendChild(p);
    });
    d.appendChild(prose);
    return d;
  }
  function collect(b) {
    var C = b.collect, d = el('div', 'ussb-proper');
    d.appendChild(el('p', 'ussb-prayer-title', C.title));
    d.appendChild(el('p', 'ussb-proper-of', day.temporalTitle));
    d.appendChild(textP(C.text, C.amen));
    return d;
  }

  /* A row of outlined Crnl chips; the selected one carries a check and the bold weight. */
  function chipRow(label, options, current, onPick) {
    var bar = el('div', 'ussb-choice-bar');
    bar.appendChild(el('span', 'ussb-label', label));
    var row = el('div', 'ussb-chips');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', label);
    options.forEach(function (o) {
      var on = o.id === current;
      var c = el('button', on ? 'chip surface-borderNeutral scale-300 chip-icon-leading' : 'chip surface-borderNeutral scale-300');
      c.type = 'button';
      c.id = 'pick-' + o.id;
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) c.appendChild(el('span', 'icon icon-100', 'check'));
      c.appendChild(el('span', on ? 'labelBold20' : 'labelRegular20 text-secondary', o.title));
      c.addEventListener('click', function () { if (!on) onPick(o.id); });
      row.appendChild(c);
    });
    bar.appendChild(row);
    return bar;
  }

  function choice(b, sectionTitle) {
    var wrap = el('div', 'ussb-choice');
    wrap.id = 'choice-' + b.id;
    function draw(animate) {
      wrap.textContent = '';
      var cur = state.choices[b.id] || b.default;
      wrap.appendChild(chipRow(UI.choose, b.options, cur, function (id) {
        state.choices[b.id] = id; draw(true);
      }));
      var opt = b.options.filter(function (o) { return o.id === cur; })[0];
      var body = el('div', animate ? 'ussb-choice-body' : '');
      body.appendChild(render(opt.block, sectionTitle));
      wrap.appendChild(body);
    }
    draw(false);
    return wrap;
  }

  function slot(b) {
    if (b.fill === 'psalms') return psalms(b);
    if (b.fill === 'first-lesson' || b.fill === 'second-lesson') return lesson(b);
    if (b.fill === 'collect-of-the-day') return collect(b);
    return el('p', 'ussb-rubric', b.fill);
  }

  function render(b, sectionTitle) {
    switch (b.type) {
      case 'rubric': return rubric(b);
      case 'sentence': return sentence(b);
      case 'prayer': return prayer(b, sectionTitle);
      case 'versicles': return versicles(b);
      case 'canticle': return canticle(b);
      case 'choice': return choice(b, sectionTitle);
      case 'slot': return slot(b);
    }
    return el('p', 'ussb-rubric', b.type);
  }

  /* The priest/lay pair: show the one the setting names, with the switch in place. */
  function officiantBlock(b, sectionTitle) {
    var wrap = el('div', 'ussb-choice');
    wrap.appendChild(chipRow(UI.officiant, U.settings.officiant.options, state.officiant, function (id) {
      var y = scroller.scrollTop; state.officiant = id; build(); scroller.scrollTop = y;
    }));
    wrap.appendChild(render(b, sectionTitle));
    return wrap;
  }

  /* ---------- masthead ---------- */
  function masthead() {
    var h = el('header', 'ussb-mast');
    var line = el('div', 'ussb-dateline');
    line.appendChild(el('span', 'ussb-date', U.formatDate(day.date)));
    var tag = el('span', 'tag'); tag.appendChild(el('span', 'labelBold10', U.titleCase(day.season)));
    line.appendChild(tag);
    h.appendChild(line);
    h.appendChild(el('h1', 'ussb-office-title', U.office.title));
    h.appendChild(el('p', 'ussb-day', day.temporalTitle));
    if (day.holyDay) {
      var f = el('div', 'ussb-feast');
      f.appendChild(el('span', 'ussb-feast-rank', UI.holyDay + ' · ' + U.titleCase(day.holyDay.rank)));
      f.appendChild(el('p', 'ussb-feast-title', day.holyDay.title));
      h.appendChild(f);
    }
    return h;
  }

  /* ---------- build ---------- */
  function build() {
    page.textContent = '';
    lastPage = null;
    page.appendChild(masthead());
    U.office.sections.forEach(function (s, i) {
      var sec = el('section', 'ussb-section');
      sec.id = 's-' + s.id;
      var head = el('header', 'ussb-sec-head');
      head.appendChild(el('span', 'ussb-sec-num', two(i + 1)));
      head.appendChild(el('h2', 'ussb-sec-title', s.title));
      sec.appendChild(head);
      var flow = el('div', 'ussb-flow');
      s.blocks.forEach(function (b) {
        if (b.when && b.when.officiant) {
          if (b.when.officiant !== state.officiant) return;
          pageMark(flow, b.source);
          flow.appendChild(officiantBlock(b, s.title));
          return;
        }
        pageMark(flow, b.source);
        flow.appendChild(render(b, s.title));
      });
      sec.appendChild(flow);
      page.appendChild(sec);
    });
    var end = el('footer', 'ussb-end');
    end.appendChild(el('span', 'ussb-label', UI.end));
    var top = el('button', 'btn btn-tertiary btn-100', UI.top);
    top.type = 'button';
    top.addEventListener('click', function () { scroller.scrollTo({ top: 0, behavior: 'smooth' }); });
    end.appendChild(top);
    page.appendChild(end);
    buildToc();
    onScroll();
  }

  /* ---------- contents sheet ---------- */
  var current = -1;
  function buildToc() {
    document.getElementById('toc-title').textContent = UI.contents;
    document.getElementById('opt-heading').textContent = UI.reading;
    document.getElementById('size-label').textContent = UI.textSize;
    document.getElementById('size-value').textContent = state.size + ' ' + U.settings.textSize.unit;
    document.getElementById('pages-label').textContent = UI.pages;
    document.getElementById('pages-sub').textContent = UI.pagesSub;
    document.getElementById('pages-switch').checked = state.pages;
    var list = document.getElementById('toc-list');
    list.textContent = '';
    U.office.sections.forEach(function (s, i) {
      var r = el('button', 'list-row surface-section');
      r.type = 'button';
      r.id = 'toc-' + s.id;
      var lead = el('div', 'leading leading-gap-md');
      lead.appendChild(el('span', 'labelRegular20 text-secondary ussb-toc-num', two(i + 1)));
      r.appendChild(lead);
      var content = el('div', 'list-row-content');
      var pair = el('div', 'list-row-text-pair');
      pair.appendChild(el('span', 'labelBold30', s.title));
      var first = s.blocks[0] && s.blocks[0].source;
      if (state.pages && first) pair.appendChild(el('span', 'labelRegular10 text-secondary', UI.page + ' ' + first.page));
      content.appendChild(pair);
      r.appendChild(content);
      if (i === current) {
        var tr = el('div', 'trailing trailing-gap-sm');
        var t = el('span', 'tag'); t.appendChild(el('span', 'labelBold10', UI.now));
        tr.appendChild(t);
        r.appendChild(tr);
        r.setAttribute('aria-current', 'location');
      }
      r.addEventListener('click', function () { closeToc(); jump(s.id, true); });
      list.appendChild(r);
    });
  }
  function openToc() { onScroll(); buildToc(); U.openModal('toc-modal'); }
  function closeToc() { U.closeModal('toc-modal'); }

  function chromeH() { return document.getElementById('chrome-top').offsetHeight; }
  function jump(id, smooth) {
    var t = document.getElementById('s-' + id);
    if (!t) return;
    var head = t.querySelector('.ussb-sec-head');
    var y = scroller.scrollTop + head.getBoundingClientRect().top - scroller.getBoundingClientRect().top - chromeH() - 8;
    scroller.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' });
  }

  /* ---------- position ---------- */
  function onScroll() {
    var y = scroller.scrollTop, max = scroller.scrollHeight - scroller.clientHeight;
    var top = scroller.getBoundingClientRect().top + chromeH() + scroller.clientHeight * 0.25, idx = -1;
    page.querySelectorAll('.ussb-sec-head').forEach(function (h, i) {
      if (h.getBoundingClientRect().top <= top) idx = i;
    });
    if (max > 0 && y >= max - 2) idx = U.office.sections.length - 1;
    current = idx;
    var t = document.getElementById('nav-title');
    var mast = page.querySelector('.ussb-mast');
    var past = mast && mast.getBoundingClientRect().bottom < scroller.getBoundingClientRect().top + chromeH();
    var n = U.office.sections.length;
    document.getElementById('nav-sec').textContent = idx >= 0 ? U.office.sections[idx].title : '';
    document.getElementById('nav-pos').textContent = idx >= 0 ? (idx + 1) + ' ' + UI.of + ' ' + n : '';
    t.classList.toggle('is-shown', !!past && idx >= 0);
  }

  function setSize(n) {
    var s = U.settings.textSize;
    state.size = Math.max(s.min, Math.min(s.max, n));
    document.documentElement.style.setProperty('--ussher-reading-size', state.size + 'px');
    document.getElementById('size-value').textContent = state.size + ' ' + s.unit;
    document.getElementById('size-down').classList.toggle('disabled', state.size <= s.min);
    document.getElementById('size-up').classList.toggle('disabled', state.size >= s.max);
    onScroll();
  }

  scroller.addEventListener('scroll', onScroll, { passive: true });
  document.getElementById('nav-toc').addEventListener('click', openToc);
  document.getElementById('toc-close').addEventListener('click', closeToc);
  document.getElementById('toc-modal').addEventListener('click', function (e) { if (e.target === this) closeToc(); });
  document.getElementById('size-down').addEventListener('click', function () { setSize(state.size - 1); });
  document.getElementById('size-up').addEventListener('click', function () { setSize(state.size + 1); });
  document.getElementById('pages-switch').addEventListener('change', function () {
    var y = scroller.scrollTop; state.pages = this.checked; build(); scroller.scrollTop = y;
  });

  build();
  if (params.get('size')) setSize(+params.get('size')); else setSize(state.size);

  /* Hooks for screenshots and review. */
  window.USSB = {
    jump: jump, openToc: openToc, closeToc: closeToc, setSize: setSize,
    choose: function (blockId, optionId) { var c = document.getElementById('pick-' + optionId); if (c) c.click(); }
  };
})();
