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
