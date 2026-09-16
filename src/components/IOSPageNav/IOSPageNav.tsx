import { IOSNavButton } from '../IOSNavButton'
import type { IOSPageNavProps } from './IOSPageNav.types'

export function IOSPageNav({
  title,
  onBack,
  backIcon = 'arrow_back',
  trailingIcon,
  onTrailingAction
}: IOSPageNavProps) {
  return (
    <header className="ios-nav-page">
      <div className="ios-nav-page-row">
        <IOSNavButton
          variant="glass"
          icon={backIcon}
          onClick={onBack}
          className="ios-nav-page-left"
          aria-label="Back"
        />
        <span className="ios-nav-page-title">{title}</span>
        {trailingIcon && (
          <IOSNavButton
            variant="glass"
            icon={trailingIcon}
            onClick={onTrailingAction}
            className="ios-nav-page-right"
            aria-label="Action"
          />
        )}
      </div>
    </header>
  )
}
