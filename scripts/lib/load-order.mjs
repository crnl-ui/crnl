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

/**
 * The cascade layers crnl-loader.js declares, and which sheet lands in each.
 *
 * The loader owns this for the same reason it owns the load order: a second
 * copy is a second cascade, and the two would drift the first time a
 * stylesheet moved. Returns { order, layerFor } — `order` is the layer names
 * in precedence order (last wins), `layerFor(filename)` the fully qualified
 * layer a sheet belongs to.
 *
 * Throws rather than guessing. A bundle that put a sheet in the wrong layer
 * would look fine and cascade differently from the local path, which is the
 * worst kind of difference: it only shows up in production.
 */
export function readLayers(loaderPath = LOADER_PATH) {
  const src = readFileSync(loaderPath, 'utf8')
  const block = src.match(/var layers = \[([\s\S]*?)\];/)
  if (!block) {
    throw new Error(
      `load-order: could not find the \`layers\` array in ${loaderPath}. ` +
      'The loader owns the layer map; parsing it is how the bundle stays in step.'
    )
  }
  const entries = [...block[1].matchAll(/\[\s*'([^']+)'\s*,\s*(\d+)\s*\]/g)]
    .map((m) => [m[1], Number(m[2])])
  if (!entries.length) {
    throw new Error(`load-order: the \`layers\` array in ${loaderPath} parsed as empty.`)
  }

  const sheets = readLoadOrder(loaderPath)
  const last = entries[entries.length - 1][1]
  if (last !== sheets.length) {
    throw new Error(
      `load-order: the layer map covers ${last} sheet(s) but crnl-loader.js loads ` +
      `${sheets.length}. Every sheet has to be in a layer, or the bundle and the ` +
      'local path cascade differently.'
    )
  }

  const layerFor = (name) => {
    const i = sheets.indexOf(name)
    if (i < 0) throw new Error(`load-order: ${name} is not in the load order.`)
    for (const [layer, end] of entries) if (i < end) return `crnl.${layer}`
    return `crnl.${entries[entries.length - 1][0]}`
  }

  return { order: entries.map(([n]) => `crnl.${n}`), layerFor }
}
