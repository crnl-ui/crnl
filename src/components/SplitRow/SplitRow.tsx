import type { SplitRowProps, SplitRowListProps } from './SplitRow.types'

/**
 * A card of two independently tappable bands (`css/list-row-components.css`).
 *
 * The component supplies structure, never copy: every string on screen is a
 * prop resolved from a record (RULES §6). Which band is interactive is the
 * caller's decision, expressed by `topInteractive` / `bottomInteractive` —
 * an inert band carries no surface class and paints nothing at rest.
 */
export function SplitRow({
  markUrl,
  markAlt,
  title,
  subtitle,
  trailing,
  bottom,
  topInteractive = false,
  bottomInteractive = false,
  onTopClick,
  onBottomClick
}: SplitRowProps) {
  const topClass = topInteractive ? 'split-row-top surface-section' : 'split-row-top'
  const bottomClass = bottomInteractive
    ? 'split-row-bottom surface-section'
    : 'split-row-bottom'

  return (
    <div className="split-row">
      <div className={topClass} onClick={topInteractive ? onTopClick : undefined}>
        <div className={topInteractive ? 'list-row' : 'list-row not-tappable'}>
          {markUrl && (
            <div className="leading leading-gap-sm">
              <img className="split-row-logo" src={markUrl} alt={markAlt ?? ''} />
            </div>
          )}
          <div className="list-row-content">
            <div className="list-row-text-pair">
              <span className="title50-r">{title}</span>
              {subtitle && <span className="labelRegular20-r text-secondary">{subtitle}</span>}
            </div>
          </div>
          {trailing && <div className="trailing trailing-gap-lg">{trailing}</div>}
        </div>
      </div>

      {bottom && (
        <div
          className={bottomClass}
          onClick={bottomInteractive ? onBottomClick : undefined}
        >
          {bottom}
        </div>
      )}
    </div>
  )
}

/** Stacks split rows at the system gap and max-width. */
export function SplitRowList({ children }: SplitRowListProps) {
  return <div className="split-row-list">{children}</div>
}
