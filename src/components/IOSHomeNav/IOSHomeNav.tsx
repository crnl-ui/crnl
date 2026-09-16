import { Fragment } from 'react'
import { IOSNavButton } from '../IOSNavButton'
import type { IOSHomeNavProps } from './IOSHomeNav.types'

export function IOSHomeNav({
  title,
  showNotification = true,
  onNotification,
  avatarLabel,
  onAvatar,
  subtabs,
  activeSubtab = 0,
  onSubtabChange,
  children
}: IOSHomeNavProps) {
  return (
    <>
      <header className="ios-nav-maintab">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 44 }}>
          <span className="display500">{title}</span>
          {children ?? (
            <div className="ios-nav-controls">
              {showNotification && (
                <IOSNavButton variant="glass" icon="notifications" onClick={onNotification} aria-label="Notifications" />
              )}
              {avatarLabel && (
                <IOSNavButton variant="brand" label={avatarLabel} onClick={onAvatar} aria-label="Profile" />
              )}
            </div>
          )}
        </div>
      </header>
      {subtabs && subtabs.length > 0 && (
        <div className="ios-nav-subtabs-container">
          <div className="ios-nav-subtabs ios-glass">
            {subtabs.map((label, i) => (
              <Fragment key={label}>
                {i > 0 && <div className="ios-nav-subtab-sep" />}
                <button
                  className={`ios-nav-subtab${i === activeSubtab ? ' is-active' : ''}`}
                  onClick={() => onSubtabChange?.(i)}
                >
                  {label}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

