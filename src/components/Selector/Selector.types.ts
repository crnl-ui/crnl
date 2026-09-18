/** The surface class, minus the `surface-` prefix — the CSS's own names. */
export type SelectorSurface = 'washNeutral' | 'card'

export interface SelectorProps {
  /** Content (typically a ListRow) */
  children: React.ReactNode
  /** Surface class, minus the `surface-` prefix. 'washNeutral' inside a card;
   *  'card' on the page background. Default: 'washNeutral' */
  surface?: SelectorSurface
  /** Selected state */
  selected?: boolean
  /** Disabled state */
  disabled?: boolean
  /** onClick handler */
  onClick?: () => void
}
