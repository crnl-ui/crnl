export type TagIconPosition = 'leading' | 'trailing'

export interface TagProps {
  /** Label text */
  children: React.ReactNode
  /** Apply the brand colour tint */
  brandColor?: boolean
  /** Icon name (Material Symbols) */
  icon?: string
  /** Position of the icon */
  iconPosition?: TagIconPosition
}

/** The surface class, minus the `surface-` prefix — the CSS's own names. */
export type ChipSurface = 'borderNeutral' | 'ghost'

export interface ChipProps {
  /** Label text */
  children: React.ReactNode
  /** Surface style */
  surface?: ChipSurface
  /** Apply the brand colour to text */
  brandColor?: boolean
  /** Icon name (Material Symbols) */
  icon?: string
  /** Position of the icon */
  iconPosition?: TagIconPosition
  /** Disabled state */
  disabled?: boolean
  /** onClick handler */
  onClick?: () => void
}
