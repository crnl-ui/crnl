/* =============================================================================
   visual.mjs — screenshot every demo sheet and diff it against a baseline
   =============================================================================
   `npm run check:demo` proves the sheets *mention* every class. It cannot tell
   you that a class still renders correctly, so a token change that quietly
   inverts a surface, or a CSS edit that collapses a row, passes every check in
   this repository. This is the check that looks.

   What it captures
     every sheet × light and dark × three widths             72 shots
     01-color × all five themes × both modes, at desktop     10 shots
     the app-platform sheets × both modes × two widths        8 shots
     the directional sheets, right-to-left, at two widths    10 shots
   The colour sheet resolves every token live out of getComputedStyle, so it is
   the canary for a theme regression; capturing every sheet in every theme would
   be 390 shots for very little more coverage. The three widths are the
   breakpoints RULES §9 names, and they are not optional coverage: the
   responsive utilities, the `-r` type pairs and most of platform-tokens.css
   only apply below 1100px.

   Determinism is the whole game — a flaky baseline gets ignored, and an ignored
   check is worse than no check. Four things are pinned before each shot:
     - **The clock.** demo-content.js builds its fixtures from `new Date()`, so
       without this the dates change daily and every baseline rots overnight.
     - **Animations and transitions**, to zero duration, so nothing is captured
       mid-flight.
     - **localStorage**, because the harness persists the theme and mode you
       last picked and would otherwise restore them over the ones set here.
     - **The caret and scrollbars**, which differ between a headed and a
       headless run.

   **Baselines are local, not committed.** They are specific to the machine and
   browser build that made them: text rasterises differently on macOS and Linux,
   and at this threshold that is the difference between a clean run and every
   shot failing. The first run writes the set; treat it as "this is what the
   system looks like on my machine today" and diff against it from then on. To
   share them, pin the renderer in a container first.

   Run:  npm run check:visual            first run writes baselines, then compares
         npm run check:visual -- --update    accept the current render
   Baselines and diffs both live under tests/visual/ and are gitignored.

   Needs:  npx playwright install chromium   (once)
   ============================================================================= */

import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const ROOT     = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE = join(ROOT, 'tests', 'visual', 'baseline')
const DIFF     = join(ROOT, 'tests', 'visual', 'diff')
const UPDATE   = process.argv.includes('--update')

/* How far apart two pixels must be, in YIQ distance, to count as different.

   **pixelmatch's default of 0.1 is far too loose for a design system.** Surfaces
   here sit a few points off their background on purpose — a card is
   rgb(241,244,250) on white — so squaring the corners of every card on a sheet
   moved ~1,000 pixels from white to near-white and scored *zero* differences at
   0.1. The check passed on a page that was visibly wrong, which is the worst
   thing a check can do.

   0.02 is calibrated against exactly that regression: it scores it at ~1,000
   pixels, while a re-run with nothing changed still scores 0. The loose default
   is tuned to survive comparisons between different renderers; both sides here
   are the same headless Chromium on the same machine, so that noise does not
   exist. */
const THRESHOLD = 0.02

/* pixelmatch skips anti-aliased pixels by default, for the same cross-renderer
   reason. A corner, a border and a divider are largely anti-aliased pixels, so
   skipping them throws away much of what this check is for. */
const INCLUDE_AA = true

/* **An absolute pixel count, not a percentage.** These are full-page captures
   of documentation sheets, up to 1280×10104. A real regression — a card border
   that changed weight, a row that lost its divider — is a few hundred pixels
   out of three million, which is 0.009%: under any percentage threshold worth
   setting, so the check would pass while the sheet was visibly wrong.
   150px sits above the run-to-run noise floor (measured at 0) and below the
   ~1,000 pixels one changed CSS rule produces. */
const MAX_PIXELS = 150

const SHEETS = readdirSync(join(ROOT, 'demo'))
  .filter(f => f.endsWith('.html') && f !== '11-ios-frame.html')   // iframed by 11-ios
  .sort()
const THEMES = ['ink', 'signal', 'moss', 'ember', 'violet']

/* The three breakpoints RULES §9 names. Desktop is the unsuffixed default, so
   the shots that existed before the other two were added keep their filenames
   and their baselines.

   Capturing only desktop was a real hole, not a theoretical one: the responsive
   spacing and grid utilities, every `-r` type pair and most of
   platform-tokens.css only apply below 1100px, so a regression in any of them
   was invisible to this check. That is also why the !important cleanup in
   platform-tokens.css had to wait for this — 67 of them apply in app mode or
   under 500px, and a green run at 1280 would have proved nothing about either.
   See docs/roadmap.md § gap 2. */
const WIDTHS = [
  { w: 1280, label: null },        // desktop — the unsuffixed default
  { w: 800,  label: 'tablet' },    // 500–1099
  { w: 390,  label: 'mobile' },    // <500, and the width the phone frame drops at
]

/* Sheets with rules under [data-platform="app"]. The phone frame changes the
   page's whole geometry, so these are captured in both platforms. */
const APP_SHEETS = ['07-rows.html', '11-ios.html']

/* A right-to-left pass over the sheets whose layout is directional — rows
   with leading and trailing slots, forms, nav, tables. The CSS uses logical
   properties, so these should mirror without a single rule of their own; a
   physical property that slipped back in shows up here as a slot on the
   wrong side. Not every sheet: colour and type have no handedness. */
const RTL_SHEETS = ['06-cards.html', '07-rows.html', '08-forms.html',
                    '09-nav.html', '10-tables.html']

/* De-duplicated: 01-color on the default theme appears in more than one list. */
const SHOTS = [...new Map([
  /* Every sheet, both modes, all three widths, on the default theme. */
  ...SHEETS.flatMap(f => ['light', 'dark'].flatMap(mode =>
    WIDTHS.map(({ w, label }) => ({ file: f, theme: 'signal', mode, width: w, widthLabel: label })))),
  /* The colour sheet in every theme — the canary for a theme regression.
     Desktop only: a theme changes values, not layout. */
  ...THEMES.flatMap(t => ['light', 'dark'].map(mode =>
    ({ file: '01-color.html', theme: t, mode, width: 1280, widthLabel: null }))),
  /* App platform, where the phone frame and the safe areas come in. */
  ...APP_SHEETS.flatMap(f => ['light', 'dark'].flatMap(mode =>
    [1280, 390].map(w => ({
      file: f, theme: 'signal', mode, width: w,
      widthLabel: w === 1280 ? null : 'mobile', platform: 'app',
    })))),
  /* Right-to-left, at desktop and mobile. */
  ...RTL_SHEETS.flatMap(f => [1280, 390].map(w => ({
    file: f, theme: 'signal', mode: 'light', width: w,
    widthLabel: w === 1280 ? null : 'mobile', dir: 'rtl',
  }))),
].map(s => [`${s.file}|${s.theme}|${s.mode}|${s.width}|${s.platform ?? 'web'}|${s.dir ?? 'ltr'}`, s])).values()]

const name = s => [
  s.file.replace('.html', ''), s.theme, s.mode,
  s.widthLabel, s.platform === 'app' ? 'app' : null, s.dir === 'rtl' ? 'rtl' : null,
].filter(Boolean).join('--') + '.png'

/* ── A static server, so no dependency and no port guessing ───────────────── */
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
                '.mjs': 'text/javascript', '.json': 'application/json',
                '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png',
                '.jpg': 'image/jpeg', '.mp4': 'video/mp4' }

function serve() {
  const server = createServer((req, res) => {
    const path = join(ROOT, decodeURIComponent(req.url.split('?')[0]))
    if (!path.startsWith(ROOT) || !existsSync(path)) { res.writeHead(404); return res.end() }
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' })
    res.end(readFileSync(path))
  })
  return new Promise(r => server.listen(0, '127.0.0.1', () => r([server, server.address().port])))
}

/* ── Capture ──────────────────────────────────────────────────────────────── */
const FROZEN = Date.UTC(2026, 0, 15, 12, 0, 0)

async function capture(browser, port, shot) {
  const page = await browser.newPage({ viewport: { width: shot.width ?? 1280, height: 900 },
                                       deviceScaleFactor: 1 })
  /* Before any page script runs: the fixture reads the clock at module scope. */
  await page.addInitScript(frozen => {
    const RealDate = Date
    class FrozenDate extends RealDate {
      constructor(...args) { super(...(args.length ? args : [frozen])) }
      static now() { return frozen }
    }
    window.Date = FrozenDate
    try { localStorage.clear() } catch {}
  }, FROZEN)

  await page.goto(`http://127.0.0.1:${port}/demo/${shot.file}`, { waitUntil: 'networkidle' })
  await page.evaluate(([theme, mode, platform, dir]) => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-mode', mode)
    if (platform) document.documentElement.setAttribute('data-platform', platform)
    if (dir) document.documentElement.setAttribute('dir', dir)
  }, [shot.theme, shot.mode, shot.platform ?? null, shot.dir ?? null])
  await page.addStyleTag({ content: `
    *, *::before, *::after {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      caret-color: transparent !important;
    }
    html { scrollbar-width: none; }
    ::-webkit-scrollbar { display: none; }
  ` })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  const buf = await page.screenshot({ fullPage: true })
  await page.close()
  return buf
}

/* ── Compare ──────────────────────────────────────────────────────────────── */
function compare(actualBuf, baselineBuf) {
  const a = PNG.sync.read(actualBuf), b = PNG.sync.read(baselineBuf)
  if (a.width !== b.width || a.height !== b.height) {
    return { sizeChanged: `${b.width}×${b.height} → ${a.width}×${a.height}` }
  }
  const diff = new PNG({ width: a.width, height: a.height })
  const pixels = pixelmatch(b.data, a.data, diff.data, a.width, a.height,
                            { threshold: THRESHOLD, includeAA: INCLUDE_AA })
  return { pixels, total: a.width * a.height, diff }
}

/* ── Run ──────────────────────────────────────────────────────────────────── */
const [server, port] = await serve()
/* Playwright's own download is the normal case. CHROMIUM_PATH covers a sandbox
   or CI image that ships a browser somewhere else, which is otherwise a
   confusing "could not launch" on a machine that plainly has Chromium. */
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

let browser
try {
  browser = await launch()
} catch (e) {
  server.close()
  console.error('visual: could not launch Chromium.')
  console.error('  Run `npx playwright install chromium` once, or set CHROMIUM_PATH.')
  console.error(`  (${String(e.message).split('\n')[0]})`)
  process.exit(1)
}

mkdirSync(BASELINE, { recursive: true })
if (!UPDATE) { rmSync(DIFF, { recursive: true, force: true }); mkdirSync(DIFF, { recursive: true }) }

const failures = [], created = []
for (const shot of SHOTS) {
  const file = name(shot)
  const buf = await capture(browser, port, shot)
  const basePath = join(BASELINE, file)

  if (UPDATE || !existsSync(basePath)) {
    writeFileSync(basePath, buf)
    created.push(file)
    continue
  }

  const r = compare(buf, readFileSync(basePath))
  if (r.sizeChanged) {
    writeFileSync(join(DIFF, file), buf)
    failures.push(`${file} — size changed, ${r.sizeChanged}`)
  } else if (r.pixels > MAX_PIXELS) {
    writeFileSync(join(DIFF, file), PNG.sync.write(r.diff))
    writeFileSync(join(DIFF, file.replace('.png', '--actual.png')), buf)
    failures.push(`${file} — ${r.pixels} px (${(r.pixels / r.total * 100).toFixed(3)}%) differ`)
  }
}

await browser.close()
server.close()

console.log(`check-visual — ${SHOTS.length} shot(s) across ${SHEETS.length} sheet(s), ` +
            `${THEMES.length} theme(s), 2 modes`)
if (created.length) {
  console.log(`  ${created.length} baseline(s) written${UPDATE ? '' : ' (were missing)'}`)
}
if (!failures.length) {
  console.log('  Complete.')
} else {
  console.log('')
  for (const f of failures) console.log(`  ${f}`)
  console.log(`\n${failures.length} shot(s) changed. Look at tests/visual/diff/, then either fix`)
  console.log('the regression or accept it with `npm run check:visual -- --update`.')
  process.exit(1)
}
