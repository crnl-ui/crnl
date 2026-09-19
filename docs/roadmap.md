# Roadmap

Where this system stands, what is missing, and what closing each gap is worth.
Hand-written. Numbers in it are measured, and the command that measures each
one is given so the claim can be re-checked rather than believed.

`RULES.md` says what you may do. This says what the system cannot yet do.

---

## What the positioning commits to

Three lines describe what Crnl is for. Each is a promise, and a promise is only
useful if you can fail it — so each is written here as something testable, with
where it currently stands.

### Open source. Ownable. Out of the box.

**Open source** — MIT, no CDN, no account, no telemetry, every font licence
shipped. *Met.*

**Ownable** — you can take this and it is yours: fork it, rename it, change any
token, and nothing phones home or breaks. The test is whether a fork can
diverge without fighting the original. *Met.* Theming is a clean
contract (`docs/theming.md`) and re-skinning needs no code. *Now met.* The system ships in seven cascade layers, so a consumer's own
unlayered CSS beats any of it without `!important` and without a specificity
fight — measured, not assumed. The `!important` count went from 118 to 6 in
the same pass, and the six that remain are the case the rule permits. See
gap 2.

**Out of the box** — two script tags and a screen renders, offline, themed.
*Met, with a caveat.* It is met by vendoring, not by installing: the package is
`private` and unpublished, so "out of the box" currently means "clone the box".
See gap 6.

### Simple. Standalone. Semantic.

**Simple** — one way to do each thing, and the decision gate in `RULES §3` is
short enough to hold in your head. *Met for the CSS.* Not met across both
layers: the React library uses a different vocabulary for the same choices —
`size="large"` where the CSS says `.btn-700`, `gap="sm"` where the CSS says
`.leading-gap-sm`. Learning one teaches you nothing about the other. See gap 3.

**Standalone** — no CDN, no framework requirement, no build step to use the
CSS. *Met.* This is the strongest thing about the system and worth protecting
against every future convenience that would weaken it.

**Semantic** — a class says what a thing *is*, not what it looks like. *Newly
met, and fragile.* `.event-row` and `.event-card` were domain leftovers and are
now `.split-row` and `.row-card`. But 318 of 737 classes are utilities in
`boilerplate.css` (`.p-200`, `.mt-100`, `.grid-cols-3`), which are by definition
presentational. That is a defensible trade — utilities are how you avoid a
one-off stylesheet per page — but it means "semantic" describes the component
layer, not the whole surface, and the docs should say so rather than claim
more than is true.

### AI made for AI making for non-AIs

The one that changes what to build. It says the primary *author* is an agent and
the primary *reader* of the output is a person who will never see the code. Two
consequences:

**An agent cannot be trusted to have read the prose.** It can be trusted to run
a command. Every rule that matters must therefore be executable, not written.
Before this pass, zero of the rules in `RULES.md` were checked by anything —
the file said "the linter checks all of them" and named a `surface-on-surface`
rule that did not exist. `npm run lint` now exists and runs 18 checks.
See gap 1 for the rest.

**The output is judged by someone who cannot read CSS.** They see a screen. So
the failures that matter are the ones that are invisible to the author and
obvious to the viewer: a card that only appears on hover, a colour that works in
one mode, a control a keyboard cannot reach. **All three are now caught** —
the first two by `npm run lint`, the third by `unreachable-target` and by
`npm run check:a11y`, which was gap 0 and is closed.

---

## The gaps, ranked

Ranked by what they cost, not by how hard they are.

### 0. The interaction model is mouse-only by construction — ✅ closed

**The single most serious gap.** `RULES §3 #14` says anything tappable takes a
`.surface-*` + `.scale-*` pair. That mechanism is applied to a `<div>`, and a
`<div>` is not focusable, not announced, and not operable by keyboard. So the
canonical, documented, linted way to make something interactive in this system
produces something a keyboard user cannot reach at all.

```
grep -rhoE '<div[^>]*class="[^"]*surface-[^"]*"' demo/*.html | wc -l   # 43
grep -rhoE '<div[^>]*class="[^"]*surface-[^"]*"[^>]*(tabindex|role=)' demo/*.html | wc -l   # 0
```

43 tappable surfaces across the demo sheets, none of them reachable. And `.btn`
itself has no focus rule — a real `<button>` gets only the browser default,
drawn against a background the button paints itself.

It is not a rendering bug, which is why nothing has caught it: it looks correct
in every screenshot. `check:visual` cannot see it, and a person building with a
mouse never encounters it.

**Closed.** What it took:

- A focus ring on every surface in the ladder and on `.btn` / `.btn-circle`,
  drawn with `outline` at `--border-weight-200` against a `--spacing-25`
  offset — outside the element, so it survives the `overflow: hidden` every
  card carries. `--color-interactive` keeps it visible in both modes (it
  resolves blue in light and amber in dark on `signal`). `.surface-section`
  is the one exception: it is flush to its card's edge, so its ring is drawn
  inside.
- The `<button>` reset extended to `padding`, `margin`, `color`, `text-align`,
  `font-size` and `line-height`, and `display` / `width` added to `.selector`
  and `.card-open-section-interactive`. This is what makes the rule
  followable: a tappable card becomes a real button with **no** layout change,
  verified element by element against the geometry before the conversion.
- `RULES §3 #14` rewritten to require it.
- A lint rule, `unreachable-target`: a surface + scale pair on anything a
  keyboard cannot reach. The repository is clean against it — every tappable
  `<div>` in the demo sheets and the guide is now a `<button>`, including the
  18 surface specimens, which now demonstrate the focus ring too.

**Also done, since:** `npm run check:a11y` runs axe-core over every sheet in
both modes and the colour sheet in all five themes — WCAG 2 A and AA, with its
own baseline. It runs in CI, which `check:visual` cannot: axe returns rule ids
and node targets rather than pixels, so the result is the same on any machine.

It found eight critical failures the lint rule could not see, all now fixed,
and all of them *pattern* failures rather than page ones — anything built from
the documented form had them:

- The switch's `<label>` is the track and is deliberately empty, so the input
  had no accessible name at all. It needs its own `aria-label`, which the
  guide, the CSS usage note and the demo now all say.
- The filter-bar selects had a styled `<span>` standing in for a label and no
  accessible name.

What it also found is a real finding about the palette, not the markup, and it
is gap 8.

This was the gap most aligned with the positioning. "Making for non-AIs"
includes the non-AIs who do not use a mouse.

### 1. Most of RULES.md is still prose — partly closed

`npm run lint` runs 18 checks, across CSS, markup, JSX **and the fenced
`html` examples in the guides** — a doc that teaches a class the CSS does not
have is worse than one that says nothing, because it is wrong with authority
and it is the first thing an agent reads. That pass found `.tile-visual`, a
wrapper the tile section had taught for as long as it existed and that never
shipped.

**`check:visual` now captures three widths, both platforms and a
right-to-left pass** — 98 shots, up from 32. This was the hole that mattered most: the responsive spacing and
grid utilities, every `-r` type pair and most of `platform-tokens.css` only
apply below 1100px, so a regression in any of them was invisible. It is also
what made the `!important` cleanup in gap 2 verifiable rather than hopeful.

`RULES.md` states roughly thirty rules. Still unchecked:

| Rule | Why not yet |
|---|---|
| §2 never put a border on a card | needs to know which elements are cards at author time |
| §2 never give a component an outer margin | same |
| §2 never mix content shapes in one set | needs to compare siblings in a grid |
| §2 never put a button inside a card that is itself the tap target | tractable — the tag walk already exists |
| §2 never use a pattern the system did not give you | not mechanisable, and says so |
| §5 label vs body | needs to know whether text wraps |
| §6 never hardcode content | tractable as a heuristic: a date, price or proper noun in markup |

The button-in-a-tappable-card rule is the next one worth writing; the tag walk
that `surface-on-surface` and `unreachable-target` already use gives it for
almost nothing. The content rule is worth a heuristic even at some
false-positive cost, because it is the rule most often broken and its breakage
is invisible until the data changes.

An axe-core pass belongs here too, carried over from gap 0: `check:visual` is
the only check that drives a real browser, and it now drives one at three
widths.

### 2. No cascade layers, and 118 `!important` — ✅ closed

**Closed.** The system now declares seven layers, in this order:

```
crnl.reset → crnl.tokens → crnl.primitives → crnl.components
           → crnl.patterns → crnl.utilities → crnl.platform
```

Anything a consumer writes is **unlayered**, and unlayered styles beat layered
ones whatever their specificity. So a consumer's `.selector { background: … }`
now beats the system's `.selector.is-selected`, with no `!important` and no
specificity fight. Measured both ways before and after: before, the
lower-specificity consumer rule lost; after, it wins. That is what "ownable"
was missing.

`crnl-loader.js` owns the layer map next to the load order, and defines the
boundaries by position, so the groups are contiguous by construction and the
relative precedence of any two sheets is what it always was.
`scripts/lib/load-order.mjs` parses it, so the delivery bundle wraps each sheet
in the layer the local path imports it into — one list, one cascade. The local
path uses `@import url(…) layer(…)`, because the `layer` attribute on `<link>`
is not supported anywhere yet.

**All 32 visual baselines are pixel-identical.** Getting there found three real
problems, which is the whole argument for doing this with a screenshot diff
rather than by reasoning:

- **`boilerplate.css` was simultaneously the reset and the utilities.** Load
  order let specificity arbitrate — a class-based component rule beat an
  element-based reset rule without anyone deciding. Layers removed that
  arbitration, and `* { padding: 0 }` in a late layer silently zeroed the
  padding of every card section. The two halves want opposite ends of the
  cascade, so they are now two files: `reset.css` and `boilerplate.css`.
- **The reset has to be the *first* layer, before the tokens.** Three of the
  token sheets also ship classes — `.container-*`, the spacing utilities, the
  radius and border scales, 81 in all — and `* { padding: 0 }` in a layer after
  those zeroed every container's page padding. A reset belongs before
  everything that draws, and "everything" includes the sheets whose names
  suggest they only declare values.
- **`!important` reverses layer order.** `.text-secondary`'s `!important` in
  the primitives layer began beating `.selector.is-selected .text-secondary`'s
  `!important` in the components layer, which had won on specificity for as
  long as it had existed — dark text on a dark selected row. The CSS comment
  there already said "must match to override"; matching stopped being enough.
  Fixed token-natively: `.text-secondary` now reads `var(--text-secondary)`,
  and the selected row redefines that token in scope. Custom properties resolve
  independently of layer precedence, so nothing can reorder it. One
  `!important` gone, and the pattern to copy for the rest.

**The `!important` count fell out of it: 118 → 6.** Once gap 1's
three-breakpoint and app-mode capture existed (98 shots instead of 32), this
became measurable rather than guesswork. Removed in stages, each verified
against the full shot set:

| File | Before | After | Why they went, or stayed |
|---|---:|---:|---|
| `platform-tokens.css` | 67 | **2** | Last layer, so it already beat every stylesheet. The two left fight an inline style the phone frame writes at runtime |
| `text-styles-system.css` | 32 | **0** | The colour, alignment, decoration and truncation utilities moved to the utilities layer, which is *after* components — so they win by layer |
| `boilerplate.css` | 12 | **4** | The visibility utilities won by layer too. The four left are the reduced-motion block, which has to beat inline styles |
| `ios-nav-components.css` | 4 | **0** | Same-file ordering; never needed |
| `button-components.css` | 3 | **0** | `.btn:disabled:hover` already outranks `.btn:hover` on specificity. Never did anything |

The six that remain are all the case `RULES §2` actually permits — an inline
style, which no cascade layer can reach — and each carries an escape saying
so. `npm run lint` no longer exempts any file from `no-important`, and the
rule has left the baseline entirely.

Two of those removals needed a test a screenshot cannot do. A disabled
button's `transform` only matters on hover, so it was checked by hovering it
and reading the computed value: identical with and without. Guessing there
would have been guessing.

### 3. Two vocabularies for one system — ✅ closed

The React layer named the same choices differently from the CSS:

| CSS | React, before | React, now |
|---|---|---|
| `.btn-700` `.btn-300` `.btn-100` | `size="large" \| "small" \| "xsmall"` | `size={700 \| 300 \| 100}` |
| `.btn-circle-700` `-300` | `size="large" \| "small"` | `size={700 \| 300}` |
| `.surface-washNeutral` / `.surface-card` | `surface="wash" \| "card"` | `surface="washNeutral" \| "card"` |
| `.surface-borderNeutral` / `.surface-ghost` | `surface="bordered" \| "ghost"` | `surface="borderNeutral" \| "ghost"` |

Four lookup tables whose only job was renaming what the CSS had already
named. They are gone, and the class is now derived from the prop
(`` `btn-${size}` ``) — so a new size in the CSS needs no second edit here,
and there is no table to fall out of step.

Less of the layer diverged than this gap assumed, which is worth recording:
`IconSize` was already `100 | 200 | …`, and `LeadingGap` / `TrailingGap` /
`LeadingImageSize` already used the class suffixes verbatim. The divergence
was four props, not a philosophy.

Done now rather than later because nothing is published: every call site was
a type error, the compiler listed them, and the fix was mechanical. After
publishing it would be a breaking change to somebody else's code.

### 4. The React layer is 24% of the system, and that is fine — ✅ declared

```
npm run build:inventory
# 176 of 737 classes reachable through React (24%)
```

By layer: components 63%, primitives 5%, patterns 0%, tables 0%, footer 0%.
(The number rose without a component being added: removing the prop-rename
tables in gap 3 meant a class is now built from its prop, and the inventory
scanner learned to resolve that — it had been crediting those components with
nothing.)

That is a reasonable shape for a CSS-first system. The problem is that nothing
said so, so "plus a typed React component library" in the README implied parity
that does not exist. `docs/inventory.md` now states the real number, generated,
so it cannot drift back into implication.

Five components have no Storybook story at all — `IOSHomeNav`, `IOSModal`,
`IOSNavButton`, `IOSPageNav`, `IOSTabBar`. Nothing renders them anywhere, so
nothing catches a break in them. Cheap to fix and worth doing before anything
else in the React layer.

### 5. No RTL — ✅ closed

```
grep -rhoE '\b(margin|padding|border)-(left|right)\b|\b(left|right)\s*:' css/*.css | wc -l
# 301 before, 0 now
```

**Every component and every utility is converted** —
`margin-inline-start`, `padding-inline-end`, `border-start-start-radius`,
`border-inline-start-width`, `inset-inline-start`, `text-align: start`.

**The utility classes were renamed, not just re-pointed.** `.ml-200` applying
on the right is a name that lies in exactly the mode this work exists to
support, and leaving it would have made "Semantic" false for the most-used
classes in the system. 90 renames, taking the CSS property's own names —
which is the same principle that settled gap 3:

| Was | Now | Property |
|---|---|---|
| `.ml-*` `.mr-*` | `.ms-*` `.me-*` | `margin-inline-start` / `-end` |
| `.pl-*` `.pr-*` | `.ps-*` `.pe-*` | `padding-inline-start` / `-end` |
| `.rounded-tl-*` `-tr-*` `-bl-*` `-br-*` | `.rounded-ss-*` `-se-*` `-es-*` `-ee-*` | `border-start-start-radius` … |
| `.border-l-*` `.border-r-*` | `.border-s-*` `.border-e-*` | `border-inline-start-width` / `-end` |
| `.border-left` `.border-right` | `.border-start` `.border-end` | |
| `.text-left` `.text-right` | `.text-start` `.text-end` | `text-align: start` / `end` |

**Breaking**, and done before publishing for that reason: renaming the
most-used classes in the system is free now and is somebody else's migration
later.

Verified by measurement, not just by diff. `.ms-300` computes
`margin-left: 24px` in LTR and `margin-right: 24px` in RTL; `.pe-200` and
`.rounded-ss-200` flip the same way. Of 98 shots only 12 changed, all on the
two sheets that print class names as labels, and **no page height changed
anywhere** — which is the proof that the properties behave identically in LTR
and only the printed text moved.

### 6. Not installable

The manifest is `private: true` and nothing is published, so every consumer
vendors the repository. That is a legitimate distribution model and the README
is honest about it. But it is in tension with **out of the box**, and it means
there is no version anyone can pin, no changelog, and no upgrade path — the
three things that decide whether a design system is adoptable by someone who is
not its author.

Order mattered here, and the order is now served. Publishing before gap 2
would have shipped a package consumers could not override; before gap 3, it
would have frozen two vocabularies into a public API; before gap 5, it would
have made renaming the most-used classes in the system somebody else's
migration instead of a free change. **All three are done**, and
`CONTRIBUTING.md` and `CHANGELOG.md` exist.

**Nothing technical is in front of a first release any more.** What is left is
the decision to make one: drop `private: true`, pick a version, and accept
that the names then stop being free to change. That is a judgement about
whether the surface has settled, not a task.

### 7. Smaller, real, cheap

- **The elevation ladder is three steps in dark and two in light.** In every
  theme, and in the base theme, `--org-sheet` equals `--org-base` — light mode
  runs `#FFFFFF` → a tinted surface → `#FFFFFF` again, so a modal sheet is the
  same colour as the page behind it and its shadow is the only edge it has.
  Dark runs three genuinely distinct rungs (`#0C1118` → `#171E29` → `#212A38`
  in `signal`) and carries its elevation in surface colour, the way dark UI
  generally should. Both are defensible; neither is written down. `RULES §2`
  describes the ladder as three steps unconditionally, which is true in one
  mode. Say which, and say that the shadow is load-bearing in light.

  ~~The related smell is the duplicated `[data-mode="dark"]` shadow block.~~
  Deleted — it restated the light values byte-for-byte, implying a decision
  nobody had made, and inherits identically without it. `RULES §2` now states
  the two-rung/three-rung split and that the shadow is load-bearing in light.
- **No shadow-colour tokens.** Six hardcoded shadow colours left, down from
  eleven: the five that were exactly an existing alpha token now use it. The
  rest need alphas the scales do not have — 0.06, 0.08, 0.12, 0.2 — so closing
  this means either adding a `--shadow-*` scale or rounding shadows onto the
  existing steps, which changes what renders. A token name is permanent API
  (`CLAUDE.md § Adding a token`), so it wants deciding rather than assuming.
- ~~**One `prefers-reduced-motion` block**~~ — done with gap 0. One global
  block, durations collapsed rather than animations removed.
- **`check:visual` is not in CI**, and is the only check that is not. Its
  baselines are pixels, and pixels are specific to the machine and browser
  build that made them, so it runs locally. Pinning the renderer to a
  container would fix that. This used to be the blocker for axe-core and RTL
  too; it no longer is — `check:a11y` runs in CI on its own, because axe
  returns rule ids rather than pixels, and the RTL pass rides in
  `check:visual` locally. So this now unlocks one thing, not three, which
  makes it a smaller prize than it looked.
- ~~**No `CONTRIBUTING.md`, no `CHANGELOG.md`**~~ — both written. They were
  the last prerequisites for gap 6, which is now unblocked entirely.
- ~~**Five components with no Storybook story**~~ — done. `IOSHomeNav`,
  `IOSModal`, `IOSNavButton`, `IOSPageNav` and `IOSTabBar` all have one, so
  every component in the library renders somewhere.
- ~~**Storybook hand-wrote the load order**~~ — done, and it had already gone
  wrong: `RULES §1` forbids a second copy of the list precisely because it
  drifts, and `.storybook/preview.ts` was missing `ui-fonts.css` and had no
  layers, so Storybook rendered a different cascade from every other surface.
  It now imports one generated file, `css/crnl-layers.css`, which
  `build:css-bundle` writes from the loader's own list. Verified that Vite
  preserves `@layer` through the build.

---

### 8. 103 contrast failures, and `check:themes` checks three pairs

`npm run check:a11y` reports 103 WCAG AA contrast violations across the sheets.
They are not all equal, and the split is the useful part:

| | Count | What it is |
|---|---:|---|
| Disabled states | 28 | `.text-disabled`, `.is-disabled`, `.text-placeholder`. **WCAG 1.4.3 exempts disabled controls**, so these are conformance-neutral. axe flags them anyway |
| Brand as text | 22 | `.text-brand-core` / `-light` / `-inverted` used as a text colour. Between 1.07 and 2.5 — a brand colour is picked to be a brand, not body copy |
| Status as text | 21 | `.text-warning` at 2.76, `.text-info` at 4.23 — the second is a small nudge from passing |
| **Shipped components** | **32** | the ones that are unambiguously bugs |

That last row is the one to act on:

- **`.btn-destructive` fails at 4.17** — a shipped button, in all three sizes.
- **`.input-message` on `.is-error` fails at 4.0** — the text that tells somebody
  what went wrong.
- **The stat table's header fails at 2.84.**
- `.text-inverted` and `.surface-borderWhite` label at 3.12.

**`check:themes` did not catch any of this, and the docs overstated what it
does.** It checks exactly three pairs — the primary button, the transactional
button, and `--color-interactive` against `--org-base`. Two button types out of
nine. "Clears 4.5:1 on its button and accent pairs" was true of the pairs it
checks and misleading about the rest; the wording is fixed.

Fixing these means changing token values, which is a brand decision rather than
a mechanical one, so they are recorded rather than adjusted:

1. **The component failures** should just be fixed — a destructive button and an
   error message have to be readable. The cheapest route is a darker
   `--status-error` in light mode, checked against both.
2. **The brand-as-text utilities** need a decision: drop them, restrict them to
   display sizes (WCAG allows 3:1 at ≥24px, which most would then pass), or ship
   accessible variants alongside.
3. **`check:themes` should check every button type**, not two. That is a small
   change to one array and it turns this from a thing somebody noticed into a
   thing that cannot come back.

## What not to build

Scope discipline is most of what keeps "simple" true. These come up and should
be declined:

- **A second button type, surface or size.** Nine types and three sizes already
  exceed what a screen needs. New need → an existing one, or the need is
  misnamed (`RULES §2`).
- **A component for every class.** The React layer covering 19% is correct. A
  `<Spacer>` or a `<Grid>` wrapping a utility class adds a name, a file and an
  import to save nothing.
- **Runtime theming via JavaScript.** Two attributes on `<html>` is the whole
  mechanism, and it works with no script at all. A theme provider would make
  the system require a framework to do what a static attribute already does.
- **A CSS-in-JS build.** It would end **standalone**, which is the system's
  strongest property.
- **More display faces.** 145 is already past the point of choice paralysis.
  Curation would add more than addition.

---

## Debt ledger

`scripts/lint-baseline.json` records what the repository carries today: **163
findings across 16 file/rule pairs**, down from 186. The build fails above
those numbers and is quiet at or below them, so existing debt does not block
work and nothing can add to it.

| Rule | Count | Closed by |
|---|---:|---|
| `no-type-override` | 74 | components composing text classes instead of restating them |
| `no-hardcoded-spacing` | 42 | spacing tokens for the remaining literals |
| `no-hardcoded-colour` | 40 | mostly `ios-nav-components.css` glass and gradients |
| `no-hardcoded-shadow-colour` | 6 | gap 7 — these six need a `--shadow-*` alpha the scales do not have (0.06, 0.08, 0.12, 0.2). The five that matched an existing token already use it |
| `surface-needs-scale` | 1 | one demo specimen, individually checkable |
| ~~`no-important`~~ | ~~18~~ **0** | gap 2 — cascade layers. Gone from the baseline |

Every number should only go down. `node scripts/lint.mjs --update-baseline`
locks in a reduction, and CI fails if a run comes in under the recorded
baseline without the file being updated — otherwise the next regression would
land free.

## Suggested order

Gaps 0, 2, 3, 4 and 5 are closed, and most of 7. What remains, in the order
it is worth doing:

1. **Gap 8 — the 32 component contrast failures.** `.btn-destructive` at 4.17
   and `.input-message` on `.is-error` at 4.0 are shipping today; a
   destructive button and an error message are the two things that most need
   to be readable. Needs token values decided, so it belongs with a design
   pass rather than a refactor.
2. **Gap 8's second half — extend `check:themes` to every button type.** Three
   pairs is two button types out of nine, which is why none of the above was
   caught. A small change to one array, and it turns a thing somebody noticed
   into a thing that cannot come back. Do it *after* 1, or it fails on landing.
3. **Gap 7 — a `--shadow-*` alpha scale**, or a decision to round the six
   remaining shadows onto the existing steps. Either way a token decision.
4. **Gap 1 — the remaining prose rules.** The `RULES §6` hardcoded-content
   heuristic is the valuable one and the one that will produce false
   positives; worth a deliberate choice about that trade rather than a
   default. The button-in-a-tappable-card rule is already done.
5. **Gap 7 — pin the renderer** so `check:visual` can run in CI. Smaller prize
   than it was, now that `check:a11y` runs there independently.
6. **Gap 6 — publish.** Nothing technical blocks it; it waits on the surface
   feeling settled.
