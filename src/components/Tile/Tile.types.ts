export interface TileProps {
  /** Visual header content (image, matchup, logo block, etc.) */
  visual: React.ReactNode
  /** Info section content (text pair, price, button, etc.) */
  info: React.ReactNode
  /** Optional frosted tag overlaid on top-left of visual header */
  tag?: React.ReactNode
  /**
   * When true, the tile itself is the tap target (no inner button).
   * Adds surface-card scale-700 classes for hover/press interaction.
   */
  tappable?: boolean
  /** onClick handler (use only when tappable is true) */
  onClick?: () => void
}
