#!/usr/bin/env node
/* =============================================================================
   check-a11y.mjs — run axe-core over every demo sheet, in both modes
   =============================================================================
   `npm run lint` catches the accessibility failures that are visible in the
   markup: a tappable <div> a keyboard cannot reach, a bare control with no
   wrapper. It cannot see anything that depends on what the browser computed —
   whether a colour pair actually clears 4.5:1 once the theme resolved, whether
   an interactive element ends up with an accessible name, whether the heading
   order a page produces makes sense.

   That is what this is for, and it is the reason it needs a real browser: the
   demo sheets *are* the system rendered, so auditing them audits the system.

   Unlike check:visual, this has no machine-specific baseline. axe returns rule
   ids and node targets, not pixels, so the result is the same on any machine —
   which is why this one can run in CI and that one cannot.

   The baseline works the same way the linter's does: scripts/a11y-baseline.json
   records what the repository already carries, per sheet and per rule. The run
   fails above those counts and is quiet at or below them, so existing debt does
   not block work and nothing can add to it. A count that drops also fails, for
   the same reason it does in the linter: either somebody fixed something
   without banking it, or a rule stopped running.

   Run:  npm run check:a11y
         node scripts/check-a11y.mjs --json
         node scripts/check-a11y.mjs --update-baseline
         node scripts/check-a11y.mjs --full          every finding, not a summary
   ============================================================================= */

import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE_PATH = join(ROOT, 'scripts', 'a11y-baseline.json')
const AXE = join(ROOT, 'node_modules', 'axe-core', 'axe.min.js')

const argv = process.argv.slice(2)
const asJson = argv.includes('--json')
const full = argv.includes('--full')
const updateBaseline = argv.includes('--update-baseline')

/* The sheets, in both modes. A theme changes colour values, so contrast is
   worth checking in more than one — but the colour sheet is where every token
   pair is rendered side by side, so it carries the theme sweep on its own,
   exactly as it does for check:visual. */
const SHEETS = readdirSync(join(ROOT, 'demo'))
  .filter(f => f.endsWith('.html') && f !== '11-ios-frame.html')
  .sort()
const THEMES = ['ink', 'signal', 'moss', 'ember', 'violet']

const RUNS = [
  ...SHEETS.flatMap(f => ['light', 'dark'].map(mode => ({ file: f, theme: 'signal', mode }))),
  ...THEMES.flatMap(t => ['light', 'dark'].map(mode => ({ file: '01-color.html', theme: t, mode }))),
]

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
                '.json': 'application/json', '.woff2': 'font/woff2',
                '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }

function serve() {
  const server = createServer((req, res) => {
    const path = join(ROOT, decodeURIComponent(req.url.split('?')[0]))
    if (!path.startsWith(ROOT) || !existsSync(path)) { res.writeHead(404); return res.end() }
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' })
    res.end(readFileSync(path))
  })
  return new Promise(r => server.listen(0, '127.0.0.1', () => r([server, server.address().port])))
}

async function launch() {
  const candidates = [process.env.CHROMIUM_PATH, undefined, '/opt/pw-browsers/chromium']
  let last
  for (const executablePath of candidates) {
    if (executablePath !== undefined && !existsSync(executablePath)) continue
    try { return await chromium.launch(executablePath ? { executablePath } : {}) }
    catch (e) { last = e }
  }
  throw last
}

if (!existsSync(AXE)) {
  console.error('check-a11y — axe-core is not installed. Run `npm install` first.')
  process.exit(2)
}
const axeSource = readFileSync(AXE, 'utf8')

const [server, port] = await serve()
let browser
try { browser = await launch() } catch (e) {
  server.close()
  console.error('check-a11y — could not launch Chromium.\n' +
    '  npx playwright install chromium   (once)\n' +
    '  or set CHROMIUM_PATH to an existing browser.\n' + (e?.message ?? ''))
  process.exit(2)
}

const findings = []

for (const run of RUNS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  /* The harness persists the last theme and mode; without this it would
     restore them over the ones set here. Same reason check:visual does it. */
  await page.addInitScript(() => { try { localStorage.clear() } catch {} })
  await page.goto(`http://127.0.0.1:${port}/demo/${run.file}`, { waitUntil: 'networkidle' })
  await page.evaluate(([theme, mode]) => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-mode', mode)
  }, [run.theme, run.mode])
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)

  await page.addScriptTag({ content: axeSource })
  const results = await page.evaluate(async () => {
    /* WCAG 2 A and AA only. axe's "best-practice" rules are opinions worth
       reading but not worth failing a build over, and mixing them in makes
       the count meaningless. */
    const r = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      resultTypes: ['violations'],
    })
    return r.violations.map(v => ({
      id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
      nodes: v.nodes.map(n => ({ target: n.target.join(' '), summary: (n.failureSummary ?? '').split('\n')[1] ?? '' })),
    }))
  })
  for (const v of results) {
    for (const n of v.nodes) {
      findings.push({
        sheet: run.file, theme: run.theme, mode: run.mode,
        rule: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
        target: n.target, detail: n.summary,
      })
    }
  }
  await page.close()
}

await browser.close()
server.close()

/* ── Baseline ─────────────────────────────────────────────────────────────── */

const key = f => `${f.sheet} ${f.rule}`
const counts = {}
for (const f of findings) counts[key(f)] = (counts[key(f)] ?? 0) + 1

if (updateBaseline) {
  writeFileSync(BASELINE_PATH, JSON.stringify({
    _generated: 'node scripts/check-a11y.mjs --update-baseline',
    _what: 'axe-core WCAG 2 A/AA violations this repository already carries, ' +
           'per sheet and per rule. The run fails outside these counts in either ' +
           'direction: above means a regression, below means a fix nobody banked ' +
           'or a rule that stopped running.',
    _total: findings.length,
    counts: Object.fromEntries(Object.entries(counts).sort()),
  }, null, 2) + '\n')
  console.log(`check-a11y — baseline written: ${findings.length} violation(s) across ${Object.keys(counts).length} sheet/rule pair(s).`)
  process.exit(0)
}

const baseline = existsSync(BASELINE_PATH)
  ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).counts ?? {}
  : {}

const over = [], under = []
for (const [k, n] of Object.entries(counts)) {
  const allowed = baseline[k] ?? 0
  if (n > allowed) over.push({ k, n, allowed })
}
for (const [k, allowed] of Object.entries(baseline)) {
  const n = counts[k] ?? 0
  if (n < allowed) under.push({ k, n, allowed })
}

if (asJson) {
  console.log(JSON.stringify({ runs: RUNS.length, violations: findings.length, over, under, findings }, null, 2))
} else {
  console.log(`check-a11y — axe-core WCAG 2 A/AA across ${RUNS.length} render(s) of ${SHEETS.length} sheet(s)\n`)

  const byRule = {}
  for (const f of findings) (byRule[f.rule] ??= []).push(f)
  const rules = Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)

  if (!rules.length) console.log('  No violations.\n')
  for (const [rule, list] of rules) {
    const impact = list[0].impact ?? 'n/a'
    console.log(`  ${String(list.length).padStart(4)}  ${rule}  (${impact})`)
    console.log(`        ${list[0].help}`)
    const sheets = [...new Set(list.map(f => f.sheet))]
    console.log(`        on ${sheets.length} sheet(s): ${sheets.slice(0, 6).join(' ')}${sheets.length > 6 ? ' …' : ''}`)
    if (full) for (const f of list) console.log(`          ${f.sheet} [${f.mode}] ${f.target}`)
    console.log('')
  }
  console.log(`  ${findings.length} violation(s) total.`)
  if (Object.keys(baseline).length) {
    console.log(`  ${findings.length - over.reduce((a, o) => a + (o.n - o.allowed), 0)} at or below the recorded baseline.`)
  }
  if (under.length) {
    console.log('\n  Below the baseline. Either a fix was not banked, or a rule stopped running —')
    console.log('  check which, then run `node scripts/check-a11y.mjs --update-baseline`:')
    for (const u of under) console.log(`    ${u.k}  ${u.allowed} → ${u.n}`)
  }
  if (over.length) {
    console.log('\n  Above the recorded baseline:')
    for (const o of over) console.log(`    ${o.k}  ${o.allowed} recorded, ${o.n} found`)
  }
  console.log('')
}

process.exit(over.length || under.length ? 1 : 0)
