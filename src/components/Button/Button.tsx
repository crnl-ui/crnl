import type { ButtonProps, CircleButtonProps } from './Button.types'

/* The size prop is the CSS number, so the class is the number. No table:
   a lookup that only renames things is a second vocabulary to keep in step. */
const sizeClass = (size: NonNullable<ButtonProps['size']>) => `btn-${size}`

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

const circleSizeClass = (size: NonNullable<CircleButtonProps['size']>) =>
  `btn-circle-${size}`

export function Button({
  variant,
  size = 700,
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
    sizeClass(size),
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
  size = 700,
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
    circleSizeClass(size)
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
