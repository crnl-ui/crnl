# Font Lab — handoff

Context for picking this work back up. The README documents *what each tool
does*; this file covers what the README does not: the mechanisms that took real
effort to find, and the threads left open.

Everything lives in `tools/font-lab/`.

---

## The tools

| File | Role |
|---|---|
| `font-lab-1.html` | The original selection tool: search all 1,892 Latin Google Fonts, compare against a screenshot of a paid face, favourites. |
| `specimen-lab.html` | The metrics and contact-sheet generator — the sans & serif narrowing pass. |
| `font-lab-2.html` | Decides the spec. Editing tool: ramp, screens, weight / tracking / case / nudge, exports. |
| `index.html` | Font Lab 3 — browses the built library. Read-only: ramp, screens, Find a match. |
| `lineage-audit.html` | The written record of what was tested and what changed. |

**All of them need `http://`** — on `file://` the browser blocks iframe styling
and cross-document font injection. Serve from the repo root:

```bash
python3 -m http.server 8000
# http://localhost:8000/tools/font-lab/
```

`built-fonts/` is 64 MB of TTFs and is committed deliberately: it is the actual
deliverable, and the desktop and Figma install set. `_build/sources/` is a
download cache and is gitignored — `build_fonts.py` re-fetches on demand.

---

## Mechanisms worth not rediscovering

**Google Fonts is unreachable; the GitHub repo is not.** `fonts.googleapis.com` fails
from the sandbox and from the cloud, but `raw.githubusercontent.com/google/fonts` works.
That is how all 145 families were fetched — via `METADATA.pb` per family under
`ofl|apache|ufl/<slug>/`. Any future font work should go the same way.

**Every built family is single-weight.** `nameID 1` is the token name, the subfamily
is `Regular` (or `Italic`), and `usWeightClass` carries the real weight. So a 900-weight
face loads as `{ family: 'A-Game Caps', style: 'Regular' }` — **never `'Black'`**.
Guessing a style name from the weight fails every Figma load. This is the single most
common way to break the Figma specimen work.

**The nudge is in the metrics, not a token.** There is no vertical-offset token, so the
correction Cornelius dialled per family is baked into each font's `hhea`/`sTypo`/`usWin`
ascent and descent. Box height is preserved; only its midpoint moves. Nothing at
runtime should try to re-apply it.

**Caps are in the glyphs.** The caps cuts remap lowercase codepoints in `cmap` to the
uppercase glyphs — deliberately *not* the outline-copying approach in
`pitches/_scripts/make_autocaps.py`, because remapping keeps GPOS kerning addressing the
real uppercase glyph. Never stack `text-transform: uppercase` on top.

**Vertical-metrics measurement has two traps**, both of which produced readings that
contradicted the screen: measure the case that actually ships (not the mixed-case
sample), and measure a descender-free probe (`HEBI` / `Hbkl`) rather than the ink
bounding box — the Q tail and J in `BOXY MVP WALTZED QUICK JABS` drag the ink centre far
enough down to report a face whose caps ride high as sitting low.

**`library3.js` is generated — put new per-font data beside it, not in it.**
`_build/make_library3.js` rebuilds it from the spec export plus
`built-fonts/manifest.json`, so anything hand-added there dies on the next run. The style
categories imported from Figma therefore live in `font-categories.json`, keyed by token
name and loaded separately. The join is on **`token`** (the library name — A-Game, Almanac),
not on `n`, which is the upstream family (Phudu, Bitter); getting that backwards produces
a clean 0/145 match and looks like the data is wrong. Verified 145/145 both ways.

Worth knowing before anyone tries to derive these instead: the existing `lane` field does
**not** predict the Figma category. A Grotesque splits 10 Clean / 3 More Character, a
Humanist 6 / 8, and so on across every lane. The taxonomy is a separate editorial axis.

**Figma folds two axes into one category name; do not import it that way.** The nine
categories are four styles crossed with caps-or-not — *Clean Caps Sans Serif* against
*Clean Sans Serif* — plus *Unassigned — no caps sibling*. A first pass collapsed the pairs
to five style values and it was wrong twice over: it discarded the case axis entirely, and
it turned "no caps sibling" into a style, where it behaved as a catch-all for the
roman-only families (23 of its 25 ship no caps cut). Style and case are stored and filtered
separately now: style from `font-categories.json`, **case from each family's own `cuts`**,
which is the truer source — it disagreed with Figma's caps listings on five families
(`Big Game`, `Stanchion`, `Turnstile` listed as caps with no caps cut; `Gateway Semi
Expanded`, `Varsity SC` the reverse).

**111 of 145 families ship both a caps and a roman cut, and the roman ones were
unreachable.** `loadFace` and `applyToDoc` both resolved `cuts.caps || cuts.roman`, so a
third of the library could never be seen. `loadFace` now takes an explicit cut and the
Non-caps filter renders the roman one. Note the picker's identity is still the family
(`state.fonts` holds `f.n`), so a *pick* still resolves caps-first — making the two cuts
separately selectable would change the shape of the export and is not done.

**`--neutral-*` and `--inverted-*` are mirror alpha ramps, not a light/dark pair.**
On a `data-mode="light"` page `--neutral-N` is black at the same opacity `--inverted-N`
is white (100 → 0.04, 200 → 0.1, 500 → 0.4/0.55, 700 → 0.65/0.75, 1000 → solid). Neither
flips with the mode, which is what lets one page run a light form and a black preview
panel — each region uses the ramp that contrasts with its own background:
`--neutral-*` and the light semantics (`--bg-base`, `--bg-input`, `--text-primary`,
`--border-default`) in the form, `--inverted-*` in the panel. **Do not mix them** — a
stray `--inverted-700` in the form is white text on white, and it fails silently.
Note `--text-tertiary` and `--border-strong` are **undefined** here; don't reach for them.

Two accent consequences of the light form, both worth keeping in mind for any other
tool that inverts: a theme's `--brand-inverted` is chosen to sit on its dark
surface — on white it is usually weak, and at a disabled 35% it all but disappears, so the primary
action uses `--interactive-primary` / `--interactive-primary-text` and the accent is left
on the picked-font chips where it is decorative. Focus rings moved to
`--color-interactive` for the same reason.

**Nested CSS comments once broke the entire design system stylesheet.** A `/* … */`
inside a `/* … */` block closed it early and silently killed every text style in
`text-styles-system.css`. Assert comment balance after editing any CSS.

---

## Build scripts

All in `_build/`, all re-runnable:

```bash
python3 _build/build_fonts.py --seconds 600      # 256 roman cuts
python3 _build/build_italics.py --seconds 600    # 113 italic cuts
node    _build/make_library3.js                  # library3.js for Font Lab 3
python3 _build/make_matches.py font-match-research.md matches.js display-specs-2026-08-31.json
python3 _build/make_paid_index.py                # applies corrections, writes matches.js + paid-index.json
python3 _build/verify.py                         # structural check on all built cuts
python3 _build/vector_check.py                   # embedding check (needs the fetch in _build/external/README.md)
```

`build_fonts.py` and `build_italics.py` are time-boxed and resumable via
`_build/state*.json` — they were written that way because the cloud shell capped each
call at ~45 s. **In Claude Code that constraint is gone**; pass a large `--seconds` and
they run in one pass.

`_build/lineage_corrections.py` holds every correction to the font-match research as one
readable line with the evidence that produced it and a `via` field (`vector`,
`external`, `knowledge`). Disagree with one and it is a one-line edit plus a re-run.

---

## Things Claude Code can do that the cloud session could not

- **Install the fonts.** `built-fonts/install-fonts.sh` (`defaults` / `roman` / `all`)
  copies into `~/Library/Fonts`; `uninstall-fonts.sh` reverses it by manifest. The cloud
  bridge could not reach `~/Library`, so this has never actually been run.
- **Run the servers and open the tools** without a device bridge.
- **Commit.** See the git section above.
- **Drive Figma** via the figma-console MCP — `figma-specimen-prompt.md` is a ready
  prompt for building the 145-family specimen sheet, and depends on the fonts being
  installed and Figma restarted first.

---

## Open threads

**Font Lab 2 still says "As drawn"** where Font Lab 3 now says "Standard", and still
carries the Metrics badge and filter that were removed from v3 as finished work. Left
alone because v2 is where that flag was doing a job.

**187 of the 602 paid families are tier-2 routing** — harvested catalogue names with no
confidence claim, existing so a search resolves. Promoting them is the obvious next
quality pass.

**The embedding check covers 57 of 145 families.** The fontjoy dataset predates most of
the library. `_build/vector_check.py` re-runs the whole test in one command when a
current embedding exists.

**`Alumni Sans` carries the only unresolved spec note** — "Also size?" — from the
original review.

**`lineage-audit.html`** is the written record of what was tested and what changed. Its
recommendations have all been applied except the two porous-boundary definitions
(R06/R07 slabs, S07/S09 condensed), which were handled by giving the affected families a
secondary lineage rather than by redrawing the lineage definitions themselves.

---

## Conventions this work has followed

- **Verify in a real browser.** Every UI change was checked with headless Chromium —
  computed styles, rendered pixels, downloads — not by reading the diff. Several bugs
  (the vertical-metrics sign, the stepper specificity, the screens falling back to the
  theme fonts) were only visible that way.
- **Say what is uncertain.** Confidence ratings are conservative, tier-2 rows carry no
  confidence at all, borrowed fixtures are labelled as borrowed, and dropped names are
  recorded in `_build/dropped-unplaced.txt` rather than vanishing.
- **Match the design system shell.** All the tools share one chrome — inverted rail, underline
  tabs, the ramp's grey line-height band. New surfaces should look like the existing ones
  rather than inventing UI the design system already solves.
- **Comments explain why, not what.** Particularly where the code looks odd on purpose
  (mutating ctx in place, the descender-free probe, the appended `[data-theme]` block).
