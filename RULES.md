# Rules

Absolute constraints for building on this design system. Short by design: keep
this loaded, and reach for the deeper files only when you need them.

Three things in this system are normative, and they do different jobs:

| Source | Authority over | How it binds you |
|---|---|---|
| `RULES.md` | what to do and not do | you read it |
| `css/*.css` (indexed in `docs/css-api.md`) | what exists at all | a class you invent doesn't work |
| `npm run lint` | the rules below that can be checked statically | the build fails |

This file is the prose layer, and the **only** place a prose rule is written —
every other document cites a section here (`RULES §3`) instead of restating it.
But the CSS is a rule too: the class surface is the boundary of what you may
use. And eighteen checks below are executable (`node scripts/lint.mjs --rules`),
which is the only form a rule reliably survives in.

**Where this file and the CSS disagree, the CSS wins** — it is what ships.
Report the discrepancy; don't code around it.

Section numbers are stable — add to a section, never renumber.

| Need | File |
|---|---|
| What exists, by layer, and what React covers | `docs/inventory.md` — generated |
| Every class and token the system ships | `docs/css-api.md` — generated, complete |
| How a component composes, worked examples | `docs/design-guide.md` |
| How parts assemble into a screen | `demo/` — thirteen live sheets of every class |
| Authoring a theme | `docs/theming.md` |
| What the system cannot yet do | `docs/roadmap.md` |
| Check your work | `npm run lint`, then `npm run check` |

If a class is not in `css-api.md`, **it does not exist**. Do not invent one.
`npm run lint` is what catches you: an unknown class is an error, by name.

---

## 1. Setup

Three attributes on `<html>` drive everything:

```html
<html data-theme="signal" data-mode="dark" data-platform="web">
```

- `data-theme` — a theme slug from `css/themes.css`: `ink` `signal` `moss`
  `ember` `violet`. **Optional** — omit it and the base theme in
  `design-tokens-master.css` applies, so the token set is never half-defined.
  Adding your own: `docs/theming.md`.
- `data-mode` — `light` | `dark`
- `data-platform` — `web` (responsive) | `app` (393×852 phone frame, see §9)

A fourth is optional:

- `data-display-font` — a face slug from `css/display-fonts.css`, to swap the
  display typeface without touching the theme. 145 are shipped; `fonts/catalog.json`
  lists them.

Load the system with two script tags. Never hand-write `<link>` tags for CSS —
`crnl-loader.js` owns the order, and a hand-written list has been wrong every time.

```html
<script src="../css/crnl-loader.js"></script>
<script src="../css/prototype-harness.js"></script>
```

`prototype-harness.js` injects the theme/mode switcher. Never paste that chrome
into a page.

That is the whole `<head>`. **Never add a font `<link>`** — Inter and the icon
font ship in `fonts/` and are declared in `ui-fonts.css`, so a page renders the
same offline as online. An icon outside the shipped subset renders as its own
letters; `npm run check:icons` catches that, and `npm run build:ui-fonts`
re-cuts the font.

---

## 2. Never

- **Never hardcode a colour.** No `#hex`, no `rgb()`, no `rgba()`. Use a semantic
  token. A literal inside `var(--token, …)` as a fallback is fine.
- **Never set `font-size`, `font-weight`, or `line-height`.** Use a text class.
- **Never force letter case.** No `text-transform`, and no `TEXT TYPED IN CAPS`.
  Case belongs to the copy and to the theme's display font, which bakes it in
  (§5) — a `text-transform: uppercase` shouts in every theme whose display face
  does not render caps, and it does it in every mode and every theme at once.
  Every text class sets `text-transform: none` for this reason. There are no case utilities; `.text-uppercase`, `.text-lowercase`,
  `.text-capitalize` and `.text-normal-case` were removed on 2026-09-10.
- **Never hardcode spacing** in `px`/`em`/`rem`. Use a spacing token or utility.
- **Never write `:hover` or `:active`** on an interactive element. `.surface-*`
  and `.scale-*` **are** the hover and press mechanism: the surface carries the
  themed fill and border across default, hover and pressed; the scale carries
  the transform. Pair one of each on the same element. The scale number is the
  **size of the object, not the size of the movement** — small things move more
  so the motion reads the same at every size: `300` chips and circle buttons
  (±3.5%), `500` buttons (±2.5%), `700` cards and rows (±1%). `.btn` and
  `.btn-circle` already carry their tier internally — never add a `.scale-*`
  to one. Choosing among the 15 surfaces
  (`fill`/`border`/`wash`/`ghost`/`card`/`section` × `Neutral`/`Black`/`White`/
  `Inverted`/`Color`) is a table in `css-api.md § interactive-tokens.css`, and
  the per-surface detail is in that file's own comments. `.surface-section` is
  the one to read before using: it describes *where a thing sits*, not how it
  looks, and it only works inside a card that is already divided by hairlines.
- **Never put a border on a card.** `--bg-surface` against `--bg-base` is the edge.
- **Never give a photo a fixed height, or its own radius.** A media band is
  sized by ratio — `.card-media` (16/9), `.card-media-tall`, `.card-media-square`
  — because a `height: 144px` that reads as a photo on a phone is a letterbox
  slot on a web card. And the card already clips its children, so a radius on
  the image nests a second curve inside the card's and notches the corners.
- **Never give a component an outer margin.** A component spaces its own
  contents; the container decides how far it sits from its neighbours. A
  `margin-top` that exists to separate a component from whatever precedes it
  stacks on the container's padding and unbalances the section.
- **Never sit a solid surface on another solid surface.** Elevation is a
  ladder: `--bg-base` (page) → `--bg-surface` (cards) → `--bg-sheet` (modals).
  A card only reads against base — on another surface it becomes one
  indistinguishable slab. On top of a surface, use the alpha washes
  (`.surface-wash*`) or step up to `--bg-sheet`; never a second `--bg-surface`.

  **The ladder has three rungs in dark and two in light.** In every shipped
  theme and in the base theme, `--org-sheet` equals `--org-base`, so light
  mode runs white → a tinted surface → white again: a modal sheet is the same
  colour as the page behind it, and its **shadow is the only edge it has**.
  Dark runs three genuinely distinct values and carries elevation in colour.
  Both are deliberate. What follows from it is that a light-mode sheet must
  keep its shadow — it is structural there, not decoration — while in dark the
  shadow contributes almost nothing and the surface step does the work.

  **This applies to the classes, not just the tokens**, and that is how the
  rule is usually broken: `.surface-card`, `.card-closed`, `.tile`,
  `.split-row` and `.row-card` all paint `--bg-surface` at rest, so putting
  any of them inside any other one is the same mistake written a different
  way. So is putting one inside a container whose own CSS sets
  `background: var(--bg-surface)` — which is the version that slips through,
  because the parent carries no design system class at all.

  It fails in a particular way that makes it easy to miss while building: the
  inner element is **invisible at rest** and only appears when you hover or
  press it. The author, who is interacting with it, sees a working component.
  Everyone else sees a blank box. Two things check this for you — the lint rule
  `surface-on-surface`, which reads the markup and knows which classes paint a
  surface because it derives that from the CSS, and the harness, which compares
  what the browser actually painted and warns in the console on every prototype
  (`?surfaces=show` outlines the offenders).
- **Never use a bare `<button>`, `<select>` or `<input>`** without its design
  system wrapper. Demos and utility controls are not exempt. Every `<button>`
  carries a design system class — `.btn`, an `.ios-*` control, or a named
  use-case component like `.action-tile`.
- **Never use `--brand-interactive` or `--brand-inverted` in a component.** They
  are theme-scoped only — one value per theme, the same in light and dark — so
  they render dark-on-dark in one mode. The mode-aware pair is
  `--color-interactive` / `--color-inverted`: identical in light, swapped in
  dark. Links, active states, focus rings and accents take `--color-*`.
- **Never put a button, or a second section, inside a card that is itself the
  tap target.** If the card carries a `.surface-*` + `.scale-*` pair, the whole
  card is the target — a button inside it is a target inside a target, and
  multiple sections imply parts you can hit separately when you cannot. Pick
  one: the card is tappable and holds a single block of content, or the card is
  inert and the buttons inside it do the work. The same either/or the tile has
  always had (`design-guide § Tile`), and it applies to every card.
- **Never mix content shapes in one set.** Every tile in a grid or carousel
  carries the same slots — the same presence or absence of a price, a tag, a
  button. Mixed compositions stretch to a common height and leave a grey void
  under the shorter ones, which reads as a loading failure. If two things do
  not have the same shape, they do not belong in the same set.
- **Never inset a divider inside a card, and never stack rows with nothing
  between them.** A hairline that stops short of the card's edges reads as a
  mistake; put the padding on the row and the border under it, which is what
  `.list-divided` does. Rows that are neither divided nor spaced slam together
  into one block — use `.list-divided`, or `.list-gap` / `.list-gap-tight`.
  Card sections take **square** padding: less room above and below than at the
  sides reads as squeezed.
- **Never hardcode content** — names, dates, prices, fixtures. See §6.
- **Never use a pattern the system did not give you.** Every rule above governs
  the *materials* — the colours, the type, the spacing. This one governs the
  *shape*. A pattern can be built from nothing but legal tokens and still be
  foreign: the accent bar down the side of a callout that prompted this rule
  was token-perfect, passed every check in this file, and is still not a thing
  this system has.

  These arrive as **defaults rather than decisions**, which is what makes them
  hard to catch. They are the usual way to draw the thing, so they never feel
  like a choice and never get checked against the system.

  **Name the need, then search for it.** The error is reaching for a remembered
  shape before naming what it is for. "An accent bar" is a shape; "set this
  block apart from the body copy" is a need — and the system meets that need
  with the elevation ladder. So that was never a gap, just a shape nobody
  checked. Search `docs/css-api.md` and `demo/` for the need, not the shape.

  **The exception is a need the system cannot meet — not a shape you did not
  look for.** When nothing in the system serves the need, build it from tokens
  and primitives only, and **say so**: name the new pattern and offer the two
  options in `CLAUDE.md § New patterns`. Flagging it is what
  makes it allowed; building it quietly is what this rule forbids.

  Known offenders — no exception, the system already serves the need:
  - a partial or accent border down one side of a card, callout or quote

- **Never use `!important`.** The system ships in cascade layers, so anything
  you write outside them already beats all of it — a rule in a later layer
  wins whatever the specificity. That leaves exactly one thing `!important`
  can still beat: an inline style. If that is not what you are fighting,
  remove it; and if it is, remove the inline style instead where you can.
  Six remain in the whole system, each with a written reason.

---

## 3. Decision gate

Before writing any CSS, walk this list. Stop at the first match.

1. Button → `.btn` + type + size
2. List row → `.list-row` three-slot structure
3. Selectable row → `.selector.surface-washNeutral.scale-500` around a `.list-row`
4. Card in a grid or carousel → `.tile`
5. Text input → `.input-field`
6. Select → `.input-field.input-select`
7. Tag or chip → `.tag`
8. Switch → `.switch > input + label`
9. Card → `.card-closed`, or a surface token
10. Recurring product layout → `product-patterns.css` (`.context-header`,
    `.row-card`, `.action-row`, `.action-tile`, `.heading-select`,
    `.disclosure-toggle`, `.section-heading`, `.link`, `.circle-icon`)
11. Reproducing OS chrome (Apple Wallet, store badges) → `system-ui.css`
12. Type → a text class
13. Spacing → a token or utility
14. Anything tappable → `.surface-*` + `.scale-*`. Two things take a surface
    and **no** scale: a row on its own, because scaling one row of a stack
    looks wrong, and one band of a card divided by hairlines, which takes
    `.surface-section` — scaling it would detach it from the card it is part of.

    **The pair goes on a `<button>` or an `<a>`.** A `<div>` with a surface is
    not focusable, not announced and not operable by keyboard, so a tappable
    `<div>` is a target nobody can reach — and it fails silently, because the
    page looks correct in every screenshot. Where the element genuinely cannot
    be either, it carries both a `role` and `tabindex="0"`.

    Every surface in the ladder draws a focus ring on `:focus-visible`, and the
    component classes set their own `display` and `width`, so a `<button>` lays
    out identically to the `<div>` it replaces. There is no cost to getting
    this right. `npm run lint` fails a surface + scale pair on anything a
    keyboard cannot reach (`unreachable-target`).
15. None of the above → minimal custom CSS, tokens only

---

## 4. Canonical forms

One correct way to write each of these. `npm run lint` checks the icon forms
and the button's scale tier; the rest are conventions it cannot yet see.

| Thing | Form |
|---|---|
| Standalone icon | `<span class="icon icon-{50\|100\|200\|300\|400\|500\|600\|700}">name</span>` |
| Icon in a button | `<span class="btn-icon material-symbols-rounded">name</span>` |
| Button | `<button class="btn btn-{type} btn-{100\|300\|700}">` |
| Label + sublabel | `.card-text-pair`, or `.list-row-text-pair` inside a list row |
| Page width | a `.container*` class — never a hand-rolled `max-width` |

Icons are **filled** by default (`.icon`, `.icon-*`, `.btn-icon`). Add
`.icon-outlined` to opt one out. Never add `material-symbols-rounded` next to
`.icon` — `.icon` already sets the font family.

---

## 5. Type

Four families. Pick the family, then the step.

| Family | Font | Use for |
|---|---|---|
| `.display*` | the theme display face | screen titles, brand name, big numbers |
| `.title*` | Inter 700 | section headings |
| `.label*` | Inter 400/600, tight leading | UI text — buttons, rows, tags |
| `.body*` | Inter 400/600, loose leading | sentences meant to be read |

`.label*` vs `.body*` is the choice people get wrong: anything that wraps and is
*read* takes `.body*`; anything on one line inside a control takes `.label*`.
`Bold`/`Regular` is weight, the number is size. Colour is a separate class
(`.text-secondary`, `.text-brand-core`) — never override it inline.

**Stepping type down on mobile** is a `-r` pair, not a media query. `.title50-r`
is 20px/700 on desktop and 16px/600 below 500px. Adding a `font-size` override
in a template is always wrong; add a pair to `text-styles-system.css` instead.

**Text over an image** uses `.text-on-scrim` colours: `var(--white-1000)` for
primary, `var(--white-700)` for secondary. See §8.

**Write display text in title case.** A caps face has it baked into the font. Hardcoding `"BUY"` breaks every theme on a non-caps face. Write `"Buy"`.
Reaching for `text-transform` instead of typing the caps is the same mistake
one layer down, and is forbidden for the same reason (§2).

---

## 6. Data — never hardcoded

This repository ships the design system, not a content layer. A project that
builds on it supplies its own — a JSON file, a CMS, an API, whatever fits — and
the rules below govern how a screen reaches for it. They are the same rules
whether the data is real or fixture.

- **No content string is typed into markup that a data source owns.** Names,
  venues, dates, prices, scores, counts. A screen that hardcodes one renders
  correctly exactly once and then lies.
- **Never hardcode a colour, logo or mark belonging to an entity in the data.**
  Those travel with the record, set inline from it (`--badge-bg`), never written
  into a stylesheet.
- **References, not copies.** An entity appears in one place and everything else
  points at it by id. Copying a name or a colour into a second file is how the
  two drift.
- **Images are ids resolved by the loader**, never paths typed into markup — one
  base URL should repoint every image in the project.
- **Derive totals, never type them.** A quantity times a rate is computed at
  render. Two checkout screens once carried different fee rates because both
  were hand-entered.
- **The literal in the markup is the pre-JS state**, and it is generated from
  the data, not authored. A hand-edited default is how a stale name spreads
  through a screen library.

Persona fixtures — order ids, card last-4, balances, the buyer's name — are not
entity data. Those may be literals, and should be obviously synthetic: use
`example.com` addresses and the reserved `555-01xx` phone range.

**A display font and its ramp travel together.** Each face has its own cap
height, so the nine `--display-size-*` steps are tuned per face and a size that
exceeds its fixed line height is silently dropped on iOS (§5). Take a whole
block from `css/display-fonts.css`; never swap `--display-font` alone.

---

## 7. System UI — the one exemption

`system-ui.css` holds controls specified by Apple or Google that a prototype
*reproduces* rather than designs — the Add to Apple Wallet button today. Inside
that file the rules are suspended on purpose: vendor colours as literals, vendor
type, no response to theme or mode. Theming an Apple button to the theme's brand
would make it wrong.

That exemption is bounded. If you cannot point at a published vendor guideline,
it is a product component — use `.btn`. Never claim the exemption inside a
template; the file is the exemption.

---

## 8. Scrims

Text over a photograph needs a scrim. Flat scrims are the existing alpha scales
— there is no separate scrim palette:

| Need | Use |
|---|---|
| Light wash over a brand panel | `var(--black-300)` |
| Standard bed for text on a photo | `var(--black-500)` |
| Heavy, for body copy on a busy image | `var(--black-700)` |
| Secondary text sitting on a scrim | `var(--white-700)` |
| Primary text sitting on a scrim | `var(--white-1000)` |

Gradients are tokens, because a scale can't express them:
`.scrim-image` (bottom-up black fade) and `.scrim-brand` (fades into the theme's
dark brand colour). Scrims are **mode-stable** — a photo needs the same
darkening in light mode as in dark. Never wrap one in a `[data-mode]` block.

---

## 9. Responsive

Every page works at all three sizes or it is not done.

- **mobile** `<500px` · **tablet** `500–1099px` · **desktop** `≥1100px`
- `--spacing-content` between major sections; `--spacing-card` between cards
- `--margin-small` / `--margin-large` for page padding — never a fixed value
- Never cap a layout at phone width. `max-width: 430px` is a bug.
- On tablet and up, multi-column layouts are usually correct.

App mode gives `--safe-area-top` (59px) and `--safe-area-bottom` (34px), both
`0px` on web. Below 500px the phone frame disappears and content goes full-bleed.

---

## 10. Before you finish

- [ ] `npm run lint` passes — it names the section for every finding
- [ ] `npm run check` passes (it runs the linter first)
- [ ] Works in light **and** dark
- [ ] Works on at least two themes — check one on a caps display face and one
      on a face that renders as drawn
- [ ] Works at all three breakpoints
- [ ] No content string typed into the file (§6)
