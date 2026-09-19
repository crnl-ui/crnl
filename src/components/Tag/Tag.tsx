import type { TagProps, ChipProps } from './Tag.types'

export function Tag({ children, brandColor = false, icon, iconPosition = 'leading' }: TagProps) {
  const classes = [
    'tag',
    brandColor ? 'tag-brand-color' : '',
    icon && iconPosition === 'leading' ? 'tag-icon-leading' : '',
    icon && iconPosition === 'trailing' ? 'tag-icon-trailing' : ''
  ]
    .filter(Boolean)
    .join(' ')

  const iconEl = icon ? (
    <span className="material-symbols-rounded" aria-hidden="true">
      {icon}
    </span>
  ) : null

  return (
    <span className={classes}>
      {iconPosition === 'leading' && iconEl}
      {children}
      {iconPosition === 'trailing' && iconEl}
    </span>
  )
}

export function Chip({
  children,
  surface = 'borderNeutral',
  brandColor = false,
  icon,
  iconPosition = 'leading',
  disabled = false,
  onClick
}: ChipProps) {
  const surfaceClass = `surface-${surface}`

  const classes = [
    'chip',
    surfaceClass,
    'scale-300',
    brandColor ? 'chip-brand-color' : '',
    icon && iconPosition === 'leading' ? 'chip-icon-leading' : '',
    icon && iconPosition === 'trailing' ? 'chip-icon-trailing' : '',
    disabled ? 'is-disabled' : ''
  ]
    .filter(Boolean)
    .join(' ')

  const iconEl = icon ? (
    <span className="material-symbols-rounded" aria-hidden="true">
      {icon}
    </span>
  ) : null

  return (
    <button type="button" className={classes} onClick={onClick} disabled={disabled}>
      {iconPosition === 'leading' && iconEl}
      {children}
      {iconPosition === 'trailing' && iconEl}
    </button>
  )
}
