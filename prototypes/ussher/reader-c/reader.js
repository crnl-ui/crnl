/* Ussher reader — direction C ("Utilitarian"). Renders USSHER.office from the fixtures.
   All liturgical text comes from the fixture (lorem ipsum). UI copy only is written here.
   Class lists are literal strings — never concatenated (README § rules that bite). */
(function () {
  var U = window.USSHER;
  var office = U.office;
  var settings = U.settings;
  var params = new URLSearchParams(location.search);
  var shownDate = params.get('date') || office.date;   /* ?date= previews the day header for another date */

  /* State */
  var state = {
    officiant: params.get('officiant') || settings.officiant.value,
    size: Number(params.get('size')) || settings.textSize.value,
    pages: params.has('pages') ? params.get('pages') !== '0' : settings.showSourcePages.value,
    choices: {}            // choice block id -> option id
  };

  /* ---------- DOM helpers ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function icon(name, cls) { var i = el('span', cls || 'icon icon-100', name); i.setAttribute('aria-hidden', 'true'); return i; }
  function pageMarker(src) {
    var p = el('span', 'ucr-pg', src && src.page != null ? 'p. ' + src.page : '');
    return p;
  }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function words(id) { return id.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '); }

  var bookName = settings.book.options.filter(function (o) { return o.id === settings.book.value; })[0];
  var bibleName = settings.bible.options.filter(function (o) { return o.id === settings.bible.value; })[0];
  function officiantTitle(id) { return settings.officiant.options.filter(function (o) { return o.id === id; })[0].title; }

  /* A label row: title on the left, source page on the right (hidden unless pages are on). */
  function labelRow(title, src, strong, extra) {
    var row = el('div', 'ucr-label');
    var main = el('span', strong ? 'ucr-label-main ucr-label-strong' : 'ucr-label-main', title);
    if (extra) { main.appendChild(document.createTextNode(' ')); main.appendChild(extra); }
    row.appendChild(main);
    row.appendChild(pageMarker(src));
    return row;
  }
  /* No label row to sit in: the marker floats to the end of the first line instead of adding one. */
  function pageOnlyRow(src) {
    var p = pageMarker(src);
    p.classList.add('ucr-pg-float');
    return p;
  }

  /* ---------- block renderers ---------- */
  function renderRubric(b, src) {
    var w = el('div', 'ucr-block');
    w.appendChild(pageOnlyRow(src));
    w.appendChild(el('p', 'ucr-rubric', b.text));
    return w;
  }

  function renderSentence(b, src) {
    var w = el('div', 'ucr-block');
    w.appendChild(pageOnlyRow(src));
    w.appendChild(el('p', 'ucr-said', b.text));
    w.appendChild(el('span', 'ucr-cite', b.citation));
    return w;
  }

  function prayerText(text, amen) {
    var p = el('p', 'ucr-said', text);
    if (amen) {
      p.appendChild(document.createTextNode(' '));
      p.appendChild(el('span', 'ucr-amen', 'Amen.'));
    }
    return p;
  }

  function renderPrayer(b, src, opts) {
    var w = el('div', 'ucr-block');
    if (b.title && !(opts && opts.hideTitle)) w.appendChild(labelRow(b.title, src));
    else w.appendChild(pageOnlyRow(src));
    w.appendChild(prayerText(b.text, b.amen));
    return w;
  }

  function renderVersicles(b, src) {
    var w = el('div', 'ucr-block');
    w.appendChild(pageOnlyRow(src));
    var g = el('div', 'ucr-vr');
    b.lines.forEach(function (l) {
      var people = l.speaker === 'people';
      g.appendChild(el('span', people ? 'ucr-role ucr-role-people' : 'ucr-role', people ? 'People' : 'Officiant'));
      g.appendChild(el('p', people ? 'ucr-said ucr-people' : 'ucr-said', l.text));
    });
    w.appendChild(g);
    return w;
  }

  function verseGrid(verses) {
    var g = el('div', 'ucr-verses');
    verses.forEach(function (v) {
      g.appendChild(el('span', 'ucr-vn', String(v.n)));
      var t = el('p', 'ucr-said');
      t.appendChild(el('span', 'ucr-va', v.a));
      if (v.b) t.appendChild(el('span', 'ucr-vb', v.b));
      g.appendChild(t);
    });
    return g;
  }

  function renderCanticle(b, src, opts) {
    var w = el('div', 'ucr-block');
    if (b.title && !(opts && opts.hideTitle)) w.appendChild(labelRow(b.title, src, true));
    else w.appendChild(pageOnlyRow(src));
    w.appendChild(verseGrid(b.verses));
    return w;
  }

  function renderPsalms(b, src) {
    var w = el('div', 'ucr-block');
    var bar = el('div', 'ucr-choice-bar');
    var tag = el('div', 'tag tag-icon-leading');
    tag.appendChild(icon('event'));
    tag.appendChild(el('span', '', 'Appointed · ' + b.appointed));
    bar.appendChild(tag);
    bar.appendChild(pageMarker(src));
    w.appendChild(bar);
    b.psalms.forEach(function (ps) {
      var p = el('div', 'ucr-psalm');
      p.appendChild(labelRow(ps.title, null, true, el('span', 'ucr-incipit', ps.incipit)));
      p.appendChild(verseGrid(ps.verses));
      w.appendChild(p);
    });
    return w;
  }

  function renderLesson(b, src) {
    var L = b.lesson;
    var w = el('div', 'ucr-block');
    var head = el('div', 'ucr-lesson-head');
    head.appendChild(el('span', 'ucr-lesson-cite', L.citation));
    var t = el('div', 'tag');
    t.appendChild(el('span', '', L.translation));
    t.setAttribute('title', L.translationName);
    head.appendChild(t);
    head.appendChild(pageMarker(src));
    w.appendChild(head);
    if (L.fallback && L.fallbackNote) {
      var n = el('div', 'ucr-note');
      n.appendChild(icon('info', 'icon icon-200'));
      n.appendChild(el('p', 'labelRegular20 text-secondary', L.fallbackNote));
      w.appendChild(n);
    }
    L.paragraphs.forEach(function (para) {
      var p = el('p', 'ucr-said');
      para.forEach(function (v, i) {
        var s = el('span', 'ucr-vsup', String(v.v));
        s.setAttribute('aria-label', 'Verse ' + v.v);
        p.appendChild(s);
        p.appendChild(document.createTextNode(v.text + (i < para.length - 1 ? ' ' : '')));
      });
      w.appendChild(p);
    });
    return w;
  }

  function renderCollectOfDay(b, src) {
    var c = b.collect;
    var w = el('div', 'ucr-block');
    w.appendChild(labelRow(c.title, src));
    w.appendChild(prayerText(c.text, c.amen));
    return w;
  }

  function renderBlock(b, src, opts) {
    src = src || b.source;
    switch (b.type) {
      case 'rubric': return renderRubric(b, src);
      case 'sentence': return renderSentence(b, src);
      case 'prayer': return renderPrayer(b, src, opts);
      case 'versicles': return renderVersicles(b, src);
      case 'canticle': return renderCanticle(b, src, opts);
      case 'choice': return renderChoice(b);
      case 'slot':
        if (b.fill === 'psalms') return renderPsalms(b, src);
        if (b.fill === 'first-lesson' || b.fill === 'second-lesson') return renderLesson(b, src);
        if (b.fill === 'collect-of-the-day') return renderCollectOfDay(b, src);
    }
    return el('p', 'labelRegular20 text-secondary', b.type);
  }

  /* ---------- choices: chips in place ---------- */
  function chip(label, selected, onPick) {
    var c = el('button', selected ? 'chip chip-icon-leading surface-fillNeutral scale-300' : 'chip surface-borderNeutral scale-300');
    c.type = 'button';
    c.setAttribute('aria-pressed', selected ? 'true' : 'false');
    if (selected) c.appendChild(icon('check'));
    c.appendChild(el('span', 'chip-label', label));
    c.addEventListener('click', onPick);
    return c;
  }

  function renderChoice(b) {
    var w = el('div', 'ucr-block ucr-choice');
    w.dataset.choice = b.id;
    function draw() {
      w.textContent = '';
      var cur = state.choices[b.id] || b.default;
      var bar = el('div', 'ucr-choice-bar');
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', 'Choose one');
      b.options.forEach(function (o) {
        bar.appendChild(chip(o.title, o.id === cur, function () {
          if ((state.choices[b.id] || b.default) === o.id) return;
          state.choices[b.id] = o.id; draw(); layoutChanged();
        }));
      });
      bar.appendChild(pageMarker(b.source));
      w.appendChild(bar);
      var opt = b.options.filter(function (o) { return o.id === cur; })[0];
      /* The chip names the choice, so the block's own title is not repeated. */
      w.appendChild(renderBlock(opt.block, null, { hideTitle: true }));
    }
    draw();
    return w;
  }

  /* Consecutive blocks carrying `when.officiant` are one alternative, decided by Settings. */
  function renderOfficiantGroup(blocks) {
    var w = el('div', 'ucr-block ucr-choice');
    function draw() {
      w.textContent = '';
      var bar = el('div', 'ucr-choice-bar');
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', 'Officiant');
      var lead = el('span', 'ucr-choice-lead labelBold20 text-secondary');
      lead.appendChild(icon('person', 'icon icon-200'));
      lead.appendChild(el('span', '', 'Led by'));
      bar.appendChild(lead);
      settings.officiant.options.forEach(function (o) {
        bar.appendChild(chip(o.title, o.id === state.officiant, function () {
          if (state.officiant === o.id) return;
          state.officiant = o.id; redrawOfficiant(); layoutChanged(); paintDay();
        }));
      });
      w.appendChild(bar);
      blocks.filter(function (b) { return b.when.officiant === state.officiant; })
        .forEach(function (b) { w.appendChild(renderBlock(b)); });
    }
    officiantGroups.push(draw);
    draw();
    return w;
  }
  var officiantGroups = [];
  function redrawOfficiant() { officiantGroups.forEach(function (d) { d(); }); }

  /* ---------- the office ---------- */
  var root = document.getElementById('office');
  var sectionEls = [];
  var dayCard;

  function renderHeader() {
    var d = U.day(shownDate) || U.today();
    var h = el('header', 'ucr-head');
    var dateLine = el('p', 'labelBold20 text-secondary', U.formatDate(d.date));
    h.appendChild(dateLine);
    showDay = function (iso) { d = U.day(iso) || d; shownDate = d.date; current = -2; dateLine.textContent = U.formatDate(d.date); paintDay(); layoutChanged(); };
    h.appendChild(el('h1', 'title60', office.title));
    dayCard = el('div', 'card-closed ucr-day');
    h.appendChild(dayCard);
    paintDay = function () {
      dayCard.textContent = '';
      var pair = el('div', 'card-text-pair');
      pair.appendChild(el('span', 'labelBold30', d.temporalTitle));
      pair.appendChild(el('span', 'labelRegular20 text-secondary',
        office.sections.length + ' sections · ' + officiantTitle(state.officiant) + ' · ' + (bibleName ? bibleName.title : '')));
      dayCard.appendChild(pair);
      var tags = el('div', 'ucr-day-tags');
      var s = el('div', 'tag'); s.appendChild(el('span', '', U.titleCase(d.season) + ' season')); tags.appendChild(s);
      dayCard.appendChild(tags);
      if (d.holyDay) {
        var f = el('div', 'ucr-feast');
        var circ = el('div', 'circle-container'); circ.appendChild(icon('star', 'icon icon-200')); f.appendChild(circ);
        var fp = el('div', 'card-text-pair');
        fp.appendChild(el('span', 'labelBold30', d.holyDay.title));
        fp.appendChild(el('span', 'labelRegular20 text-secondary', U.titleCase(d.holyDay.rank) + ' holy day'));
        f.appendChild(fp);
        dayCard.appendChild(f);
      }
    };
    paintDay();
    root.appendChild(h);
  }
  var paintDay = function () {};
  var showDay = function () {};

  function renderSections() {
    office.sections.forEach(function (s, i) {
      var sec = el('section', 'ucr-sec');
      sec.id = 'sec-' + s.id;
      sec.dataset.index = i;
      var hd = el('h2', 'ucr-sec-head');
      hd.appendChild(el('span', 'ucr-sec-num', pad2(i + 1)));
      hd.appendChild(el('span', 'ucr-sec-title', s.title));
      sec.appendChild(hd);
      var body = el('div', 'ucr-sec-body');
      var k = 0;
      while (k < s.blocks.length) {
        var b = s.blocks[k];
        if (b.when && b.when.officiant) {
          var group = [];
          while (k < s.blocks.length && s.blocks[k].when && s.blocks[k].when.officiant) group.push(s.blocks[k++]);
          body.appendChild(renderOfficiantGroup(group));
          continue;
        }
        body.appendChild(renderBlock(b));
        k++;
      }
      sec.appendChild(body);
      root.appendChild(sec);
      sectionEls.push(sec);
    });
    var end = el('div', 'ucr-end');
    end.id = 'office-end';
    end.appendChild(icon('check_circle', 'icon icon-400'));
    end.appendChild(el('p', 'labelBold30', 'End of ' + words(office.office)));
    var done = el('button', 'btn btn-secondary btn-300');
    done.type = 'button';
    done.appendChild(el('span', '', 'Back to Today'));
    end.appendChild(done);
    root.appendChild(end);
  }

  /* ---------- position: nav title, strip, next ---------- */
  var scroller = document.getElementById('scroller');
  var chromeTop = document.getElementById('chrome-top');
  var track = document.getElementById('track');
  var countEl = document.getElementById('count');
  var navTitle = document.getElementById('nav-title');
  var nextKicker = document.getElementById('next-kicker');
  var nextTitle = document.getElementById('next-title');
  var nextIcon = document.getElementById('next-icon');
  var fills = [];
  var tops = [];
  var current = -2;

  function buildTrack() {
    track.textContent = ''; fills = [];
    sectionEls.forEach(function () {
      var seg = el('span', 'ucr-seg');
      var f = el('span', 'ucr-seg-fill');
      seg.appendChild(f); track.appendChild(seg); fills.push(f);
    });
  }
  function yOf(node) { return node.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop; }
  function measure() {
    tops = sectionEls.map(yOf);
    var endY = yOf(document.getElementById('office-end'));
    sectionEls.forEach(function (s, i) {
      var h = (i + 1 < tops.length ? tops[i + 1] : endY) - tops[i];
      track.children[i].style.flexGrow = Math.max(h, 1);
    });
    tops.push(endY);
    update();
  }
  /* The reading line sits a quarter of the way down the visible text, not at the chrome's edge:
     a heading in the top quarter is what you are reading now. */
  function line() { var c = chromeTop.offsetHeight; return scroller.scrollTop + c + (scroller.clientHeight - c) * 0.25; }
  function update() {
    var y = line();
    var cur = -1;
    for (var i = 0; i < sectionEls.length; i++) if (tops[i] <= y) cur = i;
    var atBottom = scroller.scrollTop > 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
    /* A short last section can never reach the reading line; the end of the scroll is the end of the office. */
    if (atBottom) cur = sectionEls.length - 1;
    fills.forEach(function (f, i) {
      var frac = i < cur ? 1 : i > cur ? 0 : Math.min(1, Math.max(0, (y - tops[i]) / (tops[i + 1] - tops[i])));
      if (atBottom) frac = 1;
      f.parentNode.classList.toggle('ucr-seg-current', i === cur);
      f.style.transform = 'scaleX(' + frac.toFixed(3) + ')';
    });
    if (cur !== current) {
      current = cur;
      navTitle.textContent = cur < 0 ? words(office.office) : office.sections[cur].title;
      countEl.textContent = cur < 0 ? U.formatDate(shownDate) + ' \u00b7 ' + sectionEls.length + ' sections'
        : 'Section ' + (cur + 1) + ' of ' + sectionEls.length;
      var nxt = cur + 1;
      if (nxt < sectionEls.length) {
        nextKicker.textContent = cur < 0 ? 'Begin' : 'Next · ' + pad2(nxt + 1);
        nextTitle.textContent = office.sections[nxt].title;
        nextIcon.textContent = 'arrow_downward';
      } else {
        nextKicker.textContent = 'Last section';
        nextTitle.textContent = 'Finish ' + words(office.office);
        nextIcon.textContent = 'check';
      }
    }
  }
  function goTo(i) {
    var y = i >= sectionEls.length ? tops[tops.length - 1] : tops[i];
    scroller.scrollTo({ top: Math.max(0, y - chromeTop.offsetHeight + 1), behavior: 'smooth' });
  }
  var raf = 0;
  function layoutChanged() { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); }

  /* ---------- jump sheet ---------- */
  function sectionSummary(s) {
    var parts = [];
    s.blocks.forEach(function (b) {
      if (b.type === 'slot' && b.fill === 'psalms') parts.push(b.psalms.map(function (p) { return p.title; }).join(', '));
      else if (b.type === 'slot' && b.lesson) parts.push(b.lesson.citation + ' · ' + b.lesson.translation);
      else if (b.type === 'slot' && b.collect) parts.push(b.collect.title);
      else if (b.type === 'choice') {
        var id = state.choices[b.id] || b.default;
        parts.push(b.options.filter(function (o) { return o.id === id; })[0].title);
      } else if (b.when && b.when.officiant) {
        if (b.when.officiant === state.officiant) parts.push(b.title);
      } else if (b.type === 'versicles') parts.push('Officiant and People');
      else if (b.type === 'canticle' || b.type === 'prayer') { if (b.title) parts.push(b.title); }
    });
    return parts.join(' · ');
  }
  function pageRange(s) {
    var pg = s.blocks.map(function (b) { return b.source && b.source.page; }).filter(function (p) { return p != null; });
    if (!pg.length) return '';
    var a = Math.min.apply(null, pg), z = Math.max.apply(null, pg);
    return a === z ? 'p. ' + a : 'pp. ' + a + '–' + z;
  }
  function buildJump() {
    var list = document.getElementById('jump-list');
    list.textContent = '';
    office.sections.forEach(function (s, i) {
      var row = el('button', 'list-row surface-section ucr-jump-row');
      row.type = 'button';
      if (i === current) row.setAttribute('aria-current', 'location');
      var lead = el('div', 'leading leading-gap-md');
      if (i === current) {
        var here = el('span', 'ucr-jump-here');
        here.appendChild(el('span', 'labelBold10 text-brand-inverted', pad2(i + 1)));
        lead.appendChild(here);
      } else {
        lead.appendChild(el('span', 'ucr-jump-num labelBold20 text-secondary', pad2(i + 1)));
      }
      row.appendChild(lead);
      var content = el('div', 'list-row-content');
      var pair = el('div', 'list-row-text-pair');
      pair.appendChild(el('span', 'labelBold30', s.title));
      var sum = sectionSummary(s);
      if (sum) pair.appendChild(el('span', 'labelRegular10 text-secondary', sum));
      content.appendChild(pair);
      row.appendChild(content);
      var trail = el('div', 'trailing trailing-gap-md');
      trail.appendChild(el('span', 'labelRegular10 text-secondary', pageRange(s)));
      row.appendChild(trail);
      row.addEventListener('click', function () { closeJump(); setTimeout(function () { goTo(i); }, 60); });
      list.appendChild(row);
    });
    document.getElementById('jump-title').textContent = words(office.office);
    document.getElementById('jump-sub').textContent = U.formatDate(shownDate) + ' · ' +
      (current < 0 ? 'Not started' : 'Section ' + (current + 1) + ' of ' + sectionEls.length);
  }
  function openJump() { buildJump(); U.openModal('jump-modal'); }
  function closeJump() { U.closeModal('jump-modal'); }

  /* ---------- text sheet ---------- */
  function applyText() {
    document.documentElement.style.setProperty('--ussher-reading-size', state.size + 'px');
    root.classList.toggle('ucr-show-pages', !!state.pages);
    document.getElementById('size-count').textContent = state.size;
    document.getElementById('size-range').textContent = settings.textSize.min + '–' + settings.textSize.max + ' ' + settings.textSize.unit;
    document.getElementById('size-down').classList.toggle('disabled', state.size <= settings.textSize.min);
    document.getElementById('size-up').classList.toggle('disabled', state.size >= settings.textSize.max);
    document.getElementById('pages-switch').checked = !!state.pages;
    layoutChanged();
  }
  function buildPreview() {
    var p = document.getElementById('text-preview');
    var vr = office.sections.filter(function (s) { return s.id === 'preces-and-venite'; })[0].blocks[0];
    p.appendChild(renderVersicles({ lines: vr.lines.slice(0, 2) }, null));
  }

  /* ---------- boot ---------- */
  renderHeader();
  renderSections();
  buildTrack();
  buildPreview();

  document.getElementById('btn-sections').addEventListener('click', openJump);
  document.getElementById('jump-close').addEventListener('click', closeJump);
  document.getElementById('jump-top').addEventListener('click', function () { closeJump(); scroller.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.getElementById('btn-next').addEventListener('click', function () { goTo(current + 1); });
  document.getElementById('btn-text').addEventListener('click', function () { U.openModal('text-modal'); });
  document.getElementById('text-close').addEventListener('click', function () { U.closeModal('text-modal'); });
  document.getElementById('text-done').addEventListener('click', function () { U.closeModal('text-modal'); });
  document.getElementById('size-down').addEventListener('click', function () { if (state.size > settings.textSize.min) { state.size--; applyText(); } });
  document.getElementById('size-up').addEventListener('click', function () { if (state.size < settings.textSize.max) { state.size++; applyText(); } });
  document.getElementById('pages-switch').addEventListener('change', function (e) { state.pages = e.target.checked; applyText(); });
  scroller.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', layoutChanged);
  window.addEventListener('load', layoutChanged);
  if (document.fonts) document.fonts.ready.then(layoutChanged);

  applyText();

  /* Hooks for screenshots: USSHER.reader.goTo(i), .openJump(), .choose(id, opt) */
  U.reader = {
    goTo: function (i) { scroller.scrollTop = Math.max(0, tops[i] - chromeTop.offsetHeight + 1); update(); },
    top: function (id) { return tops[office.sections.map(function (s) { return s.id; }).indexOf(id)]; },
    openJump: openJump,
    measure: measure,
    showDay: function (iso) { showDay(iso); },
    set: function (o) { if ('pages' in o) state.pages = o.pages; if ('size' in o) state.size = o.size; applyText(); measure(); }
  };
})();
