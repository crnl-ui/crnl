/* =============================================================================
   contrast.mjs — WCAG 2.x relative luminance and contrast ratio
   =============================================================================
   The two formulas check.mjs rule 32 uses to hold brand colours to AA against
   their button text. Pulled out so the Figma kit's verification
   (figma-plugin/scripts/verify-button.mjs) can compute the SAME ratio for every
   pair it paints — two copies of a formula are how "passes here, fails there"
   happens. Both accept #RRGGBB; `contrast` returns null when either side is not
   a hex colour, which callers treat as "cannot judge", never as a pass.
   ============================================================================= */

/** WCAG relative luminance of a #RRGGBB colour; null when it is not one. */
export const luminance = hex => {
  const m = /^#([0-9a-f]{6})$/i.exec(String(hex).trim())
  if (!m) return null
  const [r, g, b] = [0, 2, 4]
    .map(i => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Contrast ratio (≥ 1) between two #RRGGBB colours; null when either is not one. */
export const contrast = (a, b) => {
  const [la, lb] = [luminance(a), luminance(b)]
  if (la === null || lb === null) return null
  const [hi, lo] = [la, lb].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
