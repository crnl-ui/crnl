export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'transactional'
  | 'neutral'
  | 'destructive'
  | 'white'
  | 'white-tertiary'
  | 'black'

/**
 * The CSS names the sizes, so these are the CSS names. `.btn-700` is 700 —
 * not "large", which is a second vocabulary for the same three values and
 * means learning the system twice. See docs/roadmap.md § gap 3.
 */
export type ButtonSize = 700 | 300 | 100

export type IconPosition = 'leading' | 'trailing'

export interface ButtonProps {
  /** Visual variant */
  variant: ButtonVariant
  /** Size, by the CSS number: 700 · 300 · 100. Default: 700 */
  size?: ButtonSize
  /** Material Symbols icon name */
  icon?: string
  /** Position of the icon relative to label */
  iconPosition?: IconPosition
  /** Expand to fill parent container width */
  fill?: boolean
  /** Disabled state */
  disabled?: boolean
  /** onClick handler */
  onClick?: () => void
  /** Button label */
  children?: React.ReactNode
  /** HTML button type attribute */
  type?: 'button' | 'submit' | 'reset'
}

export type CircleButtonVariant = ButtonVariant
export type CircleButtonSize = 700 | 300

export interface CircleButtonProps {
  /** Visual variant */
  variant: CircleButtonVariant
  /** Size, by the CSS number: 700 · 300 · 100. Default: 700 */
  size?: CircleButtonSize
  /** Material Symbols icon name */
  icon: string
  /** Disabled state */
  disabled?: boolean
  /** onClick handler */
  onClick?: () => void
  /** Accessible label (required since no visible text) */
  'aria-label': string
  /** HTML button type attribute */
  type?: 'button' | 'submit' | 'reset'
}
