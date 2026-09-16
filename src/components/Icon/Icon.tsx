import type { IconProps } from './Icon.types'

export function Icon({ name, size = 300, outlined = false }: IconProps) {
  const classes = [
    'icon',
    `icon-${size}`,
    outlined ? 'icon-outlined' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} aria-hidden="true">
      {name}
    </span>
  )
}
