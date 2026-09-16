import type { EventRowProps } from './EventRow.types'

export function EventRow({
  opponentLogo,
  opponentName,
  date,
  state,
  featuredPrice,
  offerCount,
  onTopClick,
  onBottomClick
}: EventRowProps) {
  const topInteractive = state === 'featured-only' || state === 'featured-and-others'
  const bottomInteractive = state === 'featured-and-others' || state === 'no-featured-offers'

  const topClass = ['event-row-top', topInteractive ? 'surface-section' : '']
    .filter(Boolean)
    .join(' ')

  const bottomClass = ['event-row-bottom', bottomInteractive ? 'surface-section' : '']
    .filter(Boolean)
    .join(' ')

  const renderTopTrailing = () => {
    if (state === 'featured-only' || state === 'featured-and-others') {
      return (
        <div className="trailing trailing-gap-lg">
          <button type="button" className="btn btn-primary btn-100" onClick={onTopClick}>
            {featuredPrice}
          </button>
        </div>
      )
    }
    if (state === 'sold-out') {
      return (
        <div className="trailing trailing-gap-sm">
          <span className="labelBold30 text-secondary">Sold Out</span>
        </div>
      )
    }
    if (state === 'coming-soon') {
      return (
        <div className="trailing trailing-gap-sm">
          <span className="labelBold20 text-interactive-tertiary event-row-coming-soon">
            Coming Soon
          </span>
        </div>
      )
    }
    return null
  }

  const showBottom = state === 'featured-and-others' || state === 'no-featured-offers'
  const bottomLabel =
    state === 'featured-and-others'
      ? `${offerCount ?? 0} Additional Offer${(offerCount ?? 0) !== 1 ? 's' : ''}`
      : `${offerCount ?? 0} Offer${(offerCount ?? 0) !== 1 ? 's' : ''} Available`

  return (
    <div className="event-row">
      <div className={topClass}>
        <div className={`list-row${!topInteractive ? ' not-tappable' : ''}`} onClick={topInteractive ? onTopClick : undefined}>
          <div className="leading leading-gap-sm">
            <img className="event-row-logo" src={opponentLogo} alt={opponentName} />
          </div>
          <div className="list-row-content">
            <div className="list-row-text-pair">
              <span className="event-row-label">{opponentName}</span>
              <span className="event-row-sublabel text-secondary">{date}</span>
            </div>
          </div>
          {renderTopTrailing()}
        </div>
      </div>

      {showBottom && (
        <div className={bottomClass} onClick={bottomInteractive ? onBottomClick : undefined}>
          <div className="list-row">
            <div className="list-row-content">
              <div className="list-row-text-pair">
                <span className="labelBold30 text-interactive-tertiary">{bottomLabel}</span>
              </div>
            </div>
            <div className="trailing trailing-gap-xs">
              <span className="icon icon-200" aria-hidden="true">arrow_drop_down</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
