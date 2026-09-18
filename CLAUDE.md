# CLAUDE.md — Crnl

Read automatically at session start. This file is **orientation**: what this
repository is, where things live, how to operate on it. It states no design
rules — those live in `RULES.md` and are cited here by section (`RULES §3`).

---

## Start here

Read in this order. The first three are small and answer most questions.

1. **`RULES.md`** — every design rule, numbered and stable. Always read it.
2. **`docs/inventory.md`** — what exists, by layer, and what the React layer
   covers. Generated. Read this before concluding the system lacks something.
3. **`docs/css-api.md`** — every class and token, exhaustively. Generated. If a
   class is not in there, it does not exist. Search it before inventing one.
4. **`demo/`** — thirteen sheets rendering every class and token live, in the
   real CSS, at every state. Open the sheet for what you are building before
   composing anything from primitives.
5. **`docs/design-guide.md`** — long-form component reference with worked
   examples and troubleshooting. Read when 1–4 leave a gap.
6. **`docs/theming.md`** — the token contract a theme fills, and how to write one.
7. **`docs/roadmap.md`** — what the system cannot yet do, and what closing each
   gap takes. Read before proposing new system surface.

Then build, and **run `npm run check` before calling it done** (`RULES §10`).
It runs the linter first.

### Read the machine-readable versions

Three files are generated from the CSS and the component tree, and are the ones
to actually parse:

| File | Holds |
|---|---|
| `docs/css-api.json` | the full class and token surface, per stylesheet |
| `docs/inventory.json` | the same, joined to the React layer and the demo sheets |
| `scripts/lint-baseline.json` | what debt the repository already carries |

`node scripts/lint.mjs --json` gives findings in the same shape.

---

## What this is

**Crnl** is a token-based CSS design system (the source of truth) plus a typed
React component library built on the same tokens. Two attributes on `<html>`
re-skin an entire screen — `data-theme` picks the palette and display type,
`data-mode` picks light or dark — and `data-platform` switches between a
responsive web layout and a phone frame (`RULES §1`, `§9`).

It ships no content, no brand assets, no paid fonts and no CDN dependency — the
UI face, the icon face and the 145 display faces are all open-licence cuts
served from this repository, with their licences included.

Themes: `ink` `signal` `moss` `ember` `violet`, plus the base theme that applies
when `data-theme` is absent. They are worked examples of the contract, not a
fixed set — `docs/theming.md` is how to add one.

**The React layer is 19% of the system and is not a parity target.** 18
components, covering 55% of the component layer and none of the utilities.
Everything else is markup plus classes, which is the normal way to use this. Do
not reach for a React component that does not exist, and do not build one
because a class lacks a wrapper.

---

## Where things live

```
css/                  CSS source — the design system itself
├── crnl-loader.js      loads every stylesheet in order (local sheets or bundle)
├── reset.css         element defaults — the first cascade layer
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
docs/                 design-guide.md, theming.md, roadmap.md,
                      css-api.md [GENERATED], inventory.md [GENERATED]
scripts/              generators and checks
├── lint.mjs          RULES.md, made executable
└── lint-baseline.json  the debt it already knows about
tools/font-lab/       where the display faces come from, and how to cut more
RULES.md              the rules (hand-written, cited everywhere)
```

---

## Operating on the system

### Source of truth and what is generated

The CSS files in `css/` are the source of truth. Five things are
**generated — never hand-edit**:

| Generated | By |
|---|---|
| `css/fonts.css`, `css/display-fonts.css`, the display `fonts/*.woff2`, `fonts/catalog.json` | `npm run build:fonts` |
| `fonts/inter.woff2`, `fonts/material-symbols-rounded.woff2`, `fonts/icons.json` | `npm run build:ui-fonts` |
| `docs/css-api.md`, `docs/css-api.json` | `npm run build:css-api` |
| `docs/inventory.md`, `docs/inventory.json` | `npm run build:inventory` |
| `css/crnl.css` (the delivery bundle, gitignored) | `npm run build:css-bundle` |
| `css/crnl-layers.css` (the bundler entry point, committed) | `npm run build:css-bundle` |

### After any change to CSS, markup or docs

```bash
npm run lint           # RULES.md against docs/css-api.json — run this first
npm run check          # lint + themes, assets, icons, exports, demo coverage
npm run check:visual   # screenshot every sheet and diff it against the baseline
npm run check:all      # both
npm run build:docs     # regenerates css-api.*, inventory.* and the CSS bundle
```

### The linter

`npm run lint` is the one that reads `RULES.md` back to you. It checks the same
two sources an author does — the class and token surface from
`docs/css-api.json`, the rules from `RULES.md` — and every finding names the
section it broke.

Thirteen rules today, listed in `scripts/lint.mjs`. The ones that catch the most:

- **`unknown-class`** — a class not in `docs/css-api.json`. This is the rule
  that matters most to you: it is the mechanical form of "if it is not in
  css-api.md it does not exist," and it is how an invented class gets caught
  before it ships looking unstyled.
- **`surface-on-surface`** — the failure that is invisible while you build. The
  inner element paints nothing at rest and appears on hover, so the author, who
  is hovering, sees a working component.
- **`no-hardcoded-colour`** — and where the literal equals a token that already
  exists, the finding names the token.
- **`bare-control`**, **`no-hover-rule`**, **`no-type-override`**,
  **`no-text-transform`**, **`icon-form`**, **`btn-no-scale`**.

Useful invocations:

```bash
node scripts/lint.mjs path/to/page.html   # one file; the baseline is not consulted
node scripts/lint.mjs --json              # findings as data
node scripts/lint.mjs --strict            # ignore the baseline, see the real debt
```

**The baseline.** `scripts/lint-baseline.json` records what the repository
already carries — 186 findings, itemised in `docs/roadmap.md`. The build fails
*above* those counts and is quiet at or below them, so existing debt does not
block you and nothing you write can add to it. If you deliberately fix
something, run `node scripts/lint.mjs --update-baseline` and commit the result.
**A run that comes in *under* the baseline fails too**, not just over it: a
count that drops without the file being updated means either a fix was not
banked — so the next regression lands free — or a rule quietly stopped
matching. The second is not hypothetical; converting the CSS for RTL renamed
`padding-left` to `padding-inline-start`, the spacing pattern stopped at the
axis, and 20 findings vanished with nothing fixed.

**Escapes.** A rule with a genuine exception takes an inline escape, and the
reason is required:

```html
<!-- crnl-lint-disable-next-line unknown-class -- page scaffolding, see sheet.css -->
```

An escape with no reason is itself a finding. Do not add one to make a run go
green; if a rule is wrong, say so.

### The other checks

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
mentioned; this one proves it still renders. 88 shots: every sheet in light and
dark at all three breakpoints, the app platform where it applies, and the
colour sheet in all five themes, each diffed against `tests/visual/baseline/`.
The three widths are not optional coverage — the responsive utilities, the
`-r` type pairs and most of `platform-tokens.css` only apply below 1100px. It needs a browser (`npx playwright install chromium`
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

### Load order and cascade layers

`crnl-loader.js` owns the stylesheet list, the order, **and** the layer map;
`scripts/lib/load-order.mjs` parses all three so nothing keeps a second copy.
Never hand-write `<link>` tags or a load-order list in a page or a doc
(`RULES §1`). Adding a stylesheet = add it to `crnl-loader.js`, put it in a
layer, run `build:docs`.

The system ships inside seven layers:

```
crnl.reset → crnl.tokens → crnl.primitives → crnl.components
           → crnl.patterns → crnl.utilities → crnl.platform
```

Three consequences worth holding:

- **Anything you write outside a layer beats all of it**, whatever the
  specificity. A prototype's own CSS needs no `!important` and no
  specificity games to override a component — that is the point.
- **A later layer beats an earlier one regardless of specificity.** So a
  reset rule can no longer be out-specified by a component rule; it is
  simply earlier, and loses. This is why `reset.css` exists separately from
  `boilerplate.css` and is the first layer of all.
- **`!important` reverses the order** — an important declaration in an
  *earlier* layer beats one in a later layer. Two rules racing with
  `!important` across layers will resolve the opposite way from what
  specificity suggests. When a component needs to change what a utility
  paints, **set the token, don't re-declare the class**: custom properties
  resolve independently of layers, so `--text-secondary: …` in scope always
  wins. `.selector.is-selected` is the worked example.

### Adding a token

Add it to the file that owns that scale (`spacing-tokens.css`,
`border-effects-tokens.css`, …), follow the existing naming, and flag the new
name before it ships — token names are permanent API. Never resolve a missing
step with an inline literal (`RULES §2`).

### Adding a class

Three things have to happen together or a check fails:

1. the rule in the stylesheet that owns that layer,
2. a specimen on the demo sheet for that topic, or its name printed in the page
   copy if it is one of a utility scale (`npm run check:demo` enforces this),
3. `npm run build:docs`, so `css-api.*` and `inventory.*` know about it.

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

### Adding a lint rule

Most of `RULES.md` is still prose — twelve rules are checked, roughly thirty are
written. `docs/roadmap.md § gap 1` lists which are tractable and which are not.
A new rule goes in `scripts/lint.mjs` beside its siblings, cites its section in
the `rules` array, and ships with its baseline recorded in the same commit.

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

**Pass 2 — design system refinement, when asked.** Start with
`node scripts/lint.mjs <the files you wrote>` — it finds the mechanical half in
a second and names the rule for each. Then audit what it cannot see: patterns
that approximate a component without using it (`§3`), hardcoded content (`§6`),
a shape the system did not give you (`§2`).

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
search `docs/inventory.md`, `docs/css-api.md` and `demo/` for it — the error is
almost always reaching for a remembered shape rather than the need behind it.

---

## Refining an existing prototype

Run `node scripts/lint.mjs <files>` first — hardcoded values, custom `:hover`,
bare controls, unknown classes and surface-on-surface all come back named, with
their rule. Then audit by hand for what the linter cannot see: custom CSS that
duplicates a component (`RULES §3`), hardcoded content (`RULES §6`), and mixed
content shapes in one set (`RULES §2`). Whatever remains with no equivalent is
a new pattern — see above.

---

## Gotchas

Everything symptom-shaped (a token that vanishes in dark mode, a double border,
a stepper that won't disable) is in `docs/design-guide.md § Troubleshooting`.
These are the ones not visible from inside a page:

- **A tappable `<div>` is not reachable by keyboard.** `RULES §3 #14` says a
  tappable thing takes a `.surface-*` + `.scale-*` pair, and the pair goes on
  whatever element you are styling — which in most of the existing markup is a
  `<div>`. Put it on a `<button>` or an `<a>` where you can. This is a known
  hole in the system, not just in your page: `docs/roadmap.md § gap 0`.
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
- **The React props are the CSS names.** `<Button size={700}>` is `.btn-700`;
  `<Chip surface="borderNeutral">` is `.surface-borderNeutral`. If you know
  the class you know the prop, and a component that renames one is a bug —
  there used to be three, and they are what `docs/roadmap.md § gap 3` was
  about.
- **`docs/css-api.md` is only as current as the last `build:css-api`.** If a
  class you can see in the CSS is missing from it, regenerate before concluding
  anything — and the linter reads the same file, so a stale one makes it report
  a real class as invented.
