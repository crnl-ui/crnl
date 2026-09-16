/* =============================================================================
   check-assets.mjs — every shipped SVG actually decodes
   =============================================================================
   An SVG with malformed XML still serves with the right content-type and still
   reports `complete` on an <img>. It just paints nothing, at a natural size of
   0×0, so the page shows an empty box and no error anywhere.

   The way to produce one without noticing: put `--` inside an XML comment. It
   is illegal there, and a comment mentioning a custom property (`--brand-logo-url`)
   does it silently. That is the bug this check exists for.

   Run:  npm run check:assets
   Exits non-zero on any file that does not parse, writes nothing.
   ============================================================================= */

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DOMParser } from '@xmldom/xmldom'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = ['images']

const failures = []
let checked = 0

for (const dir of DIRS) {
  for (const file of readdirSync(join(ROOT, dir)).filter(f => f.endsWith('.svg'))) {
    const path = join(dir, file)
    const src = readFileSync(join(ROOT, path), 'utf8')
    checked++

    /* Cheap, exact check first: XML forbids `--` inside a comment, and that is
       the failure mode that actually happens here. */
    for (const [, body] of src.matchAll(/<!--([\s\S]*?)-->/g)) {
      if (body.includes('--')) {
        failures.push(`${path}: "--" inside an XML comment — the file will not decode`)
      }
    }

    /* xmldom throws on a fatal error rather than routing it through onError, so
       this is caught per file — one bad asset should name itself and let the
       rest still be checked, not abort the run. */
    const errors = []
    try {
      new DOMParser({
        onError: (level, msg) => { if (level !== 'warning') errors.push(String(msg).split('\n')[0]) },
      }).parseFromString(src, 'image/svg+xml')
    } catch (e) {
      errors.push(String(e.message).split('\n')[0])
    }
    for (const e of errors) failures.push(`${path}: ${e}`)
  }
}

console.log(`check-assets — ${checked} SVG(s)`)
if (!failures.length) {
  console.log('  Complete.')
} else {
  console.log('')
  for (const f of [...new Set(failures)]) console.log(`  ${f}`)
  console.log(`\n${new Set(failures).size} failure(s).`)
  process.exit(1)
}
