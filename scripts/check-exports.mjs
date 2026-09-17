/* =============================================================================
   check-exports.mjs — every path this package publishes actually resolves
   =============================================================================
   package.json shipped an `exports` entry for `./style.css` pointing at
   `dist/style.css`, a file the build has never produced. Anyone following the
   manifest got a resolution error, and nothing in the repo noticed — the
   manifest is the one interface no check was reading.

   So: walk `exports` and `files`, resolve every concrete path, and fail on any
   that is missing. Wildcards (`./css/*`) are checked by asserting the directory
   exists and is not empty, which is as far as a static check can go.

   Build outputs are expected to be absent in a fresh clone, so those are
   reported as "run npm run build" rather than failed. But once a build *has*
   run — detected by dist/ existing — a missing build output is a real failure,
   because the build was given its chance and did not produce it. That is
   exactly the `dist/style.css` case, and without this it stays invisible.

   Run:  npm run check:exports
   Exits non-zero on a path that cannot exist, writes nothing.
   ============================================================================= */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg  = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

/* Paths the build produces. Missing before `npm run build`, which is fine —
   but only until a build has happened. */
const BUILT = [/^\.\/dist\//, /^\.\/css\/crnl\.css$/]
const isBuilt = p => BUILT.some(re => re.test(p))
const HAS_BUILT = existsSync(join(ROOT, 'dist'))

const targets = []
const walk = (value, label) => {
  if (typeof value === 'string') targets.push([label, value])
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) walk(v, `${label} → ${k}`)
}
for (const [key, value] of Object.entries(pkg.exports ?? {})) walk(value, key)

const missing = [], pending = []

for (const [label, target] of targets) {
  if (target.includes('*')) {
    /* A wildcard can only be checked as far as its directory. */
    const dir = join(ROOT, target.slice(2).split('*')[0])
    if (!existsSync(dir) || !statSync(dir).isDirectory() || !readdirSync(dir).length) {
      missing.push(`${label} → ${target} — directory missing or empty`)
    }
    continue
  }
  if (existsSync(join(ROOT, target.replace(/^\.\//, '')))) continue
  ;(isBuilt(target) && !HAS_BUILT ? pending : missing).push(`${label} → ${target}`)
}

/* `files` decides what a published tarball contains; an entry naming nothing is
   either a typo or a directory that was renamed out from under it. */
for (const entry of pkg.files ?? []) {
  const p = join(ROOT, entry)
  if (!existsSync(p) && !isBuilt(`./${entry}/`)) missing.push(`files[] → ${entry}`)
}

console.log(`check-exports — ${targets.length} export path(s), ${(pkg.files ?? []).length} files[] entr(y/ies)` +
            (HAS_BUILT ? ' · dist/ present, build outputs required' : ' · no build yet'))
if (pending.length) {
  console.log(`  ${pending.length} build output(s) not present (run \`npm run build\`): ${pending.join(', ')}`)
}
if (!missing.length) {
  console.log('  Complete.')
} else {
  console.log('')
  for (const m of missing) console.log(`  ${m} — does not exist`)
  console.log(`\n${missing.length} path(s) in package.json point at nothing.`)
  process.exit(1)
}
