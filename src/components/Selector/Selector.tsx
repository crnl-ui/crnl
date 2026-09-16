import type { SelectorProps } from './Selector.types'

export function Selector({
  children,
  surface = 'wash',
  selected = false,
  disabled = false,
  onClick
}: SelectorProps) {
  const surfaceClass = surface === 'wash' ? 'surface-washNeutral' : 'surface-card'

  const classes = [
    'selector',
    surfaceClass,
    'scale-700',
    selected ? 'is-selected' : '',
    disabled ? 'is-disabled' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? undefined : 0}
      aria-selected={selected}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {children}
    </div>
  )
}
