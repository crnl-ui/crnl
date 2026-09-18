#!/usr/bin/env node
/* =============================================================================
   build-inventory.mjs — one page that answers "what is in here?"
   =============================================================================
   The sticker sheet shows every class. docs/css-api.md lists every class. What
   neither shows is the system as a set of *components* — what exists at each
   layer, which ones the React library covers, and where to look at each one.

   That question gets asked at the start of every piece of work, by a person
   and by an agent, and until now it was answered by reading 2,295 lines of
   generated reference and a directory listing.

   Generated from four sources, none of them hand-maintained:

     docs/css-api.json        the class and token surface, per stylesheet
     src/components/*         the React layer and what each component renders
     src/index.ts             what the package actually exports
     demo/*.html              which sheet shows each component live

   Writes docs/inventory.md and docs/inventory.json. The JSON is the one an
   agent should read: same content, no prose to parse.

   Run: npm run build:inventory
   ============================================================================= */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/* ---------------------------------------------------------------------------
   The layers. A class's layer is a property of the stylesheet that defines it,
   which is why this is the only hand-written table here: the load order knows
   the sequence, but not what each position means.
   --------------------------------------------------------------------------- */
const LAYERS = {
  'design-tokens-master.css': ['token', 'Colour, in both modes, plus the base theme'],
  'themes.css': ['token', 'The five shipped themes'],
  'spacing-tokens.css': ['token', 'The 8px scale and its utilities'],
  'container-tokens.css': ['token', 'Content widths and page padding'],
  'border-effects-tokens.css': ['token', 'Radius, border weight, shadow, scrim'],
  'ui-fonts.css': ['token', 'The UI and icon faces'],
  'fonts.css': ['token', 'Every shipped display face'],
  'display-fonts.css': ['token', 'A tuned display ramp per face'],
  'text-styles-system.css': ['primitive', 'The type scale'],
  'icons.css': ['primitive', 'The icon system'],
  'interactive-tokens.css': ['primitive', 'Surfaces and scales — the press mechanism'],
  'boilerplate.css': ['primitive', 'Reset, element defaults, layout utilities'],
  'card-components.css': ['component', 'Cards, tiles, media bands'],
  'button-components.css': ['component', 'Buttons'],
  'list-row-components.css': ['component', 'The list row and everything on it'],
  'table-components.css': ['component', 'The stat table'],
  'input-components.css': ['component', 'Text input and select'],
  'tag-chip-components.css': ['component', 'Tags and chips'],
  'nav-components.css': ['component', 'Top bar, tabs, steps, page header'],
  'ios-nav-components.css': ['component', 'iOS chrome for app mode'],
  'web-footer-components.css': ['component', 'The site footer'],
  'product-patterns.css': ['pattern', 'Composite layouts above the component layer'],
  'system-ui.css': ['vendor', 'Vendor chrome — exempt by RULES §7'],
  'platform-tokens.css': ['platform', 'The web/app switch and the phone frame'],
}

const LAYER_ORDER = ['token', 'primitive', 'component', 'pattern', 'vendor', 'platform']

/* ---------------------------------------------------------------------------
   Read the sources
   --------------------------------------------------------------------------- */

const api = JSON.parse(readFileSync(join(ROOT, 'docs', 'css-api.json'), 'utf8'))

/** Every class the CSS defines, and which stylesheet defines it. */
const classOwner = new Map()
for (const sheet of api.stylesheets) {
  for (const c of sheet.classes ?? []) {
    if (!classOwner.has(c.name)) classOwner.set(c.name, sheet.file)
  }
}

/** What each React component renders, read out of its own source. */
function readReactLayer() {
  const dir = join(ROOT, 'src', 'components')
  if (!existsSync(dir)) return []
  const out = []
  for (const name of readdirSync(dir).sort()) {
    const compDir = join(dir, name)
    if (!statSync(compDir).isDirectory()) continue
    const files = readdirSync(compDir)
    const impl = files.filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
    const stories = files.filter((f) => f.endsWith('.stories.tsx'))

    const classes = new Set()
    for (const f of impl) {
      const src = readFileSync(join(compDir, f), 'utf8')
      /* Every className the component can emit, including the ones assembled
         in a ternary or joined from an array — a class only reachable in one
         branch is still part of what this component renders. */
      for (const m of src.matchAll(/className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{'([^']*)'\})/g)) {
        for (const c of (m[1] ?? m[2] ?? m[3] ?? m[4] ?? '').split(/\s+/)) {
          if (c && !c.includes('$') && !c.includes('{')) classes.add(c)
        }
      }
      for (const m of src.matchAll(/'([a-z][\w-]*(?:\s+[a-z][\w-]*)*)'/g)) {
        for (const c of m[1].split(/\s+/)) if (classOwner.has(c)) classes.add(c)
      }
    }
    out.push({
      name,
      files: impl.length,
      hasStories: stories.length > 0,
      classes: [...classes].filter((c) => classOwner.has(c)).sort(),
      unknownClasses: [...classes].filter((c) => !classOwner.has(c)).sort(),
    })
  }
  return out
}

/** What the package exports, keyed by the component directory it comes from.
    A directory can export several symbols — Card ships CardClosed, CardOpen
    and CardSection — so the directory name is not the thing to look for. */
function readExports() {
  const src = readFileSync(join(ROOT, 'src', 'index.ts'), 'utf8')
  const byDir = new Map()
  for (const m of src.matchAll(/export\s+(type\s+)?\{([^}]*)\}\s+from\s+'\.\/components\/([^']+)'/g)) {
    if (m[1]) continue // a type-only export is not a component
    const dir = m[3].split('/')[0]
    const names = m[2].split(',')
      .map((p) => p.trim().split(/\s+as\s+/).pop()?.trim())
      .filter((n) => n && /^[A-Z]/.test(n))
    byDir.set(dir, [...(byDir.get(dir) ?? []), ...names])
  }
  return byDir
}

/** Which demo sheet shows each class live. */
function readSheets() {
  const dir = join(ROOT, 'demo')
  const byClass = new Map()
  const sheets = []
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith('.html')) continue
    const src = readFileSync(join(dir, f), 'utf8')
    const title = /<title>([^<]*)<\/title>/.exec(src)?.[1]?.split('—')[0].trim() ?? f
    sheets.push({ file: f, title })
    const markup = src.replace(/<script[\s\S]*?<\/script>/g, '')
    for (const m of markup.matchAll(/class="([^"]*)"/g)) {
      for (const c of m[1].split(/\s+/)) {
        if (!c || !classOwner.has(c)) continue
        if (!byClass.has(c)) byClass.set(c, f)
      }
    }
  }
  return { byClass, sheets }
}

const react = readReactLayer()
const exported = readExports()
const { byClass, sheets } = readSheets()

/* ---------------------------------------------------------------------------
   Join them
   --------------------------------------------------------------------------- */

/** The React component that renders a given class, if any. */
const reactForClass = new Map()
for (const comp of react) {
  for (const c of comp.classes) {
    if (!reactForClass.has(c)) reactForClass.set(c, comp.name)
  }
}

const stylesheets = api.stylesheets.map((sheet) => {
  const [layer, covers] = LAYERS[sheet.file] ?? ['component', sheet.covers]
  const classes = (sheet.classes ?? []).map((c) => ({
    name: c.name,
    section: c.section ?? null,
    react: reactForClass.get(c.name) ?? null,
    sheet: byClass.get(c.name) ?? null,
  }))
  return {
    file: sheet.file,
    layer,
    covers,
    classCount: classes.length,
    tokenCount: (sheet.tokens ?? []).length,
    reactCovered: classes.filter((c) => c.react).length,
    classes,
  }
})

const components = react.map((c) => ({
  ...c,
  exports: exported.get(c.name) ?? [],
  exported: (exported.get(c.name) ?? []).length > 0,
  stylesheets: [...new Set(c.classes.map((cl) => classOwner.get(cl)))].sort(),
}))

const totals = {
  classes: classOwner.size,
  tokens: stylesheets.reduce((a, s) => a + s.tokenCount, 0),
  stylesheets: stylesheets.length,
  sheets: sheets.length,
  reactComponents: components.length,
  reactExported: components.filter((c) => c.exported).length,
  classesWithReact: reactForClass.size,
  classesOnASheet: byClass.size,
}

/* ---------------------------------------------------------------------------
   Write
   --------------------------------------------------------------------------- */

writeFileSync(
  join(ROOT, 'docs', 'inventory.json'),
  JSON.stringify({
    _generated: 'npm run build:inventory — do not edit by hand',
    totals, stylesheets, components, sheets,
  }, null, 2) + '\n'
)

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0)

const lines = []
const w = (s = '') => lines.push(s)

w('# Inventory')
w()
w('> **Generated file — do not edit.** Produced by `npm run build:inventory` from')
w('> `docs/css-api.json`, `src/components/`, `src/index.ts` and `demo/*.html`.')
w('>')
w('> This answers *what exists*, at a glance. `docs/css-api.md` is the exhaustive')
w('> per-class reference; `docs/design-guide.md` explains when to reach for each')
w('> thing. Read `docs/inventory.json` instead of this file if you are an agent —')
w('> same content, nothing to parse.')
w()
w(`**${totals.classes} classes and ${totals.tokens} tokens across ${totals.stylesheets} stylesheets, shown live on ${totals.sheets} demo sheets, with ${totals.reactExported} React components over the top.**`)
w()

w('## The two layers')
w()
w('The CSS is the system. The React library is a typed convenience over part of')
w('it — not a parity target, and not a prerequisite. Anything with no React')
w('component is markup plus classes, which is the normal way to use this.')
w()
w('| | Count | Covered by React |')
w('|---|---:|---:|')
for (const layer of LAYER_ORDER) {
  const inLayer = stylesheets.filter((s) => s.layer === layer)
  if (!inLayer.length) continue
  const classes = inLayer.reduce((a, s) => a + s.classCount, 0)
  const covered = inLayer.reduce((a, s) => a + s.reactCovered, 0)
  if (!classes) continue
  w(`| ${layer} | ${classes} | ${covered} (${pct(covered, classes)}%) |`)
}
w()

w('## Stylesheets')
w()
w('In load order. `crnl-loader.js` owns that order (`RULES §1`).')
w()
w('| # | Stylesheet | Layer | Classes | Tokens | React | Covers |')
w('|---:|---|---|---:|---:|---:|---|')
stylesheets.forEach((s, i) => {
  const r = s.classCount ? `${s.reactCovered}/${s.classCount}` : '—'
  w(`| ${i + 1} | \`${s.file}\` | ${s.layer} | ${s.classCount || '—'} | ${s.tokenCount || '—'} | ${r} | ${s.covers} |`)
})
w()

w('## React components')
w()
w(`${totals.reactComponents} in \`src/components/\`, ${totals.reactExported} exported from \`src/index.ts\`.`)
w('A component that is not exported cannot be imported from the package, whatever')
w('else is true of it.')
w()
w('| Component | Exports | Stories | Renders | From |')
w('|---|---|---|---:|---|')
for (const c of components) {
  const from = c.stylesheets.map((f) => `\`${f.replace('-components.css', '').replace('.css', '')}\``).join(', ') || '—'
  const ex = c.exported ? c.exports.map((n) => `\`${n}\``).join(' ') : '**none**'
  w(`| \`${c.name}\` | ${ex} | ${c.hasStories ? 'yes' : '**no**'} | ${c.classes.length} | ${from} |`)
}
w()
const noStories = components.filter((c) => !c.hasStories)
const notExported = components.filter((c) => !c.exported)
if (noStories.length) {
  w(`**No stories:** ${noStories.map((c) => `\`${c.name}\``).join(', ')} — nothing renders these in Storybook, so nothing catches a break in them.`)
  w()
}
if (notExported.length) {
  w(`**Not exported:** ${notExported.map((c) => `\`${c.name}\``).join(', ')}.`)
  w()
}

w('## Demo sheets')
w()
w('Every class rendered live, in the real CSS. Open `demo/index.html`.')
w()
w('| Sheet | Shows |')
w('|---|---|')
for (const s of sheets) w(`| [\`${s.file}\`](../demo/${s.file}) | ${s.title} |`)
w()

w('## What has no live specimen')
w()
const notShown = [...classOwner.keys()].filter((c) => !byClass.has(c))
if (!notShown.length) {
  w('Nothing. Every class appears in a `class=` attribute on a sheet.')
} else {
  w(`${notShown.length} class(es) appear by name on a sheet but have no live specimen —`)
  w('legitimate for a utility scale, where 300 identical boxes would show less')
  w('than one listing. `npm run check:demo` is what holds the line.')
  w()
  const byFile = {}
  for (const c of notShown) (byFile[classOwner.get(c)] ??= []).push(c)
  for (const [file, list] of Object.entries(byFile).sort()) {
    w(`- \`${file}\` — ${list.length}: ${list.slice(0, 12).map((c) => `\`.${c}\``).join(' ')}${list.length > 12 ? ' …' : ''}`)
  }
}
w()

writeFileSync(join(ROOT, 'docs', 'inventory.md'), lines.join('\n'))

console.log(
  `inventory — ${totals.classes} classes, ${totals.tokens} tokens, ` +
  `${totals.reactExported}/${totals.reactComponents} React exported, ` +
  `${totals.classesWithReact} class(es) reachable through React (${pct(totals.classesWithReact, totals.classes)}%)`
)
