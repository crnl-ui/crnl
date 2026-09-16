export interface IOSNavButtonProps {
  /** 'glass' = frosted glass circle, 'brand' = solid brand color */
  variant?: 'glass' | 'brand'
  /** Material Symbols icon name (for glass variant) */
  icon?: string
  /** Single letter/character (for brand variant) */
  label?: string
  /** onClick handler */
  onClick?: () => void
  /** Accessible label */
  'aria-label'?: string
  /** Additional className */
  className?: string
}
