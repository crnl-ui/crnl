import type { ButtonProps, CircleButtonProps } from './Button.types'

const sizeClass: Record<NonNullable<ButtonProps['size']>, string> = {
  large: 'btn-700',
  small: 'btn-300',
  xsmall: 'btn-100'
}

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  tertiary: 'btn-tertiary',
  transactional: 'btn-transactional',
  neutral: 'btn-neutral',
  destructive: 'btn-destructive',
  white: 'btn-white',
  'white-tertiary': 'btn-white-tertiary',
  black: 'btn-black'
}

const circleSizeClass: Record<NonNullable<CircleButtonProps['size']>, string> = {
  large: 'btn-circle-700',
  small: 'btn-circle-300'
}

export function Button({
  variant,
  size = 'large',
  icon,
  iconPosition = 'leading',
  fill = false,
  disabled = false,
  onClick,
  children,
  type = 'button'
}: ButtonProps) {
  const hasIcon = Boolean(icon)
  const iconOnly = hasIcon && !children

  const classes = [
    'btn',
    variantClass[variant],
    sizeClass[size],
    hasIcon && iconPosition === 'leading' && !iconOnly ? 'btn-icon-leading' : '',
    hasIcon && iconPosition === 'trailing' && !iconOnly ? 'btn-icon-trailing' : '',
    iconOnly ? 'btn-icon-only' : '',
    fill ? 'btn-fill' : ''
  ]
    .filter(Boolean)
    .join(' ')

  const iconEl = icon ? (
    <span className="btn-icon material-symbols-rounded" aria-hidden="true">
      {icon}
    </span>
  ) : null

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {iconPosition === 'leading' && iconEl}
      {children && <span>{children}</span>}
      {iconPosition === 'trailing' && iconEl}
    </button>
  )
}

export function CircleButton({
  variant,
  size = 'large',
  icon,
  disabled = false,
  onClick,
  type = 'button',
  ...ariaProps
}: CircleButtonProps) {
  const classes = [
    'btn',
    'btn-circle',
    variantClass[variant],
    circleSizeClass[size]
  ].join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...ariaProps}
    >
      <span className="btn-icon material-symbols-rounded" aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
