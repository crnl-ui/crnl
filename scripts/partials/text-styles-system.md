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
- Row title in a list → `.labelBold30`, or `.event-row-label` inside an event row
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
