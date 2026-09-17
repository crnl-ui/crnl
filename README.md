# Crnl

A token-based CSS design system with a typed React layer on the same tokens.
Two attributes on `<html>` re-skin an entire screen — `data-theme` picks the
palette and display type, `data-mode` picks light or dark — and `data-platform`
switches between a responsive web layout and a phone frame.

Everything here is self-contained: no CMS, no CDN, no external brand assets, no
paid fonts. The 145 display faces it ships are open-licence (OFL / Apache) cuts,
re-metricated and renamed, with every licence included — as are Inter and the
icon font.

```html
<html data-theme="signal" data-mode="dark" data-platform="web">
  <head>
    <script src="css/crnl-loader.js"></script>
    <script src="css/prototype-harness.js"></script>
  </head>
```

That is the whole setup. **Nothing is fetched from a CDN** — the UI face, the
icon face and the 145 display faces all ship here, so a page renders the same
offline as online.

`crnl-loader.js` owns the stylesheet order — never hand-write `<link>` tags for
the CSS. `prototype-harness.js` injects the theme / mode / display-face switcher.

## Status

**Early. Nothing here is a stable API yet.** Token names, class names and
component props can all still move, and will. If you build on it, pin a commit.

Where it actually stands:

- **The CSS is the system.** 739 classes and 226 tokens, covered by the demo
  sheets and five programmatic checks.
- **The React layer is a subset**, not parity — 18 components against those 739
  classes. It exists for the parts that carry real state; the rest is markup and
  classes.
- **Not published to npm.** The manifest is marked `private` on purpose. Use
  this by vendoring the repo — clone it, or copy `css/`, `fonts/` and `images/`
  into a project and point `crnl-loader.js` at them. The `exports` map is there
  so a local file or workspace dependency resolves; it is not a registry
  promise.
- **Known gaps**, in rough priority order: no CI, so every check is run by hand;
  236 `!important` declarations that want `@layer`; no RTL support (the CSS uses
  physical properties throughout); buttons and rows rely on the browser's
  default focus ring rather than a designed one.

The licence is MIT and means what it says — the reservation above is about
maturity, not permission.

## What's here

```
css/          the design system — 24 stylesheets, the source of truth
  crnl-loader.js            loads them in order, locally or from a bundle
  design-tokens-master.css  base tokens + the base theme
  themes.css              five worked example themes
  ui-fonts.css            Inter + the icon font, self-hosted
  display-fonts.css       a tuned display ramp for each shipped face
  prototype-harness.js    the review switcher
fonts/        145 woff2 display faces, Inter, the icon font, every licence
images/       payment marks, store badges, placeholders — see images/NOTICE.md
src/          the React component library (src/index.ts exports)
demo/         thirteen sheets rendering every class and token, live
tests/        visual regression output — generated locally, not committed
docs/         the design guide, the generated CSS API, the theming guide
scripts/      generators and checks
tools/        Font Lab — where the display faces come from, and how to cut more
```

## Documentation

| Read | For |
|---|---|
| `RULES.md` | every design rule, numbered and stable — the only file that states one |
| `docs/theming.md` | authoring a theme: the token contract, worked example |
| `docs/design-guide.md` | how each component composes, tokens, worked examples, troubleshooting |
| `docs/css-api.md` | every class and token, generated from the CSS |
| `demo/index.html` | all of it rendered live, re-themeable in the corner |
| `CLAUDE.md` | orientation for coding agents |

## Themes

Five ship as worked examples of the contract — `ink`, `signal`, `moss`, `ember`,
`violet` — each in light and dark. Omit `data-theme` entirely and the base theme
in `design-tokens-master.css` applies, so the token set is never half-defined.

A theme sets tokens and nothing else: brand colours, the display face and its
nine-step ramp, button radius, and per-mode surfaces and accents. It never
writes a rule. `docs/theming.md` is the full contract.

## Display faces

145 families, each with a nine-step ramp tuned against this system's fixed line
heights. Pick one per theme, or swap without touching the theme:

```html
<html data-theme="ink" data-display-font="horsecollar">
```

`fonts/catalog.json` lists every family with its source, licence, weight,
tracking and whether it renders caps. A `Caps` family remaps lowercase
codepoints to the uppercase glyphs, so title-case copy renders as caps with
uppercase kerning intact — which is why `text-transform` is banned (`RULES §2`).

The TTFs for desktop and Figma are in `tools/font-lab/built-fonts/`, with
`install-fonts.sh` to put the shipping set in `~/Library/Fonts`.

## Commands

```bash
npm install
npm run dev              # Storybook for the React components
npm run check            # themes, assets, icons, demo coverage — fast, no browser
npm run check:visual     # screenshot every sheet, diff against tests/visual/baseline
                         # (first run writes the baselines — they are machine-specific)
npm run check:all        # both — run before you finish
npm run build:docs       # regenerate docs/css-api.md and css/crnl.css
npm run build:fonts      # re-cut the display faces from tools/font-lab
npm run build:ui-fonts   # re-cut Inter and the icon font from upstream
```

Open `demo/index.html` directly in a browser — no server needed.

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
