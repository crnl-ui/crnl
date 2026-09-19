#!/usr/bin/env node
/* ============================================================
   check-coverage.mjs
   ============================================================
   The sticker sheet claims to show every class and token the system ships.
   This checks the claim against docs/css-api.json — the generated
   index of what actually exists — and fails loudly when the two drift.

   Run from the repo root:
     node sandboxes/cornelius/sticker-sheet/check-coverage.mjs

   Two directions, both of which matter:
   - MISSING   — in the CSS, not on any sheet. New system surface that
                 nobody has documented yet.
   - UNKNOWN   — used in a class= attribute on a sheet but not in the
                 CSS. Either an invented class (RULES: if it is not in
                 css-api.md it does not exist) or the sheet's own
                 scaffolding, which must be declared below.
   ============================================================ */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const API = JSON.parse(readFileSync(join(HERE, '../docs/css-api.json'), 'utf8'));

/* The sheet's own scaffolding, plus the page-level classes the design guide
   tells you to define yourself (.row-wrap, .form-stack, .section-header …).
   Anything here is deliberately not part of the system. */
const SCAFFOLDING = new Set([
  'mono', 'sheet-nav', 'sheet-nav-inner', 'sheet-nav-brand', 'sheet-nav-link',
  'sheet-nav-sub', 'sheet-nav-sublink', 'has-rail',
  'sheet-head', 'sheet-section', 'sheet-section-head', 'sheet-note', 'sheet-sub',
  'sheet-grid', 'sheet-grid-wide', 'sheet-grid-1', 'sheet-callout', 'sheet-footer',
  'spec', 'spec-stage', 'spec-label', 'spec-code', 'spec-meta',
  'token-list', 'token-row', 'token-chip', 'token-chip-fill', 'token-value', 'no-chip', 'swatch', 'ruler',
  'demo-box', 'demo-fill', 'demo-image',
  'is-active', 'is-center', 'is-plain', 'is-base', 'is-sheet', 'is-brand',
  'is-block', 'is-tight',
  // page-level classes the design guide says to define yourself
  'row-wrap', 'inventory-card', 'inventory-list', 'form-stack', 'filter-bar',
  'section-header', 'ios-nav-maintab-row',
]);

/* Classes that exist but cannot be rendered as a specimen, with the reason.
   Every one of these still has to appear by name on a sheet — this list only
   exempts them from needing a live example. */
const NOT_RENDERABLE = new Map([
  ['material-symbols-rounded', 'the raw font-family class — shown as part of .btn-icon and .input-icon'],
]);

const files = readdirSync(HERE).filter(f => f.endsWith('.html'));
const sources = files.map(f => [f, readFileSync(join(HERE, f), 'utf8')]);

/* A page may declare its own scaffolding in its own <style> rather than in
   sheet.css. That is a legitimate shape for a self-contained page, and the
   rule is that a class is declared somewhere a reader can find it — not that
   it lives in a particular file. Collecting them here beats adding three
   dozen names to SCAFFOLDING above, which is a hand-maintained list and would
   drift the first time one was renamed. */
const inlineScaffolding = new Set();
for (const [, src] of sources) {
  for (const block of src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = block[1].replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) inlineScaffolding.add(m[1]);
  }
}

/* Two ways a class counts as covered: it is used in a class= attribute
   (a live specimen), or it is printed by name in the page copy (a listing).
   Both are legitimate — a listing is how 300 spacing utilities get shown. */
const used = new Set();      // in a class= attribute
const named = new Set();     // written as .foo anywhere in the page text
const tokensSeen = new Set();

for (const [, src] of sources) {
  /* Script blocks build markup with template literals, so a class= match
     inside one can be `stat-table-row${tint}` rather than a class name.
     Scan the markup for live usage; the .foo pass below still reads the
     whole file, so a class only mentioned in script copy still counts. */
  const markup = src.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const m of markup.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) used.add(c);
  }
  for (const m of src.matchAll(/\.([A-Za-z][\w-]*)/g)) named.add(m[1]);
  for (const m of src.matchAll(/--[a-z0-9-]+/gi)) tokensSeen.add(m[0]);
}

const allClasses = new Map();  // name -> file
const allTokens = new Map();
for (const s of API.stylesheets) {
  for (const c of s.classes) if (!allClasses.has(c.name)) allClasses.set(c.name, s.file);
  for (const t of s.tokens) if (!allTokens.has(t.name)) allTokens.set(t.name, s.file);
}

const missingClasses = [...allClasses].filter(([n]) => !used.has(n) && !named.has(n));
const missingTokens = [...allTokens].filter(([n]) => !tokensSeen.has(n));
const unknown = [...used].filter(
  c => !allClasses.has(c) && !SCAFFOLDING.has(c) && !inlineScaffolding.has(c) && !c.startsWith('data-')
);

const group = pairs => {
  const by = {};
  for (const [n, f] of pairs) (by[f] ??= []).push(n);
  return by;
};

const pct = (a, b) => (b === 0 ? 100 : Math.round(((b - a) / b) * 100));

console.log(`sticker sheet — coverage against docs/css-api.json\n`);
console.log(`  sheets    ${files.length}`);
console.log(`  classes   ${allClasses.size - missingClasses.length} / ${allClasses.size}  (${pct(missingClasses.length, allClasses.size)}%)`);
console.log(`  tokens    ${allTokens.size - missingTokens.length} / ${allTokens.size}  (${pct(missingTokens.length, allTokens.size)}%)`);
if (NOT_RENDERABLE.size) console.log(`  listed only, by design: ${[...NOT_RENDERABLE.keys()].join(', ')}`);

if (missingClasses.length) {
  console.log(`\nMISSING CLASSES — in the CSS, on no sheet:`);
  for (const [file, names] of Object.entries(group(missingClasses))) {
    console.log(`  ${file}`);
    console.log(`    ${names.join(' ')}`);
  }
}

if (missingTokens.length) {
  console.log(`\nMISSING TOKENS — in the CSS, on no sheet:`);
  for (const [file, names] of Object.entries(group(missingTokens))) {
    console.log(`  ${file}`);
    console.log(`    ${names.join(' ')}`);
  }
}

if (unknown.length) {
  console.log(`\nUNKNOWN CLASSES — used on a sheet, not in the CSS:`);
  console.log(`  ${unknown.sort().join(' ')}`);
  console.log(`  Either the class does not exist (RULES §1 — do not invent one)`);
  console.log(`  or it is sheet scaffolding and belongs in SCAFFOLDING above.`);
}

const failed = missingClasses.length + missingTokens.length + unknown.length;
console.log(failed ? `\n${failed} gap(s).` : `\nComplete.`);
process.exit(failed ? 1 : 0);
