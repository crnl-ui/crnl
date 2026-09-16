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
