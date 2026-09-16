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

export type ButtonSize = 'large' | 'small' | 'xsmall'

export type IconPosition = 'leading' | 'trailing'

export interface ButtonProps {
  /** Visual variant */
  variant: ButtonVariant
  /** Size variant. Default: 'large' */
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
export type CircleButtonSize = 'large' | 'small'

export interface CircleButtonProps {
  /** Visual variant */
  variant: CircleButtonVariant
  /** Size variant. Default: 'large' */
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
