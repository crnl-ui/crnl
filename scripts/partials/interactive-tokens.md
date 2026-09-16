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

The shipped examples are `.event-row-top` / `.event-row-bottom`, where which bands get the class
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
