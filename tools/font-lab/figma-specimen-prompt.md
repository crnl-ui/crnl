# Build a Figma specimen sheet for the display font library

Load the `/figma-console-mcp` skill first — batch through `figma_execute`, don't make one call per card.

## Context

The design system has a **display text component** whose face is set per theme through tokens: `--display-font`, `--display-weight`, `--display-letter-spacing`, and nine size tokens `--display-size-100`–`--display-size-900` against fixed line heights (20/24/28/36/44/52/60/68/76px). `--display-font` is a real CSS `font-family`, not a label — it has to name an installed family.

Rather than pay per face, 145 open-source Google Fonts families were vetted, each given a sports-adjacent **display token name** (Anton → `Gantry`, Big Shoulders → `Horsecollar`, Bebas Neue → `Turnstile`), and specced in Font Lab 2 (`tools/font-lab/font-lab-2.html`): weight, letter spacing, case mode, the nine sizes, and a vertical nudge.

Those specs were then **built into real font files**. For each family the build pulls the source from `google/fonts`, pins variable fonts to the specced weight and axes, bakes the vertical nudge into the font's own ascent/descent metrics, and — for families that ship all-caps — remaps the lowercase codepoints onto the uppercase glyphs. Output is 256 TTFs in `tools/font-lab/built-fonts/`, named by their token names.

**Your job: a visual specimen sheet in Figma of all 145 families**, so the library can be reviewed as a set rather than one font at a time in a browser tool.

## Step 1 — install the fonts (do this first, it forces a Figma restart)

```bash
cp "tools/font-lab/built-fonts/"*.ttf ~/Library/Fonts/
```

Then tell me to **quit Figma Desktop completely, relaunch it, reopen the file, and re-run the Desktop Bridge plugin.** Figma caches its font list at startup — `figma.listAvailableFontsAsync()` only ever reflects what was installed when Figma launched, and there is no in-session workaround. Don't try to fight it.

After the restart, before building anything, verify:

```javascript
const avail = new Set((await figma.listAvailableFontsAsync()).map(f => f.fontName.family));
// compare against the 145 figmaFamily values from specimen-rows.json
```

If any are missing, **report which ones and stop** — half a specimen sheet is worse than none.

## Step 2 — the data

Everything you need is precomputed in:

```
tools/font-lab/built-fonts/specimen-rows.json
```

145 rows, already sorted alphabetically by token name. One row per family — the cut that ships by default (the caps cut where `caseMode` is `caps`, the as-drawn cut otherwise). Fields:

| field | use |
|---|---|
| `figmaFamily` | pass **verbatim** to `loadFontAsync` and `fontName` |
| `figmaStyle` | always `"Regular"` — see the gotcha below |
| `tokenName` | the label, and the text of the big sample line |
| `sourceFamily` | the Google Fonts family it came from, for the metadata line |
| `weight`, `letterSpacingPercent`, `caseMode` | the rest of the metadata line |
| `sampleSizePx`, `sampleLineHeightPx` | the specced display-700 size against its 60px line height |
| `nudgePct`, `needsMetricsFlag` | for the flag chip |

Sibling files if you need more: `manifest.csv` / `manifest.json` (all 256 cuts with source, license, shift in font units), `../display-specs-2026-08-31.json` (the full nine-step ramp per family).

## Step 3 — what to build

A new page named **`Display Font Specimen — 145 families`**, containing one root frame:

- **Root frame** `Display Specimen`, vertical auto-layout, 64px padding, 32px gap, white fill, hug height.
- **Title block** at the top: `Display Font Library` (Inter Bold 32) and a subtitle `145 confirmed families · shown at display-700 · built from Google Fonts with vertical metrics corrected` (Inter Regular 14, #6B7280).
- **Grid**: horizontal auto-layout with wrapping, 4 cards per row, 24px gap.
- **Card** (one per row in the JSON): vertical auto-layout, fixed 360px width, **hug height**, 20px padding, 8px gap, fill `#F5F6F8`, 16px corner radius, named for its `tokenName`.
  1. `tokenName` — Inter Semi Bold 13, `#111111`
  2. metadata — `<sourceFamily> · <weight> · <letterSpacingPercent>% · <caseMode>` — Inter Regular 10, `#6B7280`
  3. **the sample**: the `tokenName` again, set in `figmaFamily` at `sampleSizePx` with `sampleLineHeightPx` line height and the specced letter spacing, fill `#111111`, `textAutoResize = 'HEIGHT'`, width filling the card. Long names wrap — that's fine, the card hugs.
  4. if `nudgePct !== 0` or `needsMetricsFlag`, a small chip: `nudge +3.5%` — Inter Semi Bold 9 on `#FDF0D5`, `#8A5A00` text, 4px radius, 4×6 padding.

Seeing each name drawn in its own face is the point of the sheet — that's why the sample text is the token name rather than a pangram.

## Gotchas that will actually bite you

1. **Style is always `Regular`.** Every built file is a single-weight family: `nameID 1` is the token name, the subfamily is `Regular`, and `usWeightClass` carries the real weight. So `A-Game Caps` at weight 900 loads as `{ family: 'A-Game Caps', style: 'Regular' }` — **not** `'Black'`. Guessing a style name from the weight will fail every load.
2. **Load before you set.** `figma.loadFontAsync()` must resolve for a family before you assign `characters` or `fontName` on a TEXT node. Load Inter's `Regular`, `Semi Bold` and `Bold` up front too.
3. **Don't apply `textCase: 'UPPER'`.** The caps cuts already render uppercase from lowercase input via a cmap remap. Stacking Figma's transform on top is redundant and hides whether the font is doing its job.
4. **Units.** `letterSpacing: { value: <letterSpacingPercent>, unit: 'PERCENT' }`, `lineHeight: { value: <sampleLineHeightPx>, unit: 'PIXELS' }`.
5. **Batch.** Build roughly 25 cards per `figma_execute` call, not 145 separate calls. Create the page and root frame in the first call, then append batches.

## Step 4 — verify

Walk the finished page and confirm every sample TEXT node's `fontName.family` matches the `figmaFamily` it was meant to get — a font that silently failed to load falls back to Inter and looks plausible at a glance. Report the count matched, then screenshot the page with `figma_capture_screenshot` and show it to me.
