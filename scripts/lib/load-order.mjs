/* =============================================================================
   load-order.mjs — the one place that reads the stylesheet load order
   =============================================================================
   crnl-loader.js owns the CSS load order (RULES §1). Anything else that needs the
   list — the bundle builder, the CSS reference —
   parses it from there through this helper rather than keeping a copy.

   A hand-written second copy of the list drifts — stylesheets go missing and
   ordering goes wrong. That is the drift this module exists to make impossible.
   ============================================================================= */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

/** Absolute path to crnl-loader.js — the source of truth. */
export const LOADER_PATH = join(ROOT, 'css', 'crnl-loader.js')

/**
 * The stylesheets crnl-loader.js injects, in order.
 * Throws rather than returning a partial list: every caller either generates
 * markup or enforces a rule, and both are worse than useless if the list is
 * silently short.
 */
export function readLoadOrder(loaderPath = LOADER_PATH) {
  const src = readFileSync(loaderPath, 'utf8')
  const block = src.match(/var sheets = \[([\s\S]*?)\];/)
  if (!block) {
    throw new Error(`could not find the \`sheets\` array in ${loaderPath}`)
  }
  const sheets = [...block[1].matchAll(/'([^']+\.css)'/g)].map(m => m[1])
  if (!sheets.length) {
    throw new Error(`the \`sheets\` array in ${loaderPath} parsed to nothing`)
  }
  return sheets
}
