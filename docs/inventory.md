# Inventory

> **Generated file — do not edit.** Produced by `npm run build:inventory` from
> `docs/css-api.json`, `src/components/`, `src/index.ts` and `demo/*.html`.
>
> This answers *what exists*, at a glance. `docs/css-api.md` is the exhaustive
> per-class reference; `docs/design-guide.md` explains when to reach for each
> thing. Read `docs/inventory.json` instead of this file if you are an agent —
> same content, nothing to parse.

**737 classes and 227 tokens across 26 stylesheets, shown live on 14 demo sheets, with 18 React components over the top.**

## The two layers

The CSS is the system. The React library is a typed convenience over part of
it — not a parity target, and not a prerequisite. Anything with no React
component is markup plus classes, which is the normal way to use this.

| | Count | Covered by React |
|---|---:|---:|
| token | 81 | 0 (0%) |
| primitive | 404 | 35 (9%) |
| component | 223 | 141 (63%) |
| pattern | 14 | 0 (0%) |
| vendor | 4 | 0 (0%) |
| platform | 11 | 0 (0%) |

## Stylesheets

In load order. `crnl-loader.js` owns that order (`RULES §1`).

| # | Stylesheet | Layer | Classes | Tokens | React | Covers |
|---:|---|---|---:|---:|---:|---|
| 1 | `reset.css` | component | — | — | — | The element layer: the box-sizing reset, the document defaults, and the |
| 2 | `design-tokens-master.css` | token | — | 105 | — | Colour, in both modes, plus the base theme |
| 3 | `themes.css` | token | — | 33 | — | The five shipped themes |
| 4 | `spacing-tokens.css` | token | 3 | 40 | 0/3 | The 8px scale and its utilities |
| 5 | `container-tokens.css` | token | 8 | 7 | 0/8 | Content widths and page padding |
| 6 | `border-effects-tokens.css` | token | 70 | 15 | 0/70 | Radius, border weight, shadow, scrim |
| 7 | `ui-fonts.css` | token | — | — | — | The UI and icon faces |
| 8 | `fonts.css` | token | — | — | — | Every shipped display face |
| 9 | `display-fonts.css` | token | — | 12 | — | A tuned display ramp per face |
| 10 | `text-styles-system.css` | primitive | 35 | — | 8/35 | The type scale |
| 11 | `icons.css` | primitive | 11 | 8 | 11/11 | The icon system |
| 12 | `card-components.css` | component | 27 | — | 14/27 | Cards, tiles, media bands |
| 13 | `interactive-tokens.css` | primitive | 16 | — | 15/16 | Surfaces and scales — the press mechanism |
| 14 | `button-components.css` | component | 36 | — | 36/36 | Buttons |
| 15 | `system-ui.css` | vendor | 4 | — | 0/4 | Vendor chrome — exempt by RULES §7 |
| 16 | `list-row-components.css` | component | 46 | 1 | 24/46 | The list row and everything on it |
| 17 | `table-components.css` | component | 17 | 1 | 0/17 | The stat table |
| 18 | `input-components.css` | component | 16 | — | 14/16 | Text input and select |
| 19 | `tag-chip-components.css` | component | 7 | — | 7/7 | Tags and chips |
| 20 | `nav-components.css` | component | 26 | — | 23/26 | Top bar, tabs, steps, page header |
| 21 | `ios-nav-components.css` | component | 33 | 2 | 23/33 | iOS chrome for app mode |
| 22 | `web-footer-components.css` | component | 15 | — | 0/15 | The site footer |
| 23 | `product-patterns.css` | pattern | 14 | — | 0/14 | Composite layouts above the component layer |
| 24 | `boilerplate.css` | primitive | 342 | — | 1/342 | Reset, element defaults, layout utilities |
| 25 | `platform-tokens.css` | platform | 11 | 3 | 0/11 | The web/app switch and the phone frame |
| 26 | `crnl-layers.css` | component | — | — | — | The stylesheets, each imported into its cascade layer. Import this from |

## React components

18 in `src/components/`, 18 exported from `src/index.ts`.
A component that is not exported cannot be imported from the package, whatever
else is true of it.

| Component | Exports | Stories | Renders | From |
|---|---|---|---:|---|
| `Button` | `Button` `CircleButton` | yes | 39 | `button`, `icons`, `list-row` |
| `Card` | `CardClosed` `CardOpen` `CardSection` | yes | 10 | `card` |
| `IOSHomeNav` | `IOSHomeNav` | yes | 7 | `ios-nav`, `text-styles-system` |
| `IOSModal` | `IOSModal` | yes | 9 | `ios-nav` |
| `IOSNavButton` | `IOSNavButton` | yes | 4 | `icons`, `ios-nav` |
| `IOSPageNav` | `IOSPageNav` | yes | 5 | `ios-nav` |
| `IOSTabBar` | `IOSTabBar` | yes | 6 | `icons`, `ios-nav` |
| `Icon` | `Icon` | yes | 10 | `icons` |
| `Input` | `Input` `Select` | yes | 16 | `icons`, `input`, `list-row` |
| `ListRow` | `ListRow` `TextPair` `TrailingText` `LeadingImage` `LeadingLogo` `CircleContainer` | yes | 17 | `boilerplate`, `list-row`, `text-styles-system` |
| `PageHeader` | `PageHeader` | yes | 8 | `boilerplate`, `card`, `nav`, `text-styles-system` |
| `Selector` | `Selector` | yes | 17 | `interactive-tokens`, `list-row` |
| `SplitRow` | `SplitRow` `SplitRowList` | yes | 17 | `boilerplate`, `interactive-tokens`, `list-row`, `text-styles-system` |
| `Steps` | `Steps` | yes | 9 | `icons`, `nav` |
| `Tabs` | `Tabs` | yes | 4 | `nav` |
| `Tag` | `Tag` `Chip` | yes | 26 | `icons`, `interactive-tokens`, `list-row`, `tag-chip` |
| `Tile` | `Tile` | yes | 5 | `card`, `interactive-tokens` |
| `TopBar` | `TopBar` | yes | 9 | `nav`, `text-styles-system` |

## Demo sheets

Every class rendered live, in the real CSS. Open `demo/index.html`.

| Sheet | Shows |
|---|---|
| [`01-color.html`](../demo/01-color.html) | Color |
| [`02-type.html`](../demo/02-type.html) | Type |
| [`03-space.html`](../demo/03-space.html) | Space & Layout |
| [`04-buttons.html`](../demo/04-buttons.html) | Buttons |
| [`05-surfaces.html`](../demo/05-surfaces.html) | Surfaces |
| [`06-cards.html`](../demo/06-cards.html) | Cards & Tiles |
| [`07-rows.html`](../demo/07-rows.html) | Rows, Tags & Controls |
| [`08-forms.html`](../demo/08-forms.html) | Forms |
| [`09-nav.html`](../demo/09-nav.html) | Nav & Patterns |
| [`10-tables.html`](../demo/10-tables.html) | Tables |
| [`11-ios-frame.html`](../demo/11-ios-frame.html) | iOS Chrome |
| [`11-ios.html`](../demo/11-ios.html) | iOS / App |
| [`index.html`](../demo/index.html) | Overview |
| [`qa.html`](../demo/qa.html) | Crnl QA Bench |

## What has no live specimen

321 class(es) appear by name on a sheet but have no live specimen —
legitimate for a utility scale, where 300 identical boxes would show less
than one listing. `npm run check:demo` is what holds the line.

- `boilerplate.css` — 282: `.flex-center` `.flex-center-viewport` `.flex-column` `.gap-xs` `.gap-sm` `.gap-md` `.gap-lg` `.gap-xl` `.m-25` `.m-50` `.m-100` `.m-150` …
- `border-effects-tokens.css` — 28: `.rounded-t-50` `.rounded-t-100` `.rounded-b-50` `.rounded-b-100` `.rounded-l-50` `.rounded-l-100` `.rounded-r-50` `.rounded-r-100` `.rounded-ss-50` `.rounded-ss-100` `.rounded-se-50` `.rounded-se-100` …
- `input-components.css` — 1: `.is-open`
- `ios-nav-components.css` — 1: `.ios-status-bar-modal`
- `platform-tokens.css` — 9: `.app-device-controls` `.device-control-label` `.mode-toggle` `.template-fab` `.template-fab-trigger` `.template-fab-panel` `.open` `.template-fab-link` `.template-platform-link`
