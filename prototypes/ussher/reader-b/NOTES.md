# Reader B — Modern editorial

**1. Direction.** It's set like a long-read: one column, big serif headlines, colour used only for hierarchy. Prayed text is the only thing at full strength. Everything read silently is small grey Inter.
- Sizes come from r = `--ussher-reading-size` (17px): body Source Serif 4 at 17/1.55, office title 40/1.04, section title 28/1.1, sentence 23/1.34. Measure is 345px (24px gutters), ragged and hyphenated.
- Section head: 1px full-width ink rule, sans numeral, serif title, 64px above.
- Palette: ink `#1C1B19`/`#E8E5DF` (17.2/15.4:1), rubric grey `#6B665E`/`#A39E95` (5.7/7.3:1; 5.0/6.5:1 on surface). No accent colour.
- Bold serif means the people say it: people's lines and every Amen.

**2. Hard problems**
- Rubric: Inter at 0.8r, regular, grey. Face, size and colour all change, so no italics.
- Versicles: a grid with the role in a sans column (Officiant grey, People bold), and people's lines in bold.
- Verses: the first half is flush and the second half is indented 24px. Psalm numbers sit in a grey sans 24px column, aligned to the first line's baseline. Canticles have no numbers. Lessons use inline grey superscripts and indented paragraphs.
- Choices: "Choose one" above outlined Crnl chips. The selected chip has a check and bold text. The same control switches priest/lay.
- Chrome: back and Contents buttons only, no tab bar. After the masthead, the nav title shows the section and "6 of 15". The Contents sheet has the 15 sections (current one marked "Now"), a text-size stepper and a source-pages switch. With the switch on, a dashed "p. N" rule marks each page turn. Try `?date=2026-11-01` (holy day), `?pages=1` and `?size=22`.

**3. New patterns (`ussb-`):** page/flow, mast/feast, sec-head, rubric, sentence, prayer+amen, vr, verse/half-a/half-b, psalm+vno, lesson+vsup+note, proper (Collect card), choice, pagemark, navtitle, end.
Rules I bent: type properties on reading classes (the gap the README allows); text-class spans inside the nav title; an empty span in the sheet's right nav slot; prayer titles that repeat the section title are hidden.

**4. Your call:** bold for people's parts (the data marks the speaker only in versicles); chips wrapping to two lines for the three canticles; setting the Collect of the Day apart on a card; no tab bar or progress bar.

**5. Lint:** `Clean.` Shots are in `/home/user/crnl/prototypes/ussher/reader-b/shots/`: 01-top-{light,dark}-0, 02-confession-absolution-light-1100, 03-versicles-canticle-{light,dark}-2560, 04-psalms-{light,dark}-4400, 05-first-lesson-light-6940, 06-choice-changed-light-8200, 07-sections-sheet-{light,dark}-4400, 08-collects-end-light-13200, 08-collects-end-light-15717 (`.png`).
