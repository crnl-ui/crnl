# Crnl

**Open source. Ownable. Out of the box.**
**Simple. Standalone. Semantic.**

A token-based CSS design system with a typed React layer on the same tokens.
Two attributes on `<html>` re-skin an entire screen — `data-theme` picks the
palette and display type, `data-mode` picks light or dark — and `data-platform`
switches between a responsive web layout and a phone frame.

```html
<html data-theme="signal" data-mode="dark" data-platform="web">
  <head>
    <script src="css/crnl-loader.js"></script>
    <script src="css/prototype-harness.js"></script>
  </head>
```

That is the whole setup. **Nothing is fetched from a CDN.** The UI face, the
icon face and all 145 display faces ship in this repository with their licences,
so a page renders the same offline as online, on a plane, in a locked-down
network, in five years.

`crnl-loader.js` owns the stylesheet order — never hand-write `<link>` tags for
the CSS. `prototype-harness.js` injects the theme / mode / display-face switcher.

Open `demo/index.html` directly in a browser to see all of it. No server, no
build step.

---

## Why this exists

Design systems are usually built for a team of people who will read the
documentation. This one is built on the assumption that most of the code
written against it will be written by an agent, and most of the screens it
produces will be judged by someone who will never look at the code.

That changes what the system owes you:

**Rules have to be executable.** An agent cannot be relied on to have read a
style guide, but it can run a command. So `RULES.md` is paired with
`npm run lint`, which checks the rules against the same generated surface an
author reads and names the section each finding breaks.

**The surface has to be enumerable.** `docs/css-api.json` and
`docs/inventory.json` are generated from the CSS and the component tree. If a
class is not in them, it does not exist — which is a far more useful contract
than a search through prose.

**The failures that matter are the invisible ones.** A card on a card is blank
at rest and appears on hover, so the author — who is hovering — sees a working
component and everyone else sees an empty box. A hardcoded colour is correct in
exactly one mode. Those are the things checked statically, because those are the
ones a screenshot and a human eye both miss.

---

## Status

**Early. Nothing here is a stable API yet.** Token names, class names and
component props can all still move, and will. If you build on it, pin a commit.

Where it actually stands, measured rather than asserted — every number below
comes from `npm run check` or `npm run build:inventory`:

- **The CSS is the system.** 737 classes and 226 tokens across 25 stylesheets,
  every one of them rendered live on the demo sheets and held there by a
  coverage check that fails in both directions.
- **It ships in cascade layers**, so your own CSS overrides any of it without
  `!important` and without a specificity fight — unlayered styles beat layered
  ones by rule. `crnl.reset → tokens → primitives → components → patterns →
  utilities → platform`. That took the system's own `!important` count from
  118 to 6, and the six left are the one case the rule permits: beating an
  inline style, which no layer can reach.
- **The React layer is 19% of it**, and deliberately so. 18 components
  exporting 27 symbols, covering 55% of the component layer and none of the
  utilities. Everything else is markup plus classes, which is the normal way to
  use this. `docs/inventory.md` has the real per-layer breakdown.
- **Six checks run with no browser**, two more with. `npm run lint` is the new
  one, and it found a story file whose every class name was wrong, a
  product-layer `:hover` reimplementing the press mechanism, two classes
  duplicating a responsive type pair that already shipped, and a dead class
  left on nine sheets.
- **Not published to npm.** The manifest is `private` on purpose and the
  `@crnl` scope is reserved, so the name is held whether or not anything ships
  under it. Use this by vendoring — clone it, or copy `css/`, `fonts/` and
  `images/` into a project and point `crnl-loader.js` at them.
- **The largest known gap is keyboard access.** The documented way to make
  something tappable puts a surface class on a `<div>`, which no keyboard can
  reach. It is gap 0 in `docs/roadmap.md`, along with everything else that is
  missing and what closing it takes.

The licence is MIT and means what it says — the reservation above is about
maturity, not permission.

---

## Documentation

Five files, in the order you need them. The first two answer most questions and
are small enough to keep open.

| Read | For | Kind |
|---|---|---|
| [`RULES.md`](RULES.md) | every design rule, numbered and stable — the only file that states one | hand-written |
| [`docs/inventory.md`](docs/inventory.md) | what exists, by layer, and what React covers | generated |
| [`docs/css-api.md`](docs/css-api.md) | every class and token, exhaustively | generated |
| [`docs/design-guide.md`](docs/design-guide.md) | how each component composes, worked examples, troubleshooting | hand-written |
| [`docs/theming.md`](docs/theming.md) | authoring a theme: the token contract, a worked example | hand-written |
| [`docs/roadmap.md`](docs/roadmap.md) | what the system cannot yet do, ranked, and what it would take | hand-written |
| [`demo/index.html`](demo/index.html) | all of it rendered live, re-themeable in the corner | live |
| [`CLAUDE.md`](CLAUDE.md) | orientation for coding agents | hand-written |

Generated files are produced by `npm run build:docs` and committed. CI
regenerates them and fails if anything moved, because a stale reference is the
one failure mode none of the other checks can see.

---

## What's here

```
css/          the design system — 25 stylesheets, the source of truth
  crnl-loader.js            loads them in order and in layers, locally or bundled
  reset.css                 element defaults — the first cascade layer
  design-tokens-master.css  base tokens + the base theme (the contract)
  themes.css                five worked example themes
  ui-fonts.css              Inter + the icon font, self-hosted
  display-fonts.css         a tuned display ramp for each shipped face
  prototype-harness.js      the review switcher
fonts/        145 woff2 display faces, Inter, the icon font, every licence
images/       payment marks, store badges, placeholders — see images/NOTICE.md
src/          the React component library (src/index.ts exports)
demo/         thirteen sheets rendering every class and token, live
docs/         the guides, the generated reference, the roadmap
scripts/      generators and checks, including the linter
tools/        Font Lab — where the display faces come from, and how to cut more
tests/        visual regression output — generated locally, not committed
```

---

## Commands

```bash
npm install

npm run dev              # Storybook for the React components
npm run lint             # RULES.md, checked against docs/css-api.json
npm run check            # lint + themes, assets, icons, exports, demo coverage
npm run check:visual     # screenshot every sheet, diff against the baseline
npm run check:all        # both — run before you finish

npm run build:docs       # regenerate css-api.*, inventory.* and the CSS bundle
npm run build:fonts      # re-cut the display faces from tools/font-lab
npm run build:ui-fonts   # re-cut Inter and the icon font from upstream
```

### The checks, and what each one asserts

| Command | Asserts |
|---|---|
| `lint` | every rule in `RULES.md` that can be checked statically — 18 checks; `node scripts/lint.mjs --rules` lists them |
| `check:themes` | every `[data-theme]` supplies the whole token contract in both modes, and clears 4.5:1 on three pairs: the primary button, the transactional button, and the accent on base. Not the other seven button types — see `check:a11y` and `docs/roadmap.md § gap 8` |
| `check:assets` | every shipped SVG parses — a malformed one still serves, reports `complete`, and paints nothing |
| `check:icons` | every icon name in the markup is in the subset the font ships; one that is not renders as its own letters |
| `check:exports` | every path in `package.json`'s `exports` and `files` resolves |
| `check:demo` | the sheets still cover every class and token — fails on a class the CSS has and no sheet shows, *and* on a class a sheet uses that the CSS does not have |
| `check:a11y` | axe-core, WCAG 2 A and AA, over every sheet in both modes and the colour sheet in all five themes. Needs a browser, but runs in CI — its results are rule ids, not pixels |
| `check:visual` | every sheet still renders as it did — light and dark, at all three breakpoints, in both platforms, plus the colour sheet in all five themes, and a right-to-left pass. 98 shots |

`check:visual` is the one that *looks*. The others prove a class is mentioned;
this one proves it still renders. It needs a browser
(`npx playwright install chromium` once) and about a minute, which is why it is
not in `npm run check`.

**Its baselines are not committed, and the first run creates them.** They are
specific to the machine and browser build that made them — text rasterises
differently on macOS and Linux, and at this threshold that is the difference
between a clean run and 32 failures. When a change is intended, look at
`tests/visual/diff/` first, then accept it with `npm run check:visual --
--update`. Never update without looking; the point of the baseline is that
someone saw it.

### The lint baseline

`scripts/lint-baseline.json` records what the repository already carries: 186
findings across 22 file/rule pairs, itemised in `docs/roadmap.md`. The build
fails *above* those counts and is quiet at or below them, so existing debt does
not block work and no change can add to it.

```bash
node scripts/lint.mjs --strict            # ignore the baseline, see the real debt
node scripts/lint.mjs --update-baseline   # after deliberately fixing something
node scripts/lint.mjs --json              # machine-readable, for an agent
node scripts/lint.mjs path/to/page.html   # one file, baseline not consulted
```

A run that comes in *under* the baseline fails too, not just over it —
otherwise a fix is quietly banked and the next regression lands free, and a
rule that stops matching is indistinguishable from progress.

---

## Themes

Five ship as worked examples of the contract — `ink`, `signal`, `moss`, `ember`,
`violet` — each in light and dark. Omit `data-theme` entirely and the base theme
in `design-tokens-master.css` applies, so the token set is never half-defined.

A theme sets tokens and nothing else: brand colours, the display face and its
nine-step ramp, button radius, and per-mode surfaces and accents. It never
writes a rule, never defines a class, never touches a component. The switcher
discovers themes from the loaded CSS, so a new one appears in it with no other
edit. `docs/theming.md` is the full contract; `npm run check:themes` is what
tells you a theme is incomplete.

## Display faces

145 families, each with a nine-step ramp tuned against this system's fixed line
heights. Pick one per theme, or swap without touching the theme:

```html
<html data-theme="ink" data-display-font="horsecollar">
```

`fonts/catalog.json` lists every family with its source, licence, weight,
tracking and whether it renders caps. A `Caps` family remaps lowercase
codepoints to the uppercase glyphs, so title-case copy renders as caps with
uppercase kerning intact — which is why `text-transform` is banned (`RULES §2`)
and why the linter checks for it.

The TTFs for desktop and Figma are in `tools/font-lab/built-fonts/`, with
`install-fonts.sh` to put the shipping set in `~/Library/Fonts`.

---

## Licence

Code: MIT, see `LICENSE`.

Fonts: each face is a modified cut of an OFL or Apache-licensed family (the
display faces, Inter, and Material Symbols Rounded). A cut of an OFL family
stays under OFL 1.1, as that licence requires of modified versions; an
Apache-sourced cut stays under Apache 2.0. The original copyright, designer and
licence records are preserved in every file, and the full licence text for each
is in `fonts/licenses/`. `fonts/catalog.json` maps every shipped family to its
source family and licence. Redistributing them means shipping those licence
files too.

Brand marks: the payment, wallet and app store marks in `images/` are
trademarks of their owners and are **not** MIT — they are not this project's to
licence, and are included under nominative use. `images/NOTICE.md` records what
belongs to whom, which files there are original and MIT, and where to get
current artwork. `pay-generic.svg` is the neutral card mark if you would rather
not ship the real ones.
