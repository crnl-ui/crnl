/* =============================================================================
   check-themes.mjs — every theme supplies the whole contract, legibly
   =============================================================================
   A theme is a token set (docs/theming.md). Two things go wrong with one and
   neither shows up until a screen is built on it:

     1. A missing token. The theme inherits the base value, which is neutral
        grey — so the theme looks *almost* right and the miss reads as a design
        choice rather than an omission.
     2. An illegible pair. A brand colour that works as a page accent can fail
        badly as a button fill, and dark mode is where it usually happens.

   So: the base theme in design-tokens-master.css defines the contract, and
   every [data-theme] block is checked against it, then against WCAG AA.

   Run:  npm run check:themes
   Exits non-zero on any failure, writes nothing.
   ============================================================================= */

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const CSS = join(dirname(fileURLToPath(import.meta.url)), '..', 'css')
const AA = 4.5

/* ---------- Parse [selector] { --token: value } out of the stylesheets ----- */

function blocks(source) {
  /* Comments are stripped first. Without this the selector capture picks up the
     comment banner above a rule, so `:root` never matches `:root` and the whole
     contract silently derives as empty — a check that passes because it is
     checking nothing. */
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const out = []
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m
  while ((m = re.exec(css))) {
    const selector = m[1].trim().replace(/\s+/g, ' ')
    const tokens = {}
    for (const [, k, v] of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      tokens[k] = v.trim()
    }
    if (Object.keys(tokens).length) out.push({ selector, tokens })
  }
  return out
}

const all = readdirSync(CSS)
  .filter(f => f.endsWith('.css') && f !== 'crnl.css')
  .flatMap(f => blocks(readFileSync(join(CSS, f), 'utf8')))

/* The contract is what the base theme defines. Derived from the CSS rather than
   listed here, so adding a token to the base theme extends the contract
   automatically.

   A token counts if it is one a theme decides: the brand pair, the display
   ramp, the --org-* plumbing and the mode-aware accents. --ios-selected-tab-bg
   is a mode default rather than a theme decision, so the tail-less names are
   matched exactly rather than by prefix. Tokens whose base value is a url() —
   the brand mark and the tab icon — are optional: a theme without its own mark
   should fall through to the placeholder, not fail. */
const EXACT = new Set([
  '--color-interactive', '--color-inverted', '--ios-selected-tab',
  '--button-border-radius', '--background-blur',
])
const isContract = (t, v) =>
  !/^url\(/.test(v) &&
  (/^--(brand|display|org)-/.test(t) || EXACT.has(t))

/* Tokens from every block whose selector mentions `sel`, filtered to the
   contract. A selector list (`:root, [data-mode="light"]`) belongs to both. */
const from = sel =>
  all.filter(b => b.selector.split(',').some(s => s.trim() === sel))
     .flatMap(b => Object.entries(b.tokens))
     .filter(([t, v]) => isContract(t, v))
     .map(([t]) => t)

const BASE_LIGHT = [...new Set(from('[data-mode="light"]'))]
const BASE_DARK  = [...new Set(from('[data-mode="dark"]'))]
/* `:root, [data-mode="light"]` is how the base theme declares its light values,
   so a token claimed by light mode is not also a base-block requirement. */
const BASE = [...new Set(from(':root'))].filter(t => !BASE_LIGHT.includes(t))

/* ---------- Collect the themes ------------------------------------------- */

const themes = new Map()
const slot = name => {
  if (!themes.has(name)) themes.set(name, { base: {}, light: {}, dark: {} })
  return themes.get(name)
}
for (const b of all) {
  const m = b.selector.match(/^\[data-theme="([\w-]+)"\](?:\[data-mode="(light|dark)"\])?$/)
  if (!m) continue
  Object.assign(slot(m[1])[m[2] ?? 'base'], b.tokens)
}

/* ---------- Contrast ------------------------------------------------------ */

function rgb(v) {
  let m = v.match(/^#([0-9a-f]{6})$/i)
  if (m) return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16))
  m = v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i)
  if (m) return [1, 2, 3].map(i => Number(m[i]))
  return null                       // a var() or a keyword — not ours to judge
}
const lum = c => {
  const f = x => (x /= 255) <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const PAIRS = [
  ['--org-primary-button',       '--org-primary-button-text'],
  ['--org-transactional-button', '--org-transactional-button-text'],
  ['--color-interactive',        '--org-base'],
]

/* ---------- Report -------------------------------------------------------- */

const failures = []
for (const [name, t] of [...themes].sort()) {
  const check = (have, want, where) => {
    for (const token of want) {
      if (!(token in have)) failures.push(`${name} · ${where} · missing ${token}`)
    }
  }
  check(t.base, BASE, 'base')
  check({ ...t.base, ...t.light }, BASE_LIGHT, 'light')
  check({ ...t.base, ...t.dark },  BASE_DARK,  'dark')

  for (const mode of ['light', 'dark']) {
    const m = { ...t.base, ...t[mode] }
    for (const [a, b] of PAIRS) {
      const [ca, cb] = [rgb(m[a] ?? ''), rgb(m[b] ?? '')]
      if (!ca || !cb) continue
      const r = ratio(ca, cb)
      if (r < AA) failures.push(`${name} · ${mode} · ${a} on ${b} is ${r.toFixed(2)}:1, below ${AA}:1`)
    }
  }
}

console.log(`check-themes — ${themes.size} theme(s), ${BASE.length + BASE_LIGHT.length + BASE_DARK.length} tokens in the contract`)
if (!failures.length) {
  console.log('  Complete.')
} else {
  console.log('')
  for (const f of failures) console.log(`  ${f}`)
  console.log(`\n${failures.length} failure(s).`)
  process.exit(1)
}
