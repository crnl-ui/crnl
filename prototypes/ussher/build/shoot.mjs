/* Screenshot a prototype page inside the phone frame.
   node prototypes/ussher/build/shoot.mjs <page.html> <out-prefix> [--modes=light,dark] [--theme=ink]
        [--scroll=0,900] [--click="#selector"] [--eval="js to run before the shot"] [--scale=2]
   Writes <out-prefix>-<mode>-<scroll>.png. The harness is off so the page's own attributes win. */
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const [page_, prefix, ...rest] = process.argv.slice(2)
const opt = Object.fromEntries(rest.map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=')] }))
const modes = (opt.modes || 'light,dark').split(',')
const scrolls = (opt.scroll || '0').split(',').map(Number)
const browser = await chromium.launch()
for (const mode of modes) {
  const ctx = await browser.newContext({ viewport: { width: 600, height: 932 }, deviceScaleFactor: Number(opt.scale || 2) })
  const page = await ctx.newPage()
  page.on('pageerror', e => console.error('pageerror:', e.message))
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()) })
  await page.goto(pathToFileURL(resolve(page_)).href + '?harness=off')
  await page.evaluate(([m, t]) => { document.documentElement.dataset.mode = m; if (t) document.documentElement.dataset.theme = t }, [mode, opt.theme || ''])
  await page.waitForLoadState('networkidle'); await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.USSHER && window.USSHER.measureChrome && window.USSHER.measureChrome())
  for (const y of scrolls) {
    await page.evaluate(y => { const s = document.querySelector('.ios-scroll'); if (s) s.scrollTop = y }, y)
    if (opt.eval) await page.evaluate(opt.eval)
    if (opt.click) await page.click(opt.click)
    await page.waitForTimeout(500)
    const out = `${prefix}-${mode}-${y}.png`
    await page.locator('body').screenshot({ path: out })
    console.log(out)
  }
  await ctx.close()
}
await browser.close()
