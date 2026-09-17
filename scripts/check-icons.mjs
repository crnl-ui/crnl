/* =============================================================================
   check-icons.mjs — every icon in the markup is in the subset that ships
   =============================================================================
   The icon font is subset to the icons this repository uses, which is what
   turns 15MB of Material Symbols into 17KB. The cost is that an icon name
   outside the subset does not fail — it renders as its own letters, because an
   icon *is* a ligature over its name. A nav bar quietly reading
   "home  sell  confirmation_number" is the failure mode.

   So: the names in the markup are compared against fonts/icons.json, which
   scripts/build-ui-fonts.py writes. Adding an icon is two steps, and this is
   the thing that tells you about the second one.

   Run:  npm run check:icons
   Exits non-zero on any name not in the shipped subset, writes nothing.
   ============================================================================= */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/* Kept in step with SCAN_DIRS / ICON_PATTERNS in scripts/build-ui-fonts.py. */
const SCAN_DIRS = ['demo', 'tools', 'css', 'src']
const SCAN_EXT  = ['.html', '.js', '.mjs', '.tsx', '.ts']
const SKIP_DIRS = new Set(['node_modules', 'built-fonts', '_build', 'licenses'])

const PATTERNS = [
  /<span[^>]*class="[^"]*(?:material-symbols-rounded|\bicon\b)[^"]*"[^>]*>\s*([a-z0-9_]+)\s*<\/span>/gs,
]
/* A call or an assignment can hold more than one name — `icon(dark ?
   'dark_mode' : 'light_mode')` is how the harness swaps its toggle. Matching
   only the first literal missed the second, and the toggle shipped rendering
   the word "dark_mode". So the whole expression is captured and every quoted
   token in it is a candidate. */
const EXPRESSIONS = [
  /\bicon\(([^)]*)\)/g,
  /textContent\s*=\s*([^;\n]+)/g,
]
const LITERAL = /'([a-z][a-z0-9_]*)'/g

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (SCAN_EXT.some(e => entry.endsWith(e))) out.push(p)
  }
  return out
}

const manifest = JSON.parse(readFileSync(join(ROOT, 'fonts', 'icons.json'), 'utf8'))
const shipped = new Set(manifest.icons)
/* Candidates the scan picks up that are not Material Symbols names — string
   literals that happen to sit in the same expressions icon names do. The build
   classifies them against the upstream font; recorded so they are not reported
   here every run. */
const ignored = new Set(manifest.ignored ?? [])

/* name -> the files that use it, so a failure says where to look */
const used = new Map()
for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const src = readFileSync(file, 'utf8')
    const record = name => {
      if (name.length < 2) return
      if (!used.has(name)) used.set(name, new Set())
      used.get(name).add(relative(ROOT, file))
    }
    for (const pat of PATTERNS) {
      pat.lastIndex = 0
      for (const m of src.matchAll(pat)) record(m[1])
    }
    for (const pat of EXPRESSIONS) {
      pat.lastIndex = 0
      for (const m of src.matchAll(pat)) {
        LITERAL.lastIndex = 0
        for (const lit of m[1].matchAll(LITERAL)) record(lit[1])
      }
    }
  }
}

const missing = [...used.keys()].filter(n => !shipped.has(n) && !ignored.has(n)).sort()
/* An icon in the subset that nothing uses is dead weight, but a tiny amount of
   it — reported, not fatal, because removing one is a rebuild. */
const unused = [...shipped].filter(n => !used.has(n)).sort()

console.log(`check-icons — ${used.size} name(s) in the markup, ${shipped.size} in the shipped subset`)

if (ignored.size) {
  console.log(`  ${ignored.size} non-icon literal(s) ignored: ${[...ignored].join(' ')}`)
}
if (unused.length) {
  console.log(`  ${unused.length} shipped but unused: ${unused.join(' ')}`)
}

if (!missing.length) {
  console.log('  Complete.')
} else {
  console.log('')
  for (const n of missing) {
    console.log(`  ${n} — not in the shipped subset, will render as letters`)
    for (const f of [...used.get(n)].sort()) console.log(`      ${f}`)
  }
  console.log(`\n${missing.length} icon(s) missing. Run \`npm run build:ui-fonts\` — it re-cuts`)
  console.log('the font, and records anything that is not a Material Symbols name as ignored.')
  process.exit(1)
}
