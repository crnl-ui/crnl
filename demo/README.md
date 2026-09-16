# Sticker Sheet

Thirteen pages showing **every class and every token the system ships** — 739 classes
and 181 tokens — rendered live with the real CSS. Not a mockup of the system; the
system itself, running.

Open `index.html`.

## What each sheet covers

| Sheet | Covers |
|---|---|
| `01-color.html` | Backgrounds and the elevation ladder, text, borders, brand, the mode-aware interactive pair, status, all four alpha scales, scrims, the `--org-*` plumbing |
| `02-type.html` | All 63 text classes with live metrics, the display ramp, the ten text-pair scales, `-r` pairs, alignment / transform / decoration / truncation |
| `03-space.html` | The 8px scale, responsive spacing, every margin / padding / gap utility, containers, radius, borders, shadows, grids, visibility, icons |
| `04-buttons.html` | Nine types × three sizes × disabled, icon placement, fill, groups, the full circle-button matrix, the Apple Wallet button |
| `05-surfaces.html` | All 13 surfaces and 3 scale tiers, each subtle surface shown on `--bg-base` and on `--bg-surface` |
| `06-cards.html` | Closed and open cards, three grid rhythms, logo blocks, the tile and its interactivity rule |
| `07-rows.html` | Every list-row slot, gap, state and subcomponent; the selector; the event row in all five offer states; tags and chips |
| `08-forms.html` | Every input state, the select, the filter bar, the JS helpers |
| `09-nav.html` | Top bar, tabs, steps, page headers, the web footer, every product pattern |
| `10-tables.html` | The stat table — every cell and row state, the pinned leading column |
| `11-ios.html` | The phone frame running live in an iframe (`11-ios-frame.html`), the three-layer chrome stack, every iOS class |

## Three things that make it trustworthy

**Nothing is hardcoded.** Every colour is a token, every size a spacing token,
every type a text class. Names, dates and marks come through `demo-content.js`
(`RULES §6`), so the whole set re-themes with the switcher rather than showing
one brand's screenshots.

**Values are read, not written.** Token values, type metrics and safe areas come
from `getComputedStyle` at render time and re-resolve on every theme, mode or
viewport change. A number printed on a sheet is what the browser actually has.

**Completeness is checked.**

```
npm run check:demo
```

It diffs the sheets against `docs/css-api.json` and exits non-zero on either
kind of drift — a class or token in the CSS that appears on no sheet, or a class
used on a sheet that is not in the CSS. Run it after touching the CSS.

A class counts as covered two ways: a live specimen, or its name printed in the
page copy. Both are legitimate — a listing is how 300-odd spacing utilities get
shown without 300 identical boxes.

## Files

- `sheet.css` — the sticker sheet's own scaffolding (specimen grid, swatches,
  code labels), plus the page-level classes the design guide tells you to define
  yourself (`.row-wrap`, `.form-stack`, `.filter-bar`, `.section-header`). None of
  it is part of the system; all of it still obeys `RULES §2`.
- `sheet.js` — cross-sheet navigation from one manifest, live token resolution,
  and the wiring for the photographic slots.
- `demo-content.js` — a synthetic content layer so the sheets render without a
  CMS. A fixture; nothing in `css/` or `src/` knows it exists.
- `check-coverage.mjs` — the coverage check described above.
