# CLAUDE.md — Crnl

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

**Crnl** is a token-based CSS design system (the source of truth) plus a typed
React component library built on the same tokens. Two attributes on `<html>` re-skin
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
├── crnl-loader.js      loads every stylesheet in order (local sheets or bundle)
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
tests/visual/         screenshot baselines and diffs — both generated, both ignored
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
| `css/crnl.css` (the delivery bundle, gitignored) | `npm run build:css-bundle` |

### After any change to CSS or docs

```bash
npm run check          # themes, assets, icons, demo coverage — fast, no browser
npm run check:visual   # screenshot every sheet and diff it against the baseline
npm run check:all      # both
npm run build:docs     # regenerates css-api.md and the CSS bundle
```

`npm run check:themes` asserts every `[data-theme]` supplies the whole token
contract in both modes and clears 4.5:1 on its button and accent pairs.
`npm run check:assets` asserts every shipped SVG parses — a malformed one still
serves with the right content-type and still reports `complete` on an `<img>`,
it just paints nothing. `npm run check:icons` asserts every icon name in the
markup is in the subset the icon font actually ships; one that is not renders
as its own letters rather than failing. `npm run check:exports` asserts every
path in `package.json`'s `exports` and `files` resolves — the manifest is the
one interface nothing else reads, and it shipped pointing at a file the build
never produced. `npm run check:demo` asserts the demo sheets still cover
every class and token — it fails both ways, on a class in the CSS that no sheet
shows and on a class a sheet uses that the CSS does not have.

`npm run check:visual` is the one that *looks*. The others prove a class is
mentioned; this one proves it still renders. It captures every sheet in light
and dark plus the colour sheet in all five themes, and diffs each against
`tests/visual/baseline/`. It needs a browser (`npx playwright install chromium`
once) and takes about a minute, which is why it is not in `npm run check`.

**Baselines are not committed, and the first run creates them.** They are
specific to the machine and browser build that made them — text rasterises
differently on macOS and Linux, and at this threshold that is the difference
between a clean run and 32 failures. So they are generated locally, per
rendering environment: run `npm run check:visual` once and it writes the set.
If you ever want them shared, pin the renderer (a container) first, because a
baseline from a different machine is noise.

When a change is intended, look at `tests/visual/diff/` first — each failure
writes a three-panel diff and the new capture — then accept it with
`npm run check:visual -- --update`. Never update without looking; the point of
the baseline is that someone saw it.

Two numbers in `scripts/visual.mjs` are calibrated, not guessed, and the
reasoning is in the file: the pixel threshold is 0.02 rather than pixelmatch's
default 0.1 (at 0.1, squaring the corners of every card scored zero, because a
card sits only a few points off its background), and the failure limit is an
absolute pixel count rather than a percentage (one changed rule is 0.003% of a
10,000px sheet).

### Load order

`crnl-loader.js` owns the stylesheet list and order; `scripts/lib/load-order.mjs`
parses it so nothing keeps a second copy. Never hand-write `<link>` tags or a
load-order list in a page or a doc (`RULES §1`). Adding a stylesheet = add it to
`crnl-loader.js`, run `build:docs`.

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

## Two-pass prototype building

When building a prototype, work in two passes. The order matters: pass 1 that
stops to ask about every gap produces nothing, and pass 1 without pass 2
produces something that quietly invents its own system.

**Pass 1 — functionality first.** Build a working prototype. Use existing
patterns and components wherever they clearly apply. For a feature with no
existing pattern — a new layout, a new interaction, something the system does
not cover — build it anyway from tokens and primitives. Do not get blocked, and
do not force an ill-fitting component just to stay "on pattern."

Then give the preview link, briefly note anywhere you improvised, and ask:

> "Want me to do a design system pass? I can check for inconsistencies and
> tighten up anything that's not using the right tokens or components."

**Pass 2 — design system refinement, when asked.** Audit against `RULES.md`:
hardcoded values (`§2`), custom CSS that duplicates a component (`§3`), patterns
that approximate a component without using it (`§3`), hardcoded content (`§6`).
Fix each against its rule.

For any **new pattern** from pass 1, present it explicitly rather than leaving it
in place:

> "I built [X] as a new pattern since the system doesn't have one for this.
> Want to:
> (a) replace it with the closest existing component, or
> (b) keep the new pattern but build it properly — only tokens and primitives,
> as if it were a new design system component?"

On (b), rebuild it clean: no hardcoded values, no one-off CSS, structured as a
reusable block on the same token conventions as the rest of the system. If it
earns a permanent place, that means CSS, a name in `css-api.md`, a specimen on a
demo sheet and a line in the design guide — a pattern that exists in one
prototype is not in the system.

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
  instead. crnl-loader.js used to hide the whole page for up to 3s to paper over
  this; see the note where that gate used to be.
- **`.material-symbols-rounded` is defined in `icons.css`, not by Google.**
  It is the upstream class, reproduced with upstream defaults (24px, FILL 0) —
  which differ from `.icon` (the size ramp, FILL 1). Do not merge them.
- **Safari iOS font loading** — `font-style: oblique` renders differently in
  Safari; avoid it.
- **`docs/css-api.md` is only as current as the last `build:css-api`.** If a
  class you can see in the CSS is missing from it, regenerate before concluding
  anything.
