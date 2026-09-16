/* =============================================================================
   demo-content.js — a synthetic content layer for the demo sheets
   =============================================================================
   The design system ships no content layer (RULES §6): a project supplies its
   own. The demo sheets still need *something* to render, so this file is that
   something — a deliberately fictional dataset behind the same two interfaces a
   real loader would expose:

     1. `data-content="path.to.value"` on an element, resolved into its text or,
        with `data-content-attr="src"`, into an attribute.
     2. `window.ContentLoader` — asset(), platform(), load(), featuredGame() and
        a date formatter.

   It is a demo fixture, not a component of the system. Nothing in css/ or src/
   knows it exists. Copy the shape, not the data.

   Everything here is invented: the entity, the venue and every counterparty.
   ============================================================================= */
(function () {
  'use strict';

  var BASE = '../images/';

  /* ---------- Assets: ids, never paths (RULES §6) ------------------------ */
  var ASSETS = {
    'logo.brand':        BASE + 'placeholder-logo.svg',
    'badge.app-store':   BASE + 'badge-app-store.svg',
    'badge.google-play': BASE + 'badge-google-play.svg',
    'pay.visa':          BASE + 'pay-visa.svg',
    'pay.mastercard':    BASE + 'pay-mastercard.svg',
    'pay.amex':          BASE + 'pay-amex.svg',
    'pay.discover':      BASE + 'pay-discover.svg',
    'pay.generic':       BASE + 'pay-generic.svg',
    'wallet.apple':      BASE + 'wallet-apple.svg',
    'wallet.google':     BASE + 'wallet-google.svg',
    'pay.applepay':      BASE + 'pay-applepay.svg',
    'pay.googlepay':     BASE + 'pay-googlepay.svg',
  };

  /* ---------- The fictional brand this demo renders ---------------------- */
  var BRAND = {
    slug: 'acme',
    identity: { full: 'Acme Athletic Club', short: 'Acme', abbreviated: 'ACM' },
    venue: { name: 'Example Field', city: 'Springfield' },
    assets: { logo: 'logo.brand' },
    media: { actionPhotos: [] },
  };

  /* ---------- Platform-level chrome -------------------------------------- */
  var PLATFORM = {
    brand: {
      logo: 'logo.brand',          /* an asset id, resolved to a URL */
      poweredBy: 'Built on an open design system',
      privacyPolicy: { label: 'Privacy Policy', href: '#' },
      termsOfUse:    { label: 'Terms of Use',   href: '#' },
      appStore:      { image: ASSETS['badge.app-store'],   label: 'Download on the App Store' },
      googlePlay:    { image: ASSETS['badge.google-play'], label: 'Get it on Google Play' },
      appleWallet:   { image: ASSETS['wallet.apple'],  label: 'Add to Apple Wallet' },
      googleWallet:  { image: ASSETS['wallet.google'], label: 'Add to Google Wallet' },
      paymentGeneric: { image: ASSETS['pay.generic'], label: 'Card' },
      paymentBrands: [
        { image: ASSETS['pay.visa'],       label: 'Visa' },
        { image: ASSETS['pay.mastercard'], label: 'Mastercard' },
        { image: ASSETS['pay.amex'],       label: 'American Express' },
        { image: ASSETS['pay.discover'],   label: 'Discover' },
      ],
      paymentWallets: [
        { image: ASSETS['pay.applepay'],  label: 'Apple Pay' },
        { image: ASSETS['pay.googlepay'], label: 'Google Pay' },
      ],
    },
  };

  /* ---------- A fixture list -------------------------------------------
     Shaped the way the sheets consume it: a `games` array whose records carry
     their own status, sides and — where the status calls for them — scores.
     One of each state, so every state of .game-summary has something to draw. */
  function iso(daysFromNow) {
    var d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().slice(0, 10);
  }
  function counterparty(id, name, short, abbr, color) {
    return { id: id, name: name, short: short, abbr: abbr, color: color, logo: ASSETS['logo.brand'] };
  }
  var SCHEDULE = {
    games: [
      {
        id: 'g1', status: 'upcoming', date: iso(6), time: '7:30 PM', isHome: true,
        venue: BRAND.venue.name,
        opponent: counterparty('north', 'Northside United', 'Northside', 'NTH', '#2F5D8C'),
        record: { team: '24-11', opponent: '19-16' },
      },
      {
        id: 'g2', status: 'live', date: iso(0), time: '7:30 PM', isHome: false,
        venue: 'Harbor Park',
        opponent: counterparty('harbor', 'Harbor City FC', 'Harbor', 'HBR', '#7A2E3F'),
        record: { team: '24-11', opponent: '21-14' },
        live: { clock: "68'", team: 2, opponent: 1 },
      },
      {
        id: 'g3', status: 'final', date: iso(-4), time: '6:00 PM', isHome: true,
        venue: BRAND.venue.name,
        opponent: counterparty('valley', 'Valley Rangers', 'Valley', 'VAL', '#3E6B4A'),
        record: { team: '23-11', opponent: '17-18' },
        score: { team: 3, opponent: 1 },
      },
    ],
  };

  /* ---------- Path resolution for data-content --------------------------- */
  function resolve(path, ctx) {
    return path.split('.').reduce(function (acc, part) {
      if (acc == null) return undefined;
      var m = part.match(/^(\w+)\[(\d+)\]$/);
      if (m) { var arr = acc[m[1]]; return arr && arr[Number(m[2])]; }
      return acc[part];
    }, ctx);
  }

  function apply() {
    var ctx = { brand: BRAND, platform: PLATFORM, schedule: SCHEDULE };
    document.querySelectorAll('[data-content]').forEach(function (el) {
      var value = resolve(el.getAttribute('data-content'), ctx);
      if (value == null) return;
      /* An asset id resolves to a URL; anything else is already a literal. */
      var isAsset = typeof value === 'string' && Object.prototype.hasOwnProperty.call(ASSETS, value);
      if (isAsset) value = ASSETS[value];
      /* An explicit target wins. Otherwise an <img> takes src — writing a URL
         into an image's textContent silently leaves it blank, which is how a
         missing data-content-attr hides for a long time. */
      var attr = el.getAttribute('data-content-attr') ||
                 (el.tagName === 'IMG' || el.tagName === 'SOURCE' ? 'src' : null);
      if (attr) el.setAttribute(attr, value);
      else el.textContent = value;
    });
    document.dispatchEvent(new CustomEvent('content-loaded', {
      detail: { brand: BRAND, platform: PLATFORM, schedule: SCHEDULE },
    }));
  }

  /* ---------- The loader surface the sheets call ------------------------- */
  window.ContentLoader = {
    asset: function (id) { return ASSETS[id] || id || ''; },
    platform: function () { return PLATFORM; },
    brands: function () { return { acme: BRAND }; },
    schedule: function () { return SCHEDULE; },
    /** The one fixture every screen agrees to feature: the next one upcoming.
        Takes the schedule object or a bare games array, because both shapes
        show up in the sheets. */
    featuredGame: function (schedule) {
      var list = (schedule && schedule.games) || schedule || SCHEDULE.games;
      return list.filter(function (g) { return g.status === 'upcoming'; })[0] || list[0];
    },
    formatters: {
      fmtShortDate: function (d) {
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      },
      fmtTime: function (d) {
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      },
    },
    load: function () {
      return Promise.resolve({ brand: BRAND, platform: PLATFORM, schedule: SCHEDULE });
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
}());
