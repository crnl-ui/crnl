/* =============================================================================
   generate-css-reference.js — build docs/css-api.md from the CSS itself
   =============================================================================
   The hand-written guide can only ever name a fraction of the class selectors
   the system ships. Anything it leaves out is, from an agent's point of view, API
   that does not exist — so the agent writes custom CSS for a class that was
   already there.

   Hand-maintaining that list would go stale the first time someone adds a class
   (the way the documented CSS load order already has). This script derives the
   reference from the source, so it cannot drift: the CSS is the input.

   Run:  npm run build:css-api
   Out:  docs/css-api.md
   ============================================================================= */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readLoadOrder } from './lib/load-order.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = join(ROOT, 'css');
const OUT = join(ROOT, 'docs', 'css-api.md');
const OUT_JSON = join(ROOT, 'docs', 'css-api.json'); // same data, machine-readable

/* ---------------------------------------------------------------------------
   Visibility. `internal` files still get parsed — they just don't appear in the
   agent-facing reference, because documenting them invites agents to use them.
   --------------------------------------------------------------------------- */
const INTERNAL = new Set([]);

/* Generated artifacts. Neither is part of the API surface, and both are on disk
   rather than in crnl-loader's `sheets`, so the trailing sweep below would
   otherwise document them:
     crnl.css             the concatenated delivery bundle — every class in it is
                        already documented under the sheet that owns it, and it
                        made each of those read "also styled in crnl.css".
   The sweep still exists to catch a genuinely new hand-written stylesheet that
   nobody added to crnl-loader.js. */
const GENERATED = new Set([
  'crnl.css',
]);

/* Load order comes from scripts/lib/load-order.mjs, which parses crnl-loader.js's
   `sheets` array specifically — this used to match any '*.css' string anywhere
   in the file, which would have picked up a filename mentioned in a comment. */
function loadOrder() {
  return readLoadOrder();
}

/* ---------------------------------------------------------------------------
   Parsing. The system is plain CSS — no nesting beyond @media — so a small scanner
   is enough, and avoids a dependency.
   --------------------------------------------------------------------------- */

/* Blank out strings and comments while PRESERVING LENGTH, so offsets computed
   on the mask still index correctly into the original text. */
function maskNoise(s) {
  return s.replace(
    /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\*[\s\S]*?\*\//g,
    m => ' '.repeat(m.length)
  );
}

function parse(css) {
  const sections = []; // { title, rules: [...] }
  let current = { title: null, rules: [] };
  sections.push(current);

  let i = 0;
  let mediaStack = [];
  let pendingSection = null;

  while (i < css.length) {
    // Comment — may be a section heading
    if (css[i] === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      const body = css.slice(i + 2, end === -1 ? css.length : end);
      const title = sectionTitle(body);
      if (title) pendingSection = title;
      i = end === -1 ? css.length : end + 2;
      continue;
    }

    // At-rule
    if (css[i] === '@') {
      const braceAt = css.indexOf('{', i);
      const semiAt = css.indexOf(';', i);
      if (semiAt !== -1 && (braceAt === -1 || semiAt < braceAt)) {
        i = semiAt + 1; // @import / @charset
        continue;
      }
      const prelude = css.slice(i, braceAt).trim();
      if (/^@(media|supports|container)/.test(prelude)) {
        mediaStack.push(prelude);
        i = braceAt + 1;
        continue;
      }
      // @font-face, @keyframes — skip the whole block
      i = matchBrace(css, braceAt) + 1;
      continue;
    }

    if (css[i] === '}') {
      if (mediaStack.length) mediaStack.pop();
      i++;
      continue;
    }

    if (/\s/.test(css[i])) {
      i++;
      continue;
    }

    // Rule
    const braceAt = css.indexOf('{', i);
    if (braceAt === -1) break;
    const closeAt = matchBrace(css, braceAt);
    const selector = css.slice(i, braceAt).trim().replace(/\s+/g, ' ');
    const body = css.slice(braceAt + 1, closeAt);

    if (pendingSection) {
      current = { title: pendingSection, rules: [] };
      sections.push(current);
      pendingSection = null;
    }

    current.rules.push({
      selector,
      decls: declarations(body),
      tokens: [...new Set([...body.matchAll(/var\((--[a-z0-9-]+)/gi)].map(m => m[1]))],
      media: mediaStack.length ? mediaStack.join(' and ') : null,
    });

    i = closeAt + 1;
  }

  return sections.filter(s => s.rules.length);
}

function matchBrace(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return s.length;
}

function declarations(body) {
  // Split on a masked copy so semicolons inside strings/url() don't cut a
  // declaration in half — but slice the values out of the ORIGINAL, so font
  // names and content strings survive intact.
  const masked = maskNoise(body);
  const out = [];
  let start = 0;
  for (let i = 0; i <= masked.length; i++) {
    if (i !== masked.length && masked[i] !== ';') continue;
    const rawMasked = masked.slice(start, i);
    const raw = body.slice(start, i);
    start = i + 1;
    const idx = rawMasked.indexOf(':');
    if (idx === -1) continue;
    const clean = s => s.replace(/\/\*[\s\S]*?\*\//g, '').trim().replace(/\s+/g, ' ');
    // A trailing comment on the previous line (`font-size: 12px; /* 12px */`)
    // lands on the front of the NEXT property — strip it from both sides.
    const prop = clean(raw.slice(0, idx));
    const value = clean(raw.slice(idx + 1));
    if (!prop || !value || !/^[-a-zA-Z]/.test(prop)) continue;
    out.push({ prop, value });
  }
  return out;
}

/* A heading comment is either an ALL-CAPS line, or the first line of a banner
   comment (one that carries a rule of `=`, `─` or `-` characters). Banners may
   be Title Case and carry parentheses or dashes — "Text Pairs (Label + Sublabel)"
   is a section, "16px" and "Brand Colors" are not. */
function sectionTitle(body) {
  const rawLines = body.split('\n');
  const isRule = l => /^[\s*]*[=─-]{4,}[\s*]*$/.test(l);
  const hasBanner = rawLines.some(isRule);
  const lines = rawLines
    .filter(l => !isRule(l))
    .map(l => l.replace(/^[\s*=─•-]+|[\s*=─-]+$/g, '').trim())
    .filter(Boolean);
  if (!lines.length) return null;
  const first = lines[0];
  if (first.length > 60 || first.length < 3) return null;
  if (/[{};:]/.test(first) && !/^[A-Z0-9 &/(),.'’+-]+$/.test(first)) return null;
  if (/^[A-Z0-9][A-Z0-9 &/(),.'’+-]*$/.test(first)) return first;
  // Banner titles may start with the lowercase-led product name "iOS".
  if (hasBanner && /^(?:iOS\b|[A-Z])[\w &/(),.'’+—–-]*$/.test(first) && !/^(TODO|FIXME|NOTE)\b/i.test(first)) return first;
  return null;
}

/* The file's opening comment. Header convention (see design-guide.md
   § Contributing to the CSS): line 1 is the stylesheet name, line 2 is a
   one-sentence "what it covers", the rest is prose. `covers` is what the Index
   table shows; the full body is shown under the stylesheet heading. */
function fileSummary(css) {
  if (!css.trimStart().startsWith('/*')) return { title: '', covers: '', body: '' };
  const end = css.indexOf('*/');
  const lines = css
    .slice(css.indexOf('/*') + 2, end)
    .split('\n')
    .map(l => l.replace(/^[\s*]+/, '').replace(/[\s]+$/, '').replace(/^[•]\s*/, '- '))
    .filter(l => !/^[=─-]{4,}$/.test(l));
  const nonEmpty = lines.filter(Boolean);
  const title = (nonEmpty[0] || '');
  const covers = (nonEmpty.slice(1).find(l => !/^(load order|load after|depends on|run:|out:)/i.test(l) && !/^[A-Z0-9 &/(),.'’+-]+$/.test(l)) || '').slice(0, 110);
  return { title, covers, body: lines.join('\n').trim() };
}

/* Custom properties declared in the file, grouped by scope. Per-team blocks
   declare the same names eleven times — the reference lists each name once. */
function tokensIn(sections) {
  const byName = new Map();
  for (const section of sections) {
    for (const rule of section.rules) {
      for (const d of rule.decls) {
        if (!d.prop.startsWith('--')) continue;
        const scope = /data-mode/.test(rule.selector) && /data-theme/.test(rule.selector) ? 'per theme + mode'
          : /data-mode/.test(rule.selector) ? 'per mode'
          : /data-theme/.test(rule.selector) ? 'per theme'
          : /data-platform/.test(rule.selector) ? 'per platform'
          : rule.selector === ':root' || /^:root/.test(rule.selector) ? 'global'
          : 'component-scoped';
        if (!byName.has(d.prop)) byName.set(d.prop, { name: d.prop, scopes: new Set(), example: d.value });
        byName.get(d.prop).scopes.add(scope);
      }
    }
  }
  return byName;
}

/* ---------------------------------------------------------------------------
   Aggregate to a per-class view.
   --------------------------------------------------------------------------- */

function classesIn(selector) {
  // Only classes the author can apply — skip pseudo/attribute scoping noise.
  return [...new Set([...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(m => m[1]))];
}

function collect(sections) {
  const map = new Map();
  for (const section of sections) {
    for (const rule of section.rules) {
      for (const name of classesIn(rule.selector)) {
        if (!map.has(name)) {
          map.set(name, { name, section: section.title, decls: [], tokens: new Set(), rules: [] });
        }
        const entry = map.get(name);
        entry.rules.push(rule);
        rule.tokens.forEach(t => entry.tokens.add(t));
        // Declarations from the rule where this class is the whole selector are
        // what the class "is"; everything else is contextual styling.
        if (rule.selector === '.' + name && !rule.media) entry.decls.push(...rule.decls);
      }
    }
  }
  return map;
}

// .btn-100 / .btn-300 / .btn-700 → one family line instead of three entries.
function families(names) {
  const groups = new Map();
  const singles = [];
  for (const n of names) {
    const m = n.match(/^(.*?)-(\d+)$/);
    if (m) {
      const key = m[1];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ full: n, step: Number(m[2]) });
    } else singles.push(n);
  }
  const out = [];
  for (const [key, members] of groups) {
    if (members.length >= 3) {
      members.sort((a, b) => a.step - b.step);
      out.push({ family: key, steps: members.map(m => m.step), members: members.map(m => m.full) });
    } else members.forEach(m => singles.push(m.full));
  }
  return { fams: out, singles: singles.sort() };
}

/* Properties that identify what a class IS, most-identifying first. A
   `.labelBold*` and a `.labelRegular*` differ only by font-weight, so weight has
   to survive truncation or the reference is useless for picking a text class. */
const IDENTITY = [
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'color',
  'background',
  'background-color',
  'gap',
  'padding',
  'margin',
  'border-radius',
  'border',
  'height',
  'width',
  'display',
  'flex-direction',
  'grid-template-columns',
  'max-width',
];

function summarize(entry, limit = 5) {
  const seen = new Map();
  for (const d of entry.decls) seen.set(d.prop, d.value); // last wins, as in CSS
  if (!seen.size) return '';
  const rank = p => {
    const i = IDENTITY.indexOf(p);
    return i === -1 ? IDENTITY.length : i;
  };
  const parts = [...seen]
    .sort((a, b) => rank(a[0]) - rank(b[0]))
    .map(([p, v]) => `${p}: ${v}`);
  const shown = parts.slice(0, limit).join('; ');
  return parts.length > limit ? `${shown}; +${parts.length - limit} more` : shown;
}

/* ---------------------------------------------------------------------------
   Emit
   --------------------------------------------------------------------------- */

/* Hand-written guidance, injected per stylesheet. Generated content answers
   "what exists"; a partial answers "which one do I reach for" — the judgement
   call a declaration list cannot make. Add scripts/partials/<stylesheet>.md. */
function partial(file) {
  const p = join(ROOT, 'scripts', 'partials', file.replace(/\.css$/, '.md'));
  try {
    return readFileSync(p, 'utf8').trim();
  } catch {
    return '';
  }
}

const order = loadOrder();
const all = readdirSync(CSS).filter(f => f.endsWith('.css') && !GENERATED.has(f));
const ordered = [...order.filter(f => all.includes(f)), ...all.filter(f => !order.includes(f)).sort()];

const out = [];
const stats = { files: 0, classes: 0, hidden: 0 };
const perFile = [];

for (const file of ordered) {
  const css = readFileSync(join(CSS, file), 'utf8');
  const sections = parse(css);
  const map = collect(sections);
  const internal = INTERNAL.has(file);
  if (internal) {
    stats.hidden += map.size;
    continue;
  }
  stats.files++;
  perFile.push({ file, summary: fileSummary(css), sections, map, tokens: tokensIn(sections), loaded: order.indexOf(file) });
}

/* A class is documented once, in its home stylesheet — the first file that
   declares it as a whole selector. Other files that only style it in context
   (`.list-row .tag`) are listed as "also styled in". */
const home = new Map();
for (const { file, map } of perFile) {
  for (const e of map.values()) {
    if (!home.has(e.name) && e.decls.length) home.set(e.name, file);
  }
}
for (const { file, map } of perFile) {
  for (const e of map.values()) if (!home.has(e.name)) home.set(e.name, file);
}
const alsoIn = new Map();
for (const { file, map } of perFile) {
  for (const e of map.values()) {
    if (home.get(e.name) !== file) {
      if (!alsoIn.has(e.name)) alsoIn.set(e.name, []);
      alsoIn.get(e.name).push(file);
    }
  }
}
for (const pf of perFile) {
  for (const name of [...pf.map.keys()]) if (home.get(name) !== pf.file) pf.map.delete(name);
  stats.classes += pf.map.size;
}
stats.tokens = perFile.reduce((n, pf) => n + pf.tokens.size, 0);

out.push('# CSS API Reference');
out.push('');
out.push('> **Generated file — do not edit.** Produced from `css/*.css` by');
out.push('> `scripts/generate-css-reference.js`. Regenerate with `npm run build:css-api`.');
out.push('>');
out.push('> This is the complete class and token surface. `RULES.md` holds the rules,');
out.push('> `design-guide.md` explains *when* to reach for a component and how the pieces');
out.push('> compose; this file is the exhaustive list of what exists. If a class or token');
out.push('> is not here, it is not in the design system.');
out.push('');
out.push(
  `**${stats.classes} classes and ${stats.tokens} custom properties across ${stats.files} stylesheets.** ` +
    `${stats.hidden} internal classes (documentation chrome) are intentionally omitted. ` +
    `Each class is listed once, under the stylesheet that defines it.`
);
out.push('');

out.push('## Load order');
out.push('');
out.push('Read from `crnl-loader.js` at generation time — this is what browsers actually load.');
out.push('');
out.push('```html');
order.forEach((f, i) => out.push(`<!-- ${String(i + 1).padStart(2)} --> ${f}`));
out.push('```');
out.push('');
out.push('In-repo pages use `<script src="crnl-loader.js"></script>` instead of individual tags.');
out.push('');

out.push('## Index');
out.push('');
out.push('| Stylesheet | Classes | What it covers |');
out.push('|---|---:|---|');
for (const { file, summary, map, tokens } of perFile) {
  const size = tokens.size ? `${map.size} · ${tokens.size} tokens` : `${map.size}`;
  out.push(`| [\`${file}\`](#${file.replace(/\./g, '')}) | ${size} | ${summary.covers} |`);
}
out.push('');

for (const { file, summary, sections, map, tokens } of perFile) {
  out.push('---');
  out.push('');
  out.push(`## ${file}`);
  out.push('');
  if (summary.body) {
    out.push('```');
    out.push(summary.body);
    out.push('```');
    out.push('');
  }

  if (tokens.size) {
    out.push('### Tokens');
    out.push('');
    const { fams, singles } = families([...tokens.keys()].map(t => t.slice(2)));
    for (const f of fams) {
      const scopes = [...tokens.get('--' + f.members[0]).scopes].join(', ');
      out.push(`- \`--${f.family}-{${f.steps.join('|')}}\` — ${scopes}`);
    }
    if (singles.length) {
      out.push('');
      out.push('| Token | Scope | Example value |');
      out.push('|---|---|---|');
      for (const n of singles) {
        const t = tokens.get('--' + n);
        out.push(`| \`--${n}\` | ${[...t.scopes].join(', ')} | ${t.example.replace(/\|/g, '\\|').slice(0, 60)} |`);
      }
    }
    out.push('');
  }

  const notes = partial(file);
  if (notes) {
    out.push(notes);
    out.push('');
  }

  const bySection = new Map();
  for (const entry of map.values()) {
    const key = entry.section || '(no section)';
    if (!bySection.has(key)) bySection.set(key, []);
    bySection.get(key).push(entry);
  }

  for (const [title, entries] of bySection) {
    out.push(`### ${title}`);
    out.push('');
    const { fams, singles } = families(entries.map(e => e.name));

    if (fams.length) {
      out.push('**Scales**');
      out.push('');
      for (const f of fams) {
        const example = map.get(f.members[0]);
        out.push(
          `- \`.${f.family}-{${f.steps.join('|')}}\` — ${summarize(example, 3) || 'variant scale'} *(smallest step shown)*`
        );
      }
      out.push('');
    }

    if (singles.length) {
      out.push('| Class | Declares | Tokens |');
      out.push('|---|---|---|');
      for (const name of singles) {
        const e = map.get(name);
        const decl = summarize(e).replace(/\|/g, '\\|') || '*contextual — styled via a parent*';
        const toks = [...e.tokens].slice(0, 4).join(', ') + (e.tokens.size > 4 ? ', …' : '');
        const also = alsoIn.has(name) ? ` *(also styled in ${alsoIn.get(name).join(', ')})*` : '';
        out.push(`| \`.${name}\` | ${decl}${also} | ${toks || '—'} |`);
      }
      out.push('');
    }
  }
}

writeFileSync(OUT, out.join('\n') + '\n');

/* JSON twin, consumed by docs/site so its tables cannot drift from the CSS. */
const json = {
  _generated: 'npm run build:css-api — do not edit by hand',
  loadOrder: order,
  stylesheets: perFile.map(({ file, summary, map, tokens }) => ({
    file,
    covers: summary.covers,
    classes: [...map.values()].map(e => ({
      name: e.name,
      section: e.section,
      declares: summarize(e) || null,
      tokens: [...e.tokens],
      alsoStyledIn: alsoIn.get(e.name) || [],
    })),
    tokens: [...tokens.values()].map(t => ({ name: t.name, scopes: [...t.scopes], example: t.example })),
  })),
};
writeFileSync(OUT_JSON, JSON.stringify(json, null, 2) + '\n');
console.log(
  `css-api.md — ${stats.classes} classes, ${stats.tokens} tokens, ${stats.files} stylesheets ` +
    `(${stats.hidden} internal omitted)`
);
