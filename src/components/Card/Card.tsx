import type { CardClosedProps, CardOpenProps, CardSectionProps } from './Card.types'

export function CardClosed({ header, body, footer, interactive = false, onClick }: CardClosedProps) {
  const baseClass = interactive ? 'card-closed-interactive' : 'card-closed'
  return (
    <div className={baseClass} onClick={onClick} role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : undefined}>
      {header && <div className="card-closed-header">{header}</div>}
      {body && <div className="card-closed-body">{body}</div>}
      {footer && <div className="card-closed-footer">{footer}</div>}
    </div>
  )
}

export function CardOpen({ header, sections }: CardOpenProps) {
  return (
    <div className="card-open">
      {header && <div className="card-open-header">{header}</div>}
      <div className="card-open-content">
        {sections.map((section, i) => (
          <div key={i} className="card-open-section">
            {section}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSection({ children, interactive = false, onClick }: CardSectionProps) {
  const baseClass = interactive ? 'card-open-section-interactive' : 'card-open-section'
  return (
    <div className={baseClass} onClick={onClick} role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : undefined}>
      {children}
    </div>
  )
}
