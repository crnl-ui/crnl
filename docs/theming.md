# Theming

A theme is a set of custom properties and nothing else. It never writes a rule,
never defines a class, never touches a component. Everything a theme can change
is in the three blocks below; everything it cannot change is the system working
as designed.

The complete contract is the base theme at the top of
`css/design-tokens-master.css`. That block defines every token a theme is
expected to supply, at a neutral default, which is why a page with no
`data-theme` still renders correctly rather than half-defined.

## The three blocks

A theme is a trio: one base block, one light block, one dark block.

```css
[data-theme="acme"] {
  /* brand colours, display type, UI values, the brand mark */
}
[data-theme="acme"][data-mode="light"] {
  /* surfaces, buttons, the accent pair */
}
[data-theme="acme"][data-mode="dark"] {
  /* the same tokens, re-decided for dark */
}
```

Put them in `css/themes.css`, or in your own stylesheet loaded after it. The
switcher in `prototype-harness.js` reads the loaded CSS rather than a list, so a
new theme appears in it with no other edit.

## Block 1 — brand, type, UI values

| Token | Holds |
|---|---|
| `--brand-core` | the brand colour itself — panels, marks, brand blocks |
| `--brand-light` | the secondary brand colour |
| `--brand-dark` | the deep tone behind hero imagery — the tail of `.scrim-brand` |
| `--brand-interactive` | the colour interactive elements take in light mode |
| `--brand-inverted` | its counterpart, which dark mode promotes |
| `--brand-dark-surface` | a neutral dark **surface** for branded cards; not `--brand-dark` |
| `--display-font` | the display face, as a real `font-family` |
| `--display-weight` | its weight |
| `--display-letter-spacing` | its tracking, in `em` |
| `--display-size-100…900` | the nine-step ramp, in `px` |
| `--button-border-radius` | 0 to 100px — the single strongest signal a theme carries |
| `--background-blur` | the blur radius behind translucent chrome |
| `--brand-logo-url` | the mark `.leading-logo` renders, as a `url()` |
| `--brand-tab-icon` | the monochrome mark for the iOS brand tab, as a `url()` |

**The display face and its ramp travel together.** Each face has its own cap
height, so the nine sizes are tuned per face — and a size larger than its fixed
line height (76/68/60/52/44/36/28/24/20) is silently clipped on iOS. Take a
whole block from `css/display-fonts.css`; never swap `--display-font` alone.

## Blocks 2 and 3 — per mode

| Token | Holds |
|---|---|
| `--org-base` | the page background |
| `--org-surface` | the raised surface one step up from base |
| `--org-sheet` | the surface a modal sheet sits on |
| `--org-nav` | the translucent nav background |
| `--org-primary-button` / `-text` | the primary button fill and its label |
| `--org-transactional-button` / `-text` | the commit-action button — often the same |
| `--org-secondary-button-text` | the label on a bordered button |
| `--org-tertiary-button-text` | the label on a bare text button |
| `--color-interactive` | links, active states, focus rings, icon accents |
| `--color-inverted` | the complementary accent |
| `--ios-selected-tab` | the active tab colour, which often differs from the accent |

**The mode-aware pair is the whole trick.** Light mode takes
`--brand-interactive` as `--color-interactive`; dark mode swaps in
`--brand-inverted`, so the accent stays legible on a dark background instead of
going muddy. Components read `--color-interactive` and never the `--brand-*`
pair directly (`RULES §2`).

`--org-*` is plumbing. Markup reads the semantic aliases — `--bg-base`,
`--interactive-primary` — which `design-tokens-master.css` maps onto it.

## Worked example

```css
[data-theme="acme"] {
  --brand-core: #0B4FD8;
  --brand-light: #FFB000;
  --brand-dark: #061B4A;
  --brand-interactive: #0B4FD8;
  --brand-inverted: #FFB000;
  --brand-dark-surface: #1B2233;

  /* lifted wholesale from display-fonts.css: [data-display-font="grandstand"] */
  --display-font: 'Grandstand', 'Inter', system-ui, sans-serif;
  --display-weight: 1000;
  --display-letter-spacing: -0.01em;
  --display-size-900: 76px;
  --display-size-800: 68px;
  --display-size-700: 60px;
  --display-size-600: 52px;
  --display-size-500: 44px;
  --display-size-400: 36px;
  --display-size-300: 28px;
  --display-size-200: 24px;
  --display-size-100: 20px;

  --button-border-radius: 100px;
  --background-blur: 50px;
  --brand-logo-url: url('../images/acme-mark.svg');
  --brand-tab-icon: url('../images/acme-mark.svg');
}

[data-theme="acme"][data-mode="light"] {
  --org-base: #FFFFFF;
  --org-surface: #F1F4FA;
  --org-sheet: #FFFFFF;
  --org-nav: rgba(255, 255, 255, 0.75);
  --org-transactional-button: #0B4FD8;
  --org-transactional-button-text: #FFFFFF;
  --org-primary-button: #0B4FD8;
  --org-primary-button-text: #FFFFFF;
  --org-secondary-button-text: #000000;
  --org-tertiary-button-text: #000000;
  --color-interactive: #0B4FD8;
  --color-inverted: #FFB000;
  --ios-selected-tab: #0B4FD8;
}

[data-theme="acme"][data-mode="dark"] {
  --org-base: #0C1118;
  --org-surface: #171E29;
  --org-sheet: #212A38;
  --org-nav: rgba(12, 17, 24, 0.7);
  --org-transactional-button: #FFB000;
  --org-transactional-button-text: #000000;
  --org-primary-button: #FFB000;
  --org-primary-button-text: #000000;
  --org-secondary-button-text: #FFFFFF;
  --org-tertiary-button-text: #FFFFFF;
  --color-interactive: #FFB000;
  --color-inverted: #0B4FD8;
  --ios-selected-tab: #FFB000;
}
```

## Choosing a display face

`css/display-fonts.css` carries a ready-tuned block for each of the 145 shipped
families. Two ways to use one:

1. **Bind it to the theme** — copy the block's values into the theme's base
   block, as above. The face travels with the theme.
2. **Set it per page** — `<html data-theme="acme" data-display-font="grandstand">`.
   Useful for trying faces against real screens; the switcher in
   `prototype-harness.js` does exactly this.

`fonts/catalog.json` is the machine-readable list: family, source family,
licence, weight, tracking, whether it renders caps, and the nine sizes.

## What a theme may not do

- **Write a rule.** If a theme needs a selector, the need belongs in the
  component layer, for every theme, or nowhere (`RULES §3`).
- **Change type classes.** `.title*`, `.label*`, `.body*` are theme-independent
  by design; only the display ramp moves.
- **Change spacing, radius scale, or borders.** Those are system-wide. The one
  exception is `--button-border-radius`, which is in the contract above.
- **Force letter case.** A caps face carries it in the font (`RULES §2`, `§5`).

## Checking it

```bash
npm run check
```

`scripts/check-themes.mjs` asserts that every `[data-theme]` in the CSS supplies
the full contract in both modes, and that its button fills clear 4.5:1 against
their own label colour and its accent clears 4.5:1 against the page background.
A theme that fails one is caught before a screen is built on it.
