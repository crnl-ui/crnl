# Design Guide

Long-form reference for this design system: how each component composes,
which tokens it uses, worked examples, and what to do when something looks
wrong. Written for agents and humans alike; AI design tools read it too.

This file states no rules. **`RULES.md`** is the rules, numbered and stable —
every rule mentioned here is cited by section (`RULES §3`), never restated.
**`css-api.md`** is the complete surface, generated from the CSS: every class
and token that exists. If a class is not in `css-api.md`, it does not exist.

## Contents

- [Demo Sheets First](#demo-sheets-first)
- [Text Pairs](#text-pairs)
- [Buttons](#buttons)
- [List Rows](#list-rows)
- [Inputs](#inputs)
- [Interactive Surfaces](#interactive-surfaces)
- [Tile](#tile)
- [Stats Table](#stats-table)
- [Token Quick Reference](#token-quick-reference)
  - [Color](#color) · [Spacing](#spacing) · [Border and Radius](#border-and-radius) · [Containers](#containers) · [Scrims](#scrims)
- [Themes](#themes)
- [Data in Prototypes](#data-in-prototypes)
- [Anatomy of a Screen](#anatomy-of-a-screen)
- [Complete Component Examples](#complete-component-examples)
- [iOS App Platform](#ios-app-platform)
- [iOS Navigation](#ios-navigation)
- [React Library](#react-library)
- [Troubleshooting](#troubleshooting)
- [Contributing to the CSS](#contributing-to-the-css)

---

## Demo Sheets First

**Mental model:** this repository is the **parts list** — tokens, components,
primitives. `demo/` is every one of them rendered live, by the real CSS, at
every state and size. The component sections in this guide show one button, one
list row, one tile in isolation; a demo sheet shows the whole family side by
side, so "which surface, which scale, which gap" is a look rather than a guess.

Open `demo/index.html` and read the sheet for the thing you are building before
composing anything from primitives. Rebuilding something the system already has
is the most common failure mode (`RULES §2`).

When copying from a sheet: keep the composite class structure
(`.event-row-top`, `.surface-section`, the `.list-row` three slots,
`.card-text-pair`, `.card-media`, `.tile-info`, `.leading-logo`); swap only
content; keep `data-theme` / `data-mode` / `data-platform` on `<html>` and the
`../css/` loader path. When nothing in the system covers the pattern, build it
from the sections below and say so (`RULES §2`).

---

## Text Pairs

A label with a sublabel is always wrapped: `.card-text-pair` everywhere,
`.list-row-text-pair` inside a list row (`RULES §4`). Sublabels take
`.text-secondary`. Display text is written in title case — the display face
decides whether it renders as caps (`RULES §5`).

| Scale | Context | Label class | Sublabel class | Gap |
|---|---|---|---|---|
| 9000 | Hero / landing | `display600` | `labelRegular50` | 8px |
| 8000 | Page header | `display500` | `labelRegular40` | 8px |
| 7000 | Section header | `display400` | `labelRegular30` | 4px |
| 6000 | Component header | `display300` | `labelRegular20` | 2px |
| 5000 | Card header (most common) | `title50` | `labelRegular20` | 2px |
| 4000 | Small card | `labelBold40` | `labelRegular20` | 2px |
| 3000 | Dense / compact | `labelBold30` | `labelRegular10` | 2px |
| 2000 | Badges, small components | `labelBold20` | `labelRegular10` | 1px |
| 1000 | Inline metadata | `labelBold10` | `labelRegular10` | 1px |
| list-row | List rows only | `labelBold30` | `labelRegular10` | 2px |

The gap column is what the Figma Text Pair component specifies. `.card-text-pair`
is a 2px flex column; the larger pairs get their extra breathing room from the
line boxes of the display styles, so no margin class is needed in practice.

```html
<!-- Card header (5000) -->
<div class="card-text-pair">
  <h3 class="title50">Card Title</h3>
  <p class="labelRegular20 text-secondary">Metadata or date</p>
</div>

<!-- Hero (9000) -->
<div class="card-text-pair">
  <h1 class="display600">Hero Headline</h1>
  <p class="labelRegular50 text-secondary">Supporting message</p>
</div>

<!-- Section header (7000) -->
<div class="card-text-pair">
  <h2 class="display400">Upcoming Games</h2>
  <p class="labelRegular30 text-secondary">Next 7 days</p>
</div>

<!-- Small card (4000) -->
<div class="card-text-pair">
  <span class="labelBold40">Section 113</span>
  <span class="labelRegular20 text-secondary">Row F</span>
</div>

<!-- List row — list-row-text-pair, not card-text-pair -->
<div class="list-row-text-pair">
  <span class="labelBold30">Label</span>
  <span class="labelRegular10 text-secondary">Sublabel</span>
</div>
```

Use semantic elements where they make sense (`h1` for the page title, `h2` for
sections, `h3` for cards); the text class sets every visual property, so the
element choice is free. Stepping a pair down on mobile is a `-r` text class,
not a media query (`RULES §5`).

---

## Buttons

Compose `.btn` + type + size (`RULES §4`).

**Types**

| Class | Use |
|---|---|
| `.btn-transactional` | revenue actions — Buy, Purchase, Add to Cart |
| `.btn-primary` | the main page action; one per view |
| `.btn-neutral` | high-contrast, non-branded CTA |
| `.btn-secondary` | supporting action (outlined) |
| `.btn-tertiary` | low-emphasis inline (text only) |
| `.btn-destructive` | irreversible actions |
| `.btn-white` | CTA on dark or brand surfaces |
| `.btn-white-tertiary` | low-emphasis on dark surfaces |

**Sizes:** `.btn-700` (56px) · `.btn-300` (40px) · `.btn-100` (32px)
**Modifiers:** `.btn-fill` (full width) · `.btn-icon-leading` · `.btn-icon-trailing`
**Disabled:** the `disabled` attribute, not a class.

```html
<button class="btn btn-primary btn-300">Label</button>

<button class="btn btn-transactional btn-700 btn-icon-leading btn-fill">
  <span class="btn-icon material-symbols-rounded">confirmation_number</span>
  <span>Buy Tickets</span>
</button>

<button class="btn btn-primary btn-300 btn-icon-trailing">
  <span>Next</span>
  <span class="btn-icon material-symbols-rounded">arrow_forward</span>
</button>

<button class="btn btn-primary btn-300" disabled>Sold Out</button>

<div class="btn-group">
  <button class="btn btn-primary btn-300">Save</button>
  <button class="btn btn-secondary btn-300">Cancel</button>
</div>

<div class="btn-group-stack">
  <button class="btn btn-transactional btn-700">Buy Tickets</button>
  <button class="btn btn-secondary btn-700">Learn More</button>
</div>
```

`.btn-icon` sizes only the icon box; it still needs `material-symbols-rounded`
for the glyph (`RULES §4`).

### Circle buttons

`.btn-circle` + size + type, icon only.

- Sizes: `.btn-circle-700` (56×56, 32px icon) · `.btn-circle-300` (40×40, 24px icon)
- Filled: `.btn-circle-brand` · `.btn-circle-neutral` · `.btn-circle-inverted` · `.btn-circle-black` · `.btn-circle-white` · `.btn-circle-destructive`
- Outlined: `-secondary` suffix (`.btn-circle-neutral-secondary`)
- Ghost: `-tertiary` suffix (`.btn-circle-neutral-tertiary`)

```html
<button class="btn-circle btn-circle-300 btn-circle-neutral" aria-label="Close">
  <span class="btn-icon material-symbols-rounded">close</span>
</button>
```

---

## List Rows

Structure: `.list-row` > optional `.leading` + `.list-row-content` + optional
`.trailing`. All three slots are optional. Inside a row the text pair is
`.list-row-text-pair` (`RULES §4`).

**Leading gap** (leading element → content)

| Class | Gap | Pairs with |
|---|---|---|
| `.leading-gap-sm` | 8px | logos |
| `.leading-gap-md` | 12px | icons, circles, select boxes |
| `.leading-gap-lg` | 16px | `.leading-image-square`, `.leading-image-small` |
| `.leading-gap-xl` | 24px | `.leading-image-large` |

**Trailing gap** (content → trailing element)

| Class | Gap | Pairs with |
|---|---|---|
| `.trailing-gap-xs` | 2px | chevron / arrow icon |
| `.trailing-gap-sm` | 4px | text pair |
| `.trailing-gap-md` | 8px | text link, switch |
| `.trailing-gap-lg` | 12px | button, stepper |

**Row states:** default (tappable) · `.not-tappable` · `.disabled` (30% opacity)

### Leading content

```html
<!-- Icon -->
<div class="leading leading-gap-md">
  <span class="icon icon-200">notifications</span>
</div>

<!-- Circle icon -->
<div class="leading leading-gap-md">
  <div class="circle-container"><span class="icon icon-200">star</span></div>
</div>

<!-- Circle letter -->
<div class="leading leading-gap-md">
  <div class="circle-container"><span class="display100">A</span></div>
</div>

<!-- Status dot -->
<div class="leading leading-gap-md">
  <div class="status-dot"></div>        <!-- unread -->
  <div class="status-dot read"></div>   <!-- read -->
</div>

<!-- Square image 80×80 -->
<div class="leading leading-gap-lg">
  <img class="leading-image-square" src="…" alt="">
</div>

<!-- Small image 136×80 -->
<div class="leading leading-gap-lg">
  <img class="leading-image-small" src="…" alt="">
</div>

<!-- Large image 244×124 -->
<div class="leading leading-gap-xl">
  <img class="leading-image-large" src="…" alt="">
</div>

<!-- Brand logo 48×48 — no src, reads --brand-logo-url -->
<div class="leading leading-gap-sm">
  <div class="leading-logo" role="img" aria-label="Brand logo"></div>
</div>

<!-- Payment icon 33×24 -->
<div class="leading leading-gap-md">
  <img class="leading-payment" src="…" alt="">
</div>

<!-- Select box (multi-select / edit mode) -->
<div class="leading leading-gap-md">
  <div class="select-box"></div>
</div>
```

### Main content

`.list-row-content` stacks up to three blocks with an 8px gap, in this order:

1. `.list-row-text-pair` — always first
2. `.tag-group` > `.tag` — optional
3. `.info-block` > `.info-item` — optional; only an item with `.has-label` shows text

```html
<div class="list-row-content">
  <div class="list-row-text-pair">
    <span class="labelBold30">Event Name</span>
    <span class="labelRegular10 text-secondary">Sat, Mar 15 · 7:00 PM</span>
  </div>
  <div class="tag-group">
    <div class="tag tag-brand-color"><span class="labelBold20">VIP</span></div>
    <div class="tag"><span class="labelBold20">Floor</span></div>
  </div>
  <div class="info-block">
    <div class="info-item"><span class="icon icon-200">event_seat</span></div>
    <div class="info-item has-label">
      <span class="icon icon-200">confirmation_number</span>
      <span class="labelRegular10">2 tickets</span>
    </div>
  </div>
</div>
```

### Trailing content

```html
<!-- Chevron -->
<div class="trailing trailing-gap-xs">
  <span class="icon icon-200">chevron_right</span>
</div>

<!-- Text link -->
<div class="trailing trailing-gap-md">
  <span class="trailing-text-link labelBold20">View All</span>
</div>

<!-- Right-aligned text pair -->
<div class="trailing trailing-gap-sm">
  <div class="trailing-text-pair">
    <span class="labelBold20">$42.00</span>
    <span class="labelRegular10 text-secondary">Per ticket</span>
  </div>
</div>

<!-- Switch — input id must match label for -->
<div class="trailing trailing-gap-md">
  <div class="switch">
    <input type="checkbox" id="switch-1">
    <label for="switch-1"></label>
  </div>
</div>

<!-- Stepper — disabled is a class on .stepper-btn, not the attribute -->
<div class="trailing trailing-gap-lg">
  <div class="stepper">
    <button class="stepper-btn disabled"><span class="icon icon-200">remove</span></button>
    <span class="stepper-count labelBold50">0</span>
    <button class="stepper-btn"><span class="icon icon-200">add</span></button>
  </div>
</div>

<!-- Button -->
<div class="trailing trailing-gap-lg">
  <button class="btn btn-primary btn-100">Action</button>
</div>
```

### Tags

```html
<div class="tag"><span class="labelBold20">Default</span></div>
<div class="tag tag-brand-color"><span class="labelBold20">Brand</span></div>
<div class="tag tag-icon-leading">
  <span class="icon icon-200">flag</span><span class="labelBold20">Label</span>
</div>
<div class="tag tag-icon-trailing">
  <span class="labelBold20">Label</span><span class="icon icon-200">arrow_forward</span>
</div>
```

### Row container

A `.list-row` carries no padding and no divider; its container does. Two
containers, both correct — pick by whether the rows are bands of one card or
separate objects:

- **Divided** — `.list-divided`, for rows inside a card (settings, order
  details, seat inventory). It puts the padding on the row and the hairline
  under it, so the divider reaches both edges of the card. Padding is square.
- **Spaced** — `.list-gap-tight` (8px, compact lists like schedules) or
  `.list-gap` (16px, airier content lists) on a flex column. No wrapper needed.

```html
<div class="card-closed">
  <div class="list-divided">
    <div class="list-row surface-section">…</div>
    <div class="list-row surface-section">…</div>
  </div>
</div>
```

What you must not do is stack rows with neither, which slams them together
into one block, or wrap each row in a padded element of your own — that insets
the hairline so it stops short of the card's edges (`RULES §2`). The system
shipped `.list-divided` in September 2026 precisely because this guide used to
tell you to hand-roll a `.row-wrap`, and every screen hand-rolled it the same
wrong way.

And the bare row stays bare: never give `.list-row` itself padding, margins or
borders.

For a **selectable** row use `.selector` instead of a wrapper — see
[Selector](#selector-selectable-list-row).

---

## Inputs

Structure: `.input-field` > optional `.input-label-row` + `.input-and-message`
> `.input-control`. State classes go on `.input-field`: `.is-error` ·
`.is-disabled` · `.has-value`. Bare `<input>` and `<select>` never appear
without this wrapper (`RULES §2`).

```html
<!-- Basic -->
<div class="input-field">
  <div class="input-and-message">
    <div class="input-control">
      <input type="text" placeholder="Placeholder">
    </div>
  </div>
</div>

<!-- Label + leading icon -->
<div class="input-field">
  <div class="input-label-row">
    <label class="input-label" for="input-2">Email</label>
  </div>
  <div class="input-and-message">
    <div class="input-control">
      <span class="input-icon material-symbols-rounded">mail</span>
      <input type="email" id="input-2" placeholder="you@example.com">
    </div>
  </div>
</div>

<!-- Clear button -->
<div class="input-field" id="field-1">
  <div class="input-label-row">
    <label class="input-label" for="input-3">Search</label>
  </div>
  <div class="input-and-message">
    <div class="input-control">
      <input type="text" id="input-3" placeholder="Type to search"
        oninput="syncHasValue('field-1', this)">
      <button class="input-clear material-symbols-rounded" type="button"
        onclick="clearInput('field-1', 'input-3')">close</button>
    </div>
  </div>
</div>

<!-- Label link -->
<div class="input-field">
  <div class="input-label-row">
    <label class="input-label" for="input-4">Password</label>
    <a class="input-link" href="#">Forgot password?</a>
  </div>
  <div class="input-and-message">
    <div class="input-control">
      <input type="password" id="input-4" placeholder="Enter password">
    </div>
  </div>
</div>

<!-- Helper message -->
<div class="input-field">
  <div class="input-label-row">
    <label class="input-label" for="input-5">Username</label>
  </div>
  <div class="input-and-message">
    <div class="input-control">
      <input type="text" id="input-5" placeholder="@username">
    </div>
    <p class="input-message">Must be unique. Letters and numbers only.</p>
  </div>
</div>

<!-- Error -->
<div class="input-field is-error has-value">
  <div class="input-label-row">
    <label class="input-label" for="input-6">Email</label>
  </div>
  <div class="input-and-message">
    <div class="input-control">
      <span class="input-icon material-symbols-rounded">mail</span>
      <input type="email" id="input-6" value="not-an-email">
    </div>
    <p class="input-message">Please enter a valid email address.</p>
  </div>
</div>

<!-- Disabled -->
<div class="input-field is-disabled">
  <div class="input-label-row">
    <label class="input-label" for="input-7">Label</label>
  </div>
  <div class="input-and-message">
    <div class="input-control">
      <input type="text" id="input-7" placeholder="Placeholder" disabled>
    </div>
  </div>
</div>
```

### Select

Add `.input-select` to `.input-field`. The chevron is `arrow_drop_down`, never
`expand_more`. The native `<select>` sits invisibly over a display span that the
helpers keep in sync.

```html
<div class="input-field input-select" id="select-1">
  <div class="input-label-row">
    <label class="input-label" for="sel-1">Sport</label>
  </div>
  <div class="input-and-message">
    <div class="input-control">
      <span class="input-select-display is-placeholder" id="sel-1-display">Choose a sport</span>
      <span class="input-select-chevron material-symbols-rounded">arrow_drop_down</span>
      <select id="sel-1"
        onchange="syncSelect('select-1', 'sel-1-display', this)"
        onfocus="openSelect('select-1')"
        onblur="closeSelect('select-1')">
        <option value="" disabled selected>Choose a sport</option>
        <option value="basketball">Basketball</option>
        <option value="soccer">Soccer</option>
      </select>
    </div>
  </div>
</div>
```

### JS helpers

Include these whenever a page has a clear button or a select:

```javascript
function syncHasValue(fieldId, input) {
  document.getElementById(fieldId).classList.toggle('has-value', input.value.trim() !== '');
}
function clearInput(fieldId, inputId) {
  const field = document.getElementById(fieldId);
  const input = document.getElementById(inputId);
  input.value = '';
  field.classList.remove('has-value', 'is-error');
  const msg = field.querySelector('.input-message');
  if (msg) msg.hidden = true;
  input.focus();
}
function syncSelect(fieldId, displayId, selectEl) {
  const display = document.getElementById(displayId);
  const chosen = selectEl.options[selectEl.selectedIndex];
  display.textContent = chosen.text;
  display.classList.toggle('is-placeholder', !chosen.value);
}
function openSelect(fieldId) { document.getElementById(fieldId).classList.add('is-open'); }
function closeSelect(fieldId) { document.getElementById(fieldId).classList.remove('is-open'); }
```

---

## Interactive Surfaces

Anything tappable that is not a `.btn`, `.list-row` or `.input-field` takes a
`.surface-*` + `.scale-*` pair on the same element — selectable cards, tiles,
chips, menu items. Hand-written `:hover` / `:active` is never the answer
(`RULES §2`, `§3`).

**Surface classes**

| Family | Classes | Behaviour |
|---|---|---|
| Fill | `.surface-fillNeutral` · `.surface-fillColor` · `.surface-fillInverted` · `.surface-fillBlack` · `.surface-fillWhite` | solid fill that darkens on hover/press |
| Border | `.surface-borderNeutral` · `.surface-borderInverted` · `.surface-borderBlack` · `.surface-borderWhite` | outlined, fills lightly on hover |
| Subtle | `.surface-washNeutral` · `.surface-ghost` · `.surface-card` | transparent or `--bg-surface` at rest, light wash on hover/press |
| Section | `.surface-section` | one band of a card already divided by hairlines — transparent at rest, `--white-100` hover, `--black-300` press. It has a container contract; see [below](#surface-section--one-band-of-a-divided-card) |

**Scale classes**

| Class | Hover / press | Use on |
|---|---|---|
| `.scale-700` | 1.01 / 0.99 | cards, tiles, large components |
| `.scale-500` | 1.025 / 0.975 | buttons, selectors, rows inside a holding shape |
| `.scale-300` | 1.035 / 0.965 | chips, circle buttons, small components |
| none | — | a row on its own — scaling one row of a stack looks wrong |

The number is the size of the **object**, not the size of the movement: small
things move more so the motion reads the same at every size. `.btn` and
`.btn-circle` already carry their tier internally — never add a `.scale-*`.

### `.surface-section` — one band of a divided card

The other surfaces describe how a thing looks. This one describes where it
**sits**, and it is the one people get wrong.

A section is one band of a card that is already divided by hairlines — the shape
`.card-closed-header` / `-body` / `-footer` make, each separated by
`var(--border-weight-100) solid var(--neutral-200)`. It is not a floating box
inside a padded container. Drawn that way it looks like nothing at rest, and the
reason is the whole design: the band is transparent **because it inherits the
card's `--bg-surface`**, so it is invisible until you hover it and then washes
edge to edge. That reads as "this row of the card is tappable" rather than
"there is a button in here".

Which means the container has obligations:

| The container must… | Or else |
|---|---|
| Let the section span the card's full width — no margin, no inset | The wash stops short and reads as a floating button, not a band |
| Be a real card — `--bg-surface` against `--bg-base` | The section has nothing to be transparent against, and is invisible at rest |
| Divide its bands with a `--neutral-200` hairline | There is no section for the section to be one *of* |
| Give the section no `.scale-*` | Scaling one band detaches it from the card it belongs to |

Only the interactive bands take the class. The rest of the card takes no surface
at all.

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

Two shipped patterns are worth reading before you build one:
[Event row](#event-row-buy-flow-single-game), where *which* bands are
interactive changes with the offer state, and
[Inventory list row](#inventory-list-row-vfs-image--price), where every row is a
section of one card and the rows carry the padding so their dividers bleed full
width.

### Colour inheritance on filled surfaces

Fill surfaces set their own `color`; text classes set `--text-primary` and win,
which makes text vanish. Every page that uses a fill surface needs:

```css
.surface-fillNeutral *, .surface-fillColor *, .surface-fillInverted *,
.surface-fillBlack *, .surface-fillWhite * { color: inherit; }
```

`.btn *` and `.tag.tag-brand-color *` already include this.

---

## Tile

The card for anything displayed **alongside others** — event listings, product
grids, schedules, feeds. Full-width or single-column cards use `.card-closed` /
`.card-open` instead.

**Placement:** a `.card-grid` with column modifiers (`.grid-cols-3-desktop
.grid-cols-2-tablet .grid-cols-1-mobile`), a horizontal carousel, or as
sub-sections inside a `.card-open`.

**Interactivity — one choice per set, never mixed:**

| Tile has | Tap target | Classes on `.tile` |
|---|---|---|
| no button | the tile | `surface-card scale-700` |
| a button | the button | none |

```html
<!-- Tile is the tap target -->
<div class="tile surface-card scale-700">
  <div class="tile-visual">           <!-- your fixed-height block; the tile does not size it -->
    <img class="card-media" src="{item.image}" alt="">
  </div>
  <div class="tile-tag">Home</div>    <!-- optional frosted label, top-left -->
  <div class="tile-info">
    <div class="card-text-pair">
      <span class="labelBold30">{item.title}</span>
      <span class="labelRegular10 text-secondary">{item.date, formatted}</span>
    </div>
    <span class="labelBold20 text-success">From $45</span>   <!-- optional -->
  </div>
</div>

<!-- Button is the CTA -->
<div class="tile">
  <div class="tile-visual">…</div>
  <div class="tile-info">
    <div class="card-text-pair">…</div>
    <span class="labelBold20 text-success">From $45</span>
    <button class="btn btn-primary btn-100">Buy Tickets</button>
  </div>
</div>
```

`.tile-info` owns its spacing — 16px padding, 8px gap, an extra 8px above a
button — do not override it. The visual header (`.tile-visual` above is your
own class) is the only dimension the tile leaves to you. Opponent names, logos
and colours are data, not literals (`RULES §6`); `--badge-bg` falls back to
`--brand-core` when unset.

For a carousel, a scroll container with `scroll-snap` and
`scroll-padding-inline` matching its leading padding, and every tile with the
same interactivity choice.

---

## Stats Table

A standings or stat table: one wide identifying column, then as many narrow
numeric ones as the data has. The numbers cannot all fit on a phone, so they
scroll horizontally while the entity stays pinned — a number you can
read but can't attribute is useless.

`table-components.css`.

### Anatomy

| Part | Class | Notes |
|---|---|---|
| Scroll container | `.stat-table-scroll` | Required — the pinned column needs a scrollport |
| The table | `.stat-table` | Set `--stat-table-entity-width` to retune the leading column (224px default) |
| Group title | `.stat-table-title` (`.is-plain`) | Optional band above the table — "Atlantic", "Western Conference" |
| Leading cell | `.stat-table-entity` (`.is-title`) | Pinned. `.is-title` for the larger primary treatment |
| Attribute cell | `.stat-table-attr` | 48px wide, in both `<thead>` and `<tbody>` |
| Body row | `.stat-table-row` (`.is-tinted`, `.is-featured`) | 48px; head row is 40px |
| Entity block | `.stat-table-entity-block`, `.stat-table-rank` | Mark + abbreviation, optional rank |

Cell states: `.is-sorted` (the sorted column — darker, heavier, underlined in
the head row), `.is-win`, `.is-loss`, `.is-empty`.

### Usage

```html
<div class="stat-table-title"><span class="title50">Atlantic</span></div>

<div class="stat-table-scroll">
  <table class="stat-table">
    <thead>
      <tr>
        <th class="stat-table-entity labelBold10">Entity</th>
        <th class="stat-table-attr labelBold10 is-sorted">W</th>
        <th class="stat-table-attr labelBold10">L</th>
        <th class="stat-table-attr labelBold10">PCT</th>
      </tr>
    </thead>
    <tbody>
      <tr class="stat-table-row">
        <td class="stat-table-entity">
          <span class="stat-table-entity-block">
            <span class="stat-table-rank labelRegular10">1</span>
            <img src="..." alt="">
            <span class="labelBold20">MIN</span>
          </span>
        </td>
        <td class="stat-table-attr labelBold20 is-sorted">42</td>
        <td class="stat-table-attr labelRegular20">18</td>
        <td class="stat-table-attr labelRegular20">.700</td>
      </tr>
      <tr class="stat-table-row is-tinted">…</tr>
      <tr class="stat-table-row is-featured">…</tr>
    </tbody>
  </table>
</div>
```

### Rules of thumb

- **Add the type class.** Like `.tag`, this component sets structure and colour
  only: `labelBold10` on head cells, `labelRegular20` on attribute cells,
  `labelBold20` when sorted, `title50` on the title band. Colour comes from the
  component and beats the type class, because this sheet loads later (`RULES §1`).
- **Tint alternate rows yourself** with `.is-tinted`. `:nth-child` would count
  the group-title rows a grouped table puts between sections.
- **One `.is-featured` row per table** — the highlighted entry. It fills with
  `--brand-core` and drops the win/loss colours for `--white-700` /
  `--white-1000`, because green and red do not carry on a brand fill. That is
  deliberate; don't add them back.
- **Vertical scroll is the page's job.** The component leaves `overflow-y`
  visible. For a pane with a pinned head row, set a `max-height` and
  `overflow-y: auto` on the scroll container and `position: sticky; top: 0` on
  the `<thead>` cells — `docs/site/src/site.css § CONTENT MATRIX` does this.
- **Long strings need `table-layout: fixed`** and a definite table width, or a
  cell's `max-width` is ignored and the value spills into the next column. The
  48px default never hits this; a table of strings does.

---

## Token Quick Reference

The full, generated list is in `css-api.md § design-tokens-master.css` and the
per-scale files. This is the working subset.

### Color

**Backgrounds:** `--bg-base` · `--bg-surface` · `--bg-sheet` · `--bg-nav` · `--bg-input`
**Text:** `--text-primary` · `--text-secondary` · `--text-disabled` · `--text-placeholder`
**Border:** `--border-default` · `--border-hover` · `--border-active` · `--border-disabled`
**Status:** `--status-success` · `--status-warning` · `--status-error` · `--status-info` (each mode-aware; `-light` / `-dark` literals exist for the rare fixed case)

**Brand and interactive**

| Token | Scope | Use for |
|---|---|---|
| `--color-interactive` | per theme **and mode** | links, active states, focus rings, icon accents |
| `--color-inverted` | per theme **and mode** | the complementary accent |
| `--brand-core` | per theme | the brand colour itself — panels, marks, brand blocks |
| `--brand-light` | per theme | secondary brand colour |
| `--brand-dark` | per theme | dark brand colour — the tail of `.scrim-brand` |
| `--brand-dark-surface` | per theme | neutral dark **surface** for branded cards and scrims; not the navy `--brand-dark` |
| `--org-*` | per theme + mode | **plumbing — never use in markup.** The raw layer the semantic tokens alias (`--bg-base` → `--org-base`); reach for the semantic token instead |
| `--interactive-primary` / `-primary-text` | global | what `.btn-primary` and active nav states paint with |
| `--interactive-transactional` / `-transactional-text` | global | what `.btn-transactional` paints with |
| `--interactive-secondary-text` · `--interactive-tertiary-text` | global | outlined and text-only button colour |

`--brand-interactive` and `--brand-inverted` are theme-scoped only and never
appear in a component — see `RULES §2` for why. The mode-aware pair is
`--color-interactive` / `--color-inverted`.

**Text colour modifiers:** `.text-secondary` · `.text-brand-core` ·
`.text-brand-interactive` · `.text-brand-inverted` · `.text-brand-light` ·
`.text-interactive-tertiary` · `.text-success` (see `css-api.md § text-styles-system.css`).

**Known Figma vs CSS deltas — intentional, do not "fix":**
- `--border-default` is 10%/15% opacity against Figma's 20%/25%. Figma is calibrated for iOS; the web value is correct.
- `--text-secondary` in dark mode is 75% in CSS against 70% in Figma. Imperceptible.

### Spacing

8px scale. `var(--spacing-N)` in CSS, or `.mb-N` `.mt-N` `.p-N` `.py-N` `.px-N`
`.gap-N` in HTML.

| Token | Value | Token | Value |
|---|---|---|---|
| `--spacing-25` | 2px | `--spacing-400` | 32px |
| `--spacing-50` | 4px | `--spacing-500` | 40px |
| `--spacing-100` | 8px | `--spacing-600` | 48px |
| `--spacing-150` | 12px | `--spacing-700` | 56px |
| `--spacing-200` | 16px | `--spacing-800` | 64px |
| `--spacing-250` | 20px | `--spacing-900` | 72px |
| `--spacing-300` | 24px | `--spacing-1000` | 80px |

**Responsive semantic tokens** — prefer these for layout (`RULES §9`):

| Token | Mobile | Tablet | Desktop | Use for |
|---|---|---|---|---|
| `--spacing-row` | 8px | 12px | 16px | between rows / stacked items |
| `--spacing-card` | 16px | 20px | 24px | between cards |
| `--spacing-content` | 32px | 40px | 48px | between major sections |
| `--margin-small` | 16px | 32px | 48px | page margin, dense UI |
| `--margin-large` | 16px | 40px | 64px | page margin, standard |
| `--margin-landing` | 24px | 48px | 80px | page margin, open / landing layouts |

Utilities: `.py-large` (16→64px) · `.py-landing` (24→80px) · `.gap-card` (16→24px).

### Border and Radius

```css
--border-radius-50: 4px     /* tags, small elements */
--border-radius-100: 8px    /* cards, inputs, images */
--border-radius-200: 16px   /* large cards, selectors */
--button-border-radius      /* per theme — see the Themes table */

--border-weight-50: 1px     /* subtle */
--border-weight-100: 1px    /* standard */
--border-weight-200: 2px    /* heavy / active */
```

Utilities: `.rounded-{50|100|200}` (and per-corner variants) · `.rounded-button`
· `.border-{50|100|200}`. Shadows (`--shadow-sheet-*`, `--shadow-modal-*`) are
for sheets and modals only. Cards have no border (`RULES §2`).

### Containers

| Class | Max width | Use |
|---|---|---|
| `.container-maximum` | 1600px | landing pages |
| `.container-extra-wide` | 1440px | dashboards |
| `.container-wide` | 1280px | pages with sidebars |
| `.container` | 1200px | default |
| `.container-medium` | 1024px | articles, forms |
| `.container-narrow` | 768px | reading content |
| `.container-compact` | 640px | single column |

Page width is always a container class, never a hand-rolled `max-width`
(`RULES §4`). A full-bleed band handles its own background; the `.container*`
inside it handles the horizontal padding.

### Scrims

Flat scrims are the alpha scales (`--black-300/500/700`, `--white-700/1000`);
gradient scrims are `.scrim-image`, `.scrim-brand` and `.scrim-brand-strong`.
Which one, and why they are mode-stable, is `RULES §8`.

---

## Themes

`data-theme` on `<html>` picks the theme; `data-mode` picks light or dark
(`RULES §1`).

| `data-theme` | Display face | Renders caps | Button radius |
|---|---|---|---|
| *(omitted)* | Gantry | no | 100px |
| `ink` | Chronicle | no | 4px |
| `signal` | Grandstand | no | 100px |
| `moss` | Spire | no | 12px |
| `ember` | Register | no | 6px |
| `violet` | Marquee | no | 100px |

These five are worked examples of the theming contract, not a fixed set —
`docs/theming.md` is how to write your own, and `css/display-fonts.css` carries
a tuned ramp for each of the 145 shipped faces, many of which render caps.

Test one theme on a caps display face and one on a face that renders as drawn
before calling anything done (`RULES §10`).

---

## Data in Prototypes

This repository ships no content layer — a project supplies its own (`RULES §6`).
What the components expect of it is worth stating, because the shapes recur:

- **Entities are referenced by id, resolved once.** A row renders an opponent,
  a venue or a plan from a resolved record, never from fields copied into the
  markup. Resolution is also where derived fields are computed — an abbreviation
  derived at resolution time is absent if you hydrate a record by hand, and every
  three-letter slot on the screen quietly falls back to the full name.
- **A resolved entity for the row patterns carries** an id, a
  full name, a short name, an abbreviation, a brand colour, a logo and a
  grouping label. `color` may be absent — fall back to `var(--neutral-200)`.
- **Set an entity's colour inline** from its record (`--badge-bg`), never in a
  stylesheet (`RULES §6`).
- **Render after the data resolves.** Every loader here is async; the literal in
  the markup is the pre-JS state and should be generated from the same source.

---

## Anatomy of a Screen

How the parts stack when no template covers the screen. Copy the closest
template first (`RULES §2` — rebuilding an existing screen is the most common
failure); this section is for genuinely new screens.

### Web

```
<body>
├─ .top-bar                      sticky site nav (brand, actions)
├─ .context-header               brand identity band (product-patterns)
├─ <main class="container">      page width is always a .container* class (RULES §4)
│   ├─ screen title              .display* / .page-header
│   └─ sections                  one .section-padding block per section
│        · cards inside a section sit --spacing-card apart
│        · rows stack per § Row container (.row-wrap or .list-gap*)
└─ .web-footer                   site footer
```

- Horizontal page padding comes from the container (`--margin-small` /
  `--margin-large` inside it) — never a hand-rolled value (`RULES §9`).
- Vertical rhythm: `--spacing-content` between major sections,
  `--spacing-card` between cards. Both are responsive tokens — no media
  queries needed.

### App (`data-platform="app"`)

The chrome is a fixed z-stack (details and the layer diagram in
[iOS Navigation](#ios-navigation)):

```
.ios-status-bar
.ios-chrome-top      → .ios-safe-area-top + .ios-nav-maintab (+ subtabs)
.ios-scroll          → .ios-scroll-inner   (the page content)
.ios-chrome-bottom   → .ios-tab-bar
.ios-home-indicator
```

**Static copies (no JS):** in the live system `measureChrome()` sets
`.ios-scroll-inner`'s top margin at runtime. A static mock — a Claude Design
screen, a hand-built HTML comp — sets it as a fixed `margin-top` instead:
≈119px with the standard nav, more when subtabs are present. Easiest is to
start from a frozen reference screen, which has the measured value baked in.

## Complete Component Examples

Placeholders in braces (`{item.logo}`) are data a project's content layer
supplies (`RULES §6`); the shapes are described under
[Data in Prototypes](#data-in-prototypes). A `date` is an ISO string, so a
rendered date is formatted at render rather than stored as a field of its own.
Prices and seat blocks are fixtures.

### Tile grid (3-up, tile is the tap target)

```html
<div class="card-grid grid-cols-3-desktop grid-cols-2-tablet grid-cols-1-mobile">
  <div class="tile surface-card scale-700">
    <div class="tile-visual">
      <img class="card-media" src="{item.image}" alt="">
    </div>
    <div class="tile-info">
      <div class="card-text-pair">
        <span class="labelBold30">{item.title}</span>
        <span class="labelRegular10 text-secondary">{item.date, formatted}</span>
      </div>
      <span class="labelBold20 text-success">From $19</span>
    </div>
  </div>
  <!-- repeat per record from the project's data source -->
</div>
```

### Settings list (icon + switch / chevron)

```html
<div class="row-wrap">
  <div class="list-row">
    <div class="leading leading-gap-md">
      <span class="icon icon-200">notifications</span>
    </div>
    <div class="list-row-content">
      <div class="list-row-text-pair">
        <span class="labelBold30">Push Notifications</span>
        <span class="labelRegular10 text-secondary">Alerts for tickets and offers</span>
      </div>
    </div>
    <div class="trailing trailing-gap-md">
      <div class="switch">
        <input type="checkbox" id="notif-toggle" checked>
        <label for="notif-toggle"></label>
      </div>
    </div>
  </div>
</div>
<div class="row-wrap">
  <div class="list-row">
    <div class="leading leading-gap-md">
      <span class="icon icon-200">credit_card</span>
    </div>
    <div class="list-row-content">
      <div class="list-row-text-pair">
        <span class="labelBold30">Payment Methods</span>
        <span class="labelRegular10 text-secondary">Visa ending in 4242</span>
      </div>
    </div>
    <div class="trailing trailing-gap-xs">
      <span class="icon icon-200">chevron_right</span>
    </div>
  </div>
</div>
```

### Ticket list row (image + tags + price)

```html
<div class="row-wrap">
  <div class="list-row">
    <div class="leading leading-gap-lg">
      <img class="leading-image-small" src="{event.imageUrl}" alt="{event.title}">
    </div>
    <div class="list-row-content">
      <div class="list-row-text-pair">
        <span class="labelBold30">{home.short} vs {away.short}</span>
        <span class="labelRegular10 text-secondary">{item.date, formatted}</span>
      </div>
      <div class="tag-group">
        <div class="tag tag-brand-color"><span class="labelBold20">Floor</span></div>
        <div class="tag"><span class="labelBold20">Row 3</span></div>
      </div>
      <div class="info-block">
        <div class="info-item"><span class="icon icon-200">event_seat</span></div>
        <div class="info-item has-label">
          <span class="icon icon-200">confirmation_number</span>
          <span class="labelRegular10">2 tickets</span>
        </div>
      </div>
    </div>
    <div class="trailing trailing-gap-sm">
      <div class="trailing-text-pair">
        <span class="labelBold20">$148</span>
        <span class="labelRegular10 text-secondary">each</span>
      </div>
    </div>
  </div>
</div>
```

### Inventory list row (VFS image + price)

A **usage pattern**, not a component: a seat-inventory row with a View From
Seat image, section / row / seats, and a trailing price. Built entirely from
list-row parts — no new CSS. The image class and its gap step together by
breakpoint:

| Breakpoint | Row width | Image class | Image size | Leading gap |
|---|---|---|---|---|
| Mobile | 329px | `.leading-image-small` | 136×80 | `.leading-gap-lg` (16px) |
| Desktop | 592px | `.leading-image-large` | 244×124 | `.leading-gap-xl` (24px) |

Seat-view imagery is project data, not system data (`RULES §6`). **Far** is the wide view
(upper bowl); **close** is courtside or pitch-side (lower bowl, premium). The
perspective changes only the image requested — the markup is identical. Tag the
row with `data-vfs="far|close"` and `data-vfs-index` so a loader can fill it.

```html
<!-- Mobile -->
<div class="list-row surface-section" data-vfs="far" data-vfs-index="0">
  <div class="leading leading-gap-lg">
    <img class="leading-image-small" src="{vfs.far[0]}" alt="View from Section 313, Row F">
  </div>
  <div class="list-row-content">
    <div class="list-row-text-pair">
      <span class="labelBold30">Section 313</span>
      <span class="labelRegular10 text-secondary">Row F (Seats 9–14)</span>
    </div>
  </div>
  <div class="trailing trailing-gap-sm">
    <div class="trailing-text-pair">
      <span class="labelBold20">$21/ea</span>
      <span class="labelRegular10 text-secondary">Avg. Price</span>
    </div>
  </div>
</div>

<!-- Desktop — same structure, larger image and gap -->
<div class="list-row surface-section" data-vfs="far" data-vfs-index="0">
  <div class="leading leading-gap-xl">
    <img class="leading-image-large" src="{vfs.far[0]}" alt="View from Section 313, Row F">
  </div>
  …
</div>
```

**Container.** A card with no border; the rows carry the horizontal padding so
dividers bleed full width. `surface-section` on each row gives hover/press
without `scale-*` (scale on one row of a stack looks wrong). The page-level
wrapper (`.inventory-card`, `.inventory-list`) is the page's own CSS, not the
system's — `walkthrough.css` holds the reference implementation.

```html
<div class="inventory-card">
  <div class="inventory-list">
    <div class="list-row surface-section" data-vfs="far" data-vfs-index="0">…</div>
    <div class="list-row surface-section" data-vfs="far" data-vfs-index="1">…</div>
    <div class="list-row surface-section" data-vfs="far" data-vfs-index="2">…</div>
  </div>
</div>
```

**Type:** `.labelBold30` section name · `.labelRegular10.text-secondary` row /
seats and the "Avg. Price" sublabel · `.labelBold20` price.

**Checklist:** image class and gap class from the same row of the table above ·
`.list-row-text-pair`, not `.card-text-pair` · every sublabel `.text-secondary`
· `alt` describes the actual view · VFS `src` comes from the loader, never a
static asset.

**Figma:** `Inventory - List Row` · variants `Entity ID`, `Option`
(A/B/C — example data only), `Mobile/Desktop`, `Far/Close`.

### Entity row (leading logo)

Schedules, listings, upcoming-event rows. The mark goes in the leading slot;
the logo, name and short name come from the resolved reference.

```html
<div class="row-wrap">
  <div class="list-row">
    <div class="leading leading-gap-md">
      <img class="event-row-logo" src="{item.logo}" alt="{item.name}">
    </div>
    <div class="list-row-content">
      <div class="list-row-text-pair">
        <span class="labelBold30">{item.short}</span>
        <span class="labelRegular10 text-secondary">{item.date, formatted}</span>
      </div>
      <div class="tag-group">
        <div class="tag"><span class="labelBold20">Home</span></div>
      </div>
    </div>
    <div class="trailing trailing-gap-xs">
      <span class="icon icon-200">chevron_right</span>
    </div>
  </div>
</div>
```

- Away game → the tag reads `Away`
- No logo → omit `.leading`; `.list-row-content` becomes the first child
- Crests are SVG; `.event-row-logo` already applies `object-fit: contain`

### Event row (buy flow, single event)

Buy-flow card for one event: mark, event info, offer state. Background
is `--bg-surface` with a 16px radius; padding and text scale are responsive.

| Offer state | Top trailing | Bottom section |
|---|---|---|
| Featured Only | `btn btn-primary btn-100` "$N+" | — |
| Featured and Others | `btn btn-primary btn-100` "$N+" | "X Additional Offers" + `arrow_drop_down` |
| No Featured Offers | none | "X Offers Available" + `arrow_drop_down` |
| Sold Out | `labelBold30 text-secondary` "Sold Out" | — |
| Coming Soon | `labelBold20 text-interactive-tertiary event-row-coming-soon` "Coming Soon" | — |

`.event-row-label` / `.event-row-sublabel` step from 16/12px on mobile to
20/14px from 500px — it is a `-r`-style pair baked into the component, not a
media query in the template (`RULES §5`).

**Surfaces.** The card background is built into `.event-row`; the wrapper takes
no surface token and no `scale-*`. `surface-section` goes on each **interactive
section** only:

| State | `surface-section` on |
|---|---|
| Featured Only | `.event-row-top` |
| Featured and Others | `.event-row-top` + `.event-row-bottom` |
| No Featured Offers | `.event-row-bottom` only |
| Sold Out / Coming Soon | neither |

```html
<!-- Featured Only -->
<div class="event-row">
  <div class="event-row-top surface-section">
    <div class="list-row">
      <div class="leading leading-gap-sm">
        <img class="event-row-logo" src="{item.logo}" alt="{item.name}">
      </div>
      <div class="list-row-content">
        <div class="list-row-text-pair">
          <span class="event-row-label">{item.name}</span>
          <span class="event-row-sublabel text-secondary">{item.date, formatted}</span>
        </div>
      </div>
      <div class="trailing trailing-gap-lg">
        <button class="btn btn-primary btn-100">$19+</button>
      </div>
    </div>
  </div>
</div>

<!-- Featured and Others -->
<div class="event-row">
  <div class="event-row-top surface-section">
    <div class="list-row">…same as above…</div>
  </div>
  <div class="event-row-bottom surface-section">
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

<!-- No Featured Offers — top is not interactive -->
<div class="event-row">
  <div class="event-row-top">
    <div class="list-row not-tappable">
      <div class="leading leading-gap-sm">
        <img class="event-row-logo" src="{item.logo}" alt="{item.name}">
      </div>
      <div class="list-row-content">
        <div class="list-row-text-pair">
          <span class="event-row-label">{item.name}</span>
          <span class="event-row-sublabel text-secondary">{item.date, formatted}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="event-row-bottom surface-section">
    <div class="list-row">
      <div class="list-row-content">
        <div class="list-row-text-pair">
          <span class="labelBold30 text-interactive-tertiary">3 Offers Available</span>
        </div>
      </div>
      <div class="trailing trailing-gap-xs">
        <span class="icon text-interactive-tertiary">arrow_drop_down</span>
      </div>
    </div>
  </div>
</div>

<!-- Sold Out -->
<div class="event-row">
  <div class="event-row-top">
    <div class="list-row not-tappable">
      <div class="leading leading-gap-sm">
        <img class="event-row-logo" src="{item.logo}" alt="{item.name}">
      </div>
      <div class="list-row-content">
        <div class="list-row-text-pair">
          <span class="event-row-label">{item.name}</span>
          <span class="event-row-sublabel text-secondary">{item.date, formatted}</span>
        </div>
      </div>
      <div class="trailing trailing-gap-sm">
        <span class="labelBold30 text-secondary">Sold Out</span>
      </div>
    </div>
  </div>
</div>

<!-- Coming Soon -->
<div class="event-row">
  <div class="event-row-top">
    <div class="list-row not-tappable">
      …
      <div class="trailing trailing-gap-sm">
        <span class="labelBold20 text-interactive-tertiary event-row-coming-soon">Coming Soon</span>
      </div>
    </div>
  </div>
</div>
```

**List container** — `.event-row-list` stacks rows with an 8px gap, constrained
to 499px on phone and 672px from tablet up:

```html
<div class="event-row-list">
  <div class="event-row">…</div>
  <div class="event-row">…</div>
</div>
```

Every state of this row is on `demo/07-rows.html`.

### Card with header, body and footer

`.card-closed-header` is a row: the text pair takes the free space and an
optional trailing action — a circle button, a link, a tag — sits at the end.
With no trailing action the pair simply fills the row. Long titles truncate
rather than pushing the action off the edge.

The card **clips its children**, so a full-bleed image in the first band, or an
interactive band's `.surface-section` wash in the last one, follows the 16px
radius on its own. Never add `overflow: hidden` to a card in a template — it is
already there, and an inline style is the thing `RULES §2` tells you to remove
rather than fight.

```html
<div class="card-closed">
  <div class="card-closed-header">
    <div class="card-text-pair">
      <h3 class="title50">Season Tickets</h3>
      <p class="labelRegular20 text-secondary">2024-25 Season</p>
    </div>
    <button class="btn-circle btn-circle-300 btn-circle-neutral-tertiary" aria-label="More">
      <span class="btn-icon material-symbols-rounded">more_horiz</span>
    </button>
  </div>
  <div class="card-closed-body">
    <p class="bodyRegular30">Enjoy the full season with priority access and member pricing.</p>
  </div>
  <div class="card-closed-footer">
    <div class="btn-group">
      <button class="btn btn-transactional btn-300">Buy Now</button>
      <button class="btn btn-secondary btn-300">Learn More</button>
    </div>
  </div>
</div>
```

### Hero section with stacked CTAs

```html
<section class="py-large text-center">
  <div class="container-compact">
    <div class="card-text-pair mb-500">
      <h1 class="display500">Game Day Is Here</h1>
      <p class="labelRegular40 text-secondary">Get your tickets before they're gone</p>
    </div>
    <div class="btn-group-stack">
      <button class="btn btn-transactional btn-700 btn-fill btn-icon-trailing">
        <span>Buy Tickets</span>
        <span class="btn-icon material-symbols-rounded">arrow_forward</span>
      </button>
      <button class="btn btn-secondary btn-700 btn-fill">View Schedule</button>
    </div>
  </div>
</section>
```

### Section header with View All

```html
<div class="section-header">
  <div class="card-text-pair">
    <h2 class="display300">Upcoming Games</h2>
    <p class="labelRegular20 text-secondary">Next 7 days</p>
  </div>
  <a class="link labelBold20" href="#">View All</a>
</div>
```

```css
/* your CSS — a flex row, tokens only */
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--spacing-200) 0 var(--spacing-150);
}
```

### Login form

```html
<form class="container-compact py-large">
  <div class="card-text-pair mb-400">
    <h1 class="display400">Sign In</h1>
    <p class="labelRegular30 text-secondary">Welcome back</p>
  </div>
  <div class="form-stack">
    <div class="input-field">
      <div class="input-label-row">
        <label class="input-label" for="login-email">Email</label>
      </div>
      <div class="input-and-message">
        <div class="input-control">
          <span class="input-icon material-symbols-rounded">mail</span>
          <input type="email" id="login-email" placeholder="you@example.com">
        </div>
      </div>
    </div>
    <div class="input-field">
      <div class="input-label-row">
        <label class="input-label" for="login-password">Password</label>
        <a class="input-link" href="#">Forgot password?</a>
      </div>
      <div class="input-and-message">
        <div class="input-control">
          <input type="password" id="login-password" placeholder="Enter password">
        </div>
      </div>
    </div>
  </div>
  <div class="mt-300">
    <button class="btn btn-primary btn-700 btn-fill" type="submit">Sign In</button>
  </div>
</form>
```

```css
.form-stack { display: flex; flex-direction: column; gap: var(--spacing-200); }
```

`demo/08-forms.html` shows every input state and the JS helpers.

### Filter bar (two selects)

```html
<div class="filter-bar">
  <div class="input-field input-select" id="filter-sport">
    <div class="input-and-message">
      <div class="input-control">
        <span class="input-select-display is-placeholder" id="filter-sport-display">Sport</span>
        <span class="input-select-chevron material-symbols-rounded">arrow_drop_down</span>
        <select id="sel-sport"
          onchange="syncSelect('filter-sport', 'filter-sport-display', this)"
          onfocus="openSelect('filter-sport')"
          onblur="closeSelect('filter-sport')">
          <option value="" disabled selected>Sport</option>
          <option value="basketball">Basketball</option>
          <option value="soccer">Soccer</option>
        </select>
      </div>
    </div>
  </div>
  <div class="input-field input-select" id="filter-date">
    <div class="input-and-message">
      <div class="input-control">
        <span class="input-select-display is-placeholder" id="filter-date-display">Date</span>
        <span class="input-select-chevron material-symbols-rounded">arrow_drop_down</span>
        <select id="sel-date"
          onchange="syncSelect('filter-date', 'filter-date-display', this)"
          onfocus="openSelect('filter-date')"
          onblur="closeSelect('filter-date')">
          <option value="" disabled selected>Date</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
        </select>
      </div>
    </div>
  </div>
</div>
```

```css
.filter-bar { display: flex; gap: var(--spacing-150); padding: var(--spacing-150) var(--spacing-200); }
.filter-bar .input-field { flex: 1; }
```

### Quantity row with stepper

```html
<div class="row-wrap">
  <div class="list-row">
    <div class="leading leading-gap-md">
      <div class="circle-container"><span class="display100">A</span></div>
    </div>
    <div class="list-row-content">
      <div class="list-row-text-pair">
        <span class="labelBold30">Adult</span>
        <span class="labelRegular10 text-secondary">$42.00 per ticket</span>
      </div>
    </div>
    <div class="trailing trailing-gap-lg">
      <div class="stepper">
        <button class="stepper-btn disabled" aria-label="Remove"><span class="icon icon-200">remove</span></button>
        <span class="stepper-count labelBold50">1</span>
        <button class="stepper-btn" aria-label="Add"><span class="icon icon-200">add</span></button>
      </div>
    </div>
  </div>
</div>
```

### Selector (selectable list row)

`.selector` wraps a `.list-row` to make it selectable; it supplies the 16px
radius and padding, and the surface class supplies every interactive state
(`RULES §3`).

| Variant | Surface class | Use when |
|---|---|---|
| Wash | `surface-washNeutral` | inside a card, on `--bg-surface` — near transparent at rest |
| Card | `surface-card` | on the page background, `--bg-base` — reads as a card at rest |

```html
<!-- Wash -->
<div class="selector surface-washNeutral scale-500">
  <div class="list-row">
    <div class="list-row-content">
      <div class="list-row-text-pair">
        <span class="labelBold30">Section 313 — Row F</span>
        <span class="labelRegular10 text-secondary">Seats 9–14</span>
      </div>
    </div>
    <div class="trailing trailing-gap-sm">
      <div class="trailing-text-pair">
        <span class="labelBold20">$148</span>
        <span class="labelRegular10 text-secondary">each</span>
      </div>
    </div>
  </div>
</div>

<!-- Card -->
<div class="selector surface-card scale-500"><div class="list-row">…</div></div>

<!-- Selected — either variant -->
<div class="selector surface-washNeutral scale-500 is-selected"><div class="list-row">…</div></div>

<!-- Disabled — drop scale-500 -->
<div class="selector surface-washNeutral is-disabled"><div class="list-row">…</div></div>
```

`is-selected` inverts to `--neutral-1000` with inverted text and beats both
surfaces; `is-disabled` is 25% opacity with no pointer events.

---

## iOS App Platform

`data-platform="app"` on `<html>` renders the page inside an iPhone 15 Pro frame
(393×852) centred on a black backdrop (`RULES §1`, `§9`). The styles live in
`platform-tokens.css`; the reference scaffold is `demo/11-ios-frame.html`.

```html
<html lang="en" data-theme="signal" data-mode="dark" data-platform="app">
```

| Token | Web | App |
|---|---|---|
| `--safe-area-top` | `0px` | `59px` |
| `--safe-area-bottom` | `0px` | `34px` |

### System chrome

**Status bar** — an SVG with time, cellular, wifi and battery in `currentColor`,
so it follows light/dark. Copy the SVG from `_template-app/index.html`.

| Class | Behaviour |
|---|---|
| `.ios-status-bar` | absolute, top 0, height `--safe-area-top`, above everything |
| `.ios-status-bar-modal` | white-text variant while a modal is open |
| `.ios-safe-area-top` | empty spacer the height of the status bar |

**Home indicator** — `<div class="ios-home-indicator"></div>`, a sticky pill
with a fade-in. Omit it when the bottom tab bar is present; the tab bar carries
its own.

**Device controls** — the Dynamic Island theme/mode pill
(`.app-device-controls`) is **injected by `prototype-harness.js`**; never paste
its markup into a page (`RULES §1`). On
a real phone it hides and a triple-tap opens the same controls in a popup.

### Content wrappers

```html
<!-- Simple: scrolls between status bar and home indicator, hidden scrollbar -->
<div class="ios-content">…</div>

<!-- With the bottom tab bar: extra bottom padding clears it -->
<div class="ios-content has-ios-tab-bar">…</div>
```

For top nav + tab bar with content scrolling **behind** translucent chrome, use
the three-layer stack described under [Layout architecture](#layout-architecture).

### At or below 500px

On a real phone the frame, backdrop, shadow and rounded corners go; `<body>`
becomes full width at natural height; the status bar collapses to an 8px
spacer; the home indicator hides; `.ios-chrome-top` becomes `sticky`,
`.ios-chrome-bottom` becomes `fixed`, `.ios-scroll` becomes `static`. Nothing
in the template changes.

Note that `list-row-components.css` steps its padding up at
`@media (min-width: 500px)`; the phone frame renders inside a wider viewport,
so app-mode overrides in `platform-tokens.css` keep the mobile values. If a
list row inside the frame shows desktop padding, that override is missing for
the class in question.

### File map

| File | Provides |
|---|---|
| `platform-tokens.css` | phone frame, safe areas, status bar, home indicator, device-control styling, ≤500px collapse |
| `ios-nav-components.css` | glass token, nav bars, tab bar, modal sheet, brand icon token |
| `prototype-harness.js` | injects the device controls and the web/native platform link |
| `crnl-loader.js` | loads every stylesheet in order; triple-tap handler for the mobile controls |
| `demo/11-ios-frame.html` | live app-mode reference |

---

## iOS Navigation

Glass buttons, nav bars, the tab bar and modal sheet, from
`ios-nav-components.css`. Depends on the platform tokens above. React
counterparts (`IOSNavButton`, `IOSHomeNav`, `IOSPageNav`, `IOSModal`,
`IOSTabBar`) are in the [React library](#react-library).

### Glass token

`.ios-glass` is the frosted surface matching Figma's "Fake Glass" style. Apply
it to any element and give the element its own radius via a class.

| Layer | Technique |
|---|---|
| Blur | `backdrop-filter: blur(12px)` |
| Tint | `--neutral-200` + `--inverted-300` + `--black-200`, luminosity blend |
| Overlay | `::before` gradient `--neutral-100 → --black-200`, hard-light, inner shadows |
| Border ring | `::after` 175° gradient bevel through a mask, 1px |
| Outer shadow | soft 40px drop |

Semantic tokens throughout, so it holds across every theme and both modes.

### Glass circle button

44×44, for nav bars.

```html
<!-- Icon (glass) -->
<button class="ios-nav-btn ios-glass" aria-label="Notifications">
  <span class="icon">notifications</span>
</button>

<!-- Brand (solid) -->
<button class="ios-nav-btn ios-nav-btn-brand" aria-label="Account">
  <span>A</span>
</button>
```

| State | Glass | Brand |
|---|---|---|
| Default | glass surface, 20px icon | `--interactive-primary` fill, white text |
| Hover | glass brightens (`--white-200`) | slight opacity change |
| Active | `scale(1.15)`, brighter glass | `scale(1.15)` |

### Home nav bar

Display title left, actions right, sticky below the status bar with a
translucent gradient fade (blur + colour at 0.9, masked to 36px below the bar).

```html
<header class="ios-nav-maintab">
  <div class="ios-nav-maintab-row">
    <span class="display500">Home</span>
    <div class="ios-nav-controls">
      <button class="ios-nav-btn ios-glass" aria-label="Notifications">
        <span class="icon">notifications</span>
      </button>
      <button class="ios-nav-btn ios-nav-btn-brand" aria-label="Account"><span>A</span></button>
    </div>
  </div>
</header>
```

`.ios-nav-maintab-row` is a page-level flex row (`display: flex; align-items:
center; justify-content: space-between; width: 100%; min-height: 44px`) —
tokens only, defined in the page's own CSS. The title is written `Home`, not
`HOME` (`RULES §5`).

**Segmented control (subtabs)** — below the nav bar inside `.ios-chrome-top`:

```html
<div class="ios-chrome-top">
  <div class="ios-safe-area-top"></div>
  <header class="ios-nav-maintab">…</header>
  <div class="ios-nav-subtabs-container">
    <div class="ios-nav-subtabs ios-glass">
      <button class="ios-nav-subtab is-active">Schedule</button>
      <div class="ios-nav-subtab-sep"></div>
      <button class="ios-nav-subtab">Roster</button>
      <div class="ios-nav-subtab-sep"></div>
      <button class="ios-nav-subtab">News</button>
    </div>
  </div>
</div>
```

The active subtab is `--interactive-primary` text on a `--ios-selected-tab-bg`
pill; separators next to it are hidden.

### Page nav bar

Back button left, centred title, optional trailing action. The title stays
centred whatever the button count because the buttons are absolutely
positioned.

```html
<header class="ios-nav-page">
  <div class="ios-nav-page-row">
    <button class="ios-nav-btn ios-glass ios-nav-page-left" aria-label="Back">
      <span class="icon">arrow_back</span>
    </button>
    <span class="ios-nav-page-title">Page Title</span>
    <button class="ios-nav-btn ios-glass ios-nav-page-right" aria-label="Share">
      <span class="icon">ios_share</span>
    </button>
  </div>
</header>
```

Omit `.ios-nav-page-right` when there is no trailing action.

### Modal sheet

Full-screen black backdrop, a stack indicator hinting at the parent screen, and
a bottom sheet with its own nav bar (drag handle via `::before`).

```html
<div class="ios-modal-backdrop" id="my-modal">
  <div class="ios-modal-stack"></div>
  <div class="ios-modal-sheet">
    <header class="ios-nav-modal">
      <div class="ios-nav-modal-row">
        <button class="ios-nav-btn ios-nav-page-left" aria-label="Close" onclick="closeModal()">
          <span class="icon">close</span>
        </button>
        <span class="ios-nav-page-title">Modal Title</span>
        <button class="ios-nav-btn ios-nav-page-right" aria-label="Share">
          <span class="icon">ios_share</span>
        </button>
      </div>
    </header>
    <div class="ios-modal-content">…</div>
  </div>
</div>
```

Show and hide by toggling **`.is-open`** on the backdrop. That one class drives
all three moving parts — the backdrop fades, the sheet slides up from below, and
the stack indicator is revealed behind it on a delay — so a page needs no modal
CSS of its own:

```javascript
function openModal()  { document.getElementById('my-modal').classList.add('is-open'); }
function closeModal() { document.getElementById('my-modal').classList.remove('is-open'); }
```

While open, add `.ios-status-bar-modal` to the status bar for white text.

The `hidden` attribute works too, but skips the animation in both directions —
`display: none` applies instantly, so you get a hard cut instead of a slide.
Use it only for a modal that should appear with no transition. It is worth
knowing *why* it needs a rule at all: `.ios-modal-backdrop` sets `display: flex`,
and an author declaration beats the browser's own `[hidden] { display: none }`
on cascade origin before specificity is considered. Without the explicit
`.ios-modal-backdrop[hidden]` guard in `ios-nav-components.css`, a modal marked
`hidden` renders **open**, covering the screen. Any flex or grid overlay has the
same trap.

| Element | Purpose |
|---|---|
| `.ios-modal-backdrop` | black backdrop, flex column, above the page chrome. `.is-open` reveals it |
| `.ios-modal-stack` | 15px gradient bar — the parent screen peeking through |
| `.ios-modal-sheet` | rounded sheet, flex column |
| `.ios-nav-modal` / `.ios-nav-modal-row` | sheet nav bar: close, centred title, trailing action |
| `.ios-modal-content` | scrollable body |

### Bottom tab bar

Five tabs on a glass pill, over an `--org-base` gradient fade (215px tall) that
content scrolls behind.

```html
<nav class="ios-tab-bar">
  <div class="ios-tab-bar-inner ios-glass">
    <button class="ios-tab is-active" data-tab="home">
      <span class="icon">home</span><span class="ios-tab-label">Home</span>
    </button>
    <button class="ios-tab" data-tab="brand">
      <span class="ios-tab-brand-icon"></span><span class="ios-tab-label">Brand</span>
    </button>
    <button class="ios-tab" data-tab="gameday">
      <span class="icon">stadium</span><span class="ios-tab-label">Gameday</span>
    </button>
    <button class="ios-tab" data-tab="buy">
      <span class="icon">sell</span><span class="ios-tab-label">Buy</span>
    </button>
    <button class="ios-tab" data-tab="tickets">
      <span class="icon">confirmation_number</span><span class="ios-tab-label">Tickets</span>
    </button>
  </div>
</nav>
```

| State | Icon | Label | Background |
|---|---|---|---|
| Inactive | outlined, `--neutral-500` | `--neutral-500` | none |
| Active | filled, `--ios-selected-tab` | `--ios-selected-tab` | `--ios-selected-tab-bg` pill |

The selected pill uses `--ios-selected-tab-bg`, never `--bg-input` (transparent
in dark mode — the pill vanishes).

### Brand icon token

The brand tab draws a monochrome SVG through `mask-image` from
`--brand-tab-icon`, so it inherits `currentColor` for both states. Unset, it
falls back to a neutral placeholder; a theme points it at its own mark:

```css
[data-theme="acme"] { --brand-tab-icon: url('../images/acme-mark.svg'); }
```

Never let a theme borrow another theme's mark — a placeholder reads as "no icon
yet", someone else's mark reads as a bug.

### Layout architecture

Every iOS nav prototype is a three-layer absolute stack:

```
┌─────────────────────────────┐
│ ios-chrome-top    z: 100    │ ← status bar + nav bar + subtabs
│   (transparent gradient)    │
├─────────────────────────────┤
│                             │
│ ios-scroll          z: 1    │ ← fills the phone frame
│   ios-scroll-inner          │    margin-top set by JS
│     (content)               │    content scrolls behind chrome
│                             │
├─────────────────────────────┤
│ ios-chrome-bottom   z: 100  │ ← tab bar + home indicator
│   (transparent gradient)    │
└─────────────────────────────┘
```

`ios-scroll-inner`'s `margin-top` is measured at runtime (`measureChrome()` in
the template) because the chrome height changes when subtabs are present.

```html
<html data-theme="signal" data-mode="dark" data-platform="app">
  <body>
    <div class="ios-status-bar"><!-- SVG --></div>
    <div class="ios-chrome-top">
      <div class="ios-safe-area-top"></div>
      <header class="ios-nav-maintab">…</header>
    </div>
    <div class="ios-chrome-bottom">
      <nav class="ios-tab-bar">…</nav>
    </div>
    <div class="ios-scroll">
      <div class="ios-scroll-inner">…</div>
    </div>
    <!-- device controls are injected by prototype-harness.js -->
  </body>
</html>
```

`demo/11-ios.html` is the reference implementation
of the full stack; `buy-tab-single-game/index.native.html` adds detail push/pop.

---

## Figma

This repository has no Figma file bound to it. The system was originally built
alongside one, and a few sections below still note where the CSS deliberately
differs from a Figma value — those deltas are recorded because they were
decisions, not drift.

When you do bind a Figma file to a project built on this system, keep a
component map next to it: each CSS class / React component → its component set,
node id, variant props and text override keys. Map every measurement to the
nearest token (16px → `--spacing-200`); when a value maps to nothing, say so
rather than extending the system (`RULES §2`).

---

## React Library

Typed components in `src/`, exported from `src/index.ts`, built on the same CSS.
Variants only — no `className` or `style` on a design system component.

<!-- gen:react-exports -->
`Icon` · `Button` · `CircleButton` · `Tag` · `Chip` · `CardClosed` · `CardOpen` · `CardSection` · `ListRow` · `TextPair` · `TrailingText` · `LeadingImage` · `LeadingLogo` · `CircleContainer` · `Input` · `Select` · `Selector` · `Tile` · `TopBar` · `Tabs` · `Steps` · `PageHeader` · `EventRow` · `IOSNavButton` · `IOSHomeNav` · `IOSPageNav` · `IOSModal` · `IOSTabBar`
<!-- /gen:react-exports -->

```tsx
import { Button, ListRow, TextPair, Input, Tile } from '@ds/react'
```

The CSS is imported once in `src/main.tsx`. Theming is `ThemeContext`
(`src/context/ThemeContext.tsx`): wrap the root in `<ThemeProvider>` and read or
set theme and mode with `useTheme()` — never write `data-theme` yourself. Brand
and fixture data follow `RULES §6`.

### Icon

| Prop | Type | Default |
|---|---|---|
| `name` | `string` | required |
| `size` | `100 \| 200 \| 300 \| 400 \| 500 \| 600` | `300` |
| `outlined` | `boolean` | `false` |

### Button

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'transactional' \| 'neutral' \| 'destructive' \| 'white' \| 'white-tertiary' \| 'black'` | required |
| `size` | `'large' \| 'small' \| 'xsmall'` | `'large'` |
| `icon` / `iconPosition` | `string` / `'leading' \| 'trailing'` | — / `'leading'` |
| `fill` · `disabled` | `boolean` | `false` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `onClick` | `() => void` | — |

### CircleButton

| Prop | Type | Default |
|---|---|---|
| `variant` | as Button | required |
| `size` | `'large' \| 'small'` | `'large'` |
| `icon` | `string` | required |
| `aria-label` | `string` | required |
| `disabled` · `onClick` · `type` | as Button | |

### Tag

| Prop | Type |
|---|---|
| `children` | `ReactNode` |
| `teamColor` | `boolean` |
| `icon` / `iconPosition` | `string` / `'leading' \| 'trailing'` |

### Chip

| Prop | Type | Default |
|---|---|---|
| `children` | `ReactNode` | |
| `surface` | `'bordered' \| 'ghost'` | `'bordered'` |
| `teamColor` · `disabled` | `boolean` | `false` |
| `icon` / `iconPosition` | as Tag | |
| `onClick` | `() => void` | |

### CardClosed · CardOpen · CardSection

| Component | Props |
|---|---|
| `CardClosed` | `header?` · `body?` · `footer?` (`ReactNode`) · `interactive?` · `onClick?` |
| `CardOpen` | `header?` (`ReactNode`) · `sections` (`ReactNode[]`) |
| `CardSection` | `children` · `interactive?` · `onClick?` |

### ListRow and subcomponents

| Component | Props |
|---|---|
| `ListRow` | `leading?` · `leadingGap?` `'sm' \| 'md' \| 'lg' \| 'xl'` · `children` · `trailing?` · `trailingGap?` `'xs' \| 'sm' \| 'md' \| 'lg'` · `notTappable?` · `disabled?` · `onClick?` |
| `TextPair` | `label` · `sublabel?` (`ReactNode`) — the `.list-row-text-pair` |
| `TrailingText` | `label` · `sublabel?` — right-aligned pair |
| `LeadingImage` | `src` · `alt` · `size?` `'square' \| 'small' \| 'large'` |
| `LeadingLogo` | `ariaLabel?` — renders the active brand logo from CSS |
| `CircleContainer` | `children` — the `.circle-container` for an icon or letter |

### Input · Select

| Component | Props |
|---|---|
| `Input` | `label?` · `linkText?` / `linkHref?` · `type?` `'text' \| 'email' \| 'password' \| 'tel' \| 'number' \| 'search' \| 'url'` · `value?` / `defaultValue?` · `placeholder?` · `message?` · `icon?` · `clearable?` · `error?` · `disabled?` · `onChange?(value)` · `onClear?` · `name?` · `id?` · `autoComplete?` |
| `Select` | `label?` · `options` `{ value, label }[]` · `value?` · `placeholder?` · `message?` · `icon?` · `error?` · `disabled?` · `onChange?(value)` · `name?` · `id?` |

### Selector

| Prop | Type | Default |
|---|---|---|
| `children` | `ReactNode` (a `ListRow`) | |
| `surface` | `'wash' \| 'card'` | `'wash'` — `'card'` on the page background |
| `selected` · `disabled` | `boolean` | `false` |
| `onClick` | `() => void` | |

### Tile

| Prop | Type |
|---|---|
| `visual` | `ReactNode` — the fixed-height header |
| `info` | `ReactNode` — text pair, price, optional button |
| `tag?` | `ReactNode` |
| `tappable?` | `boolean` — the tile is the tap target; no `Button` inside |
| `onClick?` | `() => void` |

### TopBar

| Prop | Type |
|---|---|
| `logoSrc?` · `teamName?` · `shortName?` (mobile) · `fullName?` (tablet+) · `href?` | `string` |
| `actions?` | `ReactNode` |

The Top Bar alone steps at 768px and 1280px (`nav-components.css`), not at the
system's 500/1100 breakpoints.

### Tabs

| Prop | Type |
|---|---|
| `tabs` | `{ label, value }[]` |
| `activeTab` | `string` |
| `onChange` | `(value) => void` |
| `neutral?` | `boolean` — `--neutral-1000` indicator instead of brand |
| `ariaLabel?` | `string` |

### Steps

| Prop | Type |
|---|---|
| `steps` | `{ label, state: 'completed' \| 'active' \| 'pending' }[]` |
| `brand?` | `boolean` — completed steps in `--interactive-primary` instead of `--status-success` |

### PageHeader

| Prop | Type |
|---|---|
| `title` · `subtitle?` | `ReactNode` |
| `tabs?` | `ReactNode` (a `Tabs`) — suppresses the header's bottom border; the tabs draw it |
| `steps?` | `ReactNode` (a `Steps`) — header keeps its border |

### EventRow

| Prop | Type |
|---|---|
| `opponentLogo` · `opponentName` · `date` | `string` |
| `state` | `'featured-only' \| 'featured-and-others' \| 'no-featured-offers' \| 'sold-out' \| 'coming-soon'` |
| `featuredPrice?` | `string` |
| `offerCount?` | `number` |
| `onTopClick?` · `onBottomClick?` | `() => void` |

### IOSNavButton

| Prop | Type | Default |
|---|---|---|
| `variant` | `'glass' \| 'brand'` | `'glass'` |
| `icon` | `string` — glass variant | |
| `label` | `string` — one character, brand variant | |
| `onClick` · `aria-label` | | |

### IOSHomeNav

| Prop | Type |
|---|---|
| `title` | `string` |
| `showNotification?` · `onNotification?` | `boolean` · `() => void` |
| `avatarLabel?` · `onAvatar?` | `string` · `() => void` |
| `subtabs?` · `activeSubtab?` · `onSubtabChange?` | `string[]` · `number` · `(index) => void` |
| `children?` | `ReactNode` — replaces the right-side controls |

### IOSPageNav

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | required |
| `onBack?` | `() => void` | |
| `backIcon?` | `string` | `'arrow_back'` |
| `trailingIcon?` · `onTrailingAction?` | `string` · `() => void` | |

### IOSModal

| Prop | Type | Default |
|---|---|---|
| `open` | `boolean` | required |
| `onClose` | `() => void` | required |
| `title` | `string` | required |
| `closeIcon?` | `string` | `'close'` |
| `trailingIcon?` · `onTrailingAction?` | `string` · `() => void` | |
| `children` | `ReactNode` | |

### IOSTabBar

| Prop | Type |
|---|---|
| `tabs` | `{ id, label, icon }[]` — `icon: "brand"` draws the themeable brand icon |
| `activeTab` | `string` |
| `onTabChange` | `(id) => void` |

---

## Troubleshooting

Symptom → fix. The rule behind each is cited.

| Symptom | Fix |
|---|---|
| Card looks like one big slab / its edge is invisible | it is sitting on `--bg-surface`; ground it on `--bg-base` or step up to `--bg-sheet` — solid surfaces never stack (`RULES §2`) |
| Text invisible on a filled surface | add the `color: inherit` block from [Interactive Surfaces](#colour-inheritance-on-filled-surfaces); fill surfaces set `color`, text classes override it |
| Brand colour wrong (dark-on-dark) in dark mode | you used `--brand-interactive` / `--brand-inverted`; switch to `--color-interactive` / `--color-inverted` (`RULES §2`) |
| A `.surface-*` token is set but text colour is off | surface classes paint the background only; colour comes from a text class or `color: inherit`, not from the surface |
| Hover/press on a button not working | it needs the `.btn` base class; remove any hand-written `:hover` transform (`RULES §2`) |
| Custom `:hover` / `:active` on a non-button element | delete it; compose `.surface-*` + `.scale-*` (`RULES §3`) |
| Text pair spacing wrong | wrap the pair in `.card-text-pair` (`RULES §4`) |
| List row text too big | inside a list row the wrapper is `.list-row-text-pair`, not `.card-text-pair` (`RULES §4`) |
| List row spacing off | wrong gap modifier — icons `leading-gap-md`, small images `leading-gap-lg`, large images `leading-gap-xl` |
| List rows touch each other / no divider | `.list-row` has no padding or divider; wrap each in a container (`.row-wrap` above) or use `.selector` |
| List row inside the phone frame has desktop padding | the row class is missing its `[data-platform="app"]` override in `platform-tokens.css` — a DS gap; report it rather than patching the template |
| Select chevron wrong | `arrow_drop_down`, not `expand_more` |
| Select or clear button does nothing | the JS helpers (`syncSelect`, `openSelect`, `closeSelect`, `syncHasValue`, `clearInput`) are not on the page |
| Input state not applying | `.is-error` / `.is-disabled` / `.has-value` go on `.input-field`, not `.input-control` |
| Switch not toggling | the `<input id>` must match the `<label for>` |
| Stepper disabled button looks wrong | `.disabled` is a class on `.stepper-btn`, not the HTML attribute |
| Page header and tabs show a double border | `PageHeader` with `tabs` suppresses its own border and lets the tabs draw it; in HTML, drop the header's border when tabs follow |
| Themes look identical | `data-theme` / `data-mode` are missing or misspelt on `<html>` (`RULES §1`) |
| Card has a visible border | remove it — `--bg-surface` against `--bg-base` is the edge (`RULES §2`) |
| Display text shows as caps in one theme and not another | that is the font doing its job; write title case and let the display face decide (`RULES §5`) |
| iOS selected tab pill invisible in dark mode | use `--ios-selected-tab-bg`, not `--bg-input` |
| Fonts not loading from another origin | `fonts.css` needs absolute font URLs; avoid `font-style: oblique` in Safari (see `CLAUDE.md § Gotchas`) |
| Class is in the CSS but not in `css-api.md` | run `npm run build:docs`; the reference is only as current as its last build |

---

## Contributing to the CSS

The CSS files in `css/` are the source of truth and `css-api.md` is generated
from them, so a stylesheet's opening comment is documentation. Every file uses
this header; the first prose line is what `css-api.md` shows in its index.

```
/* ============================================================
   <file-name>.css
   ============================================================
   <One sentence: what this stylesheet covers.>  ← css-api.md shows this line

   What's inside
   - <class family> — <what it is>

   Notes
   - <usage notes unique to this file; anything RULES.md already
     says is cited: see RULES §N>
   ============================================================ */

/* ============================================================
   SECTION TITLE
   ============================================================ */

/* --- Sub-section --- */
```

- **No load-order lines in headers.** `crnl-loader.js` owns the order and
  `css-api.md` regenerates the table from it (`RULES §1`).
- **No dated changelog lines.** Git holds the history.
- **Rules are cited, not restated.** A note that repeats `RULES.md` goes stale
  the day the rule is edited; write `see RULES §2` instead.
- **Token names are permanent API.** Add to the file that owns the scale and
  flag the new name before it ships (`CLAUDE.md § Adding a token`).
- **After any change** run `npm run build:docs` — it regenerates
  `docs/css-api.md` and the CSS bundle,
  then fails on any dead cross-reference — and `npm run lint:templates`
  (`RULES §10`).
