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
diverge without fighting the original. *Mostly met.* Theming is a clean
contract (`docs/theming.md`) and re-skinning needs no code. What is not yet
ownable is the **cascade**: with no `@layer` and 118 `!important` declarations,
a consumer's own CSS cannot reliably override a component without escalating in
the same way. Ownable means overridable. See gap 2.

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
rule that did not exist. `npm run lint` now exists and checks twelve of them.
See gap 1 for the rest.

**The output is judged by someone who cannot read CSS.** They see a screen. So
the failures that matter are the ones that are invisible to the author and
obvious to the viewer: a card that only appears on hover, a colour that works in
one mode, a control a keyboard cannot reach. Two of those three are now caught
statically. The third is gap 0, and it is the largest thing wrong with this
system.

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

**Still open from this gap:** an axe-core pass in `check:visual`, which already
drives a real browser and is the only check that could run one. The lint rule
catches the shape; axe would catch the rest (contrast, names, roles).

This was the gap most aligned with the positioning. "Making for non-AIs"
includes the non-AIs who do not use a mouse.

### 1. Most of RULES.md is still prose

`npm run lint` checks twelve rules, across CSS, markup, JSX **and the fenced
`html` examples in the guides** — a doc that teaches a class the CSS does not
have is worse than one that says nothing, because it is wrong with authority
and it is the first thing an agent reads. That pass found `.tile-visual`, a
wrapper the tile section had taught for as long as it existed and that never
shipped.

`RULES.md` states roughly thirty rules. The unchecked ones are not the trivial
ones:

| Rule | Why it is not checked yet |
|---|---|
| §2 never put a border on a card | needs to know which elements are cards at author time |
| §2 never give a component an outer margin | same |
| §2 never mix content shapes in one set | needs to compare siblings in a grid |
| §2 never put a button inside a card that is itself the tap target | tractable — the tag walk already exists |
| §2 never use a pattern the system did not give you | not mechanisable, and says so |
| §5 label vs body | needs to know whether text wraps |
| §6 never hardcode content | tractable as a heuristic: a date, price or proper noun in markup |
| §9 works at all three breakpoints | `check:visual` could capture three widths instead of one |

Two of these — the button-in-a-tappable-card rule, and three-breakpoint
capture — are small and worth doing next. The content rule is worth a heuristic
even at some false-positive cost, because it is the rule most often broken and
the one whose breakage is invisible until the data changes.

### 2. No cascade layers, and 118 `!important`

```
grep -o '!important' css/*.css | wc -l   # 118
grep -c '@layer' css/*.css               # 0 files
```

Concentrated in `platform-tokens.css` (67) and `text-styles-system.css` (33),
where they exist to beat inline styles the prototype harness writes — which is
the one use `RULES §2` allows in spirit and forbids in letter.

The cost is not tidiness. It is that a consumer cannot override a component
without joining the arms race, which is what makes the system un-ownable in
practice. Wrapping the load order in `@layer crnl.tokens, crnl.primitives,
crnl.components, crnl.patterns` makes every consumer rule win by default, with
no specificity fight, and lets most of the 118 go.

`crnl-loader.js` already owns the load order, so the layer statement has exactly
one place to live. This is a contained change with a large payoff, and it is
the prerequisite for gap 6.

### 3. Two vocabularies for one system

The React layer names the same choices differently from the CSS:

| CSS | React |
|---|---|
| `.btn-700` `.btn-300` `.btn-100` | `size="large" \| "small" \| "xsmall"` |
| `.leading-gap-sm` … `-xl` | `gap="sm" \| "md" \| "lg" \| "xl"` |
| `.surface-washNeutral` / `.surface-card` | `surface="wash" \| "card"` |

Three sizes, two names each. The CSS numbers are the ones in `css-api.md`, on
the demo sheets, and in every rule. An agent that has read the system and then
writes `<Button size="700">` gets a type error for being right.

Either the React props take the CSS names, or the mapping is generated and
documented in one place. The first is a breaking change to 18 components and
worth making now, while the surface is small and nothing is published.

### 4. The React layer is 19% of the system, and that is fine — but undeclared

```
npm run build:inventory
# 142 of 737 classes reachable through React (19%)
```

By layer: components 55%, primitives 5%, patterns 0%, tables 0%, footer 0%.

That is a reasonable shape for a CSS-first system. The problem is that nothing
said so, so "plus a typed React component library" in the README implied parity
that does not exist. `docs/inventory.md` now states the real number, generated,
so it cannot drift back into implication.

Five components have no Storybook story at all — `IOSHomeNav`, `IOSModal`,
`IOSNavButton`, `IOSPageNav`, `IOSTabBar`. Nothing renders them anywhere, so
nothing catches a break in them. Cheap to fix and worth doing before anything
else in the React layer.

### 5. No RTL

```
grep -rhoE '\b(margin|padding)-(left|right)\b|\b(left|right):' css/*.css | wc -l   # 247
grep -rhoE '(margin|padding)-(inline|block)' css/*.css | wc -l                     # 6
```

247 physical properties against 6 logical ones. Every row is leading-first,
every chevron points right, every safe-area inset is one-sided.

Mostly mechanical — `margin-left` → `margin-inline-start` — but "mostly" hides
the two real decisions: the icons that must mirror and the ones that must not,
and the phone frame's fixed geometry. Worth doing as one deliberate pass with a
`dir="rtl"` column added to `check:visual`, not incrementally.

### 6. Not installable

The manifest is `private: true` and nothing is published, so every consumer
vendors the repository. That is a legitimate distribution model and the README
is honest about it. But it is in tension with **out of the box**, and it means
there is no version anyone can pin, no changelog, and no upgrade path — the
three things that decide whether a design system is adoptable by someone who is
not its author.

Order matters here: publishing before gap 2 ships a package consumers cannot
override, and publishing before gap 3 freezes two vocabularies into a public
API. Publish after those, not before.

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

  The related smell is that `--shadow-sheet-*` and `--shadow-modal-*` are
  restated byte-for-byte under `[data-mode="dark"]`
  (`css/border-effects-tokens.css`). The values are right — dark does not need
  its own — but a duplicated block implies a decision somebody made, and
  nobody did. Delete it; it inherits identically and stops lying.
- **No shadow-colour tokens.** 11 hardcoded shadow colours with nothing to
  reach for — the alpha scales are for surfaces and text. A `--shadow-*` colour
  scale would close a whole lint category.
- **One `prefers-reduced-motion` block** against ~100 transitions and the
  `.scale-*` transform that every interactive element carries. One global block
  in `boilerplate.css` covers it.
- **`check:visual` is not in CI.** Baselines are machine-specific, so it runs
  locally. Pinning the renderer to a container makes it a CI check, and it is
  the only check that could also run axe-core (gap 0) and RTL (gap 5). One
  change unlocks three.
- **No `CONTRIBUTING.md`, no `CHANGELOG.md`.** Both are prerequisites for gap 6.

---

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

`scripts/lint-baseline.json` records what the repository carries today: **186
findings across 22 file/rule pairs.** The build fails above those numbers and is
quiet at or below them, so existing debt does not block work and nothing can add
to it.

| Rule | Count | Closed by |
|---|---:|---|
| `no-type-override` | 74 | components composing text classes instead of restating them |
| `no-hardcoded-spacing` | 42 | spacing tokens for the remaining literals |
| `no-hardcoded-colour` | 40 | mostly `ios-nav-components.css` glass and gradients |
| `no-important` | 18 | gap 2 — cascade layers |
| `no-hardcoded-shadow-colour` | 11 | gap 7 — a shadow-colour scale |
| `surface-needs-scale` | 1 | one demo specimen, individually checkable |

Every number in that table should only go down. `node scripts/lint.mjs
--update-baseline` locks in a reduction, and CI fails if a run comes in under
the recorded baseline without the file being updated — otherwise the next
regression would land free.

---

## Suggested order

1. ~~**Gap 0** — focus rings, the role rule, the lint rule.~~ Done, bar the
   axe-core pass, which rides with pinning the renderer (gap 7).
2. **Gap 2** — `@layer`, and the `!important` count falls out of it.
3. **Gap 3** — align the React vocabulary with the CSS, while the surface is
   small and nothing is published.
4. **Gap 7** — the cheap ones, in an afternoon.
5. **Gap 1** — two more lint rules and three-breakpoint capture.
6. **Gap 5** — RTL as one deliberate pass.
7. **Gap 6** — publish, once 2 and 3 have landed.
