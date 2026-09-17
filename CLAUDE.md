# CLAUDE.md

Read automatically at session start. This file is **orientation**: what this
repository is, where things live, how to operate on it. It states no design
rules — those live in `RULES.md` and are cited here by section (`RULES §3`).

---

## Start here

Read in this order. The first two are small and answer most questions.

1. **`RULES.md`** — every design rule, numbered and stable. Always read it.
2. **`docs/css-api.md`** — every class and token, generated from the CSS. If a
   class is not in there, it does not exist. Search it before inventing one.
3. **`demo/`** — thirteen sheets rendering every class and token live, in the
   real CSS, at every state. Open the sheet for what you are building before
   composing anything from primitives.
4. **`docs/design-guide.md`** — long-form component reference with worked
   examples and troubleshooting. Read when 1–3 leave a gap.
5. **`docs/theming.md`** — the token contract a theme fills, and how to write one.

Then build, and run `npm run check` before calling it done (`RULES §10`).

---

## What this is

A token-based CSS design system (the source of truth) plus a typed React
component library built on the same tokens. Two attributes on `<html>` re-skin
an entire screen — `data-theme` picks the palette and display type, `data-mode`
picks light or dark — and `data-platform` switches between a responsive web
layout and a phone frame (`RULES §1`, `§9`).

It ships no content, no brand assets, no paid fonts and no CDN dependency —
the UI face, the icon face and the 145 display faces are all open-licence cuts
served from this repository, with their licences included.

Themes: `ink` `signal` `moss` `ember` `violet`, plus the base theme that applies
when `data-theme` is absent. They are worked examples of the contract, not a
fixed set — `docs/theming.md` is how to add one.

---

## Where things live

```
css/                  CSS source — the design system itself
├── ds-loader.js      loads every stylesheet in order (local sheets or bundle)
├── design-tokens-master.css   base tokens + the base theme (the contract)
├── themes.css        the five shipped themes
├── display-fonts.css a tuned display ramp per shipped face  [GENERATED]
├── fonts.css         @font-face per shipped face            [GENERATED]
├── ui-fonts.css      Inter + the icon font, both self-hosted
├── prototype-harness.js  injects the theme/mode/face switcher
└── device-sync.js    links theme and mode across open tabs
fonts/                145 woff2 faces, catalog.json, every licence
images/               payment marks, store badges, a placeholder logo
src/                  React component library (src/index.ts exports)
demo/                 the sticker sheet — every class and token, rendered live
├── demo-content.js   a synthetic content layer; a fixture, not part of the system
└── check-coverage.mjs  fails when the CSS and the sheets drift
docs/                 design-guide.md, theming.md, css-api.md [GENERATED]
scripts/              generators and checks
tools/font-lab/       where the display faces come from, and how to cut more
RULES.md              the rules (hand-written, cited everywhere)
```

---

## Operating on the system

### Source of truth and what is generated

The CSS files in `css/` are the source of truth. Four things are
**generated — never hand-edit**:

| Generated | By |
|---|---|
| `css/fonts.css`, `css/display-fonts.css`, the display `fonts/*.woff2`, `fonts/catalog.json` | `npm run build:fonts` |
| `fonts/inter.woff2`, `fonts/material-symbols-rounded.woff2`, `fonts/icons.json` | `npm run build:ui-fonts` |
| `docs/css-api.md`, `docs/css-api.json` | `npm run build:css-api` |
| `css/ds.css` (the delivery bundle, gitignored) | `npm run build:css-bundle` |

### After any change to CSS or docs

```bash
npm run check          # theme contract + contrast, and demo coverage
npm run build:docs     # regenerates css-api.md and the CSS bundle
```

`npm run check:themes` asserts every `[data-theme]` supplies the whole token
contract in both modes and clears 4.5:1 on its button and accent pairs.
`npm run check:assets` asserts every shipped SVG parses — a malformed one still
serves with the right content-type and still reports `complete` on an `<img>`,
it just paints nothing. `npm run check:icons` asserts every icon name in the
markup is in the subset the icon font actually ships; one that is not renders
as its own letters rather than failing. `npm run check:demo` asserts the demo sheets still cover
every class and token — it fails both ways, on a class in the CSS that no sheet
shows and on a class a sheet uses that the CSS does not have.

### Load order

`ds-loader.js` owns the stylesheet list and order; `scripts/lib/load-order.mjs`
parses it so nothing keeps a second copy. Never hand-write `<link>` tags or a
load-order list in a page or a doc (`RULES §1`). Adding a stylesheet = add it to
`ds-loader.js`, run `build:docs`.

### Adding a token

Add it to the file that owns that scale (`spacing-tokens.css`,
`border-effects-tokens.css`, …), follow the existing naming, and flag the new
name before it ships — token names are permanent API. Never resolve a missing
step with an inline literal (`RULES §2`).

### Adding a theme

A theme is tokens only, in three blocks. `docs/theming.md` has the contract and
a worked example. The switcher discovers themes from the loaded CSS, so nothing
else needs editing. Run `npm run check:themes` after.

### Adding an icon

The icon font is subset to what the repository uses — that is what makes 15MB
of Material Symbols into 19KB. Use the new name, then run
`npm run build:ui-fonts` to re-cut the font. `npm run check:icons` is what tells
you when you have forgotten.

### Adding a display face

The faces are cut by `tools/font-lab/_build/build_fonts.py` from open Google
Fonts sources: instanced to a weight, vertical metrics corrected by a per-family
nudge, lowercase optionally remapped to uppercase glyphs, and renamed. The
process and its reasoning are in `tools/font-lab/README.md`. Once a cut exists
in `tools/font-lab/built-fonts/` with a spec in `display-specs.json`,
`npm run build:fonts` regenerates the woff2 set and both font stylesheets.

### Local development

- Any `.html` in `demo/` opens directly in a browser — no server.
- `npm run dev` — Storybook for the React components.

---

## New patterns

When a need has no equivalent in the system, it is a **new pattern**. Do not
build it quietly. Name it, and offer two options:

1. **Build it in the prototype**, from tokens and primitives only, with an HTML
   comment above it saying what it is and why the system did not cover it.
2. **Add it to the system**, which means a place in the CSS, a name in
   `css-api.md`, a specimen on a demo sheet, and a line in the design guide.

Flagging it is what makes it allowed; building it silently is what `RULES §2`
forbids. Before concluding the system lacks something, name the *need* and
search `docs/css-api.md` and `demo/` for it — the error is almost always
reaching for a remembered shape rather than the need behind it.

---

## Refining an existing prototype

Audit in this order, each against its rule: hardcoded values (`RULES §2`),
custom CSS that duplicates a component (`RULES §3`), `:hover`/`:active` on
interactive elements (`RULES §2`), hardcoded content (`RULES §6`). Whatever
remains with no equivalent is a new pattern — see above.

---

## Gotchas

Everything symptom-shaped (a token that vanishes in dark mode, a double border,
a stepper that won't disable) is in `docs/design-guide.md § Troubleshooting`.
Two that are not visible from inside a page:

- **The icon font must stay on `font-display: block`.** An icon is a ligature
  over its own name, so on `swap` a nav bar renders the words "home", "sell",
  "confirmation_number" until the font arrives. `block` holds them invisible
  instead. ds-loader.js used to hide the whole page for up to 3s to paper over
  this; see the note where that gate used to be.
- **`.material-symbols-rounded` is defined in `icons.css`, not by Google.**
  It is the upstream class, reproduced with upstream defaults (24px, FILL 0) —
  which differ from `.icon` (the size ramp, FILL 1). Do not merge them.
- **Safari iOS font loading** — `font-style: oblique` renders differently in
  Safari; avoid it.
- **`docs/css-api.md` is only as current as the last `build:css-api`.** If a
  class you can see in the CSS is missing from it, regenerate before concluding
  anything.
