# Font Lab

A Google Fonts vetting pipeline: find open-licence alternatives to paid display
fonts, pin down each one's shipping spec, and cut the font files the system ships.

**The output is already in this repo** — `fonts/*.woff2` and
`css/display-fonts.css` are what came out of it. These tools are here so the
library can be extended or re-cut, and so the reasoning behind it is not lost.

**Open it:** `index.html` is Font Lab 3, the browser for the built library, and
works straight from `file://` or any local server. `font-lab-1.html` and
`font-lab-2.html` are the selection and spec stages that preceded it. State (favorites, settings) persists in `localStorage` per browser.

## Views

| View | What it does |
|---|---|
| **Workbench** | Big specimen of the selected font with full CSS type controls — size, weight (continuous slider on variable fonts), letter spacing, line height, transform, italic, extra variable axes (wdth/opsz/slnt), plus a live custom-CSS box. Copyable CSS + `<link>` output. Below the specimen, a **guide card** shows the selected font's entry from the branding & display guide: tier + rank, best use, why it makes the collection, cautions (overexposed / accent-only / cultural baggage / fragile hairlines / source-brand baggage), and recommended pairings — click a pairing to open it. |
| **Compare to sample** | Drop / paste (⌘V) a screenshot of a paid font. Side-by-side or overlay mode — in overlay, drag the colored live text over the sample to check letterforms. Zoom assumes 2× Mac screenshots. |
| **Favorites** | Starred fonts, each remembering its own tuned settings, with a shared sample line for apples-to-apples comparison, notes, reordering, and JSON export/import. |
| **Display ramp** | Fits the current font to the 9-step display scale. Line heights are fixed system-wide (76/68/60/52/44/36/28/24/20); red rows mean font-size > line-height, which iOS clips. Prefill from any shipped theme ramp. Exports `--display-*` CSS tokens. |

## Sidebar (inverted rail)

Dark rail on `--neutral-1000` with the `--inverted-*` alpha ramp for text/surfaces and `--brand-inverted` for accents; the wordmark uses the display tokens (`--display-font` / `--display-size-500`). Search all 1,892 latin Google Fonts; previews render at each family's weight nearest 750.

- **Chips** — All / Display / Sans-Serif / Serif categories, plus Curated (guide 155) and Favorites. The Handwriting/Monospace categories and the Bold 700+/Variable/Condensed/Caps-only filters were removed in the redesign (weight is handled by the ~750-weight previews; caps detection still powers the CAPS badge).
- **•••** — opens the Google-taxonomy tag dropdown (Expressive/Loud ≥ 60 is the best data-driven "sports display" signal); the button stays lit while a tag filter is active
- **Sort icon** on the count line opens a dropdown: Popular / Guide rank / A–Z

Rows are cards: family name + right-aligned badge cluster — role (outlined lime), grade (filled lime), guide rank `N/155` (or popularity `#N` for non-guide fonts) — over a bold sample line. Category/variable/condensed/weight metadata lives in the card tooltip.

## The branding & display guide layer

The tool embeds the "High-Quality Google Fonts Collection" guide (2026-07-14, 155 families): per-font best-use / why / caution text, five caution categories, and 16 recommended pairings. Source document: `high-quality-google-fonts-branding-display-guide.md`. It powers the Curated 155 filter, the Guide sort, the role/grade badges, and the workbench guide card.

The guide's tiers A–E are renamed to descriptive **roles** — Identity systems, Workhorse sans, Editorial serifs & slabs, Display specialists, Mono & accessibility — and each font gets a **letter grade (A+…C) computed from its guide rank *within its role group***, so a headline face is graded against other display faces, not against complete identity systems. Example: Oswald = "Display · B+", Bebas Neue = "Display · C", Playfair Display = "Display · A+". Grade bands by position within the role's rank range: A+ ≤7%, A ≤20%, A− ≤35%, B+ ≤55%, B ≤75%, B− ≤90%, C rest.

## Specimen Lab (`specimen-lab.html`) — the sans & serif pass

A companion page for narrowing the 452 liked sans-serif + serif families down to a shortlist, without reviewing them one at a time. Open it from `file://` alongside `index.html` (it reads the same `fontlab-v1` localStorage verdicts) or load a Backup JSON exported from Font Lab.

It does two things in one run, grouped by style lane so like sits beside like:

1. **Metrics** — for every candidate, at that family's *heaviest available weight*, it measures set width, cap height, x-height and x/cap ratio, stem thickness, ink density, stroke contrast, counter area, and open-column ratio at production tracking. These are the axes that are measurements rather than opinions, so they are computed exactly for all 452 instead of eyeballed. Exports `metrics.json`.
2. **Contact sheets** — renders each candidate at production display conditions (caps wordmark at the set size and tracking, plus a trap line for figures and `I1lO0 RQGSae`), ten per sheet, for visual scoring of the things that genuinely need eyes: character, awkward letterforms, quality of the caps, whether it reads generic.

Sheets download either as individual PNGs or — easier to hand off — as a single `sheets-bundle.json` with every sheet embedded as a JPEG.

Style lanes come from the Google taxonomy tags already in `catalog.js`: Neo-grotesque, Grotesque, Geometric, Humanist sans, Superellipse, Rounded, Glyphic, Transitional serif, Old style serif, Venetian serif, Modern/Didone, Slab.

## Font Lab 2 (`font-lab-2.html`) — display spec refinement

A second, narrower tool for the phase after selection: taking the **145 confirmed families** and pinning down each one's shipping display spec. It uses the same shell as Font Lab 1 — `ds-loader.js`, design tokens throughout, the inverted rail, underline tabs, and a right-hand control panel — so the two tools read as one product. Data comes from `library.js` (generated from `catalog.js` + `confirmed-fonts.json`); it does not need the full catalog. Fonts are requested from Google with their full width and tilt ranges — css2 pins any axis you do not ask for, so requesting `wght` alone would leave those sliders inert.

Two views only, both from the v1 tool:

| View | What it does |
|---|---|
| **Display ramp** | The 9-step ramp against the fixed system line heights (76/68/60/52/44/36/28/24/20). Each preview sits on a grey band showing the true line-height box, so size-versus-line-height is visible at a glance. Rows whose size exceeds their line height are flagged red — iOS ignores those. "Scale all steps together" rescales the whole ramp to the edited step's size ÷ line-height ratio; prefill from any shipped theme ramp. Exports `--display-*` CSS tokens. |
| **Screens** | The four curated native templates in phone frames, ported from Font Lab 1 — display tokens set inline on each iframe's `:root`, the font injected into its head, and the all-caps simulation applied to `.display*` and `.nav-title`. The control panel collapses on this tab so all four phones get the full width. Needs `http://`; on `file://` the browser blocks iframe styling and the tab says so. |

**Every family carries a display token name** — the identifier a theme puts in `--display-font`, which is a real `font-family`, not a label. It is the first field in the tool and **saving is blocked until it is filled in**. Display families arrive pre-filled from the existing style library (Big Shoulders → `Horsecollar`, with any trailing "Caps" dropped from the base name). The 95 sans and serif families were named fresh: **built environment and stadium operations for the sans** (Grandstand, Turnstile, Marquee, Pylon, Bleacher, Broadcast) and **heritage and record-keeping for the serifs** (Founders, Chronicle, Almanac, Dynasty, Yearbook). Width and case variants of one lineage share a base name and take a structural modifier, matching the existing `Caps` convention — Sofia Sans is `Grandstand` / `Grandstand Condensed` / `Grandstand Extra Condensed`.

Exports carry both identities: the token name and the source Google family, with the CSS block opening on a comment naming the pair.

**What gets saved, per family:** the display token name, the 9 display size tokens, letter spacing, case (`as drawn` / `all caps` / `both`), weight, the vertical **nudge** and the **needs-metrics-work** flag and note, and — on families that have them — **width** (`wdth`) and **tilt** (`slnt`). Optical size is deliberately excluded: it has no place in the display spec. 16 confirmed families carry a width axis, 6 carry tilt, and Roboto Flex and TikTok Sans carry both.

Width and tilt are only written to the exports when they differ from neutral (100% / 0°), so most fonts export clean. When they are set, the CSS block adds `--display-width` / `--display-slant` plus a comment naming the declarations `.display*` needs in order to honour them:

```css
--display-width: 75%;
/* needs on .display*: font-stretch: var(--display-width); */
```

**These are live in the system.** `text-styles-system.css` gained `font-stretch: var(--display-width, 100%)` and `font-variation-settings: 'slnt' var(--display-slant, 0)` on all nine `.display*` rules, added additively — every existing declaration untouched — so an unset token falls back to neutral.  Saved to `localStorage` under `fontlab2-specs-v1`, with **↓ All specs** / **Import…** for a portable `display-specs.json`. ⌘S saves the current font. A dot next to each family shows its state: hollow = no spec, lime = saved, amber = unsaved edits.

### Vertical metrics and the nudge

The display line heights are fixed, so where a font's glyphs sit inside that box is decided by the font's own ascent and descent — nothing CSS can reach. The panel reports the offset at step 900 as **"1.4px above centre"** or **below centre**, and a **Needs metrics work** checkbox (plus a free-text note) flags families where the font file itself has to be edited. Flagged families get an amber **Metrics** badge in the rail and a **Metrics** filter chip.

The measurement deliberately does two things that an obvious implementation gets wrong, both of which produced readings that contradicted the screen:

- It measures **the case that ships**. The ramp renders all caps when the spec says caps; measuring the mixed-case sample instead counts descenders that are not on screen.
- It measures **the block the eye reads, not the ink bounding box**. In `BOXY MVP WALTZED QUICK JABS` the Q tail and the J drop below the baseline — a few pixels of ink that drag the ink-box centre a long way down, enough to report a face whose caps ride high as sitting low. So it probes with flat-sided, descender-free letters (`HEBI` in caps, `Hbkl` as drawn), takes the baseline from the live DOM rather than estimating it from `fontBoundingBox`, and compares the middle of cap-top→baseline against the middle of the line box.

**Show centre guides on ramp** draws two hairlines on every preview: amber at the middle of the line box, blue at the middle of the letters. The reading is the gap between them, so the number and the picture cannot disagree.

**Nudge** is a per-family vertical correction expressed as **a percentage of the line height** — one value that resolves to a different pixel offset at each of the nine steps, so it holds across the whole ramp. Negative moves up. It is **prefilled with the correction that centres the face** and adjusted by eye against the guides; **Centre it** recomputes it (case and weight both move the measurement, so the prefill goes stale if either changes) and **Reset to 0** clears it. The readout beside the label shows the pixel offset at step 900 and where the letters land once it is applied.

**The nudge is recorded, not applied at this stage.** There is no nudge token, so a font shipped without the metrics fix still renders off-centre — the value is the instruction for the font file's vertical metrics. Font Lab applies it to the ramp and to the Screens previews only, so it can be found by eye. It exports as a comment in the CSS block, spelled out rather than as a bare number so nobody downstream mistakes it for something CSS already honours. The build below is what turns it into something the browser does honour.

**Letter spacing is a stepper, not a slider** — −/+ buttons, a typed value, and arrow-key nudging. Steps by 0.001em; hold **shift** for 0.01em jumps.

**Seeding:** the 50 families that already carry named styles open pre-filled with that style's weight, tracking, case and width (Big Shoulders arrives as Horsecollar: w900, −0.031em, both cases; Tektur arrives as Jumbotron at 75% width). Optical-size values from v1 styles are discarded on load and on import. Families named with both a plain and a `Caps` variant are detected as case `both`, which renders a side-by-side preview of the two. The other 95 open at system defaults.

**Regenerating `library.js`:** re-run the node snippet that reads `catalog.js` + `confirmed-fonts.json`; the `FL2_SEED` block is derived from the style library in a Font Lab backup export.

## Building the font files (`_build/build_fonts.py` → `built-fonts/`)

The spec export is the input to a build that produces the actual `.ttf` files that get installed. **369 cuts from 145 families** — 256 roman (137 as-drawn, 119 all-caps) plus 113 italic. The 111 `both` families need one of each case, the 8 `caps` families only the caps cut.

`fonts.googleapis.com` is unreachable from both the sandbox and the cloud workspace, but **`raw.githubusercontent.com` is not** — and `google/fonts` holds the real source files. All 145 families resolve to `ofl|apache|ufl/<slug>/`, so the build pulls sources straight from the repo. fontTools does the rest. Nothing here needs a terminal.

Per family:

1. **Source.** Prefer the variable file; otherwise the static cut whose weight matches the spec. 73 of the 145 are variable.
2. **Pin.** Variable sources are instanced to the specced weight plus any specced `wdth` / `slnt`, every other axis pinned to its default — matching what css2 does, so the static file is what Font Lab previewed.
3. **Vertical metrics.** The nudge is converted to font units (`nudge% × lineHeight/size × upm`) and applied to `hhea`, `sTypo` and `usWin` ascent/descent. The box height is preserved and only its midpoint moves — line layout is unchanged, only where the glyphs sit inside it. **This is what turns the recorded nudge into something the app actually honours**, without the system needing a nudge token.
4. **Caps cut.** Lowercase codepoints are remapped in `cmap` to point at the uppercase glyphs. This differs from `pitches/_scripts/make_autocaps.py`, which copies outlines into the lowercase slots: remapping means GPOS kerning still addresses the real uppercase glyph and applies uppercase pair values, where outline-copying leaves lowercase kerning on uppercase shapes. Coverage is every lowercase codepoint with a single-character uppercase form, not just a–z.
5. **Name.** Family becomes the display token name (`Gantry`, `Horsecollar Caps`), subfamily stays `Regular`, `usWeightClass` carries the real weight. So `--display-font` in a theme names a real installed family with no translation step. It also clears the OFL reserved-font-name clause; copyright, license and vendor name records are carried through untouched, and each family's `OFL.txt` lands in `built-fonts/licenses/`.

### Italics (`_build/build_italics.py`)

52 of the 145 families ship a genuinely drawn italic in `google/fonts`; 7 more have only a `slnt` axis on the roman, which yields a mechanical oblique rather than a drawn italic. The remaining 86 have neither. Both kinds are built — **113 cuts, 99 true italics and 14 obliques** — and `kind` in the manifest records which is which so the distinction does not get lost.

They are packaged as the **Italic style of the existing family, not as new families**: `nameID 1` stays the token name, the subfamily becomes `Italic`, and the italic bits go on in `fsSelection` (ITALIC set, REGULAR cleared) and `head.macStyle`. macOS and Figma group Regular + Italic under one `Gantry` entry, and CSS reaches the italic with `font-style: italic` — `displayFont` never changes. The caps cuts get the same treatment, so `Gantry Caps` gains an Italic style too.

The vertical shift is the same number of font units as the roman: the nudge was judged against the roman on the ramp, and the build asserts per family that the italic source shares the roman's ascent/descent and unitsPerEm before reusing it. All 59 matched.

**Verification.** All 113 checked structurally — family matches the roman exactly, subfamily is `Italic`, both italic bits set, weight class right, no leftover `fvar`, caps remapping present only on caps cuts, and a non-zero `italicAngle` on every file. Then eight pairs spanning both kinds were loaded into a browser as two `@font-face` rules of one family: in every case `font-style: italic` resolves to the built italic file (metrics identical to loading that file standalone) and differs from the roman — so the browser is selecting the real face, not synthesising a slant.

The build is time-boxed and resumable (`--seconds`, `_build/state.json`) because `device_bash` gives every call a fresh ~45-second shell. `built-fonts/manifest.csv` and `manifest.json` record every cut with its source, license, shift in units, and remapped-glyph count.

**Verification.** All 256 checked structurally: family name, subfamily, weight class, no leftover `fvar`, and `cmap('a') == cmap('A')` on every caps cut (and only on caps cuts). Then ten spanning the nudge range were rendered headlessly against their unmodified sources at the specced size and line height, measuring the painted block's centre both times: **every one lands within 0.56px of its dialled nudge**, the residual being Chrome's integer baseline rounding.

The correction was NOT recomputed from cap height. For reference, `make_centered.py`'s cap-centring rule agrees with the by-eye nudges to a median of 0.7% and within 2% on 133 of 145 — but where they differ the dialled value wins, since it was judged against the real ramp.

## Font Lab 3 (`index.html`) — browsing the built library

Where Font Lab 2 decides the spec, Font Lab 3 looks at the result. Same shell — inverted rail, underline tabs, the ramp with its grey line-height band — with everything that edits removed. Two views, a read-only info rail, and favourites. Data comes from `library3.js`, regenerated with `node _build/make_library3.js` from the spec export plus `built-fonts/manifest.json`.

**It renders the built font files, not Google Fonts.** Each specimen `@font-face`s a real `.ttf` out of `built-fonts/`, so the vertical nudge is already in the metrics and the caps are already in the glyphs. Nothing is simulated: no `text-transform`, no CSS offset. What you see is what installing that file gets you. Faces load lazily — the rail observes its rows, so browsing 145 families does not pull 64MB.

**Case and style are global, not per family.** One pair of switches in the header sweeps the whole library between **standard** and all-caps, and between roman and italic. Coverage is uneven — 119 families have a caps cut and only 59 have any italic — so a family without the requested cut falls back to the nearest one it has and says which in the substrip (*no caps cut — showing standard*). The info rail lists every cut that was built and highlights the one on screen.

The upright cut is called **standard**, not "as drawn" — the phrase reads as a description of the drawing rather than a name for the style. Font Lab 2 still says "as drawn" in its Case control.

**No metrics flag.** Font Lab 2 tracked which families needed vertical-metrics work; that work is done and baked into the files, so carrying the flag forward would be a to-do list for finished work. The rail badge, the flagged row and the note are gone from Font Lab 3, and the favourites export drops `needsMetrics` and `note`. `nudgePct` stays in the export as a plain record of what the built file carries. The full record is still in `built-fonts/manifest.json` and the spec export.

**Favourites** are starred from the rail or the header, filtered with the Favourites chip, and exported as JSON or CSV — token name, source, weight, tracking, case mode, nudge, the shipping filename, which cuts exist, and the nine sizes. Stored under `fontlab3-favourites-v1`.

Arrow keys walk the rail, which is the fast way through 145 families.

### Find a match — the paid-font research layer

`font-match-research.md` maps every liked Google family onto one of **47 lineages**, each with its closest Adobe Fonts family, another paid option, a confidence rating, and prose on why it matches and what differs. `node`-free parser: `python3 _build/make_matches.py font-match-research.md matches.js display-specs-2026-08-31.json` produces `matches.js` — 47 clusters, all 145 token families, and the 663-family inventory.

The prose belongs to the lineage, not the family: 145 rows pointing at *Condensed poster grotesk* all say the same thing about Trade Gothic. So the generator stores it once on the cluster and gives a family its own copy only where it genuinely differs — which turned out to be nowhere, taking the payload from ~600KB to 149KB.

**On the ramp tab**, a Match card under the nine steps carries the lineage, confidence and upgrade score as badges, then the Adobe option, the other paid option, why it matches, what differs, and — the one genuinely per-family line — how to set the paid face up to compare like for like at this family's weight, tracking and case. It follows the Font Lab 1 guide-card pattern.

**The Find a match tab** searches four things through one box: the paid and Adobe names, the lineage names and genres, the 663 liked Google families, and your own token names. "Druk" finds the lineage by its paid option; "Oswald" finds it by a family inside it; "condensed" finds it by genre. Results group by lineage, each showing the paid options and the reasoning once, then the built families as cards rendered in their real faces, then the **other Google Fonts in that lineage** as a plain list — those have no built file, so there is nothing to render.

### The lineage audit and what it changed

Two independent sources were tested against the 47 lineages — [fontjoy's](https://github.com/Jack000/fontjoy) 200-dimension embeddings over 1,883 Google font variants, and a 74-row hand-curated paid→free mapping. Findings are written up in `lineage-audit.html`; `_build/vector_check.py` re-runs the embedding test in one command (the 29MB of vectors are deliberately not committed — `_build/external/README.md` has the fetch lines).

**The taxonomy held.** Same-lineage pairs average 0.53 cosine similarity against 0.28 for cross-lineage, and a font's nearest neighbour lands in its assigned lineage 4.7× more often than chance. The raw 17.5% nearest-neighbour figure is meaningless without that base rate: 13 of the 57 covered families are the only member of their lineage in the subset and so can never agree.

**41% agreement with the external mapping is not a 59% error rate.** Several disagreements are that source being wrong — it offers Hind, a Devanagari-first family, as the free stand-in for both Whitney and Frutiger, Archivo Black for Akzidenz Grotesk, and Ultra for Clarendon.

**The schema changed.** The disagreements that survive scrutiny all say one thing: some faces belong to two lineages and a single field loses that. Proxima Nova is a geometric skeleton on grotesk proportions; Graphik, Circular and Founders Grotesk make the same argument. `cluster2` now exists on all three tables, search resolves both, and the tool marks a family that appears in a lineage by its second reading. 20 families carry one.

**Khand moved** from S09 to S07 on two independent nearest-neighbour results. **Script-routed lineages now say so** on the ramp card — where the research routes by script rather than shape, a Latin lookalike is not a valid substitute, and Changa and Changa One being the most similar pair in the whole set at 0.973 while sitting in different lineages needed explaining on screen.

Corrections live in `_build/lineage_corrections.py`, one line each with the evidence that produced it, applied by `_build/make_paid_index.py`. The paid index also grew to **627 families, 333 of them hand-assigned**, using the name lists from both external sources.

Cards carry the per-family comparison setup rather than repeating the lineage's paid names, which are already in the header directly above. Clicking one selects that font and jumps to its ramp; the ramp card's *See all N in this lineage* goes the other way. With the box empty the tab lists all 35 lineages the library covers, biggest first, so it is a browse rather than a blank page.

**It needs `http://`.** Font Lab 2 only needed a server for the Screens tab; Font Lab 3 needs one for the ramp too, because a `file://` page cannot load a font file cross-origin. On `file://` it says so up front rather than rendering 145 specimens in Inter. A missing file over http gets a quieter, separate notice naming the file — being told to start a server you are already running sends you the wrong way.

## Regenerating the catalog

`catalog.js` is generated (2026-07-14) from four sources: the `google-font-metadata` npm package via jsDelivr (`data/google-fonts-v2.json` + `data/variable.json`), popularity order from `gwfh.mranftl.com/api/fonts`, Google's tag scores from `raw.githubusercontent.com/google/fonts/main/tags/all/families.csv` (default-style Expressive scores only — weight-qualified rows are excluded), and the branding guide MD. The shipped themes' display ramps are not in it — those come from `theme-ramps.js`, generated from `css/themes.css` by `npm run build:theme-ramps`.
