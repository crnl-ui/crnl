# Design System

A token-based CSS design system with a typed React layer on the same tokens.
Two attributes on `<html>` re-skin an entire screen — `data-theme` picks the
palette and display type, `data-mode` picks light or dark — and `data-platform`
switches between a responsive web layout and a phone frame.

Everything here is self-contained: no CMS, no external brand assets, no paid
fonts. The 145 display faces it ships are open-licence (OFL / Apache) cuts,
re-metricated and renamed, with every licence included.

```html
<html data-theme="signal" data-mode="dark" data-platform="web">
  <head>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
    <script src="css/ds-loader.js"></script>
    <script src="css/prototype-harness.js"></script>
  </head>
```

`ds-loader.js` owns the stylesheet order — never hand-write `<link>` tags for
the CSS. `prototype-harness.js` injects the theme / mode / display-face switcher.

## What's here

```
css/          the design system — 23 stylesheets, the source of truth
  ds-loader.js            loads them in order, locally or from a bundle
  design-tokens-master.css  base tokens + the base theme
  themes.css              five worked example themes
  display-fonts.css       a tuned display ramp for each shipped face
  prototype-harness.js    the review switcher
fonts/        145 woff2 display faces + catalog.json + every licence
images/       payment marks, store badges, a placeholder logo — nothing branded
src/          the React component library (src/index.ts exports)
demo/         thirteen sheets rendering every class and token, live
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
npm run check            # CSS API + demo coverage — the one to run before you finish
npm run build:docs       # regenerate docs/css-api.md and css/ds.css
npm run build:fonts      # re-cut fonts/*.woff2 and the two font stylesheets
```

Open `demo/index.html` directly in a browser — no server needed.

## Licence

Code: MIT, see `LICENSE`.

Fonts: each face is a modified cut of an OFL or Apache-licensed family. The
original copyright, designer and licence records are preserved in every file,
and the full licence text for each is in `fonts/licenses/`. `fonts/catalog.json`
maps every shipped family to its source family and licence. Redistributing them
means shipping those licence files too.
