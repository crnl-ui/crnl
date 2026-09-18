# CSS API Reference

> **Generated file — do not edit.** Produced from `css/*.css` by
> `scripts/generate-css-reference.js`. Regenerate with `npm run build:css-api`.
>
> This is the complete class and token surface. `RULES.md` holds the rules,
> `design-guide.md` explains *when* to reach for a component and how the pieces
> compose; this file is the exhaustive list of what exists. If a class or token
> is not here, it is not in the design system.

**737 classes and 226 custom properties across 24 stylesheets.** 0 internal classes (documentation chrome) are intentionally omitted. Each class is listed once, under the stylesheet that defines it.

## Load order

Read from `crnl-loader.js` at generation time — this is what browsers actually load.

```html
<!--  1 --> design-tokens-master.css
<!--  2 --> themes.css
<!--  3 --> spacing-tokens.css
<!--  4 --> container-tokens.css
<!--  5 --> border-effects-tokens.css
<!--  6 --> ui-fonts.css
<!--  7 --> fonts.css
<!--  8 --> display-fonts.css
<!--  9 --> text-styles-system.css
<!-- 10 --> icons.css
<!-- 11 --> card-components.css
<!-- 12 --> interactive-tokens.css
<!-- 13 --> button-components.css
<!-- 14 --> system-ui.css
<!-- 15 --> list-row-components.css
<!-- 16 --> table-components.css
<!-- 17 --> input-components.css
<!-- 18 --> tag-chip-components.css
<!-- 19 --> nav-components.css
<!-- 20 --> ios-nav-components.css
<!-- 21 --> web-footer-components.css
<!-- 22 --> product-patterns.css
<!-- 23 --> boilerplate.css
<!-- 24 --> platform-tokens.css
```

In-repo pages use `<script src="crnl-loader.js"></script>` instead of individual tags.

## Index

| Stylesheet | Classes | What it covers |
|---|---:|---|
| [`design-tokens-master.css`](#design-tokens-mastercss) | 0 · 105 tokens | Colour tokens in light and dark mode, the base theme, and the semantic tokens components consume. |
| [`themes.css`](#themescss) | 0 · 33 tokens | The themes this system ships with, as worked examples of the theming contract. |
| [`spacing-tokens.css`](#spacing-tokenscss) | 3 · 40 tokens | The 8px spacing scale, its responsive tokens, and section-rhythm utilities. |
| [`container-tokens.css`](#container-tokenscss) | 8 · 7 tokens | Content max-width frames and the responsive page padding that goes with them. |
| [`border-effects-tokens.css`](#border-effects-tokenscss) | 70 · 15 tokens | Border radius, border weight, drop shadow and scrim tokens, with their utility classes. |
| [`ui-fonts.css`](#ui-fontscss) | 0 | The two UI faces, served from this repository rather than a CDN. |
| [`fonts.css`](#fontscss) | 0 | Every shipped display face, plus the UI face. |
| [`display-fonts.css`](#display-fontscss) | 0 · 12 tokens | A ready-tuned display ramp for each shipped face. |
| [`text-styles-system.css`](#text-styles-systemcss) | 59 | The type scale: display, title, label and body text classes, plus colour and text utilities. |
| [`icons.css`](#iconscss) | 11 · 8 tokens | The Material Symbols (Rounded) icon system: size tokens, the base icon class and its variants. |
| [`card-components.css`](#card-componentscss) | 27 | Card layouts and the small blocks that go inside them: closed and open cards, tiles and logo blocks. |
| [`interactive-tokens.css`](#interactive-tokenscss) | 16 | Surface and scale classes that give any element its hover and pressed states. |
| [`button-components.css`](#button-componentscss) | 36 | The button system: every button type, three sizes, icon placement, fill width and circle icon buttons. |
| [`system-ui.css`](#system-uicss) | 4 | Vendor chrome: controls specified by Apple or Google that a prototype reproduces rather than designs. |
| [`list-row-components.css`](#list-row-componentscss) | 46 | The list row and everything built on it: its slots and subcomponents, the selector wrapper, and the split row. |
| [`table-components.css`](#table-componentscss) | 17 · 1 tokens | A stats table — a pinned entity column beside horizontally scrolling attribute columns. |
| [`input-components.css`](#input-componentscss) | 16 | Single-line text input and select dropdown, with their states and modifiers. |
| [`tag-chip-components.css`](#tag-chip-componentscss) | 7 | The tag (a static label badge) and the chip (an interactive filter or toggle). |
| [`nav-components.css`](#nav-componentscss) | 26 | Web navigation and page-structure components: top bar, tabs, steps and page header. |
| [`ios-nav-components.css`](#ios-nav-componentscss) | 33 · 2 tokens | iOS navigation chrome for app-mode prototypes: nav bars, tab bar, modal sheet and glass surface. |
| [`web-footer-components.css`](#web-footer-componentscss) | 15 | The responsive site footer. |
| [`product-patterns.css`](#product-patternscss) | 14 | Composite layouts that recur across product screens and sit above the component layer. |
| [`boilerplate.css`](#boilerplatecss) | 318 | The base layer: CSS reset, element defaults, and the spacing, layout, grid and responsive utilities. |
| [`platform-tokens.css`](#platform-tokenscss) | 11 · 3 tokens | The web/app platform switch: phone frame, iOS system chrome, safe-area tokens and review chrome. |

---

## design-tokens-master.css

```
design-tokens-master.css
Colour tokens in light and dark mode, the base theme, and the semantic tokens components consume.

What's inside
- Base tokens — white/black alpha scales, status colours, mode-agnostic values
- Light / dark mode defaults — neutral, inverted, input, iOS chrome and
landing-gradient values
- Base theme — every token a theme must supply, at a neutral default, so a
page with no data-theme still renders
- Semantic color tokens — --text-*, --bg-*, --interactive-*, --color-*

Notes
- data-theme and data-mode go on <html> (see RULES §1). The semantic tokens
are :root-scoped, so the attributes do nothing on a container element.
- Shipped themes live in themes.css. Authoring one: docs/theming.md.
- Components take --color-interactive / --color-inverted, never the
--brand-* pair. See RULES §2.
```

### Tokens

- `--white-{100|200|300|500|700|900|1000}` — global
- `--black-{100|200|300|500|700|900|1000}` — global
- `--neutral-{0|50|100|200|300|500|700|900|1000}` — per mode
- `--inverted-{0|50|100|200|300|500|700|900|1000}` — per mode
- `--display-size-{100|200|300|400|500|600|700|800|900}` — global

| Token | Scope | Example value |
|---|---|---|
| `--background-blur` | global | 50px |
| `--bg-base` | global | var(--org-base) |
| `--bg-input` | per mode | #FFFFFF |
| `--bg-nav` | global | var(--org-nav) |
| `--bg-sheet` | global | var(--org-sheet) |
| `--bg-surface` | global | var(--org-surface) |
| `--border-active` | global | var(--neutral-1000) |
| `--border-default` | global | var(--neutral-200) |
| `--border-disabled` | global | var(--neutral-200) |
| `--border-hover` | global | var(--neutral-500) |
| `--brand-core` | global | #1A1A1A |
| `--brand-dark` | global | #0D0D0D |
| `--brand-dark-surface` | global | #222222 |
| `--brand-interactive` | global | #1A1A1A |
| `--brand-inverted` | global | #FFFFFF |
| `--brand-light` | global | #F0F0F0 |
| `--brand-logo-url` | global | url('../images/placeholder-logo.svg') |
| `--button-border-radius` | global | 100px |
| `--color-interactive` | per mode | #1A1A1A |
| `--color-inverted` | per mode | #FFFFFF |
| `--display-font` | global | 'Gantry', 'Inter', system-ui, sans-serif |
| `--display-letter-spacing` | global | -0.02em |
| `--display-weight` | global | 400 |
| `--image-placeholder-bg` | global | #F3F3F3 |
| `--interactive-primary` | global | var(--org-primary-button) |
| `--interactive-primary-text` | global | var(--org-primary-button-text) |
| `--interactive-secondary-text` | global | var(--org-secondary-button-text) |
| `--interactive-tertiary-text` | global | var(--org-tertiary-button-text) |
| `--interactive-transactional` | global | var(--org-transactional-button) |
| `--interactive-transactional-text` | global | var(--org-transactional-button-text) |
| `--ios-nav-bg` | per mode | rgba(252, 252, 252, 0.85) |
| `--ios-selected-tab` | per mode | #1A1A1A |
| `--ios-selected-tab-bg` | per mode | #FFFFFF |
| `--ios-separator` | per mode | rgba(0, 0, 0, 0.3) |
| `--ios-tab-bar-bg` | per mode | rgba(252, 252, 252, 0.85) |
| `--lg-brand-text` | per mode | #FFFFFF |
| `--lg-dark-bg` | per mode | rgba(0, 0, 0, 0.65) |
| `--lg-light-bg` | per mode | #F7F7F7 |
| `--org-base` | per mode | #FFFFFF |
| `--org-nav` | per mode | rgba(255, 255, 255, 0.75) |
| `--org-primary-button` | per mode | #1A1A1A |
| `--org-primary-button-text` | per mode | #FFFFFF |
| `--org-secondary-button-text` | per mode | #000000 |
| `--org-sheet` | per mode | #FFFFFF |
| `--org-surface` | per mode | #F4F4F4 |
| `--org-tertiary-button-text` | per mode | #000000 |
| `--org-transactional-button` | per mode | #1A1A1A |
| `--org-transactional-button-text` | per mode | #FFFFFF |
| `--status-error` | per mode | var(--status-error-light) |
| `--status-error-dark` | global | #E43E2F |
| `--status-error-light` | global | #D42F21 |
| `--status-info` | per mode | var(--status-info-light) |
| `--status-info-dark` | global | #3892F3 |
| `--status-info-light` | global | #0671E5 |
| `--status-success` | per mode | var(--status-success-light) |
| `--status-success-dark` | global | #00A96E |
| `--status-success-light` | global | #007A47 |
| `--status-warning` | per mode | var(--status-warning-light) |
| `--status-warning-dark` | global | #F6AF24 |
| `--status-warning-light` | global | #D2811E |
| `--text-disabled` | global | var(--neutral-300) |
| `--text-placeholder` | global | var(--neutral-500) |
| `--text-primary` | global | var(--neutral-1000) |
| `--text-secondary` | global | var(--neutral-700) |

---

## themes.css

```
themes.css
The themes this system ships with, as worked examples of the theming contract.

What's inside
- Five [data-theme] trios — a base block for brand, type and UI values, then
a light and a dark block for surfaces and the accent pair
- Nothing else. A theme sets tokens; it never writes a rule or a selector.

Notes
- The contract is exactly the set of tokens the base theme in
design-tokens-master.css defines. A theme overrides some or all of them
and nothing more. Authoring one: docs/theming.md.
- data-theme goes on <html> beside data-mode (RULES §1).
- Omit data-theme entirely and the base theme applies, so the system always
has a full token set.
- Display faces here are named directly so the face travels with the theme.
To swap a face without touching a theme, set data-display-font instead —
see display-fonts.css.
```

### Tokens

- `--display-size-{100|200|300|400|500|600|700|800|900}` — per theme

| Token | Scope | Example value |
|---|---|---|
| `--background-blur` | per theme | 50px |
| `--brand-core` | per theme | #121212 |
| `--brand-dark` | per theme | #000000 |
| `--brand-dark-surface` | per theme | #1C1C1C |
| `--brand-interactive` | per theme | #121212 |
| `--brand-inverted` | per theme | #F2EFE9 |
| `--brand-light` | per theme | #F2EFE9 |
| `--button-border-radius` | per theme | 4px |
| `--color-interactive` | per theme + mode | #121212 |
| `--color-inverted` | per theme + mode | #F2EFE9 |
| `--display-font` | per theme | 'Chronicle', 'Inter', system-ui, sans-serif |
| `--display-letter-spacing` | per theme | 0em |
| `--display-weight` | per theme | 900 |
| `--ios-selected-tab` | per theme + mode | #121212 |
| `--org-base` | per theme + mode | #FFFFFF |
| `--org-nav` | per theme + mode | rgba(255, 255, 255, 0.75) |
| `--org-primary-button` | per theme + mode | #121212 |
| `--org-primary-button-text` | per theme + mode | #FFFFFF |
| `--org-secondary-button-text` | per theme + mode | #000000 |
| `--org-sheet` | per theme + mode | #FFFFFF |
| `--org-surface` | per theme + mode | #F2EFE9 |
| `--org-tertiary-button-text` | per theme + mode | #000000 |
| `--org-transactional-button` | per theme + mode | #121212 |
| `--org-transactional-button-text` | per theme + mode | #FFFFFF |

---

## spacing-tokens.css

```
spacing-tokens.css
The 8px spacing scale, its responsive tokens, and section-rhythm utilities.

What's inside
- --spacing-{25…1000} — the fixed scale; 25 (2px) and 50 (4px) are sub-unit
steps, use them sparingly
- --spacing-row / --spacing-card / --spacing-content, --margin-* — responsive
tokens that step at the system breakpoints
- .section-padding, .list-gap, .list-gap-tight — rhythm for content sections
below headers and tabs

Notes
- Margins, padding and gaps take a token, never a px literal. See RULES §2.
- Breakpoints are the system's 500/1100. See RULES §9.
```

### Tokens

- `--spacing-{25|50|75|100|150|200|250|300|400|500|600|700|800|900|1000}` — global

| Token | Scope | Example value |
|---|---|---|
| `--margin-landing` | global, per platform | 24px |
| `--margin-landing-desktop` | global | 80px |
| `--margin-landing-mobile` | global | 24px |
| `--margin-landing-tablet` | global | 48px |
| `--margin-large` | global, per platform | 16px |
| `--margin-large-desktop` | global | 64px |
| `--margin-large-mobile` | global | 16px |
| `--margin-large-tablet` | global | 40px |
| `--margin-small` | global, per platform | 16px |
| `--margin-small-desktop` | global | 48px |
| `--margin-small-mobile` | global | 16px |
| `--margin-small-tablet` | global | 32px |
| `--spacing-card` | global, per platform | 16px |
| `--spacing-card-desktop` | global | 24px |
| `--spacing-card-mobile` | global | 16px |
| `--spacing-card-tablet` | global | 20px |
| `--spacing-content` | global, per platform | 32px |
| `--spacing-content-desktop` | global | 48px |
| `--spacing-content-mobile` | global | 32px |
| `--spacing-content-tablet` | global | 40px |
| `--spacing-row` | global, per platform | 8px |
| `--spacing-row-desktop` | global | 16px |
| `--spacing-row-mobile` | global | 8px |
| `--spacing-row-tablet` | global | 12px |
| `--spacing-unit` | global | 8px |

### SECTION SPACING UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.list-gap` | gap: var(--spacing-200) | --spacing-200 |
| `.list-gap-tight` | gap: var(--spacing-100) | --spacing-100 |
| `.section-padding` | padding-top: var(--spacing-200); padding-bottom: var(--spacing-200) | --spacing-200, --spacing-400 |

---

## container-tokens.css

```
container-tokens.css
Content max-width frames and the responsive page padding that goes with them.

What's inside
- --container-* — max-width tokens from compact (640px) to maximum (1600px)
- .container, .container-{maximum|extra-wide|wide|medium|narrow|compact|fluid}
— centred frames that also own horizontal padding at each breakpoint

Notes
- Page width is always a .container* class, never a hand-rolled max-width.
See RULES §4 and §9.
- Which container fits which page: see Container Usage Guidelines at the
bottom of this file.
```

### Tokens


| Token | Scope | Example value |
|---|---|---|
| `--container-compact` | global | 640px |
| `--container-default` | global | 1200px |
| `--container-extra-wide` | global | 1440px |
| `--container-maximum` | global | 1600px |
| `--container-medium` | global | 1024px |
| `--container-narrow` | global | 768px |
| `--container-wide` | global | 1280px |

### Page width and page padding

Containers own both the max-width and the responsive horizontal padding, so you never write
`max-width: 1200px; margin: 0 auto; padding: 0 32px` by hand.

Breakpoints are the system's three (RULES §9).

### Pitfalls

**Don't pad at two levels.** If a full-bleed wrapper has horizontal padding and the inner
container has it too, the content is double-padded. Let one level own it: the outer element
handles background and borders, the inner `.container*` handles horizontal padding.

**Page width is always a container class**, never a hand-rolled `max-width`. See RULES §4
and §9.

### CONTAINER UTILITY CLASSES

| Class | Declares | Tokens |
|---|---|---|
| `.container` | width: 100%; max-width: var(--container-default); margin-left: auto; margin-right: auto; padding-left: 20px; +1 more | --container-default |
| `.container-compact` | width: 100%; max-width: var(--container-compact); margin-left: auto; margin-right: auto; padding-left: 20px; +1 more | --container-compact |
| `.container-extra-wide` | width: 100%; max-width: var(--container-extra-wide); margin-left: auto; margin-right: auto; padding-left: 20px; +1 more | --container-extra-wide |
| `.container-fluid` | width: 100%; padding-left: 20px; padding-right: 20px | — |
| `.container-maximum` | width: 100%; max-width: var(--container-maximum); margin-left: auto; margin-right: auto; padding-left: 20px; +1 more | --container-maximum |
| `.container-medium` | width: 100%; max-width: var(--container-medium); margin-left: auto; margin-right: auto; padding-left: 20px; +1 more | --container-medium |
| `.container-narrow` | width: 100%; max-width: var(--container-narrow); margin-left: auto; margin-right: auto; padding-left: 20px; +1 more | --container-narrow |
| `.container-wide` | width: 100%; max-width: var(--container-wide); margin-left: auto; margin-right: auto; padding-left: 20px; +1 more | --container-wide |

---

## border-effects-tokens.css

```
border-effects-tokens.css
Border radius, border weight, drop shadow and scrim tokens, with their utility classes.

What's inside
- --border-radius-{50|100|200}, --border-weight-{50|100|200} — from the Figma
token set; the themeable button radius is --button-border-radius
- --shadow-sheet / --shadow-modal — elevation shadows and their layer parts
- --scrim-image, --scrim-brand, --scrim-brand-strong — gradient scrims
- .rounded-*, .border-*, .shadow-*, .scrim-* — utility classes for the above

Notes
- --button-border-radius is set per theme in
design-tokens-master.css; the values are not repeated here.
- Cards never take a border. See RULES §2.
- Scrim doctrine (alpha scales for flat scrims, gradient tokens only,
mode-stable) is RULES §8.
```

### Tokens

- `--border-radius-{50|100|200}` — global
- `--border-weight-{50|100|200}` — global

| Token | Scope | Example value |
|---|---|---|
| `--scrim-brand` | global | linear-gradient( 180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0,  |
| `--scrim-brand-strong` | global | linear-gradient( 180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0,  |
| `--scrim-image` | global | linear-gradient( 180deg, transparent 0%, rgba(0, 0, 0, 0.75) |
| `--shadow-modal` | global | var(--shadow-modal-a), var(--shadow-modal-b) |
| `--shadow-modal-a` | global, per mode | 0px 8px 64px 0px rgba(0, 0, 0, 0.16) |
| `--shadow-modal-b` | global, per mode | 0px 4px 32px 0px rgba(0, 0, 0, 0.12) |
| `--shadow-sheet` | global | var(--shadow-sheet-a), var(--shadow-sheet-b) |
| `--shadow-sheet-a` | global, per mode | 0px -8px 64px 0px rgba(0, 0, 0, 0.12) |
| `--shadow-sheet-b` | global, per mode | 0px -4px 32px 0px rgba(0, 0, 0, 0.08) |

### UTILITY CLASSES - BORDER RADIUS

**Scales**

- `.rounded-{50|100|200}` — border-radius: var(--border-radius-50) *(smallest step shown)*
- `.rounded-t-{50|100|200}` — border-top-left-radius: var(--border-radius-50); border-top-right-radius: var(--border-radius-50) *(smallest step shown)*
- `.rounded-b-{50|100|200}` — border-bottom-left-radius: var(--border-radius-50); border-bottom-right-radius: var(--border-radius-50) *(smallest step shown)*
- `.rounded-l-{50|100|200}` — border-top-left-radius: var(--border-radius-50); border-bottom-left-radius: var(--border-radius-50) *(smallest step shown)*
- `.rounded-r-{50|100|200}` — border-top-right-radius: var(--border-radius-50); border-bottom-right-radius: var(--border-radius-50) *(smallest step shown)*
- `.rounded-tl-{50|100|200}` — border-top-left-radius: var(--border-radius-50) *(smallest step shown)*
- `.rounded-tr-{50|100|200}` — border-top-right-radius: var(--border-radius-50) *(smallest step shown)*
- `.rounded-bl-{50|100|200}` — border-bottom-left-radius: var(--border-radius-50) *(smallest step shown)*
- `.rounded-br-{50|100|200}` — border-bottom-right-radius: var(--border-radius-50) *(smallest step shown)*

| Class | Declares | Tokens |
|---|---|---|
| `.rounded-button` | border-radius: var(--button-border-radius) | --button-border-radius |

### UTILITY CLASSES - BORDER WEIGHT

**Scales**

- `.border-{50|100|200}` — border-width: var(--border-weight-50) *(smallest step shown)*
- `.border-t-{50|100|200}` — border-top-width: var(--border-weight-50) *(smallest step shown)*
- `.border-r-{50|100|200}` — border-right-width: var(--border-weight-50) *(smallest step shown)*
- `.border-b-{50|100|200}` — border-bottom-width: var(--border-weight-50) *(smallest step shown)*
- `.border-l-{50|100|200}` — border-left-width: var(--border-weight-50) *(smallest step shown)*

| Class | Declares | Tokens |
|---|---|---|
| `.border-none` | border-style: none | — |
| `.border-solid` | border-style: solid | — |

### UTILITY CLASSES - BORDER COLOR

**Scales**

- `.border-neutral-{200|500|1000}` — border-color: var(--neutral-200) *(smallest step shown)*

| Class | Declares | Tokens |
|---|---|---|
| `.border-active` | border-color: var(--border-active) | --border-active |
| `.border-brand-interactive` | border-color: var(--color-interactive) | --color-interactive |
| `.border-default` | border-color: var(--border-default) | --border-default |
| `.border-hover` | border-color: var(--border-hover) | --border-hover |

### UTILITY CLASSES - DROP SHADOWS

| Class | Declares | Tokens |
|---|---|---|
| `.shadow-modal` | box-shadow: var(--shadow-modal) | --shadow-modal |
| `.shadow-modal-a` | box-shadow: var(--shadow-modal-a) | --shadow-modal-a |
| `.shadow-modal-b` | box-shadow: var(--shadow-modal-b) | --shadow-modal-b |
| `.shadow-none` | box-shadow: none | — |
| `.shadow-sheet` | box-shadow: var(--shadow-sheet) | --shadow-sheet |
| `.shadow-sheet-a` | box-shadow: var(--shadow-sheet-a) | --shadow-sheet-a |
| `.shadow-sheet-b` | box-shadow: var(--shadow-sheet-b) | --shadow-sheet-b |

### COMMON BORDER COMBINATIONS

| Class | Declares | Tokens |
|---|---|---|
| `.border` | border-width: var(--border-weight-100); border-style: solid; border-color: var(--border-default) | --border-weight-100, --border-default |
| `.border-bottom` | border-bottom-width: var(--border-weight-100); border-bottom-style: solid; border-bottom-color: var(--border-default) | --border-weight-100, --border-default |
| `.border-heavy` | border-width: var(--border-weight-200); border-style: solid; border-color: var(--neutral-1000) | --border-weight-200, --neutral-1000 |
| `.border-interactive` | border-width: var(--border-weight-200); border-style: solid; border-color: var(--color-interactive) | --border-weight-200, --color-interactive |
| `.border-left` | border-left-width: var(--border-weight-100); border-left-style: solid; border-left-color: var(--border-default) | --border-weight-100, --border-default |
| `.border-right` | border-right-width: var(--border-weight-100); border-right-style: solid; border-right-color: var(--border-default) | --border-weight-100, --border-default |
| `.border-thin` | border-width: var(--border-weight-50); border-style: solid; border-color: var(--neutral-200) | --border-weight-50, --neutral-200 |
| `.border-top` | border-top-width: var(--border-weight-100); border-top-style: solid; border-top-color: var(--border-default) | --border-weight-100, --border-default |

### SCRIM UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.scrim-brand` | background: var(--scrim-brand) | --scrim-brand |
| `.scrim-brand-strong` | background: var(--scrim-brand-strong) | --scrim-brand-strong |
| `.scrim-image` | background: var(--scrim-image) | --scrim-image |

---

## ui-fonts.css

```
ui-fonts.css
The two UI faces, served from this repository rather than a CDN.

What's inside
- Inter — the UI text face, variable on `wght`, so one file covers
400 / 600 / 700 / 900
- Material Symbols Rounded — the icon face, variable on `FILL` and `opsz`,
subset to the icons this repository actually uses

Notes
- Both are generated by `npm run build:ui-fonts`, from google/fonts and
google/material-design-icons. Licences: fonts/licenses/.
- The display faces are a separate concern and live in fonts.css.
- These used to come from a <link> to fonts.googleapis.com in every page
head, which made a third-party CDN a hard dependency of rendering.
```

---

## fonts.css

```
fonts.css
Every shipped display face, plus the UI face.

What's inside
- One @font-face per display family, served from fonts/
- Families are OFL / Apache cuts of open fonts, renamed and re-metricated;
the source family and licence for each is in fonts/catalog.json and the
full licence text in fonts/licenses/
- A `Caps` family remaps lowercase codepoints to the uppercase glyphs, so
title-case copy renders as caps with uppercase kerning intact

Notes
- Declaring a face does not download it. The browser fetches only the one
the active theme names in --display-font.
- Inter (the UI face) comes from the Google Fonts <link> in the page head.
- Which face a theme uses is bound through --display-font, not here.
```

---

## display-fonts.css

```
display-fonts.css
A ready-tuned display ramp for each shipped face.

What's inside
- One [data-display-font="key"] block per family, setting --display-font,
--display-weight, --display-letter-spacing and the nine --display-size-*

Notes
- Set it on <html> beside data-theme to swap the display face without
touching the theme:  <html data-theme="slate" data-display-font="gantry">
- Or copy a block's values into a theme so the face travels with it.
- Line heights are fixed system-wide (76/68/60/52/44/36/28/24/20) and live
in text-styles-system.css. A size above its line height is clipped on iOS.
- Generated by scripts/build-fonts.py — do not hand-edit.
```

### Tokens

- `--display-size-{100|200|300|400|500|600|700|800|900}` — component-scoped

| Token | Scope | Example value |
|---|---|---|
| `--display-font` | component-scoped | 'A-Game Caps', 'Inter', system-ui, sans-serif |
| `--display-letter-spacing` | component-scoped | 0em |
| `--display-weight` | component-scoped | 900 |

---

## text-styles-system.css

```
text-styles-system.css
The type scale: display, title, label and body text classes, plus colour and text utilities.

What's inside
- .display{100…900} — the theme display face; size and tracking vary by theme
- .title{50…90} — Inter 700 section headings
- .labelBold*, .labelRegular* — Inter UI text with tight leading
- .bodyBold*, .bodyRegular*, .idealRegular40 — Inter reading text
- .text-* — colour modifiers, alignment, transform, decoration, truncation
- .title50-r, .labelRegular20-r — responsive pairs that step down on mobile

Notes
- Which family to reach for, and label vs body: see RULES §5.
- font-size / font-weight / line-height are set only here; templates use a
class. See RULES §2.
- Display text is written in title case; caps faces render it as caps.
See RULES §5.
```

### Which text class do I reach for?

Four families, each with a job. Pick the family first, then the step.

| Family | Font | Line height | Use for |
|---|---|---|---|
| `.display*` | **Team display font** (varies by `data-theme`) | Fixed px | Page and screen titles, team name, big numbers. The brand voice. |
| `.title*` | Inter 700 | 1.21 | Section headings inside a page. Structural, not brand. |
| `.label*` | Inter 400/600 | 1.21 | UI text — buttons, rows, tags, captions, table cells. Compact. |
| `.body*` | Inter 400/600 | 1.6 | Sentences and paragraphs. The looser leading is for reading. |

**`.label*` vs `.body*` is the choice people get wrong.** They share sizes; they differ in
line height. Anything that wraps to multiple lines and is meant to be *read* takes `.body*`.
Anything that sits on one line inside a control takes `.label*`.

**Steps are sizes, `Bold`/`Regular` is weight.** `.labelBold30` and `.labelRegular30` are the
same 16px; only the weight differs (600 vs 400). There is no separate weight class — pick the
combined name.

| Step | `.label*` / `.body*` | `.title*` |
|---:|---|---|
| 5 | 10px | — |
| 10 | 12px | — |
| 20 | 14px | — |
| 30 | 16px | — |
| 40 | 18px | — |
| 50 | 20px | 20px |
| 60 | — | 24px |
| 70 | — | 28px |
| 80 | — | 32px |
| 90 | — | 36px |

Common picks, so you don't have to derive them:

- Small emphasis label (tag text, "3 Additional Offers") → `.labelBold30`
- Supporting line under a title (date, venue) → `.labelRegular30` + `.text-secondary`
- Timestamp, seat number, fine print → `.labelRegular10`
- Row title in a list → `.labelBold30`, or `.title50-r` inside a split row
- Screen title → `.display500`; team name in a nav bar → `.display100`
- Paragraph of copy → `.bodyRegular30`

**Colour is a separate class.** Text classes set `color: var(--text-primary)`. To change it,
add a modifier — `.text-secondary`, `.text-brand-core`, `.text-interactive-tertiary`. They are
`!important`, so they always win over the text class (RULES §5).

**Display text is written in title case** (RULES §5). A caps face has it baked into the font
file — any family ending "Caps". Most faces render as drawn, which is why a hardcoded
`"BUY"` breaks every theme on one of those.

**`.display*` line heights are fixed px, and the font size is a token.** A theme whose display
size is set larger than its line height will clip on iOS. If you add a display step, keep
`font-size ≤ line-height`.

### Pitfalls

**Class names are case-sensitive.** `labelregular30` silently does nothing. It is
`labelRegular30`, `labelBold20`, `bodyRegular40` — camelCase, always.

**Only four Inter weights are loaded:** 400, 600, 700, 900. `font-weight: 300` or `500`
falls back to 400 with no warning. This is another reason to use the text classes rather than
setting weight by hand — they only ever ask for weights that exist.

**A text class will override the colour of a filled surface.** `.labelBold30` sets
`color: var(--text-primary)`, which beats the white text a `.surface-fill*` parent expects.
Fix it on the child with `color: inherit`, not by overriding the text class.

### DISPLAY TEXT STYLES (theme-specific)

| Class | Declares | Tokens |
|---|---|---|
| `.display100` | font-size: var(--display-size-100); font-weight: var(--display-weight); line-height: 20px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-100, --display-weight, --display-letter-spacing, … |
| `.display200` | font-size: var(--display-size-200); font-weight: var(--display-weight); line-height: 24px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-200, --display-weight, --display-letter-spacing, … |
| `.display300` | font-size: var(--display-size-300); font-weight: var(--display-weight); line-height: 28px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-300, --display-weight, --display-letter-spacing, … |
| `.display400` | font-size: var(--display-size-400); font-weight: var(--display-weight); line-height: 36px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-400, --display-weight, --display-letter-spacing, … |
| `.display500` | font-size: var(--display-size-500); font-weight: var(--display-weight); line-height: 44px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-500, --display-weight, --display-letter-spacing, … |
| `.display600` | font-size: var(--display-size-600); font-weight: var(--display-weight); line-height: 52px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-600, --display-weight, --display-letter-spacing, … |
| `.display700` | font-size: var(--display-size-700); font-weight: var(--display-weight); line-height: 60px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-700, --display-weight, --display-letter-spacing, … |
| `.display800` | font-size: var(--display-size-800); font-weight: var(--display-weight); line-height: 68px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-800, --display-weight, --display-letter-spacing, … |
| `.display900` | font-size: var(--display-size-900); font-weight: var(--display-weight); line-height: 76px; letter-spacing: var(--display-letter-spacing); color: var(--neutral-1000); +3 more | --display-font, --display-size-900, --display-weight, --display-letter-spacing, … |

### TITLE TEXT STYLES (theme-independent)

| Class | Declares | Tokens |
|---|---|---|
| `.title50` | font-size: 20px; font-weight: 700; line-height: 1.21; letter-spacing: -0.03em; color: var(--text-primary); +2 more | --text-primary |
| `.title60` | font-size: 24px; font-weight: 700; line-height: 1.21; letter-spacing: -0.03em; color: var(--text-primary); +2 more | --text-primary |
| `.title70` | font-size: 28px; font-weight: 700; line-height: 1.21; letter-spacing: -0.03em; color: var(--text-primary); +2 more | --text-primary |
| `.title80` | font-size: 32px; font-weight: 700; line-height: 1.21; letter-spacing: -0.03em; color: var(--text-primary); +2 more | --text-primary |
| `.title90` | font-size: 36px; font-weight: 700; line-height: 1.21; letter-spacing: -0.03em; color: var(--text-primary); +2 more | --text-primary |

### LABEL BOLD TEXT STYLES (theme-independent)

| Class | Declares | Tokens |
|---|---|---|
| `.labelBold10` | font-size: 0.75rem; font-weight: 600; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelBold20` | font-size: 0.875rem; font-weight: 600; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelBold30` | font-size: 1rem; font-weight: 600; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelBold40` | font-size: 1.125rem; font-weight: 600; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelBold5` | font-size: 0.625rem; font-weight: 600; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelBold50` | font-size: 1.25rem; font-weight: 600; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |

### LABEL REGULAR TEXT STYLES (theme-independent)

| Class | Declares | Tokens |
|---|---|---|
| `.labelRegular10` | font-size: 0.75rem; font-weight: 400; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelRegular20` | font-size: 0.875rem; font-weight: 400; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelRegular30` | font-size: 1rem; font-weight: 400; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelRegular40` | font-size: 1.125rem; font-weight: 400; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelRegular5` | font-size: 0.625rem; font-weight: 400; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.labelRegular50` | font-size: 1.25rem; font-weight: 400; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |

### BODY BOLD TEXT STYLES (theme-independent)

| Class | Declares | Tokens |
|---|---|---|
| `.bodyBold20` | font-size: 0.875rem; font-weight: 600; line-height: 1.6; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.bodyBold30` | font-size: 1rem; font-weight: 600; line-height: 1.6; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.bodyBold40` | font-size: 1.125rem; font-weight: 600; line-height: 1.6; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |

### BODY REGULAR TEXT STYLES (theme-independent)

| Class | Declares | Tokens |
|---|---|---|
| `.bodyRegular20` | font-size: 0.875rem; font-weight: 400; line-height: 1.6; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.bodyRegular30` | font-size: 1rem; font-weight: 400; line-height: 1.6; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |
| `.bodyRegular40` | font-size: 1.125rem; font-weight: 400; line-height: 1.6; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |

### IDEAL REGULAR TEXT STYLES (theme-independent)

| Class | Declares | Tokens |
|---|---|---|
| `.idealRegular40` | font-size: 12px; font-weight: 400; line-height: 1.6; letter-spacing: -0.02em; color: var(--text-primary); +2 more | --text-primary |

### COLOR MODIFIERS

| Class | Declares | Tokens |
|---|---|---|
| `.text-brand-core` | color: var(--brand-core) !important | --brand-core |
| `.text-brand-interactive` | color: var(--color-interactive) !important | --color-interactive |
| `.text-brand-inverted` | color: var(--color-inverted) !important | --color-inverted |
| `.text-brand-light` | color: var(--brand-light) !important | --brand-light |
| `.text-disabled` | color: var(--neutral-300) !important | --neutral-300 |
| `.text-error` | color: var(--status-error) !important | --status-error |
| `.text-info` | color: var(--status-info) !important | --status-info |
| `.text-interactive-tertiary` | color: var(--interactive-tertiary-text) !important | --interactive-tertiary-text |
| `.text-inverted` | color: var(--inverted-1000) !important | --inverted-1000 |
| `.text-placeholder` | color: var(--neutral-500) !important | --neutral-500 |
| `.text-primary` | color: var(--neutral-1000) !important | --neutral-1000 |
| `.text-secondary` | color: var(--neutral-700) !important *(also styled in list-row-components.css)* | --neutral-700 |
| `.text-success` | color: var(--status-success) !important | --status-success |
| `.text-warning` | color: var(--status-warning) !important | --status-warning |

### ALIGNMENT UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.text-center` | text-align: center !important | — |
| `.text-justify` | text-align: justify !important | — |
| `.text-left` | text-align: left !important | — |
| `.text-right` | text-align: right !important | — |

### TEXT DECORATION UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.text-line-through` | text-decoration: line-through !important | — |
| `.text-no-underline` | text-decoration: none !important | — |
| `.text-underline` | text-decoration: underline !important | — |

### TRUNCATION UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.text-truncate` | overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important | — |
| `.text-truncate-2` | display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important | — |
| `.text-truncate-3` | display: -webkit-box !important; -webkit-line-clamp: 3 !important; -webkit-box-orient: vertical !important; overflow: hidden !important | — |

### RESPONSIVE TEXT

| Class | Declares | Tokens |
|---|---|---|
| `.labelRegular20-r` | font-size: 0.875rem; font-weight: 400; line-height: 1.21; letter-spacing: -0.02em; color: var(--text-primary); +1 more | --text-primary |
| `.title50-r` | font-size: 20px; font-weight: 700; line-height: 1.21; letter-spacing: -0.03em; color: var(--text-primary); +1 more | --text-primary |

---

## icons.css

```
icons.css
The Material Symbols (Rounded) icon system: size tokens, the base icon class and its variants.

What's inside
- --icon-size-{50…700} — the icon size scale
- .icon — base class; sets the Material Symbols font, filled by default
- .icon-{50…700} — size utilities
- .material-symbols-rounded — the upstream class, outlined by default
- .icon-outlined — opt a glyph out of the filled default

Notes
- The canonical form is <span class="icon icon-N">name</span>; .icon sets
the font family, so never add material-symbols-rounded beside it. See
RULES §4.
- The variable font ships in this repository, subset to the icons in use.
Its @font-face is in ui-fonts.css; `npm run build:ui-fonts` re-cuts it and
`npm run check:icons` fails when markup uses an icon outside the subset.
- Icons inherit color, so the text colour modifiers apply.
- Full usage notes: see Usage Guidelines at the bottom of this file.
```

### Tokens

- `--icon-size-{50|100|200|300|400|500|600|700}` — global

### BASE ICON CLASS

| Class | Declares | Tokens |
|---|---|---|
| `.icon` | font-size: var(--icon-size-300); font-weight: normal; line-height: 1; letter-spacing: normal; color: inherit; +13 more *(also styled in button-components.css, list-row-components.css, nav-components.css, ios-nav-components.css, product-patterns.css)* | --icon-size-300 |
| `.material-symbols-rounded` | font-size: 24px; font-weight: normal; line-height: 1; letter-spacing: normal; display: inline-block; +11 more *(also styled in input-components.css, tag-chip-components.css, platform-tokens.css)* | — |

### ICON SIZE UTILITIES

**Scales**

- `.icon-{50|100|200|300|400|500|600|700}` — font-size: var(--icon-size-50); font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20 *(smallest step shown)*

### ICON STYLE VARIANTS

| Class | Declares | Tokens |
|---|---|---|
| `.icon-outlined` | font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 | — |

---

## card-components.css

```
card-components.css
Card layouts and the small blocks that go inside them: closed and open cards, tiles and logo blocks.

What's inside
- .card-closed (+ -header/-body/-footer) — full card with background and divided
sections; the header is a row (text pair + optional trailing action)
- .card-open (+ -header/-content/-section) — transparent container with separated sections
- .card-closed-interactive, .card-open-section-interactive — layout for tappable cards
- .card-text-pair, .card-actions* — content utilities
- .card-grid — responsive card grids (pair with grid-cols-* from boilerplate.css)
- .card-media (+ -tall, -square) — the photo band at the top of a card or
tile, sized by ratio and never by height
- .logo-block — brand-coloured tile with a centred logo
- .tile (+ .tile-info, .tile-tag) — the small card shown alongside others

Notes
- Cards never take a border or a custom :hover; interaction is a
.surface-* + .scale-* pair on the element. See RULES §2.
- A closed card clips its children, so a full-bleed image or an interactive
band's hover wash follows the 16px radius with no extra CSS. Do not add
`overflow: hidden` to a card in a template — it is already there.
- Label + sublabel is .card-text-pair. See RULES §4.
- Worked markup for each pattern: see Usage Examples at the bottom of this file.
```

### CLOSED LAYOUT CARD

| Class | Declares | Tokens |
|---|---|---|
| `.card-closed` | background: var(--bg-surface); border-radius: var(--border-radius-200); width: 100%; display: flex; flex-direction: column; +1 more | --bg-surface, --border-radius-200 |
| `.card-closed-body` | gap: var(--spacing-200); padding: var(--spacing-300); width: 100%; display: flex; flex-direction: column; +1 more | --spacing-300, --border-weight-100, --neutral-200, --spacing-200 |
| `.card-closed-footer` | gap: var(--spacing-200); padding: var(--spacing-300); width: 100%; display: flex; flex-direction: column | --spacing-300, --spacing-200 |
| `.card-closed-header` | gap: var(--spacing-200); padding: var(--spacing-250); width: 100%; display: flex; border-bottom: var(--border-weight-100) solid var(--neutral-200); +2 more | --spacing-250, --border-weight-100, --neutral-200, --spacing-200 |

### OPEN LAYOUT CARD

| Class | Declares | Tokens |
|---|---|---|
| `.card-open` | gap: var(--spacing-250); width: 100%; display: flex; flex-direction: column | --spacing-250 |
| `.card-open-content` | gap: var(--spacing-150); width: 100%; display: flex; flex-direction: column | --spacing-150 |
| `.card-open-header` | width: 100% | — |
| `.card-open-section` | background: var(--bg-surface); padding: var(--spacing-300); border-radius: var(--border-radius-200); width: 100% | --bg-surface, --border-radius-200, --spacing-300 |

### CARD VARIANTS - INTERACTIVE STATES

| Class | Declares | Tokens |
|---|---|---|
| `.card-closed-interactive` | background: var(--bg-surface); border-radius: var(--border-radius-200); width: 100%; display: flex; flex-direction: column; +1 more | --bg-surface, --border-radius-200 |
| `.card-open-section-interactive` | background: var(--bg-surface); padding: var(--spacing-300); border-radius: var(--border-radius-200); width: 100% | --bg-surface, --border-radius-200, --spacing-300 |

### CARD CONTENT UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.card-actions` | gap: var(--spacing-150); display: flex; align-items: center | --spacing-150 |
| `.card-actions-horizontal` | gap: var(--spacing-150); display: flex; flex-direction: row; align-items: center | --spacing-150 |
| `.card-actions-vertical` | gap: var(--spacing-100); display: flex; flex-direction: column | --spacing-100 |
| `.card-text-pair` | gap: 2px; width: 100%; display: flex; flex-direction: column | — |

### RESPONSIVE CARD GRIDS

| Class | Declares | Tokens |
|---|---|---|
| `.card-grid` | gap: var(--spacing-card); width: 100%; display: grid | --spacing-card |
| `.card-grid-closed` | gap: var(--spacing-row); width: 100%; display: grid | --spacing-row |
| `.card-grid-open` | gap: var(--spacing-content); width: 100%; display: grid | --spacing-content |

### CARD MEDIA

| Class | Declares | Tokens |
|---|---|---|
| `.card-media` | background-color: var(--image-placeholder-bg); border-radius: 0; width: 100%; display: block; aspect-ratio: 16 / 9; +2 more | --image-placeholder-bg |
| `.card-media-square` | aspect-ratio: 1 / 1 | — |
| `.card-media-tall` | aspect-ratio: 4 / 3 | — |

### LOGO BLOCK

| Class | Declares | Tokens |
|---|---|---|
| `.logo-block` | background: var(--badge-bg, var(--brand-core)); border-radius: var(--border-radius-100); height: 100%; width: 100%; position: relative; +1 more | --badge-bg, --brand-core, --border-radius-100 |
| `.logo-block-lg` | *contextual — styled via a parent* | — |
| `.logo-block-md` | *contextual — styled via a parent* | — |
| `.logo-block-sm` | *contextual — styled via a parent* | — |

### TILE

| Class | Declares | Tokens |
|---|---|---|
| `.tile` | background: var(--bg-surface); border-radius: var(--border-radius-100); overflow: hidden; position: relative | --bg-surface, --border-radius-100 |
| `.tile-info` | gap: var(--spacing-100); padding: var(--spacing-200); display: flex; flex-direction: column | --spacing-200, --spacing-100 |
| `.tile-tag` | background: var(--black-100); padding: var(--spacing-50) var(--spacing-150); border-radius: var(--border-radius-50); height: 32px; display: flex; +5 more | --spacing-100, --spacing-50, --spacing-150, --border-radius-50, … |

---

## interactive-tokens.css

```
interactive-tokens.css
Surface and scale classes that give any element its hover and pressed states.

What's inside
- .surface-fill{Neutral|Color|Inverted|Black|White} — filled surfaces
- .surface-border{Neutral|Inverted|Black|White} — outlined surfaces
- .surface-washNeutral, .surface-ghost, .surface-card — low-emphasis surfaces
- .surface-section — one band of a card already divided by hairlines; it has
a container contract the others don't, documented at the rule below
- .scale-{700|500|300} — expand-on-hover / shrink-on-press transforms

Notes
- A surface token gives themed default/hover/pressed fill and border; a scale
token adds the transform. They compose freely — any surface with any scale:
<div class="surface-fillColor scale-500">Buy Tickets</div>
<div class="surface-borderNeutral scale-700">Card</div>
- Anything tappable takes a surface + scale pair instead of a hand-written
:hover / :active. See RULES §2 and §3.
```

### Which surface?

A surface gives an element its default, hover and pressed appearance; a `.scale-*` gives it the
transform. They go on the **same element**, and they replace hand-written `:hover` / `:active`
entirely (RULES §2). Pick by asking what the thing looks like *at rest*:

| At rest it is… | Surface | Typical use |
|---|---|---|
| A solid block of colour | `.surface-fillNeutral` · `.surface-fillColor` · `.surface-fillInverted` · `.surface-fillBlack` · `.surface-fillWhite` | A CTA-weight target that is not a `.btn` |
| An outline with nothing inside | `.surface-borderNeutral` · `.surface-borderInverted` · `.surface-borderBlack` · `.surface-borderWhite` | Chips, outlined selectables |
| Barely there, on top of a card | `.surface-washNeutral` | A selector inside a card, on `--bg-surface` |
| Invisible until you touch it | `.surface-ghost` | Menu items, quiet icon targets |
| A card, on the page background | `.surface-card` | A tappable card or tile on `--bg-base` |
| One band of a divided card | `.surface-section` | See below — it has rules the others don't |

The `Black` and `White` variants are **mode-stable**: they are the same in light and dark, for
use over photography or a brand panel, where the backdrop does not follow the mode.

### `.surface-section` — the one with a container contract

A *section* is one band of a card that is already divided by hairlines — the shape
`.card-closed-header` / `-body` / `-footer` make, each separated by
`var(--border-weight-100) solid var(--neutral-200)`. It is **not** a floating box inside a
padded container.

The surface is transparent at rest **because it inherits the card's `--bg-surface`**. That is
the whole design: the band is invisible until you hover it, then washes edge to edge, which
reads as "this row of the card is tappable" rather than "there is a button in here".

For that to work, the container has to hold up its end:

- **The section spans the card's full width.** No margin, no inset. The hover wash has to reach
  both edges or it reads as a floating button, not a band. The card owns the padding — either
  through `.card-closed-*`, or by the section carrying the padding itself so its divider bleeds
  full width (design-guide § Inventory list row).
- **The card is a real card** — `--bg-surface` against `--bg-base`. A section on the page
  background has nothing to be transparent against and is invisible at rest.
- **Its neighbours are separated by a `--neutral-200` hairline**, or it is one of several
  sections that visibly belong to one card. A single section in an otherwise undivided card has
  nothing to be a section *of*.
- **No `.scale-*`.** Scaling one band would detach it from the card it is part of. Only the
  interactive sections take the class; the rest of the card takes no surface at all.

```html
<!-- A divided card where the last band is the tappable one -->
<div class="card-closed">
  <div class="card-closed-header">
    <div class="card-text-pair">
      <h3 class="title50">Section 114, Row C</h3>
      <p class="labelRegular20 text-secondary">4 tickets</p>
    </div>
  </div>
  <div class="card-closed-body surface-section">
    <div class="list-row">
      <div class="list-row-content">
        <div class="list-row-text-pair">
          <span class="labelBold30 text-interactive-tertiary">3 Additional Offers</span>
        </div>
      </div>
      <div class="trailing trailing-gap-xs">
        <span class="icon text-interactive-tertiary">arrow_drop_down</span>
      </div>
    </div>
  </div>
</div>
```

The shipped examples are `.split-row-top` / `.split-row-bottom`, where which bands get the class
changes with the offer state, and the inventory list, where every row is a section of one card.
Both are worked through in `design-guide.md`.

### Pitfalls

**A surface without a scale is not wrong** — a row inside a stack takes the surface and no scale,
because scaling one row of a list looks broken. `.surface-section` never takes one at all.

**Fill surfaces set their own `color`,** and a text class sets `--text-primary` and wins, which
makes the text vanish. Any page using one needs
`.surface-fillNeutral *, … { color: inherit; }`. `.btn` and `.tag.tag-team-color` already carry it.

**Don't put `.surface-card` on top of `--bg-surface`.** Two solid surfaces stacked read as one
slab (RULES §2). Inside a card, reach for `.surface-washNeutral`, or `.surface-section` if the
thing is a band of that card.

### Fill - Neutral

| Class | Declares | Tokens |
|---|---|---|
| `.surface-fillNeutral` | color: var(--inverted-1000); background: var(--neutral-1000); border: none; transition: background 120ms ease; cursor: pointer | --neutral-1000, --inverted-1000, --inverted-200, --black-500 |

### Fill - Color

| Class | Declares | Tokens |
|---|---|---|
| `.surface-fillColor` | color: var(--white-1000); background: var(--brand-core); border: none; transition: background 120ms ease; cursor: pointer | --brand-core, --white-1000, --white-300, --black-300 |

### Fill - Inverted

| Class | Declares | Tokens |
|---|---|---|
| `.surface-fillInverted` | color: var(--neutral-1000); background: var(--inverted-1000); border: none; transition: background 120ms ease; cursor: pointer | --inverted-1000, --neutral-1000, --neutral-200, --black-500 |

### Fill - Black

| Class | Declares | Tokens |
|---|---|---|
| `.surface-fillBlack` | color: var(--white-1000); background: var(--black-1000); border: none; transition: background 120ms ease; cursor: pointer | --black-1000, --white-1000, --white-300 |

### Fill - White

| Class | Declares | Tokens |
|---|---|---|
| `.surface-fillWhite` | color: var(--black-1000); background: var(--white-1000); border: none; transition: background 120ms ease; cursor: pointer | --white-1000, --black-1000, --black-200, --black-500 |

### Border - Neutral

| Class | Declares | Tokens |
|---|---|---|
| `.surface-borderNeutral` | color: var(--text-primary); background: var(--neutral-000); border: 1px solid var(--neutral-300); transition: background 120ms ease, border-color 120ms ease; cursor: pointer | --neutral-000, --neutral-300, --text-primary, --neutral-100, … |

### Border - Inverted

| Class | Declares | Tokens |
|---|---|---|
| `.surface-borderInverted` | color: var(--text-primary); background: var(--neutral-000); border: 1px solid var(--inverted-300); transition: background 120ms ease, border-color 120ms ease; cursor: pointer | --neutral-000, --inverted-300, --text-primary, --inverted-100, … |

### Border - Black

| Class | Declares | Tokens |
|---|---|---|
| `.surface-borderBlack` | color: var(--text-primary); background: var(--neutral-000); border: 1px solid var(--black-300); transition: background 120ms ease, border-color 120ms ease; cursor: pointer | --neutral-000, --black-300, --text-primary, --black-100, … |

### Border - White

| Class | Declares | Tokens |
|---|---|---|
| `.surface-borderWhite` | color: var(--text-primary); background: var(--neutral-000); border: 1px solid var(--black-300); transition: background 120ms ease, border-color 120ms ease; cursor: pointer | --neutral-000, --black-300, --text-primary, --white-200 |

### Wash - Neutral

| Class | Declares | Tokens |
|---|---|---|
| `.surface-washNeutral` | color: var(--text-primary); background: var(--neutral-100); border: none; transition: background 120ms ease; cursor: pointer | --neutral-100, --text-primary, --black-300 |

### Ghost

| Class | Declares | Tokens |
|---|---|---|
| `.surface-ghost` | color: var(--text-primary); background: var(--neutral-000); border: none; transition: background 120ms ease; cursor: pointer | --neutral-000, --text-primary, --neutral-100, --black-300 |

### Card

| Class | Declares | Tokens |
|---|---|---|
| `.surface-card` | color: var(--text-primary); background: var(--org-surface); border: none; transition: background 120ms ease; cursor: pointer | --org-surface, --text-primary, --white-100, --black-300 |

### Section (one band of a divided card)

| Class | Declares | Tokens |
|---|---|---|
| `.surface-section` | color: var(--text-primary); background: transparent; border: none; transition: background 120ms ease; cursor: pointer | --text-primary, --white-100, --black-300 |

### Interaction 700

| Class | Declares | Tokens |
|---|---|---|
| `.scale-700` | transition: transform 180ms ease-out; transform: scale(1) | — |

### Interaction 500

| Class | Declares | Tokens |
|---|---|---|
| `.scale-500` | transition: transform 180ms ease-out; transform: scale(1) | — |

### Interaction 300

| Class | Declares | Tokens |
|---|---|---|
| `.scale-300` | transition: transform 180ms ease-out; transform: scale(1) | — |

---

## button-components.css

```
button-components.css
The button system: every button type, three sizes, icon placement, fill width and circle icon buttons.

What's inside
- .btn — base reset and structure; always paired with a type and a size
- .btn-{transactional|primary|neutral|secondary|tertiary|destructive|white|white-tertiary|black} — types
- .btn-{700|300|100} — sizes
- .btn-icon, .btn-icon-{leading|trailing|only} — icon glyph and placement
- .btn-fill — span the container
- .btn-circle (+ size, type and letter variants) — circular icon buttons
- .btn-group, .btn-group-stack — layout for several buttons

Notes
- The canonical form is <button class="btn btn-{type} btn-{size}">; no bare
<button>. See RULES §2 and §4.
- Icon in a button: <span class="btn-icon material-symbols-rounded">name</span>.
See RULES §4.
- Which type to reach for: see Usage Guidelines at the bottom of this file.

Button Types:
- Transactional (.btn-transactional)  — High-priority actions (Buy, Purchase)
- Primary (.btn-primary)              — Main actions (Submit, Save)
- Neutral (.btn-neutral)              — Standard actions (Cancel, Back)
- Secondary (.btn-secondary)          — Outlined alternative actions
- Tertiary (.btn-tertiary)            — Low-emphasis text actions
- Destructive (.btn-destructive)      — Dangerous actions (Delete, Remove)
- White (.btn-white)                  — CTA on dark/brand surfaces
- White Tertiary (.btn-white-tertiary)— Low-emphasis on dark surfaces
- Black (.btn-black)                  — Always-black fill; use on light surfaces

Button Sizes:
- Large   (.btn-700)  — 56px height, Inter 600 16px
- Small   (.btn-300)  — 40px height, Inter 600 14px
- X-Small (.btn-100)  — 32px height, Inter 600 14px
(label type is set by the size rules below, not by a text-style class)

Icon Placement:
- .btn-icon-leading   — Icon before label
- .btn-icon-trailing  — Icon after label
- .btn-icon-only      — Icon only (no label)

Width Modes:
- Default: width based on children (hug)
- .btn-fill: fills parent container width

Interactive Scale:
- Buttons use scale-500 (1 → 1.025 → 0.975)

Circle Icon Buttons:
- .btn-circle (.btn-circle-700, .btn-circle-300)
- Uses scale-300 (1 → 1.035 → 0.965)
```

### Which button?

`.btn` + a type + a size. The type carries the intent, the size carries the height.

| Type | Use for |
|---|---|
| `.btn-transactional` | The money action — Buy, Purchase, Checkout |
| `.btn-primary` | The main action on the screen — Submit, Save, Continue |
| `.btn-neutral` | Standard, non-committal — Cancel, Back |
| `.btn-secondary` | Outlined alternative, sits next to a primary |
| `.btn-tertiary` | Low emphasis, reads as a link |
| `.btn-destructive` | Delete, Remove |
| `.btn-white` / `.btn-white-tertiary` | On dark or brand-coloured surfaces |
| `.btn-black` | Always-black fill, for use on light or photographic surfaces |

Sizes are `.btn-700` (56px), `.btn-300` (40px), `.btn-100` (32px). Add `.btn-fill` to span the
container, `.btn-icon-leading` / `.btn-icon-trailing` / `.btn-icon-only` for icon placement, and
the `disabled` attribute — not a class — for the disabled state.

### Pitfalls

**Don't hand-roll a button.** If you are writing `display: inline-flex` + `height` +
`border-radius` + `cursor: pointer` on a `<button>`, you are rebuilding `.btn`. See RULES §2.

**`.btn-icon` is for glyphs, not letters.** It sizes a box for a Material Symbol. For a letter
or an avatar initial inside a circle button use `.btn-circle-letter`, which sets Inter 600 at
the right size without the icon box sizing.

**Button icons are filled**, matching `.icon`, and written
`<span class="btn-icon material-symbols-rounded">name</span>`. See RULES §4.

### BASE BUTTON RESET & STRUCTURE

| Class | Declares | Tokens |
|---|---|---|
| `.btn` | gap: var(--spacing-100); border-radius: var(--button-border-radius); border: none; display: inline-flex; align-items: center; +9 more *(also styled in card-components.css, product-patterns.css)* | --spacing-100, --button-border-radius |

### BUTTON SIZES

**Scales**

- `.btn-{100|300|700}` — font-size: 14px; font-weight: 600; line-height: 100%; +4 more *(smallest step shown)*

| Class | Declares | Tokens |
|---|---|---|
| `.btn-icon` | font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24 | — |

### ICON PLACEMENT PADDING ADJUSTMENTS

| Class | Declares | Tokens |
|---|---|---|
| `.btn-icon-leading` | *contextual — styled via a parent* | — |
| `.btn-icon-trailing` | *contextual — styled via a parent* | — |

### FILL WIDTH MODE

| Class | Declares | Tokens |
|---|---|---|
| `.btn-black` | color: var(--white-1000); background: var(--black-1000) | --black-1000, --white-1000, --white-300, --white-500 |
| `.btn-destructive` | color: var(--white-1000); background: var(--status-error) | --status-error, --white-1000, --white-300, --black-300 |
| `.btn-fill` | width: 100% | — |
| `.btn-neutral` | color: var(--inverted-1000); background: var(--neutral-1000) | --neutral-1000, --inverted-1000, --inverted-200, --black-500 |
| `.btn-primary` | color: var(--interactive-primary-text); background: var(--interactive-primary) | --interactive-primary, --interactive-primary-text, --white-300, --black-300 |
| `.btn-secondary` | color: var(--interactive-secondary-text); background: var(--neutral-000); border: var(--border-weight-100) solid var(--neutral-300) | --neutral-000, --border-weight-100, --neutral-300, --interactive-secondary-text, … |
| `.btn-tertiary` | color: var(--interactive-tertiary-text); background: var(--neutral-000); border: none | --neutral-000, --interactive-tertiary-text, --neutral-100, --black-300 |
| `.btn-transactional` | color: var(--interactive-transactional-text); background: var(--interactive-transactional) | --interactive-transactional, --interactive-transactional-text, --white-300, --black-300 |
| `.btn-white` | color: var(--black-1000); background: var(--white-1000) | --white-1000, --black-1000, --black-200, --black-500 |
| `.btn-white-tertiary` | color: var(--white-1000); background: var(--neutral-000); border: none | --neutral-000, --white-1000, --neutral-100, --black-300 |

### CIRCLE ICON BUTTONS

| Class | Declares | Tokens |
|---|---|---|
| `.btn-circle` | border-radius: 50%; border: none; display: inline-flex; align-items: center; justify-content: center; +4 more | --interactive-primary, --interactive-primary-text, --white-300, --black-300, … |
| `.btn-circle-300` | height: 40px; width: 40px | — |
| `.btn-circle-700` | height: 56px; width: 56px | — |
| `.btn-circle-black` | *contextual — styled via a parent* | --black-1000, --white-1000, --white-300 |
| `.btn-circle-brand` | *contextual — styled via a parent* | --interactive-primary, --interactive-primary-text, --white-300, --black-300 |
| `.btn-circle-brand-secondary` | *contextual — styled via a parent* | --neutral-000, --neutral-300, --interactive-primary |
| `.btn-circle-brand-tertiary` | *contextual — styled via a parent* | --neutral-000, --interactive-primary |
| `.btn-circle-destructive` | *contextual — styled via a parent* | --status-error, --white-1000, --white-300, --black-300 |
| `.btn-circle-destructive-secondary` | *contextual — styled via a parent* | --neutral-000, --neutral-300, --status-error |
| `.btn-circle-destructive-tertiary` | *contextual — styled via a parent* | --neutral-000, --status-error |
| `.btn-circle-inverted` | *contextual — styled via a parent* | --inverted-1000, --neutral-1000, --neutral-200, --black-500 |
| `.btn-circle-letter` | *contextual — styled via a parent* | — |
| `.btn-circle-neutral` | *contextual — styled via a parent* | --neutral-1000, --inverted-1000, --inverted-200, --black-500 |
| `.btn-circle-neutral-secondary` | *contextual — styled via a parent* | --neutral-000, --neutral-300, --text-primary |
| `.btn-circle-neutral-tertiary` | *contextual — styled via a parent* | --neutral-000, --text-primary |
| `.btn-circle-white` | *contextual — styled via a parent* | --white-1000, --black-1000, --black-200, --black-500 |
| `.btn-circle-white-tertiary` | *contextual — styled via a parent* | --neutral-000, --white-1000 |

### BUTTON GROUP UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.btn-group` | gap: var(--spacing-150); display: flex; align-items: center | --spacing-150 |
| `.btn-group-stack` | gap: var(--spacing-150); display: flex; flex-direction: column | --spacing-150 |

---

## system-ui.css

```
system-ui.css
Vendor chrome: controls specified by Apple or Google that a prototype reproduces rather than designs.

What's inside
- .wallet-btn-wrapper, .wallet-btn, .wallet-btn-label, .wallet-icon — the
"Add to Apple Wallet" button, per Apple's HIG

Notes
- This file is the one exemption from the token and type rules: vendor
colours as literals, vendor type, no response to theme or mode. The
exemption is bounded to controls traceable to a published vendor guideline,
and it lives here — never inside a template. See RULES §7.
```

### ADD TO APPLE WALLET

| Class | Declares | Tokens |
|---|---|---|
| `.wallet-btn` | background: #1d1e1e; gap: var(--spacing-150); padding: var(--spacing-100) var(--spacing-200); border-radius: var(--border-radius-100); border: 0.33px solid #808080; +7 more | --spacing-150, --spacing-100, --spacing-200, --border-radius-100 |
| `.wallet-btn-label` | font-size: 18px; font-weight: 590; line-height: 40px; letter-spacing: -0.4px; color: #ffffff; +1 more | — |
| `.wallet-btn-wrapper` | margin-top: var(--spacing-150) | --spacing-150 |
| `.wallet-icon` | height: 18px; width: 26px; object-fit: contain | — |

---

## list-row-components.css

```
list-row-components.css
The list row and everything built on it: its slots and subcomponents, the selector wrapper, and the split row.

What's inside
- .list-row (+ .list-row-content, .list-row-text-pair, .not-tappable, .disabled)
— the three-slot row: leading → content → trailing
- .leading (+ gap modifiers), .leading-image-*, .leading-logo, .leading-icon,
.leading-payment, .circle-container, .select-box — leading-slot content
- .trailing (+ gap modifiers), .trailing-text-link, .trailing-text-pair — trailing-slot content
- .status-dot, .info-item, .info-block, .tag-group, .tag-brand-color, .switch,
.stepper — subcomponents that sit inside a row
- .list-divided — rows inside a card, hairline-separated, dividers bleeding
to both edges and padding square
- .selector (+ .is-selected, .is-disabled) — wraps a row to make it selectable
- .split-row (+ -top/-bottom/-logo/-note), .split-row-list — a card of two
independently tappable bands, the shipped example of .surface-section

Notes
- .tag itself lives in tag-chip-components.css; only .tag-brand-color is here.
- A tappable row is a .selector with a .surface-* + .scale-700 pair, not a
:hover rule. See RULES §2 and §3.
- Icons inside rows are <span class="icon icon-N">. See RULES §4.
```

### STATUS DOT

| Class | Declares | Tokens |
|---|---|---|
| `.read` | *contextual — styled via a parent* | --neutral-200 |
| `.status-dot` | background-color: var(--status-info); border-radius: 48px; height: 8px; width: 8px; flex-shrink: 0 | --status-info, --neutral-200 |

### INFO ITEM

| Class | Declares | Tokens |
|---|---|---|
| `.has-label` | *contextual — styled via a parent* | --spacing-50 |
| `.info-item` | display: flex; align-items: center; flex-shrink: 0 | --spacing-50 |

### INFO BLOCK

| Class | Declares | Tokens |
|---|---|---|
| `.info-block` | gap: var(--spacing-100); display: flex; flex-wrap: wrap; align-items: start | --spacing-100 |

### TAG (TEAM COLOR)

| Class | Declares | Tokens |
|---|---|---|
| `.tag-brand-color` | *contextual — styled via a parent* | --inverted-900, --color-interactive |

### TAG GROUP

| Class | Declares | Tokens |
|---|---|---|
| `.tag-group` | gap: var(--spacing-100); display: flex; align-items: start | --spacing-100 |

### SWITCH (WEB)

| Class | Declares | Tokens |
|---|---|---|
| `.switch` | height: 31px; width: 51px; position: relative; flex-shrink: 0 | --neutral-200, --white-1000, --color-interactive, --neutral-100, … |

### LEADING SLOT

| Class | Declares | Tokens |
|---|---|---|
| `.leading` | display: flex; align-items: center; flex-shrink: 0 | — |
| `.leading-gap-lg` | padding-right: 16px | — |
| `.leading-gap-md` | padding-right: 12px | — |
| `.leading-gap-sm` | padding-right: 8px | — |
| `.leading-gap-xl` | padding-right: 24px | — |

### CIRCLE CONTAINER

| Class | Declares | Tokens |
|---|---|---|
| `.circle-container` | background: var(--neutral-100); border-radius: 48px; height: 40px; width: 40px; display: flex; +4 more | --neutral-100 |

### SELECT BOX

| Class | Declares | Tokens |
|---|---|---|
| `.select-box` | border-radius: var(--border-radius-50); border: 1px solid var(--neutral-300); height: 28px; width: 28px; flex-shrink: 0 | --border-radius-50, --neutral-300, --neutral-200 |

### LEADING IMAGES

| Class | Declares | Tokens |
|---|---|---|
| `.leading-image-large` | border-radius: var(--border-radius-100); height: 124px; width: 244px; object-fit: cover; flex-shrink: 0 | --border-radius-100 |
| `.leading-image-small` | border-radius: var(--border-radius-100); height: 80px; width: 136px; object-fit: cover; flex-shrink: 0 | --border-radius-100 |
| `.leading-image-square` | border-radius: var(--border-radius-100); height: 80px; width: 80px; object-fit: cover; flex-shrink: 0 | --border-radius-100 |

### LEADING LOGO

| Class | Declares | Tokens |
|---|---|---|
| `.leading-logo` | height: 48px; width: 48px; background-image: var(--brand-logo-url); background-size: contain; background-repeat: no-repeat; +2 more *(also styled in web-footer-components.css)* | --brand-logo-url |

### LEADING PAYMENT

| Class | Declares | Tokens |
|---|---|---|
| `.leading-icon` | background: var(--neutral-100); border-radius: 50%; height: 40px; width: 40px; display: flex; +3 more | --neutral-100 |
| `.leading-payment` | height: 24px; width: 33px; object-fit: contain; flex-shrink: 0 | — |

### TRAILING SLOT

| Class | Declares | Tokens |
|---|---|---|
| `.trailing` | display: flex; align-items: center; justify-content: flex-end; flex-shrink: 0 | — |
| `.trailing-gap-lg` | padding-left: 12px | — |
| `.trailing-gap-md` | padding-left: 8px | — |
| `.trailing-gap-sm` | padding-left: 4px | — |
| `.trailing-gap-xs` | padding-left: 2px | — |

### TRAILING TEXT LINK (CHIP)

| Class | Declares | Tokens |
|---|---|---|
| `.trailing-text-link` | background: transparent; padding: 0 12px; border-radius: var(--border-radius-50); height: 32px; display: flex; +3 more | --border-radius-50 |

### TRAILING TEXT PAIR

| Class | Declares | Tokens |
|---|---|---|
| `.trailing-text-pair` | gap: 1px; display: flex; flex-direction: column; align-items: flex-end; text-align: right; +1 more | — |

### STEPPER (WEB)

| Class | Declares | Tokens |
|---|---|---|
| `.disabled` | *contextual — styled via a parent* | --neutral-100, --neutral-200 |
| `.stepper` | gap: var(--spacing-100); display: flex; align-items: center | --spacing-100 |
| `.stepper-btn` | color: var(--text-primary); background: transparent; border-radius: 100px; border: 1px solid var(--neutral-300); height: 40px; +6 more | --neutral-300, --text-primary, --neutral-100 |
| `.stepper-count` | width: 32px; text-align: center; flex-shrink: 0 | — |

### LIST ROW (PARENT)

| Class | Declares | Tokens |
|---|---|---|
| `.list-row` | width: 100%; display: flex; align-items: center; cursor: pointer | --spacing-200, --border-weight-100, --neutral-200 |
| `.not-tappable` | *contextual — styled via a parent* | — |

### DIVIDED LIST

| Class | Declares | Tokens |
|---|---|---|
| `.list-divided` | width: 100%; display: flex; flex-direction: column | --spacing-200, --border-weight-100, --neutral-200 |

### LIST ROW CONTENT

| Class | Declares | Tokens |
|---|---|---|
| `.list-row-content` | gap: var(--spacing-100); display: flex; flex-direction: column; flex: 1 0 0; justify-content: center; +2 more | --spacing-100 |

### LIST ROW TEXT PAIR

| Class | Declares | Tokens |
|---|---|---|
| `.list-row-text-pair` | gap: 2px; width: 100%; display: flex; flex-direction: column | — |

### SELECTOR

| Class | Declares | Tokens |
|---|---|---|
| `.is-disabled` | *contextual — styled via a parent* *(also styled in input-components.css, tag-chip-components.css)* | — |
| `.is-selected` | *contextual — styled via a parent* | --neutral-1000, --inverted-1000, --inverted-700 |
| `.selector` | padding: var(--spacing-200); border-radius: var(--border-radius-200); box-sizing: border-box | --border-radius-200, --spacing-200, --neutral-1000, --inverted-1000, … |

### SPLIT ROW LOGO

| Class | Declares | Tokens |
|---|---|---|
| `.split-row-logo` | height: 48px; width: 48px; object-fit: contain; flex-shrink: 0 | — |

### SPLIT ROW

| Class | Declares | Tokens |
|---|---|---|
| `.split-row` | background: var(--org-surface); border-radius: var(--border-radius-200); width: 100%; display: flex; flex-direction: column; +1 more | --org-surface, --border-radius-200 |
| `.split-row-bottom` | padding: var(--spacing-150) var(--spacing-200); border-top: 0.33px solid var(--border-default) *(also styled in platform-tokens.css)* | --spacing-150, --spacing-200, --border-default, --spacing-300 |
| `.split-row-note` | max-width: var(--spacing-800); text-align: right; white-space: normal | --spacing-800 |
| `.split-row-top` | padding: var(--spacing-200) *(also styled in platform-tokens.css)* | --spacing-200, --spacing-300 |

### SPLIT ROW LIST

| Class | Declares | Tokens |
|---|---|---|
| `.split-row-list` | gap: var(--spacing-100); padding: var(--spacing-200); width: 100%; display: flex; flex-direction: column; +2 more | --spacing-100, --spacing-200 |

---

## table-components.css

```
table-components.css
A stats table — a pinned entity column beside horizontally scrolling attribute columns.

The shape exists because a standings or stat table has one wide
identifying column and many narrow numeric ones. On a phone the
numbers cannot all fit, so they scroll while the entity
stays put — a number you can read but can't attribute is useless.

What's inside
- .stat-table-scroll — the scroll container; wrap every table in one
- .stat-table — the table itself
- .stat-table-title (+ .is-plain) — the group title band above a table
- .stat-table-entity (+ .is-title) — the pinned leading cell
- .stat-table-attr (+ .is-sorted, .is-win, .is-loss, .is-empty, .is-text) —
one narrow attribute cell, in the head row or the body
- .stat-table-row (+ .is-tinted, .is-featured) — a body row
- .stat-table-entity-block, .stat-table-rank — the mark + abbreviation block

Notes
- Sizing: attribute cells are 48px wide (--spacing-600), head cells
40px tall (--spacing-500), body rows 48px min. The entity column is
--stat-table-entity-width (224px), settable per table.
- Type comes from a type class you add, the same as .tag and
.list-row-text-pair: labelBold10 on head cells and the entity label,
labelRegular20 on attribute cells, labelBold20 when sorted, title50
on the title band. Colour comes from here and wins because this sheet
loads after text-styles-system.css.
- .is-sorted is the one place this sheet sets font-weight, so a table
using one type class throughout still reads correctly.
- Figma gives every row its own scroller because that is what Figma can
express. Here one scroller wraps the whole table so the columns can
never desync from their headers.
- Featured rows drop the win/loss colours for --white-700/--white-1000:
green and red on --brand-core fail contrast. This is deliberate, not
an omission.
- Padding follows alignment: a centred numeric cell takes 8px inline, a
left-aligned .is-text cell takes the entity cell's 16px so the text
columns align. Block padding is 8px everywhere.
- Numeric cells are one line; an .is-text cell wraps, because a string
that does not fit is worth two lines rather than an ellipsis.
- Two borders exist, both from Figma: one under the head row and one down
the right of the entity column, each --neutral-300. There is no rule
between body rows — the alternating tint separates them.
```

### Tokens


| Token | Scope | Example value |
|---|---|---|
| `--stat-table-entity-width` | component-scoped | 224px |

### (no section)

| Class | Declares | Tokens |
|---|---|---|
| `.is-empty` | *contextual — styled via a parent* | --text-secondary, --white-700 |
| `.is-featured` | *contextual — styled via a parent* | --brand-core, --white-700, --white-1000 |
| `.is-loss` | *contextual — styled via a parent* | --status-error, --white-700 |
| `.is-plain` | *contextual — styled via a parent* | — |
| `.is-sorted` | *contextual — styled via a parent* | --text-primary, --border-weight-200, --white-1000 |
| `.is-text` | *contextual — styled via a parent* | --spacing-200 |
| `.is-tinted` | *contextual — styled via a parent* | --neutral-50 |
| `.is-title` | *contextual — styled via a parent* | --text-primary |
| `.is-win` | *contextual — styled via a parent* | --status-success, --white-700 |
| `.stat-table` | width: 100%; --stat-table-entity-width: 224px; border-collapse: separate; border-spacing: 0 | --spacing-500, --border-weight-50, --neutral-300, --text-placeholder, … |
| `.stat-table-attr` | color: var(--text-secondary); padding: var(--spacing-100); width: var(--spacing-600); box-sizing: border-box; text-align: center; +1 more | --border-weight-50, --neutral-300, --spacing-600, --spacing-100, … |
| `.stat-table-entity` | color: var(--text-secondary); background-color: var(--bg-base); padding: var(--spacing-100) var(--spacing-200); width: var(--stat-table-entity-width); position: sticky; +9 more | --border-weight-50, --neutral-300, --stat-table-entity-width, --spacing-900, … |
| `.stat-table-entity-block` | color: var(--text-primary); gap: var(--spacing-50); display: flex; align-items: center; min-width: 0 | --white-1000, --spacing-50, --text-primary, --spacing-400 |
| `.stat-table-rank` | color: var(--text-secondary); width: var(--spacing-200); flex-shrink: 0; text-align: center | --spacing-200, --text-secondary, --white-700 |
| `.stat-table-row` | height: var(--spacing-600) | --spacing-600, --neutral-50, --brand-core, --white-700, … |
| `.stat-table-scroll` | width: 100%; overflow-x: auto; overflow-y: visible | — |
| `.stat-table-title` | color: var(--text-primary); background-color: var(--bg-surface); display: flex; align-items: flex-start; border-bottom: var(--border-weight-50) solid var(--neutral-300); +4 more | --bg-surface, --border-weight-50, --neutral-300, --text-primary, … |

---

## input-components.css

```
input-components.css
Single-line text input and select dropdown, with their states and modifiers.

What's inside
- .input-field — the field wrapper; carries the state classes
- .input-label-row, .input-label, .input-link — label row
- .input-and-message, .input-control, .input-icon, .input-clear,
.input-message — the control shell and its parts
- .input-select (+ .input-select-display, .input-select-chevron, .is-open)
— the select variant: a native <select> overlaid on the shell
- .is-error, .is-disabled, .has-value, .is-placeholder — states

Notes
- Never a bare <input> or <select>; every one sits in .input-field. See
RULES §2 and §3.

--- Text input structure ---
.input-field
.input-label-row                (optional)
label.input-label
a.input-link                  (optional)
.input-and-message
.input-control
.input-icon                 (optional leading icon)
input[type="text"] / etc.
.input-clear                (optional trailing clear btn)
.input-message                (optional helper/error)

--- Select structure ---
.input-field.input-select
.input-label-row                (optional)
label.input-label
a.input-link                  (optional)
.input-and-message
.input-control
.input-icon                 (optional leading icon)
.input-select-display       (visible selected value text)
.input-select-chevron       (arrow_drop_down icon, always shown)
select                      (native, invisible overlay)
.input-message                (optional helper/error)

--- State classes (on .input-field) ---
.is-error     — red border, shake, error message color
.is-disabled  — 25% opacity, no pointer events
.has-value    — shows .input-clear (text input only)
```

### FIELD WRAPPER

| Class | Declares | Tokens |
|---|---|---|
| `.input-field` | gap: var(--spacing-25); width: 100%; display: flex; flex-direction: column; box-sizing: border-box | --spacing-25, --org-primary-button, --text-primary, --status-error, … |

### LABEL ROW

| Class | Declares | Tokens |
|---|---|---|
| `.input-label` | font-size: 16px; font-weight: 600; line-height: 1; letter-spacing: -0.02em; color: var(--text-primary); +3 more | --text-primary, --org-primary-button |
| `.input-label-row` | gap: var(--spacing-100); display: flex; align-items: center; justify-content: space-between; padding-left: var(--spacing-100); +1 more | --spacing-100 |
| `.input-link` | font-size: 14px; font-weight: 600; line-height: 1; letter-spacing: -0.02em; color: var(--color-interactive); +7 more | --color-interactive, --spacing-50, --spacing-150, --border-radius-50 |
| `.is-error` | *contextual — styled via a parent* | --text-primary, --status-error, --neutral-100, --border-weight-200, … |

### INPUT + MESSAGE WRAPPER

| Class | Declares | Tokens |
|---|---|---|
| `.input-and-message` | gap: var(--spacing-100); width: 100%; display: flex; flex-direction: column | --spacing-100 |

### INPUT CONTROL SHELL

| Class | Declares | Tokens |
|---|---|---|
| `.input-control` | background-color: var(--bg-input); gap: var(--spacing-150); border-radius: var(--border-radius-100); border: var(--border-weight-50) solid var(--neutral-300); height: 56px; +7 more | --spacing-150, --spacing-200, --border-radius-100, --border-weight-50, … |

### LEADING ICON

| Class | Declares | Tokens |
|---|---|---|
| `.input-icon` | color: var(--text-secondary); height: 24px; width: 24px; display: flex; align-items: center; +4 more | --text-secondary, --org-primary-button |

### TRAILING CLEAR BUTTON

| Class | Declares | Tokens |
|---|---|---|
| `.has-value` | *contextual — styled via a parent* | — |
| `.input-clear` | color: var(--text-secondary); background: transparent; padding: 0; border-radius: 100px; border: none; +9 more | --text-secondary, --neutral-100, --neutral-200 |

### MESSAGE / HELPER TEXT

| Class | Declares | Tokens |
|---|---|---|
| `.input-message` | font-size: 14px; font-weight: 400; line-height: 1.3; letter-spacing: -0.02em; color: var(--text-secondary); +4 more | --spacing-100, --text-secondary, --status-error |

### SELECT / DROPDOWN VARIANT

| Class | Declares | Tokens |
|---|---|---|
| `.input-select` | *contextual — styled via a parent* | --org-primary-button, --text-secondary |
| `.input-select-chevron` | font-size: 24px; color: var(--text-secondary); height: 24px; width: 24px; display: flex; +5 more | --text-secondary, --org-primary-button |
| `.input-select-display` | font-size: 16px; font-weight: 400; line-height: 1.2; letter-spacing: -0.02em; color: var(--text-primary); +8 more | --text-primary, --text-secondary |
| `.is-open` | *contextual — styled via a parent* *(also styled in ios-nav-components.css, platform-tokens.css)* | — |
| `.is-placeholder` | *contextual — styled via a parent* | --text-secondary |

---

## tag-chip-components.css

```
tag-chip-components.css
The tag (a static label badge) and the chip (an interactive filter or toggle).

What's inside
- .tag (+ .tag-icon-leading | .tag-icon-trailing) — static badge for
metadata, categories, status
- .chip (+ .chip-brand-color, .chip-icon-leading | .chip-icon-trailing,
.is-disabled) — interactive control for filter bars and selection UIs

Notes
- Both are 32px tall with a 4px radius and labelBold20 text; icons are 24px.
- A chip gets its hover/pressed states from a surface + scale pair
(.surface-borderNeutral or .surface-ghost, with .scale-300), not from a
:hover rule. See RULES §2.
- .tag-brand-color lives in list-row-components.css.
```

### SHARED BASE

| Class | Declares | Tokens |
|---|---|---|
| `.chip` | padding-left: var(--spacing-150); padding-right: var(--spacing-150) | --spacing-50, --spacing-150, --color-interactive, --spacing-100 |
| `.tag` | color: var(--text-primary); background-color: var(--neutral-100); padding-top: var(--spacing-50); padding-bottom: var(--spacing-50); padding-left: var(--spacing-150); +1 more *(also styled in list-row-components.css)* | --spacing-50, --neutral-100, --text-primary, --spacing-150, … |

### TAG COMPONENT

| Class | Declares | Tokens |
|---|---|---|
| `.tag-icon-leading` | *contextual — styled via a parent* | --spacing-100, --spacing-150 |
| `.tag-icon-trailing` | *contextual — styled via a parent* | --spacing-150, --spacing-100 |

### CHIP COMPONENT

| Class | Declares | Tokens |
|---|---|---|
| `.chip-brand-color` | *contextual — styled via a parent* | --color-interactive |
| `.chip-icon-leading` | *contextual — styled via a parent* | --spacing-100, --spacing-150 |
| `.chip-icon-trailing` | *contextual — styled via a parent* | --spacing-150, --spacing-100 |

---

## nav-components.css

```
nav-components.css
Web navigation and page-structure components: top bar, tabs, steps and page header.

What's inside
- .top-bar (+ -inner, -brand, -logo, -name, -actions) — sticky navigation bar
- .tabs, .tab (+ .is-active, .tabs-neutral) — horizontal tabs with a
brand-colour active indicator
- .steps, .step (+ -circle, -number, -label, -connector, state classes,
.steps-brand) — multi-step progress indicator
- .page-header (+ -content, .has-tabs, .has-steps) — section header with
optional tabs or steps

Notes
- The Top Bar and Page Header step at 768/1280 to match the Figma component;
the system breakpoints are 500/1100 (RULES §9).
- Each section carries the Figma nodeId it was built from.
```

### TOP BAR

| Class | Declares | Tokens |
|---|---|---|
| `.top-bar` | background: var(--bg-nav); padding: var(--spacing-100) var(--spacing-200); position: sticky; top: 0; z-index: 100; +3 more | --bg-nav, --background-blur, --border-weight-100, --border-default, … |
| `.top-bar-actions` | gap: var(--spacing-100); display: flex; align-items: center; flex-shrink: 0 | --spacing-100 |
| `.top-bar-brand` | color: inherit; gap: var(--spacing-150); display: flex; align-items: center; flex: 1; +3 more | --spacing-150 |
| `.top-bar-inner` | display: flex; align-items: center; min-height: 64px | — |
| `.top-bar-logo` | height: 64px; width: 64px; object-fit: contain; flex-shrink: 0 | — |
| `.top-bar-name` | color: var(--text-primary); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap | --text-primary |
| `.top-bar-name-full` | display: none | — |
| `.top-bar-name-short` | display: block | — |

### TABS

| Class | Declares | Tokens |
|---|---|---|
| `.is-active` | *contextual — styled via a parent* *(also styled in ios-nav-components.css)* | --interactive-primary, --text-primary, --neutral-1000 |
| `.tab` | font-size: 16px; font-weight: 400; line-height: 1.5; color: var(--text-primary); background: none; +15 more | --spacing-150, --spacing-200, --text-primary, --interactive-primary, … |
| `.tabs` | display: flex; align-items: flex-end; overflow-x: auto; scrollbar-width: none; border-bottom: var(--border-weight-100) solid var(--border-default) | --border-weight-100, --border-default |
| `.tabs-neutral` | *contextual — styled via a parent* | --text-primary, --neutral-1000 |

### STEPS

| Class | Declares | Tokens |
|---|---|---|
| `.step` | gap: var(--spacing-100); display: flex; align-items: center; flex-shrink: 0 | --spacing-100 |
| `.step-active` | *contextual — styled via a parent* | --neutral-1000, --white-1000, --text-primary |
| `.step-circle` | border-radius: 50%; height: 24px; width: 24px; display: flex; align-items: center; +2 more | --status-success, --white-1000, --neutral-1000, --border-weight-100, … |
| `.step-completed` | *contextual — styled via a parent* | --status-success, --white-1000, --text-secondary, --interactive-primary, … |
| `.step-connector` | color: var(--text-secondary); flex-shrink: 0; margin-inline: var(--spacing-50) | --text-secondary, --spacing-50 |
| `.step-label` | font-size: 14px; line-height: 1.43; white-space: nowrap; font-family: inherit | --text-secondary, --text-primary |
| `.step-number` | font-size: 12px; line-height: 1; font-family: inherit | --white-1000, --text-secondary |
| `.step-pending` | *contextual — styled via a parent* | --border-weight-100, --neutral-300, --text-secondary |
| `.steps` | display: flex; align-items: center; flex-wrap: nowrap | --spacing-200, --spacing-400, --spacing-500 |
| `.steps-brand` | *contextual — styled via a parent* | --interactive-primary, --interactive-primary-text |

### PAGE HEADER

| Class | Declares | Tokens |
|---|---|---|
| `.has-steps` | *contextual — styled via a parent* | --spacing-500, --spacing-300 |
| `.has-tabs` | *contextual — styled via a parent* | --spacing-300 |
| `.page-header` | background: var(--bg-base); padding-top: var(--spacing-800); padding-inline: 0; border-bottom: var(--border-weight-100) solid var(--border-default) | --bg-base, --spacing-800, --border-weight-100, --border-default, … |
| `.page-header-content` | padding-inline: var(--spacing-200); padding-bottom: var(--spacing-500) | --spacing-200, --spacing-500, --spacing-300 |

---

## ios-nav-components.css

```
ios-nav-components.css
iOS navigation chrome for app-mode prototypes: nav bars, tab bar, modal sheet and glass surface.

What's inside
- .ios-nav-btn (+ .ios-nav-btn-brand) — 44px frosted glass circle button
- .ios-nav-maintab, .ios-nav-controls — home nav bar with display title
- .ios-nav-subtabs* — the segmented control under the home nav bar
- .ios-chrome-top, .ios-chrome-bottom, .ios-scroll, .ios-scroll-inner —
floating chrome layers and the scrollport beneath them
- .ios-nav-page (+ -row, -title, -left, -right) — interior page nav bar
- .ios-modal-backdrop, .ios-modal-stack, .ios-modal-sheet, .ios-nav-modal,
.ios-modal-content — bottom-sheet modal
- .ios-tab-bar, .ios-tab (+ .is-active, .ios-tab-label, .ios-tab-brand-icon)
— 5-tab bottom bar
- .ios-glass — the frosted glass surface token
- .ios-content.has-ios-tab-bar — content clearance for the tab bar
- --brand-tab-icon, --ios-modal-stack-bg — themeable tab icon and the sheet backdrop

Notes
- Designed for the data-platform="app" phone frame (platform-tokens.css);
safe areas come from --safe-area-top / --safe-area-bottom. See RULES §9.
- The active tab pill uses --ios-selected-tab-bg, not --bg-input (which is
transparent in dark mode).
- These .ios-* controls are the design system wrapper for a <button> in app
chrome. See RULES §2.
```

### Tokens


| Token | Scope | Example value |
|---|---|---|
| `--brand-tab-icon` | global | url('../images/placeholder-logo.svg') |
| `--ios-modal-stack-bg` | global | linear-gradient( to bottom, rgba(100, 100, 100, 0.5), rgba(7 |

### iOS GLASS CIRCLE BUTTON

| Class | Declares | Tokens |
|---|---|---|
| `.ios-glass` | background: var(--neutral-200), var(--inverted-300), var(--black-200); position: relative; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background-blend-mode: luminosity | --white-300, --white-100, --neutral-200, --inverted-300, … |
| `.ios-nav-btn` | color: var(--text-primary); padding: 0; border-radius: 50%; border: none; height: 44px; +8 more | --text-primary, --white-300, --white-100 |
| `.ios-nav-btn-brand` | color: var(--interactive-primary-text); background: var(--interactive-primary) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: inset 0.5px 1px 3px rgba(255, 255, 255, 0.25), inset -0.5px -1px 2px rgba(0, 0, 0, 0.2), 0px 2px 40px rgba(0, 0, 0, 0.2); +1 more | --interactive-primary, --interactive-primary-text |

### iOS HOME NAV BAR

| Class | Declares | Tokens |
|---|---|---|
| `.ios-nav-controls` | gap: 10px; display: flex; align-items: center; flex-shrink: 0 | — |
| `.ios-nav-maintab` | padding: 0 var(--spacing-200) 6px; display: flex; flex-direction: column; position: relative; z-index: 100; +3 more | --spacing-200, --safe-area-top, --black-300, --bg-base |

### CHROME LAYERS & SCROLLPORT

| Class | Declares | Tokens |
|---|---|---|
| `.ios-chrome-bottom` | bottom: 0 *(also styled in platform-tokens.css)* | — |
| `.ios-chrome-top` | top: 0; padding-bottom: 8px *(also styled in platform-tokens.css)* | — |
| `.ios-nav-subtab` | font-size: 14px; font-weight: 600; letter-spacing: -0.28px; color: var(--text-primary); background: none; +13 more | --text-primary, --interactive-primary, --ios-selected-tab-bg |
| `.ios-nav-subtab-sep` | background: var(--border-default); height: 16px; width: 1px; flex-shrink: 0; align-self: center | --border-default |
| `.ios-nav-subtabs` | padding: 4px 8px; border-radius: 100px; height: 40px; display: flex; align-items: center; +2 more | — |
| `.ios-nav-subtabs-container` | padding: 8px 12px 8px | — |
| `.ios-scroll` | position: absolute; inset: 0; overflow-y: auto; overflow-x: hidden; z-index: 1 *(also styled in platform-tokens.css)* | — |
| `.ios-scroll-inner` | padding-bottom: var(--ios-tab-bar-clearance) *(also styled in platform-tokens.css)* | --ios-tab-bar-clearance |
| `.ios-status-bar` | transition: color 0.3s *(also styled in platform-tokens.css)* | — |

### iOS PAGE NAV BAR

| Class | Declares | Tokens |
|---|---|---|
| `.ios-nav-page` | display: flex; flex-direction: column; position: sticky; top: var(--safe-area-top); z-index: 100; +1 more *(also styled in platform-tokens.css)* | --safe-area-top, --bg-base, --spacing-200 |
| `.ios-nav-page-left` | *contextual — styled via a parent* | --spacing-200 |
| `.ios-nav-page-right` | *contextual — styled via a parent* | --spacing-200 |
| `.ios-nav-page-row` | display: flex; position: relative; align-items: center; min-height: 44px | — |
| `.ios-nav-page-title` | font-size: 20px; font-weight: 600; line-height: 1.2; letter-spacing: -0.4px; color: var(--text-primary); +7 more | --text-primary, --spacing-600 |

### iOS MODAL SHEET

| Class | Declares | Tokens |
|---|---|---|
| `.ios-modal-backdrop` | background: black; display: flex; flex-direction: column; position: absolute; inset: 0; +5 more | --safe-area-top |
| `.ios-modal-content` | flex: 1; overflow-y: auto | — |
| `.ios-modal-sheet` | background: var(--bg-base); border-radius: 16px 16px 0 0; display: flex; flex-direction: column; flex: 1; +3 more | --bg-base |
| `.ios-modal-stack` | background: var(--ios-modal-stack-bg); margin: 0 16px -50px; border-radius: 38px 38px 0 0; height: 60px; flex-shrink: 0; +1 more | --ios-modal-stack-bg |
| `.ios-nav-modal` | padding: 16px 0 10px; display: flex; flex-direction: column; position: relative; z-index: 1; +1 more | --bg-base, --neutral-300, --text-primary |
| `.ios-nav-modal-row` | padding: 0 var(--spacing-200); display: flex; align-items: center; min-height: 44px | --spacing-200 |
| `.ios-status-bar-modal` | *contextual — styled via a parent* | — |

### iOS BOTTOM TAB BAR

| Class | Declares | Tokens |
|---|---|---|
| `.ios-tab-bar` | background: transparent; padding: 8px 20px 24px; display: flex; flex-direction: column; position: relative; +3 more | --bg-base |
| `.ios-tab-bar-inner` | padding: 4px; border-radius: 100px; width: 100%; display: flex; pointer-events: auto; +2 more | — |

### iOS GLASS TOKEN

| Class | Declares | Tokens |
|---|---|---|
| `.ios-tab` | color: var(--neutral-1000); background: none; gap: 1px; padding: 5px 0 6px; border-radius: 100px; +10 more | --neutral-1000, --ios-selected-tab, --ios-selected-tab-bg |
| `.ios-tab-brand-icon` | background: currentColor; height: 28px; width: 28px; -webkit-mask-image: var(--brand-tab-icon); mask-image: var(--brand-tab-icon); +7 more | --brand-tab-icon |
| `.ios-tab-label` | font-size: 10px; font-weight: 500; line-height: 1; white-space: nowrap | — |

### iOS CONTENT — TAB BAR INTEGRATION

| Class | Declares | Tokens |
|---|---|---|
| `.has-ios-tab-bar` | *contextual — styled via a parent* | — |
| `.ios-content` | *contextual — styled via a parent* *(also styled in platform-tokens.css)* | — |

---

## web-footer-components.css

```
web-footer-components.css
The responsive site footer.

What's inside
- .web-footer, .web-footer-main — the footer band and its main row
- .web-footer-logo, .web-footer-app (+ -title, -badges, -badge) — logo and
app download column
- .web-footer-column (+ -heading), .web-footer-link — link columns
- .web-footer-bottom, .web-footer-legal (+ -links), .web-footer-copyright,
.web-footer-powered — bottom bar

Notes
- Background is --brand-dark, so text uses the white family: the footer is
always a dark surface regardless of mode.
- Reflows at the system breakpoints (RULES §9).
```

### WEB FOOTER

| Class | Declares | Tokens |
|---|---|---|
| `.web-footer` | background: var(--brand-dark); gap: var(--spacing-500); padding: var(--spacing-800) var(--spacing-400) 0; display: flex; flex-direction: column; +1 more | --brand-dark, --spacing-800, --spacing-400, --spacing-500 |
| `.web-footer-app` | gap: var(--spacing-100); display: flex; flex-direction: column; flex-shrink: 0 | --spacing-100 |
| `.web-footer-app-title` | color: white | — |
| `.web-footer-badge` | height: 40px; width: auto; display: block | — |
| `.web-footer-badges` | gap: var(--spacing-100); display: flex; flex-direction: column; padding-top: var(--spacing-100) | --spacing-100 |
| `.web-footer-bottom` | gap: var(--spacing-400); padding: var(--spacing-200) 0; display: flex; flex-direction: column; justify-content: space-between; +1 more | --spacing-200, --border-weight-50, --white-200, --spacing-400 |
| `.web-footer-column` | gap: var(--spacing-100); display: flex; flex-direction: column | --spacing-100 |
| `.web-footer-column-heading` | color: white | — |
| `.web-footer-copyright` | color: white | — |
| `.web-footer-legal` | gap: var(--spacing-300); display: flex; flex-direction: column | --spacing-300 |
| `.web-footer-legal-links` | gap: var(--spacing-200); display: flex; flex-direction: row; flex-wrap: wrap | --spacing-200, --white-700, --spacing-100 |
| `.web-footer-link` | color: var(--white-700); display: block; text-decoration: none; transition: color 0.15s ease; cursor: pointer | --white-700 |
| `.web-footer-logo` | border-radius: var(--border-radius-200); height: 120px; width: 120px; flex-shrink: 0; overflow: hidden | --border-radius-200 |
| `.web-footer-main` | gap: var(--spacing-400); display: flex; flex-direction: column | --spacing-400, --spacing-500 |
| `.web-footer-powered` | gap: var(--spacing-25); display: flex; align-items: center; flex-shrink: 0 | --spacing-25 |

---

## product-patterns.css

```
product-patterns.css
Composite layouts that recur across product screens and sit above the component layer.

What's inside
- .context-header — the band under the top nav with a page title and optional tabs
- .circle-icon — large decorative icon disc for auth flows and empty states
- .action-row — a row of equally weighted buttons
- .row-card (+ .row-card-media, .row-card-list) — a card whose body is a
stack of rows; takes a .surface-* + .scale-700 pair to become tappable
- .action-tile-row, .action-tile (+ -circle) — a row of icon-above-label actions
- .heading-select — a heading that is also a picker
- .disclosure-toggle — a label plus chevron that expands detail in place
- .section-heading — title plus supporting line for a section within a page
- .link — an emphasised inline link

Notes
- These arrange components rather than being one. A pattern earns a place
here once it recurs across several templates and has one agreed
definition; until then it stays product CSS in the template.
- Reach for one of these before writing layout CSS. See RULES §3.
```

### CONTEXT HEADER

| Class | Declares | Tokens |
|---|---|---|
| `.context-header` | background: var(--bg-base); padding-top: var(--spacing-800); border-bottom: var(--border-weight-100) solid var(--neutral-200) | --spacing-800, --bg-base, --border-weight-100, --neutral-200, … |
| `.header-inner` | *contextual — styled via a parent* | --spacing-200 |

### CIRCLE ICON

| Class | Declares | Tokens |
|---|---|---|
| `.circle-icon` | background: var(--neutral-100); border-radius: 50%; height: var(--spacing-700); width: var(--spacing-700); display: flex; +3 more | --spacing-700, --neutral-100 |

### ACTION ROW

| Class | Declares | Tokens |
|---|---|---|
| `.action-row` | gap: var(--spacing-200); display: flex; align-items: center | --spacing-200 |

### ROW CARD

| Class | Declares | Tokens |
|---|---|---|
| `.row-card` | padding: var(--spacing-300); border-radius: var(--border-radius-200); overflow: hidden | --border-radius-200, --spacing-300 |
| `.row-card-list` | gap: var(--spacing-200); display: flex; flex-direction: column | --spacing-200 |
| `.row-card-media` | padding: 0 | — |

### ACTION TILE

| Class | Declares | Tokens |
|---|---|---|
| `.action-tile` | background: none; gap: var(--spacing-100); padding: var(--spacing-100) 0; border-radius: var(--border-radius-100); border: none; +5 more | --spacing-100, --border-radius-100 |
| `.action-tile-circle` | background: var(--interactive-transactional); border-radius: 50%; height: var(--spacing-700); width: var(--spacing-700); display: flex; +4 more | --spacing-700, --interactive-transactional, --interactive-transactional-text |
| `.action-tile-row` | gap: var(--spacing-25); width: 100%; display: flex | --spacing-25 |

### HEADING SELECT

| Class | Declares | Tokens |
|---|---|---|
| `.heading-select` | color: var(--text-primary); background: none; gap: var(--spacing-50); padding: 0; border: none; +4 more | --spacing-50, --text-primary |

### DISCLOSURE TOGGLE

| Class | Declares | Tokens |
|---|---|---|
| `.disclosure-toggle` | color: var(--text-primary); background: none; gap: var(--spacing-25); padding: 0; border: none; +4 more | --spacing-25, --text-primary |

### SECTION HEADING

| Class | Declares | Tokens |
|---|---|---|
| `.section-heading` | gap: var(--spacing-25); display: flex; flex-direction: column | --spacing-25 |

### INLINE LINK

| Class | Declares | Tokens |
|---|---|---|
| `.link` | font-weight: 600; color: var(--color-interactive); text-decoration: none; cursor: pointer | --color-interactive |

---

## boilerplate.css

```
boilerplate.css
The base layer: CSS reset, element defaults, and the spacing, layout, grid and responsive utilities.

What's inside
- CSS reset and base element styles (body, headings, links, images)
- .flex-center, .flex-center-viewport, .flex-column, .flex-row — layout
- .m-*, .p-*, .gap-* (with side and axis variants) — spacing utilities on
the token scale
- .spacing-row / .spacing-card / .spacing-content, .margin-small /
.margin-large / .margin-landing families — responsive spacing utilities
- .grid, .grid-cols-*, .grid-auto-fit — responsive grid utilities
- .hide-* / .show-* — responsive visibility

Notes
- Container classes live in container-tokens.css.
- Spacing takes a utility or a token, never a literal. See RULES §2.
- Breakpoints are 500/1100. See RULES §9.
```

### The utility layer

This file is the reason most hand-written layout CSS is unnecessary. Spacing utilities follow
the token scale exactly — `.gap-200` is `gap: var(--spacing-200)` — so anywhere you were about
to write `style="gap: var(--spacing-200)"`, there is already a class.

| Need | Reach for |
|---|---|
| Gap between flex/grid children | `.gap-{25…900}`, or `.gap-x-*` / `.gap-y-*` for one axis |
| Gap between cards / list items | `.gap-card` |
| Gap between major page sections | `.gap-content` |
| Margin / padding | `.m-*` `.mb-*` `.mt-*` `.p-*` `.px-*` `.py-*` on the same scale |
| Page horizontal margin | `.margin-small` / `.margin-large` (RULES §9) |
| A column | `.flex-column` |
| A row | `.flex-row` |

**`.flex-center` centres in its parent; `.flex-center-viewport` centres in the viewport.**
Use the latter for a hero band, a login screen, or an empty state that owns the page — it is
the one that carries `min-height: 100vh`, so centring an icon in a row with `.flex-center`
never produces a viewport-tall element.

Two more things this file owns that are easy to miss: the CSS reset (so no normalize is
needed), and `.grid` / `.grid-auto-fit` for card grids.

### LAYOUT UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.flex-center` | display: flex; align-items: center; justify-content: center | — |
| `.flex-center-viewport` | display: flex; align-items: center; justify-content: center; min-height: 100vh | — |
| `.flex-column` | display: flex; flex-direction: column | — |
| `.flex-row` | display: flex; flex-direction: row | — |
| `.gap-lg` | gap: var(--spacing-300) | --spacing-300 |
| `.gap-md` | gap: var(--spacing-200) | --spacing-200 |
| `.gap-sm` | gap: var(--spacing-150) | --spacing-150 |
| `.gap-xl` | gap: var(--spacing-400) | --spacing-400 |
| `.gap-xs` | gap: var(--spacing-100) | --spacing-100 |

### SPACING UTILITIES - MARGIN

**Scales**

- `.m-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — margin: var(--spacing-25) *(smallest step shown)*
- `.mt-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — margin-top: var(--spacing-25) *(smallest step shown)*
- `.mb-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — margin-bottom: var(--spacing-25) *(smallest step shown)*
- `.ml-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — margin-left: var(--spacing-25) *(smallest step shown)*
- `.mr-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — margin-right: var(--spacing-25) *(smallest step shown)*
- `.mx-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — margin-left: var(--spacing-25); margin-right: var(--spacing-25) *(smallest step shown)*
- `.my-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — margin-top: var(--spacing-25); margin-bottom: var(--spacing-25) *(smallest step shown)*

| Class | Declares | Tokens |
|---|---|---|
| `.ml-auto` | margin-left: auto | — |
| `.mr-auto` | margin-right: auto | — |
| `.mx-auto` | margin-left: auto; margin-right: auto | — |

### SPACING UTILITIES - PADDING

**Scales**

- `.p-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — padding: var(--spacing-25) *(smallest step shown)*
- `.pt-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — padding-top: var(--spacing-25) *(smallest step shown)*
- `.pb-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — padding-bottom: var(--spacing-25) *(smallest step shown)*
- `.pl-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — padding-left: var(--spacing-25) *(smallest step shown)*
- `.pr-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — padding-right: var(--spacing-25) *(smallest step shown)*
- `.px-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — padding-left: var(--spacing-25); padding-right: var(--spacing-25) *(smallest step shown)*
- `.py-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — padding-top: var(--spacing-25); padding-bottom: var(--spacing-25) *(smallest step shown)*

### SPACING UTILITIES - GAP (Flexbox/Grid)

**Scales**

- `.gap-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — gap: var(--spacing-25) *(smallest step shown)*
- `.gap-y-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — row-gap: var(--spacing-25) *(smallest step shown)*
- `.gap-x-{25|50|100|150|200|250|300|400|500|600|700|800|900}` — column-gap: var(--spacing-25) *(smallest step shown)*

### RESPONSIVE SPACING UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.gap-card` | gap: var(--spacing-card) | --spacing-card |
| `.gap-content` | gap: var(--spacing-content) | --spacing-content |
| `.gap-row` | gap: var(--spacing-row) | --spacing-row |
| `.gap-x-card` | column-gap: var(--spacing-card) | --spacing-card |
| `.gap-x-content` | column-gap: var(--spacing-content) | --spacing-content |
| `.gap-x-row` | column-gap: var(--spacing-row) | --spacing-row |
| `.gap-y-card` | row-gap: var(--spacing-card) | --spacing-card |
| `.gap-y-content` | row-gap: var(--spacing-content) | --spacing-content |
| `.gap-y-row` | row-gap: var(--spacing-row) | --spacing-row |
| `.margin-landing` | margin: var(--margin-landing) | --margin-landing |
| `.margin-large` | margin: var(--margin-large) | --margin-large |
| `.margin-small` | margin: var(--margin-small) | --margin-small |
| `.mb-card` | margin-bottom: var(--spacing-card) | --spacing-card |
| `.mb-content` | margin-bottom: var(--spacing-content) | --spacing-content |
| `.mb-landing` | margin-bottom: var(--margin-landing) | --margin-landing |
| `.mb-large` | margin-bottom: var(--margin-large) | --margin-large |
| `.mb-row` | margin-bottom: var(--spacing-row) | --spacing-row |
| `.mb-small` | margin-bottom: var(--margin-small) | --margin-small |
| `.ml-landing` | margin-left: var(--margin-landing) | --margin-landing |
| `.ml-large` | margin-left: var(--margin-large) | --margin-large |
| `.ml-small` | margin-left: var(--margin-small) | --margin-small |
| `.mr-landing` | margin-right: var(--margin-landing) | --margin-landing |
| `.mr-large` | margin-right: var(--margin-large) | --margin-large |
| `.mr-small` | margin-right: var(--margin-small) | --margin-small |
| `.mt-card` | margin-top: var(--spacing-card) | --spacing-card |
| `.mt-content` | margin-top: var(--spacing-content) | --spacing-content |
| `.mt-landing` | margin-top: var(--margin-landing) | --margin-landing |
| `.mt-large` | margin-top: var(--margin-large) | --margin-large |
| `.mt-row` | margin-top: var(--spacing-row) | --spacing-row |
| `.mt-small` | margin-top: var(--margin-small) | --margin-small |
| `.mx-landing` | margin-left: var(--margin-landing); margin-right: var(--margin-landing) | --margin-landing |
| `.mx-large` | margin-left: var(--margin-large); margin-right: var(--margin-large) | --margin-large |
| `.mx-small` | margin-left: var(--margin-small); margin-right: var(--margin-small) | --margin-small |
| `.my-card` | margin-top: var(--spacing-card); margin-bottom: var(--spacing-card) | --spacing-card |
| `.my-content` | margin-top: var(--spacing-content); margin-bottom: var(--spacing-content) | --spacing-content |
| `.my-landing` | margin-top: var(--margin-landing); margin-bottom: var(--margin-landing) | --margin-landing |
| `.my-large` | margin-top: var(--margin-large); margin-bottom: var(--margin-large) | --margin-large |
| `.my-row` | margin-top: var(--spacing-row); margin-bottom: var(--spacing-row) | --spacing-row |
| `.my-small` | margin-top: var(--margin-small); margin-bottom: var(--margin-small) | --margin-small |
| `.pb-card` | padding-bottom: var(--spacing-card) | --spacing-card |
| `.pb-content` | padding-bottom: var(--spacing-content) | --spacing-content |
| `.pb-landing` | padding-bottom: var(--margin-landing) | --margin-landing |
| `.pb-large` | padding-bottom: var(--margin-large) | --margin-large |
| `.pb-row` | padding-bottom: var(--spacing-row) | --spacing-row |
| `.pb-small` | padding-bottom: var(--margin-small) | --margin-small |
| `.pl-landing` | padding-left: var(--margin-landing) | --margin-landing |
| `.pl-large` | padding-left: var(--margin-large) | --margin-large |
| `.pl-small` | padding-left: var(--margin-small) | --margin-small |
| `.pr-landing` | padding-right: var(--margin-landing) | --margin-landing |
| `.pr-large` | padding-right: var(--margin-large) | --margin-large |
| `.pr-small` | padding-right: var(--margin-small) | --margin-small |
| `.pt-card` | padding-top: var(--spacing-card) | --spacing-card |
| `.pt-content` | padding-top: var(--spacing-content) | --spacing-content |
| `.pt-landing` | padding-top: var(--margin-landing) | --margin-landing |
| `.pt-large` | padding-top: var(--margin-large) | --margin-large |
| `.pt-row` | padding-top: var(--spacing-row) | --spacing-row |
| `.pt-small` | padding-top: var(--margin-small) | --margin-small |
| `.px-landing` | padding-left: var(--margin-landing); padding-right: var(--margin-landing) | --margin-landing |
| `.px-large` | padding-left: var(--margin-large); padding-right: var(--margin-large) | --margin-large |
| `.px-small` | padding-left: var(--margin-small); padding-right: var(--margin-small) | --margin-small |
| `.py-card` | padding-top: var(--spacing-card); padding-bottom: var(--spacing-card) | --spacing-card |
| `.py-content` | padding-top: var(--spacing-content); padding-bottom: var(--spacing-content) | --spacing-content |
| `.py-landing` | padding-top: var(--margin-landing); padding-bottom: var(--margin-landing) | --margin-landing |
| `.py-large` | padding-top: var(--margin-large); padding-bottom: var(--margin-large) | --margin-large |
| `.py-row` | padding-top: var(--spacing-row); padding-bottom: var(--spacing-row) | --spacing-row |
| `.py-small` | padding-top: var(--margin-small); padding-bottom: var(--margin-small) | --margin-small |
| `.spacing-card` | gap: var(--spacing-card) | --spacing-card |
| `.spacing-content` | gap: var(--spacing-content) | --spacing-content |
| `.spacing-row` | gap: var(--spacing-row) | --spacing-row |

### RESPONSIVE GRID UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.grid` | gap: var(--spacing-300); display: grid | --spacing-300 |
| `.grid-auto-fit` | gap: var(--spacing-300); display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)) | --spacing-300 |
| `.grid-cols-1-mobile` | *contextual — styled via a parent* | — |
| `.grid-cols-2-desktop` | *contextual — styled via a parent* | — |
| `.grid-cols-2-tablet` | *contextual — styled via a parent* | — |
| `.grid-cols-3-desktop` | *contextual — styled via a parent* | — |
| `.grid-cols-3-tablet` | *contextual — styled via a parent* | — |
| `.grid-cols-4-desktop` | *contextual — styled via a parent* | — |

### RESPONSIVE UTILITIES

| Class | Declares | Tokens |
|---|---|---|
| `.hide-desktop` | *contextual — styled via a parent* | — |
| `.hide-mobile` | *contextual — styled via a parent* | — |
| `.hide-mobile-tablet` | *contextual — styled via a parent* | — |
| `.hide-tablet` | *contextual — styled via a parent* | — |
| `.hide-tablet-desktop` | *contextual — styled via a parent* | — |
| `.show-desktop` | *contextual — styled via a parent* | — |
| `.show-mobile` | *contextual — styled via a parent* | — |
| `.show-tablet` | *contextual — styled via a parent* | — |

---

## platform-tokens.css

```
platform-tokens.css
The web/app platform switch: phone frame, iOS system chrome, safe-area tokens and review chrome.

What's inside
- --safe-area-top, --safe-area-bottom, --ios-tab-bar-clearance — safe-area insets
- [data-platform="app"] backdrop and phone frame (393×852, iPhone 15 Pro)
- .ios-status-bar, .ios-safe-area-top, .ios-home-indicator, .ios-content —
iOS system chrome
- .app-device-controls (+ .device-control-label, .mode-toggle) — app-mode
theme/mode controls in the Dynamic Island
- .template-fab*, .template-platform-link — the web review chrome injected
by prototype-harness.js

Notes
- Set data-platform="web" (default) or "app" on <html>. See RULES §1.
- In app mode <html> is the backdrop and <body> is the phone screen, so
position: sticky anchors to the body scroll container — correct for
in-phone navigation.
- Safe areas are 0px on web; below 500px the frame disappears and content
goes full-bleed. See RULES §9.
```

### Tokens


| Token | Scope | Example value |
|---|---|---|
| `--ios-tab-bar-clearance` | global, per platform | 0px |
| `--safe-area-bottom` | global, per platform | 0px |
| `--safe-area-top` | global, per platform | 0px |

### iOS SYSTEM CHROME — STATUS BAR

| Class | Declares | Tokens |
|---|---|---|
| `.ios-safe-area-top` | height: var(--safe-area-top); flex-shrink: 0 | --safe-area-top |

### iOS SYSTEM CHROME — HOME INDICATOR

| Class | Declares | Tokens |
|---|---|---|
| `.ios-home-indicator` | background: transparent; height: 34px; display: flex; position: absolute; bottom: 0; +7 more | --neutral-1000 |

### APP PLATFORM — DEVICE CONTROLS

| Class | Declares | Tokens |
|---|---|---|
| `.app-device-controls` | display: none | --white-100, --white-1000, --white-300, --border-weight-200, … |
| `.device-control-label` | *contextual — styled via a parent* | --white-1000, --white-300 |
| `.mode-toggle` | *contextual — styled via a parent* | --white-300, --white-1000, --white-200 |

### PROTOTYPE REVIEW CHROME

| Class | Declares | Tokens |
|---|---|---|
| `.open` | *contextual — styled via a parent* | — |
| `.template-fab` | position: fixed; bottom: var(--spacing-300); right: var(--spacing-300); z-index: 99999 | --spacing-300 |
| `.template-fab-link` | color: var(--text-secondary); gap: var(--spacing-100); display: flex; align-items: center; justify-content: space-between; +6 more | --spacing-100, --spacing-50, --spacing-75, --border-weight-100, … |
| `.template-fab-panel` | background: var(--bg-surface); gap: var(--spacing-100); padding: var(--spacing-150); border-radius: var(--border-radius-200); border: var(--border-weight-100) solid var(--neutral-200); +8 more | --spacing-100, --spacing-700, --spacing-150, --bg-surface, … |
| `.template-fab-trigger` | color: var(--text-secondary); background: var(--bg-surface); border-radius: 50%; border: var(--border-weight-100) solid var(--neutral-200); height: 48px; +8 more | --border-weight-100, --neutral-200, --bg-surface, --text-secondary, … |
| `.template-platform-link` | color: var(--text-secondary); background: var(--bg-surface); gap: var(--spacing-75); padding: var(--spacing-100) var(--spacing-200); border-radius: 100px; +10 more | --spacing-300, --spacing-75, --spacing-100, --spacing-200, … |

