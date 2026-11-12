# Ussher prototypes

HTML design prototypes for Ussher (a Daily Office app for iPhone: the 1928 Book of
Common Prayer's Morning and Evening Prayer, assembled for any date). Built on Crnl
for the chrome; the reading surface is new, because Crnl has no serif text face and
no prose, rubric, versicle or verse patterns. These are design references — the
real app is native SwiftUI and will not consume this CSS.

**This folder is not part of the design system** and this branch is not meant to
merge as is. Two system files were touched to make it work: `prototypes` was added
to `SCAN_DIRS` in `scripts/build-ui-fonts.py` and `scripts/check-icons.mjs`, and the
icon font was re-cut with the names on `icons.html`.

## Layout

```
_template/      minimal working page: frame, nav, tab bar, fixtures, shell — copy it
shared/sheet.css   Source Serif 4 @font-face, --ussher-reading-font, --ussher-reading-size
shared/shell.js    USSHER.statusBar / measureChrome / openModal / closeModal / day / today / month / formatDate
data/*.js       fixtures on window.USSHER (calendar, office, settings, psalter) — GENERATED
fonts/          Source Serif 4 (roman + italic, variable wght 200–900 + opsz 8–60), OFL
build/make_fixtures.py   regenerates data/ from the ussher repo
build/shoot.mjs          screenshots a page in the phone frame, light and dark
icons.html      the only icon names that exist beyond Crnl's own
```

## The fixtures

- `USSHER.calendar` — real output of the Kotlin core for 2026-11-01..2027-12-31.
  `today` is 2026-11-12. Each day: `date, weekday, season, sunday, temporalTitle, holyDay{id,title,rank}|null`.
  Precedence between holy days and the temporal cycle is unresolved in core, so both can be present.
- `USSHER.office` — Morning Prayer. Structure (15 sections, block ids, types, choices,
  `when`) is real, read from the content YAML. **All text is lorem ipsum** and must stay
  that way: Ussher forbids any liturgical, scriptural or confessional text that is not
  transcribed from the source printing. Never type real prayer-book or Bible text, not
  even a familiar phrase. Citations ("Book 1. 1–14"), psalm numbers ("Psalm 00") and
  page numbers are placeholders too. Section titles and canticle names come from the YAML.
- Block types: `rubric{text}`, `sentence{text,citation}`, `prayer{text,amen,title,when?}`,
  `versicles{lines[{speaker: officiant|people, text}]}`, `canticle{title,verses[{n,a,b}]}`,
  `choice{options[{id,title,block}],default}`, `slot` with `fill` =
  `psalms{psalms[{title,incipit,verses[{n,a,b}]}],appointed}` |
  `first-lesson`/`second-lesson{lesson{citation,translation,translationName,fallback,fallbackNote,paragraphs[[{v,text}]]}}` |
  `collect-of-the-day{collect{title,text,amen}}`. Every block has `source{book,page}`.
  `a`/`b` are the two halves of a psalm or canticle verse.
  `when: {officiant: priest|lay}` marks alternatives; show the one matching `USSHER.settings.officiant.value`.

## Rules that bite (full text: /RULES.md)

- Head is the two Crnl script tags plus page-local `<link>`s to `shared/sheet.css` and your own `sheet.css`.
  `data-theme`, `data-mode`, `data-platform="app"` go on `<html>`.
- Chrome comes from Crnl classes only: `ios-nav-page`, `ios-nav-btn`, `ios-tab-bar`, `ios-modal-*`,
  `ios-nav-subtabs`, `list-row`, `list-divided`, `selector`, `switch`, `stepper`, `chip`, `tag`, `btn`.
  Look the class up in `docs/css-api.md` and see it live in `demo/` before using it. Never invent a class
  name that looks like a Crnl one.
- Everything Crnl does not have (the reading typography, rubric, versicle, verse, calendar grid…) is a
  **new pattern**: build it in your own `sheet.css` from Crnl tokens (`--spacing-*`, `--text-*`, `--bg-*`,
  `--border-*`, radius tokens) and list it in your notes. Your own classes take a prefix unique to your page.
- In your CSS: no hex/rgb colours except inside a clearly commented token block at the top that defines
  your palette for light **and** dark; no `:hover`/`:active`; no `!important`; no `text-transform`;
  spacing from tokens. `font-size`/`line-height` are allowed **only** on your reading-surface classes —
  that is the acknowledged gap — and sizes must derive from `--ussher-reading-size` so Settings can scale them.
- Tappable things are `<button>`/`<a>` with a `.surface-*` + `.scale-*` pair. Never one solid surface on another.
- No content strings typed into markup: render from `USSHER.*` with DOM APIs.
  **Do not concatenate inside a `class="…"` string in JS** — the linter reads it as class names. Use
  `className`/`classList` with literal class lists.
- `--brand-core` is not a text colour and is near-black in ink dark. A rubric colour needs its own
  light and dark values, each ≥ 4.5:1 on its background.
- Source Serif 4 has no ℣ ℟ ✠ glyphs. It does have small caps (`smcp`), old-style figures (`onum`),
  superiors (`sups`), ¶ † ‡. No oblique: use the real italic.
- Icons: only names shown on `icons.html` or already in `fonts/icons.json`.

## Commands (run from the repo root)

```sh
node scripts/lint.mjs prototypes/ussher/<page>/index.html prototypes/ussher/<page>/sheet.css prototypes/ussher/shared/sheet.css
node prototypes/ussher/build/shoot.mjs prototypes/ussher/<page>/index.html prototypes/ussher/<page>/shots/<name> \
     [--modes=light,dark] [--scroll=0,900] [--eval="js"] [--click="#sel"]
```
`shoot.mjs` turns the harness off, so the page's own `<html>` attributes decide theme and mode.
