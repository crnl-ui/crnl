# Reader C — Utilitarian

## 1. Direction
A tool for leading the office: who speaks, where you are and what is next are always visible, and every move is one tap. Serif only for words said aloud; everything else is Inter.

- **Reading text:** Source Serif 4 at 17px (R). Leading 1.45 prose, 1.38 verse; measure 361px (~50–55 characters). No hyphenation: a broken word trips someone reading aloud.
- **Two colours of my own:** reading ink #1A1A1A (17.4:1) / #E8E5DF (15.6:1), and rubric #A8261C (7.0:1 on white, 6.1:1 on the surface colour) / #EE8E7E (8.2:1, 6.6:1 on the sheet). Secondary text is Crnl's token (7.0:1 / 11:1).
- **Position is always on screen.** Nav title = current section over "Section 6 of 15"; below it, one strip segment per section, sized by length, filling as you read.
- **No tab bar while reading.** A glass toolbar holds the text button and a wide "Next · 07 / The First Lesson" jump.

## 2. Hard problems
- **Rubric:** Inter at 0.82R in rubric red, not italic. Red = instruction, sans = not said.
- **Versicles:** a two-column grid with "Officiant" in grey and "People" in black bold. People's lines are serif 650, readable from across a room.
- **Verses:** number right-aligned in a 1.5em gutter. Half b starts on a new line indented 1.25em. Lessons put superscript numbers (0.6R) inline in running prose.
- **Choices:** Crnl chips, selected = fillNeutral plus a check. The priest/lay alternative uses the same chips with a "Led by" label and a person icon, set from Settings.
- **Source pages:** always in the jump sheet; in the text off by default, and when on, "p. 4" floats at the end of each block's first line.

## 3. New patterns and bent rules
New patterns, all prefixed `ucr-`: section head, said text, rubric, role grid (`ucr-vr`), verse grid (`ucr-verses`), lesson superscript (`ucr-vsup`), fallback note (`ucr-note`), choice bar, position strip (`ucr-progress`/`ucr-seg`), reading toolbar (`ucr-next`), page marker (`ucr-pg`), current-section disc (`ucr-jump-here`).

Rules I bent:
- Inter labels also set font-size, so they scale with R.
- I overrode Crnl's nav title padding: its 48px collides with the 44px buttons.
- I set the nav colour layer to opacity 1.
- `border-radius: 100px` literal, em verse gutters, inline `flexGrow`/`transform` from JS.
- Toolbar content sits inside `ios-tab-bar-inner`.

## 4. Least sure about / owner's call
- Black selected chips may be too loud, and three canticle chips wrap to two rows.
- Should "People" bold extend to prayers everyone says (Confession, Creed)? The data has no speaker for these, so I didn't guess.
- Replacing the tab bar while reading.
- A section becomes current when its heading passes a quarter of the way down the screen.

## 5. Verification
Lint: Clean. No console or page errors.

Screenshots, all in `/home/user/crnl/prototypes/ussher/reader-c/shots/`:
- 01-top-light-0.png, 01-top-dark-0.png
- 02-confession-absolution-light-922.png
- 03-versicles-canticle-light-2244.png, 03-versicles-canticle-dark-2244.png
- 04-psalms-light-3789.png, 04-psalms-dark-3789.png
- 05-first-lesson-light-5955.png
- 06-choice-changed-light-7052.png
- 07-jump-sheet-light-5955.png, 07-jump-sheet-dark-5955.png
- 08-collects-end-light-11130.png, 08-collects-end-light-13330.png
- 09-text-sheet-light-2244.png
- 10-holy-day-pages-light-0.png (Nov 30 header, pages on)
