import type { TileProps } from './Tile.types'

export function Tile({ visual, info, tag, tappable = false, onClick }: TileProps) {
  const classes = [
    'tile',
    tappable ? 'surface-card scale-700' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      onClick={tappable ? onClick : undefined}
      role={tappable ? 'button' : undefined}
      tabIndex={tappable ? 0 : undefined}
      onKeyDown={tappable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      } : undefined}
    >
      {visual}
      {tag && <div className="tile-tag">{tag}</div>}
      <div className="tile-info">{info}</div>
    </div>
  )
}
