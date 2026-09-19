# Changelog

Notable changes to Crnl. Newest first.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions will follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
from the first published release; until then the system is pre-1.0 and **class
names, token names and component props can move**. Pin a commit.

## [Unreleased]

### Added

- **`npm run lint`** — the static check `RULES.md` had described for as long as
  it existed but that had never been written. Fourteen rules across CSS,
  markup, JSX and the fenced `html` examples in the guides, each finding naming
  the section it breaks. `--json` for agents, inline escapes that require a
  written reason, and `scripts/lint-baseline.json` so existing debt does not
  block work while nothing can add to it.
- **Cascade layers** — `crnl.reset → tokens → primitives → components →
  patterns → utilities → platform`. Anything a consumer writes is unlayered and
  therefore beats all of it, with no `!important` and no specificity fight.
- **`css/reset.css`** — split out of `boilerplate.css`, which had been both the
  reset and the utilities. The two halves want opposite ends of the cascade.
- **`css/crnl-layers.css`** — generated. One import for anything driven by a
  bundler, so Storybook and a consuming app get the same cascade a page gets.
- **A focus treatment for the whole surface ladder**, and for `.btn` /
  `.btn-circle`. Drawn outside the element so a card's `overflow: hidden` does
  not crop it, in `--color-interactive` so it stays visible in both modes.
- **`prefers-reduced-motion`, honoured globally.** Previously one block in the
  whole system respected it, against ~100 transitions.
- **`docs/inventory.md` / `.json`** — generated. What exists, by layer, and
  what the React layer covers.
- **`docs/roadmap.md`** — what the system cannot yet do, ranked, measured.
- **RTL support throughout** — logical properties in every component *and*
  every utility, with the directional utility classes renamed to match the
  properties they set (see Changed).
- **`check:visual` now captures 98 shots** — three breakpoints, both platforms
  and a right-to-left pass, where it captured 32 at one width in one platform.
- Storybook stories for the five iOS components that had none.
- **`npm run check:a11y`** — axe-core over every sheet in both modes, WCAG 2 A
  and AA, with its own two-way baseline. Runs in CI, which `check:visual`
  cannot. It found eight critical failures, all fixed, and 103 contrast
  violations now recorded as `docs/roadmap.md § gap 8`.
- `CONTRIBUTING.md`, `CHANGELOG.md`.

### Changed

- **`!important`: 118 → 6.** Cascade layers retired all but six, and the six
  that remain are the one case `RULES §2` permits — beating an inline style,
  which no layer can reach. Each carries a written reason.
- **React props are the CSS names.** `size="large"` → `size={700}`;
  `surface="bordered"` → `surface="borderNeutral"`; likewise `"wash"` →
  `"washNeutral"`. Four lookup tables that existed only to rename what the CSS
  had already named are gone. **Breaking.**
- **The directional utility classes are renamed to logical names.** `.ml-*` /
  `.mr-*` → `.ms-*` / `.me-*`; `.pl-*` / `.pr-*` → `.ps-*` / `.pe-*`;
  `.rounded-tl-*` and siblings → `.rounded-ss-*` and siblings; `.border-l-*` /
  `.border-r-*` → `.border-s-*` / `.border-e-*`; `.border-left` /
  `.border-right` → `.border-start` / `.border-end`; `.text-left` /
  `.text-right` → `.text-start` / `.text-end`. 90 renames. A name that says
  "left" while applying on the right is worse than no name. **Breaking.**
- **`.event-row` → `.split-row`**, `.event-card` → `.row-card`, `EventRow` →
  `SplitRow`. A brand-neutral system should not ship domain-named classes.
  `SplitRow` is now structural, with slots, where it had hardcoded copy.
  **Breaking.**
- `.row-card` is layout only; it takes a `.surface-*` + `.scale-*` pair to
  become tappable, like anything else. **Breaking.**
- The text colour, alignment, decoration and truncation utilities moved from
  `text-styles-system.css` to the utilities layer, which is what let all 32 of
  their `!important` go.
- `.text-primary` / `.text-secondary` read the semantic token rather than the
  raw scale, so a context can redefine `--text-secondary` in scope instead of
  fighting the class.
- `.selector` and `.card-open-section-interactive` set their own `display` and
  `width`, and the `<button>` reset went further, so a tappable element can be
  a real `<button>` with no layout change.
- `RULES §3 #14` now requires a tappable surface to be on a focusable element.
- `.storybook/preview.ts` imports one generated file instead of hand-writing
  the load order — the copy it kept was missing `ui-fonts.css` and had no
  layers.
- Documentation rewritten: `README.md`, `CLAUDE.md`, `demo/README.md`, and
  `docs/design-guide.md` de-domained.

### Fixed

- **The switch had no accessible name.** Its `<label>` is the track and is
  deliberately empty, so every switch built from the documented form was
  unnamed. It carries its own `aria-label` now, in the guide, the CSS usage
  note and the demo.
- **The filter-bar selects had no accessible name** — a styled `<span>` stood
  in for a label.
- Every `Card` Storybook story rendered unstyled — `.label-bold-30`,
  `.body-20` and `.title-30` do not exist.
- `.event-card:hover { opacity }` reimplemented the press mechanism in the
  product layer, which `RULES §2` forbids.
- `.event-row-label` / `-sublabel` duplicated the `.title50-r` and
  `.labelRegular20-r` responsive pairs exactly. Removed.
- `.tile-visual`, a wrapper the design guide taught and that never shipped.
- `.is-warn`, a no-op class left on nine demo sheets.
- The prototype harness discovered themes and faces one stylesheet level deep,
  so it found none under `@import` / `@layer` and fell back to an empty face
  picker.
- Several colour literals equal to a token that already held that value.
- A dangling reference to a `walkthrough.css` that does not exist.

### Removed

- `.event-row-label`, `.event-row-sublabel`, `.is-warn`.
- The duplicated `[data-mode="dark"]` shadow block — byte-identical to light,
  implying a decision nobody had made.

### Known gaps

Tracked in `docs/roadmap.md`, with what closing each one takes:

- 168 lint findings in the baseline, mostly components restating type instead
  of composing a text class.
- No axe-core pass; `check:visual` is the only check that drives a browser.
- `check:visual` is not in CI — its baselines are per-machine until the
  renderer is pinned to a container.
- Not published to npm. `private: true` on purpose.

## Before this

The system was extracted from a product codebase, made brand-neutral, and
renamed to Crnl. There is no changelog for that period; `git log` has it.
