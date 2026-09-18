# Contributing

The short version: read `RULES.md`, run `npm run check`, and if you are adding
surface to the system, add it in all three places at once.

## Setup

```bash
npm install
npm run dev              # Storybook for the React components
```

Any `.html` in `demo/` opens directly in a browser — no server, no build step.
That is deliberate: editing a stylesheet and reloading has to work with nothing
in between.

## Before you open a pull request

```bash
npm run check            # lint + themes, assets, icons, exports, demo coverage
npm run check:visual     # 98 screenshots, diffed against your local baselines
```

`npm run check` also runs in CI. `check:visual` does not, and cannot until the
renderer is pinned to a container — its baselines are specific to the machine
and browser build that made them, so a baseline from a different machine is
noise. Run it locally; it is the only check that looks at what rendered.

The first `check:visual` writes the baselines. After that, when a change is
intended, **look at `tests/visual/diff/` before accepting it** — each failure
writes a three-panel diff and the new capture. Then
`npm run check:visual -- --update`. The point of a baseline is that a person
saw it.

## The rules are executable

`RULES.md` is the only file that states a design rule. Fourteen of them are
checked by `npm run lint`, which reads the same two sources you do — the class
and token surface from `docs/css-api.json`, and the rules themselves — and
names the section for every finding.

```bash
node scripts/lint.mjs path/to/file.html   # one file
node scripts/lint.mjs --json              # findings as data
node scripts/lint.mjs --strict            # ignore the baseline, see real debt
```

**The baseline.** `scripts/lint-baseline.json` records the debt the repository
already carries, per file and per rule. The build fails *above* those counts
and is quiet at or below them, so existing debt does not block your work and
nothing you write can add to it. If you fix something, run
`node scripts/lint.mjs --update-baseline` and commit the result — CI fails a
run that comes in under the baseline without it, because otherwise a fix is
banked silently and the next regression lands free.

**Escapes** need a reason, and an escape without one is itself a finding:

```html
<!-- crnl-lint-disable-next-line unknown-class -- page scaffolding, see sheet.css -->
```

Do not add one to make a run go green. If a rule is wrong, say so in the pull
request — one has been wrong before and was fixed rather than escaped.

## Adding to the system

**A class** has to arrive in three places in the same commit, or a check fails:

1. the rule, in the stylesheet that owns that layer;
2. a specimen on the demo sheet for that topic — or its name printed in the
   page copy, if it is one of a utility scale (`npm run check:demo`);
3. `npm run build:docs`, so `css-api.*` and `inventory.*` know about it.

**A token** goes in the file that owns its scale, follows the existing naming,
and gets flagged in the pull request before it ships. Token names are permanent
API. Never resolve a missing step with an inline literal (`RULES §2`).

**A stylesheet** goes in `crnl-loader.js` — which owns the list, the order and
the cascade layer — and then `npm run build:docs`. Never hand-write a `<link>`
or a second copy of the load order (`RULES §1`); every copy of that list has
drifted, including the one in Storybook's config.

**A theme** is tokens only, in three blocks. `docs/theming.md` has the
contract. Run `npm run check:themes` after.

**A pattern the system does not have** is the one case that needs a
conversation before code. Name the *need*, search `docs/inventory.md`,
`docs/css-api.md` and `demo/` for it, and if nothing serves it, say so in the
pull request and build it from tokens and primitives only. `RULES §2` forbids
building it quietly, not building it.

## Cascade layers

The CSS ships in seven layers:

```
crnl.reset → tokens → primitives → components → patterns → utilities → platform
```

Two things follow that are easy to get wrong:

- **A later layer beats an earlier one regardless of specificity.** A reset
  rule cannot be out-specified by a component rule; it is simply earlier.
- **`!important` reverses that order.** An important declaration in an
  *earlier* layer beats one in a later layer. When a component needs to change
  what a utility paints, **set the token, don't re-declare the class** —
  custom properties resolve independently of layers.

There are six `!important` in the whole system and each carries a written
reason. If you are reaching for a seventh, you are almost certainly fighting
something a layer already handles.

## What this repository ships

The design system, not a content layer. No names, dates, prices or fixtures in
markup that a data source owns (`RULES §6`). Persona fixtures may be literals
and should be obviously synthetic — `example.com`, the reserved `555-01xx`
phone range.

## Generated files

Never hand-edit these; regenerate them:

| Generated | By |
|---|---|
| `docs/css-api.md`, `docs/css-api.json` | `npm run build:css-api` |
| `docs/inventory.md`, `docs/inventory.json` | `npm run build:inventory` |
| `css/crnl.css`, `css/crnl-layers.css` | `npm run build:css-bundle` |
| `css/fonts.css`, `css/display-fonts.css`, `fonts/catalog.json` | `npm run build:fonts` |
| `fonts/inter.woff2`, `fonts/material-symbols-rounded.woff2` | `npm run build:ui-fonts` |

`npm run build:docs` covers the first three. CI regenerates them and fails if
anything moved — a stale reference is the one failure mode no other check sees.

## Commit and pull request style

Say what changed and why it was worth changing. If a check caught something
while you were working, that belongs in the message: the interesting part of a
change is usually what it turned up.

## Licence

MIT for the code. By contributing you agree your contribution ships under it.
Fonts and brand marks are not MIT and are not yours or ours to relicense — see
`README.md § Licence` and `images/NOTICE.md`.
