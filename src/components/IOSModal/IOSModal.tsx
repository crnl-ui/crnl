import { IOSNavButton } from '../IOSNavButton'
import type { IOSModalProps } from './IOSModal.types'

export function IOSModal({
  open,
  onClose,
  title,
  closeIcon = 'close',
  trailingIcon,
  onTrailingAction,
  children
}: IOSModalProps) {
  if (!open) return null

  return (
    <div className="ios-modal-backdrop">
      <div className="ios-modal-stack" />
      <div className="ios-modal-sheet">
        <header className="ios-nav-modal">
          <div className="ios-nav-modal-row">
            <IOSNavButton
              icon={closeIcon}
              onClick={onClose}
              className="ios-nav-page-left"
              aria-label="Close"
            />
            <span className="ios-nav-page-title">{title}</span>
            {trailingIcon && (
              <IOSNavButton
                icon={trailingIcon}
                onClick={onTrailingAction}
                className="ios-nav-page-right"
                aria-label="Action"
              />
            )}
          </div>
        </header>
        <div className="ios-modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}
