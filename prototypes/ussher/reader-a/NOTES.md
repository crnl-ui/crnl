# Reader A: Prayer book

## 1. Direction
The book does the speaking and the app stays out of the way. The office is set as a printed prayer book would set it, in Source Serif, red and black. Anything the app itself has to say (translation, fallback, appointed day, officiant form) is in Inter, at label size, so you can always tell the book's voice from the app's.

- **Page.** Warm paper `#FBF8F2` with ink `#1E1A15` (16.3:1). In dark, `#14120F` with `#E8E1D3` (14.4:1). These are set through `--org-base` and `--org-sheet`, so the nav fade and the sheet match the page.
- **Text.** 17px (`--ussher-reading-size`) with 1.5 leading. The gutters are 24px, which gives a 345px measure of about 42–48 characters. Text is set ragged right with `text-wrap: pretty`, and old-style figures are used throughout.
- **Red.** Red is used only for things you don't read aloud. Light `#A3261B` is 6.9:1 and dark `#E88A76` is 7.4:1. Rubrics are 0.88em italic in red.
- **Headings.** Section headings are centred small caps at 1em, weight 600, tracked 0.075em. Prayer and canticle titles are italic. There are no rules and no ornaments; space alone separates sections (2.75em).

## 2. How the hard problems are solved
- **Versicles and responses.** Each line has a role label in the hanging column, in red italic ("Officiant", "People"). The people's words are semibold, and so is every **Amen**, so the reader's part always looks the same. Each pair has extra space around it.
- **Verses.** Each half-verse sits on its own line. The `a` half starts flush and the `b` half starts 1em in. Any wrapped line of either half starts 2em in, so a wrapped `a` can't be mistaken for `b`. In the psalms, the column steps in 1.2em and the verse numbers hang left of it, in old-style figures, sitting on the text's own baseline. Canticles have no numbers. In the lessons, verse numbers are superiors (`sups`) in the soft ink, and every paragraph after the first gets a 1.25em indent.
- **Choices.** Alternatives are offered the way the book offers them. Under the title of the current choice is a red dotted-underlined "or Benedicite · or …". Picking one swaps the text in place, keeps your scroll position, briefly flashes the new title, and remembers the pick.
- **Chrome.** There is no tab bar while reading. The nav holds Back and Contents, and its title is a running head: the current section in serif small caps. It appears once that section's heading has scrolled under the bar, as iOS large titles do. The Contents sheet marks your current section and also holds text size and page numbers. Page numbers are off by default. When on, the book's page appears as a small italic figure in the right margin wherever the page turns, and in the Contents rows.

## 3. New patterns (prefix `ra-`) and rules I bent
- New patterns: `ra-page`/`ra-head`/`ra-title` (reading surface), `ra-sec-h`, `ra-rubric`, `ra-vr` (role grid), `ra-verse`/`ra-half`/`ra-vn` (verses), `ra-sv` (lesson verse numbers), `ra-or` (alternatives), `ra-pg` (page mark), `ra-running` (running head).
- Bent rules:
  - I override the ink theme's `--org-base`, `--org-surface`, `--org-sheet` and `--org-nav` in my own token block.
  - Small caps use `font-variant-caps: small-caps`, which keeps capitals as capitals; it is not `text-transform`.
  - `.ra-running` adds padding inside `.ios-nav-page-title`, because the title's 48px doesn't clear a 44px button set 16px in.

## 4. Where I'd like your call
- Ragged right or justified with hyphenation.
- Text size sits below 15 rows in the Contents sheet, so it is easy to miss.
- The red title on the Collect of the Day.
- Long running heads are cut off with "…".
- Whether "Done" belongs at the end of the office.

## 5. Lint and screenshots
Lint: "Clean." with no escapes. Screenshots are in `/home/user/crnl/prototypes/ussher/reader-a/shots/`:
- `01-top-light-0.png`, `01-top-dark-0.png`
- `02-confession-absolution-light-860.png`
- `03-versicles-canticle-light-2200.png`, `03-versicles-canticle-dark-2200.png`
- `04-psalms-light-3830.png`, `04-psalms-dark-3830.png`
- `05-first-lesson-light-6140.png`
- `06-choice-changed-light-7280.png`
- `07-contents-sheet-light-3900.png`, `07-contents-sheet-dark-3900.png`
- `08-collects-end-light-11590.png`, `08-collects-end-light-14100.png`
- Extras: `09-holy-day-header-light-0.png`, `10-page-numbers-light-1250.png`, `11-sheet-reading-controls-light-0.png`
