import type { IOSNavButtonProps } from './IOSNavButton.types'

export function IOSNavButton({
  variant = 'glass',
  icon,
  label,
  onClick,
  className,
  ...ariaProps
}: IOSNavButtonProps) {
  const classes = [
    'ios-nav-btn',
    variant === 'glass' ? 'ios-glass' : 'ios-nav-btn-brand',
    className
  ].filter(Boolean).join(' ')

  return (
    <button className={classes} onClick={onClick} {...ariaProps}>
      {variant === 'glass' && icon && (
        <span className="icon">{icon}</span>
      )}
      {variant === 'brand' && label && (
        <span>{label}</span>
      )}
    </button>
  )
}
